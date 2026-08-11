import Link from "next/link";

export default function Lesson5Page() {
  return (
    <section>
      {/* =========================================================
          LESSON HEADER
      ========================================================= */}
      <div className="mb-10 border-b border-gray-300 pb-8">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Lesson 5
        </p>
        <Link
          href="/files/PeoplePage_add.txt"
          target="_blank"
          className="font-bold text-[#1f5c99] underline"
        >
          Code Page Here - PeoplePage_add.html
        </Link>
        <h1 className="text-4xl font-bold">
          Add Records with the Quickbase REST API
        </h1>

        <p className="mt-4 max-w-4xl text-lg leading-8 text-gray-700">
          Move beyond reading Quickbase data and create a new People record from
          a Code Page. This lesson introduces the REST record payload,
          Quickbase&apos;s CREATE endpoint, and the JSON acknowledgment
          Quickbase returns after the record is created.
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
          Send Data to Quickbase and Confirm What It Created
        </h2>

        <p className="mt-3 max-w-4xl leading-7">
          Build a JSON payload from an HTML form, send it to the Quickbase REST
          API, inspect the response metadata, retrieve the newly assigned Record
          ID#, and reload the People table to verify the new record.
        </p>
      </div>

      {/* =========================================================
          WHAT CHANGES
      ========================================================= */}
      <div className="mb-10">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          The Important Change
        </p>

        <h2 className="text-3xl font-bold">
          Until Now, Data Has Been Traveling Toward JavaScript
        </h2>

        <p className="mt-4 max-w-4xl leading-7 text-gray-700">
          Lessons 1 through 4 concentrated primarily on asking Quickbase for
          information. Lesson 5 reverses that direction for the first time:
          JavaScript now sends record values to Quickbase.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
            <p className="font-bold text-[#1f5c99]">Previous Lessons</p>

            <pre className="mt-4 overflow-x-auto rounded-md bg-[#f7f8fa] p-5 text-sm leading-7">
              {`Quickbase
    ↓
JSON / XML
    ↓
JavaScript
    ↓
HTML`}
            </pre>

            <p className="mt-4 leading-7 text-gray-700">
              Quickbase supplied information and the Code Page displayed or
              manipulated it.
            </p>
          </div>

          <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
            <p className="font-bold text-[#1f5c99]">Lesson 5</p>

            <pre className="mt-4 overflow-x-auto rounded-md bg-[#f7f8fa] p-5 text-sm leading-7">
              {`HTML Form
    ↓
JavaScript
    ↓
JSON Payload
    ↓
Quickbase`}
            </pre>

            <p className="mt-4 leading-7 text-gray-700">
              The Code Page supplies values and asks Quickbase to create a new
              record.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================
          PEOPLE TABLE FIELDS
      ========================================================= */}
      <div className="mb-10 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          People Table
        </p>

        <h2 className="text-2xl font-bold">
          The Same Fields, Now Moving in the Other Direction
        </h2>

        <p className="mt-3 leading-7 text-gray-700">
          The People table has not changed. We are still working with the same
          Quickbase Field IDs used throughout the lab.
        </p>

        <div className="mt-6 overflow-x-auto rounded-lg border border-gray-300">
          <table className="w-full border-collapse text-left">
            <thead className="bg-[#1f5c99] text-white">
              <tr>
                <th className="px-4 py-3">Field</th>
                <th className="px-4 py-3">Field ID</th>
                <th className="px-4 py-3">CREATE Behavior</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              <tr>
                <td className="px-4 py-3 font-semibold">Record ID#</td>
                <td className="px-4 py-3">
                  <code>3</code>
                </td>
                <td className="px-4 py-3">
                  Quickbase assigns this automatically.
                </td>
              </tr>

              <tr>
                <td className="px-4 py-3 font-semibold">Name</td>
                <td className="px-4 py-3">
                  <code>6</code>
                </td>
                <td className="px-4 py-3">
                  JavaScript supplies the form value.
                </td>
              </tr>

              <tr>
                <td className="px-4 py-3 font-semibold">Age</td>
                <td className="px-4 py-3">
                  <code>7</code>
                </td>
                <td className="px-4 py-3">
                  JavaScript supplies the numeric value.
                </td>
              </tr>

              <tr>
                <td className="px-4 py-3 font-semibold">Favorite Color</td>
                <td className="px-4 py-3">
                  <code>8</code>
                </td>
                <td className="px-4 py-3">
                  JavaScript supplies the form value.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* =========================================================
    LESSON STEPS OVERVIEW
========================================================= */}
      <div className="mb-10 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Lesson 5 Roadmap
        </p>

        <h2 className="text-2xl font-bold">
          Five Steps from Form to Quickbase Record
        </h2>

        <p className="mt-3 max-w-4xl leading-7 text-gray-700">
          This lesson builds the CREATE workflow one piece at a time. Use this
          roadmap to see where you are in the process and how each step leads to
          the next.
        </p>

        <div className="mt-6 grid gap-3">
          <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-[#f7f8fa] p-4">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1f5c99] font-bold text-white">
              1
            </span>

            <div>
              <p className="font-bold">Build the payload</p>
              <p className="mt-1 text-sm text-gray-600">
                Organize the People field values into the JSON structure
                Quickbase expects.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-[#f7f8fa] p-4">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1f5c99] font-bold text-white">
              2
            </span>

            <div>
              <p className="font-bold">Take control of the form</p>
              <p className="mt-1 text-sm text-gray-600">
                Let JavaScript handle the submitted values instead of a normal
                browser form submission.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-[#f7f8fa] p-4">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1f5c99] font-bold text-white">
              3
            </span>

            <div>
              <p className="font-bold">Send the CREATE request</p>
              <p className="mt-1 text-sm text-gray-600">
                Send the record payload to the Quickbase REST API.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-[#f7f8fa] p-4">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1f5c99] font-bold text-white">
              4
            </span>

            <div>
              <p className="font-bold">Read Quickbase&apos;s response</p>
              <p className="mt-1 text-sm text-gray-600">
                Inspect the JSON acknowledgment and retrieve the Record ID#
                Quickbase assigned.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-[#f7f8fa] p-4">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1f5c99] font-bold text-white">
              5
            </span>

            <div>
              <p className="font-bold">Complete the workflow</p>
              <p className="mt-1 text-sm text-gray-600">
                Report success, reset the form, and reload the People table to
                confirm the new record.
              </p>
            </div>
          </div>
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
            Build the Quickbase Record Payload
          </h2>
        </div>

        <p className="max-w-4xl leading-7 text-gray-700">
          The form gives JavaScript three values: Name, Age, and Favorite Color.
          Those values must be converted into the record structure expected by
          the Quickbase REST API.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#18212b] p-5 text-sm leading-7 text-white">
          {`function buildPersonPayload(name, age, favoriteColor) {
  return {
    to: TABLE_DBID,

    data: [
      {
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

        <div className="mt-5 rounded-lg border-l-4 border-[#1f5c99] bg-[#f7f8fa] p-5">
          <p className="font-bold">Notice what is missing.</p>

          <p className="mt-2 leading-7">
            Field ID <code>3</code>, Record ID#, is not included in the payload.
            Quickbase creates the new record and assigns its Record ID#
            automatically.
          </p>
        </div>
      </div>

      {/* =========================================================
          PAYLOAD BREAKDOWN
      ========================================================= */}
      <div className="mb-10 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Payload Anatomy
        </p>

        <h2 className="text-2xl font-bold">
          Quickbase Field IDs Become JSON Object Keys
        </h2>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#f7f8fa] p-5 text-sm leading-7">
          {`{
  to: TABLE_DBID,

  data: [
    {
      6: { value: "Walter" },
      7: { value: 44 },
      8: { value: "Orange" }
    }
  ]
}`}
        </pre>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-md border border-gray-300 p-4">
            <code className="font-bold text-[#1f5c99]">to</code>
            <p className="mt-2 text-sm leading-6 text-gray-700">
              Identifies the destination Quickbase table.
            </p>
          </div>

          <div className="rounded-md border border-gray-300 p-4">
            <code className="font-bold text-[#1f5c99]">data</code>
            <p className="mt-2 text-sm leading-6 text-gray-700">
              Contains the records Quickbase should process.
            </p>
          </div>

          <div className="rounded-md border border-gray-300 p-4">
            <code className="font-bold text-[#1f5c99]">fieldId.value</code>
            <p className="mt-2 text-sm leading-6 text-gray-700">
              Identifies each Quickbase field and its submitted value.
            </p>
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

          <h2 className="text-2xl font-bold">Take Control of the HTML Form</h2>
        </div>

        <p className="max-w-4xl leading-7 text-gray-700">
          The form should not perform a normal browser submission. JavaScript
          intercepts the submit event, reads the field values, and handles the
          request through the Quickbase REST API.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#18212b] p-5 text-sm leading-7 text-white">
          {`async function addPerson(event) {
  event.preventDefault();

  const name =
    document.getElementById("personName").value.trim();

  const age =
    document.getElementById("personAge").value;

  const favoriteColor =
    document.getElementById("personColor").value.trim();

  // Build and submit the Quickbase request...
}`}
        </pre>

        <div className="mt-5 rounded-lg border border-gray-300 bg-[#f7f8fa] p-5">
          <p className="font-bold">
            Why <code>event.preventDefault()</code>?
          </p>

          <p className="mt-2 leading-7 text-gray-700">
            It prevents the browser from performing the form&apos;s normal page
            submission. JavaScript remains in control of the interaction.
          </p>
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

          <h2 className="text-2xl font-bold">Send the CREATE Request</h2>
        </div>

        <p className="max-w-4xl leading-7 text-gray-700">
          The REST request resembles the READ request from Lesson 1B, but it
          uses a different endpoint and sends a record payload instead of a
          query definition.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm">
            <p className="font-bold text-[#1f5c99]">READ</p>

            <code className="mt-3 block rounded bg-[#f7f8fa] p-3 font-bold">
              POST /v1/records/query
            </code>

            <p className="mt-3 leading-7 text-gray-700">
              Ask Quickbase to return records.
            </p>
          </div>

          <div className="rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-5">
            <p className="font-bold text-[#1f5c99]">CREATE — New in Lesson 5</p>

            <code className="mt-3 block rounded border border-[#b8cfe5] bg-white p-3 font-bold">
              POST /v1/records
            </code>

            <p className="mt-3 leading-7">
              Send field values to Quickbase for writing.
            </p>
          </div>
        </div>

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
          AHA MOMENT
      ========================================================= */}
      <div className="mb-10 rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Aha Moment
        </p>

        <h2 className="text-2xl font-bold">
          The API Call Is a Request and an Acknowledgment
        </h2>

        <p className="mt-3 max-w-4xl leading-7">
          Sending the JSON payload is only half of the operation. Quickbase
          processes the request and then returns a structured JSON response
          describing what happened.
        </p>

        <div className="mt-6 rounded-lg border border-[#b8cfe5] bg-white p-6">
          <pre className="overflow-x-auto text-sm leading-7">
            {`JavaScript
    │
    │  REQUEST
    │  "Create this record"
    ▼
Quickbase
    │
    │  Creates the record
    │  Assigns Record ID#
    ▼
JSON Response
    │
    │  ACKNOWLEDGMENT
    │  "Here is what happened."
    ▼
JavaScript`}
          </pre>
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
            Read Quickbase&apos;s JSON Response
          </h2>
        </div>

        <p className="max-w-4xl leading-7 text-gray-700">
          Just as the READ endpoint returns JSON records, the CREATE endpoint
          returns JSON describing the result of the write operation.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#18212b] p-5 text-sm leading-7 text-white">
          {`const data = await response.json();

if (!response.ok) {
  throw new Error(
    \`HTTP \${response.status}: \${JSON.stringify(data)}\`,
  );
}`}
        </pre>
      </div>

      {/* =========================================================
          METADATA
      ========================================================= */}
      <div className="mb-10 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Quickbase Response Metadata
        </p>

        <h2 className="text-2xl font-bold">
          Quickbase Tells Us Which Record It Created
        </h2>

        <p className="mt-3 max-w-4xl leading-7 text-gray-700">
          The response includes a <code>metadata</code> object. For this lesson,
          the most important property is <code>createdRecordIds</code>.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#18212b] p-5 text-sm leading-7 text-white">
          {`const createdRecordId =
  data.metadata?.createdRecordIds?.[0];`}
        </pre>

        <div className="mt-6 grid gap-5 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <div className="rounded-lg border border-gray-300 bg-[#f7f8fa] p-5">
            <p className="font-bold">What JavaScript sent</p>

            <pre className="mt-3 overflow-x-auto text-sm leading-7">
              {`6 → Walter
7 → 44
8 → Orange`}
            </pre>
          </div>

          <div className="hidden text-3xl font-bold text-[#1f5c99] md:block">
            →
          </div>

          <div className="rounded-lg border border-gray-300 bg-[#f7f8fa] p-5">
            <p className="font-bold">What Quickbase added</p>

            <pre className="mt-3 overflow-x-auto text-sm leading-7">
              {`Record ID# → 12
Name       → Walter
Age        → 44
Color      → Orange`}
            </pre>
          </div>
        </div>
      </div>

      {/* =========================================================
          RECORD ID FULL CIRCLE
      ========================================================= */}
      <div className="mb-10">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Connect the Lessons
        </p>

        <h2 className="text-3xl font-bold">Record ID# Comes Full Circle</h2>

        <p className="mt-4 max-w-4xl leading-7 text-gray-700">
          We have been reading Field ID 3 since the beginning of the REST
          lessons. Lesson 5 finally shows where that value originates when a
          record is created.
        </p>

        <div className="mt-6 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
          <pre className="overflow-x-auto text-sm leading-7">
            {`CREATE REQUEST

Field 6 → Name
Field 7 → Age
Field 8 → Favorite Color

        ↓

QUICKBASE

Creates the record
Assigns Record ID#

        ↓

CREATE RESPONSE

metadata.createdRecordIds
        ↓
       [12]

        ↓

NEXT READ

record["3"].value
        ↓

Record ID# appears in the People table`}
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

          <h2 className="text-2xl font-bold">Complete the CREATE Workflow</h2>
        </div>

        <p className="max-w-4xl leading-7 text-gray-700">
          After Quickbase confirms the new record, report the assigned Record
          ID#, clear the form, and then reload the People table.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#18212b] p-5 text-sm leading-7 text-white">
          {`status.textContent =
  \`\${name} was added to Quickbase as Record ID \${createdRecordId}.\`;

event.target.reset();

await loadPeople();`}
        </pre>

        <div className="mt-5 rounded-lg border-l-4 border-[#1f5c99] bg-[#f7f8fa] p-5">
          <p className="font-bold">
            Why use <code>await loadPeople()</code>?
          </p>

          <p className="mt-2 leading-7 text-gray-700">
            The CREATE workflow waits for the follow-up READ operation to
            finish. The newly created Quickbase record is then rendered from the
            table&apos;s current data.
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

        <h2 className="text-2xl font-bold">CREATE Followed by READ</h2>

        <pre className="mt-5 overflow-x-auto rounded-lg bg-[#f7f8fa] p-5 text-sm leading-7">
          {`Fill out form
      ↓
Submit
      ↓
addPerson(event)
      ↓
event.preventDefault()
      ↓
Read form values
      ↓
getTemporaryToken()
      ↓
buildPersonPayload(...)
      ↓
POST /v1/records
      ↓
Quickbase creates record
      ↓
JSON acknowledgment
      ↓
metadata.createdRecordIds
      ↓
Show Record ID#
      ↓
Reset form
      ↓
await loadPeople()
      ↓
POST /v1/records/query
      ↓
Render updated People table`}
        </pre>
      </div>

      {/* =========================================================
          READ VS CREATE SUMMARY
      ========================================================= */}
      <div className="mb-10 rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6">
        <h2 className="text-2xl font-bold">One Important REST Detail</h2>

        <p className="mt-3 max-w-4xl leading-7">
          Both operations use the HTTP method <code>POST</code>, but they do
          different things because they use different Quickbase endpoints and
          different request contracts.
        </p>

        <div className="mt-5 overflow-x-auto rounded-lg border border-[#b8cfe5] bg-white">
          <table className="w-full border-collapse text-left">
            <thead className="bg-[#1f5c99] text-white">
              <tr>
                <th className="px-4 py-3">Operation</th>
                <th className="px-4 py-3">Endpoint</th>
                <th className="px-4 py-3">Meaning</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 font-bold">READ</td>
                <td className="px-4 py-3">
                  <code>/v1/records/query</code>
                </td>
                <td className="px-4 py-3">
                  Give JavaScript Quickbase records.
                </td>
              </tr>

              <tr>
                <td className="px-4 py-3 font-bold">CREATE</td>
                <td className="px-4 py-3">
                  <code>/v1/records</code>
                </td>
                <td className="px-4 py-3">
                  Give Quickbase record values to write.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================
          LESSON COMPLETE
      ========================================================= */}
      <div className="rounded-lg border border-gray-300 bg-[#f7f8fa] p-6">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Lesson 5 Complete
        </p>

        <h2 className="text-2xl font-bold">
          You Can Now Create Quickbase Records from a Code Page
        </h2>

        <p className="mt-3 max-w-4xl leading-7 text-gray-700">
          You built a Quickbase record payload, sent it through the REST API,
          interpreted Quickbase&apos;s JSON acknowledgment, retrieved the new
          Record ID#, reset the form, and refreshed the table to verify the new
          record.
        </p>

        <div className="mt-6 border-t border-gray-300 pt-5">
          <p className="font-bold text-[#1f5c99]">
            Next: Lesson 6 — Edit Records
          </p>

          <p className="mt-2 leading-7 text-gray-700">
            The next lesson will use the identity of an existing Quickbase
            record to change values that are already stored in the People table.
          </p>
        </div>
      </div>
    </section>
  );
}
