import Link from "next/link";

const quickbaseObjects = [
  {
    object: "People table",
    quickbaseIdentity: "Table DBID",
    value: "bv9j6j4n5",
    purpose: "Identifies the Quickbase table targeted by the API request.",
  },
  {
    object: "Record ID#",
    quickbaseIdentity: "Field ID",
    value: "3",
    purpose: "Identifies the standard Quickbase Record ID# field.",
  },
  {
    object: "Name",
    quickbaseIdentity: "Field ID",
    value: "6",
    purpose: "Identifies the Name field in the People table.",
  },
  {
    object: "Age",
    quickbaseIdentity: "Field ID",
    value: "7",
    purpose: "Identifies the Age field in the People table.",
  },
  {
    object: "Favorite Color",
    quickbaseIdentity: "Field ID",
    value: "8",
    purpose: "Identifies the Favorite Color field in the People table.",
  },
];

const sourceCode = `<script>
  /*
   * ============================================================
   * QUICKBASE TABLE REFERENCE
   * ============================================================
   *
   * Every Quickbase table has a unique database identifier,
   * commonly called its DBID.
   *
   * The DBID is not the visible table name "People".
   *
   * Quickbase APIs use this identifier to determine which table
   * the request should operate against.
   *
   * This value later becomes part of the API URL:
   *
   *     /db/bv9j6j4n5
   */
  const TABLE_DBID = "bv9j6j4n5";


  /*
   * ============================================================
   * QUICKBASE APPLICATION TOKEN
   * ============================================================
   *
   * This application is configured to require an Application
   * Token for legacy XML API requests.
   *
   * The Application Token is not a User Token.
   *
   * The Code Page runs while the user is already signed into
   * Quickbase. The browser session identifies the user.
   *
   * The Application Token satisfies the application's additional
   * API token requirement.
   */
  const APP_TOKEN = "YOUR_APPLICATION_TOKEN";


  /*
   * ============================================================
   * QUICKBASE FIELD IDs
   * ============================================================
   *
   * Quickbase APIs identify fields by numeric Field ID.
   *
   * These JavaScript property names make the code readable,
   * while the numeric values are the actual Quickbase references.
   */
  const FIELD_IDS = {
    recordId: 3,
    name: 6,
    age: 7,
    favoriteColor: 8,
  };


  /*
   * ============================================================
   * READING A QUICKBASE FIELD FROM STRUCTURED XML
   * ============================================================
   *
   * With <fmt>structured</fmt>, Quickbase returns fields similar
   * to:
   *
   *     <f id="6">Alice</f>
   *
   * Therefore f[id="6"] means:
   *
   *     Find Quickbase Field ID 6 in this record.
   */
  function getFieldValue(record, fieldId) {
    const field =
      record.querySelector(\`f[id="\${fieldId}"]\`);

    return field ? field.textContent.trim() : "";
  }


  function createCell(value) {
    const cell = document.createElement("td");
    cell.textContent = value;
    return cell;
  }


  function createColorCell(colorName) {
    const cell = document.createElement("td");

    const wrapper = document.createElement("span");
    wrapper.className = "color-value";

    const swatch = document.createElement("span");
    swatch.className = "color-swatch";
    swatch.style.backgroundColor =
      colorName || "transparent";

    const label = document.createElement("span");
    label.textContent = colorName;

    wrapper.appendChild(swatch);
    wrapper.appendChild(label);

    cell.appendChild(wrapper);

    return cell;
  }


  /*
   * Each item in "records" represents one Quickbase
   * <record> element.
   *
   * FIELD_IDS.name evaluates to 6.
   *
   * That causes getFieldValue() to locate:
   *
   *     <f id="6">
   *
   * inside the record.
   */
  function renderRecords(records) {
    const tableBody =
      document.getElementById("peopleRows");

    tableBody.replaceChildren();

    for (const record of records) {
      const recordId =
        getFieldValue(record, FIELD_IDS.recordId);

      const name =
        getFieldValue(record, FIELD_IDS.name);

      const age =
        getFieldValue(record, FIELD_IDS.age);

      const favoriteColor =
        getFieldValue(
          record,
          FIELD_IDS.favoriteColor
        );

      const row =
        document.createElement("tr");

      row.appendChild(createCell(recordId));
      row.appendChild(createCell(name));
      row.appendChild(createCell(age));
      row.appendChild(
        createColorCell(favoriteColor)
      );

      tableBody.appendChild(row);
    }
  }


  async function loadPeople() {
    const status =
      document.getElementById("status");

    try {

      /*
       * ==========================================================
       * QUICKBASE CLIST
       * ==========================================================
       *
       * clist tells API_DoQuery which fields should be returned.
       *
       * Quickbase expects legacy XML API field IDs separated
       * by periods.
       *
       * [3, 6, 7, 8]
       *
       * becomes:
       *
       * 3.6.7.8
       */
      const fieldList = [
        FIELD_IDS.recordId,
        FIELD_IDS.name,
        FIELD_IDS.age,
        FIELD_IDS.favoriteColor,
      ].join(".");


      /*
       * ==========================================================
       * QUICKBASE XML REQUEST BODY
       * ==========================================================
       */
      const requestBody = \`
        <qdbapi>

          <apptoken>\${APP_TOKEN}</apptoken>

          <fmt>structured</fmt>

          <clist>\${fieldList}</clist>

          <slist>\${FIELD_IDS.name}</slist>

          <options>sortorder-A</options>

        </qdbapi>
      \`;


      /*
       * ==========================================================
       * QUICKBASE XML API REQUEST
       * ==========================================================
       *
       * TABLE_DBID determines the target table.
       *
       * The URL becomes:
       *
       *     /db/bv9j6j4n5
       */
      const response =
        await fetch(\`/db/\${TABLE_DBID}\`, {

          method: "POST",

          /*
           * Include the currently signed-in Quickbase
           * browser session.
           */
          credentials: "include",

          headers: {

            /*
             * The body contains XML.
             */
            "Content-Type": "application/xml",

            /*
             * Tell the legacy Quickbase API which operation
             * should process this request.
             */
            "QUICKBASE-ACTION": "API_DoQuery",
          },

          body: requestBody,
        });


      const responseText =
        await response.text();


      /*
       * HTTP errors and Quickbase API errors are
       * different layers.
       */
      if (!response.ok) {
        throw new Error(
          \`HTTP \${response.status}: \${responseText}\`
        );
      }


      const parser = new DOMParser();

      const xml =
        parser.parseFromString(
          responseText,
          "application/xml"
        );


      const parserError =
        xml.querySelector("parsererror");

      if (parserError) {
        throw new Error(
          "Quickbase returned data that could not be parsed as XML."
        );
      }


      /*
       * ==========================================================
       * QUICKBASE API ERROR RESPONSE
       * ==========================================================
       *
       * Quickbase can return:
       *
       * <errcode>
       * <errtext>
       * <errdetail>
       *
       * errcode 0 means the Quickbase API operation succeeded.
       */
      const errorCode =
        xml.querySelector("errcode")
          ?.textContent
          ?.trim();

      if (errorCode && errorCode !== "0") {

        const errorText =
          xml.querySelector("errtext")
            ?.textContent
            ?.trim() ||
          "Unknown Quickbase API error";

        const errorDetail =
          xml.querySelector("errdetail")
            ?.textContent
            ?.trim() ||
          "";

        throw new Error(
          \`Quickbase error \${errorCode}: \${errorText} \${errorDetail}\`
        );
      }


      /*
       * ==========================================================
       * QUICKBASE RECORDS
       * ==========================================================
       *
       * Structured XML returns each Quickbase record as:
       *
       * <record>
       *   <f id="3">1</f>
       *   <f id="6">Alice</f>
       *   <f id="7">32</f>
       *   <f id="8">Blue</f>
       * </record>
       */
      const records = [
        ...xml.querySelectorAll("record"),
      ];


      renderRecords(records);


      status.classList.remove("error");

      status.textContent =
        \`\${records.length} record(s) loaded from Quickbase.\`;

    } catch (error) {
      console.error(error);

      status.classList.add("error");

      status.textContent =
        \`Unable to load records: \${error.message}\`;
    }
  }


  document.addEventListener(
    "DOMContentLoaded",
    loadPeople
  );
</script>`;

