"use client";

import { useMemo, useState } from "react";

type Severity = "error" | "warning";

type Diagnostic = {
  severity: Severity;
  code: string;
  message: string;
  condition?: string;
};

type ParsedCondition = {
  raw: string;
  validShape: boolean;
  fid: number | string | null;
  operator: string | null;
  operatorMeaning: string | null;
  operatorKnown: boolean;
  rawValue: string | null;
  valueType:
    | "static"
    | "jinja"
    | "field-reference"
    | "unsupported-jinja-statement";
  jinja: JinjaExpression[];
};

type JinjaExpression = {
  raw: string;
  expression: string;
  analysis: {
    stepReferences: string[];
    fieldReferences: string[];
    runtimeReferences: string[];
    contextReferences: string[];
    timeReferences: string[];
    hasPrev: boolean;
    hasClear: boolean;
    hasRaiseError: boolean;
  };
};

type JinjaStatement = {
  raw: string;
  body: string;
  keyword: string;
};

type JinjaComment = {
  raw: string;
  comment: string;
};

type QueryDiagnostic = {
  generatedAt: string;
  source: string;
  input: string;
  detectedLanguage:
    | "Hybrid Pipeline Advanced Query"
    | "Quickbase Query"
    | "Pipelines Jinja"
    | "Unknown / Plain Text";
  conditions: ParsedCondition[];
  connectors: Array<string | null>;
  jinjaExpressions: JinjaExpression[];
  jinjaStatements: JinjaStatement[];
  jinjaComments: JinjaComment[];
  diagnostics: Diagnostic[];
  overall:
    | "Invalid / Fix Required"
    | "Review Recommended"
    | "Valid Hybrid Query"
    | "Valid Query"
    | "Recognized Jinja"
    | "Review Input";
};

const OPERATOR_DEFS: Record<
  string,
  { label: string; families: string[] }
> = {
  EX: { label: "Equals exactly", families: ["all"] },
  XEX: { label: "Not equal", families: ["all"] },
  CT: { label: "Contains substring", families: ["text"] },
  SW: { label: "Starts with", families: ["text"] },
  BF: { label: "Before", families: ["date"] },
  AF: { label: "After", families: ["date"] },
  OAF: { label: "On or after", families: ["date"] },
  LT: { label: "Less than", families: ["numeric", "date"] },
  LTE: { label: "Less than or equal", families: ["numeric", "date"] },
  GT: { label: "Greater than", families: ["numeric", "date"] },
  GTE: { label: "Greater than or equal", families: ["numeric", "date"] },
  HAS: { label: "Contains a value", families: ["multi"] },
  IR: { label: "In relative date range", families: ["date"] },
};

const DEFAULT_INPUT =
  "({6.EX.'Alice'}OR{6.EX.'Bob'})AND{7.GTE.'18'}";

const EXAMPLES = [
  {
    label: "Static Query",
    value: "{6.EX.'Alice'}",
  },
  {
    label: "Grouped Query",
    value: "({6.EX.'Alice'}OR{6.EX.'Bob'})AND{7.GTE.'18'}",
  },
  {
    label: "Hybrid Query + Jinja",
    value: "{6.EX.'{{a.customer_id}}'}",
  },
  {
    label: "Time Helper",
    value: "{2.OAF.'{{time.now + time.delta(minutes=-5)}}'}",
  },
  {
    label: "Pure Jinja",
    value: "{{a.name | upper}}",
  },
  {
    label: "Bad $prev Query",
    value: "{6.EX.'{{a.$prev.status}}'}",
  },
  {
    label: "Bad Jinja Statement",
    value: "{6.EX.'{% if a.status %}Open{% endif %}'}",
  },
  {
    label: "Broken Query",
    value: "{6.EX.'Alice'}AND{7.GTE.'18'",
  },
];

function safeValue(value: unknown) {
  return value === undefined || value === null || value === ""
    ? "Not returned"
    : String(value);
}

