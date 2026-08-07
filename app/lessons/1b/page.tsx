import Link from "next/link";

const quickbaseObjects = [
  {
    object: "Quickbase realm",
    identity: "Realm hostname",
    value: "window.location.hostname",
    purpose:
      "Identifies the Quickbase realm making and receiving the REST requests.",
  },
  {
    object: "People table",
    identity: "Table DBID",
    value: "bv9j6j4n5",
    purpose:
      "Identifies the Quickbase table used for temporary authorization and the records query.",
  },
  {
    object: "Record ID#",
    identity: "Field ID",
    value: "3",
    purpose:
      "Identifies the Quickbase Record ID# field in the REST query and response.",
  },
  {
    object: "Name",
    identity: "Field ID",
    value: "6",
    purpose:
      "Identifies the Name field and is also used as the REST sort field.",
  },
  {
    object: "Age",
    identity: "Field ID",
    value: "7",
    purpose: "Identifies the Age field.",
  },
  {
    object: "Favorite Color",
    identity: "Field ID",
    value: "8",
    purpose: "Identifies the Favorite Color field.",
  },
];

const comparisonRows = [
  {
    concept: "API style",
    xml: "Legacy XML API",
    rest: "RESTful API",
  },
  {
    concept: "Query endpoint",
    xml: "/db/{TABLE_DBID}",
    rest: "https://api.quickbase.com/v1/records/query",
  },
  {
    concept: "API operation",
    xml: "QUICKBASE-ACTION: API_DoQuery",
    rest: "Endpoint determines the operation",
  },
  {
    concept: "Request data",
    xml: "<qdbapi> XML",
    rest: "JSON object",
  },
  {
    concept: "Requested fields",
    xml: "<clist>3.6.7.8</clist>",
    rest: "select: [3, 6, 7, 8]",
  },
  {
    concept: "Sorting",
    xml: "<slist>6</slist> + sortorder-A",
    rest: 'sortBy: [{ fieldId: 6, order: "ASC" }]',
  },
  {
    concept: "Response parsing",
    xml: "response.text() + DOMParser",
    rest: "response.json()",
  },
  {
    concept: "Returned field",
    xml: '<f id="6">Alice</f>',
    rest: '"6": { "value": "Alice" }',
  },
  {
    concept: "Read field value",
    xml: "querySelector('f[id=\"6\"]')",
    rest: 'record["6"].value',
  },
];