export default function Lesson1APage() {
  return (
    <article>
      <header className="mb-10 border-b border-gray-300 pb-8">
        <p className="font-bold uppercase tracking-wide text-[#1f5c99]">
          Lesson 1A
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Read Records with the XML API
        </h1>

        <p className="mt-4 max-w-4xl text-xl">
          Learn how JavaScript identifies Quickbase tables, fields, API
          operations, authentication requirements, records, and returned field
          values.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <span className="rounded-md border border-green-700 bg-green-50 px-3 py-1 text-sm font-bold text-green-900">
            Complete
          </span>

          <span className="rounded-md border border-gray-400 bg-white px-3 py-1 text-sm font-bold">
            Legacy XML API
          </span>

          <span className="rounded-md border border-gray-400 bg-white px-3 py-1 text-sm font-bold">
            API_DoQuery
          </span>
        </div>
      </header>

      <section className="mb-12">
        <h2 className="text-3xl font-bold">Lesson Objective</h2>

        <p className="mt-4">
          This lesson assumes that you already understand HTML, CSS, JavaScript,
          the browser DOM, asynchronous functions, and <code>fetch()</code>.
        </p>

        <p className="mt-4">
          The objective is to understand the Quickbase-specific portions of the
          code: how a table is identified, how fields are referenced, how
          Quickbase knows which API operation to execute, how the signed-in
          user&apos;s session participates in the request, and how returned XML
          fields map back to Quickbase fields.
        </p>
      </section>

      <section className="mb-12 rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6">
        <h2 className="text-2xl font-bold">The Central Idea</h2>

        <p className="mt-4">
          Quickbase developers work with human-readable table and field names in
          the application interface, but API code frequently addresses those
          objects using persistent Quickbase identifiers.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-[#1f5c99] text-white">
                <th className="border border-gray-300 px-4 py-3 text-left">
                  Quickbase UI
                </th>

                <th className="border border-gray-300 px-4 py-3 text-left">
                  API Identity
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
                    {item.quickbaseIdentity}
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

      <section className="mb-12">
        <h2 className="text-3xl font-bold">1. Identify the Quickbase Table</h2>

        <p className="mt-4">
          The visible table name is <strong>People</strong>, but the XML API
          request targets the table through its database identifier, or DBID.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`const TABLE_DBID = "bv9j6j4n5";`}</code>
        </pre>

        <p className="mt-4">
          That value later becomes part of the Quickbase API URL:
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`/db/bv9j6j4n5`}</code>
        </pre>

        <p className="mt-4">
          The URL therefore determines which Quickbase table receives the API
          request.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold">2. Identify Quickbase Fields</h2>

        <p className="mt-4">
          The JavaScript object gives readable property names to the permanent
          numeric Quickbase Field IDs:
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`const FIELD_IDS = {
  recordId: 3,
  name: 6,
  age: 7,
  favoriteColor: 8,
};`}</code>
        </pre>

        <p className="mt-4">
          The property <code>name</code> is a JavaScript label chosen by the
          developer. The number <code>6</code> is the Quickbase Field ID.
        </p>

        <p className="mt-4">Therefore:</p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`FIELD_IDS.name`}</code>
        </pre>

        <p className="mt-4">evaluates to:</p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>6</code>
        </pre>

        <p className="mt-4">
          From Quickbase&apos;s perspective, Field ID 6 is the important identity.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold">
          3. Build the Quickbase Column List
        </h2>

        <p className="mt-4">
          The legacy XML API uses <code>clist</code> to determine which fields
          should be returned.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`const fieldList = [
  FIELD_IDS.recordId,
  FIELD_IDS.name,
  FIELD_IDS.age,
  FIELD_IDS.favoriteColor,
].join(".");`}</code>
        </pre>

        <p className="mt-4">The JavaScript array:</p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>[3, 6, 7, 8]</code>
        </pre>

        <p className="mt-4">becomes the Quickbase XML API field list:</p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>3.6.7.8</code>
        </pre>

        <p className="mt-4">which is inserted into:</p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`<clist>3.6.7.8</clist>`}</code>
        </pre>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold">4. Construct the XML Request</h2>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`<qdbapi>
  <apptoken>YOUR_APPLICATION_TOKEN</apptoken>
  <fmt>structured</fmt>
  <clist>3.6.7.8</clist>
  <slist>6</slist>
  <options>sortorder-A</options>
