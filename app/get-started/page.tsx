import Link from "next/link";

const fields = [
  {
    name: "Name",
    type: "Text",
    purpose: "Stores the person's name.",
  },
  {
    name: "Age",
    type: "Numeric",
    purpose: "Stores the person's age.",
  },
  {
    name: "Favorite Color",
    type: "Text",
    purpose: "Stores a color value such as Blue, Green, Red, or Purple.",
  },
];

export default function GetStartedPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <header className="border-b border-gray-300 bg-[#1f5c99] text-white">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <p className="mb-2 text-base font-bold uppercase tracking-wide">
            Quickbase Code Pages Developer Lab
          </p>

          <h1 className="text-3xl font-bold md:text-4xl">Get Started</h1>

          <p className="mt-3 max-w-3xl text-lg text-white">
            Before beginning the lessons, create the small Quickbase table that
            every example in this lab uses.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <section className="mb-10 rounded-lg border-2 border-amber-700 bg-amber-50 p-6">
          <h2 className="text-2xl font-bold">Do This Before Lesson 1A</h2>

          <p className="mt-3">
            Create a Quickbase table named <strong>People</strong>.
          </p>

          <p className="mt-3">
            The lessons assume that this table already exists. If you skip this
            step, the table DBID, Field IDs, API queries, and returned records
            shown throughout the lab will not correspond to anything in your own
            Quickbase application.
          </p>

          <p className="mt-3 font-bold">
            In other words: yes, this boring little table matters. 😄
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold">
            1. Create a Quickbase Application
          </h2>

          <p className="mt-4">
            You can use an existing training application or create a new
            Quickbase application specifically for these lessons.
          </p>

          <p className="mt-4">
            Nothing about the application needs to be complicated. The lab is
            intentionally using a tiny dataset so that the API behavior stays
            easy to inspect.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold">2. Create a Table Named People</h2>

          <p className="mt-4">
            Inside the application, create a table with this exact name:
          </p>

          <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
            <code>People</code>
          </pre>

          <p className="mt-4">
            Quickbase will automatically create its normal system fields,
            including <strong>Record ID#</strong>.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold">3. Add These Fields</h2>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-[#1f5c99] text-white">
                  <th className="border border-gray-300 px-4 py-3 text-left">
                    Field Name
                  </th>

                  <th className="border border-gray-300 px-4 py-3 text-left">
                    Suggested Type
                  </th>

                  <th className="border border-gray-300 px-4 py-3 text-left">
                    Purpose
                  </th>
                </tr>
              </thead>

              <tbody>
                {fields.map((field) => (
                  <tr key={field.name}>
                    <td className="border border-gray-300 px-4 py-3 font-bold">
                      {field.name}
                    </td>

                    <td className="border border-gray-300 px-4 py-3">
                      {field.type}
                    </td>

                    <td className="border border-gray-300 px-4 py-3">
                      {field.purpose}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold">4. Add a Few Sample Records</h2>

          <p className="mt-4">
            Add several records so that the API lessons have something to
            retrieve.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-[#1f5c99] text-white">
                  <th className="border border-gray-300 px-4 py-3 text-left">
                    Name
                  </th>

                  <th className="border border-gray-300 px-4 py-3 text-left">
                    Age
                  </th>

                  <th className="border border-gray-300 px-4 py-3 text-left">
                    Favorite Color
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-3">Alice</td>

                  <td className="border border-gray-300 px-4 py-3">32</td>

                  <td className="border border-gray-300 px-4 py-3">Blue</td>
                </tr>

                <tr>
                  <td className="border border-gray-300 px-4 py-3">Marcus</td>

                  <td className="border border-gray-300 px-4 py-3">41</td>

                  <td className="border border-gray-300 px-4 py-3">Green</td>
                </tr>

                <tr>
                  <td className="border border-gray-300 px-4 py-3">Olivia</td>

                  <td className="border border-gray-300 px-4 py-3">27</td>

                  <td className="border border-gray-300 px-4 py-3">Purple</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4">
            The exact names, ages, and colors do not matter. The important thing
            is that the table contains records with values in all three fields.
          </p>
        </section>

        <section className="mb-12 rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6">
          <h2 className="text-2xl font-bold">
            5. Your Field IDs May Be Different
          </h2>

          <p className="mt-3">This is important.</p>

          <p className="mt-3">
            The tutorial examples use Field IDs from the original training
            People table:
          </p>

          <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-white p-5 text-base">
            <code>{`Record ID#       → Field ID 3
Name             → Field ID 6
Age              → Field ID 7
Favorite Color   → Field ID 8`}</code>
          </pre>

          <p className="mt-4">
            Quickbase assigns Field IDs when fields are created. Depending on
            how your table was built, your Field IDs may not match these
            numbers.
          </p>

          <p className="mt-4 font-bold">
            Always use the Field IDs from your own Quickbase table when running
            the examples.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold">
            6. You Will Also Need the Table DBID
          </h2>

          <p className="mt-4">
            Lessons 1A and 1B identify the People table using its Quickbase
            table DBID.
          </p>

          <p className="mt-4">
            The tutorial source contains an example such as:
          </p>

          <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
            <code>{`const TABLE_DBID = "YOUR_TABLE_DBID";`}</code>
          </pre>

          <p className="mt-4">
            Replace that placeholder with the DBID for your own People table.
          </p>

          <p className="mt-4">
            Lesson 1A explains why Quickbase APIs use the table DBID and Field
            IDs instead of depending only on the visible table and field names.
          </p>
        </section>

        <section className="mb-12 rounded-lg border-2 border-green-700 bg-green-50 p-6">
          <h2 className="text-2xl font-bold text-green-950">
            Ready for Lesson 1A
          </h2>

          <p className="mt-3">Before continuing, you should have:</p>

          <ul className="mt-4 list-disc space-y-2 pl-7">
            <li>A Quickbase application</li>
            <li>A table named People</li>
            <li>A Name field</li>
            <li>An Age field</li>
            <li>A Favorite Color field</li>
            <li>Several sample records</li>
            <li>The table DBID</li>
            <li>The Field IDs for each field</li>
          </ul>

          <p className="mt-4 font-bold">
            Once those exist, the rest of the tutorial finally stops looking
            like mysterious numbers thrown at Quickbase. 😂
          </p>
        </section>

        <div className="flex flex-col gap-4 border-t border-gray-300 pt-8 sm:flex-row sm:justify-between">
          <Link
            href="/"
            className="inline-flex rounded-md border border-[#1f5c99] px-5 py-3 font-bold text-[#1f5c99] hover:bg-[#eaf3fb]"
          >
            ← Developer Lab Home
          </Link>

          <Link
            href="/lessons/1a"
            className="inline-flex rounded-md bg-[#1f5c99] px-5 py-3 font-bold text-white hover:bg-[#164875]"
          >
            Start Lesson 1A →
          </Link>
        </div>
      </div>
    </main>
  );
}