function scanQueryConditions(input: string) {
  const conditions: Array<{ raw: string; start: number; end: number }> = [];
  const connectors: Array<string | null> = [];
  let i = 0;

  while (i < input.length) {
    if (input[i] === "{" && input[i + 1] === "%") {
      const close = input.indexOf("%}", i + 2);
      i = close >= 0 ? close + 2 : i + 2;
      continue;
    }

    if (input[i] === "{" && input[i + 1] === "#") {
      const close = input.indexOf("#}", i + 2);
      i = close >= 0 ? close + 2 : i + 2;
      continue;
    }

    if (input[i] === "{" && input[i + 1] === "{") {
      const close = input.indexOf("}}", i + 2);
      i = close >= 0 ? close + 2 : i + 2;
      continue;
    }

    if (input[i] === "{") {
      const start = i;
      let quote: string | null = null;
      let jinjaExprDepth = 0;
      let jinjaStmtDepth = 0;
      let end = -1;

      i += 1;

      while (i < input.length) {
        const ch = input[i];

        if (
          (ch === "'" || ch === '"') &&
          input[i - 1] !== "\\"
        ) {
          quote = quote === ch ? null : quote || ch;
        }

        if (ch === "{" && input[i + 1] === "{") {
          jinjaExprDepth += 1;
          i += 2;
          continue;
        }

        if (
          ch === "}" &&
          input[i + 1] === "}" &&
          jinjaExprDepth > 0
        ) {
          jinjaExprDepth -= 1;
          i += 2;
          continue;
        }

        if (ch === "{" && input[i + 1] === "%") {
          jinjaStmtDepth += 1;
          i += 2;
          continue;
        }

        if (
          ch === "%" &&
          input[i + 1] === "}" &&
          jinjaStmtDepth > 0
        ) {
          jinjaStmtDepth -= 1;
          i += 2;
          continue;
        }

        if (
          ch === "}" &&
          !quote &&
          jinjaExprDepth === 0 &&
          jinjaStmtDepth === 0
        ) {
          end = i;
          break;
        }

        i += 1;
      }

      if (end >= 0) {
        conditions.push({
          raw: input.slice(start, end + 1),
          start,
          end,
        });

        i = end + 1;
        continue;
      }
    }

    i += 1;
  }

  for (let x = 0; x < conditions.length - 1; x += 1) {
    const between = input.slice(
      conditions[x].end + 1,
      conditions[x + 1].start,
    );
    const match = between.match(/\b(AND|OR)\b/i);
    connectors.push(match ? match[1].toUpperCase() : null);
  }

  return { conditions, connectors };
}

function parseCondition(raw: string) {
  const inner = raw.slice(1, -1);
  const firstDot = inner.indexOf(".");
  const secondDot = inner.indexOf(".", firstDot + 1);

  if (firstDot < 1 || secondDot < 0) {
    return {
      raw,
      validShape: false,
      fid: null,
      operator: null,
      rawValue: null,
    };
  }

  const fidText = inner.slice(0, firstDot).trim();
  const operator = inner
    .slice(firstDot + 1, secondDot)
    .trim()
    .toUpperCase();

  let rawValue = inner.slice(secondDot + 1).trim();

  if (
    (rawValue.startsWith("'") && rawValue.endsWith("'")) ||
    (rawValue.startsWith('"') && rawValue.endsWith('"'))
  ) {
    rawValue = rawValue.slice(1, -1);
  }

  return {
    raw,
    validShape: /^\d+$/.test(fidText) && /^[A-Z]+$/.test(operator),
    fid: /^\d+$/.test(fidText) ? Number(fidText) : fidText,
    operator,
    rawValue,
  };
}

function extractJinjaExpressions(text: string): JinjaExpression[] {
  const expressions: JinjaExpression[] = [];
  const regex = /\{\{\s*([\s\S]*?)\s*\}\}/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text))) {
    expressions.push({
      raw: match[0],
      expression: match[1].trim(),
      analysis: classifyJinjaExpression(match[1].trim()),
    });
  }

  return expressions;
}

function extractJinjaStatements(text: string): JinjaStatement[] {
  const statements: JinjaStatement[] = [];
  const regex = /\{%\s*([\s\S]*?)\s*%\}/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text))) {
    const body = match[1].trim();
    const keyword =
      body.match(/^([A-Za-z_][A-Za-z0-9_]*)/)?.[1] || "unknown";

    statements.push({
      raw: match[0],
      body,
      keyword,
    });
  }

  return statements;
}

function extractJinjaComments(text: string): JinjaComment[] {
  const comments: JinjaComment[] = [];
  const regex = /\{#\s*([\s\S]*?)\s*#\}/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text))) {
    comments.push({
      raw: match[0],
      comment: match[1].trim(),
    });
  }

  return comments;
}