</qdbapi>`}</code>
        </pre>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#1f5c99] text-white">
                <th className="border border-gray-300 px-4 py-3 text-left">
                  XML Element
                </th>

                <th className="border border-gray-300 px-4 py-3 text-left">
                  Quickbase Meaning
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-3">
                  <code>&lt;qdbapi&gt;</code>
                </td>

                <td className="border border-gray-300 px-4 py-3">
                  Root element of the legacy Quickbase XML API request.
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-3">
                  <code>&lt;apptoken&gt;</code>
                </td>

                <td className="border border-gray-300 px-4 py-3">
                  Supplies the Application Token required by this application.
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-3">
                  <code>&lt;fmt&gt;structured&lt;/fmt&gt;</code>
                </td>

                <td className="border border-gray-300 px-4 py-3">
                  Requests structured XML containing identifiable field
                  elements.
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-3">
                  <code>&lt;clist&gt;</code>
                </td>

                <td className="border border-gray-300 px-4 py-3">
                  Specifies which Quickbase Field IDs should be returned.
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-3">
                  <code>&lt;slist&gt;</code>
                </td>

                <td className="border border-gray-300 px-4 py-3">
                  Specifies the Quickbase Field ID used for sorting.
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-3">
                  <code>&lt;options&gt;</code>
                </td>

                <td className="border border-gray-300 px-4 py-3">
                  Supplies API_DoQuery behavior such as ascending sort order.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold">
          5. Tell Quickbase Which API Operation to Run
        </h2>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`"QUICKBASE-ACTION": "API_DoQuery"`}</code>
        </pre>

        <p className="mt-4">
          The table DBID tells Quickbase <strong>where</strong> the request
          should operate.
        </p>

        <p className="mt-4">
          The <code>QUICKBASE-ACTION</code> header tells the legacy XML API{" "}
          <strong>what operation</strong> should be performed.
        </p>

        <div className="mt-6 rounded-lg border border-gray-300 bg-[#f7f8fa] p-6 font-mono">
          <div>Table:</div>
          <div className="ml-6 font-bold">/db/bv9j6j4n5</div>

          <div className="mt-4">Operation:</div>

          <div className="ml-6 font-bold">API_DoQuery</div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold">
          6. Authentication and the Signed-In Session
        </h2>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`credentials: "include"`}</code>
        </pre>

        <p className="mt-4">
          The Code Page is running inside Quickbase while the user is already
          signed in.
        </p>

        <p className="mt-4">
          Including browser credentials allows the request to operate through
          that existing Quickbase session. Quickbase can therefore evaluate the
          request using the permissions of the signed-in user.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="rounded-lg border border-gray-300 p-5">
            <h3 className="text-xl font-bold">Browser Session</h3>

            <p className="mt-3">
              Identifies the signed-in Quickbase user and allows Quickbase to
              apply that user&apos;s permissions.
            </p>
          </div>

          <div className="rounded-lg border border-gray-300 p-5">
            <h3 className="text-xl font-bold">Application Token</h3>

            <p className="mt-3">
              Satisfies the additional Application Token requirement configured
              for this Quickbase application.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-lg border-2 border-amber-700 bg-amber-50 p-5">
          <h3 className="text-xl font-bold">Important</h3>

          <p className="mt-2">
            An Application Token is not a User Token. Do not embed a Quickbase
            User Token in browser-side JavaScript.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold">
          7. Quickbase Returns Structured XML
        </h2>

        <p className="mt-4">Because the request specifies:</p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`<fmt>structured</fmt>`}</code>
        </pre>

        <p className="mt-4">
          returned records can be represented approximately like:
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`<record>
  <f id="3">1</f>
  <f id="6">Alice</f>
  <f id="7">32</f>
  <f id="8">Blue</f>
