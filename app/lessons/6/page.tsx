import Link from "next/link";

export default function Lesson6Page() {
  return (
    <section>
      {/* =========================================================
          LESSON HEADER
      ========================================================= */}
      <div className="mb-10 border-b border-gray-300 pb-8">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Lesson 6
        </p>
        <Link
          href="/files/PeoplePage_edit.txt"
          target="_blank"
          className="font-bold text-[#1f5c99] underline"
        >
          Code Page Here - PeoplePage_edit.html
        </Link>
        <h1 className="text-4xl font-bold">
          Edit Records with the Quickbase REST API
        </h1>

        <p className="mt-4 max-w-4xl text-lg leading-8 text-gray-700">
          Select an existing People record, place its current values into an
          edit form, change those values, and send the updated record back to
          Quickbase.
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
          Identify an Existing Record and Update It
        </h2>

        <p className="mt-3 max-w-4xl leading-7">
          Lesson 5 taught us how to create a new Quickbase record. Lesson 6
          keeps the same REST endpoint and basic JSON record structure, but adds
          one crucial piece of information: the identity of the existing record
          we want Quickbase to update.
        </p>
      </div>

      {/* =========================================================
          IMPORTANT CHANGE
      ========================================================= */}
      <div className="mb-10">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          The Important Change
        </p>

        <h2 className="text-3xl font-bold">
          Record ID# Is No Longer Just Something We Display
        </h2>

        <p className="mt-4 max-w-4xl leading-7 text-gray-700">
          We have displayed Record ID# since the beginning of the Developer Lab.
          In Lesson 5, Quickbase returned the new Record ID# after CREATE. Now
          that identifier becomes part of the request itself.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
            <p className="font-bold text-[#1f5c99]">Lesson 5 — CREATE</p>

            <pre className="mt-4 overflow-x-auto rounded-md bg-[#f7f8fa] p-5 text-sm leading-7">
              {`{
  6: { value: "Walter" },
  7: { value: 44 },
  8: { value: "Orange" }
}`}
            </pre>

            <p className="mt-4 leading-7 text-gray-700">
              No Record ID# is supplied. Quickbase creates a new record and
              assigns one.
            </p>
          </div>

          <div className="rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6">
            <p className="font-bold text-[#1f5c99]">Lesson 6 — UPDATE</p>

            <pre className="mt-4 overflow-x-auto rounded-md border border-[#b8cfe5] bg-white p-5 text-sm leading-7">
              {`{
  3: { value: 14 },
  6: { value: "Walter" },
  7: { value: 45 },
  8: { value: "Orange" }
}`}
            </pre>

            <p className="mt-4 leading-7">
              Field ID 3 identifies the existing Quickbase record that should be
              updated.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================
          CORE CONCEPT
      ========================================================= */}
      <div className="mb-10 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Core Quickbase Concept
        </p>

        <h2 className="text-2xl font-bold">
          Same Endpoint. Same Basic Payload. Different Record Identity.
        </h2>

        <div className="mt-6 overflow-x-auto rounded-lg border border-gray-300">
          <table className="w-full border-collapse text-left">
            <thead className="bg-[#1f5c99] text-white">
              <tr>
                <th className="px-4 py-3">Operation</th>
                <th className="px-4 py-3">Endpoint</th>
                <th className="px-4 py-3">Record ID#</th>
                <th className="px-4 py-3">Result</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              <tr>
                <td className="px-4 py-3 font-bold">CREATE</td>
                <td className="px-4 py-3">
                  <code>POST /v1/records</code>
                </td>
                <td className="px-4 py-3">Not supplied</td>
                <td className="px-4 py-3">Quickbase creates a new record.</td>
              </tr>

              <tr>
                <td className="px-4 py-3 font-bold">UPDATE</td>
                <td className="px-4 py-3">
                  <code>POST /v1/records</code>
                </td>
                <td className="px-4 py-3">Existing ID supplied</td>
                <td className="px-4 py-3">Quickbase updates that record.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================
          LESSON ROADMAP
      ========================================================= */}
      <div className="mb-10 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Lesson 6 Roadmap
        </p>

        <h2 className="text-2xl font-bold">
          Six Steps from Existing Record to Updated Record
        </h2>

        <p className="mt-3 max-w-4xl leading-7 text-gray-700">
          This lesson builds the UPDATE workflow in six stages. The roadmap
          gives you the entire process before we examine each piece.
        </p>

        <div className="mt-6 grid gap-3">
          {[
            [
              "1",
              "Add an Edit action",
              "Give every displayed People record a way to begin the edit workflow.",
            ],
            [
              "2",
              "Select the existing record",
              "Capture its Record ID# and place the current values into the edit form.",
            ],
            [
              "3",
              "Build the UPDATE payload",
              "Include Field ID 3 so Quickbase knows which existing record is being targeted.",
            ],
            [
              "4",
              "Send the UPDATE request",
              "Submit the payload to the Quickbase REST records endpoint.",
            ],
            [
              "5",
              "Read Quickbase's acknowledgment",
              "Inspect metadata.updatedRecordIds to confirm which record changed.",
            ],
            [
              "6",
              "Reload and verify",
              "Read the People table again and display the authoritative updated values.",
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
            Add an Edit Action to Each Record
          </h2>
        </div>

        <p className="max-w-4xl leading-7 text-gray-700">
          The existing People table already knows the Record ID#, Name, Age, and
          Favorite Color for every returned record. Lesson 6 adds an Edit button
          that carries those values into the edit workflow.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#18212b] p-5 text-sm leading-7 text-white">
          {`function createEditCell(
  recordId,
  name,
  age,
  favoriteColor,
) {
  const cell = document.createElement("td");
  const button = document.createElement("button");

  button.type = "button";
  button.textContent = "Edit";
  button.className = "edit-button";

  button.addEventListener("click", () => {
    beginEditPerson(
      recordId,
      name,
      age,
      favoriteColor,
    );
  });

  cell.appendChild(button);

  return cell;
}`}
        </pre>

        <p className="mt-5 max-w-4xl leading-7 text-gray-700">
          During rendering, the same values already extracted from each
          Quickbase record are passed to the Edit button.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#18212b] p-5 text-sm leading-7 text-white">
          {`row.appendChild(
  createEditCell(
    recordId,
    name,
    age,
    favoriteColor,
  ),
);`}
        </pre>
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
            Select the Existing Quickbase Record
          </h2>
        </div>

        <p className="max-w-4xl leading-7 text-gray-700">
          Clicking Edit does not update Quickbase yet. It establishes which
          record the learner intends to edit and copies that record&apos;s
          current values into the form.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#18212b] p-5 text-sm leading-7 text-white">
          {`function beginEditPerson(
  recordId,
  name,
  age,
  favoriteColor,
) {
  document.getElementById(
    "editRecordId",
  ).value = recordId;

  document.getElementById(
    "editPersonName",
  ).value = name;

  document.getElementById(
    "editPersonAge",
  ).value = age;

  document.getElementById(
    "editPersonColor",
  ).value = favoriteColor;

  const status =
    document.getElementById("editStatus");

  status.textContent =
    \`Editing Quickbase Record ID \${recordId}.\`;
}`}
        </pre>

        <div className="mt-5 rounded-lg border-l-4 border-[#1f5c99] bg-[#f7f8fa] p-5">
          <p className="font-bold">The hidden Record ID# matters most.</p>

          <p className="mt-2 leading-7 text-gray-700">
            The visible fields contain values the user may change. The hidden
            <code> editRecordId </code>
            preserves the identity of the Quickbase record being edited.
          </p>
        </div>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#f7f8fa] p-5 text-sm leading-7">
          {`<input
  type="hidden"
  id="editRecordId"
/>`}
        </pre>
      </div>

      {/* =========================================================
          SELECT VS UPDATE
      ========================================================= */}
      <div className="mb-10 rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Keep the Stages Separate
        </p>

        <h2 className="text-2xl font-bold">
          Clicking Edit Does Not Change Quickbase
        </h2>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-[#b8cfe5] bg-white p-5 text-sm leading-7">
          {`Click Edit
    ↓
Select existing record
    ↓
Copy current values into browser form
    ↓
User changes values
    ↓
Click Update Person
    ↓
Only now is an UPDATE request sent`}
        </pre>

        <p className="mt-5 leading-7">
          This distinction is important. The first interaction prepares the
          browser. The second interaction changes Quickbase.
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

          <h2 className="text-2xl font-bold">Build the UPDATE Payload</h2>
        </div>

        <p className="max-w-4xl leading-7 text-gray-700">
          The UPDATE payload looks almost exactly like Lesson 5&apos;s CREATE
          payload. The important addition is Field ID 3.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#18212b] p-5 text-sm leading-7 text-white">
          {`function buildUpdatePersonPayload(
  recordId,
  name,
  age,
  favoriteColor,
) {
  return {
    to: TABLE_DBID,

    data: [
      {
        [FIELD_IDS.recordId]: {
          value: Number(recordId),
        },

        [FIELD_IDS.name]: {
          value: name,
        },

        [FIELD_IDS.age]: {
          value: Number(age),
        },

        [FIELD_IDS.favoriteColor]: {
          value: favoriteColor,
        },
      },
    ],
  };
}`}
        </pre>

        <div className="mt-6 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
          <p className="font-bold text-[#1f5c99]">Payload Anatomy</p>

          <pre className="mt-4 overflow-x-auto rounded-lg bg-[#f7f8fa] p-5 text-sm leading-7">
            {`{
  to: TABLE_DBID,

  data: [
    {
      3: { value: 14 },       // existing record
      6: { value: "Walter" },
      7: { value: 45 },
      8: { value: "Orange" }
    }
  ]
}`}
          </pre>
        </div>
      </div>

      {/* =========================================================
          AHA MOMENT
      ========================================================= */}
      <div className="mb-10 rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Aha Moment
        </p>

        <h2 className="text-2xl font-bold">
          CREATE and UPDATE Are Two Outcomes of the Same Records Endpoint
        </h2>

        <p className="mt-3 max-w-4xl leading-7">
          Lesson 5 and Lesson 6 both send record data to
          <code> POST /v1/records</code>. The payload determines whether we are
          creating a new record or targeting one that already exists.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="rounded-lg border border-[#b8cfe5] bg-white p-5">
            <p className="font-bold">CREATE</p>

            <pre className="mt-3 overflow-x-auto text-sm leading-7">
              {`POST /v1/records

6 → Walter
7 → 44
8 → Orange

        ↓

Quickbase creates
a new record`}
            </pre>
          </div>

          <div className="rounded-lg border border-[#b8cfe5] bg-white p-5">
            <p className="font-bold">UPDATE</p>

            <pre className="mt-3 overflow-x-auto text-sm leading-7">
              {`POST /v1/records

3 → 14
6 → Walter
7 → 45
8 → Orange

        ↓

Quickbase updates
Record ID 14`}
            </pre>
          </div>
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

          <h2 className="text-2xl font-bold">Send the UPDATE Request</h2>
        </div>

        <p className="max-w-4xl leading-7 text-gray-700">
          The edit form submission follows the same fundamental REST process we
          already learned: prevent normal form submission, get temporary
          authorization, build a JSON payload, and send it to Quickbase.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#18212b] p-5 text-sm leading-7 text-white">
          {`async function updatePerson(event) {
  event.preventDefault();

  const recordId =
    document.getElementById(
      "editRecordId",
    ).value;

  const name =
    document.getElementById(
      "editPersonName",
    ).value.trim();

  const age =
    document.getElementById(
      "editPersonAge",
    ).value;

  const favoriteColor =
    document.getElementById(
      "editPersonColor",
    ).value.trim();

  const temporaryToken =
    await getTemporaryToken();

  const payload =
    buildUpdatePersonPayload(
      recordId,
      name,
      age,
      favoriteColor,
    );

  // Send payload to Quickbase...
}`}
        </pre>

        <p className="mt-5 max-w-4xl leading-7 text-gray-700">
          The actual API request uses the same endpoint introduced during
          CREATE:
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#18212b] p-5 text-sm leading-7 text-white">
          {`const response = await fetch(
  "https://api.quickbase.com/v1/records",
  {
    method: "POST",

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
            Read Quickbase&apos;s UPDATE Acknowledgment
          </h2>
        </div>

        <p className="max-w-4xl leading-7 text-gray-700">
          Quickbase again answers the request with structured JSON metadata.
          This time the important property is
          <code> updatedRecordIds</code>.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#18212b] p-5 text-sm leading-7 text-white">
          {`const data = await response.json();

if (!response.ok) {
  throw new Error(
    \`HTTP \${response.status}: \${JSON.stringify(data)}\`,
  );
}

const updatedRecordId =
  data.metadata?.updatedRecordIds?.[0];`}
        </pre>

        <div className="mt-6 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
          <p className="font-bold text-[#1f5c99]">
            The successful training response
          </p>

          <pre className="mt-4 overflow-x-auto rounded-lg bg-[#f7f8fa] p-5 text-sm leading-7">
            {`metadata
├── createdRecordIds: []
├── totalNumberOfRecordsProcessed: 1
├── unchangedRecordIds: []
└── updatedRecordIds:
    └── 14`}
          </pre>

          <div className="mt-5 grid gap-3">
            <p className="leading-7">
              <code>createdRecordIds: []</code>
              {" — "}no new record was created.
            </p>

            <p className="leading-7">
              <code>unchangedRecordIds: []</code>
              {" — "}the submitted record was not left unchanged.
            </p>

            <p className="leading-7">
              <code>updatedRecordIds: [14]</code>
              {" — "}existing Record ID 14 was updated.
            </p>

            <p className="leading-7">
              <code>totalNumberOfRecordsProcessed: 1</code>
              {" — "}Quickbase processed one submitted record.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================
          REQUEST ACKNOWLEDGMENT
      ========================================================= */}
      <div className="mb-10 rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Request / Acknowledgment
        </p>

        <h2 className="text-2xl font-bold">
          Quickbase Tells Us What Kind of Write Occurred
        </h2>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-[#b8cfe5] bg-white p-5 text-sm leading-7">
          {`JavaScript
    │
    │ UPDATE REQUEST
    │ Record ID 14
    ▼
Quickbase
    │
    │ Finds existing record
    │ Changes submitted values
    ▼
JSON Response
    │
    │ metadata.updatedRecordIds
    ▼
   [14]`}
        </pre>

        <p className="mt-5 leading-7">
          This is stronger than simply receiving an HTTP success status.
          Quickbase&apos;s response describes the outcome of the record
          operation.
        </p>
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
            Reload the People Table and Verify the Change
          </h2>
        </div>

        <p className="max-w-4xl leading-7 text-gray-700">
          Once Quickbase acknowledges the UPDATE, the form reports success,
          clears its values, and performs another READ so the table reflects the
          current Quickbase data.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#18212b] p-5 text-sm leading-7 text-white">
          {`status.textContent =
  \`Quickbase Record ID \${updatedRecordId} was updated successfully.\`;

event.target.reset();

await loadPeople();`}
        </pre>

        <div className="mt-5 rounded-lg border-l-4 border-[#1f5c99] bg-[#f7f8fa] p-5">
          <p className="font-bold">
            The table is not manually patched with the edited values.
          </p>

          <p className="mt-2 leading-7 text-gray-700">
            The page performs another READ from Quickbase. The updated table
            therefore reflects the data Quickbase currently stores.
          </p>
        </div>
      </div>

      {/* =========================================================
          COMPLETE WORKFLOW
      ========================================================= */}
      <div className="mb-10 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Complete Flow
        </p>

        <h2 className="text-2xl font-bold">
          SELECT → EDIT → UPDATE → CONFIRM → READ → VERIFY
        </h2>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#f7f8fa] p-5 text-sm leading-7">
          {`READ People records
      ↓
Render Edit button
      ↓
Click Edit
      ↓
beginEditPerson(...)
      ↓
Store Record ID#
      ↓
Populate current values
      ↓
Change values
      ↓
Submit edit form
      ↓
buildUpdatePersonPayload(...)
      ↓
Include Field ID 3
      ↓
POST /v1/records
      ↓
Quickbase updates existing record
      ↓
metadata.updatedRecordIds
      ↓
Show success message
      ↓
Reset edit form
      ↓
await loadPeople()
      ↓
POST /v1/records/query
      ↓
Render authoritative updated values`}
        </pre>
      </div>

      {/* =========================================================
          CREATE VS UPDATE SUMMARY
      ========================================================= */}
      <div className="mb-10 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Connect Lesson 5 and Lesson 6
        </p>

        <h2 className="text-2xl font-bold">The Metadata Reveals the Outcome</h2>

        <div className="mt-6 overflow-x-auto rounded-lg border border-gray-300">
          <table className="w-full border-collapse text-left">
            <thead className="bg-[#1f5c99] text-white">
              <tr>
                <th className="px-4 py-3">Lesson</th>
                <th className="px-4 py-3">Operation</th>
                <th className="px-4 py-3">Response Metadata</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              <tr>
                <td className="px-4 py-3 font-bold">Lesson 5</td>
                <td className="px-4 py-3">CREATE</td>
                <td className="px-4 py-3">
                  <code>metadata.createdRecordIds</code>
                </td>
              </tr>

              <tr>
                <td className="px-4 py-3 font-bold">Lesson 6</td>
                <td className="px-4 py-3">UPDATE</td>
                <td className="px-4 py-3">
                  <code>metadata.updatedRecordIds</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-5 max-w-4xl leading-7 text-gray-700">
          The endpoint remains the same, but Quickbase&apos;s acknowledgment
          explicitly tells us what happened to the submitted record.
        </p>
      </div>

      {/* =========================================================
          DEBUGGING LESSON
      ========================================================= */}
      <div className="mb-10 rounded-lg border border-gray-300 bg-[#f7f8fa] p-6">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          A Debugging Lesson from the Lab
        </p>

        <h2 className="text-2xl font-bold">
          A Broken Page Does Not Always Mean the Quickbase Request Is Wrong
        </h2>

        <p className="mt-3 max-w-4xl leading-7 text-gray-700">
          During the Lesson 6 build, an abandoned test line prevented JavaScript
          from reaching the normal page initialization. The Quickbase UPDATE
          architecture itself was correct.
        </p>

        <p className="mt-4 max-w-4xl leading-7 text-gray-700">
          That accidental failure reinforced an important debugging habit: when
          the table suddenly stops loading, first determine whether JavaScript
          reached the API call at all before changing working Quickbase code.
        </p>
      </div>

      {/* =========================================================
          LESSON COMPLETE
      ========================================================= */}
      <div className="rounded-lg border border-gray-300 bg-[#f7f8fa] p-6">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Lesson 6 Complete
        </p>

        <h2 className="text-2xl font-bold">
          You Can Now Update Existing Quickbase Records
        </h2>

        <p className="mt-3 max-w-4xl leading-7 text-gray-700">
          You selected an existing record, preserved its Record ID#, populated
          an edit form, changed its field values, built an UPDATE payload,
          submitted it through the REST API, interpreted
          <code> metadata.updatedRecordIds</code>, and re-read the table to
          verify the result.
        </p>

        <div className="mt-6 border-t border-gray-300 pt-5">
          <p className="font-bold text-[#1f5c99]">
            Next: Lesson 7 — Delete Records
          </p>

          <p className="mt-2 max-w-4xl leading-7 text-gray-700">
            CREATE and UPDATE are now working. Lesson 7 will use the identity of
            an existing People record again—but this time the operation removes
            it from Quickbase and completes the CRUD sequence.
          </p>
        </div>
      </div>
    </section>
  );
}