const lessonSource = `/*
 * ============================================================
 * QUICKBASE REALM
 * ============================================================
 *
 * A Quickbase REST request must identify the Quickbase realm.
 *
 * Because this Code Page is running inside Quickbase,
 * window.location.hostname gives us the current realm hostname.
 */
const REALM = window.location.hostname;


/*
 * ============================================================
 * QUICKBASE TABLE DBID
 * ============================================================
 *
 * The visible table name is "People", but REST API requests
 * identify the table using its DBID.
 */
const TABLE_DBID = "bv9j6j4n5";


/*
 * ============================================================
 * QUICKBASE APPLICATION TOKEN
 * ============================================================
 *
 * This application requires an Application Token.
 *
 * Do not place a Quickbase User Token in browser JavaScript.
 */
const APP_TOKEN = "YOUR_APPLICATION_TOKEN";


/*
 * ============================================================
 * QUICKBASE FIELD IDs
 * ============================================================
 *
 * The JavaScript property names are chosen by us.
 * The numbers are the actual Quickbase Field IDs.
 */
const FIELD_IDS = {
  recordId: 3,
  name: 6,
  age: 7,
  favoriteColor: 8,
};


/*
 * ============================================================
 * TEMPORARY REST AUTHORIZATION
 * ============================================================
 *
 * Unlike our XML example, the REST Code Page first obtains
 * temporary REST authorization.
 *
 * TABLE_DBID is included in the authorization endpoint.
 */
async function getTemporaryToken() {
  const response = await fetch(
    \`https://api.quickbase.com/v1/auth/temporary/\${TABLE_DBID}\`,
    {
      method: "GET",

      /*
       * Include the signed-in Quickbase browser session.
       */
      credentials: "include",

      headers: {
        /*
         * Tell Quickbase which realm this request belongs to.
         */
        "QB-Realm-Hostname": REALM,

        /*
         * Supply the Application Token required by this app.
         */
        "QB-App-Token": APP_TOKEN,
      },
    },
  );

  /*
   * REST responses are JSON.
   */
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      \`HTTP \${response.status}: \${JSON.stringify(data)}\`
    );
  }

  /*
   * The successful response must contain the temporary
   * authorization value needed for the REST query.
   */
  if (!data.temporaryAuthorization) {
    throw new Error(
      "Quickbase did not return temporaryAuthorization."
    );
  }

  /*
   * Never console.log() this token in finished code.
   */
  return data.temporaryAuthorization;
}


/*
 * ============================================================
 * READING A QUICKBASE REST FIELD
 * ============================================================
 *
 * A REST record uses the Quickbase Field ID as a JSON property.
 *
 * Simplified example:
 *
 * {
 *   "3": { "value": 1 },
 *   "6": { "value": "Alice" },
 *   "7": { "value": 32 },
 *   "8": { "value": "Blue" }
 * }
 *
 * If fieldId is 6:
 *
 *     record[String(fieldId)]
 *
 * becomes:
 *
 *     record["6"]
 *
 * and .value returns the Quickbase field value.
 */
function getFieldValue(record, fieldId) {
  return record[String(fieldId)]?.value ?? "";
}


async function loadPeople() {
  /*
   * Benchmark starts before REST authorization so the measured
   * total includes the complete Code Page REST process.
   */
  const startTime = performance.now();

  const status = document.getElementById("status");

  try {
    /*
     * ==========================================================
     * STEP 1 — GET TEMPORARY QUICKBASE REST AUTHORIZATION
     * ==========================================================
     */
    const temporaryToken = await getTemporaryToken();


    /*
     * ==========================================================
     * STEP 2 — BUILD THE QUICKBASE REST QUERY
     * ==========================================================
     *
     * from:
     *   identifies the Quickbase table.
     *
     * select:
     *   specifies which Field IDs should be returned.
     *
     * sortBy:
     *   tells Quickbase to sort using Field ID 6 (Name)
     *   in ascending order.
     */
    const query = {
      from: TABLE_DBID,

      select: [
        FIELD_IDS.recordId,
        FIELD_IDS.name,
        FIELD_IDS.age,
        FIELD_IDS.favoriteColor,
      ],

      sortBy: [
        {
          fieldId: FIELD_IDS.name,
          order: "ASC",
        },
      ],
    };


    /*
     * ==========================================================
     * STEP 3 — QUERY QUICKBASE RECORDS
     * ==========================================================
     */
    const response = await fetch(
      "https://api.quickbase.com/v1/records/query",
      {
        method: "POST",

        headers: {
          /*
           * Identify the Quickbase realm.
           */
          "QB-Realm-Hostname": REALM,

          /*
           * Authorize this REST request using the temporary
           * token acquired in Step 1.
           */
          Authorization:
            \`QB-TEMP-TOKEN \${temporaryToken}\`,

          /*
           * The request body contains JSON.
           */
          "Content-Type": "application/json",
        },

        /*
         * Convert the JavaScript query object into JSON text.
         */
        body: JSON.stringify(query),
      },
    );


    /*
     * Convert the REST JSON response into JavaScript objects.
     */
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        \`HTTP \${response.status}: \${JSON.stringify(data)}\`
      );
    }


    /*
     * ==========================================================
     * QUICKBASE REST RECORD COLLECTION
     * ==========================================================
     *
     * Returned records are located in:
     *
     *     data.data
     *
     * Each item represents one Quickbase record.
     */
    renderRecords(data.data);


    /*
     * Stop the timer after all records have been rendered.
     */
    const endTime = performance.now();

    const renderTime = endTime - startTime;

    status.classList.remove("error");

    status.textContent =
      \`REST query returned \${data.data.length} record(s) in \${renderTime.toFixed(2)} ms.\`;

  } catch (error) {
    console.error(error);

    status.classList.add("error");

    status.textContent =
      \`REST query failed: \${error.message}\`;
  }
}

document.addEventListener(
  "DOMContentLoaded",
  loadPeople
);`;

