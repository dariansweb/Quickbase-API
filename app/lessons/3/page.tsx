import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lesson 3 — Query Quickbase with Search Criteria",
  description:
    "Learn how to add a Quickbase REST where clause so only matching records are returned from the API.",
};

const comparisonRows = [
  {
    concept: "Initial page load",
    lesson2: "Query all People records",
    lesson3: "Query no records",
  },
  {
    concept: "User action",
    lesson2: "Sort already-loaded records",
    lesson3: "Enter search criteria",
  },
  {
    concept: "Where operation happens",
    lesson2: "Browser JavaScript",
    lesson3: "Quickbase",
  },
  {
    concept: "Additional REST request",
    lesson2: "No",
    lesson3: "Yes",
  },
  {
    concept: "Returned dataset",
    lesson2: "All queried records",
    lesson3: "Only matching records",
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

    <title>People Table</title>

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

      .search-controls {
        margin-bottom: 24px;
        padding: 24px;
        border: 1px solid #b8c9da;
        border-radius: 10px;
        background: #ffffff;
        box-shadow: 0 4px 12px rgba(0, 51, 102, 0.08);
      }

      .search-intro {
        margin-bottom: 20px;
      }

      .search-eyebrow {
        margin: 0 0 6px;
        color: #1f5c99;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .search-intro h3 {
        margin: 0 0 8px;
        color: #003366;
        font-size: 22px;
      }

      .search-intro p {
        max-width: 760px;
        margin: 0;
        color: #52606d;
        line-height: 1.6;
      }

      .search-action {
        display: flex;
        align-items: end;
        gap: 12px;
        margin-bottom: 20px;
      }

      .search-field {
        flex: 1;
        max-width: 420px;
      }

      .search-field label {
        display: block;
        margin-bottom: 6px;
        font-weight: 700;
        color: #263746;
      }

      .search-field input {
        box-sizing: border-box;
        width: 100%;
        padding: 11px 12px;
        border: 1px solid #9fb3c8;
        border-radius: 6px;
        background: #ffffff;
        color: #1f2933;
        font: inherit;
      }

      .search-field input:focus {
        outline: 3px solid rgba(31, 92, 153, 0.15);
        border-color: #1f5c99;
      }

      .search-action button {
        padding: 11px 18px;
        border: 1px solid #174a7c;
        border-radius: 6px;
        background: #1f5c99;
        color: #ffffff;
        font: inherit;
        font-weight: 700;
        cursor: pointer;
      }

      .search-action button:hover {
        background: #174a7c;
      }

      .search-steps {
        padding: 16px 18px;
        border-left: 4px solid #1f5c99;
        background: #f3f7fb;
        color: #364957;
      }

      .search-steps ol {
        margin: 10px 0 0;
        padding-left: 22px;
      }

      @media (max-width: 640px) {
        .search-action {
          align-items: stretch;
          flex-direction: column;
        }

        .search-field {
          max-width: none;
        }

        .search-action button {
          width: 100%;
        }
      }
    </style>
  </head>

  <body>
    <main class="page">
      <h1>People</h1>

      <h2>
        Lesson 3 — Search Quickbase → Return Matching Records → Render Results
      </h2>

      <p class="description">
        Request only the People records that match the search criteria.
      </p>

      <div id="status" class="status">
        Enter a Favorite Color and click Search.
      </div>

      <div class="search-controls">
        <div class="search-intro">
          <p class="search-eyebrow">
            Try It Yourself
          </p>

          <h3>
            Search Quickbase by Favorite Color
          </h3>

          <p>
            The table below starts empty.
            Enter a favorite color and click
            <strong> Search Quickbase</strong>
            to request only matching People records.
          </p>
        </div>

        <div class="search-action">
          <div class="search-field">
            <label for="favoriteColorSearch">
              Favorite Color
            </label>

            <input
              type="text"
              id="favoriteColorSearch"
              placeholder="Example: Blue"
            />
          </div>

          <button
            type="button"
            id="searchButton"
          >
            Search Quickbase
          </button>
        </div>

        <div class="search-steps">
          <strong>
            What happens when you search?
          </strong>

          <ol>
            <li>You enter a favorite color.</li>
            <li>You click Search Quickbase.</li>
            <li>The search criteria is sent to Quickbase.</li>
            <li>Quickbase finds matching records.</li>
            <li>Only those records are returned.</li>
          </ol>
        </div>
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

      const TABLE_DBID =
        "YOUR_TABLE_DBID";

      const APP_TOKEN = "";

      let peopleRecords = [];

      let nameSortDirection = "asc";


      const FIELD_IDS = {
        recordId: 3,
        name: 6,
        age: 7,
        favoriteColor: 8,
      };


      function createCell(value) {
        const cell =
          document.createElement("td");

        cell.textContent = value;

        return cell;
      }


      function createColorCell(colorName) {
        const cell =
          document.createElement("td");

        const wrapper =
          document.createElement("span");

        wrapper.className =
          "color-value";

        const swatch =
          document.createElement("span");

        swatch.className =
          "color-swatch";

        swatch.style.backgroundColor =
          colorName || "transparent";

        const label =
          document.createElement("span");

        label.textContent =
          colorName;

        wrapper.appendChild(swatch);
        wrapper.appendChild(label);

        cell.appendChild(wrapper);

        return cell;
      }


      async function readQuickbaseResponse(response) {
        const rawBody =
          await response.text();

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
       * LESSON 2 FUNCTION RETAINED
       * ============================================================
       *
       * Sorting still operates on the records that Quickbase has
       * already returned.
       *
       * This lets us directly compare client-side manipulation with
       * Lesson 3's server-side query.
       */
      function sortByName() {
        peopleRecords.sort((a, b) => {
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

          const comparison =
            nameA.localeCompare(nameB);

          return nameSortDirection === "asc"
            ? comparison
            : -comparison;
        });

        const sortButton =
          document.getElementById("sortName");

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

        renderRecords(
          peopleRecords
        );
      }


      /*
       * ============================================================
       * LESSON 3 — BUILD SEARCH CRITERIA
       * ============================================================
       *
       * Unlike Lesson 2, we are NOT searching peopleRecords.
       *
       * We read the learner's search value and turn it into a
       * Quickbase query expression.
       */
      function searchByFavoriteColor() {
        const input =
          document.getElementById(
            "favoriteColorSearch"
          );

        const color =
          input.value.trim();


        /*
         * ==========================================================
         * NO CRITERIA = NO QUICKBASE QUERY
         * ==========================================================
         *
         * An empty search should not mean "return everything."
         *
         * Lesson 3 intentionally starts with no records and requires
         * actual search criteria before querying Quickbase.
         */
        if (!color) {
          const status =
            document.getElementById(
              "status"
            );

          peopleRecords = [];

          renderRecords(
            peopleRecords
          );

          status.classList.remove(
            "error"
          );

          status.textContent =
            "Enter a Favorite Color before searching.";

          return;
        }


        /*
         * ==========================================================
         * QUICKBASE WHERE EXPRESSION
         * ==========================================================
         *
         * Favorite Color is Field ID 8.
         *
         * If the learner enters:
         *
         *     Blue
         *
         * this becomes:
         *
         *     {8.EX.'Blue'}
         *
         * EX means exact match.
         *
         * This expression is sent to Quickbase. The browser is not
         * filtering an already-loaded dataset.
         */
        const where =
          \`{\${FIELD_IDS.favoriteColor}.EX.'\${color}'}\`;


        /*
         * Run a NEW Quickbase REST query using the criteria.
         */
        loadPeople(where);
      }


      /*
       * ============================================================
       * LESSON 3 — QUERY QUICKBASE USING AN OPTIONAL WHERE CLAUSE
       * ============================================================
       *
       * Lesson 1B introduced this REST records query.
       *
       * Lesson 3 adds one major capability:
       *
       *     where
       *
       * The caller can now tell Quickbase which records should
       * qualify before Quickbase returns the result set.
       */
      async function loadPeople(where = "") {
        const startTime =
          performance.now();

        const status =
          document.getElementById(
            "status"
          );

        try {
          const temporaryToken =
            await getTemporaryToken();


          const query = {
            from: TABLE_DBID,


            /*
             * ======================================================
             * QUICKBASE QUERY FILTER
             * ======================================================
             *
             * This is the new Lesson 3 property.
             *
             * Example:
             *
             *     where: "{8.EX.'Blue'}"
             *
             * Quickbase evaluates this condition before returning
             * records.
             */
            where,


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
            peopleRecords = [];

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
              \`REST query returned 0 record(s) in \${renderTime.toFixed(2)} ms.\`;

            return;
          }


          /*
           * Keep the records returned by THIS search.
           *
           * Sorting from Lesson 2 can still operate on them afterward.
           */
          peopleRecords =
            records;


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
       * IMPORTANT LESSON 3 CHANGE
       * ============================================================
       *
       * Notice that loadPeople() is NOT called here.
       *
       * The page begins with an empty result table.
       *
       * Quickbase is queried only after the learner supplies search
       * criteria and clicks Search Quickbase.
       */
      document.addEventListener(
        "DOMContentLoaded",
        () => {
          document
            .getElementById(
              "sortName"
            )
            .addEventListener(
              "click",
              sortByName
            );

          document
            .getElementById(
              "searchButton"
            )
            .addEventListener(
              "click",
              searchByFavoriteColor
            );
        }
      );
    </script>
  </body>
</html>`;

export default function Lesson3Page() {
  return (
    <article>
      {/* ======================================================
          LESSON HEADER
      ====================================================== */}

      <header className="mb-10 border-b border-gray-300 pb-8">
        <p className="font-bold uppercase tracking-wide text-[#1f5c99]">
          Lesson 3
        </p>
        <Link
          href="/files/PeoplePage_search.txt"
          target="_blank"
          className="font-bold text-[#1f5c99] underline"
        >
          Code Page Here - PeoplePage_sort.html
        </Link>
        <h1 className="mt-2 text-4xl font-bold">
          Query Quickbase with Search Criteria
        </h1>

        <p className="mt-4 max-w-4xl text-xl">
          Instead of retrieving every record and deciding what we want
          afterward, tell Quickbase which records we want before it returns
          anything.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <span className="rounded-md border border-green-700 bg-green-50 px-3 py-1 text-sm font-bold text-green-900">
            Complete
          </span>

          <span className="rounded-md border border-gray-400 bg-white px-3 py-1 text-sm font-bold">
            REST Query
          </span>

          <span className="rounded-md border border-gray-400 bg-white px-3 py-1 text-sm font-bold">
            where
          </span>

          <span className="rounded-md border border-gray-400 bg-white px-3 py-1 text-sm font-bold">
            Query Criteria
          </span>

          <span className="rounded-md border border-gray-400 bg-white px-3 py-1 text-sm font-bold">
            Exact Match
          </span>
        </div>
      </header>

      {/* ======================================================
          DIRECTION CHANGE
      ====================================================== */}

      <section className="mb-12">
        <h2 className="text-3xl font-bold">Why the Roadmap Changes Here</h2>

        <p className="mt-4">
          Lesson 2 proved an important point: Quickbase can return records to
          JavaScript, JavaScript can retain those records, and the browser can
          manipulate them without another API request.
        </p>

        <p className="mt-4">Sorting was enough to prove that concept.</p>

        <p className="mt-4">
          Rather than spend several lessons repeating client-side manipulation,
          Lesson 3 returns our attention to the Quickbase REST API itself.
        </p>

        <div className="mt-6 rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6">
          <p className="text-xl font-bold">The new question is:</p>

          <p className="mt-3 text-xl">
            Can we control which records Quickbase returns in the first place?
          </p>
        </div>
      </section>

      {/* ======================================================
          BIG IDEA
      ====================================================== */}

      <section className="mb-12">
        <h2 className="text-3xl font-bold">
          1. Control the Result Set Before It Returns
        </h2>

        <p className="mt-4">
          Our earlier REST examples could request the People table and receive a
          collection of records.
        </p>

        <p className="mt-4">Lesson 3 adds criteria to that REST query.</p>

        <div className="mt-6 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-6 font-mono leading-8">
          <div>Lesson 1B</div>
          <div className="ml-6">Quickbase → return People records</div>

          <div className="mt-5">Lesson 2</div>
          <div className="ml-6">
            Quickbase → return records → JavaScript sorts them
          </div>

          <div className="mt-5 font-bold text-[#1f5c99]">Lesson 3</div>
          <div className="ml-6 font-bold">
            Search criteria → Quickbase → return only matches
          </div>
        </div>
      </section>

      {/* ======================================================
          EMPTY START
      ====================================================== */}

      <section className="mb-12">
        <h2 className="text-3xl font-bold">2. Start with No Records</h2>

        <p className="mt-4">
          The page deliberately begins with an empty table.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`document.addEventListener(
  "DOMContentLoaded",
  () => {
    document
      .getElementById("sortName")
      .addEventListener("click", sortByName);

    document
      .getElementById("searchButton")
      .addEventListener(
        "click",
        searchByFavoriteColor
      );
  }
);`}</code>
        </pre>

        <p className="mt-4">
          The important detail is what is <strong>not</strong> there:
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg border-2 border-green-700 bg-green-50 p-5 text-base">
          <code>{`loadPeople();`}</code>
        </pre>

        <p className="mt-4">
          The Code Page does not query Quickbase simply because the page opened.
        </p>
      </section>

      {/* ======================================================
          CLARIFICATION 1
      ====================================================== */}

      <section className="mb-12 rounded-lg border-2 border-amber-700 bg-amber-50 p-6">
        <h2 className="text-2xl font-bold">
          Clarification: Why Was the Whole Table Appearing First?
        </h2>

        <p className="mt-4">
          During development, the search itself worked, but the page still
          returned the complete People dataset before the learner searched.
        </p>

        <p className="mt-4">The reason was simple:</p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-amber-300 bg-white p-5 text-base">
          <code>{`loadPeople();`}</code>
        </pre>

        <p className="mt-4">
          was still running during <code>DOMContentLoaded</code>.
        </p>

        <p className="mt-4">
          A REST query with no search condition naturally returned the normal
          result set. Removing that initial call changed the page from:
        </p>

        <div className="mt-5 font-mono leading-8">
          <div>Page opens</div>
          <div>↓</div>
          <div>Query Quickbase</div>
          <div>↓</div>
          <div>Show everything</div>
        </div>

        <p className="mt-5">to:</p>

        <div className="mt-5 font-mono leading-8">
          <div>Page opens</div>
          <div>↓</div>
          <div className="font-bold">No record query</div>
          <div>↓</div>
          <div>Wait for search criteria</div>
        </div>
      </section>

      {/* ======================================================
          USER INPUT
      ====================================================== */}

      <section className="mb-12">
        <h2 className="text-3xl font-bold">3. Read the Search Value</h2>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`const input =
  document.getElementById(
    "favoriteColorSearch"
  );

const color =
  input.value.trim();`}</code>
        </pre>

        <p className="mt-4">
          This portion is ordinary browser JavaScript. The Quickbase-specific
          work begins when that value is converted into query criteria.
        </p>
      </section>

      {/* ======================================================
          NO CRITERIA
      ====================================================== */}

      <section className="mb-12">
        <h2 className="text-3xl font-bold">
          4. No Search Criteria Means No Query
        </h2>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`if (!color) {
  const status =
    document.getElementById("status");

  peopleRecords = [];

  renderRecords(peopleRecords);

  status.classList.remove("error");

  status.textContent =
    "Enter a Favorite Color before searching.";

  return;
}`}</code>
        </pre>

        <p className="mt-4">This creates a deliberate rule for the lesson:</p>

        <div className="mt-6 rounded-lg border-2 border-green-700 bg-green-50 p-6">
          <p className="text-xl font-bold text-green-950">
            No criteria = no Quickbase record query.
          </p>
        </div>
      </section>

      {/* ======================================================
          CLARIFICATION 2
      ====================================================== */}

      <section className="mb-12 rounded-lg border-2 border-amber-700 bg-amber-50 p-6">
        <h2 className="text-2xl font-bold">
          Clarification: Why Not Let a Blank Search Return Everything?
        </h2>

        <p className="mt-4">
          An earlier version called <code>loadPeople()</code> when the search
          box was empty. That made an empty search behave like “show all
          records.”
        </p>

        <p className="mt-4">
          That behavior was valid JavaScript, but it contradicted the purpose of
          this lesson.
        </p>

        <p className="mt-4">
          We are specifically learning to request only what is needed. Therefore
          a missing condition should not silently become a request for the
          entire table.
        </p>
      </section>

      {/* ======================================================
          QUICKBASE QUERY LANGUAGE
      ====================================================== */}

      <section className="mb-12">
        <h2 className="text-3xl font-bold">
          5. Build a Quickbase Query Expression
        </h2>

        <p className="mt-4">The new Quickbase-specific line is:</p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`const where =
  \`{\${FIELD_IDS.favoriteColor}.EX.'\${color}'}\`;`}</code>
        </pre>

        <p className="mt-4">If:</p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`FIELD_IDS.favoriteColor = 8`}</code>
        </pre>

        <p className="mt-4">and the learner enters:</p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>Blue</code>
        </pre>

        <p className="mt-4">the final Quickbase expression becomes:</p>

        <pre className="mt-5 overflow-x-auto rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-5 text-lg">
          <code>{`{8.EX.'Blue'}`}</code>
        </pre>
      </section>

      {/* ======================================================
          BREAKDOWN
      ====================================================== */}

      <section className="mb-12">
        <h2 className="text-3xl font-bold">
          6. Read the Query from Left to Right
        </h2>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#1f5c99] text-white">
                <th className="border border-gray-300 px-4 py-3 text-left">
                  Part
                </th>

                <th className="border border-gray-300 px-4 py-3 text-left">
                  Meaning
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-3">
                  <code>8</code>
                </td>

                <td className="border border-gray-300 px-4 py-3">
                  Quickbase Favorite Color Field ID.
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-3">
                  <code>EX</code>
                </td>

                <td className="border border-gray-300 px-4 py-3">
                  Exact-match comparison.
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-3">
                  <code>&apos;Blue&apos;</code>
                </td>

                <td className="border border-gray-300 px-4 py-3">
                  The value the learner entered.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-lg border border-gray-300 bg-[#f7f8fa] p-6 font-mono leading-8">
          <div>{`{8.EX.'Blue'}`}</div>
          <div>↓</div>
          <div>Field ID 8</div>
          <div>↓</div>
          <div>Favorite Color</div>
          <div>↓</div>
          <div>exactly equals</div>
          <div>↓</div>
          <div className="font-bold">Blue</div>
        </div>
      </section>

      {/* ======================================================
          PASS WHERE
      ====================================================== */}

      <section className="mb-12">
        <h2 className="text-3xl font-bold">
          7. Pass the Criteria into the REST Query
        </h2>

        <p className="mt-4">Once the Quickbase expression is built:</p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`loadPeople(where);`}</code>
        </pre>

        <p className="mt-4">
          <code>loadPeople()</code> now accepts the condition:
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`async function loadPeople(where = "") {`}</code>
        </pre>

        <p className="mt-4">
          The default value preserves a reusable function signature, but the
          Lesson 3 interface does not automatically call it with an empty
          condition.
        </p>
      </section>

      {/* ======================================================
          JSON WHERE
      ====================================================== */}

      <section className="mb-12">
        <h2 className="text-3xl font-bold">
          8. Add where to the Quickbase JSON Query
        </h2>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
          <code>{`const query = {
  from: TABLE_DBID,

  where,

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
      fieldId: FIELD_IDS.name,
      order: "ASC",
    },
  ],
};`}</code>
        </pre>

        <p className="mt-4">The major Lesson 3 addition is simply:</p>

        <pre className="mt-5 overflow-x-auto rounded-lg border-2 border-green-700 bg-green-50 p-5 text-xl">
          <code>where,</code>
        </pre>

        <p className="mt-4">
          But that small JSON property fundamentally changes which records
          Quickbase returns.
        </p>
      </section>

      {/* ======================================================
          COMPLETE JSON
      ====================================================== */}

      <section className="mb-12 rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6">
        <h2 className="text-2xl font-bold">What Quickbase Receives</h2>

        <p className="mt-4">
          Searching for Blue effectively produces a query resembling:
        </p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-white p-5 text-base">
          <code>{`{
  "from": "YOUR_TABLE_DBID",

  "where": "{8.EX.'Blue'}",

  "select": [
    3,
    6,
    7,
    8
  ],

  "options": {
    "top": 200,
    "skip": 0
  },

  "sortBy": [
    {
      "fieldId": 6,
      "order": "ASC"
    }
  ]
}`}</code>
        </pre>

        <p className="mt-4">
          Quickbase evaluates the <code>where</code> condition and returns only
          records that qualify.
        </p>
      </section>

      {/* ======================================================
          SERVER VS CLIENT
      ====================================================== */}

      <section className="mb-12">
        <h2 className="text-3xl font-bold">
          9. Lesson 2 and Lesson 3 Are Doing Different Work
        </h2>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#1f5c99] text-white">
                <th className="border border-gray-300 px-4 py-3 text-left">
                  Concept
                </th>

                <th className="border border-gray-300 px-4 py-3 text-left">
                  Lesson 2
                </th>

                <th className="border border-gray-300 px-4 py-3 text-left">
                  Lesson 3
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
                    {row.lesson2}
                  </td>

                  <td className="border border-gray-300 px-4 py-3">
                    {row.lesson3}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ======================================================
          CLARIFICATION 3
      ====================================================== */}

      <section className="mb-12 rounded-lg border-2 border-amber-700 bg-amber-50 p-6">
        <h2 className="text-2xl font-bold">
          Clarification: This Is Not Client-Side Searching
        </h2>

        <p className="mt-4">
          Lesson 2 retained Quickbase records in <code>peopleRecords</code> and
          then manipulated that array directly.
        </p>

        <p className="mt-4">Lesson 3 does something different.</p>

        <div className="mt-6 font-mono leading-8">
          <div>User enters Blue</div>
          <div>↓</div>

          <div>{`{8.EX.'Blue'}`}</div>
          <div>↓</div>

          <div>POST /v1/records/query</div>
          <div>↓</div>

          <div className="font-bold">Quickbase evaluates the condition</div>
          <div>↓</div>

          <div>Only matching records return</div>
        </div>

        <p className="mt-5">
          This distinction was important enough that the interaction itself was
          changed to say <strong>Search Quickbase</strong> rather than merely{" "}
          <strong>Search</strong>.
        </p>
      </section>

      {/* ======================================================
          CTA EXPLANATION
      ====================================================== */}

      <section className="mb-12">
        <h2 className="text-3xl font-bold">
          10. Make the Experiment Obvious to the Learner
        </h2>

        <p className="mt-4">
          The finished Code Page contains an instructional interaction panel
          because searching is the central experiment in this lesson.
        </p>

        <div className="mt-6 rounded-xl border border-[#b8c9da] bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-widest text-[#1f5c99]">
            Try It Yourself
          </p>

          <h3 className="mt-2 text-2xl font-bold text-[#003366]">
            Search Quickbase by Favorite Color
          </h3>

          <p className="mt-3 max-w-3xl">
            The table starts empty. Enter a favorite color and click{" "}
            <strong>Search Quickbase</strong> to request only matching People
            records.
          </p>

          <div className="mt-5 rounded-lg border-l-4 border-[#1f5c99] bg-[#f3f7fb] p-5">
            <strong>What happens when you search?</strong>

            <ol className="mt-3 list-decimal space-y-2 pl-6">
              <li>You enter a favorite color.</li>
              <li>You click Search Quickbase.</li>
              <li>The Code Page sends your criteria to Quickbase.</li>
              <li>Quickbase finds only matching records.</li>
              <li>The matching records are returned and displayed.</li>
            </ol>
          </div>
        </div>
      </section>

      {/* ======================================================
          COMPLETE FLOW
      ====================================================== */}

      <section className="mb-12">
        <h2 className="text-3xl font-bold">11. The Complete Lesson 3 Flow</h2>

        <div className="mt-6 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-6 font-mono leading-8">
          <div>Page opens</div>
          <div>↓</div>

          <div className="font-bold">No Quickbase records requested</div>

          <div>↓</div>

          <div>User enters Blue</div>
          <div>↓</div>

          <div>FIELD_IDS.favoriteColor</div>
          <div className="ml-6">↓</div>
          <div className="ml-6">8</div>

          <div>↓</div>

          <div>{`{8.EX.'Blue'}`}</div>

          <div>↓</div>

          <div>query.where</div>

          <div>↓</div>

          <div>POST /v1/records/query</div>

          <div>↓</div>

          <div className="font-bold">QUICKBASE</div>

          <div>↓</div>

          <div>Quickbase evaluates criteria</div>

          <div>↓</div>

          <div>Only matching records return</div>

          <div>↓</div>

          <div>peopleRecords = records</div>

          <div>↓</div>

          <div>renderRecords(peopleRecords)</div>
        </div>
      </section>

      {/* ======================================================
          THE BIG IDEA
      ====================================================== */}

      <section className="mb-12 rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6">
        <h2 className="text-2xl font-bold">The Bigger Idea</h2>

        <p className="mt-4">Lesson 2 taught:</p>

        <blockquote className="mt-3 border-l-4 border-[#1f5c99] pl-4 font-bold">
          Quickbase gave us the data. Now JavaScript can control it.
        </blockquote>

        <p className="mt-6">Lesson 3 adds:</p>

        <blockquote className="mt-3 border-l-4 border-[#1f5c99] pl-4 font-bold">
          We can also control which data Quickbase gives us.
        </blockquote>

        <p className="mt-6">
          Those are two different kinds of control, and understanding that
          distinction gives us a much stronger foundation for more advanced
          Quickbase queries.
        </p>
      </section>

      {/* ======================================================
          COMPLETE SOURCE
      ====================================================== */}

      <section className="mb-12">
        <h2 className="text-3xl font-bold">Complete Lesson 3 Source</h2>

        <p className="mt-4">
          The training source below preserves the REST architecture and Lesson 2
          sorting behavior while emphasizing the Lesson 3 changes: delayed
          querying, Quickbase search criteria, and the REST <code>where</code>{" "}
          property.
        </p>

        <pre className="mt-6 max-h-250 overflow-auto rounded-lg border border-gray-300 bg-[#111111] p-6 text-sm leading-6 text-white">
          <code>{completeSource}</code>
        </pre>
      </section>

      {/* ======================================================
          COMPLETE
      ====================================================== */}

      <section className="mb-12 rounded-lg border-2 border-green-700 bg-green-50 p-6">
        <h2 className="text-2xl font-bold text-green-950">Lesson 3 Complete</h2>

        <p className="mt-3 text-black">
          You should now understand that a Quickbase REST query does not have to
          retrieve the entire available dataset.
        </p>

        <p className="mt-3 text-black">
          A <code>where</code> expression can tell Quickbase which records
          qualify before the response is returned.
        </p>

        <p className="mt-3 font-bold text-black">
          Lesson 2 gave us control after the data returned. Lesson 3 gives us
          control over what returns.
        </p>
      </section>

      {/* ======================================================
          NAVIGATION
      ====================================================== */}

      <div className="flex flex-col gap-4 border-t border-gray-300 pt-8 sm:flex-row sm:justify-between">
        <Link
          href="/lessons/2"
          className="inline-flex rounded-md border border-[#1f5c99] px-5 py-3 font-bold text-[#1f5c99] hover:bg-[#eaf3fb]"
        >
          ← Lesson 2: Client-Side Sorting
        </Link>

        <Link
          href="/lessons/4"
          className="inline-flex rounded-md bg-[#1f5c99] px-5 py-3 font-bold text-white hover:bg-[#164875]"
        >
          Lesson 4 →
        </Link>
      </div>
    </article>
  );
}
