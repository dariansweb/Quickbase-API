import type { Metadata } from "next";
import Link from "next/link";
import QueryOperatorLab from "./QueryOperatorLab";

export const metadata: Metadata = {
  title: "Lesson 4 — Quickbase Query Operators",
  description:
    "Explore Quickbase query operators and learn how field, operator, and comparison value form REST where conditions.",
};

const operatorReference = [
  {
    code: "EX",
    name: "Exact Match",
    example: "{8.EX.'Blue'}",
    exampleMeaning: "Favorite Color matches Blue.",
    sourceNote:
      "EX condition structure is represented in the Quickbase REST specification.",
  },
  {
    code: "XEX",
    name: "Not Exact Match",
    example: "{8.XEX.'Blue'}",
    exampleMeaning: "Exclude exact Blue matches.",
    sourceNote: "Included in the working Lesson 4 operator lab.",
  },
  {
    code: "CT",
    name: "Contains",
    example: "{8.CT.'lu'}",
    exampleMeaning: "Favorite Color contains the supplied text.",
    sourceNote: "CT appears directly in the Quickbase REST query example.",
  },
  {
    code: "GT",
    name: "Greater Than",
    example: "{7.GT.30}",
    exampleMeaning: "Age is greater than 30.",
    sourceNote:
      "GT condition structure appears directly in the Records API documentation.",
  },
  {
    code: "GTE",
    name: "Greater Than or Equal",
    example: "{7.GTE.30}",
    exampleMeaning: "Age is at least 30.",
    sourceNote: "Included in the working Lesson 4 operator lab.",
  },
  {
    code: "LT",
    name: "Less Than",
    example: "{7.LT.30}",
    exampleMeaning: "Age is less than 30.",
    sourceNote: "Included in the working Lesson 4 operator lab.",
  },
  {
    code: "LTE",
    name: "Less Than or Equal",
    example: "{7.LTE.30}",
    exampleMeaning: "Age is no greater than 30.",
    sourceNote: "Included in the working Lesson 4 operator lab.",
  },
];

const workingCode = `function runOperatorQuery() {
  const fieldSelect =
    document.getElementById("queryField");

  const operatorSelect =
    document.getElementById("queryOperator");

  const valueInput =
    document.getElementById("queryValue");

  const preview =
    document.getElementById("queryPreview");

  const fieldId =
    fieldSelect.value;

  const fieldType =
    fieldSelect.options[
      fieldSelect.selectedIndex
    ].dataset.type;

  const operator =
    operatorSelect.value;

  const value =
    valueInput.value.trim();

  let comparisonValue;

  if (fieldType === "number") {
    comparisonValue = value;
  } else {
    comparisonValue = \`'\${value}'\`;
  }

  const where =
    \`{\${fieldId}.\${operator}.\${comparisonValue}}\`;

  preview.textContent = where;

  loadPeople(where);
}`;

