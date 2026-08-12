"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Person = {
  recordId: number;
  name: string;
  age: number;
  favoriteColor: string;
};

type QueryResult = {
  records: Person[];
  metadata: {
    totalRecords: number;
    numRecords: number;
    top: number;
    skip: number;
  };
};

const peopleRecords: Person[] = [
  {
    recordId: 1,
    name: "Alice",
    age: 23,
    favoriteColor: "Blue",
  },
  {
    recordId: 12,
    name: "Anne",
    age: 42,
    favoriteColor: "White",
  },
  {
    recordId: 2,
    name: "Bob",
    age: 51,
    favoriteColor: "Green",
  },
  {
    recordId: 3,
    name: "Charlie",
    age: 35,
    favoriteColor: "Orange",
  },
  {
    recordId: 4,
    name: "David",
    age: 29,
    favoriteColor: "Purple",
  },
  {
    recordId: 5,
    name: "Emma",
    age: 38,
    favoriteColor: "Red",
  },
  {
    recordId: 6,
    name: "Frank",
    age: 46,
    favoriteColor: "Blue",
  },
  {
    recordId: 7,
    name: "Grace",
    age: 31,
    favoriteColor: "Yellow",
  },
  {
    recordId: 8,
    name: "Henry",
    age: 27,
    favoriteColor: "Green",
  },
  {
    recordId: 9,
    name: "Irene",
    age: 55,
    favoriteColor: "Purple",
  },
];

function simulateQuickbaseQuery(top: number, skip: number): QueryResult {
  /*
    IMPORTANT:

    This function simulates what Quickbase is doing.

    In the real Code Page, JavaScript does NOT use slice()
    to paginate the returned Quickbase records.

    Instead, top and skip are sent to Quickbase in the
    REST query.

    We use slice() here only because this tutorial page
    needs a safe local simulation without making a real
    Quickbase API call.
  */

  const records = peopleRecords.slice(skip, skip + top);

  return {
    records,

    metadata: {
      totalRecords: peopleRecords.length,
      numRecords: records.length,
      top,
      skip,
    },
  };
}

