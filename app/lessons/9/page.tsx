"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ExplorerAction = "table" | "fields" | "relationships";

type FakeTable = {
  id: string;
  name: string;
  alias: string;
  description: string;
  created: string;
  updated: string;
  nextRecordId: number;
  nextFieldId: number;
  defaultSortFieldId: number;
  defaultSortOrder: "ASC" | "DESC";
  keyFieldId: number;
  singleRecordName: string;
  pluralRecordName: string;
};

const APP_DBID = "beqbhappylol";

const fakeTables: FakeTable[] = [
  {
    id: "bqpeople1",
    name: "People",
    alias: "_dbid_people",
    description: "People used throughout the Developer Lab.",
    created: "2026-08-01T13:00:00Z",
    updated: "2026-08-14T14:30:00Z",
    nextRecordId: 18,
    nextFieldId: 12,
    defaultSortFieldId: 6,
    defaultSortOrder: "ASC",
    keyFieldId: 3,
    singleRecordName: "Person",
    pluralRecordName: "People",
  },
  {
    id: "bqdepart1",
    name: "Departments",
    alias: "_dbid_departments",
    description: "Departments that may be related to People.",
    created: "2026-08-09T13:00:00Z",
    updated: "2026-08-14T14:30:00Z",
    nextRecordId: 8,
    nextFieldId: 10,
    defaultSortFieldId: 6,
    defaultSortOrder: "ASC",
    keyFieldId: 3,
    singleRecordName: "Department",
    pluralRecordName: "Departments",
  },
  {
    id: "bqtasks01",
    name: "Tasks",
    alias: "_dbid_tasks",
    description: "Tasks assigned to People.",
    created: "2026-08-10T13:00:00Z",
    updated: "2026-08-14T14:30:00Z",
    nextRecordId: 26,
    nextFieldId: 14,
    defaultSortFieldId: 6,
    defaultSortOrder: "ASC",
    keyFieldId: 3,
    singleRecordName: "Task",
    pluralRecordName: "Tasks",
  },
];

const fakeFields: Record<string, object[]> = {
  bqpeople1: [
    {
      id: 3,
      label: "Record ID#",
      fieldType: "recordid",
      mode: "virtual",
      required: false,
      unique: true,
      properties: {},
    },
    {
      id: 6,
      label: "Name",
      fieldType: "text",
      mode: "normal",
      required: true,
      unique: false,
      properties: {},
    },
    {
      id: 7,
      label: "Age",
      fieldType: "numeric",
      mode: "normal",
      required: false,
      unique: false,
      properties: {},
    },
    {
      id: 8,
      label: "Favorite Color",
      fieldType: "text",
      mode: "normal",
      required: false,
      unique: false,
      properties: {},
    },
    {
      id: 9,
      label: "Related Department",
      fieldType: "numeric",
      mode: "normal",
      required: false,
      unique: false,
      properties: {
        foreignKey: true,
      },
    },
    {
      id: 10,
      label: "Department Name",
      fieldType: "text",
      mode: "lookup",
      required: false,
      unique: false,
      properties: {},
    },
  ],

  bqdepart1: [
    {
      id: 3,
      label: "Record ID#",
      fieldType: "recordid",
      mode: "virtual",
      required: false,
      unique: true,
      properties: {},
    },
    {
      id: 6,
      label: "Department Name",
      fieldType: "text",
      mode: "normal",
      required: true,
      unique: true,
      properties: {},
    },
    {
      id: 7,
      label: "Active",
      fieldType: "checkbox",
      mode: "normal",
      required: false,
      unique: false,
      properties: {},
    },
  ],

  bqtasks01: [
    {
      id: 3,
      label: "Record ID#",
      fieldType: "recordid",
      mode: "virtual",
      required: false,
      unique: true,
      properties: {},
    },
    {
      id: 6,
      label: "Task",
      fieldType: "text",
      mode: "normal",
      required: true,
      unique: false,
      properties: {},
    },
    {
      id: 7,
      label: "Due Date",
      fieldType: "date",
      mode: "normal",
      required: false,
      unique: false,
      properties: {},
    },
    {
      id: 8,
      label: "Related Person",
      fieldType: "numeric",
      mode: "normal",
      required: false,
      unique: false,
      properties: {
        foreignKey: true,
      },
    },
    {
      id: 9,
      label: "Person Name",
      fieldType: "text",
      mode: "lookup",
      required: false,
      unique: false,
      properties: {},
    },
  ],
};

