"use client";

import { useMemo, useState } from "react";

type Severity = "error" | "warning" | "info";

type Diagnostic = {
  severity: Severity;
  code: string;
  message: string;
  condition?: string;
  quickbaseRule?: string;
  suggestedFix?: string;
  example?: string;
  documentationBasis?: string;
};

type ParsedCondition = {
  raw: string;
  validShape: boolean;
  fidText: string | null;
  quotedFid: boolean;
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

type ConnectorDetail = {
  raw: string | null;
  normalized: "AND" | "OR" | null;
  validCase: boolean | null;
};

type MalformedQueryCondition = {
  raw: string;
  start: number;
  end: number;
  reason: "unterminated";
};

type QueryIsland = {
  id: number;
  start: number;
  end: number;
  raw: string;
  conditionIndexes: number[];
  malformedConditions: MalformedQueryCondition[];
  connectors: Array<string | null>;
  connectorDetails: ConnectorDetail[];
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
  connectorDetails: ConnectorDetail[];
  queryIslands: QueryIsland[];
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

const OPERATOR_DEFS: Record<string, { label: string; families: string[] }> = {
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

const DEFAULT_INPUT = "({6.EX.'Alice'}OR{6.EX.'Bob'})AND{7.GTE.'18'}";

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
  {
    label: "Lowercase AND / OR",
    value: "({'12'.EX.'6500'} and ({'13'.EX.'6500'} or {'13'.SW.'1532'}))",
  },
  {
    label: "Python-Style Date Format",
    value: `{87.BF.'{{ "{:%Y-%m-%d}".format(time.now - time.delta(days=30)) }}'}`,
  },
  {
    label: "Documented Date Arithmetic",
    value: `{87.BF.'{{time.today - time.delta(days=30)}}'}`,
  },
  {
    label: "Documented strftime",
    value: `{87.BF.'{{(time.now - time.delta(days=30)).strftime('%Y-%m-%d')}}'}`,
  },
  {
    label: "Documented date_ymd",
    value: `{87.BF.'{{time.today | date_ymd}}'}`,
  },
  {
    label: "$prev in Advanced Query",
    value: `{87.EX.'{{$prev.field_87}}'}`,
  },
  {
    label: "Unknown Operator",
    value: "{87.BANANA.'Something'}",
  },
];

function safeValue(value: unknown) {
  return value === undefined || value === null || value === ""
    ? "Not returned"
    : String(value);
}

function classifyQueryGap(gap: string) {
  /*
   * Two query fragments belong to the same Query Island only when
   * the material between them is limited to grouping parentheses,
   * whitespace, and optionally one AND/OR connector.
   *
   * Jinja blocks, comments, prose, labels, and unrelated template
   * text therefore become natural island boundaries.
   */
  const connectorMatch = gap.match(/^\s*\)*\s*(AND|OR)\s*\(*\s*$/i);

  if (connectorMatch) {
    const raw = connectorMatch[1];
    const normalized = raw.toUpperCase() as "AND" | "OR";

    return {
      belongsTogether: true,
      connector: normalized,
      detail: {
        raw,
        normalized,
        validCase: raw === normalized,
      } satisfies ConnectorDetail,
    };
  }

  if (/^\s*\)*\s*\(*\s*$/.test(gap)) {
    return {
      belongsTogether: true,
      connector: null,
      detail: {
        raw: null,
        normalized: null,
        validCase: null,
      } satisfies ConnectorDetail,
    };
  }

  return {
    belongsTogether: false,
    connector: null,
    detail: null,
  };
}

function buildQueryIslands(
  input: string,
  conditions: Array<{ raw: string; start: number; end: number }>,
  malformedConditions: MalformedQueryCondition[],
): QueryIsland[] {
  type QueryNode =
    | {
        kind: "condition";
        start: number;
        end: number;
        conditionIndex: number;
        raw: string;
      }
    | {
        kind: "malformed";
        start: number;
        end: number;
        malformed: MalformedQueryCondition;
        raw: string;
      };

  const nodes: QueryNode[] = [
    ...conditions.map((condition, conditionIndex) => ({
      kind: "condition" as const,
      start: condition.start,
      end: condition.end,
      conditionIndex,
      raw: condition.raw,
    })),
    ...malformedConditions.map((malformed) => ({
      kind: "malformed" as const,
      start: malformed.start,
      end: malformed.end,
      malformed,
      raw: malformed.raw,
    })),
  ].sort((a, b) => a.start - b.start);

  const islands: QueryIsland[] = [];

  for (const node of nodes) {
    const current = islands[islands.length - 1];

    if (!current) {
      islands.push({
        id: 1,
        start: node.start,
        end: node.end,
        raw: node.raw,
        conditionIndexes:
          node.kind === "condition" ? [node.conditionIndex] : [],
        malformedConditions: node.kind === "malformed" ? [node.malformed] : [],
        connectors: [],
        connectorDetails: [],
      });
      continue;
    }

    const gap = input.slice(current.end + 1, node.start);
    const gapInfo = classifyQueryGap(gap);

    if (!gapInfo.belongsTogether) {
      islands.push({
        id: islands.length + 1,
        start: node.start,
        end: node.end,
        raw: node.raw,
        conditionIndexes:
          node.kind === "condition" ? [node.conditionIndex] : [],
        malformedConditions: node.kind === "malformed" ? [node.malformed] : [],
        connectors: [],
        connectorDetails: [],
      });
      continue;
    }

    current.connectors.push(gapInfo.connector);
    current.connectorDetails.push(
      gapInfo.detail || {
        raw: null,
        normalized: null,
        validCase: null,
      },
    );

    current.end = node.end;
    current.raw = input.slice(current.start, current.end + 1);

    if (node.kind === "condition") {
      current.conditionIndexes.push(node.conditionIndex);
    } else {
      current.malformedConditions.push(node.malformed);
    }
  }

  return islands;
}

function scanQueryConditions(input: string) {
  const conditions: Array<{ raw: string; start: number; end: number }> = [];
  const malformedConditions: MalformedQueryCondition[] = [];
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

    /*
     * Only treat a single "{" as the start of a Quickbase condition
     * when it actually looks like:
     *
     *   {87.BF.
     *   {'87'.EX.
     *
     * This prevents ordinary template text from entering the query parser.
     */
    const rest = input.slice(i);
    const queryStartMatch = rest.match(
      /^\{\s*(?:['"]?\d+['"]?)\s*\.[A-Za-z]+\s*\./,
    );

    if (queryStartMatch) {
      const start = i;
      let quote: string | null = null;
      let jinjaExprDepth = 0;
      let jinjaStmtDepth = 0;
      let end = -1;
      let boundaryBreak = false;

      i += 1;

      while (i < input.length) {
        const ch = input[i];

        /*
         * PATCH 9 — malformed-condition recovery
         *
         * A Quickbase condition can be unfinished even when its matching-
         * value quote has already closed. Example:
         *
         *   {7.GTE.'18'
         *
         * The value quote is complete, but the outer Quickbase "}" is
         * missing. Patch 9 only stopped at a new language boundary when
         * `quote` was still open, which allowed a later query/Jinja closing
         * brace to be stolen as this condition's terminator.
         *
         * While the outer Quickbase condition is still unfinished, crossing
         * a newline into a new Jinja expression, Jinja statement, Jinja
         * comment, or another Quickbase-looking condition is therefore a
         * hard recovery boundary regardless of quote state.
         */
        if (ch === "\n") {
          let lookAhead = i + 1;

          while (lookAhead < input.length && /\s/.test(input[lookAhead])) {
            lookAhead += 1;
          }

          const upcoming = input.slice(lookAhead);

          const startsNewLanguageRegion =
            upcoming.startsWith("{#") ||
            upcoming.startsWith("{%") ||
            upcoming.startsWith("{{");

          const startsAnotherQuickbaseCondition =
            /^\{\s*(?:['"]?\d+['"]?)\s*\.[A-Za-z]+\s*\./.test(upcoming);

          if (startsNewLanguageRegion || startsAnotherQuickbaseCondition) {
            boundaryBreak = true;
            break;
          }
        }

        if ((ch === "'" || ch === '"') && input[i - 1] !== "\\") {
          quote = quote === ch ? null : quote || ch;
        }

        if (ch === "{" && input[i + 1] === "{") {
          jinjaExprDepth += 1;
          i += 2;
          continue;
        }

        if (ch === "}" && input[i + 1] === "}" && jinjaExprDepth > 0) {
          jinjaExprDepth -= 1;
          i += 2;
          continue;
        }

        if (ch === "{" && input[i + 1] === "%") {
          jinjaStmtDepth += 1;
          i += 2;
          continue;
        }

        if (ch === "%" && input[i + 1] === "}" && jinjaStmtDepth > 0) {
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

      /*
       * Preserve malformed query-looking text as its own node.
       * Limit it to the current physical line so following comments,
       * Jinja blocks, and later queries remain independently parseable.
       */
      const lineEnd = input.indexOf("\n", start);
      const malformedEnd = lineEnd >= 0 ? lineEnd - 1 : input.length - 1;

      malformedConditions.push({
        raw: input.slice(start, malformedEnd + 1).trimEnd(),
        start,
        end: malformedEnd,
        reason: "unterminated",
      });

      i = boundaryBreak ? Math.max(i, malformedEnd + 1) : malformedEnd + 1;

      continue;
    }

    i += 1;
  }

  const queryIslands = buildQueryIslands(
    input,
    conditions,
    malformedConditions,
  );

  const connectors = queryIslands.flatMap((island) => island.connectors);

  const connectorDetails = queryIslands.flatMap(
    (island) => island.connectorDetails,
  );

  return {
    conditions,
    malformedConditions,
    queryIslands,
    connectors,
    connectorDetails,
  };
}

function parseCondition(raw: string) {
  const inner = raw.slice(1, -1);
  const firstDot = inner.indexOf(".");
  const secondDot = inner.indexOf(".", firstDot + 1);

  if (firstDot < 1 || secondDot < 0) {
    return {
      raw,
      validShape: false,
      fidText: null,
      quotedFid: false,
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

  const quotedFid = /^'\d+'$/.test(fidText) || /^"\d+"$/.test(fidText);

  let rawValue = inner.slice(secondDot + 1).trim();

  if (
    (rawValue.startsWith("'") && rawValue.endsWith("'")) ||
    (rawValue.startsWith('"') && rawValue.endsWith('"'))
  ) {
    rawValue = rawValue.slice(1, -1);
  }

  const fid = /^\d+$/.test(fidText)
    ? Number(fidText)
    : quotedFid
      ? Number(fidText.slice(1, -1))
      : fidText;

  return {
    raw,
    validShape:
      (/^\d+$/.test(fidText) || quotedFid) && /^[A-Z]+$/.test(operator),
    fidText,
    quotedFid,
    fid,
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
    const keyword = body.match(/^([A-Za-z_][A-Za-z0-9_]*)/)?.[1] || "unknown";

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

  const context = /\b([a-z])\.context\.([A-Za-z_][A-Za-z0-9_]*)/g;

  while ((match = context.exec(expression))) {
    info.contextReferences.push(`${match[1]}.context.${match[2]}`);
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

function analyzeDocumentedJinjaRules(expression: string): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];

  const usesPythonStyleDateFormat =
    /["'][^"']*%Y[^"']*["']\.format\s*\(/.test(expression) ||
    /\{:%[A-Za-z%\-]+\}["']?\.format\s*\(/.test(expression);

  if (usesPythonStyleDateFormat) {
    diagnostics.push({
      severity: "error",
      code: "PIPELINES_DATE_FORMAT_METHOD_MISMATCH",
      message:
        "Python-style string .format(...) was detected for date formatting.",
      quickbaseRule:
        "The supplied Quickbase Pipelines documentation documents date formatting with .strftime(...) or date filters such as date_ymd, date_mdy, and date_dmy.",
      suggestedFix:
        "Use a documented Quickbase Pipelines date-formatting pattern instead of formatting the date through a Python-style string template.",
      example: "{{(time.now - time.delta(days=30)).strftime('%Y-%m-%d')}}",
      documentationBasis:
        "Quickbase Pipelines Jinja reference: date/time helpers, date_ymd/date_mdy/date_dmy, and .strftime(format).",
    });
  }

  const usesStrftime = /\.strftime\s*\(\s*['"][^'"]+['"]\s*\)/.test(expression);

  const dateFilterMatch = expression.match(
    /\|\s*(date_ymd|date_mdy|date_dmy)\b/,
  );

  const usesTimeDelta = /\btime\.delta\s*\(/.test(expression);
  const usesTimeToday = /\btime\.today\b/.test(expression);
  const usesTimeNow = /\btime\.now\b/.test(expression);
  const usesTimeParse = /\btime\.parse\s*\(/.test(expression);
  const usesDateArithmetic =
    /\btime\.(today|now)\b[\s\S]*[+-][\s\S]*time\.delta\s*\(/.test(expression);

  if (!usesPythonStyleDateFormat && usesDateArithmetic) {
    diagnostics.push({
      severity: "info",
      code: "DOCUMENTED_PIPELINES_DATE_ARITHMETIC",
      message: "Quickbase-documented Pipelines date arithmetic was recognized.",
      quickbaseRule:
        "Quickbase documents time.today/time.now with time.delta(...) for adding or subtracting relative time intervals.",
      suggestedFix:
        "No syntax change is suggested for this date-arithmetic pattern. Keep runtime context and target field expectations in mind.",
      example: "{{time.today - time.delta(days=30)}}",
      documentationBasis:
        "Quickbase Common Jinja expressions: add or subtract days from today; Jinja reference: time.delta(...).",
    });
  }

  if (!usesPythonStyleDateFormat && usesStrftime) {
    diagnostics.push({
      severity: "info",
      code: "DOCUMENTED_PIPELINES_STRFTIME",
      message:
        "A Quickbase-documented .strftime(...) date-formatting pattern was recognized.",
      quickbaseRule:
        "Quickbase Pipelines documents .strftime(format) as the method for custom date formatting.",
      suggestedFix:
        "No syntax change is suggested for the .strftime(...) portion.",
      example: "{{time.now.strftime('%Y-%m-%d')}}",
      documentationBasis:
        "Quickbase Pipelines Jinja reference: .strftime(format), including %Y, %m, and %d format codes.",
    });
  }

  if (!usesPythonStyleDateFormat && dateFilterMatch) {
    diagnostics.push({
      severity: "info",
      code: "DOCUMENTED_PIPELINES_DATE_FILTER",
      message: `A Quickbase-documented ${dateFilterMatch[1]} date-formatting filter was recognized.`,
      quickbaseRule:
        "Quickbase Pipelines documents date_ymd, date_mdy, and date_dmy for converting dates to formatted strings.",
      suggestedFix:
        "No syntax change is suggested for this documented date filter.",
      example: "{{time.today | date_ymd}}",
      documentationBasis:
        "Quickbase Pipelines Jinja reference: date_ymd/date_mdy/date_dmy.",
    });
  }

  if (
    !usesPythonStyleDateFormat &&
    (usesTimeToday || usesTimeNow || usesTimeParse || usesTimeDelta) &&
    !usesDateArithmetic &&
    !usesStrftime &&
    !dateFilterMatch
  ) {
    diagnostics.push({
      severity: "info",
      code: "DOCUMENTED_PIPELINES_TIME_HELPER",
      message:
        "Quickbase-documented Pipelines time helper usage was recognized.",
      quickbaseRule:
        "Quickbase Pipelines documents time.today, time.now, time.delta(...), and time.parse(...).",
      suggestedFix:
        "No syntax change is suggested for the documented time helper itself.",
      documentationBasis:
        "Quickbase Pipelines Jinja reference: date/time helpers.",
    });
  }

  return diagnostics;
}

function detectLanguage(
  conditions: ParsedCondition[],
  expressions: JinjaExpression[],
  statements: JinjaStatement[],
  queryIslandCount = 0,
): QueryDiagnostic["detectedLanguage"] {
  const hasQuery = conditions.length > 0 || queryIslandCount > 0;
  const hasJinja = expressions.length > 0 || statements.length > 0;

  if (hasQuery && hasJinja) {
    return "Hybrid Pipeline Advanced Query";
  }

  if (hasQuery) return "Quickbase Query";
  if (hasJinja) return "Pipelines Jinja";

  return "Unknown / Plain Text";
}

function findQueryStructuralIssues(
  scan: ReturnType<typeof scanQueryConditions>,
): Diagnostic[] {
  const issues: Diagnostic[] = [];

  for (const malformed of scan.malformedConditions) {
    issues.push({
      severity: "error",
      code: "QUICKBASE_CONDITION_UNTERMINATED",
      message: `A Quickbase-looking condition starts here but does not close before the next language/document boundary: ${malformed.raw}`,
      condition: malformed.raw,
      quickbaseRule:
        "A Quickbase Advanced Query condition must close its outer curly brace after the matching value.",
      suggestedFix:
        "Close the condition before continuing into another Jinja block, comment, template-text region, or separate query.",
      example: malformed.raw.trim().endsWith("}")
        ? malformed.raw.trim()
        : `${malformed.raw.trim()}}`,
      documentationBasis:
        "Quickbase Advanced Query condition shape: {fid.OPERATOR.'matching_value'}.",
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

  const conditions: ParsedCondition[] = scan.conditions.map((condition) => {
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
  });

  const jinjaExpressions = extractJinjaExpressions(trimmed);
  const jinjaStatements = extractJinjaStatements(trimmed);
  const jinjaComments = extractJinjaComments(trimmed);
  const diagnostics: Diagnostic[] = [];

  diagnostics.push(...findQueryStructuralIssues(scan));

  for (const connector of scan.connectorDetails) {
    if (connector.raw && connector.validCase === false) {
      diagnostics.push({
        severity: "error",
        code: "QUICKBASE_LOGICAL_CONNECTOR_CASE",
        message: `Logical connector "${connector.raw}" was detected.`,
        quickbaseRule: `Quickbase Advanced Query documentation specifies uppercase logical connectors. Use "${connector.normalized}".`,
        suggestedFix: `Replace "${connector.raw}" with "${connector.normalized}".`,
        example: "({12.EX.'6500'}AND({13.EX.'6500'}OR{13.SW.'1532'}))",
        documentationBasis:
          "Quickbase Advanced Query syntax: combine conditions with AND or OR, always uppercase.",
      });
    }
  }

  const quotedFids = [
    ...new Set(
      conditions
        .filter((condition) => condition.quotedFid)
        .map((condition) => Number(condition.fid)),
    ),
  ];

  if (quotedFids.length) {
    diagnostics.push({
      severity: "warning",
      code: "QUICKBASE_FID_SYNTAX_VARIATION",
      message: `Quoted Field IDs were detected (${quotedFids.join(", ")}).`,
      quickbaseRule:
        "The supplied Quickbase material shows the canonical query grammar with a numeric FID, but other supplied Quickbase examples also show quoted FIDs. The Workbench therefore treats this as a documented syntax variation rather than a universal failure.",
      suggestedFix:
        "Prefer the canonical numeric form when writing new expressions unless your specific Quickbase context or documentation shows the quoted form.",
      example: "{13.EX.'today'}",
      documentationBasis:
        "Supplied Quickbase Advanced Query documentation contains both unquoted canonical examples and quoted date-query examples.",
    });
  }

  for (const jinja of jinjaExpressions) {
    diagnostics.push(...analyzeDocumentedJinjaRules(jinja.expression));
  }

  if (conditions.length) {
    for (const condition of conditions) {
      if (!condition.validShape) {
        diagnostics.push({
          severity: "error",
          code: "QUICKBASE_QUERY_SHAPE_MISMATCH",
          message:
            "The condition does not match the documented Quickbase Advanced Query structure.",
          condition: condition.raw,
          quickbaseRule:
            "Each condition uses {fid.OPERATOR.'matching_value'} with three period-separated parts inside curly braces.",
          suggestedFix:
            "Check the braces, periods, Field ID, operator, and quoted matching value.",
          example: "{6.EX.'Open'}",
          documentationBasis: "Quickbase Advanced Query syntax reference.",
        });
      }

      if (!condition.operatorKnown) {
        diagnostics.push({
          severity: "error",
          code: "QUICKBASE_OPERATOR_NOT_DOCUMENTED",
          message: `Operator "${safeValue(condition.operator)}" is not in the Workbench's documented Quickbase operator set.`,
          condition: condition.raw,
          quickbaseRule:
            "Advanced Query operators are a defined Quickbase grammar. The current documented set in this Workbench includes EX, XEX, CT, SW, BF, AF, OAF, LT, LTE, GT, GTE, HAS, and IR.",
          suggestedFix:
            "Replace the operator with the Quickbase operator that matches the comparison you intend.",
          example:
            "{87.EX.'Something'} or {87.CT.'Something'} depending on the intended comparison.",
          documentationBasis: "Quickbase Advanced Query common operators.",
        });
      }

      if (/\{%\s*[\s\S]*?%\}/.test(condition.rawValue || "")) {
        diagnostics.push({
          severity: "error",
          code: "JINJA_STATEMENT_NOT_ALLOWED_IN_ADVANCED_QUERY",
          message:
            "A {% ... %} Jinja statement block was detected inside an Advanced Query matching value.",
          condition: condition.raw,
          quickbaseRule:
            "Quickbase documentation says Advanced Query may embed a single {{ ... }} Jinja expression in the matching value, but multi-line {% ... %} statement logic is not supported inside the query string.",
          suggestedFix:
            "Compute conditional logic in another pipeline step, then reference the resulting value with a single {{ ... }} expression inside Advanced Query.",
          example: "{6.EX.'{{a.customer_id}}'}",
          documentationBasis:
            "Quickbase Jinja reference: Embed Jinja inside a query; multi-line Jinja statements do not work inside query strings.",
        });
      }

      for (const jinja of condition.jinja) {
        const containsPrev = /\$prev\b/.test(jinja.expression);

        if (containsPrev) {
          diagnostics.push({
            severity: "error",
            code: "PREV_NOT_SUPPORTED_IN_ADVANCED_QUERY",
            message:
              "$prev was detected inside a Quickbase Advanced Query value.",
            condition: condition.raw,
            quickbaseRule:
              "Quickbase documentation states that $prev is available on Record Updated trigger expressions but does not work inside Advanced Query filter strings.",
            suggestedFix:
              "Move the previous-value comparison into a regular Pipelines Jinja expression, or use a current-step value inside the Advanced Query.",
            example:
              "Outside Advanced Query, the documented form is a.$prev.field_name.",
            documentationBasis:
              "Quickbase Start with Jinja in Pipelines and Jinja reference: $prev does not work inside Quickbase Advanced Query filter strings.",
          });

          if (!/\b[a-z]\.\$prev\./.test(jinja.expression)) {
            diagnostics.push({
              severity: "info",
              code: "PREV_REFERENCE_FORM_NOTE",
              message:
                "The detected $prev reference also does not use the documented step-letter form.",
              quickbaseRule:
                "Outside Advanced Query, Quickbase documents $prev between the step letter and field name.",
              suggestedFix:
                "When $prev is used in a supported Record Updated trigger expression, use a.$prev.field_name.",
              example: "{{a.$prev.status}}",
              documentationBasis: "Quickbase Pipelines $prev syntax.",
            });
          }
        }
      }
    }

    if (
      scan.connectors.some((connector) => connector === null) &&
      conditions.length > 1
    ) {
      diagnostics.push({
        severity: "error",
        code: "QUICKBASE_CONNECTOR_MISSING",
        message:
          "Multiple Quickbase conditions were detected without a logical connector between every condition.",
        quickbaseRule:
          "Quickbase Advanced Query combines multiple conditions with AND or OR.",
        suggestedFix: "Add an uppercase AND or OR between adjacent conditions.",
        example: "{6.EX.'Open'}AND{7.GTE.'18'}",
        documentationBasis: "Quickbase Advanced Query combination syntax.",
      });
    }
  }

  if (/\{%\s*(break|continue)\b/i.test(trimmed)) {
    diagnostics.push({
      severity: "error",
      code: "PIPELINES_LOOP_CONTROL_NOT_SUPPORTED",
      message: "A {% break %} or {% continue %} statement was detected.",
      quickbaseRule:
        "Quickbase Pipelines does not support break or continue inside Jinja loops.",
      suggestedFix:
        "Filter the list before looping with select/reject, or guard the loop body with an if statement.",
      documentationBasis: "Quickbase Jinja reference: unsupported constructs.",
    });
  }

  if (/\{%\s*(include|import|extends)\b/i.test(trimmed)) {
    diagnostics.push({
      severity: "error",
      code: "PIPELINES_TEMPLATE_INHERITANCE_NOT_SUPPORTED",
      message: "A Jinja include, import, or extends statement was detected.",
      quickbaseRule:
        "Quickbase Pipelines does not allow template inheritance or importing templates/modules in Jinja.",
      suggestedFix:
        "Keep the required logic directly inside the pipeline expression or step.",
      documentationBasis:
        "Quickbase Jinja reference: unsupported constructs and limited environment.",
    });
  }

  if (/\{%\s*do\b/i.test(trimmed)) {
    diagnostics.push({
      severity: "error",
      code: "PIPELINES_DO_EXTENSION_NOT_SUPPORTED",
      message: "A Jinja {% do ... %} statement was detected.",
      quickbaseRule:
        "Quickbase Pipelines does not support the Jinja do extension.",
      suggestedFix: "Use supported set/namespace patterns or filters instead.",
      documentationBasis: "Quickbase Jinja reference: unsupported constructs.",
    });
  }

  const hasJinjaError = diagnostics.some(
    (item) =>
      item.severity === "error" &&
      (item.code.includes("JINJA") ||
        item.code.includes("PIPELINES") ||
        item.code.includes("PREV")),
  );

  if (jinjaExpressions.length > 0 && !hasJinjaError) {
    diagnostics.push({
      severity: "warning",
      code: "PIPELINES_RUNTIME_NOT_EXECUTED",
      message:
        "The Workbench recognized Jinja syntax and any applicable documented patterns, but did not execute the expression.",
      quickbaseRule:
        "This public tool performs local static analysis only. Quickbase Pipelines runtime behavior can depend on actual step data, scope, field values, and execution context.",
      suggestedFix:
        "Use the Workbench findings as preflight guidance, then verify the expression in Pipelines and inspect the activity log if runtime behavior matters.",
      documentationBasis:
        "Quickbase Pipelines troubleshooting guidance distinguishes design-time validation from runtime errors.",
    });
  }

  const detectedLanguage = detectLanguage(
    conditions,
    jinjaExpressions,
    jinjaStatements,
    scan.queryIslands.length,
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
  } else if (detectedLanguage === "Hybrid Pipeline Advanced Query") {
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
    connectorDetails: scan.connectorDetails,
    queryIslands: scan.queryIslands,
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
    condition.operatorMeaning || condition.operator || "Unknown operator";

  let value = safeValue(condition.rawValue);

  if (condition.valueType === "jinja") {
    value = `Jinja value ${value}`;
  }

  if (condition.valueType === "unsupported-jinja-statement") {
    value = `unsupported Jinja statement ${value}`;
  }

  if (condition.valueType === "field-reference") {
    value = `field reference ${value}`;
  }

  return `${field} ${operator.toLowerCase()} ${value}`;
}

function buildQueryStructure(diagnostic: QueryDiagnostic) {
  return diagnostic.queryIslands.map((island) => {
    let structure = island.raw;
    let plain = island.raw;

    for (const conditionIndex of island.conditionIndexes) {
      const condition = diagnostic.conditions[conditionIndex];

      if (!condition) continue;

      structure = structure.replace(
        condition.raw,
        `[Condition ${conditionIndex + 1}]`,
      );

      plain = plain.replace(
        condition.raw,
        `[${summarizeCondition(condition)}]`,
      );
    }

    for (const malformed of island.malformedConditions) {
      structure = structure.replace(
        malformed.raw,
        "[Malformed / Unterminated Condition]",
      );

      plain = plain.replace(
        malformed.raw,
        `[unterminated Quickbase condition: ${malformed.raw}]`,
      );
    }

    const connectors = island.connectorDetails.map((connector, index) => {
      if (!connector.raw) {
        return `${index + 1} → Missing connector`;
      }

      if (connector.validCase === false) {
        return `${index + 1} → ${connector.raw} (should be ${connector.normalized})`;
      }

      return `${index + 1} → ${connector.raw}`;
    });

    return {
      islandId: island.id,
      raw: island.raw,
      structure,
      plain,
      connectors,
      conditionCount: island.conditionIndexes.length,
      malformedCount: island.malformedConditions.length,
    };
  });
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
    lines.push("  Field: Schema-free mode — field name/type not resolved");
    lines.push(
      `  Operator: ${safeValue(condition.operator)}${
        condition.operatorMeaning ? ` — ${condition.operatorMeaning}` : ""
      }`,
    );
    lines.push(`  Matching Value: ${safeValue(condition.rawValue)}`);
    lines.push(`  Value Type: ${condition.valueType}`);
    lines.push("");
  });

  if (structure.length) {
    lines.push("QUICKBASE QUERY ISLANDS");
    lines.push("-".repeat(76));
    lines.push(
      "Independent Quickbase query regions are analyzed separately from Jinja blocks, comments, and ordinary template text.",
    );
    lines.push("");

    structure.forEach((island) => {
      lines.push(`Query Island ${island.islandId}`);
      lines.push(`  Complete Conditions: ${island.conditionCount}`);
      lines.push(`  Malformed Conditions: ${island.malformedCount}`);
      lines.push(`  Structure: ${island.structure}`);
      lines.push(`  Connectors: ${island.connectors.join(" | ") || "None"}`);
      lines.push(`  Logic: ${island.plain}`);
      lines.push("");
    });
  }

  lines.push("JINJA ANALYSIS");
  lines.push("-".repeat(76));
  lines.push(
    "Validation scope: supplied Quickbase/Pipelines documentation plus local static analysis.",
  );
  lines.push(
    "The public Workbench does not execute Pipelines; runtime verification remains a separate step.",
  );
  lines.push("");

  if (!diagnostic.jinjaExpressions.length) {
    lines.push("No {{ ... }} Jinja expressions detected.");
  }

  diagnostic.jinjaExpressions.forEach((jinja, index) => {
    const analysis = jinja.analysis;

    lines.push(`Expression ${index + 1}: ${jinja.raw}`);
    lines.push(
      `  Step References: ${analysis.stepReferences.join(", ") || "None"}`,
    );
    lines.push(
      `  Field References: ${analysis.fieldReferences.join(", ") || "None"}`,
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
      `  Time Helpers: ${analysis.timeReferences.join(", ") || "None"}`,
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
      "🟢 No findings were triggered by the current documented/local Workbench rules. Runtime execution in Quickbase/Pipelines was not performed.",
    );
  } else {
    diagnostic.diagnostics.forEach((item) => {
      const icon =
        item.severity === "error"
          ? "🔴"
          : item.severity === "warning"
            ? "🟠"
            : "🔵";

      lines.push(`${icon} ${item.code}: ${item.message}`);

      if (item.quickbaseRule) {
        lines.push(`   Quickbase rule: ${item.quickbaseRule}`);
      }

      if (item.suggestedFix) {
        lines.push(`   Suggested action: ${item.suggestedFix}`);
      }

      if (item.example) {
        lines.push(`   Example: ${item.example}`);
      }

      if (item.documentationBasis) {
        lines.push(`   Documentation basis: ${item.documentationBasis}`);
      }
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

  const report = useMemo(() => buildWorkbenchReport(diagnostic), [diagnostic]);

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

  const infoCount = diagnostic.diagnostics.filter(
    (item) => item.severity === "info",
  ).length;

  const runAnalysis = () => {
    setDiagnostic(analyzeInput(input));
    setCopyMessage("");
  };

  const handleCopy = async (text: string, successMessage: string) => {
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
            Public schema-free tester for Quickbase Advanced Query syntax,
            Pipelines Jinja, and hybrid query/Jinja expressions. Try a good
            expression. Try a terrible expression. See if you can break it.
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
              Quickbase API calls. FIDs are inspected as syntax only, so the
              Workbench never claims that a Field ID exists or does not exist in
              someone else&apos;s app. Findings are based on supplied
              Quickbase/Pipelines documentation plus local static analysis of
              query structure, operators, connector casing, Jinja references,
              documented date/time patterns, and known unsupported constructs.
              Patch 9 also isolates independent Quickbase Query Islands inside
              larger mixed Jinja/template documents instead of treating the
              entire textarea as one query.
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
              Examples can be loaded below. Nothing you type here is sent to
              Quickbase.
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
              <h2 className="mt-2 text-2xl font-bold">{diagnostic.overall}</h2>
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

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            <Metric
              value={diagnostic.queryIslands.length}
              label="Query Islands"
            />
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
            <Metric
              value={infoCount}
              label="Info"
              tone={infoCount ? "info" : "good"}
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
                : " no error or warning findings were triggered by the current documented/local rule set. Runtime execution in Quickbase/Pipelines was not performed."}
          </div>

          {structure.length > 0 && (
            <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50/50 p-4">
              <h3 className="font-bold text-[#184a7b]">
                Quickbase Query Islands
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Quickbase query regions are analyzed independently from
                surrounding Jinja blocks, comments, and ordinary template text.
                This prevents unrelated prose from being mistaken for query
                connectors or malformed query content.
              </p>

              <div className="mt-4 space-y-4">
                {structure.map((island) => (
                  <article
                    key={island.islandId}
                    className="rounded-xl border border-blue-200 bg-white p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-extrabold text-[#184a7b]">
                        Query Island {island.islandId}
                      </h4>

                      <div className="text-xs font-bold text-slate-500">
                        {island.conditionCount} complete ·{" "}
                        {island.malformedCount} malformed
                      </div>
                    </div>

                    <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-lg bg-slate-900 p-4 font-mono text-sm text-slate-100">
                      {island.structure}
                    </pre>

                    <p className="mt-3 text-sm font-bold text-slate-600">
                      Connectors: {island.connectors.join(" · ") || "None"}
                    </p>

                    <div className="mt-3 border-l-4 border-[#1f5c99] bg-blue-50/40 p-3">
                      <strong>Plain-language logic:</strong>
                      <div className="mt-1 font-mono text-sm">
                        {island.plain}
                      </div>
                    </div>
                  </article>
                ))}
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

                  <dt className="font-bold text-slate-600">Field</dt>
                  <dd>Schema-free mode — field name/type not resolved</dd>

                  <dt className="font-bold text-slate-600">Operator</dt>
                  <dd>
                    {safeValue(condition.operator)}
                    {condition.operatorMeaning
                      ? ` — ${condition.operatorMeaning}`
                      : ""}
                  </dd>

                  <dt className="font-bold text-slate-600">Matching Value</dt>
                  <dd className="wrap-break-word font-mono">
                    {safeValue(condition.rawValue)}
                  </dd>

                  <dt className="font-bold text-slate-600">Value Type</dt>
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
                  <dt className="font-bold text-slate-600">Step References</dt>
                  <dd>{jinja.analysis.stepReferences.join(", ") || "None"}</dd>

                  <dt className="font-bold text-slate-600">Field References</dt>
                  <dd>{jinja.analysis.fieldReferences.join(", ") || "None"}</dd>

                  <dt className="font-bold text-slate-600">Trigger Context</dt>
                  <dd>
                    {jinja.analysis.contextReferences.join(", ") || "None"}
                  </dd>

                  <dt className="font-bold text-slate-600">Runtime Object</dt>
                  <dd>
                    {jinja.analysis.runtimeReferences.join(", ") || "None"}
                  </dd>

                  <dt className="font-bold text-slate-600">Time Helpers</dt>
                  <dd>{jinja.analysis.timeReferences.join(", ") || "None"}</dd>

                  <dt className="font-bold text-slate-600">$prev</dt>
                  <dd>
                    {jinja.analysis.hasPrev ? "Detected" : "Not detected"}
                  </dd>

                  <dt className="font-bold text-slate-600">Validation Scope</dt>
                  <dd>
                    Supplied Quickbase/Pipelines documentation plus local static
                    analysis — no runtime execution.
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
                  <dt className="font-bold text-slate-600">Keyword</dt>
                  <dd>{statement.keyword}</dd>

                  <dt className="font-bold text-slate-600">Body</dt>
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
                    : item.severity === "warning"
                      ? "border-amber-200 bg-amber-50"
                      : "border-blue-200 bg-blue-50"
                }`}
              >
                <p
                  className={`text-xs font-extrabold uppercase tracking-wider ${
                    item.severity === "error"
                      ? "text-red-700"
                      : item.severity === "warning"
                        ? "text-amber-700"
                        : "text-blue-700"
                  }`}
                >
                  {item.severity === "error"
                    ? "Error"
                    : item.severity === "warning"
                      ? "Warning"
                      : "Info"}
                </p>

                <h3 className="mt-2 font-bold">{item.code}</h3>
                <p className="mt-2 text-sm leading-6">{item.message}</p>

                {(item.quickbaseRule ||
                  item.suggestedFix ||
                  item.example ||
                  item.documentationBasis) && (
                  <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-[170px_1fr]">
                    {item.quickbaseRule && (
                      <>
                        <dt className="font-bold text-slate-600">
                          Quickbase Rule
                        </dt>
                        <dd>{item.quickbaseRule}</dd>
                      </>
                    )}

                    {item.suggestedFix && (
                      <>
                        <dt className="font-bold text-slate-600">
                          Suggested Action
                        </dt>
                        <dd>{item.suggestedFix}</dd>
                      </>
                    )}

                    {item.example && (
                      <>
                        <dt className="font-bold text-slate-600">Example</dt>
                        <dd className="wrap-break-word font-mono">
                          {item.example}
                        </dd>
                      </>
                    )}

                    {item.documentationBasis && (
                      <>
                        <dt className="font-bold text-slate-600">
                          Documentation Basis
                        </dt>
                        <dd>{item.documentationBasis}</dd>
                      </>
                    )}
                  </dl>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <CopyPanel
            title="Workbench Report"
            text={report}
            onCopy={() => handleCopy(report, "Workbench report copied.")}
          />

          <CopyPanel
            title="Diagnostic JSON"
            text={diagnosticJson}
            onCopy={() => handleCopy(diagnosticJson, "Diagnostic JSON copied.")}
          />

          <CopyPanel
            title="Analyzed Input"
            text={diagnostic.input || "No input."}
            onCopy={() =>
              handleCopy(diagnostic.input || "", "Analyzed input copied.")
            }
          />
        </section>

        {copyMessage && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm font-bold text-blue-900">
            {copyMessage}
          </div>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-bold">
            What this public tester does not do
          </h2>
          <p className="mt-3 leading-7 text-slate-600">
            This version deliberately does not connect to a Quickbase realm,
            read an application schema, resolve FIDs to field names, execute
            REST queries, or execute Jinja. It is a parser, explainer, and
            documentation-backed linter intended for public testing. It can
            identify documented Quickbase and Pipelines patterns, but it does
            not replace actual execution or the Pipelines activity log. The
            schema-aware Code Page edition can remain the integrated Quickbase
            developer version.
          </p>
        </section>
        <section className="mt-16 border-t border-slate-200 pt-12">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-8">
            <div className="mb-8">
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
                Patch 9 Review
              </p>

              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                From Validator to Diagnostic Workbench
              </h2>

              <p className="mt-4 max-w-4xl leading-7 text-slate-700">
                The Workbench began as a small parser for Quickbase Advanced
                Query syntax and Pipelines Jinja. Real-world testing exposed
                increasingly subtle cases involving connector casing, mixed
                Jinja/query documents, date formatting,{" "}
                <code className="font-mono text-sm">$prev</code>, malformed
                conditions, and schema context.
              </p>

              <p className="mt-3 max-w-4xl leading-7 text-slate-700">
                Rather than patching individual examples, the parser evolved
                into a documentation-backed diagnostic system with Query
                Islands, fault recovery, live schema awareness, and separate
                Error, Warning, and Informational findings.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="font-bold text-slate-900">
                  Schema-Aware Validation
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  The Quickbase Code Page now uses live table metadata to
                  resolve Field IDs into actual field names and types instead of
                  assuming that a FID has the same meaning in every table.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="font-bold text-slate-900">
                  Connector Case Detection
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Lowercase <code className="font-mono">and</code> and{" "}
                  <code className="font-mono">or</code> are preserved during
                  parsing so the Workbench can recommend Quickbase&apos;s
                  documented uppercase <code className="font-mono">AND</code>{" "}
                  and <code className="font-mono">OR</code> syntax.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="font-bold text-slate-900">
                  Documented Syntax Variations
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Quoted FIDs are no longer treated as universally invalid. When
                  Quickbase documentation demonstrates more than one form, the
                  Workbench reports the variation without weakening the
                  canonical grammar.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="font-bold text-slate-900">
                  Pipelines Date Intelligence
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Date arithmetic, <code className="font-mono">strftime()</code>
                  , Quickbase date filters, and time helpers can now be
                  recognized against documented Pipelines patterns instead of
                  receiving a vague runtime warning.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="font-bold text-slate-900">
                  Better Jinja Diagnostics
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  The parser distinguishes documented patterns, unknown
                  patterns, unsupported constructs, and expressions that simply
                  cannot be runtime-tested by the Workbench.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="font-bold text-slate-900">
                  Error, Warning &amp; Info
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Findings are no longer merely pass or fail. Errors identify
                  invalid syntax, warnings identify concerns or uncertainty, and
                  informational findings positively recognize documented
                  Quickbase patterns.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="font-bold text-slate-900">
                  Stronger $prev Detection
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  References to <code className="font-mono">$prev</code> are
                  detected anywhere inside Advanced Query values, including
                  malformed forms, with guidance explaining where Quickbase
                  actually supports them.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="font-bold text-slate-900">
                  Quickbase-Specific Errors
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Unknown operators, unsupported Jinja statements, loop
                  controls, template inheritance, and other constructs now
                  produce descriptive Quickbase-specific diagnostics with
                  suggested actions.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="font-bold text-slate-900">Query Islands</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Mixed documents can contain several independent Quickbase
                  queries, Jinja expressions, comments, and ordinary text. Query
                  Islands isolate those regions so unrelated content is no
                  longer interpreted as one enormous query.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="font-bold text-slate-900">
                  Smarter Connector Parsing
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Words such as AND and OR inside comments or ordinary prose no
                  longer become fake logical connectors. Conditions are joined
                  only when the text between them is legitimate query structure.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="font-bold text-slate-900">Fault Recovery</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  An unterminated condition no longer consumes everything that
                  follows it. The parser can recover at a new query boundary,
                  report the malformed condition, and continue analyzing later
                  Query Islands.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="font-bold text-slate-900">
                  Large Jinja Programs
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Larger Pipelines templates containing loops, conditions,
                  namespaces, filters, variables, date operations, and runtime
                  metadata can now be parsed without collapsing the surrounding
                  analysis.
                </p>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-lg font-bold text-slate-900">
                How the Workbench Evolved
              </h3>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Original
                  </p>
                  <p className="mt-2 font-semibold text-slate-900">
                    Syntax checking
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Patch 5
                  </p>
                  <p className="mt-2 font-semibold text-slate-900">
                    Connector &amp; Jinja detection
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Patches 6–7
                  </p>
                  <p className="mt-2 font-semibold text-slate-900">
                    Quickbase diagnostic guidance
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Patch 8
                  </p>
                  <p className="mt-2 font-semibold text-slate-900">
                    Query Islands
                  </p>
                </div>

                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
                    Patch 9
                  </p>
                  <p className="mt-2 font-semibold text-slate-900">
                    Fault-tolerant + schema-aware
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 rounded-xl border-l-4 border-blue-600 bg-white p-5">
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-blue-700">
                Patch 9 Design Principle
              </p>

              <p className="mt-3 text-lg font-semibold leading-8 text-slate-900">
                Do not make the validator more permissive just to accommodate a
                strange example. First determine what Quickbase actually
                documents, then make the diagnostic more descriptive.
              </p>
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6">
              <p className="text-sm leading-6 text-slate-600">
                Patch 9 marks the point where the Query &amp; Jinja Workbench
                became more than a syntax parser. It now attempts to explain
                what was detected, which Quickbase rule applies, why the finding
                matters, and what the developer should investigate or change
                next.
              </p>
            </div>
          </div>
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
  tone?: "normal" | "good" | "warn" | "bad" | "info";
}) {
  const toneClasses = {
    normal: "border-slate-200 bg-slate-50 text-slate-900",
    good: "border-green-200 bg-green-50 text-green-900",
    warn: "border-amber-200 bg-amber-50 text-amber-900",
    bad: "border-red-200 bg-red-50 text-red-900",
    info: "border-blue-200 bg-blue-50 text-blue-900",
  };

  return (
    <div className={`rounded-xl border p-4 ${toneClasses[tone]}`}>
      <div className="text-2xl font-extrabold">{value}</div>
      <div className="mt-1 text-sm font-bold opacity-75">{label}</div>
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