export default function Lesson8Page() {
  const [topInput, setTopInput] = useState(2);
  const [skipInput, setSkipInput] = useState(0);

  const [queryTop, setQueryTop] = useState(2);
  const [querySkip, setQuerySkip] = useState(0);

  const [queryCount, setQueryCount] = useState(1);

  const [error, setError] = useState("");

  const result = useMemo(
    () => simulateQuickbaseQuery(queryTop, querySkip),
    [queryTop, querySkip],
  );

  const requestPreview = useMemo(
    () =>
      JSON.stringify(
        {
          from: "PEOPLE_TABLE_DBID",

          select: [3, 6, 7, 8],

          options: {
            top: queryTop,
            skip: querySkip,
          },

          sortBy: [
            {
              fieldId: 6,
              order: "ASC",
            },
          ],
        },
        null,
        2,
      ),
    [queryTop, querySkip],
  );

  function runQuery() {
    if (!Number.isInteger(topInput) || topInput < 1) {
      setError("Top must be a whole number of 1 or greater.");

      return;
    }

    if (!Number.isInteger(skipInput) || skipInput < 0) {
      setError("Skip must be a whole number of 0 or greater.");

      return;
    }

    setError("");

    setQueryTop(topInput);
    setQuerySkip(skipInput);

    setQueryCount((count) => count + 1);
  }

  function runExperiment(top: number, skip: number) {
    setTopInput(top);
    setSkipInput(skip);

    setQueryTop(top);
    setQuerySkip(skip);

    setError("");

    setQueryCount((count) => count + 1);
  }

  const firstReturnedRecord = result.records[0];

  const lastReturnedRecord = result.records[result.records.length - 1];

  return (
    <section>
      {/* =========================================================
          LESSON HEADER
      ========================================================= */}

      <div className="mb-10 border-b border-gray-300 pb-8">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Lesson 8
        </p>
        <Link
          href="/files/PeoplePage_pagination.txt"
          target="_blank"
          className="font-bold text-[#1f5c99] underline"
        >
          Code Page Here - PeoplePage_pagination.html
        </Link>
        <h1 className="text-4xl font-bold">Query Metadata and Pagination</h1>

        <p className="mt-4 max-w-4xl text-lg leading-8 text-gray-700">
          Control how many records Quickbase returns, decide how many records
          should be skipped, inspect the JSON request, and watch the response
          metadata change with every query.
        </p>
      </div>

      {/* =========================================================
          OBJECTIVE
      ========================================================= */}

      <div className="mb-10 rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Lesson Objective
        </p>

        <h2 className="text-2xl font-bold">
          Request Controlled Portions of a Quickbase Result Set
        </h2>

        <p className="mt-3 max-w-4xl leading-7">
          Instead of asking Quickbase to return every matching record at once,
          use <code>top</code> and <code>skip</code> to request a specific
          portion of the result set.
        </p>
      </div>

      {/* =========================================================
          IMPORTANT CONCEPT
      ========================================================= */}

      <div className="mb-10">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          The Important Change
        </p>

        <h2 className="text-3xl font-bold">
          Pagination Happens in the Quickbase Request
        </h2>

        <p className="mt-4 max-w-4xl leading-7 text-gray-700">
          Lesson 2 manipulated records after they had already reached
          JavaScript. Lesson 8 does something fundamentally different.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
            <p className="font-bold text-[#1f5c99]">Client-Side Manipulation</p>

            <pre className="mt-4 overflow-x-auto rounded-md bg-[#f7f8fa] p-5 text-sm leading-7">
              {`Quickbase
    ↓
All returned records
    ↓
JavaScript
    ↓
Manipulate locally`}
            </pre>
          </div>

          <div className="rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6">
            <p className="font-bold text-[#1f5c99]">Quickbase Pagination</p>

            <pre className="mt-4 overflow-x-auto rounded-md border border-[#b8cfe5] bg-white p-5 text-sm leading-7">
              {`JavaScript
    ↓
top / skip
    ↓
Quickbase REST API
    ↓
Only requested portion
    ↓
JavaScript`}
            </pre>
          </div>
        </div>
      </div>

      {/* =========================================================
          DEFINITIONS
      ========================================================= */}

      <div className="mb-10 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Two Pagination Controls
        </p>

        <h2 className="text-2xl font-bold">Understanding top and skip</h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="rounded-lg border border-gray-300 bg-[#f7f8fa] p-5">
            <code className="text-xl font-bold text-[#1f5c99]">top</code>

            <p className="mt-3 leading-7 text-gray-700">
              The maximum number of records Quickbase should return in this
              request.
            </p>

            <pre className="mt-4 rounded-md bg-white p-4 text-sm">
              {`top: 2

"Return no more than
2 records."`}
            </pre>
          </div>

          <div className="rounded-lg border border-gray-300 bg-[#f7f8fa] p-5">
            <code className="text-xl font-bold text-[#1f5c99]">skip</code>

            <p className="mt-3 leading-7 text-gray-700">
              The number of matching records Quickbase should move past before
              returning data.
            </p>

            <pre className="mt-4 rounded-md bg-white p-4 text-sm">
              {`skip: 2

"Move past the first
2 records."`}
            </pre>
          </div>
        </div>
      </div>

      {/* =========================================================
          ROADMAP
      ========================================================= */}

      <div className="mb-10 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Lesson 8 Roadmap
        </p>

        <h2 className="text-2xl font-bold">
          Five Steps Through a Paginated REST Query
        </h2>

        <p className="mt-3 max-w-4xl leading-7 text-gray-700">
          First understand the two values. Then change them yourself and watch
          the request, metadata, and returned records respond together.
        </p>

        <div className="mt-6 grid gap-3">
          {[
            [
              "1",
              "Choose top and skip",
              "Decide how many records Quickbase may return and where the returned portion should begin.",
            ],
            [
              "2",
              "Build the JSON request",
              "Place those values inside the REST query options object.",
            ],
            [
              "3",
              "Send the query",
              "Quickbase receives the pagination instructions as part of POST /v1/records/query.",
            ],
            [
              "4",
              "Inspect response metadata",
              "Compare totalRecords, numRecords, top, and skip.",
            ],
            [
              "5",
              "Inspect the returned records",
              "See exactly which People records belong to that portion of the result set.",
            ],
          ].map(([number, title, description]) => (
            <div
              key={number}
              className="flex items-center gap-4 rounded-lg border border-gray-200 bg-[#f7f8fa] p-4"
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1f5c99] font-bold text-white">
                {number}
              </span>

              <div>
                <p className="font-bold">{title}</p>

                <p className="mt-1 text-sm text-gray-600">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================
          STEP 1
      ========================================================= */}

      <div className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1f5c99] font-bold text-white">
            1
          </span>

          <h2 className="text-2xl font-bold">Choose top and skip</h2>
        </div>

        <p className="max-w-4xl leading-7 text-gray-700">
          The working Code Page changed <code>loadPeople()</code> so the
          pagination values could be supplied instead of being permanently
          hardcoded.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#18212b] p-5 text-sm leading-7 text-white">
          {`async function loadPeople(
  top = 2,
  skip = 0,
) {
  ...
}`}
        </pre>

        <p className="mt-5 max-w-4xl leading-7 text-gray-700">
          That means these two calls request different portions of the same
          result set:
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#f7f8fa] p-5 text-sm leading-7">
          {`loadPeople(2, 0);
// return up to 2 records,
// skipping none

loadPeople(2, 2);
// skip the first 2,
// then return up to 2`}
        </pre>
      </div>

      {/* =========================================================
          LIVE REACT LAB
      ========================================================= */}

      <div className="mb-10 rounded-xl border-2 border-[#1f5c99] bg-white p-6 shadow-sm">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Interactive REST Pagination Lab
        </p>

        <h2 className="text-3xl font-bold">Simulate the Quickbase Request</h2>

        <p className="mt-3 max-w-4xl leading-7 text-gray-700">
          This training instrument uses local template People records. No
          Quickbase API call is made from this tutorial page. The controls
          simulate the same <code>top</code>, <code>skip</code>, response
          metadata, and returned-record behavior used by the working Code Page.
        </p>

        {/* -----------------------------------------
            INPUT CONTROLS
        ----------------------------------------- */}

        <div className="mt-7 grid gap-4 rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <div>
            <label htmlFor="topInput" className="mb-2 block font-bold">
              Records to return (<code>top</code>)
            </label>

            <input
              id="topInput"
              type="number"
              min={1}
              value={topInput}
              onChange={(event) => setTopInput(Number(event.target.value))}
              className="w-full rounded-md border border-gray-400 bg-white px-3 py-3 text-lg outline-none focus:border-[#1f5c99] focus:ring-2 focus:ring-[#1f5c99]/20"
            />
          </div>

          <div>
            <label htmlFor="skipInput" className="mb-2 block font-bold">
              Records to skip (<code>skip</code>)
            </label>

            <input
              id="skipInput"
              type="number"
              min={0}
              value={skipInput}
              onChange={(event) => setSkipInput(Number(event.target.value))}
              className="w-full rounded-md border border-gray-400 bg-white px-3 py-3 text-lg outline-none focus:border-[#1f5c99] focus:ring-2 focus:ring-[#1f5c99]/20"
            />
          </div>

          <button
            type="button"
            onClick={runQuery}
            className="rounded-md bg-[#1f5c99] px-6 py-3 font-bold text-white transition hover:bg-[#174a7c]"
          >
            Run Fake Quickbase Query
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-md border border-red-300 bg-red-50 p-4 font-semibold text-red-800">
            {error}
          </div>
        )}

        {/* -----------------------------------------
            PRESET EXPERIMENTS
        ----------------------------------------- */}

        <div className="mt-5">
          <p className="font-bold">Try a prepared experiment</p>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => runExperiment(2, 0)}
              className="rounded-md border border-[#1f5c99] bg-white px-4 py-2 font-semibold text-[#1f5c99] transition hover:bg-[#eaf3fb]"
            >
              top 2 / skip 0
            </button>

            <button
              type="button"
              onClick={() => runExperiment(2, 2)}
              className="rounded-md border border-[#1f5c99] bg-white px-4 py-2 font-semibold text-[#1f5c99] transition hover:bg-[#eaf3fb]"
            >
              top 2 / skip 2
            </button>

            <button
              type="button"
              onClick={() => runExperiment(2, 4)}
              className="rounded-md border border-[#1f5c99] bg-white px-4 py-2 font-semibold text-[#1f5c99] transition hover:bg-[#eaf3fb]"
            >
              top 2 / skip 4
            </button>

            <button
              type="button"
              onClick={() => runExperiment(4, 8)}
              className="rounded-md border border-[#1f5c99] bg-white px-4 py-2 font-semibold text-[#1f5c99] transition hover:bg-[#eaf3fb]"
            >
              top 4 / skip 8
            </button>
          </div>
        </div>

        {/* -----------------------------------------
            EXECUTION STATUS
        ----------------------------------------- */}

        <div className="mt-6 rounded-lg border-l-4 border-[#1f5c99] bg-[#eaf3fb] p-5">
          <p className="font-bold text-[#003366]">
            Simulated API Call #{queryCount}
          </p>

          <p className="mt-2 leading-7">
            The simulated request asked Quickbase to skip{" "}
            <strong>{querySkip}</strong> record(s) and return a maximum of{" "}
            <strong>{queryTop}</strong>.
          </p>
        </div>

        {/* -----------------------------------------
            REQUEST PREVIEW
        ----------------------------------------- */}

        <div className="mt-6">
          <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
            JSON Request Sent to Quickbase
          </p>

          <pre className="overflow-x-auto rounded-lg bg-[#18212b] p-5 text-sm leading-7 text-white">
            {requestPreview}
          </pre>
        </div>

        {/* -----------------------------------------
            RESPONSE METADATA
        ----------------------------------------- */}

        <div className="mt-7">
          <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
            Simulated Quickbase Response Metadata
          </p>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-gray-300 bg-[#f7f8fa] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-600">
                Total Records
              </p>

              <p className="mt-2 text-3xl font-bold text-[#003366]">
                {result.metadata.totalRecords}
              </p>
            </div>

            <div className="rounded-lg border border-gray-300 bg-[#f7f8fa] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-600">
                Records Returned
              </p>

              <p className="mt-2 text-3xl font-bold text-[#003366]">
                {result.metadata.numRecords}
              </p>
            </div>

            <div className="rounded-lg border border-gray-300 bg-[#f7f8fa] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-600">
                Top
              </p>

              <p className="mt-2 text-3xl font-bold text-[#003366]">
                {result.metadata.top}
              </p>
            </div>

            <div className="rounded-lg border border-gray-300 bg-[#f7f8fa] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-600">
                Skip
              </p>

              <p className="mt-2 text-3xl font-bold text-[#003366]">
                {result.metadata.skip}
              </p>
            </div>
          </div>
        </div>

        {/* -----------------------------------------
            EXPLANATION
        ----------------------------------------- */}

        <div className="mt-6 rounded-lg border border-gray-300 bg-white p-5">
          <p className="font-bold">What just happened?</p>

          <p className="mt-3 leading-7 text-gray-700">
            There are <strong>{result.metadata.totalRecords}</strong> total
            matching records. Quickbase skipped{" "}
            <strong>{result.metadata.skip}</strong> and was allowed to return no
            more than <strong>{result.metadata.top}</strong>.
          </p>

          <p className="mt-3 leading-7 text-gray-700">
            The response contains <strong>{result.metadata.numRecords}</strong>{" "}
            record(s).
          </p>

          {result.metadata.numRecords < result.metadata.top && (
            <div className="mt-4 rounded-md border-l-4 border-[#1f5c99] bg-[#eaf3fb] p-4">
              <p className="font-bold">Notice: top is a maximum.</p>

              <p className="mt-2 leading-7">
                You requested up to {result.metadata.top} records, but only{" "}
                {result.metadata.numRecords} remained after skipping{" "}
                {result.metadata.skip}.
              </p>
            </div>
          )}

          {result.records.length > 0 && (
            <p className="mt-3 leading-7 text-gray-700">
              This portion begins with{" "}
              <strong>{firstReturnedRecord.name}</strong> and ends with{" "}
              <strong>{lastReturnedRecord.name}</strong>.
            </p>
          )}

          {result.records.length === 0 && (
            <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-4">
              <p className="font-bold">No records remain.</p>

              <p className="mt-2 leading-7">
                The skip value moved beyond the available result set.
              </p>
            </div>
          )}
        </div>

        {/* -----------------------------------------
            RETURNED RECORDS
        ----------------------------------------- */}

        <div className="mt-7">
          <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
            Records Returned by the Simulated API
          </p>

          <div className="overflow-x-auto rounded-lg border border-gray-300">
            <table className="w-full border-collapse text-left">
              <thead className="bg-[#1f5c99] text-white">
                <tr>
                  <th className="px-4 py-3">Record ID</th>

                  <th className="px-4 py-3">Name</th>

                  <th className="px-4 py-3">Age</th>

                  <th className="px-4 py-3">Favorite Color</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {result.records.map((person) => (
                  <tr key={person.recordId}>
                    <td className="px-4 py-3">{person.recordId}</td>

                    <td className="px-4 py-3 font-semibold">{person.name}</td>

                    <td className="px-4 py-3">{person.age}</td>

                    <td className="px-4 py-3">{person.favoriteColor}</td>
                  </tr>
                ))}

                {result.records.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      Quickbase would return no records for this portion.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* =========================================================
          STEP 2
      ========================================================= */}

      <div className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1f5c99] font-bold text-white">
            2
          </span>

          <h2 className="text-2xl font-bold">
            Put Pagination Inside the JSON Request
          </h2>
        </div>

        <p className="max-w-4xl leading-7 text-gray-700">
          In the working Quickbase Code Page,
          <code> top </code>
          and <code>skip</code> belong inside the query&apos;s{" "}
          <code>options</code> object.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#18212b] p-5 text-sm leading-7 text-white">
          {`const query = {
  from: TABLE_DBID,

  select: [
    FIELD_IDS.recordId,
    FIELD_IDS.name,
    FIELD_IDS.age,
    FIELD_IDS.favoriteColor,
  ],

  options: {
    top,
    skip,
  },

  sortBy: [
    {
      fieldId: FIELD_IDS.name,
      order: "ASC",
    },
  ],
};`}
        </pre>
      </div>

      {/* =========================================================
          AHA MOMENT
      ========================================================= */}

      <div className="mb-10 rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Aha Moment
        </p>

        <h2 className="text-2xl font-bold">
          top Does Not Mean “Return Exactly This Many”
        </h2>

        <p className="mt-3 max-w-4xl leading-7">
          It specifies the maximum number requested. Quickbase cannot return
          records that do not remain in the result set.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-[#b8cfe5] bg-white p-5 text-sm leading-7">
          {`totalRecords = 10
skip         = 8
top          = 4

10 total
- 8 skipped
-----------
  2 remain

numRecords = 2`}
        </pre>

        <p className="mt-5 leading-7">
          That distinction between <code>top</code> and <code>numRecords</code>{" "}
          is exactly why the response metadata matters.
        </p>
      </div>

      {/* =========================================================
          STEP 3
      ========================================================= */}

      <div className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1f5c99] font-bold text-white">
            3
          </span>

          <h2 className="text-2xl font-bold">
            Send a New REST Query Each Time
          </h2>
        </div>

        <p className="max-w-4xl leading-7 text-gray-700">
          The Run button reads the current control values and calls{" "}
          <code>loadPeople()</code>
          again with those values.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#18212b] p-5 text-sm leading-7 text-white">
          {`function runPaginationQuery() {
  const top = Number(
    document.getElementById(
      "topInput",
    ).value,
  );

  const skip = Number(
    document.getElementById(
      "skipInput",
    ).value,
  );

  loadPeople(
    top,
    skip,
  );
}`}
        </pre>

        <div className="mt-5 rounded-lg border-l-4 border-[#1f5c99] bg-[#f7f8fa] p-5">
          <p className="font-bold">This is not JavaScript pagination.</p>

          <p className="mt-2 leading-7 text-gray-700">
            The controls determine the values sent in a new Quickbase REST
            request. Quickbase returns the requested portion.
          </p>
        </div>
      </div>

      {/* =========================================================
          STEP 4
      ========================================================= */}

      <div className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1f5c99] font-bold text-white">
            4
          </span>

          <h2 className="text-2xl font-bold">
            Read Quickbase&apos;s Pagination Metadata
          </h2>
        </div>

        <p className="max-w-4xl leading-7 text-gray-700">
          The response metadata describes both the complete matching set and the
          particular portion returned by the request.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#18212b] p-5 text-sm leading-7 text-white">
          {`const metadata =
  parsed.metadata;

metadata.totalRecords;
metadata.numRecords;
metadata.top;
metadata.skip;`}
        </pre>

        <div className="mt-6 overflow-x-auto rounded-lg border border-gray-300">
          <table className="w-full border-collapse text-left">
            <thead className="bg-[#1f5c99] text-white">
              <tr>
                <th className="px-4 py-3">Metadata</th>

                <th className="px-4 py-3">Meaning</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              <tr>
                <td className="px-4 py-3 font-bold">
                  <code>totalRecords</code>
                </td>

                <td className="px-4 py-3">
                  Total records belonging to the complete query result.
                </td>
              </tr>

              <tr>
                <td className="px-4 py-3 font-bold">
                  <code>numRecords</code>
                </td>

                <td className="px-4 py-3">
                  Number of records actually returned in this response.
                </td>
              </tr>

              <tr>
                <td className="px-4 py-3 font-bold">
                  <code>top</code>
                </td>

                <td className="px-4 py-3">Maximum number requested.</td>
              </tr>

              <tr>
                <td className="px-4 py-3 font-bold">
                  <code>skip</code>
                </td>

                <td className="px-4 py-3">
                  Number of records moved past before results began.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================
          STEP 5
      ========================================================= */}

      <div className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1f5c99] font-bold text-white">
            5
          </span>

          <h2 className="text-2xl font-bold">
            Use skip to Move Through the Result Set
          </h2>
        </div>

        <p className="max-w-4xl leading-7 text-gray-700">
          With a page size of two, moving through the records means increasing
          skip by two each time.
        </p>

        <div className="mt-6 overflow-x-auto rounded-lg border border-gray-300 bg-white">
          <table className="w-full border-collapse text-left">
            <thead className="bg-[#1f5c99] text-white">
              <tr>
                <th className="px-4 py-3">Request</th>

                <th className="px-4 py-3">top</th>

                <th className="px-4 py-3">skip</th>

                <th className="px-4 py-3">Portion Requested</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 font-bold">First</td>
                <td className="px-4 py-3">2</td>
                <td className="px-4 py-3">0</td>
                <td className="px-4 py-3">Records 1–2</td>
              </tr>

              <tr>
                <td className="px-4 py-3 font-bold">Second</td>
                <td className="px-4 py-3">2</td>
                <td className="px-4 py-3">2</td>
                <td className="px-4 py-3">Records 3–4</td>
              </tr>

              <tr>
                <td className="px-4 py-3 font-bold">Third</td>
                <td className="px-4 py-3">2</td>
                <td className="px-4 py-3">4</td>
                <td className="px-4 py-3">Records 5–6</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================
          COMPLETE FLOW
      ========================================================= */}

      <div className="mb-10 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Complete Pagination Flow
        </p>

        <h2 className="text-2xl font-bold">
          INPUT → JSON → QUICKBASE → METADATA → RECORDS
        </h2>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#f7f8fa] p-5 text-sm leading-7">
          {`Choose top and skip
      ↓
Run Quickbase Query
      ↓
loadPeople(top, skip)
      ↓
Build options
{
  top,
  skip
}
      ↓
POST /v1/records/query
      ↓
Quickbase processes pagination
      ↓
JSON response
      ↓
metadata
├── totalRecords
├── numRecords
├── top
└── skip
      ↓
data[]
      ↓
Render only returned records`}
        </pre>
      </div>

      {/* =========================================================
          WHY NEXT/PREVIOUS COMES LATER
      ========================================================= */}

      <div className="mb-10 rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Why We Did Not Start with Previous / Next
        </p>

        <h2 className="text-2xl font-bold">
          Buttons Would Hide the Interesting Part
        </h2>

        <p className="mt-3 max-w-4xl leading-7">
          Once the learner understands <code>top</code>, <code>skip</code>, and
          response metadata, Previous and Next buttons become straightforward.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-[#b8cfe5] bg-white p-5 text-sm leading-7">
          {`NEXT

skip = skip + top


PREVIOUS

skip = skip - top`}
        </pre>

        <p className="mt-5 leading-7">
          The user interface is merely automating values we now understand.
        </p>
      </div>

      {/* =========================================================
          LESSON COMPLETE
      ========================================================= */}

      <div className="rounded-lg border border-gray-300 bg-[#f7f8fa] p-6">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Lesson 8 Complete
        </p>

        <h2 className="text-2xl font-bold">
          You Can Now Control How Much Data Quickbase Returns
        </h2>

        <p className="mt-3 max-w-4xl leading-7 text-gray-700">
          You used <code>top</code> and <code>skip</code> to define a portion of
          a result set, inspected the JSON request, interpreted Quickbase
          response metadata, and observed how the returned records change as the
          pagination values change.
        </p>

        <div className="mt-6 border-t border-gray-300 pt-5">
          <p className="font-bold text-[#1f5c99]">
            Next: Lesson 9 — Relationships
          </p>

          <p className="mt-2 max-w-4xl leading-7 text-gray-700">
            We now know how to read, query, create, update, delete, and paginate
            records. The next lesson moves beyond a single table and begins
            exploring how Quickbase tables relate to one another.
          </p>
        </div>
      </div>
    </section>
  );
}