function classifyJinjaExpression(expression: string) {
  const info = {
    stepReferences: [] as string[],
    fieldReferences: [] as string[],
    runtimeReferences: [] as string[],
    contextReferences: [] as string[],
    timeReferences: [] as string[],
    hasPrev: /\.\$prev\./.test(expression),
    hasClear: /\bCLEAR\b/.test(expression),
    hasRaiseError: /\braise_error\s*\(/.test(expression),
  };

  const stepDot = /\b([a-z])\.([A-Za-z_][A-Za-z0-9_]*)\b/g;
  let match: RegExpExecArray | null;

  while ((match = stepDot.exec(expression))) {
    const step = match[1];
    const field = match[2];

    if (!["time", "runtime"].includes(step)) {
      info.stepReferences.push(step);
      info.fieldReferences.push(`${step}.${field}`);
    }
  }

  const stepBracket = /\b([a-z])\[['"]([^'"]+)['"]\]/g;

  while ((match = stepBracket.exec(expression))) {
    info.stepReferences.push(match[1]);
    info.fieldReferences.push(`${match[1]}['${match[2]}']`);
  }

  const runtime = /\bruntime\.([A-Za-z_][A-Za-z0-9_]*)/g;

  while ((match = runtime.exec(expression))) {
    info.runtimeReferences.push(match[1]);
  }

  const context =
    /\b([a-z])\.context\.([A-Za-z_][A-Za-z0-9_]*)/g;

  while ((match = context.exec(expression))) {
    info.contextReferences.push(
      `${match[1]}.context.${match[2]}`,
    );
  }

  const time = /\btime\.(now|today|delta|parse)\b/g;

  while ((match = time.exec(expression))) {
    info.timeReferences.push(match[1]);
  }

  info.stepReferences = [...new Set(info.stepReferences)];
  info.fieldReferences = [...new Set(info.fieldReferences)];
  info.runtimeReferences = [...new Set(info.runtimeReferences)];
  info.contextReferences = [...new Set(info.contextReferences)];
  info.timeReferences = [...new Set(info.timeReferences)];

  return info;
}

function classifyConditionValue(
  rawValue: string | null,
): ParsedCondition["valueType"] {
  const value = String(rawValue || "");

  if (/\{%\s*[\s\S]*?%\}/.test(value)) {
    return "unsupported-jinja-statement";
  }

  if (/\{\{\s*[\s\S]*?\s*\}\}/.test(value)) {
    return "jinja";
  }

  if (/^_FID_\d+$/i.test(value)) {
    return "field-reference";
  }

  return "static";
}

function detectLanguage(
  conditions: ParsedCondition[],
  expressions: JinjaExpression[],
  statements: JinjaStatement[],
): QueryDiagnostic["detectedLanguage"] {
  const hasQuery = conditions.length > 0;
  const hasJinja = expressions.length > 0 || statements.length > 0;

  if (hasQuery && hasJinja) {
    return "Hybrid Pipeline Advanced Query";
  }

  if (hasQuery) return "Quickbase Query";
  if (hasJinja) return "Pipelines Jinja";

  return "Unknown / Plain Text";
}

function findQueryStructuralIssues(
  input: string,
  scan: ReturnType<typeof scanQueryConditions>,
): Diagnostic[] {
  const issues: Diagnostic[] = [];
  let residual = input;

  for (const condition of [...scan.conditions].sort(
    (a, b) => b.start - a.start,
  )) {
    residual =
      residual.slice(0, condition.start) +
      " ".repeat(condition.end - condition.start + 1) +
      residual.slice(condition.end + 1);
  }

  residual = residual
    .replace(/\{\{[\s\S]*?\}\}/g, "")
    .replace(/\{%[\s\S]*?%\}/g, "")
    .replace(/\{#[\s\S]*?#\}/g, "");

  const looksQueryLike =
    scan.conditions.length > 0 ||
    /\{\s*\d+\s*\.[A-Za-z]+\s*\./.test(input);

  if (!looksQueryLike) return issues;

  if (residual.includes("{") || residual.includes("}")) {
    issues.push({
      severity: "error",
      code: "UNTERMINATED_QUERY_CONDITION",
      message:
        "The input contains an opening or closing query brace that was not part of a complete {fid.OPERATOR.'matching_value'} condition. Check for a missing { or }.",
    });
  }

  const allowedRemainder = residual
    .replace(/\bAND\b|\bOR\b/gi, "")
    .replace(/[()\s]/g, "");

  if (allowedRemainder.length > 0) {
    issues.push({
      severity: "error",
      code: "UNPARSED_QUERY_CONTENT",
      message:
        `Part of the input could not be reconciled with complete Quickbase conditions, AND/OR connectors, or grouping parentheses: ${allowedRemainder}`,
    });
  }

  return issues;
}

function analyzeInput(
  input: string,
  generatedAt = new Date().toISOString(),
): QueryDiagnostic {
  const trimmed = input.trim();
  const scan = scanQueryConditions(trimmed);

  const conditions: ParsedCondition[] = scan.conditions.map(
    (condition) => {
      const parsed = parseCondition(condition.raw);
      const operatorDef = parsed.operator
        ? OPERATOR_DEFS[parsed.operator]
        : undefined;

      const jinja = extractJinjaExpressions(parsed.rawValue || "");

      return {
        ...parsed,
        operatorMeaning: operatorDef?.label || null,
        operatorKnown: Boolean(operatorDef),
        valueType: classifyConditionValue(parsed.rawValue),
        jinja,
      };
    },
  );

  const jinjaExpressions = extractJinjaExpressions(trimmed);
  const jinjaStatements = extractJinjaStatements(trimmed);
  const jinjaComments = extractJinjaComments(trimmed);
  const diagnostics: Diagnostic[] = [];

  diagnostics.push(...findQueryStructuralIssues(trimmed, scan));

  if (conditions.length) {
    for (const condition of conditions) {
      if (!condition.validShape) {
        diagnostics.push({
          severity: "error",
          code: "QUERY_SHAPE",
          message:
            "Condition does not match {fid.OPERATOR.'matching_value'} structure.",
          condition: condition.raw,
        });
      }

      if (!condition.operatorKnown) {
        diagnostics.push({
          severity: "warning",
          code: "UNKNOWN_OPERATOR",
          message:
            `Operator ${safeValue(condition.operator)} is not in this Workbench's current documented operator set.`,
          condition: condition.raw,
        });
      }

      if (
        /\{%\s*[\s\S]*?%\}/.test(condition.rawValue || "")
      ) {
        diagnostics.push({
          severity: "error",
          code: "JINJA_STATEMENT_IN_QUERY",
          message:
            "Quickbase Pipelines Advanced Query values should use a single {{ ... }} Jinja expression; {% ... %} statements are not supported inside the query string.",
          condition: condition.raw,
        });
      }

      for (const jinja of condition.jinja) {
        if (jinja.analysis.hasPrev) {
          diagnostics.push({
            severity: "error",
            code: "PREV_IN_ADVANCED_QUERY",
            message:
              "$prev is available on Record Updated trigger expressions but is not supported inside Quickbase Advanced Query filter strings.",
            condition: condition.raw,
          });
        }
      }
    }

    if (
      scan.connectors.some((connector) => connector === null) &&
      conditions.length > 1
    ) {
      diagnostics.push({
        severity: "warning",
        code: "MISSING_CONNECTOR",
        message:
          "Multiple query conditions were detected without a clear AND or OR between every condition.",
      });
    }
  }

  if (/\{%\s*(break|continue)\b/i.test(trimmed)) {
    diagnostics.push({
      severity: "error",
      code: "UNSUPPORTED_LOOP_CONTROL",
      message:
        "Quickbase Pipelines Jinja does not support {% break %} or {% continue %}. Use select/reject filters or guard the loop body with an if statement.",
    });
  }

  if (/\{%\s*(include|import|extends)\b/i.test(trimmed)) {
    diagnostics.push({
      severity: "error",
      code: "UNSUPPORTED_TEMPLATE_FEATURE",
      message:
        "Quickbase Pipelines does not support include, import, or extends template inheritance.",
    });
  }

  if (/\{%\s*do\b/i.test(trimmed)) {
    diagnostics.push({
      severity: "error",
      code: "UNSUPPORTED_DO_EXTENSION",
      message:
        "Quickbase Pipelines does not support the Jinja do extension.",
    });
  }

  const detectedLanguage = detectLanguage(
    conditions,
    jinjaExpressions,
    jinjaStatements,
  );

  const errors = diagnostics.filter(
    (diagnostic) => diagnostic.severity === "error",
  ).length;

  const warnings = diagnostics.filter(
    (diagnostic) => diagnostic.severity === "warning",
  ).length;

  let overall: QueryDiagnostic["overall"] = "Review Input";

  if (errors) {
    overall = "Invalid / Fix Required";
  } else if (warnings) {
    overall = "Review Recommended";
  } else if (
    detectedLanguage === "Hybrid Pipeline Advanced Query"
  ) {
    overall = "Valid Hybrid Query";
  } else if (detectedLanguage === "Quickbase Query") {
    overall = "Valid Query";
  } else if (detectedLanguage === "Pipelines Jinja") {
    overall = "Recognized Jinja";
  }

  return {
    generatedAt,
    source: "Public Schema-Free Workbench",
    input: trimmed,
    detectedLanguage,
    conditions,
    connectors: scan.connectors,
    jinjaExpressions,
    jinjaStatements,
    jinjaComments,
    diagnostics,
    overall,
  };
}

function summarizeCondition(condition: ParsedCondition) {
  const field = `FID ${safeValue(condition.fid)}`;
  const operator =
    condition.operatorMeaning ||
    condition.operator ||
    "Unknown operator";

  let value = safeValue(condition.rawValue);

  if (condition.valueType === "jinja") {
    value = `Jinja value ${value}`;
  }

  if (
    condition.valueType === "unsupported-jinja-statement"
  ) {
    value = `unsupported Jinja statement ${value}`;
  }

  if (condition.valueType === "field-reference") {
    value = `field reference ${value}`;
  }

  return `${field} ${operator.toLowerCase()} ${value}`;
}

function buildQueryStructure(diagnostic: QueryDiagnostic) {
  if (!diagnostic.conditions.length) return null;

  let structure = diagnostic.input;
  let plain = diagnostic.input;

  diagnostic.conditions.forEach((condition, index) => {
    structure = structure.replace(
      condition.raw,
      `[Condition ${index + 1}]`,
    );

    plain = plain.replace(
      condition.raw,
      `[${summarizeCondition(condition)}]`,
    );
  });

  const connectors = diagnostic.connectors.map(
    (connector, index) =>
      `${index + 1} → ${connector || "Not detected"}`,
  );

  return {
    structure,
    plain,
    connectors,
  };
}

function buildWorkbenchReport(diagnostic: QueryDiagnostic) {
  const lines: string[] = [];
  const structure = buildQueryStructure(diagnostic);

  lines.push("QUICKBASE REST-API UTILITIES");
  lines.push("QUERY & JINJA WORKBENCH — PUBLIC TESTER");
  lines.push("=".repeat(76));
  lines.push("");
  lines.push(`Generated: ${diagnostic.generatedAt}`);
  lines.push(`Source: ${diagnostic.source}`);
  lines.push("");
  lines.push("MODE");
  lines.push("-".repeat(76));
  lines.push(
    "Schema-free public parser/linter. No Quickbase app connection is required.",
  );
  lines.push(
    "FIDs are analyzed as numeric identifiers only; field names/types are not resolved in this public version.",
  );
  lines.push("");
  lines.push("INPUT");
  lines.push("-".repeat(76));
  lines.push(diagnostic.input || "");
  lines.push("");
  lines.push("LANGUAGE DETECTION");
  lines.push("-".repeat(76));
  lines.push(`Detected: ${diagnostic.detectedLanguage}`);
  lines.push(
    `Quickbase Query: ${
      diagnostic.detectedLanguage.includes("Quickbase") ||
      diagnostic.detectedLanguage.includes("Hybrid")
        ? "YES"
        : "NO"
    }`,
  );
  lines.push(
    `Pipelines Jinja: ${
      diagnostic.detectedLanguage.includes("Jinja") ||
      diagnostic.detectedLanguage.includes("Hybrid")
        ? "YES"
        : "NO"
    }`,
  );
  lines.push("");
  lines.push("PARSED QUERY");
  lines.push("-".repeat(76));

  if (!diagnostic.conditions.length) {
    lines.push("No Quickbase query conditions parsed.");
  }

  diagnostic.conditions.forEach((condition, index) => {
    lines.push(`Condition ${index + 1}`);
    lines.push(`  Raw: ${condition.raw}`);
    lines.push(`  FID: ${safeValue(condition.fid)}`);
    lines.push(
      "  Field: Schema-free mode — field name/type not resolved",
    );
    lines.push(
      `  Operator: ${safeValue(condition.operator)}${
        condition.operatorMeaning
          ? ` — ${condition.operatorMeaning}`
          : ""
      }`,
    );
    lines.push(
      `  Matching Value: ${safeValue(condition.rawValue)}`,
    );
    lines.push(`  Value Type: ${condition.valueType}`);
    lines.push("");
  });

  if (structure) {
    lines.push("QUERY STRUCTURE");
    lines.push("-".repeat(76));
    lines.push(structure.structure);
    lines.push("");
    lines.push(
      `Connectors: ${structure.connectors.join(" | ") || "None"}`,
    );
    lines.push("");
    lines.push("PLAIN-LANGUAGE LOGIC");
    lines.push("-".repeat(76));
    lines.push(structure.plain);
    lines.push("");
  }

  lines.push("JINJA ANALYSIS");
  lines.push("-".repeat(76));

  if (!diagnostic.jinjaExpressions.length) {
    lines.push("No {{ ... }} Jinja expressions detected.");
  }

  diagnostic.jinjaExpressions.forEach((jinja, index) => {
    const analysis = jinja.analysis;

    lines.push(`Expression ${index + 1}: ${jinja.raw}`);
    lines.push(
      `  Step References: ${
        analysis.stepReferences.join(", ") || "None"
      }`,
    );
    lines.push(
      `  Field References: ${
        analysis.fieldReferences.join(", ") || "None"
      }`,
    );
    lines.push(
      `  Context References: ${
        analysis.contextReferences.join(", ") || "None"
      }`,
    );
    lines.push(
      `  Runtime References: ${
        analysis.runtimeReferences.join(", ") || "None"
      }`,
    );
    lines.push(
      `  Time Helpers: ${
        analysis.timeReferences.join(", ") || "None"
      }`,
    );
    lines.push(`  $prev: ${analysis.hasPrev ? "Detected" : "No"}`);
    lines.push("");
  });

  if (diagnostic.jinjaStatements.length) {
    lines.push("JINJA STATEMENTS");
    lines.push("-".repeat(76));

    diagnostic.jinjaStatements.forEach((statement, index) => {
      lines.push(`Statement ${index + 1}: ${statement.raw}`);
      lines.push(`  Keyword: ${statement.keyword}`);
      lines.push(`  Body: ${statement.body}`);
      lines.push("");
    });
  }

  if (diagnostic.jinjaComments.length) {
    lines.push("JINJA COMMENTS");
    lines.push("-".repeat(76));

    diagnostic.jinjaComments.forEach((comment, index) => {
      lines.push(`Comment ${index + 1}: ${comment.raw}`);
      lines.push(`  Text: ${comment.comment || "Empty comment"}`);
      lines.push("");
    });
  }

  lines.push("VALIDATION");
  lines.push("-".repeat(76));

  if (!diagnostic.diagnostics.length) {
    lines.push(
      "🟢 No diagnostics triggered by the current Workbench rules.",
    );
  } else {
    diagnostic.diagnostics.forEach((item) => {
      const icon = item.severity === "error" ? "🔴" : "🟠";
      lines.push(`${icon} ${item.code}: ${item.message}`);
    });
  }

  lines.push("");
  lines.push("OVERALL");
  lines.push("-".repeat(76));
  lines.push(diagnostic.overall);

  return lines.join("\n");
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export default function QueryJinjaWorkbenchPage() {
  const [input, setInput] = useState(DEFAULT_INPUT);
  const [diagnostic, setDiagnostic] = useState<QueryDiagnostic>(() =>
    analyzeInput(DEFAULT_INPUT, "Initial example"),
  );
  const [copyMessage, setCopyMessage] = useState("");

  const structure = useMemo(
    () => buildQueryStructure(diagnostic),
    [diagnostic],
  );

  const report = useMemo(
    () => buildWorkbenchReport(diagnostic),
    [diagnostic],
  );

  const diagnosticJson = useMemo(
    () => JSON.stringify(diagnostic, null, 2),
    [diagnostic],
  );

  const errorCount = diagnostic.diagnostics.filter(
    (item) => item.severity === "error",
  ).length;

  const warningCount = diagnostic.diagnostics.filter(
    (item) => item.severity === "warning",
  ).length;

  const runAnalysis = () => {
    setDiagnostic(analyzeInput(input));
    setCopyMessage("");
  };

  const handleCopy = async (
    text: string,
    successMessage: string,
  ) => {
    const copied = await copyText(text);
    setCopyMessage(
      copied
        ? successMessage
        : "Clipboard access failed. Select the text and copy it manually.",
    );
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-800">
      <section className="bg-[#1f5c99] text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-blue-100">
            Quickbase REST-API Utilities
          </p>

          <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl lg:text-5xl">
            Query &amp; Jinja Workbench
          </h1>

          <p className="mt-4 max-w-4xl text-lg leading-8 text-blue-50">
            Public schema-free tester for Quickbase Advanced Query
            syntax, Pipelines Jinja, and hybrid query/Jinja expressions.
            Try a good expression. Try a terrible expression. See if you
            can break it.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/20 bg-white/10 p-4">
              <div className="text-xs font-extrabold uppercase tracking-wider text-blue-100">
                Quickbase Login
              </div>
              <div className="mt-1 font-bold">Not required</div>
            </div>

            <div className="rounded-xl border border-white/20 bg-white/10 p-4">
              <div className="text-xs font-extrabold uppercase tracking-wider text-blue-100">
                API Connection
              </div>
              <div className="mt-1 font-bold">None</div>
            </div>

            <div className="rounded-xl border border-white/20 bg-white/10 p-4">
              <div className="text-xs font-extrabold uppercase tracking-wider text-blue-100">
                Processing
              </div>
              <div className="mt-1 font-bold">Runs in your browser</div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#1f5c99]">
              Break the Workbench
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Paste or type Query / Jinja here
            </h2>
            <p className="mt-2 max-w-4xl text-slate-600">
              This public edition deliberately removes all schema-aware
              Quickbase API calls. FIDs remain numeric identifiers, but
              the parser can still inspect query structure, operators,
              Jinja references, unsupported Pipelines constructs, and
              malformed syntax.
            </p>
          </div>

          <div className="mt-5 rounded-xl border-2 border-[#1f5c99] bg-blue-50/60 p-4 ring-4 ring-blue-100/60">
            <label
              htmlFor="workbench-input"
              className="block text-base font-extrabold text-[#184a7b]"
            >
              ⌨ Query / Jinja Input
            </label>

            <textarea
              id="workbench-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="mt-2 min-h-48 w-full rounded-xl border-2 border-blue-300 bg-white p-4 font-mono text-sm leading-7 text-slate-900 outline-none focus:border-[#1f5c99] focus:ring-4 focus:ring-blue-100"
              placeholder="{6.EX.'{{a.customer_id}}'}"
              spellCheck={false}
            />

            <p className="mt-2 text-sm font-medium text-slate-600">
              Examples can be loaded below. Nothing you type here is sent
              to Quickbase.
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {EXAMPLES.map((example) => (
              <button
                key={example.label}
                type="button"
                onClick={() => {
                  setInput(example.value);
                  setDiagnostic(analyzeInput(example.value));
                  setCopyMessage("");
                }}
                className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100"
              >
                {example.label}
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={runAnalysis}
              className="rounded-lg bg-[#1f5c99] px-5 py-3 font-bold text-white hover:bg-[#184a7b]"
            >
              Analyze Input
            </button>

            <button
              type="button"
              onClick={() => setInput("")}
              className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700 hover:bg-slate-50"
            >
              Clear
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#1f5c99]">
                Workbench Analysis
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                {diagnostic.overall}
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {(diagnostic.detectedLanguage.includes("Quickbase") ||
                diagnostic.detectedLanguage.includes("Hybrid")) && (
                <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-bold text-blue-800">
                  Quickbase Query
                </span>
              )}

              {(diagnostic.detectedLanguage.includes("Jinja") ||
                diagnostic.detectedLanguage.includes("Hybrid")) && (
                <span className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-sm font-bold text-purple-800">
                  Pipelines Jinja
                </span>
              )}
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Metric
              value={diagnostic.conditions.length}
              label="Query Conditions"
            />
            <Metric
              value={
                diagnostic.jinjaExpressions.length +
                diagnostic.jinjaStatements.length
              }
              label="Jinja Constructs"
            />
            <Metric
              value={errorCount}
              label="Errors"
              tone={errorCount ? "bad" : "good"}
            />
            <Metric
              value={warningCount}
              label="Warnings"
              tone={warningCount ? "warn" : "good"}
            />
          </div>

          <div
            className={`mt-5 rounded-xl border p-4 ${
              errorCount
                ? "border-red-200 bg-red-50 text-red-900"
                : warningCount
                  ? "border-amber-200 bg-amber-50 text-amber-900"
                  : "border-green-200 bg-green-50 text-green-900"
            }`}
          >
            <strong>
              {errorCount
                ? "Fix Required"
                : warningCount
                  ? "Review Recommended"
                  : "Clean"}
              :
            </strong>{" "}
            {errorCount
              ? ` ${errorCount} error(s) and ${warningCount} warning(s) detected.`
              : warningCount
                ? ` ${warningCount} warning(s) detected.`
                : " no Workbench diagnostics were triggered by the current rule set."}
          </div>

          {structure && (
            <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50/50 p-4">
              <h3 className="font-bold text-[#184a7b]">
                Query Structure
              </h3>

              <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-lg bg-slate-900 p-4 font-mono text-sm text-slate-100">
                {structure.structure}
              </pre>

              <p className="mt-3 text-sm font-bold text-slate-600">
                Connectors:{" "}
                {structure.connectors.join(" · ") || "None"}
              </p>

              <div className="mt-3 border-l-4 border-[#1f5c99] bg-white p-3">
                <strong>Plain-language logic:</strong>
                <div className="mt-1 font-mono text-sm">
                  {structure.plain}
                </div>
              </div>
            </div>
          )}

          <div className="mt-5 space-y-4">
            {diagnostic.conditions.map((condition, index) => (
              <article
                key={`${condition.raw}-${index}`}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#1f5c99]">
                  Condition {index + 1}
                </p>

                <code className="mt-2 block wrap-break-word font-bold text-slate-900">
                  {condition.raw}
                </code>

                <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-[170px_1fr]">
                  <dt className="font-bold text-slate-600">FID</dt>
                  <dd>{safeValue(condition.fid)}</dd>

                  <dt className="font-bold text-slate-600">
                    Field
                  </dt>
                  <dd>
                    Schema-free mode — field name/type not resolved
                  </dd>

                  <dt className="font-bold text-slate-600">
                    Operator
                  </dt>
                  <dd>
                    {safeValue(condition.operator)}
                    {condition.operatorMeaning
                      ? ` — ${condition.operatorMeaning}`
                      : ""}
                  </dd>

                  <dt className="font-bold text-slate-600">
                    Matching Value
                  </dt>
                  <dd className="wrap-break-word font-mono">
                    {safeValue(condition.rawValue)}
                  </dd>

                  <dt className="font-bold text-slate-600">
                    Value Type
                  </dt>
                  <dd>{condition.valueType}</dd>
                </dl>
              </article>
            ))}

            {diagnostic.jinjaExpressions.map((jinja, index) => (
              <article
                key={`${jinja.raw}-${index}`}
                className="rounded-xl border border-purple-200 bg-purple-50/50 p-4"
              >
                <p className="text-xs font-extrabold uppercase tracking-wider text-purple-700">
                  Jinja Expression {index + 1}
                </p>

                <code className="mt-2 block wrap-break-word font-bold text-slate-900">
                  {jinja.raw}
                </code>

                <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-[170px_1fr]">
                  <dt className="font-bold text-slate-600">
                    Step References
                  </dt>
                  <dd>
                    {jinja.analysis.stepReferences.join(", ") ||
                      "None"}
                  </dd>

                  <dt className="font-bold text-slate-600">
                    Field References
                  </dt>
                  <dd>
                    {jinja.analysis.fieldReferences.join(", ") ||
                      "None"}
                  </dd>

                  <dt className="font-bold text-slate-600">
                    Trigger Context
                  </dt>
                  <dd>
                    {jinja.analysis.contextReferences.join(", ") ||
                      "None"}
                  </dd>

                  <dt className="font-bold text-slate-600">
                    Runtime Object
                  </dt>
                  <dd>
                    {jinja.analysis.runtimeReferences.join(", ") ||
                      "None"}
                  </dd>

                  <dt className="font-bold text-slate-600">
                    Time Helpers
                  </dt>
                  <dd>
                    {jinja.analysis.timeReferences.join(", ") ||
                      "None"}
                  </dd>

                  <dt className="font-bold text-slate-600">
                    $prev
                  </dt>
                  <dd>
                    {jinja.analysis.hasPrev
                      ? "Detected"
                      : "Not detected"}
                  </dd>
                </dl>
              </article>
            ))}

            {diagnostic.jinjaStatements.map((statement, index) => (
              <article
                key={`${statement.raw}-${index}`}
                className="rounded-xl border border-purple-200 bg-purple-50/50 p-4"
              >
                <p className="text-xs font-extrabold uppercase tracking-wider text-purple-700">
                  Jinja Statement {index + 1}
                </p>

                <code className="mt-2 block wrap-break-word font-bold text-slate-900">
                  {statement.raw}
                </code>

                <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-[170px_1fr]">
                  <dt className="font-bold text-slate-600">
                    Keyword
                  </dt>
                  <dd>{statement.keyword}</dd>

                  <dt className="font-bold text-slate-600">
                    Body
                  </dt>
                  <dd>{statement.body}</dd>
                </dl>
              </article>
            ))}

            {diagnostic.diagnostics.map((item, index) => (
              <article
                key={`${item.code}-${index}`}
                className={`rounded-xl border p-4 ${
                  item.severity === "error"
                    ? "border-red-200 bg-red-50"
                    : "border-amber-200 bg-amber-50"
                }`}
              >
                <p
                  className={`text-xs font-extrabold uppercase tracking-wider ${
                    item.severity === "error"
                      ? "text-red-700"
                      : "text-amber-700"
                  }`}
                >
                  {item.severity === "error"
                    ? "Error"
                    : "Warning"}
                </p>

                <h3 className="mt-2 font-bold">{item.code}</h3>
                <p className="mt-2 text-sm leading-6">
                  {item.message}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <CopyPanel
            title="Workbench Report"
            text={report}
            onCopy={() =>
              handleCopy(report, "Workbench report copied.")
            }
          />

          <CopyPanel
            title="Diagnostic JSON"
            text={diagnosticJson}
            onCopy={() =>
              handleCopy(
                diagnosticJson,
                "Diagnostic JSON copied.",
              )
            }
          />

          <CopyPanel
            title="Analyzed Input"
            text={diagnostic.input || "No input."}
            onCopy={() =>
              handleCopy(
                diagnostic.input || "",
                "Analyzed input copied.",
              )
            }
          />
        </section>

        {copyMessage && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm font-bold text-blue-900">
            {copyMessage}
          </div>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-bold">What this public tester does not do</h2>
          <p className="mt-3 leading-7 text-slate-600">
            This version deliberately does not connect to a Quickbase
            realm, read an application schema, resolve FIDs to field
            names, execute REST queries, or execute Jinja. It is a
            parser, explainer, and linter intended for public testing.
            The schema-aware Code Page edition can remain the integrated
            Quickbase developer version.
          </p>
        </section>
      </div>
    </main>
  );
}

function Metric({
  value,
  label,
  tone = "normal",
}: {
  value: number;
  label: string;
  tone?: "normal" | "good" | "warn" | "bad";
}) {
  const toneClasses = {
    normal: "border-slate-200 bg-slate-50 text-slate-900",
    good: "border-green-200 bg-green-50 text-green-900",
    warn: "border-amber-200 bg-amber-50 text-amber-900",
    bad: "border-red-200 bg-red-50 text-red-900",
  };

  return (
    <div
      className={`rounded-xl border p-4 ${toneClasses[tone]}`}
    >
      <div className="text-2xl font-extrabold">{value}</div>
      <div className="mt-1 text-sm font-bold opacity-75">
        {label}
      </div>
    </div>
  );
}

function CopyPanel({
  title,
  text,
  onCopy,
}: {
  title: string;
  text: string;
  onCopy: () => void;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 p-4">
        <h2 className="font-bold">{title}</h2>

        <button
          type="button"
          onClick={onCopy}
          className="rounded-lg bg-[#1f5c99] px-3 py-2 text-sm font-bold text-white hover:bg-[#184a7b]"
        >
          Copy
        </button>
      </div>

      <pre className="max-h-130 overflow-auto whitespace-pre-wrap wrap-break-word bg-slate-900 p-4 font-mono text-xs leading-6 text-slate-100">
        {text}
      </pre>
    </section>
  );
}
