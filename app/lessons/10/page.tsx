import Link from "next/link";

function CodeBlock({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="my-6 overflow-hidden rounded-lg border border-gray-300 bg-white">
      {title && (
        <div className="border-b border-gray-300 bg-[#f3f7fb] px-4 py-3 font-bold text-[#003366]">
          {title}
        </div>
      )}

      <pre className="overflow-x-auto p-5 text-[15px] leading-7">
        <code>{children}</code>
      </pre>
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
    <div className="my-7 rounded-lg border-2 border-[#d4a72c] bg-[#fffaf0] p-6">
      <p className="mb-2 font-bold uppercase tracking-wide text-[#7a5200]">
        Aha Moment
      </p>

      <h3 className="text-xl font-bold text-black">{title}</h3>

      <div className="mt-3 leading-8 text-black">{children}</div>
    </div>
  );
}

function Endpoint({
  method,
  endpoint,
  children,
}: {
  method: string;
  endpoint: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="my-6 rounded-lg border border-[#9fbad5] bg-[#f3f7fb] p-5">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-md bg-[#1f5c99] px-3 py-1 font-bold text-white">
          {method}
        </span>

        <code className="break-all font-bold text-[#003366]">{endpoint}</code>
      </div>

      {children && <div className="mt-4 leading-7">{children}</div>}
    </div>
  );
}

function SectionTitle({ number, title }: { number?: string; title: string }) {
  return (
    <div className="mb-5 border-b border-gray-300 pb-3">
      {number && (
        <p className="mb-1 font-bold uppercase tracking-wide text-[#1f5c99]">
          Part {number}
        </p>
      )}

      <h2 className="text-2xl font-bold text-[#003366] sm:text-3xl">{title}</h2>
    </div>
  );
}

export default function Lesson10Page() {
  return (
    <article className="mx-auto max-w-5xl pb-20 text-black">
      {/* =========================================================
          LESSON HEADER
      ========================================================= */}

      <header className="mb-10 border-b border-gray-300 pb-8">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Lesson 10
        </p>
        <Link
          href="/files/DynamicSchema.txt"
          target="_blank"
          className="font-bold text-[#1f5c99] underline"
        >
          Code Page Here - DynamicSchema.html
        </Link>
        <h1 className="text-4xl font-extrabold leading-tight text-[#003366] sm:text-5xl">
          Dynamic Quickbase Schema Creation
        </h1>

        <p className="mt-5 max-w-4xl text-xl leading-8">
          Create tables, fields, and relationships with the Quickbase REST API,
          capture the identifiers Quickbase returns, and observe the additional
          schema that Quickbase creates automatically.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/lessons/9"
            className="inline-flex rounded-md border-2 border-[#1f5c99] px-4 py-2 font-bold text-[#1f5c99] hover:bg-[#f3f7fb]"
          >
            ← Review Lesson 9
          </Link>

          <span className="inline-flex items-center rounded-md bg-[#f3f7fb] px-4 py-2 font-bold text-[#003366]">
            Working file: QBSchemaExplorer.html
          </span>
        </div>
      </header>

      {/* =========================================================
          OBJECTIVE
      ========================================================= */}

      <section className="mb-10 rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6">
        <h2 className="text-2xl font-bold text-[#003366]">Lesson Objective</h2>

        <p className="mt-4 leading-8">
          Lesson 9 asked Quickbase to describe schema that already existed.
          Lesson 10 reverses that direction. JavaScript will now send schema
          instructions to Quickbase and progressively construct two new tables
          around the existing <strong>People</strong> training table.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-[#9fbad5] bg-white p-5">
            <p className="font-bold text-[#003366]">Departments</p>
            <p className="mt-2">Department Name</p>
            <p>Location</p>
          </div>

          <div className="rounded-lg border-2 border-[#1f5c99] bg-white p-5">
            <p className="font-bold text-[#003366]">People</p>
            <p className="mt-2">Existing training table</p>
            <p>Name</p>
            <p>Age</p>
            <p>Favorite Color</p>
          </div>

          <div className="rounded-lg border border-[#9fbad5] bg-white p-5">
            <p className="font-bold text-[#003366]">Tasks</p>
            <p className="mt-2">Task Name</p>
            <p>Due Date</p>
            <p>Status</p>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-[#9fbad5] bg-white p-5 text-center font-bold text-[#003366]">
          Departments → People → Tasks
        </div>
      </section>

      {/* =========================================================
          LESSON 9 BRIDGE
      ========================================================= */}

      <section className="mb-12">
        <SectionTitle number="1" title="Where Lesson 9 Left Us" />

        <p className="leading-8">
          The Schema Explorer from Lesson 9 taught us how to discover the
          application&apos;s structure instead of hard-coding it. The Code Page
          could discover the current App DBID, retrieve the application&apos;s
          tables, inspect fields, find Field IDs, and inspect child-side
          relationship metadata.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-gray-300 bg-white p-5">
            <p className="font-bold text-[#003366]">Lesson 9</p>

            <div className="mt-3 font-mono leading-8">
              Quickbase
              <br />
              ↓<br />
              REST API
              <br />
              ↓<br />
              JavaScript
              <br />
              ↓<br />
              Inspect existing schema
            </div>
          </div>

          <div className="rounded-lg border border-gray-300 bg-white p-5">
            <p className="font-bold text-[#003366]">Lesson 10</p>

            <div className="mt-3 font-mono leading-8">
              JavaScript
              <br />
              ↓<br />
              REST API
              <br />
              ↓<br />
              Quickbase
              <br />
              ↓<br />
              Create new schema
            </div>
          </div>
        </div>

        <Aha title="Metadata becomes an input">
          <p>
            Schema metadata is not useful only for documenting an application.
            Once JavaScript discovers a Table DBID or Field ID, that identifier
            can become an input to the next API request.
          </p>
        </Aha>
      </section>

      {/* =========================================================
          START WITH SCHEMA
      ========================================================= */}

      <section className="mb-12">
        <SectionTitle number="2" title="Start With the Schema, Not the API" />

        <p className="leading-8">
          We do not begin by throwing POST requests at Quickbase. First, define
          the structure that the requests must eventually create.
        </p>

        <CodeBlock title="Target schema">
          {`Departments
├── Department Name
└── Location
        │
        ▼
People
├── Name
├── Age
└── Favorite Color
        │
        ▼
Tasks
├── Task Name
├── Due Date
└── Status`}
        </CodeBlock>

        <p className="leading-8">
          The important question in this lesson is not merely what a parent or
          child table is. The important question is what Quickbase physically
          creates when JavaScript asks Quickbase to construct those
          relationships.
        </p>
      </section>

      {/* =========================================================
          WHO CREATES WHAT
      ========================================================= */}

      <section className="mb-12">
        <SectionTitle
          number="3"
          title="Our API Requests Do Not Create Everything"
        />

        <p className="leading-8">
          Creating a Quickbase table is a higher-level schema operation.
          Quickbase automatically supplies its normal system fields before our
          code creates a single custom field.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="rounded-lg border border-gray-300 bg-white p-6">
            <p className="text-lg font-bold text-[#003366]">
              Quickbase Creates Automatically
            </p>

            <div className="mt-4 space-y-2">
              <p>Date Created</p>
              <p>Date Modified</p>
              <p>Record ID#</p>
              <p>Record Owner</p>
              <p>Last Modified By</p>
            </div>
          </div>

          <div className="rounded-lg border border-gray-300 bg-white p-6">
            <p className="text-lg font-bold text-[#003366]">
              Our REST Requests Create
            </p>

            <div className="mt-4 space-y-2">
              <p>Department Name</p>
              <p>Location</p>
            </div>
          </div>
        </div>

        <p className="mt-6 leading-8">
          Relationships add a third provenance category. A relationship
          operation can cause Quickbase to add a reference field and lookup
          fields even though our JavaScript never sends separate
          <code className="mx-2 rounded border border-gray-300 bg-white px-2 py-1">
            POST /fields
          </code>
          requests for them.
        </p>

        <CodeBlock title="Departments → People relationship request">
          {`{
  parentTableId: departmentsTableDbid,

  foreignKeyField: {
    label: "Related Department"
  },

  lookupFieldIds: [
    departmentNameFieldId,
    departmentLocationFieldId
  ]
}`}
        </CodeBlock>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-5">
            <p className="font-bold">We explicitly created earlier</p>
            <p className="mt-3">Department Name</p>
            <p>Location</p>
          </div>

          <div className="rounded-lg border-2 border-[#d4a72c] bg-[#fffaf0] p-5">
            <p className="font-bold">Quickbase creates for the relationship</p>
            <p className="mt-3">Related Department</p>
            <p>Department Name lookup</p>
            <p>Location lookup</p>
          </div>
        </div>

        <Aha title="One API request can produce several pieces of schema">
          <p>
            Quickbase schema is not necessarily a one-to-one representation of
            your REST calls. One relationship request can cause Quickbase to
            create supporting fields needed to implement that relationship.
          </p>
        </Aha>
      </section>

      {/* =========================================================
          CONSTRUCTION ORDER
      ========================================================= */}

      <section className="mb-12">
        <SectionTitle number="4" title="Construction Order Matters" />

        <p className="leading-8">
          A relationship cannot be constructed before the identifiers it depends
          on exist. Dynamic schema creation therefore becomes a dependency chain
          between API requests and API responses.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <CodeBlock title="Departments branch">
            {`Create Departments
        ↓
Capture Departments Table DBID
        ↓
Create Department Name
        ↓
Capture Field ID
        ↓
Create Location
        ↓
Capture Field ID
        ↓
Discover People Table DBID
        ↓
Create Departments → People`}
          </CodeBlock>

          <CodeBlock title="Tasks branch">
            {`Create Tasks
        ↓
Capture Tasks Table DBID
        ↓
Create Task Name
        ↓
Create Due Date
        ↓
Create Status
        ↓
Capture all Field IDs
        ↓
Discover People Name Field ID
        ↓
Create People → Tasks`}
          </CodeBlock>
        </div>

        <Aha title="An API response becomes the next request's input">
          <p>
            The important information from a successful request is often not
            simply &quot;success.&quot; Quickbase returns identifiers that our
            next request requires.
          </p>
        </Aha>
      </section>

      {/* =========================================================
          IDENTIFIERS
      ========================================================= */}

      <section className="mb-12">
        <SectionTitle number="5" title="Never Guess an Identifier" />

        <p className="leading-8">
          During testing, a newly created table reported a
          <code className="mx-2 rounded border border-gray-300 bg-white px-2 py-1">
            nextFieldId
          </code>
          value that let us predict what the next custom FIDs might be. The
          prediction happened to be correct.
        </p>

        <p className="mt-4 leading-8">
          That is useful for understanding Quickbase behavior. It is not how the
          application should obtain an identifier.
        </p>

        <CodeBlock title="Do not predict">
          {`// Do not do this.
lessonState.departmentNameFieldId = 6;`}
        </CodeBlock>

        <CodeBlock title="Capture what Quickbase actually returned">
          {`const data = await response.json();

lessonState.departmentNameFieldId = data.id;`}
        </CodeBlock>

        <Aha title="Quickbase is authoritative">
          <p>
            <code>nextFieldId</code> can help us understand what Quickbase may
            do next. It does not give JavaScript permission to manufacture the
            response before Quickbase returns it.
          </p>
        </Aha>
      </section>

      {/* =========================================================
          TABLE-LOCAL FIDS
      ========================================================= */}

      <section className="mb-12">
        <SectionTitle number="6" title="Field IDs Are Local to Their Tables" />

        <p className="leading-8">
          One of the most useful discoveries in the finished schema was that
          different tables can legitimately contain the same Field ID.
        </p>

        <div className="mt-6 overflow-hidden rounded-lg border border-gray-300">
          <table className="w-full border-collapse bg-white">
            <thead className="bg-[#003366] text-white">
              <tr>
                <th className="p-3 text-left">Table</th>
                <th className="p-3 text-left">Field</th>
                <th className="p-3 text-left">FID</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b border-gray-300">
                <td className="p-3">Departments</td>
                <td className="p-3">Department Name</td>
                <td className="p-3 font-mono">6</td>
              </tr>

              <tr className="border-b border-gray-300">
                <td className="p-3">People</td>
                <td className="p-3">Name</td>
                <td className="p-3 font-mono">6</td>
              </tr>

              <tr>
                <td className="p-3">Tasks</td>
                <td className="p-3">Task Name</td>
                <td className="p-3 font-mono">6</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-5 leading-8">
          There is no collision because a Field ID is meaningful in the context
          of its table. That is why the Code Page retains both Table DBIDs and
          Field IDs.
        </p>

        <CodeBlock>
          {`Departments / FID 6
People      / FID 6
Tasks       / FID 6

// Three different fields.`}
        </CodeBlock>
      </section>

      {/* =========================================================
          LESSON STATE
      ========================================================= */}

      <section className="mb-12">
        <SectionTitle number="7" title="The Lesson State Object" />

        <p className="leading-8">
          The Code Page keeps the identifiers it discovers and creates in a
          JavaScript object. This is more than convenient storage: it represents
          the dependencies between schema operations.
        </p>

        <CodeBlock title="lessonState">
          {`const lessonState = {
  departmentsTableDbid: null,
  peopleTableDbid: null,
  tasksTableDbid: null,

  departmentNameFieldId: null,
  departmentLocationFieldId: null,
  personNameFieldId: null,

  taskNameFieldId: null,
  taskDueDateFieldId: null,
  taskStatusFieldId: null,

  departmentsPeopleRelationshipId: null,
  peopleTasksRelationshipId: null,
};`}
        </CodeBlock>

        <div className="mt-6 rounded-lg border border-gray-300 bg-white p-6">
          <p className="font-bold text-[#003366]">Examples of dependencies</p>

          <div className="mt-4 space-y-4 leading-7">
            <p>
              <code>departmentsTableDbid</code> is needed before Department
              fields can be created.
            </p>

            <p>
              <code>departmentNameFieldId</code> and
              <code> departmentLocationFieldId</code> are needed before those
              fields can be requested as lookups.
            </p>

            <p>
              <code>peopleTableDbid</code> identifies People as the child in the
              first relationship and as the parent in the second.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          SOURCE OF TRUTH
      ========================================================= */}

      <section className="mb-12">
        <SectionTitle number="8" title="Quickbase Is the Source of Truth" />

        <p className="leading-8">
          JavaScript memory disappears when the page reloads. The finished Code
          Page therefore does not assume that its in-memory
          <code className="mx-2 rounded border border-gray-300 bg-white px-2 py-1">
            lessonState
          </code>
          is authoritative.
        </p>

        <CodeBlock title="Schema reconstruction">
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
Determine completed steps
    ↓
Enable the next valid action`}
        </CodeBlock>

        <p className="leading-8">
          If a student closes the browser after completing four steps and
          returns tomorrow, every JavaScript value begins as
          <code className="mx-2 rounded border border-gray-300 bg-white px-2 py-1">
            null
          </code>
          again. The page re-reads Quickbase, discovers what actually exists,
          and reconstructs its progress.
        </p>

        <Aha title="The authoritative system can rebuild transient client state">
          <p>
            Whenever possible, application state should be reconstructed from
            the authoritative system rather than trusted solely to temporary
            browser memory. Quickbase itself tells this lesson what has already
            been built.
          </p>
        </Aha>
      </section>

      {/* =========================================================
          STATUS BOARD
      ========================================================= */}

      <section className="mb-12">
        <SectionTitle number="9" title="Status-Aware Construction" />

        <p className="leading-8">
          The finished Code Page contains six schema-changing actions, but not
          every action is available at the same time.
        </p>

        <div className="mt-6 space-y-3">
          {[
            "Create Departments Table",
            "Create Department Fields",
            "Create Departments → People Relationship",
            "Create Tasks Table",
            "Create Task Fields",
            "Create People → Tasks Relationship",
          ].map((step, index) => (
            <div
              key={step}
              className="flex items-start gap-4 rounded-lg border border-gray-300 bg-white p-4"
            >
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1f5c99] font-bold text-white">
                {index + 1}
              </span>

              <p className="font-bold">{step}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 leading-8">
          A disabled button means either the action has already been completed
          or a prerequisite has not yet been satisfied.
        </p>

        <div className="mt-6 rounded-lg border border-[#9fbad5] bg-[#f3f7fb] p-5">
          <p className="font-bold text-[#003366]">Refresh Lesson Status</p>

          <p className="mt-2 leading-7">
            Refresh is deliberately separate from the six construction steps. It
            does not mutate the schema. It re-reads Quickbase, reconstructs
            <code className="mx-1">lessonState</code>, recalculates progress,
            and determines which action is valid next.
          </p>
        </div>
      </section>

      {/* =========================================================
          STEP 1 TABLE
      ========================================================= */}

      <section className="mb-12">
        <SectionTitle number="10" title="Step 1 — Create Departments" />

        <Endpoint method="POST" endpoint="/v1/tables?appId={APP_DBID}">
          <p>
            This is the first schema-changing request. The application DBID is
            discovered from the Quickbase Code Page context rather than
            hard-coded.
          </p>
        </Endpoint>

        <CodeBlock title="Request payload">
          {`{
  name: "Departments",
  description: "Departments used in Lesson 10",
  singleRecordName: "Department",
  pluralRecordName: "Departments"
}`}
        </CodeBlock>

        <p className="leading-8">
          The most consequential value returned is the new table&apos;s
          <code className="mx-2 rounded border border-gray-300 bg-white px-2 py-1">
            id
          </code>
          :
        </p>

        <CodeBlock>{`lessonState.departmentsTableDbid = data.id;`}</CodeBlock>

        <p className="leading-8">
          Do not reduce the response to a Boolean success flag. Quickbase
          returns metadata describing the table it just constructed, including
          properties such as its alias, key field, default sorting,
          <code> nextFieldId</code>, <code>nextRecordId</code>, storage
          information, and timestamps.
        </p>
      </section>

      {/* =========================================================
          AUTOMATIC SYSTEM FIELDS
      ========================================================= */}

      <section className="mb-12">
        <SectionTitle
          number="11"
          title="Inspect What Quickbase Already Created"
        />

        <p className="leading-8">
          Immediately after Departments is created, Quickbase already has its
          system fields even though our code has not yet created Department Name
          or Location.
        </p>

        <div className="mt-6 overflow-hidden rounded-lg border border-gray-300">
          <table className="w-full border-collapse bg-white">
            <thead className="bg-[#003366] text-white">
              <tr>
                <th className="p-3 text-left">Field</th>
                <th className="p-3 text-left">Origin</th>
              </tr>
            </thead>

            <tbody>
              {[
                ["Date Created", "Quickbase automatic"],
                ["Date Modified", "Quickbase automatic"],
                ["Record ID#", "Quickbase automatic"],
                ["Record Owner", "Quickbase automatic"],
                ["Last Modified By", "Quickbase automatic"],
                ["Department Name", "Our REST request"],
                ["Location", "Our REST request"],
              ].map(([field, origin]) => (
                <tr
                  key={field}
                  className="border-b border-gray-300 last:border-0"
                >
                  <td className="p-3 font-semibold">{field}</td>
                  <td className="p-3">{origin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* =========================================================
          STEP 2 FIELDS
      ========================================================= */}

      <section className="mb-12">
        <SectionTitle number="12" title="Step 2 — Create Department Fields" />

        <Endpoint method="POST" endpoint="/v1/fields?tableId={TABLE_DBID}" />

        <CodeBlock title="Department Name">
          {`{
  label: "Department Name",
  fieldType: "text",
  appearsByDefault: true,
  addToForms: true
}`}
        </CodeBlock>

        <CodeBlock title="Location">
          {`{
  label: "Location",
  fieldType: "text",
  appearsByDefault: true,
  addToForms: true
}`}
        </CodeBlock>

        <p className="leading-8">
          The lesson intentionally creates the two fields with separate requests
          so each Quickbase response can be inspected independently and each
          assigned Field ID can be captured.
        </p>
      </section>

      {/* =========================================================
          STEP 3 RELATIONSHIP
      ========================================================= */}

      <section className="mb-12">
        <SectionTitle
          number="13"
          title="Step 3 — Create Departments → People"
        />

        <p className="leading-8">
          The relationship now consumes identifiers produced by the preceding
          steps. Departments is the parent. People is the child.
        </p>

        <Endpoint
          method="POST"
          endpoint="/v1/tables/{PEOPLE_CHILD_DBID}/relationship"
        />

        <CodeBlock title="Relationship payload">
          {`{
  parentTableId: lessonState.departmentsTableDbid,

  foreignKeyField: {
    label: "Related Department"
  },

  lookupFieldIds: [
    lessonState.departmentNameFieldId,
    lessonState.departmentLocationFieldId
  ]
}`}
        </CodeBlock>

        <div className="mt-6 rounded-lg border-2 border-[#d4a72c] bg-[#fffaf0] p-6">
          <p className="text-lg font-bold">Watch what happens physically</p>

          <p className="mt-3 leading-7">
            We request a relationship, a reference-field label, and two parent
            fields to use as lookups. We do not separately create the
            relationship helper fields with the field endpoint.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-md border border-gray-300 bg-white p-4">
              <p className="font-bold">Our request says</p>
              <p className="mt-2">Parent = Departments</p>
              <p>Child = People</p>
              <p>Reference label = Related Department</p>
              <p>Look up Department Name + Location</p>
            </div>

            <div className="rounded-md border border-gray-300 bg-white p-4">
              <p className="font-bold">Quickbase builds</p>
              <p className="mt-2">Relationship</p>
              <p>Related Department reference field</p>
              <p>Department Name lookup</p>
              <p>Location lookup</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CHILD PERSPECTIVE
      ========================================================= */}

      <section className="mb-12">
        <SectionTitle
          number="14"
          title="Why the Relationship Appears From the Child Side"
        />

        <p className="leading-8">
          During development, inspecting Departments returned no relationship,
          even though Departments clearly participated in Departments → People.
          Inspecting People exposed the relationship.
        </p>

        <CodeBlock>
          {`Departments
    │
    │ parent
    ▼
People
    │
    └── Related Department
        reference / foreign-key field`}
        </CodeBlock>

        <p className="leading-8">
          Quickbase&apos;s relationship endpoint is oriented around the child
          table containing the reference field. Therefore People exposes the
          Departments → People relationship.
        </p>

        <p className="mt-4 leading-8">
          This does not mean Departments is unrelated to People. It means the
          API representation is centered on the child-side field that physically
          stores the reference.
        </p>

        <Aha title="Relationship metadata is child-oriented">
          <p>
            The relationship&apos;s reference/foreign-key field resides on the
            child. That is why querying the child table&apos;s relationship
            endpoint exposes the relationship.
          </p>
        </Aha>
      </section>

      {/* =========================================================
          STEPS 4 AND 5
      ========================================================= */}

      <section className="mb-12">
        <SectionTitle number="15" title="Steps 4 and 5 — Create Tasks" />

        <p className="leading-8">
          After Departments → People is verified, the same construction pattern
          is reused to create Tasks.
        </p>

        <Endpoint method="POST" endpoint="/v1/tables?appId={APP_DBID}" />

        <CodeBlock title="Tasks table">
          {`{
  name: "Tasks",
  description: "Tasks used in Lesson 10",
  singleRecordName: "Task",
  pluralRecordName: "Tasks"
}`}
        </CodeBlock>

        <Endpoint method="POST" endpoint="/v1/fields?tableId={TASKS_DBID}" />

        <div className="mt-6 overflow-hidden rounded-lg border border-gray-300">
          <table className="w-full border-collapse bg-white">
            <thead className="bg-[#003366] text-white">
              <tr>
                <th className="p-3 text-left">Field</th>
                <th className="p-3 text-left">Quickbase field type</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b border-gray-300">
                <td className="p-3">Task Name</td>
                <td className="p-3 font-mono">text</td>
              </tr>

              <tr className="border-b border-gray-300">
                <td className="p-3">Due Date</td>
                <td className="p-3 font-mono">date</td>
              </tr>

              <tr>
                <td className="p-3">Status</td>
                <td className="p-3 font-mono">text-multiple-choice</td>
              </tr>
            </tbody>
          </table>
        </div>

        <CodeBlock title="Status choices">
          {`properties: {
  choices: [
    "Not Started",
    "In Progress",
    "Complete"
  ],
  allowNewChoices: false
}`}
        </CodeBlock>
      </section>

      {/* =========================================================
          STEP 6
      ========================================================= */}

      <section className="mb-12">
        <SectionTitle number="16" title="Step 6 — Create People → Tasks" />

        <p className="leading-8">
          The second relationship reverses People&apos;s role. People was the
          child of Departments; now People becomes the parent of Tasks.
        </p>

        <Endpoint
          method="POST"
          endpoint="/v1/tables/{TASKS_CHILD_DBID}/relationship"
        />

        <CodeBlock title="People → Tasks payload">
          {`{
  parentTableId: lessonState.peopleTableDbid,

  foreignKeyField: {
    label: "Related Person"
  },

  lookupFieldIds: [
    lessonState.personNameFieldId
  ]
}`}
        </CodeBlock>

        <p className="leading-8">
          The Code Page discovers the People Name Field ID rather than assuming
          it is FID 6. Quickbase then creates the relationship support fields in
          Tasks.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="rounded-lg border border-gray-300 bg-white p-5">
            <p className="font-bold text-[#003366]">
              Explicitly created earlier
            </p>

            <p className="mt-3">Task Name</p>
            <p>Due Date</p>
            <p>Status</p>
          </div>

          <div className="rounded-lg border border-gray-300 bg-white p-5">
            <p className="font-bold text-[#003366]">
              Relationship-derived schema
            </p>

            <p className="mt-3">Related Person</p>
            <p>People Name lookup</p>
          </div>
        </div>
      </section>

      {/* =========================================================
          JSON TEACHING
      ========================================================= */}

      <section className="mb-12">
        <SectionTitle number="17" title="JSON Is Part of the Teaching" />

        <p className="leading-8">
          The JSON output area in the Code Page is not merely debugging output.
          It deliberately separates what JavaScript requested, what Quickbase
          returned, and what identifiers JavaScript retained.
        </p>

        <CodeBlock title="General operation output">
          {`{
  request: {
    method,
    endpoint,
    payload
  },

  quickbaseResponse: {
    ...
  },

  capturedLessonState: {
    ...
  }
}`}
        </CodeBlock>

        <CodeBlock title="Relationship operation output">
          {`{
  whatOurCodeExplicitlyRequested: {
    ...
  },

  whatQuickbaseCreatedForTheRelationship: {
    ...
  },

  quickbaseResponse: {
    ...
  },

  capturedLessonState: {
    ...
  }
}`}
        </CodeBlock>

        <div className="mt-6 rounded-lg border border-[#9fbad5] bg-[#f3f7fb] p-5">
          <p className="font-bold text-[#003366]">
            Questions to ask while reading the output
          </p>

          <ol className="mt-3 list-decimal space-y-2 pl-6">
            <li>What did JavaScript explicitly ask Quickbase to create?</li>
            <li>What additional schema did Quickbase create automatically?</li>
            <li>What metadata did Quickbase return?</li>
            <li>
              Which identifiers did JavaScript capture for later requests?
            </li>
          </ol>
        </div>
      </section>

      {/* =========================================================
          FINAL PROVENANCE
      ========================================================= */}

      <section className="mb-12">
        <SectionTitle number="18" title="Final Schema Provenance" />

        <p className="leading-8">
          The completed schema contains fields from several different origins.
          Understanding that provenance is one of the central objectives of this
          lesson.
        </p>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <div className="rounded-lg border border-gray-300 bg-white p-5">
            <h3 className="text-xl font-bold text-[#003366]">Departments</h3>

            <p className="mt-4 font-bold text-[#1f5c99]">Quickbase system</p>
            <p>Date Created</p>
            <p>Date Modified</p>
            <p>Record ID#</p>
            <p>Record Owner</p>
            <p>Last Modified By</p>

            <p className="mt-4 font-bold text-[#1f5c99]">Our API</p>
            <p>Department Name</p>
            <p>Location</p>
          </div>

          <div className="rounded-lg border-2 border-[#1f5c99] bg-white p-5">
            <h3 className="text-xl font-bold text-[#003366]">People</h3>

            <p className="mt-4 font-bold text-[#1f5c99]">
              Existing training fields
            </p>
            <p>Name</p>
            <p>Age</p>
            <p>Favorite Color</p>

            <p className="mt-4 font-bold text-[#1f5c99]">
              Relationship-created
            </p>
            <p>Related Department</p>

            <p className="mt-4 font-bold text-[#1f5c99]">Lookup fields</p>
            <p>Department Name</p>
            <p>Department Location</p>
          </div>

          <div className="rounded-lg border border-gray-300 bg-white p-5">
            <h3 className="text-xl font-bold text-[#003366]">Tasks</h3>

            <p className="mt-4 font-bold text-[#1f5c99]">Quickbase system</p>
            <p>Date Created</p>
            <p>Date Modified</p>
            <p>Record ID#</p>
            <p>Record Owner</p>
            <p>Last Modified By</p>

            <p className="mt-4 font-bold text-[#1f5c99]">Our API</p>
            <p>Task Name</p>
            <p>Due Date</p>
            <p>Status</p>

            <p className="mt-4 font-bold text-[#1f5c99]">
              Relationship-created
            </p>
            <p>Related Person</p>

            <p className="mt-4 font-bold text-[#1f5c99]">Lookup</p>
            <p>People Name — verify the exact label in Lesson 9</p>
          </div>
        </div>
      </section>

      {/* =========================================================
          COMPLETION CONDITION
      ========================================================= */}

      <section className="mb-12">
        <SectionTitle
          number="19"
          title="When Is the Lesson Actually Complete?"
        />

        <p className="leading-8">
          The last POST returning HTTP 200 is not enough. The Code Page
          re-inspects Quickbase and declares the lesson complete only when the
          resulting schema can actually be discovered.
        </p>

        <div className="mt-6 rounded-lg border-2 border-[#2f7d4a] bg-[#f0fff4] p-6">
          <p className="text-xl font-bold text-[#205c38]">
            Completion Checklist
          </p>

          <div className="mt-4 space-y-2">
            <p>✓ People exists</p>
            <p>✓ Departments exists</p>
            <p>✓ Department fields exist</p>
            <p>✓ Departments → People exists</p>
            <p>✓ Tasks exists</p>
            <p>✓ Task fields exist</p>
            <p>✓ People → Tasks exists</p>
          </div>
        </div>

        <CodeBlock>
          {`Departments
     ↓
People
     ↓
Tasks`}
        </CodeBlock>
      </section>

      {/* =========================================================
          LESSON 9 VERIFICATION
      ========================================================= */}

      <section className="mb-12">
        <SectionTitle number="20" title="Verify Everything With Lesson 9" />

        <p className="leading-8">
          Finish by returning to the Schema Explorer. Lesson 9 and Lesson 10 now
          form a closed loop: inspect, construct, then inspect again.
        </p>

        <div className="mt-6 space-y-5">
          <div className="rounded-lg border border-gray-300 bg-white p-5">
            <h3 className="text-xl font-bold text-[#003366]">Departments</h3>

            <p className="mt-3 leading-7">
              Verify its Table DBID, Department Name, Location, and standard
              system fields. Remember that the child-oriented relationship
              endpoint may show no relationship while inspecting Departments
              itself.
            </p>
          </div>

          <div className="rounded-lg border border-gray-300 bg-white p-5">
            <h3 className="text-xl font-bold text-[#003366]">People</h3>

            <p className="mt-3 leading-7">
              Verify Related Department, the Department lookup fields, and the
              Departments → People relationship. This is the child side of the
              first relationship.
            </p>
          </div>

          <div className="rounded-lg border border-gray-300 bg-white p-5">
            <h3 className="text-xl font-bold text-[#003366]">Tasks</h3>

            <p className="mt-3 leading-7">
              Verify Task Name, Due Date, Status, Related Person, the People
              lookup, and the People → Tasks relationship.
            </p>
          </div>
        </div>

        <div className="mt-7">
          <Link
            href="/lessons/9"
            className="inline-flex rounded-md bg-[#1f5c99] px-5 py-3 font-bold text-white hover:bg-[#174a7c]"
          >
            Open Lesson 9 Schema Explorer →
          </Link>
        </div>
      </section>

      {/* =========================================================
          RECAP
      ========================================================= */}

      <section className="rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-7">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Lesson 10 Recap
        </p>

        <h2 className="text-3xl font-bold text-[#003366]">What We Learned</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            "API responses can become inputs to later API requests.",
            "DBIDs and Field IDs should be discovered or captured, not guessed.",
            "Field IDs are local to their tables.",
            "Creating a table causes Quickbase to create system fields automatically.",
            "Creating a relationship can create reference and lookup fields automatically.",
            "Relationship metadata is child-oriented because the reference field resides on the child.",
            "JavaScript state is temporary; Quickbase can reconstruct the application's real schema state.",
            "Dynamic schema construction is a dependency chain, not a pile of unrelated POST requests.",
          ].map((item) => (
            <div
              key={item}
              className="rounded-lg border border-[#9fbad5] bg-white p-5 leading-7"
            >
              {item}
            </div>
          ))}
        </div>

        <p className="mt-7 text-lg font-bold leading-8">
          During this lesson, our JavaScript explicitly created tables, ordinary
          fields, and relationships. Quickbase also created its own required
          system fields and relationship-derived fields.
        </p>
      </section>
    </article>
  );
}