const fakeRelationships: Record<string, object> = {
  bqpeople1: {
    relationships: [
      {
        id: 1,
        parentTableId: "bqdepart1",
        childTableId: "bqpeople1",
        isCrossApp: false,
        foreignKeyField: {
          id: 9,
          label: "Related Department",
          type: "numeric",
        },
        lookupFields: [
          {
            id: 10,
            label: "Department Name",
            type: "text",
          },
        ],
        summaryFields: [],
      },
    ],
    metadata: {
      skip: 0,
      totalRelationships: 1,
      numRelationships: 1,
    },
  },

  bqdepart1: {
    relationships: [],
    metadata: {
      skip: 0,
      totalRelationships: 0,
      numRelationships: 0,
    },
  },

  bqtasks01: {
    relationships: [
      {
        id: 2,
        parentTableId: "bqpeople1",
        childTableId: "bqtasks01",
        isCrossApp: false,
        foreignKeyField: {
          id: 8,
          label: "Related Person",
          type: "numeric",
        },
        lookupFields: [
          {
            id: 9,
            label: "Person Name",
            type: "text",
          },
        ],
        summaryFields: [],
      },
    ],
    metadata: {
      skip: 0,
      totalRelationships: 1,
      numRelationships: 1,
    },
  },
};

export default function Lesson9Page() {
  const [selectedTableId, setSelectedTableId] = useState(fakeTables[0].id);

  const [action, setAction] = useState<ExplorerAction>("table");

  const [requestCount, setRequestCount] = useState(1);

  const selectedTable =
    fakeTables.find((table) => table.id === selectedTableId) ?? fakeTables[0];

  const endpoint = useMemo(() => {
    if (action === "table") {
      return `GET /v1/tables/${selectedTableId}` + `?appId=${APP_DBID}`;
    }

    if (action === "fields") {
      return `GET /v1/fields` + `?tableId=${selectedTableId}`;
    }

    return `GET /v1/tables/${selectedTableId}` + `/relationships`;
  }, [action, selectedTableId]);

  const output = useMemo(() => {
    if (action === "table") {
      return selectedTable;
    }

    if (action === "fields") {
      return fakeFields[selectedTableId] ?? [];
    }

    return (
      fakeRelationships[selectedTableId] ?? {
        relationships: [],
        metadata: {
          skip: 0,
          totalRelationships: 0,
          numRelationships: 0,
        },
      }
    );
  }, [action, selectedTable, selectedTableId]);

  const formattedOutput = JSON.stringify(output, null, 2);

  function runExplorerAction(nextAction: ExplorerAction) {
    setAction(nextAction);

    setRequestCount((count) => count + 1);
  }

  async function copyJson() {
    await navigator.clipboard.writeText(formattedOutput);
  }

  return (
    <section>
      {/* =========================================================
          LESSON HEADER
      ========================================================= */}

      <div className="mb-10 border-b border-gray-300 pb-8">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Lesson 9
        </p>
        <Link
          href="/files/QBSchemaExplorer.txt"
          target="_blank"
          className="font-bold text-[#1f5c99] underline"
        >
          Code Page Here - QBSchemaExplorer.html
        </Link>

        <h1 className="text-4xl font-bold">Quickbase Schema Discovery</h1>

        <p className="mt-4 max-w-4xl text-lg leading-8 text-gray-700">
          Before JavaScript can create tables, fields, and relationships
          dynamically, it helps to understand how Quickbase describes those same
          objects through the REST API.
        </p>
      </div>

      {/* =========================================================
          PRECURSOR
      ========================================================= */}

      <div className="mb-10 rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Precursor to Lesson 10
        </p>

        <h2 className="text-2xl font-bold">
          First Discover What Exists. Then Learn How to Create It.
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="rounded-lg border border-[#b8cfe5] bg-white p-5">
            <p className="font-bold text-[#1f5c99]">Lesson 9</p>

            <pre className="mt-4 overflow-x-auto text-sm leading-7">
              {`Quickbase
    ↓
describes application
    ↓
JavaScript
    ↓
tables
fields
relationships`}
            </pre>
          </div>

          <div className="rounded-lg border border-[#b8cfe5] bg-white p-5">
            <p className="font-bold text-[#1f5c99]">Lesson 10</p>

            <pre className="mt-4 overflow-x-auto text-sm leading-7">
              {`JavaScript
    ↓
describes what to create
    ↓
Quickbase
    ↓
new tables
new fields
new relationships`}
            </pre>
          </div>
        </div>
      </div>

      {/* =========================================================
          WHAT IS SCHEMA?
      ========================================================= */}

      <div className="mb-10">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          First Concept
        </p>

        <h2 className="text-3xl font-bold">
          Records Are Data. Schema Describes the Structure Holding the Data.
        </h2>

        <p className="mt-4 max-w-4xl leading-7 text-gray-700">
          Earlier lessons concentrated on People records. The Schema Explorer
          asks different questions. Instead of asking Quickbase &quot;which
          People records exist?&quot;, we ask it to describe the application
          itself.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
            <p className="font-bold text-[#1f5c99]">Record Data</p>

            <pre className="mt-4 overflow-x-auto rounded-md bg-[#f7f8fa] p-5 text-sm leading-7">
              {`Record ID# 14
Name: Walter
Age: 45
Favorite Color: Orange`}
            </pre>

            <p className="mt-4 leading-7 text-gray-700">
              Values stored inside a table.
            </p>
          </div>

          <div className="rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6">
            <p className="font-bold text-[#1f5c99]">Schema</p>

            <pre className="mt-4 overflow-x-auto rounded-md border border-[#b8cfe5] bg-white p-5 text-sm leading-7">
              {`Table: People
Table DBID: bqpeople1
Key Field ID: 3

Fields:
3 → Record ID#
6 → Name
7 → Age
8 → Favorite Color`}
            </pre>

            <p className="mt-4 leading-7">
              Information describing how the table is constructed.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================
          ROADMAP
      ========================================================= */}

      <div className="mb-10 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Lesson 9 Roadmap
        </p>

        <h2 className="text-2xl font-bold">
          Six Steps from Code Page to Universal Schema Explorer
        </h2>

        <div className="mt-6 grid gap-3">
          {[
            [
              "1",
              "Discover the App DBID",
              "Read the Quickbase Code Page URL instead of hard-coding the application.",
            ],
            [
              "2",
              "Ask Quickbase for its tables",
              "Use the discovered App DBID with GET /v1/tables.",
            ],
            [
              "3",
              "Build a dynamic table selector",
              "Turn Quickbase's table response into choices the developer can select.",
            ],
            [
              "4",
              "Resolve the selected Table DBID",
              "Read the table selection only when an inspection action actually occurs.",
            ],
            [
              "5",
              "Inspect table, field, and relationship schema",
              "Use different REST endpoints to ask Quickbase about different parts of the structure.",
            ],
            [
              "6",
              "Preserve the raw JSON",
              "Study exactly what Quickbase returns before transforming it into another structure.",
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

          <h2 className="text-2xl font-bold">
            Discover the App DBID from the Code Page URL
          </h2>
        </div>

        <p className="max-w-4xl leading-7 text-gray-700">
          Earlier lessons could safely hard-code a single People table because
          they were teaching one known table. A reusable schema tool cannot make
          that assumption.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#18212b] p-5 text-sm leading-7 text-white">
          {`function getAppDbid() {
  const match =
    window.location.pathname.match(
      /\\/db\\/([^/]+)/,
    );

  if (!match) {
    throw new Error(
      "Could not determine the App DBID " +
      "from the Quickbase URL.",
    );
  }

  return match[1];
}

const APP_DBID = getAppDbid();`}
        </pre>

        <div className="mt-5 rounded-lg border border-gray-300 bg-[#f7f8fa] p-5">
          <pre className="overflow-x-auto text-sm leading-7">
            {`/db/bv3asij6q?a=dbpage&pageID=15
    └───────┘
      App DBID`}
          </pre>
        </div>
      </div>

      {/* =========================================================
          APP VS TABLE
      ========================================================= */}

      <div className="mb-10 rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Beginner Trap #1
        </p>

        <h2 className="text-2xl font-bold">
          App DBID and Table DBID Are Not the Same Identifier
        </h2>

        <div className="mt-6 overflow-x-auto rounded-lg border border-[#b8cfe5] bg-white">
          <table className="w-full border-collapse text-left">
            <thead className="bg-[#1f5c99] text-white">
              <tr>
                <th className="px-4 py-3">Identifier</th>
                <th className="px-4 py-3">Identifies</th>
                <th className="px-4 py-3">Example</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 font-bold">App DBID</td>
                <td className="px-4 py-3">The Quickbase application</td>
                <td className="px-4 py-3">
                  <code>bv3asij6q</code>
                </td>
              </tr>

              <tr>
                <td className="px-4 py-3 font-bold">Table DBID</td>
                <td className="px-4 py-3">One table inside the application</td>
                <td className="px-4 py-3">
                  <code>bv9j6j4n5</code>
                </td>
              </tr>
            </tbody>
          </table>
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
            Ask the Application Which Tables Exist
          </h2>
        </div>

        <p className="max-w-4xl leading-7 text-gray-700">
          Once the App DBID is known, the Explorer can ask Quickbase for the
          tables belonging to that application.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#18212b] p-5 text-sm leading-7 text-white">
          {`const endpoint =
  \`https://api.quickbase.com/v1/tables?appId=\${APP_DBID}\`;`}
        </pre>

        <div className="mt-5 rounded-lg border-l-4 border-[#1f5c99] bg-[#f7f8fa] p-5">
          <p className="font-bold">
            The <code>appId</code> query parameter is required.
          </p>

          <p className="mt-2 leading-7 text-gray-700">
            During development, omitting it produced the HTTP 400 response:
          </p>

          <pre className="mt-3 overflow-x-auto text-sm">
            {`Required query 'appId' not found`}
          </pre>
        </div>
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
            Build the Table Selector from Quickbase
          </h2>
        </div>

        <p className="max-w-4xl leading-7 text-gray-700">
          Quickbase returns an array of table descriptions. JavaScript creates
          one option for every returned table.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#18212b] p-5 text-sm leading-7 text-white">
          {`tableSelect.replaceChildren();

for (const table of data) {
  const option =
    document.createElement("option");

  option.value = table.id;

  option.textContent =
    \`\${table.name} — \${table.id}\`;

  tableSelect.appendChild(option);
}`}
        </pre>

        <p className="mt-5 max-w-4xl leading-7 text-gray-700">
          The Code Page therefore does not need to know beforehand whether the
          application contains People, Orders, Tasks, Intake Assessments, or
          anything else.
        </p>
      </div>

      {/* =========================================================
          STARTUP TIMING
      ========================================================= */}

      <div className="mb-10 rounded-lg border-2 border-[#a66a00] bg-[#fff9ec] p-6">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#8a5700]">
          Beginner Trap #2
        </p>

        <h2 className="text-2xl font-bold">
          Do Not Ask for the Selected Table Before the Selector Has Been
          Populated
        </h2>

        <p className="mt-3 max-w-4xl leading-7">
          One development version called
          <code> getSelectedTableDbid()</code> at the top level of the script.
          At that moment the selector still contained only &quot;Loading
          tables...&quot;.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-amber-300 bg-white p-5 text-sm leading-7">
          {`SCRIPT STARTS
     ↓
getSelectedTableDbid()
     ↓
<select> is still empty
     ↓
throw Error(...)
     ↓
JavaScript stops
     ↓
DOMContentLoaded never gets wired
     ↓
getTables() never runs
     ↓
"Loading tables..." forever`}
        </pre>

        <p className="mt-5 font-bold">
          The selected Table DBID belongs inside the button action, when a real
          selection exists.
        </p>
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
            Resolve the Selected Table Only When It Is Needed
          </h2>
        </div>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#18212b] p-5 text-sm leading-7 text-white">
          {`function getSelectedTableDbid() {
  const tableSelect =
    document.getElementById(
      "tableSelect",
    );

  const tableDbid =
    tableSelect.value;

  if (!tableDbid) {
    throw new Error(
      "Select a Quickbase table first.",
    );
  }

  return tableDbid;
}`}
        </pre>

        <p className="mt-5 max-w-4xl leading-7 text-gray-700">
          Then each inspection function obtains the current selection
          independently:
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#f7f8fa] p-5 text-sm leading-7">
          {`async function getFields() {
  const tableDbid =
    getSelectedTableDbid();

  ...
}`}
        </pre>
      </div>

      {/* =========================================================
          INTERACTIVE EXPLORER
      ========================================================= */}

      <div className="mb-10 rounded-xl border-2 border-[#1f5c99] bg-white p-6 shadow-sm">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Interactive Schema Explorer
        </p>

        <h2 className="text-3xl font-bold">
          Explore a Simulated Quickbase Application
        </h2>

        <p className="mt-3 max-w-4xl leading-7 text-gray-700">
          This training version uses fake schema data locally. It mirrors the
          interaction of the working Code Page without making a live Quickbase
          request.
        </p>

        {/* APP DISCOVERY */}

        <div className="mt-7 rounded-lg border border-gray-300 bg-[#f7f8fa] p-5">
          <p className="text-sm font-bold uppercase tracking-wide text-gray-600">
            Simulated Code Page URL
          </p>

          <code className="mt-2 block overflow-x-auto text-[#003366]">
            /db/{APP_DBID}?a=dbpage&pageID=15
          </code>

          <p className="mt-4 text-sm font-bold uppercase tracking-wide text-gray-600">
            Discovered App DBID
          </p>

          <code className="mt-2 block text-xl font-bold text-[#1f5c99]">
            {APP_DBID}
          </code>
        </div>

        {/* TABLE SELECTOR */}

        <div className="mt-6">
          <label htmlFor="schemaTable" className="mb-2 block font-bold">
            Select Table
          </label>

          <select
            id="schemaTable"
            value={selectedTableId}
            onChange={(event) => setSelectedTableId(event.target.value)}
            className="w-full rounded-md border border-gray-400 bg-white px-3 py-3 text-lg outline-none focus:border-[#1f5c99] focus:ring-2 focus:ring-[#1f5c99]/20"
          >
            {fakeTables.map((table) => (
              <option key={table.id} value={table.id}>
                {table.name} — {table.id}
              </option>
            ))}
          </select>
        </div>

        {/* ACTIONS */}

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => runExplorerAction("table")}
            className="rounded-md bg-[#1f5c99] px-5 py-3 font-bold text-white transition hover:bg-[#174a7c]"
          >
            Get Table
          </button>

          <button
            type="button"
            onClick={() => runExplorerAction("fields")}
            className="rounded-md bg-[#1f5c99] px-5 py-3 font-bold text-white transition hover:bg-[#174a7c]"
          >
            Get Fields
          </button>

          <button
            type="button"
            onClick={() => runExplorerAction("relationships")}
            className="rounded-md bg-[#1f5c99] px-5 py-3 font-bold text-white transition hover:bg-[#174a7c]"
          >
            Get Relationships
          </button>
        </div>

        {/* REQUEST */}

        <div className="mt-6 rounded-lg border-l-4 border-[#1f5c99] bg-[#eaf3fb] p-5">
          <p className="font-bold text-[#003366]">
            Simulated REST Request #{requestCount}
          </p>

          <code className="mt-3 block overflow-x-auto">{endpoint}</code>
        </div>

        {/* WHAT WE ASKED */}

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div
            className={
              action === "table"
                ? "rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-4"
                : "rounded-lg border border-gray-300 bg-[#f7f8fa] p-4"
            }
          >
            <p className="font-bold">Table Schema</p>

            <p className="mt-2 text-sm leading-6 text-gray-700">
              Name, DBID, key field, aliases, sort settings, and table
              properties.
            </p>
          </div>

          <div
            className={
              action === "fields"
                ? "rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-4"
                : "rounded-lg border border-gray-300 bg-[#f7f8fa] p-4"
            }
          >
            <p className="font-bold">Fields</p>

            <p className="mt-2 text-sm leading-6 text-gray-700">
              Field IDs, labels, types, modes, and properties.
            </p>
          </div>

          <div
            className={
              action === "relationships"
                ? "rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-4"
                : "rounded-lg border border-gray-300 bg-[#f7f8fa] p-4"
            }
          >
            <p className="font-bold">Relationships</p>

            <p className="mt-2 text-sm leading-6 text-gray-700">
              Parent table, child table, foreign key, lookups, and summaries.
            </p>
          </div>
        </div>

        {/* RAW JSON */}

        <div className="mt-7">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-t-lg border border-gray-300 bg-[#f3f7fb] px-4 py-3">
            <strong>Raw JSON Response</strong>

            <button
              type="button"
              onClick={copyJson}
              className="rounded-md border border-[#1f5c99] bg-white px-4 py-2 text-sm font-bold text-[#1f5c99] hover:bg-[#eaf3fb]"
            >
              Copy JSON
            </button>
          </div>

          <pre className="max-h-130 overflow-auto rounded-b-lg border-x border-b border-gray-300 bg-[#18212b] p-5 text-sm leading-7 text-white">
            {formattedOutput}
          </pre>
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
            Inspect Three Different Layers of Schema
          </h2>
        </div>

        <div className="mt-6 overflow-x-auto rounded-lg border border-gray-300">
          <table className="w-full border-collapse text-left">
            <thead className="bg-[#1f5c99] text-white">
              <tr>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Endpoint</th>
                <th className="px-4 py-3">Question</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              <tr>
                <td className="px-4 py-3 font-bold">Get Table</td>
                <td className="px-4 py-3">
                  <code>
                    /tables/{"{tableId}"}?appId=
                    {"{appId}"}
                  </code>
                </td>
                <td className="px-4 py-3">How is this table configured?</td>
              </tr>

              <tr>
                <td className="px-4 py-3 font-bold">Get Fields</td>
                <td className="px-4 py-3">
                  <code>
                    /fields?tableId=
                    {"{tableId}"}
                  </code>
                </td>
                <td className="px-4 py-3">What fields exist in this table?</td>
              </tr>

              <tr>
                <td className="px-4 py-3 font-bold">Get Relationships</td>
                <td className="px-4 py-3">
                  <code>
                    /tables/{"{tableId}"}
                    /relationships
                  </code>
                </td>
                <td className="px-4 py-3">
                  How is this child table related to other tables?
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================
          AUTH TROUBLE
      ========================================================= */}

      <div className="mb-10 rounded-lg border-2 border-[#a66a00] bg-[#fff9ec] p-6">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#8a5700]">
          Beginner Trap #3
        </p>

        <h2 className="text-2xl font-bold">
          A Correct Endpoint Can Still Fail Because Authorization Is Wrong
        </h2>

        <p className="mt-3 max-w-4xl leading-7">
          During development, the table endpoint was syntactically correct and
          still returned HTTP 401:
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-amber-300 bg-white p-5 text-sm">
          {`{
  "message": "Unauthorized",
  "description": "Invalid Authorization."
}`}
        </pre>

        <p className="mt-5 max-w-4xl leading-7">
          This is why API debugging must separate endpoint construction from
          authentication. A 400, 401, and JavaScript ReferenceError point to
          very different layers of the program.
        </p>
      </div>

      {/* =========================================================
          DEBUGGING GUIDE
      ========================================================= */}

      <div className="mb-10 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Debugging Guide from the Actual Build
        </p>

        <h2 className="text-2xl font-bold">
          The Error Message Tells You Which Layer to Investigate
        </h2>

        <div className="mt-6 overflow-x-auto rounded-lg border border-gray-300">
          <table className="w-full border-collapse text-left">
            <thead className="bg-[#1f5c99] text-white">
              <tr>
                <th className="px-4 py-3">Symptom</th>
                <th className="px-4 py-3">Likely Layer</th>
                <th className="px-4 py-3">Actual Lesson 9 Example</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3">HTTP 400</td>
                <td className="px-4 py-3">Request parameters</td>
                <td className="px-4 py-3">
                  Required <code>appId</code> missing.
                </td>
              </tr>

              <tr>
                <td className="px-4 py-3">HTTP 401</td>
                <td className="px-4 py-3">Authorization</td>
                <td className="px-4 py-3">
                  Invalid authorization for the request.
                </td>
              </tr>

              <tr>
                <td className="px-4 py-3">Loading tables forever</td>
                <td className="px-4 py-3">JavaScript startup</td>
                <td className="px-4 py-3">
                  Selection read before the dropdown existed.
                </td>
              </tr>

              <tr>
                <td className="px-4 py-3">ReferenceError</td>
                <td className="px-4 py-3">JavaScript variable scope</td>
                <td className="px-4 py-3">
                  Old <code>TABLE_DBID</code> reference remained after making
                  the page dynamic.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================
          STEP 6
      ========================================================= */}

      <div className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1f5c99] font-bold text-white">
            6
          </span>

          <h2 className="text-2xl font-bold">Preserve the Raw JSON First</h2>
        </div>

        <p className="max-w-4xl leading-7 text-gray-700">
          The finished Explorer deliberately does not transform the schema
          response into custom tables or diagrams. It displays
          <strong> exactly what Quickbase returned</strong>.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#18212b] p-5 text-sm leading-7 text-white">
          {`const data =
  await response.json();

output.textContent =
  JSON.stringify(
    data,
    null,
    2,
  );`}
        </pre>

        <div className="mt-5 rounded-lg border-l-4 border-[#1f5c99] bg-[#f7f8fa] p-5">
          <p className="font-bold">Why raw JSON?</p>

          <p className="mt-2 leading-7 text-gray-700">
            Before writing code that creates relationships, we need to
            understand the property names and identifiers Quickbase uses to
            describe existing relationships. Transformation can come later.
          </p>
        </div>
      </div>

      {/* =========================================================
          RELATIONSHIP PREPARATION
      ========================================================= */}

      <div className="mb-10 rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Preparing for Relationships
        </p>

        <h2 className="text-2xl font-bold">
          Relationship JSON Gives Lesson 10 Its Vocabulary
        </h2>

        <p className="mt-3 max-w-4xl leading-7">
          Quickbase&apos;s relationship response describes the parent table,
          child table, foreign key field, lookup fields, summary fields, and
          whether the relationship crosses applications.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-[#b8cfe5] bg-white p-5 text-sm leading-7">
          {`Relationship
├── parentTableId
├── childTableId
├── foreignKeyField
├── lookupFields
├── summaryFields
└── isCrossApp`}
        </pre>

        <p className="mt-5 leading-7">
          Those names are about to become much more consequential when
          JavaScript starts telling Quickbase what relationship to create.
        </p>
      </div>

      {/* =========================================================
          UNIVERSAL ARCHITECTURE
      ========================================================= */}

      <div className="mb-10 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          The Big Upgrade
        </p>

        <h2 className="text-3xl font-bold">
          We Removed the Hard-Coded Application Structure
        </h2>

        <pre className="mt-6 overflow-x-auto rounded-lg bg-[#f7f8fa] p-5 text-sm leading-7">
          {`Quickbase Code Page starts
        ↓
Discover App DBID from URL
        ↓
GET /tables?appId=...
        ↓
Quickbase returns table list
        ↓
Build table dropdown
        ↓
Developer selects table
        ↓
Read selected Table DBID
      /       |        \\
     /        |         \\
    ↓         ↓          ↓
 Table      Fields   Relationships
 Schema     Schema      Schema
    \\         |          /
     \\        |         /
      └── Raw JSON ─────┘`}
        </pre>
      </div>

      {/* =========================================================
          PORTABILITY QUALIFICATION
      ========================================================= */}

      <div className="mb-10 rounded-lg border border-gray-300 bg-[#f7f8fa] p-6">
        <p className="font-bold">What “Universal” Means Here</p>

        <p className="mt-3 max-w-4xl leading-7 text-gray-700">
          The Explorer dynamically discovers the Quickbase application and its
          tables, so the same Code Page can inspect different apps without
          hard-coded App or Table DBIDs. The user still needs appropriate
          Quickbase permissions, temporary REST authorization must work in that
          environment, and an application token may still be required by the
          app&apos;s configuration.
        </p>
      </div>

      {/* =========================================================
          COMPLETE FLOW
      ========================================================= */}

      <div className="mb-10 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Complete Schema Discovery Flow
        </p>

        <h2 className="text-2xl font-bold">
          DISCOVER → ENUMERATE → SELECT → INSPECT
        </h2>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#f7f8fa] p-5 text-sm leading-7">
          {`Code Page opens
      ↓
getAppDbid()
      ↓
APP_DBID
      ↓
getTemporaryToken(APP_DBID)
      ↓
GET /v1/tables?appId=APP_DBID
      ↓
Quickbase returns tables
      ↓
Populate dropdown
      ↓
Developer selects table
      ↓
getSelectedTableDbid()
      ↓
TABLE_DBID
      ↓
Choose inspection
      ↓
┌─────────────────────────┐
│ GET TABLE               │
│ GET FIELDS              │
│ GET RELATIONSHIPS       │
└─────────────────────────┘
      ↓
Quickbase returns schema
      ↓
JSON.stringify(data, null, 2)
      ↓
Raw schema visible`}
        </pre>
      </div>

      {/* =========================================================
          LESSON COMPLETE
      ========================================================= */}

      <div className="rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Lesson 9 Complete
        </p>

        <h2 className="text-3xl font-bold">
          We Can Now Ask Quickbase What an Application Is Made Of
        </h2>

        <p className="mt-4 max-w-4xl text-lg leading-8">
          The Schema Explorer discovers its application, retrieves its tables,
          dynamically selects a table, and inspects table, field, and
          relationship metadata without depending on a hard-coded table
          structure.
        </p>

        <div className="mt-6 rounded-lg border border-[#b8cfe5] bg-white p-5">
          <pre className="overflow-x-auto text-sm font-bold leading-8">
            {`LESSON 9

Quickbase
    ↓
"What already exists?"
    ↓
JavaScript understands schema


LESSON 10

JavaScript
    ↓
"Create this structure."
    ↓
Quickbase builds schema`}
          </pre>
        </div>

        <div className="mt-6 border-t border-[#b8cfe5] pt-5">
          <p className="font-bold text-[#1f5c99]">
            Next: Lesson 10 — Creating Tables, Fields, and Relationships
          </p>

          <p className="mt-2 max-w-4xl leading-7">
            Now that we understand how Quickbase describes application
            structure, we can begin sending schema instructions in the opposite
            direction.
          </p>
        </div>
      </div>
    </section>
  );
}
