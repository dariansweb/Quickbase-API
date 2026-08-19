import Link from "next/link";

export default function Lesson7Page() {
  return (
    <section>
      {/* =========================================================
          LESSON HEADER
      ========================================================= */}
      <div className="mb-10 border-b border-gray-300 pb-8">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Lesson 7
        </p>
        <Link
          href="/files/PeoplePage_delete.txt"
          target="_blank"
          className="font-bold text-[#1f5c99] underline"
        >
          Code Page Here - PeoplePage_delete.html
        </Link>
        <h1 className="text-4xl font-bold">
          Delete Records with the Quickbase REST API
        </h1>

        <p className="mt-4 max-w-4xl text-lg leading-8 text-gray-700">
          Complete the CRUD cycle by safely selecting an existing People record,
          identifying it with a Quickbase query condition, deleting it through
          the REST API, and confirming the result from Quickbase&apos;s
          response.
        </p>
      </div>

      {/* =========================================================
          LESSON OBJECTIVE
      ========================================================= */}
      <div className="mb-10 rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Lesson Objective
        </p>

        <h2 className="text-2xl font-bold">
          Remove One Existing Record — Deliberately and Safely
        </h2>

        <p className="mt-3 max-w-4xl leading-7">
          Lesson 7 introduces the destructive side of CRUD. Unlike CREATE and
          UPDATE, DELETE uses a Quickbase query condition to determine which
          record should be removed. We will verify the target, ask the user for
          confirmation, send the DELETE request, read Quickbase&apos;s
          acknowledgment, and refresh the table.
        </p>
      </div>

      {/* =========================================================
          CRUD MILESTONE INTRO
      ========================================================= */}
      <div className="mb-10 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          The Milestone
        </p>

        <h2 className="text-3xl font-bold">
          One More Operation and the People Page Becomes Full CRUD
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-300 bg-[#f7f8fa] p-5">
            <p className="text-sm font-bold uppercase tracking-wide text-[#1f5c99]">
              Create
            </p>

            <p className="mt-2 text-xl font-bold">Lesson 5</p>

            <p className="mt-2 text-sm leading-6 text-gray-700">
              Add a new Quickbase record.
            </p>
          </div>

          <div className="rounded-lg border border-gray-300 bg-[#f7f8fa] p-5">
            <p className="text-sm font-bold uppercase tracking-wide text-[#1f5c99]">
              Read
            </p>

            <p className="mt-2 text-xl font-bold">Lesson 1B</p>

            <p className="mt-2 text-sm leading-6 text-gray-700">
              Retrieve Quickbase records.
            </p>
          </div>

          <div className="rounded-lg border border-gray-300 bg-[#f7f8fa] p-5">
            <p className="text-sm font-bold uppercase tracking-wide text-[#1f5c99]">
              Update
            </p>

            <p className="mt-2 text-xl font-bold">Lesson 6</p>

            <p className="mt-2 text-sm leading-6 text-gray-700">
              Change an existing record.
            </p>
          </div>

          <div className="rounded-lg border-2 border-[#a61c1c] bg-[#fff5f5] p-5">
            <p className="text-sm font-bold uppercase tracking-wide text-[#a61c1c]">
              Delete
            </p>

            <p className="mt-2 text-xl font-bold">Lesson 7</p>

            <p className="mt-2 text-sm leading-6 text-gray-700">
              Remove an existing record.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================
          IMPORTANT DIFFERENCE
      ========================================================= */}
      <div className="mb-10">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          The Important Change
        </p>

        <h2 className="text-3xl font-bold">
          DELETE Does Not Use the Same Payload as CREATE and UPDATE
        </h2>

        <p className="mt-4 max-w-4xl leading-7 text-gray-700">
          CREATE and UPDATE send record data. DELETE instead tells Quickbase
          which records qualify for removal.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
            <p className="font-bold text-[#1f5c99]">CREATE / UPDATE</p>

            <pre className="mt-4 overflow-x-auto rounded-md bg-[#f7f8fa] p-5 text-sm leading-7">
              {`{
  to: TABLE_DBID,
  data: [
    {
      ...
    }
  ]
}`}
            </pre>

            <p className="mt-4 leading-7 text-gray-700">
              Send record values to Quickbase.
            </p>
          </div>

          <div className="rounded-lg border-2 border-[#a61c1c] bg-[#fff5f5] p-6">
            <p className="font-bold text-[#a61c1c]">DELETE</p>

            <pre className="mt-4 overflow-x-auto rounded-md border border-[#e5b8b8] bg-white p-5 text-sm leading-7">
              {`{
  from: TABLE_DBID,
  where: "{3.EX.'14'}"
}`}
            </pre>

            <p className="mt-4 leading-7 text-gray-700">
              Tell Quickbase which record matches the deletion condition.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================
          QDL RETURNS
      ========================================================= */}
      <div className="mb-10 rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Aha Moment
        </p>

        <h2 className="text-2xl font-bold">
          The Query Language from Lessons 3 and 4 Is Back
        </h2>

        <p className="mt-3 max-w-4xl leading-7">
          We first used Quickbase query conditions to control which records were
          returned by a READ. In Lesson 7, the same query language determines
          which record will be deleted.
        </p>

        <div className="mt-6 rounded-lg border border-[#b8cfe5] bg-white p-6">
          <pre className="overflow-x-auto text-sm leading-7">
            {`{ 3 . EX . '14' }
  │    │      │
  │    │      └── Record ID# 14
  │    │
  │    └───────── Exactly equals
  │
  └────────────── Quickbase Field ID 3`}
          </pre>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-[#b8cfe5] bg-white p-5">
            <p className="font-bold">Earlier</p>

            <pre className="mt-3 overflow-x-auto text-sm leading-7">
              {`where:
"{8.EX.'Blue'}"

Meaning:
Return records where
Favorite Color = Blue`}
            </pre>
          </div>

          <div className="rounded-lg border border-[#b8cfe5] bg-white p-5">
            <p className="font-bold">Lesson 7</p>

            <pre className="mt-3 overflow-x-auto text-sm leading-7">
              {`where:
"{3.EX.'14'}"

Meaning:
Delete records where
Record ID# = 14`}
            </pre>
          </div>
        </div>
      </div>

      {/* =========================================================
          LESSON ROADMAP
      ========================================================= */}
      <div className="mb-10 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Lesson 7 Roadmap
        </p>

        <h2 className="text-2xl font-bold">
          Six Steps from Selected Record to Confirmed Deletion
        </h2>

        <p className="mt-3 max-w-4xl leading-7 text-gray-700">
          Because DELETE is destructive, this lesson deliberately separates
          targeting, verification, confirmation, execution, acknowledgment, and
          refresh.
        </p>

        <div className="mt-6 grid gap-3">
          {[
            [
              "1",
              "Add a Delete action",
              "Give each People record a Delete button beside Edit.",
            ],
            [
              "2",
              "Build the deletion target",
              "Use Record ID# to create a Quickbase where condition.",
            ],
            [
              "3",
              "Confirm before deleting",
              "Ask the user to explicitly approve the destructive action.",
            ],
            [
              "4",
              "Send the DELETE request",
              "Submit the from/where payload to the Quickbase REST records endpoint.",
            ],
            [
              "5",
              "Read Quickbase's acknowledgment",
              "Inspect numberDeleted to learn what actually happened.",
            ],
            [
              "6",
              "Reload and verify",
              "Read the People table again and confirm the record is gone.",
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
            Add a Delete Action to Each Record
          </h2>
        </div>

        <p className="max-w-4xl leading-7 text-gray-700">
          The Actions column now contains both Edit and Delete. The Delete
          button carries only the values necessary for the deletion workflow:
          the Quickbase Record ID# and a readable name for confirmation.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#18212b] p-5 text-sm leading-7 text-white">
          {`const deleteButton =
  document.createElement("button");

deleteButton.type = "button";
deleteButton.textContent = "Delete";
deleteButton.className = "delete-button";

deleteButton.addEventListener("click", () => {
  deletePerson(recordId, name);
});`}
        </pre>

        <div className="mt-5 rounded-lg border-l-4 border-[#1f5c99] bg-[#f7f8fa] p-5">
          <p className="font-bold">Record ID# is once again the key.</p>

          <p className="mt-2 leading-7 text-gray-700">
            The browser already knows the ID of every rendered People record.
            That value becomes the foundation of the deletion target.
          </p>
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

          <h2 className="text-2xl font-bold">Build the DELETE Payload</h2>
        </div>

        <p className="max-w-4xl leading-7 text-gray-700">
          Instead of supplying record values, the DELETE payload identifies the
          source table and provides a Quickbase query condition.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#18212b] p-5 text-sm leading-7 text-white">
          {`function buildDeletePersonPayload(recordId) {
  return {
    from: TABLE_DBID,

    where:
      \`{\${FIELD_IDS.recordId}.EX.'\${recordId}'}\`,
  };
}`}
        </pre>

        <div className="mt-6 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
          <p className="font-bold text-[#1f5c99]">Example</p>

          <pre className="mt-4 overflow-x-auto rounded-lg bg-[#f7f8fa] p-5 text-sm leading-7">
            {`Record ID#: 14

        ↓

{
  from: "TABLE_ID_HERE",
  where: "{3.EX.'14'}"
}`}
          </pre>
        </div>
      </div>

      {/* =========================================================
          DELETE WARNING
      ========================================================= */}
      <div className="mb-10 rounded-lg border-2 border-[#a61c1c] bg-[#fff5f5] p-6">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#a61c1c]">
          Destructive Operation
        </p>

        <h2 className="text-2xl font-bold text-[#7f0000]">
          A DELETE Query Deserves More Care Than a READ Query
        </h2>

        <p className="mt-3 max-w-4xl leading-7 text-gray-800">
          In Lessons 3 and 4, a bad <code>where</code> condition might return
          the wrong records. In Lesson 7, the condition determines which records
          Quickbase removes.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-[#e5b8b8] bg-white p-5 text-sm leading-7">
          {`READ with wrong condition
        ↓
Wrong results appear

DELETE with wrong condition
        ↓
Wrong records may be removed`}
        </pre>

        <p className="mt-5 font-bold text-[#7f0000]">
          That is why we tested the payload before sending the DELETE request.
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

          <h2 className="text-2xl font-bold">Ask for Confirmation</h2>
        </div>

        <p className="max-w-4xl leading-7 text-gray-700">
          Before contacting Quickbase, the Code Page asks the user to confirm
          the exact person and Record ID# being deleted.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#18212b] p-5 text-sm leading-7 text-white">
          {`const confirmed = window.confirm(
  \`Delete \${name} from Quickbase?

Record ID: \${recordId}\`,
);

if (!confirmed) {
  return;
}`}
        </pre>

        <div className="mt-5 rounded-lg border-l-4 border-[#a61c1c] bg-[#fff5f5] p-5">
          <p className="font-bold text-[#7f0000]">
            No confirmation means no API request.
          </p>

          <p className="mt-2 leading-7 text-gray-700">
            Returning here stops the delete workflow before temporary
            authorization or the destructive REST request occurs.
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

          <h2 className="text-2xl font-bold">Send the DELETE Request</h2>
        </div>

        <p className="max-w-4xl leading-7 text-gray-700">
          CREATE and UPDATE used <code>POST</code>. Lesson 7 changes the HTTP
          method to <code>DELETE</code>, while still using the Quickbase records
          endpoint.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#18212b] p-5 text-sm leading-7 text-white">
          {`const response = await fetch(
  "https://api.quickbase.com/v1/records",
  {
    method: "DELETE",

    headers: {
      "QB-Realm-Hostname": REALM,

      Authorization:
        \`QB-TEMP-TOKEN \${temporaryToken}\`,

      "Content-Type": "application/json",
    },

    body: JSON.stringify(payload),
  },
);`}
        </pre>

        <div className="mt-6 overflow-x-auto rounded-lg border border-gray-300">
          <table className="w-full border-collapse text-left">
            <thead className="bg-[#1f5c99] text-white">
              <tr>
                <th className="px-4 py-3">Operation</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Endpoint</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              <tr>
                <td className="px-4 py-3 font-bold">CREATE</td>
                <td className="px-4 py-3">
                  <code>POST</code>
                </td>
                <td className="px-4 py-3">
                  <code>/v1/records</code>
                </td>
              </tr>

              <tr>
                <td className="px-4 py-3 font-bold">UPDATE</td>
                <td className="px-4 py-3">
                  <code>POST</code>
                </td>
                <td className="px-4 py-3">
                  <code>/v1/records</code>
                </td>
              </tr>

              <tr>
                <td className="px-4 py-3 font-bold text-[#a61c1c]">DELETE</td>
                <td className="px-4 py-3">
                  <code>DELETE</code>
                </td>
                <td className="px-4 py-3">
                  <code>/v1/records</code>
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
            Read Quickbase&apos;s DELETE Acknowledgment
          </h2>
        </div>

        <p className="max-w-4xl leading-7 text-gray-700">
          Just like CREATE and UPDATE, DELETE answers with structured JSON. This
          time the response is wonderfully direct.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#18212b] p-5 text-sm leading-7 text-white">
          {`const data = await response.json();

if (!response.ok) {
  throw new Error(
    \`HTTP \${response.status}: \${JSON.stringify(data)}\`,
  );
}`}
        </pre>

        <div className="mt-6 rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6">
          <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
            Quickbase Response
          </p>

          <pre className="mt-4 overflow-x-auto rounded-lg border border-[#b8cfe5] bg-white p-5 text-lg font-bold">
            {`{
  numberDeleted: 1
}`}
          </pre>

          <p className="mt-4 leading-7">
            The query matched one record, and Quickbase deleted one record.
          </p>
        </div>
      </div>

      {/* =========================================================
          REQUEST ACKNOWLEDGMENT
      ========================================================= */}
      <div className="mb-10 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Request / Acknowledgment
        </p>

        <h2 className="text-2xl font-bold">
          Every Write Operation Has Told Us What Happened
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-gray-300 bg-[#f7f8fa] p-5">
            <p className="font-bold text-[#1f5c99]">CREATE</p>

            <code className="mt-3 block text-sm">
              metadata.createdRecordIds
            </code>

            <p className="mt-3 text-sm leading-6 text-gray-700">
              Quickbase tells us which new Record ID# it created.
            </p>
          </div>

          <div className="rounded-lg border border-gray-300 bg-[#f7f8fa] p-5">
            <p className="font-bold text-[#1f5c99]">UPDATE</p>

            <code className="mt-3 block text-sm">
              metadata.updatedRecordIds
            </code>

            <p className="mt-3 text-sm leading-6 text-gray-700">
              Quickbase tells us which existing Record ID# changed.
            </p>
          </div>

          <div className="rounded-lg border border-gray-300 bg-[#f7f8fa] p-5">
            <p className="font-bold text-[#a61c1c]">DELETE</p>

            <code className="mt-3 block text-sm">numberDeleted</code>

            <p className="mt-3 text-sm leading-6 text-gray-700">
              Quickbase tells us how many records were removed.
            </p>
          </div>
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

          <h2 className="text-2xl font-bold">
            Reload the People Table and Verify the Deletion
          </h2>
        </div>

        <p className="max-w-4xl leading-7 text-gray-700">
          After Quickbase confirms the delete operation, the Code Page performs
          another READ. The removed record disappears because it no longer
          exists in the Quickbase table.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#18212b] p-5 text-sm leading-7 text-white">
          {`status.textContent =
  \`\${name} was deleted from Quickbase.\`;

await loadPeople();`}
        </pre>

        <div className="mt-5 rounded-lg border-l-4 border-[#1f5c99] bg-[#f7f8fa] p-5">
          <p className="font-bold">
            Quickbase remains the authoritative source.
          </p>

          <p className="mt-2 leading-7 text-gray-700">
            We do not merely remove the HTML row ourselves. We read the table
            again and render the records Quickbase now contains.
          </p>
        </div>
      </div>

      {/* =========================================================
          COMPLETE DELETE FLOW
      ========================================================= */}
      <div className="mb-10 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Complete DELETE Flow
        </p>

        <h2 className="text-2xl font-bold">
          TARGET → CONFIRM → DELETE → ACKNOWLEDGE → READ → VERIFY
        </h2>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#f7f8fa] p-5 text-sm leading-7">
          {`READ People records
      ↓
Render Delete button
      ↓
Click Delete
      ↓
Record ID# selected
      ↓
Build query condition
      ↓
{3.EX.'14'}
      ↓
Ask for confirmation
      ↓
User confirms
      ↓
DELETE /v1/records
      ↓
Quickbase evaluates where
      ↓
Matching record removed
      ↓
numberDeleted: 1
      ↓
Show success message
      ↓
await loadPeople()
      ↓
READ current Quickbase records
      ↓
Deleted record is gone`}
        </pre>
      </div>

      {/* =========================================================
          CRUD COMPLETE
      ========================================================= */}
      <div className="mb-10 rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Major Milestone
        </p>

        <h2 className="text-3xl font-bold">
          The People Code Page Is Now Full CRUD
        </h2>

        <p className="mt-4 max-w-4xl leading-7">
          We did not start by trying to build a CRUD application. We built one
          capability at a time, proved each piece independently, and gradually
          arrived here.
        </p>

        <div className="mt-6 overflow-x-auto rounded-lg border border-[#b8cfe5] bg-white">
          <table className="w-full border-collapse text-left">
            <thead className="bg-[#1f5c99] text-white">
              <tr>
                <th className="px-4 py-3">CRUD</th>
                <th className="px-4 py-3">Lesson</th>
                <th className="px-4 py-3">Quickbase Operation</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 font-bold">Create</td>
                <td className="px-4 py-3">Lesson 5</td>
                <td className="px-4 py-3">
                  <code>POST /v1/records</code>
                </td>
              </tr>

              <tr>
                <td className="px-4 py-3 font-bold">Read</td>
                <td className="px-4 py-3">Lesson 1B</td>
                <td className="px-4 py-3">
                  <code>POST /v1/records/query</code>
                </td>
              </tr>

              <tr>
                <td className="px-4 py-3 font-bold">Update</td>
                <td className="px-4 py-3">Lesson 6</td>
                <td className="px-4 py-3">
                  <code>POST /v1/records</code>
                </td>
              </tr>

              <tr>
                <td className="px-4 py-3 font-bold">Delete</td>
                <td className="px-4 py-3">Lesson 7</td>
                <td className="px-4 py-3">
                  <code>DELETE /v1/records</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================
          HOW WE GOT HERE
      ========================================================= */}
      <div className="mb-10 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          How We Got Here
        </p>

        <h2 className="text-3xl font-bold">
          Look at What the Little People Table Taught Us
        </h2>

        <p className="mt-4 max-w-4xl leading-7 text-gray-700">
          The People table is deliberately tiny, but the development concepts
          are not. The same four fields have carried us through nearly the
          entire foundation of Quickbase Code Page development.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            [
              "REST Authentication",
              "Acquire temporary authorization from the signed-in Quickbase session.",
            ],
            [
              "JSON Requests and Responses",
              "Send structured requests and interpret structured Quickbase responses.",
            ],
            [
              "Field IDs",
              "Use stable Quickbase field identifiers when reading and writing records.",
            ],
            [
              "QDL Conditions",
              "Build conditions such as {8.EX.'Blue'} and {3.EX.'14'}.",
            ],
            [
              "Record Identity",
              "Use Record ID# to recognize, update, and delete specific records.",
            ],
            [
              "CRUD Workflows",
              "Combine browser interaction, REST calls, acknowledgment, and verification.",
            ],
          ].map(([title, description]) => (
            <div
              key={title}
              className="rounded-lg border border-gray-300 bg-[#f7f8fa] p-5"
            >
              <p className="font-bold text-[#1f5c99]">{title}</p>
              <p className="mt-2 text-sm leading-6 text-gray-700">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================
          THE FULL CONVERSATION
      ========================================================= */}
      <div className="mb-10 rounded-lg border border-gray-300 bg-[#f7f8fa] p-6">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          The Bigger Picture
        </p>

        <h2 className="text-2xl font-bold">
          We Built a Two-Way Conversation with Quickbase
        </h2>

        <pre className="mt-6 overflow-x-auto rounded-lg bg-white p-6 text-sm leading-7">
          {`READ
Quickbase ───────────────→ JavaScript
          records


CREATE
JavaScript ──────────────→ Quickbase
          new values

Quickbase ───────────────→ JavaScript
          createdRecordIds


UPDATE
JavaScript ──────────────→ Quickbase
          Record ID# + changed values

Quickbase ───────────────→ JavaScript
          updatedRecordIds


DELETE
JavaScript ──────────────→ Quickbase
          where condition

Quickbase ───────────────→ JavaScript
          numberDeleted`}
        </pre>

        <p className="mt-5 max-w-4xl leading-7 text-gray-700">
          That request-and-acknowledgment pattern is one of the most important
          things this CRUD sequence revealed. The Code Page is not merely firing
          commands at Quickbase. Each operation is a structured exchange.
        </p>
      </div>

      {/* =========================================================
          FINAL CRUD CELEBRATION
      ========================================================= */}
      <div className="mb-10 rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          CRUD Complete
        </p>

        <h2 className="text-3xl font-bold">We Built Something Real</h2>

        <p className="mt-4 max-w-4xl text-lg leading-8">
          The Code Page can now read the People table, create new People
          records, select and update existing records, and safely delete
          records. Every operation is backed by a real Quickbase REST request
          and a real Quickbase response.
        </p>

        <pre className="mt-6 overflow-x-auto rounded-lg border border-[#b8cfe5] bg-white p-6 text-lg font-bold leading-9">
          {`CREATE   ✅
READ     ✅
UPDATE   ✅
DELETE   ✅

FULL CRUD ✅`}
        </pre>

        <p className="mt-5 max-w-4xl leading-7">
          And we got here without hiding the machinery. We watched the
          authentication, payloads, query conditions, Record IDs, responses,
          metadata, failures, confirmations, and refreshes happen one step at a
          time.
        </p>
      </div>

      {/* =========================================================
          LESSON COMPLETE
      ========================================================= */}
      <div className="rounded-lg border border-gray-300 bg-[#f7f8fa] p-6">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Lesson 7 Complete
        </p>

        <h2 className="text-2xl font-bold">The CRUD Foundation Is Finished</h2>

        <p className="mt-3 max-w-4xl leading-7 text-gray-700">
          You targeted an existing Quickbase record with QDL, protected the
          destructive action with confirmation, sent a DELETE request,
          interpreted <code>numberDeleted</code>, refreshed the table, and
          completed the full CREATE, READ, UPDATE, DELETE sequence.
        </p>

        <div className="mt-6 border-t border-gray-300 pt-5">
          <p className="font-bold text-[#1f5c99]">
            Next: Lesson 8 — Pagination
          </p>

          <p className="mt-2 max-w-4xl leading-7 text-gray-700">
            The application can now perform CRUD. The next challenge is scale:
            what happens when the table contains far more records than we want
            to retrieve and render at once?
          </p>
        </div>
      </div>
    </section>
  );
}
