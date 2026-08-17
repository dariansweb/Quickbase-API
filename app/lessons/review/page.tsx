    import Link from "next/link";

/* ============================================================
   REUSABLE PAGE COMPONENTS
   ============================================================ */

function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <p className="mb-2 font-bold uppercase tracking-[0.12em] text-[#1f5c99]">
          {eyebrow}
        </p>
      )}

      <h2 className="text-3xl font-bold text-[#003366]">{title}</h2>

      {children && (
        <div className="mt-4 max-w-4xl text-lg leading-8">{children}</div>
      )}
    </div>
  );
}

function CodeBlock({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="my-6 overflow-hidden rounded-lg border border-gray-300 bg-white">
      {title && (
        <div className="border-b border-gray-300 bg-[#f3f7fb] px-5 py-3 font-bold text-[#003366]">
          {title}
        </div>
      )}

      <pre className="overflow-x-auto p-5 text-[15px] leading-7">
        <code>{children}</code>
      </pre>
    </div>
  );
}

function ReviewCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold text-[#003366]">{title}</h3>

      <div className="mt-4 leading-7">{children}</div>
    </div>
  );
}

function Aha({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="my-8 rounded-lg border-2 border-[#d4a72c] bg-[#fffaf0] p-6">
      <p className="mb-2 font-bold uppercase tracking-wide text-[#7a5200]">
        Remember This
      </p>

      <h3 className="text-xl font-bold">{title}</h3>

      <div className="mt-3 leading-8">{children}</div>
    </div>
  );
}

function EndpointRow({
  purpose,
  method,
  endpoint,
}: {
  purpose: string;
  method: string;
  endpoint: string;
}) {
  return (
    <tr className="border-b border-gray-300 last:border-b-0">
      <td className="p-4 font-semibold">{purpose}</td>

      <td className="p-4">
        <span className="inline-flex rounded-md bg-[#1f5c99] px-3 py-1 font-bold text-white">
          {method}
        </span>
      </td>

      <td className="p-4">
        <code className="break-all">{endpoint}</code>
      </td>
    </tr>
  );
}

function VocabularyItem({
  term,
  children,
}: {
  term: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-gray-300 bg-white p-5">
      <dt className="font-bold text-[#003366]">{term}</dt>

      <dd className="mt-2 leading-7">{children}</dd>
    </div>
  );
}

/* ============================================================
   PAGE
   ============================================================ */