export default function Lesson4Page() {
  return (
    <article>
      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="mb-10 border-b border-gray-300 pb-8">
        <p className="font-bold uppercase tracking-wide text-[#1f5c99]">
          Lesson 4
        </p>

        <h1 className="mt-2 text-4xl font-bold">Quickbase Query Operators</h1>

        <p className="mt-4 max-w-4xl text-xl">
          Lesson 3 taught us how to build one Quickbase query condition. Now we
          are going to examine the part in the middle that determines how
          Quickbase performs the comparison.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <span className="rounded-md border border-green-700 bg-green-50 px-3 py-1 text-sm font-bold text-green-900">
            Complete
          </span>

          <span className="rounded-md border border-gray-400 bg-white px-3 py-1 text-sm font-bold">
            QDL
          </span>

          <span className="rounded-md border border-gray-400 bg-white px-3 py-1 text-sm font-bold">
            REST where
          </span>

          <span className="rounded-md border border-gray-400 bg-white px-3 py-1 text-sm font-bold">
            Query Operators
          </span>
        </div>
      </header>

      {/* ======================================================
          CONNECTION TO LESSON 3
      ====================================================== */}

      <section className="mb-12">
        <h2 className="text-3xl font-bold">We Already Used a Query Operator</h2>

        <p className="mt-4">
          Lesson 3 searched Favorite Color with this Quickbase condition:
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6 text-xl">
          <code>{"{8.EX.'Blue'}"}</code>
        </pre>

        <p className="mt-4">
          At the time, we learned that <code>8</code> identified Favorite Color
          and <code>&apos;Blue&apos;</code> was the comparison value.
        </p>

        <p className="mt-4">
          But there was another Quickbase instruction sitting directly between
          them:
        </p>

        <div className="mt-6 rounded-lg border border-gray-300 bg-[#f7f8fa] p-6 text-center">
          <code className="text-4xl font-bold text-[#1f5c99]">EX</code>

          <p className="mt-3 text-xl font-bold">The Query Operator</p>
        </div>
      </section>

      {/* ======================================================
          OFFICIAL REST CONNECTION
      ====================================================== */}

      <section className="mb-12 rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6">
        <h2 className="text-2xl font-bold">Where This Fits in the REST API</h2>

        <p className="mt-4">
          The Quickbase REST specification defines <code>where</code> as the
          Quickbase query-language filter that determines which records are
          returned. If it is omitted, the query returns all records.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-white p-5">
          <code>{`const query = {
  from: TABLE_DBID,

  where: "{8.EX.'Blue'}",

  select: [3, 6, 7, 8]
};`}</code>
        </pre>

        <p className="mt-4">
          Lesson 4 does not introduce a different REST endpoint. We are learning
          more of the query language already being sent through{" "}
          <code>where</code>.
        </p>
      </section>

      {/* ======================================================
          INTERACTIVE REACT LAB
      ====================================================== */}

      <QueryOperatorLab />

      {/* ======================================================
          GRAMMAR
      ====================================================== */}

      <section className="mb-12">
        <h2 className="text-3xl font-bold">
          The Grammar of One Quickbase Condition
        </h2>

        <p className="mt-4">
          Stop looking at the condition as one mysterious string. It has three
          meaningful pieces:
        </p>

        <div className="mt-6 overflow-x-auto rounded-lg border border-gray-300 bg-[#111827] p-6 font-mono text-white">
          <div className="text-xl font-bold sm:text-2xl">
            {"{ 8 . EX . 'Blue' }"}
          </div>

          <div className="mt-6 grid gap-5 text-base md:grid-cols-3">
            <div>
              <div className="text-2xl font-bold">8</div>

              <div className="mt-2">Quickbase Field ID</div>

              <div className="mt-1">Favorite Color</div>
            </div>

            <div>
              <div className="text-2xl font-bold">EX</div>

              <div className="mt-2">Query Operator</div>

              <div className="mt-1">Determines the comparison</div>
            </div>

            <div>
              <div className="text-2xl font-bold">&apos;Blue&apos;</div>

              <div className="mt-2">Comparison Value</div>

              <div className="mt-1">Value supplied to Quickbase</div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-xl font-bold">Field → Operator → Value</p>

        <p className="mt-3">
          That is the foundational structure this lesson is teaching.
        </p>
      </section>

      {/* ======================================================
          OPERATOR REFERENCE
      ====================================================== */}

      <section className="mb-12">
        <h2 className="text-3xl font-bold">Operator Reference for This Lab</h2>

        <p className="mt-4">
          The working Lesson 4 Code Page exposes seven operator choices: EX,
          XEX, CT, GT, GTE, LT, and LTE.
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {operatorReference.map((operator) => (
            <div
              key={operator.code}
              className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <code className="text-3xl font-bold text-[#1f5c99]">
                    {operator.code}
                  </code>

                  <h3 className="mt-1 text-xl font-bold">{operator.name}</h3>
                </div>
              </div>

              <pre className="mt-4 overflow-x-auto rounded-md bg-[#f7f8fa] p-4">
                <code>{operator.example}</code>
              </pre>

              <p className="mt-3">{operator.exampleMeaning}</p>

              <p className="mt-3 text-sm">{operator.sourceNote}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-lg border border-amber-600 bg-amber-50 p-5">
          <p className="font-bold">Documentation boundary</p>

          <p className="mt-2">
            The REST specification we have in the project directly demonstrates
            EX, CT, and GT condition syntax. The remaining operators are
            present in the completed Lesson 4 Code
            Page, but the REST specification itself does not enumerate their
            definitions. For a formal operator reference, the dedicated
            Quickbase Query Language documentation remains the authoritative
            source.
          </p>
        </div>
      </section>

      {/* ======================================================
          TEXT VS NUMBER
      ====================================================== */}

      <section className="mb-12">
        <h2 className="text-3xl font-bold">
          Text and Numeric Comparison Values
        </h2>

        <p className="mt-4">
          Lesson 4 also exposes another useful part of query construction: the
          comparison value has a data type.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-gray-300 p-6">
            <p className="text-sm font-bold uppercase tracking-wide text-[#1f5c99]">
              Text Field
            </p>

            <h3 className="mt-2 text-2xl font-bold">Favorite Color</h3>

            <div className="mt-5 font-mono leading-8">
              <div>Blue</div>
              <div>↓</div>
              <div>&apos;Blue&apos;</div>
              <div>↓</div>
              <div className="font-bold">{"{8.EX.'Blue'}"}</div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-300 p-6">
            <p className="text-sm font-bold uppercase tracking-wide text-[#1f5c99]">
              Numeric Field
            </p>

            <h3 className="mt-2 text-2xl font-bold">Age</h3>

            <div className="mt-5 font-mono leading-8">
              <div>30</div>
              <div>↓</div>
              <div>30</div>
              <div>↓</div>
              <div className="font-bold">{"{7.GT.30}"}</div>
            </div>
          </div>
        </div>

        <p className="mt-6">
          The finished Code Page handles this distinction by checking the
          selected field&apos;s type before assembling the comparison value.
        </p>
      </section>

      {/* ======================================================
          THE REAL CODE CHANGE
      ====================================================== */}

      <section className="mb-12">
        <h2 className="text-3xl font-bold">The Important JavaScript Change</h2>

        <p className="mt-4">
          Lesson 3 hard-coded the search condition around Favorite Color and EX.
        </p>

        <p className="mt-4">Lesson 4 makes the three components variable:</p>

        <pre className="mt-5 max-h-175 overflow-auto rounded-lg border border-gray-300 bg-[#111111] p-6 text-sm leading-6 text-white">
          <code>{workingCode}</code>
        </pre>

        <p className="mt-6">The crucial line is:</p>

        <pre className="mt-4 overflow-x-auto rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-5 text-lg">
          <code>
            {"const where = `{${fieldId}.${operator}.${comparisonValue}}`;"}
          </code>
        </pre>

        <p className="mt-4">
          Once that line makes sense, the query is no longer something to
          memorize. It is something you can construct.
        </p>
      </section>

      {/* ======================================================
          WORKING CODE PAGE
      ====================================================== */}

      <section className="mb-12 rounded-xl border border-gray-300 bg-[#f7f8fa] p-6">
        <p className="text-sm font-bold uppercase tracking-wide text-[#1f5c99]">
          Working Quickbase Experiment
        </p>

        <h2 className="mt-2 text-2xl font-bold">PeoplePage_operators.html</h2>

        <p className="mt-4">
          The React lab above teaches the syntax. The actual Quickbase Code Page
          performs the real experiment: construct the condition, place it in
          REST <code>where</code>, send the query, and display only the matching
          records.
        </p>

        <div className="mt-6">
          <Link
            href="/files/PeoplePage_operators.txt"
            target="_blank"
            className="inline-flex rounded-md bg-[#1f5c99] px-5 py-3 font-bold text-white hover:bg-[#164875]"
          >
            View Lesson 4 Source →
          </Link>
        </div>
      </section>

      {/* ======================================================
          SCOPE
      ====================================================== */}

      <section className="mb-12 rounded-lg border-2 border-amber-700 bg-amber-50 p-6">
        <h2 className="text-2xl font-bold">
          Why We Are Stopping at One Condition
        </h2>

        <p className="mt-4">
          Quickbase query language can grow beyond one condition, but Lesson 4
          intentionally does not introduce AND, OR, or compound expressions.
        </p>

        <div className="mt-5 font-mono leading-8">
          <div>ONE FIELD</div>
          <div>↓</div>
          <div>ONE OPERATOR</div>
          <div>↓</div>
          <div>ONE VALUE</div>
          <div>↓</div>
          <div className="font-bold">ONE CONDITION</div>
        </div>

        <p className="mt-5">
          The training notes deliberately kept compound conditions outside this
          lesson so the student first understands the grammar of a single
          condition.
        </p>

        <p className="mt-4">
          Later, expressions containing several conditions will be much easier
          to read because each individual piece already has meaning.
        </p>
      </section>

      {/* ======================================================
          COMPLETE
      ====================================================== */}

      <section className="mb-12 rounded-lg border-2 border-green-700 bg-green-50 p-6">
        <h2 className="text-2xl font-bold text-green-950">Lesson 4 Complete</h2>

        <p className="mt-3">
          You should now be able to look at a condition such as:
        </p>

        <pre className="mt-4 overflow-x-auto rounded-md bg-white p-4">
          <code>{"{7.GTE.30}"}</code>
        </pre>

        <p className="mt-4">
          and recognize three independent Quickbase instructions: which field is
          being tested, how Quickbase should compare it, and what value it
          should compare against.
        </p>

        <p className="mt-4 font-bold">
          Lesson 3 taught us to send a condition. Lesson 4 taught us to read and
          construct the language inside that condition.
        </p>
      </section>

      {/* ======================================================
          NAVIGATION
      ====================================================== */}

      <div className="flex flex-col gap-4 border-t border-gray-300 pt-8 sm:flex-row sm:justify-between">
        <Link
          href="/lessons/3"
          className="inline-flex rounded-md border border-[#1f5c99] px-5 py-3 font-bold text-[#1f5c99] hover:bg-[#eaf3fb]"
        >
          ← Lesson 3: Search Criteria
        </Link>

        <Link
          href="/lessons/5"
          className="inline-flex rounded-md bg-[#1f5c99] px-5 py-3 font-bold text-white hover:bg-[#164875]"
        >
          Lesson 5: Add Records →
        </Link>
      </div>
    </article>
  );
}
