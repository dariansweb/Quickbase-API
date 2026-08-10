import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lesson 2 — Client-Side Sorting",
  description:
    "Learn how to retain Quickbase REST records in JavaScript and manipulate them client-side without requesting the data again.",
};

const comparisonRows = [
  {
    stage: "Lesson 1B",
    code: "renderRecords(records)",
    meaning:
      "Quickbase records are retrieved and immediately rendered.",
  },
  {
    stage: "Lesson 2",
    code: "peopleRecords = records",
    meaning:
      "The returned Quickbase records are retained in browser memory.",
  },
  {
    stage: "Lesson 2",
    code: "peopleRecords.sort(...)",
    meaning:
      "JavaScript manipulates the already-loaded records.",
  },
  {
    stage: "Lesson 2",
    code: "renderRecords(peopleRecords)",
    meaning:
      "The changed client-side dataset is rendered again.",
  },
];

const completeSource = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />

    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />

    <title>People Table - Lesson 2</title>

    <style>
      body {
        margin: 0;
        padding: 32px;
        background: #f4f6f8;
        color: #1f2933;
        font-family: Arial, Helvetica, sans-serif;
      }

      .page {
        max-width: 1000px;
        margin: 0 auto;
      }

      h1 {
        margin: 0 0 8px;
        color: #003366;
      }

      .description {
        margin: 0 0 24px;
        color: #5b6775;
      }

      .status {
        margin-bottom: 16px;
        padding: 12px 14px;
        border: 1px solid #cfd8e3;
        border-radius: 6px;
        background: #ffffff;
      }

      .status.error {
        border-color: #a61c1c;
        color: #7f0000;
        background: #fff1f1;
      }

      .table-container {
        overflow-x: auto;
        border: 1px solid #d7dee7;
        border-radius: 8px;
        background: #ffffff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th,
      td {
        padding: 12px 14px;
        border-bottom: 1px solid #e5e9ef;
        text-align: left;
      }

      th {
        background: #003366;
        color: #ffffff;
      }

      th button {
        border: 0;
        background: transparent;
        color: #ffffff;
        font: inherit;
        font-weight: bold;
        cursor: pointer;
      }

      tbody tr:hover {
        background: #f3f7fb;
      }

      .color-value {
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }

      .color-swatch {
        width: 18px;
        height: 18px;
        border: 1px solid #7f8c99;
        border-radius: 4px;
      }
    </style>
  </head>

  <body>
    <main class="page">
      <h1>People</h1>

      <h2>
        Lesson 2 — Client-Side Sorting
      </h2>

      <p class="description">
        Load Quickbase records once, retain them in JavaScript,
        then manipulate the client-side data without another API request.
      </p>

      <div id="status" class="status">
        Loading Quickbase records...
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Record ID</th>

              <th>
                <button
                  type="button"
                  id="sortName"
                >
                  Name
                </button>
              </th>

              <th>Age</th>
              <th>Favorite Color</th>
            </tr>
          </thead>

          <tbody id="peopleRows"></tbody>
        </table>
      </div>
    </main>

    <script>
      /*
       * ============================================================
       * QUICKBASE CONNECTION INFORMATION
       * ============================================================
       */

      const REALM =
        window.location.hostname.includes("quickbase.com")
          ? window.location.hostname
          : "YOUR_REALM.quickbase.com";

      const TABLE_DBID = "YOUR_TABLE_DBID";

      /*
       * Leave blank if the application does not require
       * an Application Token.
       */
      const APP_TOKEN = "";


      /*
       * ============================================================
       * LESSON 2 — CLIENT-SIDE RECORD STATE
       * ============================================================
       *
       * Lesson 1B retrieved records from Quickbase and rendered them.
       *
       * Lesson 2 needs those records to remain available AFTER
       * the REST request has completed.
       *
       * peopleRecords becomes the browser's retained copy of the
       * Quickbase records.
       *
       * No second Quickbase query is required when sorting.
       */
      let peopleRecords = [];


      /*
       * ============================================================
       * LESSON 2 — SORT STATE
       * ============================================================
       *
       * This variable remembers which direction the NEXT sort
       * operation should use.
       */
      let nameSortDirection = "asc";


      const FIELD_IDS = {
        recordId: 3,
        name: 6,
        age: 7,
        favoriteColor: 8,
      };


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


      async function readQuickbaseResponse(response) {
        const rawBody = await response.text();

        try {
          return {
            parsed: JSON.parse(rawBody),
            rawBody,
          };
        } catch {
          return {
            parsed: null,
            rawBody,
          };
        }
      }


      function getFieldValue(record, fieldId) {
        return record[String(fieldId)]?.value ?? "";
      }


      function renderRecords(records) {
        const tableBody =
          document.getElementById("peopleRows");

        tableBody.replaceChildren();

        for (const record of records) {
          const recordId =
            getFieldValue(
              record,
              FIELD_IDS.recordId
            );

          const name =
            getFieldValue(
              record,
              FIELD_IDS.name
            );

          const age =
            getFieldValue(
              record,
              FIELD_IDS.age
            );

          const favoriteColor =
            getFieldValue(
              record,
              FIELD_IDS.favoriteColor
            );

          const row =
            document.createElement("tr");

          row.appendChild(
            createCell(recordId)
          );

          row.appendChild(
            createCell(name)
          );

          row.appendChild(
            createCell(age)
          );

          row.appendChild(
            createColorCell(favoriteColor)
          );

          tableBody.appendChild(row);
        }
      }


      async function getTemporaryToken() {
        const headers = {
          "QB-Realm-Hostname": REALM,
        };

        if (APP_TOKEN.trim()) {
          headers["QB-App-Token"] =
            APP_TOKEN;
        }

        const response = await fetch(
          \`https://api.quickbase.com/v1/auth/temporary/\${TABLE_DBID}\`,
          {
            method: "GET",
            credentials: "include",
            headers,
          },
        );

        const {
          parsed,
          rawBody,
        } = await readQuickbaseResponse(
          response
        );

        if (!response.ok) {
          const details =
            parsed
              ? JSON.stringify(parsed)
              : rawBody;

          throw new Error(
            \`HTTP \${response.status}: \${details}\`
          );
        }

        if (!parsed?.temporaryAuthorization) {
          throw new Error(
            "Quickbase did not return temporaryAuthorization."
          );
        }

        return parsed.temporaryAuthorization;
      }


      /*
       * ============================================================
       * LESSON 2 — SORT THE CLIENT-SIDE RECORDS
       * ============================================================
       *
       * IMPORTANT:
       *
       * There is NO fetch() inside this function.
       *
       * Quickbase is not contacted again.
       *
       * We are operating entirely upon peopleRecords, which contains
       * the records that were already returned by Quickbase.
       */
      function sortByName() {
        peopleRecords.sort((a, b) => {

          /*
           * Read the Name field from each Quickbase REST record.
           */
          const nameA =
            getFieldValue(
              a,
              FIELD_IDS.name
            );

          const nameB =
            getFieldValue(
              b,
              FIELD_IDS.name
            );


          /*
           * localeCompare() gives us the normal alphabetical
           * comparison between the two names.
           */
          const comparison =
            nameA.localeCompare(nameB);


          /*
           * Use the comparison normally for ascending order.
           *
           * Negating the comparison reverses the order.
           */
          return nameSortDirection === "asc"
            ? comparison
            : -comparison;
        });


        const sortButton =
          document.getElementById("sortName");


        /*
         * Update the visible sort indicator and remember
         * which direction should happen on the next click.
         */
        if (nameSortDirection === "asc") {
          sortButton.textContent =
            "Name ↑";

          nameSortDirection =
            "desc";
        } else {
          sortButton.textContent =
            "Name ↓";

          nameSortDirection =
            "asc";
        }


        /*
         * The array changed in browser memory.
         *
         * Re-render that same client-side data.
         *
         * Again: no Quickbase request occurs here.
         */
        renderRecords(peopleRecords);
      }


      async function loadPeople() {
        const startTime =
          performance.now();

        const status =
          document.getElementById("status");

        try {
          const temporaryToken =
            await getTemporaryToken();


          const query = {
            from: TABLE_DBID,

            select: [
              FIELD_IDS.recordId,
              FIELD_IDS.name,
              FIELD_IDS.age,
              FIELD_IDS.favoriteColor,
            ],

            options: {
              top: 200,
              skip: 0,
            },

            sortBy: [
              {
                fieldId:
                  FIELD_IDS.name,

                order: "ASC",
              },
            ],
          };


          const response = await fetch(
            "https://api.quickbase.com/v1/records/query",
            {
              method: "POST",

              headers: {
                "QB-Realm-Hostname":
                  REALM,

                Authorization:
                  \`QB-TEMP-TOKEN \${temporaryToken}\`,

                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(query),
            },
          );


          const {
            parsed,
            rawBody,
          } = await readQuickbaseResponse(
            response
          );


          if (!response.ok) {
            const details =
              parsed
                ? JSON.stringify(parsed)
                : rawBody;

            throw new Error(
              \`HTTP \${response.status}: \${details}\`
            );
          }


          const records =
            Array.isArray(parsed?.data)
              ? parsed.data
              : [];


          if (!Array.isArray(parsed?.data)) {
            throw new Error(
              "REST response did not include a data array."
            );
          }


          if (records.length === 0) {
            renderRecords(records);

            status.classList.remove(
              "error"
            );

            status.textContent =
              "REST query returned 0 record(s).";

            return;
          }


          /*
           * ========================================================
           * LESSON 2 — THE IMPORTANT HANDOFF
           * ========================================================
           *
           * records
           *   = local result from this REST request
           *
           * peopleRecords
           *   = records retained by the browser for later actions
           *
           * This assignment is what gives the page continued
           * control over the returned Quickbase records.
           */
          peopleRecords = records;


          /*
           * Render the retained client-side collection.
           */
          renderRecords(
            peopleRecords
          );


          const endTime =
            performance.now();

          const renderTime =
            endTime - startTime;


          status.classList.remove(
            "error"
          );

          status.textContent =
            \`REST query returned \${records.length} record(s) in \${renderTime.toFixed(2)} ms.\`;

        } catch (error) {
          console.error(error);

          status.classList.add(
            "error"
          );

          status.textContent =
            \`REST query failed: \${error.message}\`;
        }
      }


      /*
       * ============================================================
       * LESSON 2 — CONNECT THE UI TO THE CLIENT-SIDE OPERATION
       * ============================================================
       *
       * When Name is clicked:
       *
       *     sortByName()
       *
       * runs against peopleRecords.
       *
       * loadPeople() is NOT called again.
       */
      document.addEventListener(
        "DOMContentLoaded",
        () => {
          document
            .getElementById("sortName")
            .addEventListener(
              "click",
              sortByName
            );

          loadPeople();
        }
      );
    </script>
  </body>
</html>`;

export default function Lesson2Page() {
  return (
    <article>
      {/* ======================================================
          LESSON HEADER
      ====================================================== */}

      <header className="mb-10 border-b border-gray-300 pb-8">
        <p className="font-bold uppercase tracking-wide text-[#1f5c99]">
          Lesson 2
        </p>

        <Link
          href="/files/PeoplePage_sort.txt"
          target="_blank"
          className="font-bold text-[#1f5c99] underline"
        >
          Code Page Here - PeoplePage_sort.html
        </Link>
        <h1 className="mt-2 text-4xl font-bold">
          Client-Side Sorting
        </h1>

        <p className="mt-4 max-w-4xl text-xl">
          Quickbase has returned the records. Now the code page has control of
          them.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <span className="rounded-md border border-green-700 bg-green-50 px-3 py-1 text-sm font-bold text-green-900">
            Complete
          </span>

          <span className="rounded-md border border-gray-400 bg-white px-3 py-1 text-sm font-bold">
            Client-Side Data
          </span>

          <span className="rounded-md border border-gray-400 bg-white px-3 py-1 text-sm font-bold">
            Array.sort()
          </span>

          <span className="rounded-md border border-gray-400 bg-white px-3 py-1 text-sm font-bold">
            No Additional API Request
          </span>
        </div>
      </header>

      {/* ======================================================
          LESSON OBJECTIVE
      ====================================================== */}

      <section className="mb-12">
        <h2 className="text-3xl font-bold">
          The Important Change in Lesson 2
        </h2>

        <p className="mt-4">
          Lessons 1A and 1B concentrated on retrieving records from Quickbase.
          Once those records appeared in the HTML table, the immediate objective
          was complete.
        </p>

        <p className="mt-4">
          Lesson 2 introduces a different idea:
          <strong>
            {" "}
            the returned Quickbase records can remain available in JavaScript
            after the API request finishes.
          </strong>
        </p>

        <p className="mt-4">
          Once we retain those records, we can begin deciding what the
          application should do with them.
        </p>
      </section>

      {/* ======================================================
          CONTROL OF DATA
      ====================================================== */}

      <section className="mb-12 rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6">
        <h2 className="text-2xl font-bold">
          Retrieval Is Only the Beginning
        </h2>

        <div className="mt-6 overflow-x-auto rounded-lg border border-gray-300 bg-white p-6 font-mono leading-8">
          <div>Quickbase</div>
          <div>↓</div>

          <div>REST API</div>
          <div>↓</div>

          <div>JavaScript records</div>
          <div>↓</div>

          <div className="font-bold text-[#1f5c99]">
            Client-side control
          </div>

          <div className="ml-6">├── Sort</div>
          <div className="ml-6">├── Search</div>
          <div className="ml-6">├── Filter</div>
          <div className="ml-6">├── Display differently</div>
          <div className="ml-6">└── Prepare future CRUD actions</div>
        </div>

        <p className="mt-6">
          Sorting is simply the smallest operation we can use to prove that the
          browser now controls the returned dataset.
        </p>
      </section>

      {/* ======================================================
          BEFORE LESSON 2
      ====================================================== */}

      <section className="mb-12">
        <h2 className="text-3xl font-bold">
          1. What Lesson 1B Was Doing
        </h2>

        <p className="mt-4">
          The REST query produced a collection of Quickbase records:
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`const records =
  Array.isArray(parsed?.data)
    ? parsed.data
    : [];`}</code>
        </pre>

        <p className="mt-4">
          That local variable represented the result of this particular REST
          request.
        </p>

        <p className="mt-4">
          Lesson 1B could simply render that result:
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`renderRecords(records);`}</code>
        </pre>

        <p className="mt-4">
          For a read-only demonstration, that was enough.
        </p>
      </section>

      {/* ======================================================
          PEOPLE RECORDS
      ====================================================== */}

      <section className="mb-12">
        <h2 className="text-3xl font-bold">
          2. Retain the Quickbase Records
        </h2>

        <p className="mt-4">
          Lesson 2 adds a variable outside <code>loadPeople()</code>:
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`let peopleRecords = [];`}</code>
        </pre>

        <p className="mt-4">
          After the REST request succeeds, the returned records are assigned to
          it:
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`peopleRecords = records;

renderRecords(peopleRecords);`}</code>
        </pre>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#1f5c99] text-white">
                <th className="border border-gray-300 px-4 py-3 text-left">
                  Variable
                </th>

                <th className="border border-gray-300 px-4 py-3 text-left">
                  Purpose
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-3">
                  <code>records</code>
                </td>

                <td className="border border-gray-300 px-4 py-3">
                  Local result returned by the current Quickbase REST request.
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-3">
                  <code>peopleRecords</code>
                </td>

                <td className="border border-gray-300 px-4 py-3">
                  Records retained by the page for later client-side
                  operations.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ======================================================
          CONFUSION #1
      ====================================================== */}

      <section className="mb-12 rounded-lg border-2 border-amber-700 bg-amber-50 p-6">
        <h2 className="text-2xl font-bold">
          Clarification: Why Not Replace Every Use of records?
        </h2>

        <p className="mt-4">
          This was an important point during development.
        </p>

        <p className="mt-4">
          The REST request should still create its normal local result:
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-amber-300 bg-white p-5 text-base">
          <code>{`const records =
  Array.isArray(parsed?.data)
    ? parsed.data
    : [];`}</code>
        </pre>

        <p className="mt-4">
          We do <strong>not</strong> blindly replace every reference to{" "}
          <code>records</code> with <code>peopleRecords</code>.
        </p>

        <p className="mt-4">
          The handoff occurs only after Quickbase has successfully returned and
          validated the dataset:
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-amber-300 bg-white p-5 text-base">
          <code>{`peopleRecords = records;

renderRecords(peopleRecords);`}</code>
        </pre>

        <p className="mt-4">
          That distinction keeps the REST request result and the page&apos;s
          retained client-side state conceptually separate.
        </p>
      </section>

      {/* ======================================================
          SORT BUTTON
      ====================================================== */}

      <section className="mb-12">
        <h2 className="text-3xl font-bold">
          3. Make Name an Action
        </h2>

        <p className="mt-4">
          The ordinary table heading becomes a button:
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`<th>
  <button
    type="button"
    id="sortName"
  >
    Name
  </button>
</th>`}</code>
        </pre>

        <p className="mt-4">
          This does not change anything in Quickbase. It simply gives the user
          a browser-side control that can operate on the records we already
          retained.
        </p>
      </section>

      {/* ======================================================
          SORT FUNCTION
      ====================================================== */}

      <section className="mb-12">
        <h2 className="text-3xl font-bold">
          4. Sort the Retained Records
        </h2>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`function sortByName() {
  peopleRecords.sort((a, b) => {
    const nameA =
      getFieldValue(a, FIELD_IDS.name);

    const nameB =
      getFieldValue(b, FIELD_IDS.name);

    const comparison =
      nameA.localeCompare(nameB);

    return nameSortDirection === "asc"
      ? comparison
      : -comparison;
  });

  renderRecords(peopleRecords);
}`}</code>
        </pre>

        <p className="mt-4">
          Notice what is conspicuously absent from this function:
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg border-2 border-green-700 bg-green-50 p-5 text-base">
          <code>{`fetch()`}</code>
        </pre>

        <p className="mt-4 font-bold">
          Sorting does not send another request to Quickbase.
        </p>

        <p className="mt-4">
          The records are already in the browser. JavaScript changes their
          order and renders them again.
        </p>
      </section>

      {/* ======================================================
          DATA FLOW
      ====================================================== */}

      <section className="mb-12 rounded-lg border border-gray-300 bg-[#f7f8fa] p-6">
        <h2 className="text-2xl font-bold">
          The New Data Flow
        </h2>

        <div className="mt-6 overflow-x-auto font-mono leading-8">
          <div>Quickbase REST query</div>
          <div>↓</div>

          <div>records</div>
          <div className="ml-6">
            local REST result
          </div>

          <div>↓</div>

          <div className="font-bold">
            peopleRecords = records
          </div>

          <div className="ml-6">
            browser retains the dataset
          </div>

          <div>↓</div>

          <div>renderRecords(peopleRecords)</div>

          <div>↓</div>

          <div>User clicks Name</div>

          <div>↓</div>

          <div className="font-bold">
            peopleRecords.sort(...)
          </div>

          <div>↓</div>

          <div>renderRecords(peopleRecords)</div>

          <div>↓</div>

          <div className="font-bold text-green-800">
            No second Quickbase request
          </div>
        </div>
      </section>

      {/* ======================================================
          ASC / DESC
      ====================================================== */}

      <section className="mb-12">
        <h2 className="text-3xl font-bold">
          5. Remember the Sort Direction
        </h2>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`let nameSortDirection = "asc";`}</code>
        </pre>

        <p className="mt-4">
          The page must remember whether the next sort should be ascending or
          descending.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`return nameSortDirection === "asc"
  ? comparison
  : -comparison;`}</code>
        </pre>

        <p className="mt-4">
          <code>localeCompare()</code> supplies the normal alphabetical
          comparison. Using its result normally sorts ascending; reversing its
          sign reverses the ordering.
        </p>
      </section>

      {/* ======================================================
          CONFUSION #2
      ====================================================== */}

      <section className="mb-12 rounded-lg border-2 border-amber-700 bg-amber-50 p-6">
        <h2 className="text-2xl font-bold">
          Clarification: The First Click May Look Like Nothing Happened
        </h2>

        <p className="mt-4">
          The REST query already asks Quickbase to return the records sorted by
          Name ascending:
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-amber-300 bg-white p-5 text-base">
          <code>{`sortBy: [
  {
    fieldId: FIELD_IDS.name,
    order: "ASC",
  },
],`}</code>
        </pre>

        <p className="mt-4">
          Lesson 2 also initializes:
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-amber-300 bg-white p-5 text-base">
          <code>{`let nameSortDirection = "asc";`}</code>
        </pre>

        <p className="mt-4">
          Therefore the first click can sort an already-ascending dataset into
          ascending order again.
        </p>

        <p className="mt-4 font-bold">
          That does not mean the client-side sort failed.
        </p>

        <p className="mt-4">
          The important test is that clicking again reverses the order while
          no additional REST request occurs.
        </p>
      </section>

      {/* ======================================================
          BUTTON STATE
      ====================================================== */}

      <section className="mb-12">
        <h2 className="text-3xl font-bold">
          6. Show the Current Sort
        </h2>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`if (nameSortDirection === "asc") {
  sortButton.textContent = "Name ↑";
  nameSortDirection = "desc";
} else {
  sortButton.textContent = "Name ↓";
  nameSortDirection = "asc";
}`}</code>
        </pre>

        <p className="mt-4">
          After an ascending sort, the heading displays:
        </p>

        <pre className="mt-4 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>Name ↑</code>
        </pre>

        <p className="mt-4">
          The variable is then changed to <code>desc</code> because descending
          is what should happen on the next click.
        </p>
      </section>

      {/* ======================================================
          CONFUSION #3
      ====================================================== */}

      <section className="mb-12 rounded-lg border-2 border-amber-700 bg-amber-50 p-6">
        <h2 className="text-2xl font-bold">
          Clarification: What Does nameSortDirection Mean?
        </h2>

        <p className="mt-4">
          This variable describes the direction that the{" "}
          <strong>next sort operation</strong> will use.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-[#1f5c99] text-white">
                <th className="border border-gray-300 px-4 py-3 text-left">
                  Before Click
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left">
                  Operation
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left">
                  Button Shows
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left">
                  Next Direction
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-3">
                  <code>asc</code>
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  Sort ascending
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  Name ↑
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <code>desc</code>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-3">
                  <code>desc</code>
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  Sort descending
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  Name ↓
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <code>asc</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ======================================================
          EVENT
      ====================================================== */}

      <section className="mb-12">
        <h2 className="text-3xl font-bold">
          7. Connect the Button to the Client-Side Operation
        </h2>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`document.addEventListener(
  "DOMContentLoaded",
  () => {
    document
      .getElementById("sortName")
      .addEventListener(
        "click",
        sortByName
      );

    loadPeople();
  }
);`}</code>
        </pre>

        <p className="mt-4">
          When the page loads, two separate responsibilities are established:
        </p>

        <div className="mt-6 rounded-lg border border-gray-300 bg-[#f7f8fa] p-6 font-mono leading-8">
          <div>DOMContentLoaded</div>

          <div className="ml-6">├── attach Name click → sortByName()</div>

          <div className="ml-6">└── call loadPeople()</div>
        </div>

        <p className="mt-4">
          <code>loadPeople()</code> retrieves the data once.
        </p>

        <p className="mt-4">
          <code>sortByName()</code> subsequently operates on the retained data.
        </p>
      </section>

      {/* ======================================================
          EVOLUTION TABLE
      ====================================================== */}

      <section className="mb-12">
        <h2 className="text-3xl font-bold">
          8. What Changed from Lesson 1B?
        </h2>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#1f5c99] text-white">
                <th className="border border-gray-300 px-4 py-3 text-left">
                  Stage
                </th>

                <th className="border border-gray-300 px-4 py-3 text-left">
                  Code
                </th>

                <th className="border border-gray-300 px-4 py-3 text-left">
                  Meaning
                </th>
              </tr>
            </thead>

            <tbody>
              {comparisonRows.map((row) => (
                <tr key={`${row.stage}-${row.code}`}>
                  <td className="border border-gray-300 px-4 py-3 font-bold">
                    {row.stage}
                  </td>

                  <td className="border border-gray-300 px-4 py-3">
                    <code>{row.code}</code>
                  </td>

                  <td className="border border-gray-300 px-4 py-3">
                    {row.meaning}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ======================================================
          BIG IDEA
      ====================================================== */}

      <section className="mb-12 rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6">
        <h2 className="text-2xl font-bold">
          The Bigger Idea
        </h2>

        <p className="mt-4">
          Sorting is not the destination of this lesson.
        </p>

        <p className="mt-4">
          The important realization is that after Quickbase supplies the
          records, JavaScript can keep them and perform additional operations
          upon them.
        </p>

        <div className="mt-6 overflow-x-auto rounded-lg border border-gray-300 bg-white p-6 font-mono leading-8">
          <div>We have the data.</div>
          <div>↓</div>

          <div className="font-bold text-[#1f5c99]">
            What do we want to do with it?
          </div>

          <div className="mt-3 ml-6">Sort it</div>
          <div className="ml-6">Search it</div>
          <div className="ml-6">Filter it</div>
          <div className="ml-6">Display selected records</div>
          <div className="ml-6">Use records in later operations</div>
        </div>

        <p className="mt-6">
          Lesson 2 demonstrates the first of those operations with the simplest
          possible example: alphabetical sorting.
        </p>
      </section>

      {/* ======================================================
          WHY ONLY NAME?
      ====================================================== */}

      <section className="mb-12">
        <h2 className="text-3xl font-bold">
          Why Are We Only Sorting Name?
        </h2>

        <p className="mt-4">
          We could immediately make Record ID, Age, and Favorite Color sortable
          too.
        </p>

        <p className="mt-4">
          That would mostly repeat the same concept with slightly different
          comparison logic.
        </p>

        <p className="mt-4">
          The lesson objective is already satisfied once we have proved this:
        </p>

        <div className="mt-6 rounded-lg border-2 border-green-700 bg-green-50 p-6">
          <p className="text-xl font-bold text-green-950">
            Load records once from Quickbase, retain them in JavaScript,
            manipulate the client-side collection, and re-render it without
            another API request.
          </p>
        </div>
      </section>

      {/* ======================================================
          COMPLETE SOURCE
      ====================================================== */}

      <section className="mb-12">
        <h2 className="text-3xl font-bold">
          Complete Lesson 2 Source
        </h2>

        <p className="mt-4">
          The complete training source below preserves the REST architecture
          from Lesson 1B and highlights the new Lesson 2 concepts around
          retained records and client-side sorting.
        </p>

        <pre className="mt-6 max-h-250 overflow-auto rounded-lg border border-gray-300 bg-[#111111] p-6 text-sm leading-6 text-white">
          <code>{completeSource}</code>
        </pre>
      </section>

      {/* ======================================================
          COMPLETE
      ====================================================== */}

      <section className="mb-12 rounded-lg border-2 border-green-700 bg-green-50 p-6">
        <h2 className="text-2xl font-bold text-green-950">
          Lesson 2 Complete
        </h2>

        <p className="mt-3 text-black">
          You should now understand that returning records from Quickbase is
          not the end of the application&apos;s work.
        </p>

        <p className="mt-3 text-black">
          The REST response can be retained as client-side data. JavaScript can
          then manipulate that data and render the changed result without
          contacting Quickbase again.
        </p>

        <p className="mt-3 text-black font-bold">
          We retrieved the records in Lesson 1B. In Lesson 2, we started
          controlling them.
        </p>
      </section>

      {/* ======================================================
          NAVIGATION
      ====================================================== */}

      <div className="flex flex-col gap-4 border-t border-gray-300 pt-8 sm:flex-row sm:justify-between">
        <Link
          href="/lessons/1b"
          className="inline-flex rounded-md border border-[#1f5c99] px-5 py-3 font-bold text-[#1f5c99] hover:bg-[#eaf3fb]"
        >
          ← Lesson 1B: REST API
        </Link>

        <Link
          href="/lessons/3"
          className="inline-flex rounded-md bg-[#1f5c99] px-5 py-3 font-bold text-white hover:bg-[#164875]"
        >
          Lesson 3: Client-Side Searching →
        </Link>
      </div>
    </article>
  );
}