</record>`}</code>
        </pre>

        <p className="mt-4">
          The numeric <code>id</code> attribute reconnects each returned value
          to the Quickbase Field ID.
        </p>

        <div className="mt-6 rounded-lg border border-gray-300 bg-[#f7f8fa] p-6 font-mono">
          <div>&lt;f id=&quot;6&quot;&gt;Alice&lt;/f&gt;</div>

          <div className="mt-4">id=&quot;6&quot;</div>

          <div className="ml-6">↓</div>

          <div className="ml-6">Field ID 6</div>

          <div className="ml-6">↓</div>

          <div className="ml-6 font-bold">Name</div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold">
          8. Read the Returned Quickbase Fields
        </h2>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`function getFieldValue(record, fieldId) {
  const field =
    record.querySelector(\`f[id="\${fieldId}"]\`);

  return field ? field.textContent.trim() : "";
}`}</code>
        </pre>

        <p className="mt-4">When the code later calls:</p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`getFieldValue(record, FIELD_IDS.name)`}</code>
        </pre>

        <p className="mt-4">the lookup resolves through these steps:</p>

        <div className="mt-6 rounded-lg border border-gray-300 bg-[#f7f8fa] p-6 font-mono leading-8">
          <div>FIELD_IDS.name</div>
          <div className="ml-6">↓</div>
          <div className="ml-6">6</div>
          <div className="ml-6">↓</div>
          <div className="ml-6">f[id=&quot;6&quot;]</div>
          <div className="ml-6">↓</div>
          <div className="ml-6">Quickbase Name field</div>
          <div className="ml-6">↓</div>
          <div className="ml-6 font-bold">Alice</div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold">
          9. Quickbase API Errors Are Separate from HTTP Errors
        </h2>

        <p className="mt-4">The code first checks the HTTP response:</p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`if (!response.ok) {
  throw new Error(
    \`HTTP \${response.status}: \${responseText}\`
  );
}`}</code>
        </pre>

        <p className="mt-4">
          It then separately checks the Quickbase XML API response:
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`const errorCode =
  xml.querySelector("errcode")
    ?.textContent
    ?.trim();`}</code>
        </pre>

        <p className="mt-4">Quickbase uses XML elements including:</p>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-gray-300 p-5">
            <code>&lt;errcode&gt;</code>
            <p className="mt-2">Numeric Quickbase API result code.</p>
          </div>

          <div className="rounded-lg border border-gray-300 p-5">
            <code>&lt;errtext&gt;</code>
            <p className="mt-2">Human-readable Quickbase error text.</p>
          </div>

          <div className="rounded-lg border border-gray-300 p-5">
            <code>&lt;errdetail&gt;</code>
            <p className="mt-2">Additional Quickbase error information.</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold">10. The Complete Request Path</h2>

        <div className="mt-6 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-6 font-mono leading-8">
          <div>People Code Page</div>
          <div>↓</div>

          <div>TABLE_DBID = bv9j6j4n5</div>
          <div>↓</div>

          <div>POST /db/bv9j6j4n5</div>
          <div>↓</div>

          <div>QUICKBASE-ACTION: API_DoQuery</div>
          <div>↓</div>

          <div>credentials: include</div>
          <div>↓</div>

          <div>&lt;qdbapi&gt;</div>
          <div className="ml-6">&lt;apptoken&gt;</div>
          <div className="ml-6">&lt;fmt&gt;structured&lt;/fmt&gt;</div>
          <div className="ml-6">&lt;clist&gt;3.6.7.8&lt;/clist&gt;</div>
          <div className="ml-6">&lt;slist&gt;6&lt;/slist&gt;</div>

          <div>↓</div>

          <div className="font-bold">QUICKBASE</div>

          <div>↓</div>

          <div>XML Response</div>
          <div>↓</div>

          <div>&lt;record&gt;</div>

          <div className="ml-6">&lt;f id=&quot;3&quot;&gt;</div>

          <div className="ml-6">&lt;f id=&quot;6&quot;&gt;</div>

          <div className="ml-6">&lt;f id=&quot;7&quot;&gt;</div>

          <div className="ml-6">&lt;f id=&quot;8&quot;&gt;</div>

          <div>↓</div>

          <div>JavaScript</div>
          <div>↓</div>

          <div>HTML Table</div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold">Complete Lesson Source</h2>

        <p className="mt-4">
          The source below concentrates comments around the Quickbase-specific
          portions of the working Code Page. Ordinary HTML, CSS, and browser
          JavaScript are left largely unexplained.
        </p>

        <pre className="mt-6 max-h-225 overflow-auto rounded-lg border border-gray-300 bg-[#111111] p-6 text-sm leading-6 text-white">
          <code>{sourceCode}</code>
        </pre>
      </section>

      <section className="mb-12 rounded-lg border-2 border-green-700 bg-green-50 p-6">
        <h2 className="text-2xl font-bold text-green-950">
          Lesson 1A Complete
        </h2>

        <p className="mt-3 text-black">
          At this point you should be able to identify how a Quickbase table,
          field, API operation, application token, signed-in session, record,
          and returned field value are represented in the XML API code.
        </p>
      </section>

      <div className="flex flex-col gap-4 border-t border-gray-300 pt-8 sm:flex-row sm:justify-between">
        <Link
          href="/lessons"
          className="inline-flex rounded-md border border-[#1f5c99] px-5 py-3 font-bold text-[#1f5c99] hover:bg-[#eaf3fb]"
        >
          ← Table of Contents
        </Link>

        <Link
          href="/lessons/1b"
          className="inline-flex rounded-md bg-[#1f5c99] px-5 py-3 font-bold text-white hover:bg-[#164875]"
        >
          Lesson 1B: REST API →
        </Link>
      </div>
    </article>
  );
}