export default function CapstonePage() {
  return (
    <article className="mx-auto max-w-6xl pb-20 text-black">
      {/* ========================================================
          CAPSTONE HEADER
      ======================================================== */}

      <header className="mb-12 overflow-hidden rounded-xl border border-[#164875] bg-[#1f5c99] text-white">
        <div className="px-6 py-10 sm:px-8 lg:px-10">
          <p className="mb-3 font-bold uppercase tracking-[0.18em]">
            Developer Lab Capstone
          </p>

          <h1 className="max-w-5xl text-4xl font-extrabold leading-tight sm:text-5xl">
            Quickbase REST API Developer Review
          </h1>

          <p className="mt-6 max-w-4xl text-xl leading-9 text-white">
            You began by asking Quickbase for records. By the end of the lab,
            your JavaScript could inspect Quickbase&apos;s schema, discover
            identifiers, create new schema, construct relationships, capture
            returned metadata, and verify what Quickbase actually created.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/lessons"
              className="inline-flex rounded-md bg-white px-5 py-3 font-bold text-[#1f5c99] hover:bg-[#eef5fb]"
            >
              Table of Contents
            </Link>

            <Link
              href="/lessons/10"
              className="inline-flex rounded-md border-2 border-white px-5 py-3 font-bold text-white hover:bg-white hover:text-[#1f5c99]"
            >
              Review Lesson 10
            </Link>
          </div>
        </div>
      </header>

      {/* ========================================================
          THE WHOLE JOURNEY
      ======================================================== */}

      <section className="mb-14">
        <SectionHeading
          eyebrow="The Big Picture"
          title="What the Laboratory Actually Taught"
        >
          <p>
            Individual lessons deliberately focused on one concept at a time.
            The capstone removes those boundaries and shows how the pieces form
            one coherent Quickbase development model.
          </p>
        </SectionHeading>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <ReviewCard title="Data">
            <div className="space-y-2 font-semibold">
              <p>READ records</p>
              <p>ADD records</p>
              <p>EDIT records</p>
              <p>DELETE records</p>
            </div>
          </ReviewCard>

          <ReviewCard title="Querying">
            <div className="space-y-2 font-semibold">
              <p>Search criteria</p>
              <p>Query operators</p>
              <p>Sorting</p>
              <p>Pagination</p>
            </div>
          </ReviewCard>

          <ReviewCard title="Metadata">
            <div className="space-y-2 font-semibold">
              <p>App DBID</p>
              <p>Table DBID</p>
              <p>Field ID</p>
              <p>Table / Field / Relationship schema</p>
            </div>
          </ReviewCard>

          <ReviewCard title="Schema Construction">
            <div className="space-y-2 font-semibold">
              <p>Create tables</p>
              <p>Create fields</p>
              <p>Create relationships</p>
              <p>Capture and verify returned identifiers</p>
            </div>
          </ReviewCard>
        </div>
      </section>

      {/* ========================================================
          COURSE EVOLUTION
      ======================================================== */}

      <section className="mb-14">
        <SectionHeading
          eyebrow="Evolution"
          title="From One Record Query to Application Construction"
        >
          <p>
            The project gradually moved from working with data inside an
            existing Quickbase application to programmatically understanding and
            modifying the application&apos;s structure itself.
          </p>
        </SectionHeading>

        <div className="space-y-4">
          {[
            [
              "Lessons 1A–1B",
              "Read records",
              "Compare the legacy XML API with the modern REST JSON API.",
            ],
            [
              "Lesson 2",
              "Control returned data in JavaScript",
              "Sort the records after Quickbase returns them.",
            ],
            [
              "Lesson 3",
              "Control what Quickbase returns",
              "Move searching into the REST query instead of filtering everything in the browser.",
            ],
            [
              "Lesson 4",
              "Understand query operators",
              "Use EX, XEX, GT, GTE, LT, LTE and learn how Quickbase interprets query criteria.",
            ],
            [
              "Lessons 5–7",
              "Complete CRUD",
              "Create, read, update, and delete Quickbase records through the REST API.",
            ],
            [
              "Lesson 8",
              "Control result-set slices",
              "Use top, skip, and response metadata to understand server-side pagination.",
            ],
            [
              "Lesson 9",
              "Discover schema",
              "Find the current app, its tables, table metadata, fields, Field IDs, and child-side relationships.",
            ],
            [
              "Lesson 10",
              "Construct schema",
              "Create tables, fields, and relationships dynamically and verify what Quickbase builds automatically.",
            ],
          ].map(([lesson, title, description]) => (
            <div
              key={lesson}
              className="grid gap-3 rounded-lg border border-gray-300 bg-white p-5 md:grid-cols-[170px_230px_1fr] md:items-start"
            >
              <p className="font-bold text-[#1f5c99]">{lesson}</p>

              <p className="font-bold text-[#003366]">{title}</p>

              <p className="leading-7">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          REST ENDPOINT MAP
      ======================================================== */}

      <section className="mb-14">
        <SectionHeading
          eyebrow="REST Map"
          title="Endpoints Used Throughout the Developer Lab"
        >
          <p>
            These are the Quickbase REST endpoints that became the working
            vocabulary of the project.
          </p>
        </SectionHeading>

        <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white">
          <table className="w-full min-w-190 border-collapse">
            <thead className="bg-[#003366] text-white">
              <tr>
                <th className="p-4 text-left">Purpose</th>
                <th className="p-4 text-left">Method</th>
                <th className="p-4 text-left">Quickbase Endpoint</th>
              </tr>
            </thead>

            <tbody>
              <EndpointRow
                purpose="Read / query records"
                method="POST"
                endpoint="/v1/records/query"
              />

              <EndpointRow
                purpose="Add records"
                method="POST"
                endpoint="/v1/records"
              />

              <EndpointRow
                purpose="Edit records"
                method="POST"
                endpoint="/v1/records"
              />

              <EndpointRow
                purpose="Delete records"
                method="DELETE"
                endpoint="/v1/records"
              />

              <EndpointRow
                purpose="List app tables"
                method="GET"
                endpoint="/v1/tables?appId={APP_DBID}"
              />

              <EndpointRow
                purpose="Get one table"
                method="GET"
                endpoint="/v1/tables/{TABLE_DBID}?appId={APP_DBID}"
              />

              <EndpointRow
                purpose="Create table"
                method="POST"
                endpoint="/v1/tables?appId={APP_DBID}"
              />

              <EndpointRow
                purpose="Get fields"
                method="GET"
                endpoint="/v1/fields?tableId={TABLE_DBID}"
              />

              <EndpointRow
                purpose="Create field"
                method="POST"
                endpoint="/v1/fields?tableId={TABLE_DBID}"
              />

              <EndpointRow
                purpose="Get relationships"
                method="GET"
                endpoint="/v1/tables/{CHILD_TABLE_DBID}/relationships"
              />

              <EndpointRow
                purpose="Create relationship"
                method="POST"
                endpoint="/v1/tables/{CHILD_TABLE_DBID}/relationship"
              />
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================
          COMMON REST REQUEST ANATOMY
      ======================================================== */}

      <section className="mb-14">
        <SectionHeading
          eyebrow="Recurring Pattern"
          title="Most Requests Share the Same Architecture"
        >
          <p>
            The payload changes. The endpoint changes. The HTTP method may
            change. But the overall REST conversation remains recognizable.
          </p>
        </SectionHeading>

        <CodeBlock title="General request pattern">
          {`const response = await fetch(endpoint, {
  method: "POST",

  headers: {
    "QB-Realm-Hostname": REALM,
    Authorization: \`QB-TEMP-TOKEN \${temporaryToken}\`,
    "Content-Type": "application/json"
  },

  body: JSON.stringify(payload)
});

const data = await response.json();

if (!response.ok) {
  throw new Error(
    \`HTTP \${response.status}: \${JSON.stringify(data)}\`
  );
}`}
        </CodeBlock>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <ReviewCard title="Method">
            <p>Describes the operation: GET, POST, DELETE, and so forth.</p>
          </ReviewCard>

          <ReviewCard title="Endpoint">
            <p>Identifies the Quickbase API resource being accessed.</p>
          </ReviewCard>

          <ReviewCard title="Headers">
            <p>
              Carry realm information, authorization, and representation details
              such as JSON content type.
            </p>
          </ReviewCard>

          <ReviewCard title="Payload">
            <p>
              Supplies the record values, query criteria, field definition, or
              relationship definition needed by that operation.
            </p>
          </ReviewCard>
        </div>
      </section>

      {/* ========================================================
          IDENTIFIER CONTEXT
      ======================================================== */}

      <section className="mb-14">
        <SectionHeading
          eyebrow="Identifier Context"
          title="Know Which Kind of Quickbase Object You Are Addressing"
        >
          <p>
            Quickbase development quickly becomes easier once identifiers are
            treated as part of an object hierarchy instead of as arbitrary
            strings and numbers.
          </p>
        </SectionHeading>

        <CodeBlock>
          {`Application
    ↓
App DBID

Table
    ↓
Table DBID

Field
    ↓
Field ID / FID

Record
    ↓
Record ID#`}
        </CodeBlock>

        <Aha title="A Field ID is not application-wide">
          <p>
            FID 6 can simultaneously represent Department Name in Departments,
            Name in People, and Task Name in Tasks. The Table DBID supplies the
            context that makes the Field ID meaningful.
          </p>
        </Aha>

        <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white">
          <table className="w-full min-w-150 border-collapse">
            <thead className="bg-[#003366] text-white">
              <tr>
                <th className="p-4 text-left">Table</th>
                <th className="p-4 text-left">Field</th>
                <th className="p-4 text-left">FID</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b border-gray-300">
                <td className="p-4">Departments</td>
                <td className="p-4">Department Name</td>
                <td className="p-4 font-mono">6</td>
              </tr>

              <tr className="border-b border-gray-300">
                <td className="p-4">People</td>
                <td className="p-4">Name</td>
                <td className="p-4 font-mono">6</td>
              </tr>

              <tr>
                <td className="p-4">Tasks</td>
                <td className="p-4">Task Name</td>
                <td className="p-4 font-mono">6</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================
          AUTHORIZATION
      ======================================================== */}

      <section className="mb-14">
        <SectionHeading
          eyebrow="Authorization"
          title="The Code Page Operates Inside Quickbase Security"
        >
          <p>
            The training Code Pages used the signed-in Quickbase session to
            obtain temporary REST authorization. An Application Token could also
            be included when the application required one.
          </p>
        </SectionHeading>

        <CodeBlock title="Temporary authorization">
          {`const response = await fetch(
  \`https://api.quickbase.com/v1/auth/temporary/\${dbid}\`,
  {
    method: "GET",
    credentials: "include",

    headers: {
      "QB-Realm-Hostname": REALM
    }
  }
);`}
        </CodeBlock>

        <p className="leading-8">
          The lab also uncovered an important scope distinction: some operations
          are table-oriented while others require application context. The DBID
          supplied when requesting temporary authorization therefore matters.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <ReviewCard title="Table-scoped examples">
            <p>Get Fields</p>
            <p>Get Relationships</p>
            <p>Record operations against a table</p>
          </ReviewCard>

          <ReviewCard title="App-scoped examples">
            <p>List Tables</p>
            <p>Get Table metadata with app context</p>
            <p>Create Table</p>
          </ReviewCard>
        </div>
      </section>

      {/* ========================================================
          REQUEST RESPONSE CHAIN
      ======================================================== */}

      <section className="mb-14">
        <SectionHeading
          eyebrow="One of the Most Important Patterns"
          title="Quickbase Responses Feed Later Requests"
        >
          <p>
            By Lesson 10, requests were no longer isolated events. Quickbase
            returned identifiers that JavaScript retained and then supplied to
            subsequent operations.
          </p>
        </SectionHeading>

        <CodeBlock>
          {`REQUEST
   ↓
QUICKBASE
   ↓
RESPONSE
   ↓
CAPTURE IDENTIFIER
   ↓
NEXT REQUEST`}
        </CodeBlock>

        <div className="mt-6 rounded-xl border-2 border-[#1f5c99] bg-[#f3f7fb] p-6">
          <p className="text-xl font-bold text-[#003366]">
            Actual Lesson 10 Dependency Chain
          </p>

          <div className="mt-5 font-mono leading-8">
            Create Departments
            <br />
            ↓<br />
            Quickbase returns Table DBID
            <br />
            ↓<br />
            Create Department Name + Location
            <br />
            ↓<br />
            Quickbase returns Field IDs
            <br />
            ↓<br />
            Create Departments → People
            <br />
            ↓<br />
            Quickbase returns relationship metadata
          </div>
        </div>

        <Aha title="Success is often not the most useful part of the response">
          <p>
            The important result may be the new Record ID, Field ID, Table DBID,
            Relationship ID, metadata count, or another value needed by the next
            operation.
          </p>
        </Aha>
      </section>

      {/* ========================================================
          CRUD SYNTHESIS
      ======================================================== */}

      <section className="mb-14">
        <SectionHeading
          eyebrow="CRUD Review"
          title="One Records Endpoint, Several Different Outcomes"
        />

        <div className="grid gap-5 md:grid-cols-3">
          <ReviewCard title="CREATE">
            <CodeBlock>
              {`POST /v1/records

{
  6: { value: "Walter" },
  7: { value: 44 },
  8: { value: "Orange" }
}`}
            </CodeBlock>

            <p>
              No existing Record ID# is supplied. Quickbase creates a new record
              and reports it through metadata such as
              <code> createdRecordIds</code>.
            </p>
          </ReviewCard>

          <ReviewCard title="UPDATE">
            <CodeBlock>
              {`POST /v1/records

{
  3: { value: 14 },
  6: { value: "Walter" },
  7: { value: 45 },
  8: { value: "Orange" }
}`}
            </CodeBlock>

            <p>
              The key field identifies the existing record. Quickbase reports
              the update through metadata such as
              <code> updatedRecordIds</code>.
            </p>
          </ReviewCard>

          <ReviewCard title="DELETE">
            <CodeBlock>
              {`DELETE /v1/records

{
  from: TABLE_DBID,
  where: "{3.EX.'14'}"
}`}
            </CodeBlock>

            <p>
              Quickbase evaluates the deletion criteria and reports how many
              records were removed through
              <code> numberDeleted</code>.
            </p>
          </ReviewCard>
        </div>
      </section>

      {/* ========================================================
          QUERYING SYNTHESIS
      ======================================================== */}

      <section className="mb-14">
        <SectionHeading
          eyebrow="Querying Review"
          title="Ask Quickbase for the Data You Actually Need"
        >
          <p>
            One of the major shifts in the lab was moving work away from
            unnecessary client-side array manipulation and into the Quickbase
            query itself.
          </p>
        </SectionHeading>

        <CodeBlock title="Server-side query">
          {`const query = {
  from: TABLE_DBID,

  select: [
    FIELD_IDS.recordId,
    FIELD_IDS.name,
    FIELD_IDS.age,
    FIELD_IDS.favoriteColor
  ],

  where: "{8.EX.'Blue'}",

  sortBy: [
    {
      fieldId: FIELD_IDS.name,
      order: "ASC"
    }
  ],

  options: {
    top: 2,
    skip: 0
  }
};`}
        </CodeBlock>

        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <ReviewCard title="select">
            <p>Which fields should Quickbase return?</p>
          </ReviewCard>

          <ReviewCard title="where">
            <p>Which records satisfy the query criteria?</p>
          </ReviewCard>

          <ReviewCard title="sortBy">
            <p>In what deterministic order should results be returned?</p>
          </ReviewCard>

          <ReviewCard title="options">
            <p>How many records should be returned, and how many skipped?</p>
          </ReviewCard>
        </div>
      </section>

      {/* ========================================================
          PAGINATION REVIEW
      ======================================================== */}

      <section className="mb-14">
        <SectionHeading
          eyebrow="Pagination"
          title="The Browser Changes the Instructions; Quickbase Slices the Result"
        />

        <CodeBlock>
          {`options: {
  top: 2,
  skip: 0
}

// first two records

options: {
  top: 2,
  skip: 2
}

// next two records

options: {
  top: 2,
  skip: 4
}

// next two records`}
        </CodeBlock>

        <p className="leading-8">
          JavaScript did not download every record and then slice the array.
          Each request told Quickbase which portion of the ordered result set to
          return.
        </p>

        <div className="mt-6 overflow-x-auto rounded-lg border border-gray-300 bg-white">
          <table className="w-full min-w-162.5 border-collapse">
            <thead className="bg-[#003366] text-white">
              <tr>
                <th className="p-4 text-left">Metadata</th>
                <th className="p-4 text-left">Meaning</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b border-gray-300">
                <td className="p-4 font-mono">totalRecords</td>
                <td className="p-4">
                  Total records in the complete query result set.
                </td>
              </tr>

              <tr className="border-b border-gray-300">
                <td className="p-4 font-mono">numRecords</td>
                <td className="p-4">
                  Number of records returned in this response.
                </td>
              </tr>

              <tr className="border-b border-gray-300">
                <td className="p-4 font-mono">top</td>
                <td className="p-4">Maximum number of records requested.</td>
              </tr>

              <tr>
                <td className="p-4 font-mono">skip</td>
                <td className="p-4">
                  Number of ordered records Quickbase passes over first.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================
          SCHEMA DISCOVERY
      ======================================================== */}

      <section className="mb-14">
        <SectionHeading
          eyebrow="Schema Discovery"
          title="Lesson 9 Changed the Scale of the Project"
        >
          <p>
            Until Lesson 9, the application structure was mostly something we
            already knew. The Schema Explorer showed that Quickbase can describe
            its own application structure through REST metadata.
          </p>
        </SectionHeading>

        <CodeBlock>
          {`Code Page URL
     ↓
Discover APP_DBID
     ↓
GET /v1/tables?appId=APP_DBID
     ↓
Populate table selector
     ↓
User selects a table
     ↓
Get Table
Get Fields
Get Relationships`}
        </CodeBlock>

        <div className="grid gap-5 md:grid-cols-3">
          <ReviewCard title="Get Table">
            <p>
              Discover table metadata such as DBID, alias, key field, default
              sorting, next Field ID, next Record ID, storage, and timestamps.
            </p>
          </ReviewCard>

          <ReviewCard title="Get Fields">
            <p>
              Discover labels, field types, Field IDs, properties, primary-key
              and foreign-key behavior, formulas, choices, and other field
              metadata.
            </p>
          </ReviewCard>

          <ReviewCard title="Get Relationships">
            <p>
              Discover parent/child relationships, reference fields, lookup
              fields, summaries, and relationship metadata.
            </p>
          </ReviewCard>
        </div>
      </section>

      {/* ========================================================
          SOURCE OF TRUTH
      ======================================================== */}

      <section className="mb-14">
        <SectionHeading
          eyebrow="State"
          title="Quickbase Became the Source of Truth"
        >
          <p>
            Lesson 10 introduced a more sophisticated application-development
            principle: browser memory is temporary, but the Quickbase schema is
            authoritative.
          </p>
        </SectionHeading>

        <CodeBlock>
          {`PAGE LOAD
    ↓
Discover App DBID
    ↓
GET tables
    ↓
Find People / Departments / Tasks
    ↓
GET fields
    ↓
GET relationships
    ↓
Reconstruct lessonState
    ↓
Determine completed work
    ↓
Enable the next valid action`}
        </CodeBlock>

        <Aha title="Do not trust transient memory when the authoritative system can be queried">
          <p>
            Closing or refreshing the browser resets JavaScript variables, but
            it does not erase the Quickbase schema. The lesson can ask Quickbase
            what actually exists and rebuild its client-side state.
          </p>
        </Aha>
      </section>

      {/* ========================================================
          JS VS QB
      ======================================================== */}

      <section className="mb-14">
        <SectionHeading
          eyebrow="Responsibility Boundary"
          title="What JavaScript Controls vs. What Quickbase Controls"
        />

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border-2 border-[#1f5c99] bg-[#f3f7fb] p-6">
            <h3 className="text-2xl font-bold text-[#003366]">
              JavaScript Controls
            </h3>

            <div className="mt-5 space-y-2">
              <p>HTTP method</p>
              <p>Endpoint</p>
              <p>Request headers</p>
              <p>Request body / payload</p>
              <p>Query criteria</p>
              <p>Which identifiers are supplied</p>
              <p>Which response values are retained</p>
              <p>What is rendered into the Code Page</p>
            </div>
          </div>

          <div className="rounded-lg border-2 border-[#d4a72c] bg-[#fffaf0] p-6">
            <h3 className="text-2xl font-bold text-[#654700]">
              Quickbase Controls
            </h3>

            <div className="mt-5 space-y-2">
              <p>Assigned Table DBIDs</p>
              <p>Assigned Field IDs</p>
              <p>Assigned Record IDs</p>
              <p>System fields</p>
              <p>Relationship implementation</p>
              <p>Reference fields</p>
              <p>Lookup fields</p>
              <p>Returned metadata</p>
              <p>Validation and errors</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          QB HELPS MORE
      ======================================================== */}

      <section className="mb-14">
        <SectionHeading
          eyebrow="Higher-Level Operations"
          title="Quickbase Often Creates More Than We Explicitly Requested"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <ReviewCard title="Create a Table">
            <CodeBlock title="We Request">{`Departments`}</CodeBlock>

            <CodeBlock title="Quickbase Also Creates">
              {`Date Created
Date Modified
Record ID#
Record Owner
Last Modified By`}
            </CodeBlock>
          </ReviewCard>

          <ReviewCard title="Create a Relationship">
            <CodeBlock title="We Request">{`Departments → People`}</CodeBlock>

            <CodeBlock title="Quickbase Also Creates">
              {`Related Department
Department Name lookup
Department - Location lookup`}
            </CodeBlock>
          </ReviewCard>
        </div>

        <Aha title="REST operations can represent higher-level application operations">
          <p>
            A Quickbase REST operation is not always a simple one-request,
            one-object database mutation. Some requests tell Quickbase to
            perform an application-level operation that requires additional
            supporting schema.
          </p>
        </Aha>
      </section>

      {/* ========================================================
          CHILD-SIDE RELATIONSHIPS
      ======================================================== */}

      <section className="mb-14">
        <SectionHeading
          eyebrow="Relationship Review"
          title="Read Relationship Metadata From the Child Side"
        />

        <CodeBlock>
          {`Departments
    ↓
People

People contains:
  Related Department
  ↑
  reference / foreign-key field`}
        </CodeBlock>

        <p className="leading-8">
          Querying the People relationship endpoint exposes the Departments →
          People relationship because the reference field lives on People, the
          child.
        </p>

        <p className="mt-4 leading-8">
          Querying Departments may legitimately return:
        </p>

        <CodeBlock>
          {`{
  "relationships": []
}`}
        </CodeBlock>

        <p className="leading-8">
          That does not mean Departments is unrelated. It reflects the
          child-oriented design of the relationship endpoint.
        </p>
      </section>

      {/* ========================================================
          VOCABULARY
      ======================================================== */}

      <section className="mb-14">
        <SectionHeading
          eyebrow="Vocabulary"
          title="Quickbase REST API Terms Worth Remembering"
        />

        <dl className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <VocabularyItem term="Realm">
            The Quickbase realm hostname identifying the Quickbase environment
            where the application lives.
          </VocabularyItem>

          <VocabularyItem term="App DBID">
            The unique identifier of a Quickbase application.
          </VocabularyItem>

          <VocabularyItem term="Table DBID">
            The unique identifier of one table within an application.
          </VocabularyItem>

          <VocabularyItem term="Field ID / FID">
            The numeric identifier of a field within one specific table.
          </VocabularyItem>

          <VocabularyItem term="Record ID#">
            The normal Quickbase record identifier and default table key field.
          </VocabularyItem>

          <VocabularyItem term="Application Token">
            An application-level token that may be required by the
            application&apos;s security configuration.
          </VocabularyItem>

          <VocabularyItem term="Temporary Authorization">
            Short-lived REST authorization obtained using the signed-in
            Quickbase session.
          </VocabularyItem>

          <VocabularyItem term="REST Endpoint">
            The API URL representing the Quickbase resource or operation being
            accessed.
          </VocabularyItem>

          <VocabularyItem term="HTTP Method">
            GET, POST, DELETE, or another HTTP verb defining the requested
            operation.
          </VocabularyItem>

          <VocabularyItem term="Request Header">
            Request metadata such as realm, authorization, and content type.
          </VocabularyItem>

          <VocabularyItem term="Payload">
            JSON sent in the request body to define data, criteria, fields,
            tables, or relationships.
          </VocabularyItem>

          <VocabularyItem term="Response">
            The HTTP and JSON result returned by Quickbase after processing the
            request.
          </VocabularyItem>

          <VocabularyItem term="Metadata">
            Additional information Quickbase returns about an operation or
            result set.
          </VocabularyItem>

          <VocabularyItem term="Query Criteria">
            Quickbase query syntax describing which records should match.
          </VocabularyItem>

          <VocabularyItem term="Query Operator">
            Operators such as EX, XEX, GT, GTE, LT, and LTE that determine how
            values are compared.
          </VocabularyItem>

          <VocabularyItem term="top">
            The maximum number of records requested from a query.
          </VocabularyItem>

          <VocabularyItem term="skip">
            The number of ordered records Quickbase passes over before returning
            results.
          </VocabularyItem>

          <VocabularyItem term="Parent Table">
            The one-side table in a Quickbase relationship.
          </VocabularyItem>

          <VocabularyItem term="Child Table">
            The table containing the reference/foreign-key field.
          </VocabularyItem>

          <VocabularyItem term="Reference Field">
            The child-side field storing the relationship reference to the
            parent record.
          </VocabularyItem>

          <VocabularyItem term="Lookup Field">
            A child-side field whose value is derived from a field on the
            related parent record.
          </VocabularyItem>

          <VocabularyItem term="Relationship ID">
            In the relationship behavior observed during the lab, Quickbase
            identifies the relationship through the child-side reference field.
          </VocabularyItem>

          <VocabularyItem term="Schema">
            The structural definition of the application: tables, fields,
            relationships, and their metadata.
          </VocabularyItem>
        </dl>
      </section>

      {/* ========================================================
          CODE READING CHALLENGE
      ======================================================== */}

      <section className="mb-14">
        <SectionHeading
          eyebrow="Final Challenge"
          title="Read the Code and Predict What Quickbase Will Do"
        >
          <p>
            These questions intentionally test Quickbase understanding rather
            than JavaScript syntax.
          </p>
        </SectionHeading>

        <div className="space-y-7">
          <div className="rounded-lg border border-gray-300 bg-white p-6">
            <h3 className="text-xl font-bold text-[#003366]">
              Challenge 1 — Create a Field
            </h3>

            <CodeBlock>
              {`const endpoint =
  \`https://api.quickbase.com/v1/fields?tableId=\${tableDbid}\`;

const payload = {
  label: "Location",
  fieldType: "text"
};`}
            </CodeBlock>

            <div className="space-y-3 leading-7">
              <p>
                <strong>1.</strong> What HTTP method should be used?
              </p>

              <p>
                <strong>2.</strong> What does <code>tableDbid</code> identify?
              </p>

              <p>
                <strong>3.</strong> Who assigns the resulting Field ID?
              </p>

              <p>
                <strong>4.</strong> Where should JavaScript obtain that FID?
              </p>
            </div>

            <details className="mt-5 rounded-lg border border-[#9fbad5] bg-[#f3f7fb] p-4">
              <summary className="cursor-pointer font-bold text-[#003366]">
                Show Answer
              </summary>

              <div className="mt-4 space-y-2 leading-7">
                <p>Use POST.</p>
                <p>
                  <code>tableDbid</code> identifies the target Quickbase table.
                </p>
                <p>Quickbase assigns the Field ID.</p>
                <p>
                  JavaScript should read the ID from the successful Quickbase
                  response, such as <code>data.id</code>.
                </p>
              </div>
            </details>
          </div>

          <div className="rounded-lg border border-gray-300 bg-white p-6">
            <h3 className="text-xl font-bold text-[#003366]">
              Challenge 2 — Create a Relationship
            </h3>

            <CodeBlock>
              {`{
  parentTableId: departmentsDbid,

  foreignKeyField: {
    label: "Related Department"
  },

  lookupFieldIds: [6, 7]
}`}
            </CodeBlock>

            <div className="space-y-3 leading-7">
              <p>
                <strong>1.</strong> Which table DBID belongs in the endpoint?
              </p>

              <p>
                <strong>2.</strong> Which table is the parent?
              </p>

              <p>
                <strong>3.</strong> Where will Related Department be created?
              </p>

              <p>
                <strong>4.</strong> Who creates the lookup fields?
              </p>

              <p>
                <strong>5.</strong> Why should we not separately POST those
                relationship lookup fields?
              </p>
            </div>

            <details className="mt-5 rounded-lg border border-[#9fbad5] bg-[#f3f7fb] p-4">
              <summary className="cursor-pointer font-bold text-[#003366]">
                Show Answer
              </summary>

              <div className="mt-4 space-y-2 leading-7">
                <p>The child table DBID belongs in the endpoint.</p>
                <p>Departments is the parent.</p>
                <p>
                  Related Department is created on the child as the
                  reference/foreign-key field.
                </p>
                <p>
                  Quickbase creates the requested lookup fields as part of the
                  relationship operation.
                </p>
                <p>
                  They should not be separately created because the relationship
                  operation is the higher-level schema operation responsible for
                  constructing those supporting fields.
                </p>
              </div>
            </details>
          </div>

          <div className="rounded-lg border border-gray-300 bg-white p-6">
            <h3 className="text-xl font-bold text-[#003366]">
              Challenge 3 — Explain This Query
            </h3>

            <CodeBlock>
              {`{
  from: TABLE_DBID,

  where: "{8.EX.'Blue'}",

  sortBy: [
    {
      fieldId: 6,
      order: "ASC"
    }
  ],

  options: {
    top: 2,
    skip: 2
  }
}`}
            </CodeBlock>

            <details className="mt-5 rounded-lg border border-[#9fbad5] bg-[#f3f7fb] p-4">
              <summary className="cursor-pointer font-bold text-[#003366]">
                Show Answer
              </summary>

              <p className="mt-4 leading-7">
                Quickbase queries the specified table, selects records whose
                Field ID 8 exactly equals Blue, orders the result by Field ID 6
                ascending, skips the first two ordered matches, and returns at
                most the next two.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* ========================================================
          DEBUGGING LESSONS
      ======================================================== */}

      <section className="mb-14">
        <SectionHeading
          eyebrow="Debugging"
          title="Several Bugs Taught Useful Lessons Too"
        />

        <div className="grid gap-5 md:grid-cols-2">
          <ReviewCard title="One stray test variable">
            <p>
              An abandoned <code>console.log(testUpdatePayload)</code> stopped
              the script before <code>DOMContentLoaded</code>, making the table
              appear broken even though the Quickbase logic was correct.
            </p>
          </ReviewCard>

          <ReviewCard title="One stray backtick">
            <p>
              A single accidental backtick caused a JavaScript syntax error,
              preventing every button&apos;s click handler from being
              registered.
            </p>
          </ReviewCard>

          <ReviewCard title="Wrong authorization scope">
            <p>
              App-level and table-level schema operations demonstrated that the
              DBID used for temporary authorization matters.
            </p>
          </ReviewCard>

          <ReviewCard title="Placeholder DBID">
            <p>
              Sending <code>YOUR_TABLE_DBID</code> literally produced a real
              Quickbase error and reinforced the difference between sample
              configuration and runtime identifiers.
            </p>
          </ReviewCard>
        </div>

        <Aha title="A failed page does not automatically mean a failed API">
          <p>
            JavaScript parsing errors, undefined variables, wrong identifiers,
            invalid authorization, malformed endpoints, and Quickbase API errors
            produce very different failure modes. Reading the console and the
            actual Quickbase response was part of the development process.
          </p>
        </Aha>
      </section>

      {/* ========================================================
          FINAL ARCHITECTURE
      ======================================================== */}

      <section className="mb-14">
        <SectionHeading
          eyebrow="Final Architecture"
          title="The Complete Mental Model"
        />

        <div className="overflow-x-auto rounded-xl border-2 border-[#1f5c99] bg-white p-6">
          <pre className="min-w-180 text-center font-mono text-[15px] leading-8 sm:text-base">
            {`                 QUICKBASE APPLICATION
                         │
          ┌──────────────┴──────────────┐
          │                             │
        DATA                          SCHEMA
          │                             │
    ┌─────┼─────┐              ┌────────┼────────────┐
    │     │     │              │        │            │
   READ  WRITE QUERY          TABLES   FIELDS   RELATIONSHIPS
    │     │     │              │        │            │
    └─────┴─────┴──────────────┴────────┴────────────┘
                         │
                      REST API
                         │
                    JavaScript
                         │
                     CODE PAGE`}
          </pre>
        </div>

        <div className="mt-7 rounded-lg border-2 border-[#d4a72c] bg-[#fffaf0] p-6">
          <p className="text-xl font-bold">The Code Page is only the client.</p>

          <p className="mt-3 text-lg leading-8">
            Quickbase remains the application, the data store, the security
            boundary, the schema authority, and the API server. JavaScript
            communicates with that system through explicitly defined REST
            operations.
          </p>
        </div>
      </section>

      {/* ========================================================
          FINAL TAKEAWAYS
      ======================================================== */}

      <section className="mb-14">
        <SectionHeading
          eyebrow="Keep These"
          title="Eight Ideas Worth Carrying Beyond This Lab"
        />

        <div className="grid gap-4 md:grid-cols-2">
          {[
            "Ask Quickbase for only the data you actually need whenever the API can perform the filtering, sorting, or pagination.",
            "Treat App DBIDs, Table DBIDs, Field IDs, and Record IDs as different kinds of identifiers with different scopes.",
            "Capture identifiers from Quickbase responses instead of predicting or hard-coding them.",
            "Remember that a Field ID only has meaning in the context of its table.",
            "Use response metadata as part of application logic, not merely as debugging information.",
            "Recognize that Quickbase can create supporting schema automatically during table and relationship operations.",
            "Read Quickbase relationship metadata from the child-side perspective where the reference field resides.",
            "When client state can be reconstructed from Quickbase, treat Quickbase as authoritative rather than relying solely on transient JavaScript memory.",
          ].map((item, index) => (
            <div
              key={item}
              className="flex gap-4 rounded-lg border border-gray-300 bg-white p-5"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1f5c99] font-bold text-white">
                {index + 1}
              </span>

              <p className="leading-7">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          PROJECT COMPLETE
      ======================================================== */}

      <section className="overflow-hidden rounded-xl border-2 border-[#2f7d4a] bg-[#f0fff4]">
        <div className="p-7 sm:p-9">
          <p className="font-bold uppercase tracking-[0.15em] text-[#276749]">
            Developer Lab Complete
          </p>

          <h2 className="mt-2 text-3xl font-extrabold text-[#205c38] sm:text-4xl">
            You Reached the End of the Quickbase Code Pages Developer Lab
          </h2>

          <p className="mt-5 max-w-4xl text-lg leading-8">
            The laboratory began with one People table and a request to read a
            handful of records. It ends with a Code Page capable of discovering
            an application&apos;s schema, understanding its identifiers,
            creating new tables and fields, constructing relationships,
            observing Quickbase-created supporting schema, and verifying the
            final application state through the REST API.
          </p>

          <p className="mt-5 max-w-4xl text-lg leading-8">
            The purpose was never to memorize JavaScript. The purpose was to
            understand how a Code Page communicates with Quickbase and how the
            Quickbase REST API exposes both the data layer and the application
            schema behind it.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/lessons"
              className="inline-flex rounded-md bg-[#276749] px-5 py-3 font-bold text-white hover:bg-[#205c38]"
            >
              Review All Lessons
            </Link>

            <Link
              href="/"
              className="inline-flex rounded-md border-2 border-[#276749] px-5 py-3 font-bold text-[#205c38] hover:bg-white"
            >
              Return Home
            </Link>

            <a
              href="https://github.com/dariansweb/Quickbase-API"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-md border-2 border-[#276749] px-5 py-3 font-bold text-[#205c38] hover:bg-white"
            >
              View Project on GitHub
            </a>
          </div>
        </div>
      </section>
    </article>
  );
}