export default function Lesson1BPage() {
  return (
    <article>
      {/* LESSON HEADER */}
      <header className="mb-10 border-b border-gray-300 pb-8">
        <p className="font-bold uppercase tracking-wide text-[#1f5c99]">
          Lesson 1B
        </p>
        <Link
          href="/files/PeoplePage_rest.txt"
          target="_blank"
          className="font-bold text-[#1f5c99] underline"
        >
          Code Page Here - PeoplePage_rest.html
        </Link>
        <h1 className="mt-2 text-4xl font-bold">
          Read Records with the REST API
        </h1>

        <p className="mt-4 max-w-4xl text-xl">
          Query the same Quickbase People table using the modern JSON REST API
          while keeping the table, fields, sorting, and rendered result
          equivalent to Lesson 1A.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <span className="rounded-md border border-green-700 bg-green-50 px-3 py-1 text-sm font-bold text-green-900">
            Complete
          </span>

          <span className="rounded-md border border-gray-400 bg-white px-3 py-1 text-sm font-bold">
            REST API
          </span>

          <span className="rounded-md border border-gray-400 bg-white px-3 py-1 text-sm font-bold">
            JSON
          </span>

          <span className="rounded-md border border-gray-400 bg-white px-3 py-1 text-sm font-bold">
            Temporary Authorization
          </span>
        </div>
      </header>

      {/* OBJECTIVE */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold">Lesson Objective</h2>

        <p className="mt-4">
          Lesson 1A established how Quickbase tables and fields are represented
          in API code. Lesson 1B deliberately keeps those same Quickbase objects
          and changes only the API architecture.
        </p>

        <p className="mt-4">
          The important question is no longer simply,
          <strong> “How do I query the People table?”</strong>
        </p>

        <p className="mt-4">
          The question is:
          <strong>
            {" "}
            how does the modern Quickbase REST API represent the same table,
            fields, authorization, query, records, and values?
          </strong>
        </p>
      </section>

      {/* SAME DATA */}
      <section className="mb-12 rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6">
        <h2 className="text-2xl font-bold">A Controlled Comparison</h2>

        <p className="mt-4">
          Lesson 1B uses the exact same Quickbase People table as Lesson 1A.
          That gives us a controlled comparison between the two APIs.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-[#1f5c99] text-white">
                <th className="border border-gray-300 px-4 py-3 text-left">
                  Object
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left">
                  Quickbase Identity
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left">
                  Value
                </th>
              </tr>
            </thead>

            <tbody>
              {quickbaseObjects.map((item) => (
                <tr key={item.object}>
                  <td className="border border-gray-300 px-4 py-3 font-semibold">
                    {item.object}
                  </td>

                  <td className="border border-gray-300 px-4 py-3">
                    {item.identity}
                  </td>

                  <td className="border border-gray-300 px-4 py-3">
                    <code>{item.value}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* REALM */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold">1. Identify the Quickbase Realm</h2>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`const REALM = window.location.hostname;`}</code>
        </pre>

        <p className="mt-4">
          This is our first new Quickbase reference compared with Lesson 1A.
          REST requests include the Quickbase realm hostname in the
          <code className="mx-1">QB-Realm-Hostname</code> header.
        </p>

        <p className="mt-4">
          Because the working HTML file is a Quickbase Code Page,
          <code className="mx-1">window.location.hostname</code>
          retrieves the hostname of the Quickbase realm currently hosting that
          page.
        </p>
      </section>

      {/* TABLE + FIELD IDENTITIES */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold">
          2. The Table DBID and Field IDs Do Not Change
        </h2>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`const TABLE_DBID = "bv9j6j4n5";

const FIELD_IDS = {
  recordId: 3,
  name: 6,
  age: 7,
  favoriteColor: 8,
};`}</code>
        </pre>

        <p className="mt-4">
          XML and REST are different interfaces to Quickbase, but the underlying
          Quickbase objects have not changed.
        </p>

        <div className="mt-6 rounded-lg border border-gray-300 bg-[#f7f8fa] p-6 font-mono leading-8">
          <div>People</div>
          <div className="ml-6">↓</div>
          <div className="ml-6 font-bold">bv9j6j4n5</div>

          <div className="mt-4">Name</div>
          <div className="ml-6">↓</div>
          <div className="ml-6 font-bold">Field ID 6</div>
        </div>

        <p className="mt-4">
          This is one of the most important observations in the first two
          lessons:{" "}
          <strong>the API changed; the Quickbase identities did not.</strong>
        </p>
      </section>

      {/* TEMP AUTH */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold">
          3. Obtain Temporary REST Authorization
        </h2>

        <p className="mt-4">
          This is the largest architectural difference from our XML Code Page.
          Before querying records, the REST example obtains temporary
          authorization from Quickbase.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`const response = await fetch(
  \`https://api.quickbase.com/v1/auth/temporary/\${TABLE_DBID}\`,
  {
    method: "GET",
    credentials: "include",
    headers: {
      "QB-Realm-Hostname": REALM,
      "QB-App-Token": APP_TOKEN,
    },
  },
);`}</code>
        </pre>

        <p className="mt-4">
          Notice how several Quickbase references converge in this one request.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#1f5c99] text-white">
                <th className="border border-gray-300 px-4 py-3 text-left">
                  Code
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left">
                  Quickbase Purpose
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-3">
                  <code>/auth/temporary/${"{TABLE_DBID}"}</code>
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  Requests temporary authorization associated with the Quickbase
                  table.
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-3">
                  <code>credentials: &quot;include&quot;</code>
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  Includes the current signed-in Quickbase browser session.
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-3">
                  <code>QB-Realm-Hostname</code>
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  Identifies the Quickbase realm.
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-3">
                  <code>QB-App-Token</code>
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  Supplies the Application Token required by this application.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* TOKEN RESPONSE */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold">
          4. Read the Temporary Authorization
        </h2>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`const data = await response.json();

if (!data.temporaryAuthorization) {
  throw new Error(
    "Quickbase did not return temporaryAuthorization."
  );
}

return data.temporaryAuthorization;`}</code>
        </pre>

        <p className="mt-4">
          The temporary authorization returned by Quickbase becomes the
          credential for the next REST request.
        </p>

        <div className="mt-6 rounded-lg border-2 border-amber-700 bg-amber-50 p-5">
          <h3 className="text-xl font-bold">Security Note</h3>

          <p className="mt-2">
            During our debugging we temporarily logged the returned token so we
            could prove that authorization worked. That was useful as a
            checkpoint, but the completed instructional code should never log
            the token.
          </p>
        </div>
      </section>

      {/* QUERY OBJECT */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold">
          5. Build the Quickbase JSON Query
        </h2>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`const query = {
  from: TABLE_DBID,

  select: [
    FIELD_IDS.recordId,
    FIELD_IDS.name,
    FIELD_IDS.age,
    FIELD_IDS.favoriteColor,
  ],

  sortBy: [
    {
      fieldId: FIELD_IDS.name,
      order: "ASC",
    },
  ],
};`}</code>
        </pre>

        <p className="mt-4">
          This JSON object performs essentially the same job as several XML
          elements from Lesson 1A.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <div className="rounded-lg border border-gray-300 p-5">
            <h3 className="text-xl font-bold">
              <code>from</code>
            </h3>
            <p className="mt-3">Identifies the Quickbase table DBID.</p>
          </div>

          <div className="rounded-lg border border-gray-300 p-5">
            <h3 className="text-xl font-bold">
              <code>select</code>
            </h3>
            <p className="mt-3">Lists the Quickbase Field IDs to return.</p>
          </div>

          <div className="rounded-lg border border-gray-300 p-5">
            <h3 className="text-xl font-bold">
              <code>sortBy</code>
            </h3>
            <p className="mt-3">Specifies the Field ID and sort direction.</p>
          </div>
        </div>
      </section>

      {/* XML / JSON DIRECT MAPPING */}
      <section className="mb-12 rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6">
        <h2 className="text-2xl font-bold">
          XML and REST: Same Request Intent
        </h2>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <div>
            <h3 className="text-xl font-bold">Lesson 1A — XML</h3>

            <pre className="mt-3 overflow-x-auto rounded-lg border border-gray-300 bg-white p-5 text-base">
              <code>{`<clist>3.6.7.8</clist>
<slist>6</slist>
<options>sortorder-A</options>`}</code>
            </pre>
          </div>

          <div>
            <h3 className="text-xl font-bold">Lesson 1B — REST</h3>

            <pre className="mt-3 overflow-x-auto rounded-lg border border-gray-300 bg-white p-5 text-base">
              <code>{`select: [3, 6, 7, 8],

sortBy: [
  {
    fieldId: 6,
    order: "ASC",
  },
]`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* RECORD QUERY */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold">6. Send the Records Query</h2>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`const response = await fetch(
  "https://api.quickbase.com/v1/records/query",
  {
    method: "POST",

    headers: {
      "QB-Realm-Hostname": REALM,

      Authorization:
        \`QB-TEMP-TOKEN \${temporaryToken}\`,

      "Content-Type": "application/json",
    },

    body: JSON.stringify(query),
  },
);`}</code>
        </pre>

        <p className="mt-4">
          REST changes how the API operation itself is selected.
        </p>

        <p className="mt-4">The XML API uses:</p>

        <pre className="mt-4 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>QUICKBASE-ACTION: API_DoQuery</code>
        </pre>

        <p className="mt-4">REST instead uses a purpose-specific endpoint:</p>

        <pre className="mt-4 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>POST https://api.quickbase.com/v1/records/query</code>
        </pre>
      </section>

      {/* REST RESPONSE */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold">
          7. Quickbase Returns JSON Records
        </h2>

        <p className="mt-4">
          The returned record structure is fundamentally different from
          structured XML.
        </p>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <div>
            <h3 className="text-xl font-bold">XML</h3>

            <pre className="mt-3 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
              <code>{`<record>
  <f id="3">1</f>
  <f id="6">Alice</f>
  <f id="7">32</f>
  <f id="8">Blue</f>
</record>`}</code>
            </pre>
          </div>

          <div>
            <h3 className="text-xl font-bold">REST JSON</h3>

            <pre className="mt-3 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
              <code>{`{
  "3": { "value": 1 },
  "6": { "value": "Alice" },
  "7": { "value": 32 },
  "8": { "value": "Blue" }
}`}</code>
            </pre>
          </div>
        </div>

        <p className="mt-6">
          The representation changed, but Field ID <code>6</code> still means
          the Name field.
        </p>
      </section>

      {/* FIELD ACCESS */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold">8. Read a REST Field Value</h2>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`function getFieldValue(record, fieldId) {
  return record[String(fieldId)]?.value ?? "";
}`}</code>
        </pre>

        <p className="mt-4">For the Name field:</p>

        <div className="mt-6 rounded-lg border border-gray-300 bg-[#f7f8fa] p-6 font-mono leading-8">
          <div>FIELD_IDS.name</div>
          <div className="ml-6">↓</div>
          <div className="ml-6">6</div>
          <div className="ml-6">↓</div>
          <div className="ml-6">String(6)</div>
          <div className="ml-6">↓</div>
          <div className="ml-6">record[&quot;6&quot;]</div>
          <div className="ml-6">↓</div>
          <div className="ml-6">{'{ value: "Alice" }'}</div>
          <div className="ml-6">↓</div>
          <div className="ml-6 font-bold">Alice</div>
        </div>
      </section>

      {/* DATA.DATA */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold">
          9. The Record Collection Lives in data.data
        </h2>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`const data = await response.json();
                renderRecords(data.data);`}
        </code>
        </pre>

        <p className="mt-4">
          Our debugging checkpoints were useful here. The REST request had
          already succeeded before the table rendered correctly. Inspecting the
          complete response and then the first record established where the
          records actually lived and what each record looked like.
        </p>

        <div className="mt-6 rounded-lg border border-gray-300 bg-[#f7f8fa] p-6 font-mono leading-8">
          <div>REST response object</div>
          <div className="ml-6">↓</div>
          <div className="ml-6">data</div>
          <div className="ml-12">↓</div>
          <div className="ml-12 font-bold">data.data</div>
          <div className="ml-16">↓</div>
          <div className="ml-16">Quickbase records[]</div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold">10. XML vs REST Side by Side</h2>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#1f5c99] text-white">
                <th className="border border-gray-300 px-4 py-3 text-left">
                  Concept
                </th>

                <th className="border border-gray-300 px-4 py-3 text-left">
                  Lesson 1A XML
                </th>

                <th className="border border-gray-300 px-4 py-3 text-left">
                  Lesson 1B REST
                </th>
              </tr>
            </thead>

            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.concept}>
                  <td className="border border-gray-300 px-4 py-3 font-bold">
                    {row.concept}
                  </td>

                  <td className="border border-gray-300 px-4 py-3">
                    <code>{row.xml}</code>
                  </td>

                  <td className="border border-gray-300 px-4 py-3">
                    <code>{row.rest}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* TIMING */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold">
          11. Our XML vs REST Timing Experiment
        </h2>

        <p className="mt-4">
          We added the same overall timer to both Code Pages:
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`const startTime = performance.now();

// Quickbase request and rendering

const endTime = performance.now();

const renderTime = endTime - startTime;`}</code>
        </pre>

        <p className="mt-4">
          In our tests, the XML Code Page was running more than twice as fast as
          the REST version. That is a valid observation, but it does
          <strong>
            {" "}
            not prove that XML parsing is faster than JSON parsing.
          </strong>
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-gray-300 p-6">
            <h3 className="text-xl font-bold">Lesson 1A XML</h3>

            <div className="mt-4 font-mono leading-8">
              <div>POST table query</div>
              <div>↓</div>
              <div>XML response</div>
              <div>↓</div>
              <div>Parse</div>
              <div>↓</div>
              <div>Render</div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-300 p-6">
            <h3 className="text-xl font-bold">Lesson 1B REST</h3>

            <div className="mt-4 font-mono leading-8">
              <div>GET temporary authorization</div>
              <div>↓</div>
              <div>Receive temporary token</div>
              <div>↓</div>
              <div>POST records query</div>
              <div>↓</div>
              <div>JSON response</div>
              <div>↓</div>
              <div>Parse</div>
              <div>↓</div>
              <div>Render</div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-lg border-2 border-amber-700 bg-amber-50 p-6">
          <h3 className="text-xl font-bold">What We Can Actually Conclude</h3>

          <p className="mt-3">
            For this Code Page implementation and very small People dataset,
            obtaining a new temporary REST authorization before every records
            query adds another network operation. Therefore our total timer is
            measuring more work on the REST side than on the XML side.
          </p>

          <p className="mt-3">
            With only six records, network and authorization latency can easily
            dominate the cost of parsing XML or JSON. Our training log correctly
            identified this distinction before drawing conclusions about the
            APIs themselves.
          </p>
        </div>
      </section>

      {/* COMPLETE PATH */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold">
          12. The Complete REST Request Path
        </h2>

        <div className="mt-6 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-6 font-mono leading-8">
          <div>Quickbase People Code Page</div>
          <div>↓</div>

          <div>REALM = window.location.hostname</div>
          <div>TABLE_DBID = bv9j6j4n5</div>

          <div>↓</div>

          <div className="font-bold">Temporary Authorization Request</div>

          <div className="ml-6">GET /v1/auth/temporary/bv9j6j4n5</div>

          <div className="ml-6">credentials: include</div>

          <div className="ml-6">QB-Realm-Hostname</div>

          <div className="ml-6">QB-App-Token</div>

          <div>↓</div>

          <div>temporaryAuthorization</div>

          <div>↓</div>

          <div className="font-bold">Records Query</div>

          <div className="ml-6">POST /v1/records/query</div>

          <div className="ml-6">Authorization: QB-TEMP-TOKEN ...</div>

          <div className="ml-6">Content-Type: application/json</div>

          <div>↓</div>

          <div>JSON Query</div>

          <div className="ml-6">from: bv9j6j4n5</div>

          <div className="ml-6">select: [3, 6, 7, 8]</div>

          <div className="ml-6">sortBy: Field ID 6 ASC</div>

          <div>↓</div>

          <div className="font-bold">QUICKBASE</div>

          <div>↓</div>

          <div>JSON Response</div>

          <div>↓</div>

          <div>data.data[]</div>

          <div>↓</div>

          <div>record[&quot;6&quot;].value</div>

          <div>↓</div>

          <div>JavaScript</div>

          <div>↓</div>

          <div>HTML Table</div>
        </div>
      </section>

      {/* SOURCE */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold">Commented Quickbase Source</h2>

        <p className="mt-4">
          This source concentrates the comments on Quickbase behavior rather
          than ordinary JavaScript and DOM manipulation. The Application Token
          has intentionally been replaced with a placeholder.
        </p>

        <pre className="mt-6 max-h-250 overflow-auto rounded-lg border border-gray-300 bg-[#111111] p-6 text-sm leading-6 text-white">
          <code>{lessonSource}</code>
        </pre>
      </section>

      {/* TAKEAWAY */}
      <section className="mb-12 rounded-lg border-2 border-green-700 bg-green-50 p-6">
        <h2 className="text-2xl font-bold text-green-950">
          Lesson 1B Complete
        </h2>

        <p className="mt-3 text-black">
          You should now be able to identify the Quickbase realm, table DBID,
          Field IDs, Application Token, temporary authorization request,
          temporary REST token, JSON records query, REST response collection,
          and individual field values in a Quickbase REST Code Page.
        </p>

        <p className="mt-3 text-black">
          More importantly, you should be able to look at Lessons 1A and 1B and
          recognize which pieces represent the same Quickbase objects even
          though XML and REST express them differently.
        </p>
      </section>

      {/* NAVIGATION */}
      <div className="flex flex-col gap-4 border-t border-gray-300 pt-8 sm:flex-row sm:justify-between">
        <Link
          href="/lessons/1a"
          className="inline-flex rounded-md border border-[#1f5c99] px-5 py-3 font-bold text-[#1f5c99] hover:bg-[#eaf3fb]"
        >
          ← Lesson 1A: XML API
        </Link>

        <Link
          href="/lessons/2"
          className="inline-flex rounded-md bg-[#1f5c99] px-5 py-3 font-bold text-white hover:bg-[#164875]"
        >
          Lesson 2: Client-Side Sorting →
        </Link>
      </div>
    </article>
  );
}
