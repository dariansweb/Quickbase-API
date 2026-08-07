import Link from "next/link";

type LessonStatus = "complete" | "next" | "upcoming";

type Lesson = {
  number: string;
  title: string;
  description: string;
  status: LessonStatus;
  link: string
};

const lessons: Lesson[] = [
  {
    number: "1A",
    title: "Read Records with XML API",
    description:
      "Read People records using API_DoQuery, fetch(), the Quickbase session, an Application Token, XML, and DOMParser.",
    status: "complete",
    link: "/lessons/1a"
  },
  {
    number: "1B",
    title: "Read Records with REST API",
    description:
      "Read the exact same People table using the modern Quickbase RESTful JSON API.",
    status: "next",
    link: "/lessons/1b"
  },
  {
    number: "2",
    title: "Client-Side Sorting",
    description:
      "Sort records already loaded into the browser without sending another request to Quickbase.",
    status: "upcoming",
    link: "/lessons/2"
  },
  {
    number: "3",
    title: "Client-Side Searching",
    description:
      "Search the records displayed by the Code Page using JavaScript.",
    status: "upcoming",
    link: "/lessons/3"
  },
  {
    number: "4",
    title: "Client-Side Filtering",
    description:
      "Filter the displayed dataset using specific field values and conditions.",
    status: "upcoming",
    link: "/lessons/4"
  },
  {
    number: "5",
    title: "Add Records",
    description: "Create new Quickbase records from a Code Page.",
    status: "upcoming",
    link: "/lessons/5"
  },
  {
    number: "6",
    title: "Edit Records",
    description:
      "Update existing Quickbase records from the training application.",
    status: "upcoming",
    link: "/lessons/6"
  },
  {
    number: "7",
    title: "Delete Records",
    description:
      "Delete Quickbase records and properly handle the resulting API response.",
    status: "upcoming",
    link: "/lessons/7"
  },
  {
    number: "8",
    title: "Pagination",
    description: "Request and display larger datasets in manageable pages.",
    status: "upcoming",
    link: "/lessons/8"
  },
  {
    number: "9",
    title: "Relationships",
    description:
      "Work with Quickbase parent-child relationships through the API.",
    status: "upcoming",
    link: "/lessons/9"
  },
  {
    number: "10",
    title: "Reusable JavaScript Library",
    description:
      "Extract the patterns learned throughout the lab into reusable Quickbase development utilities.",
    status: "upcoming",
    link: "/lessons/10"
  },
];

function StatusBadge({ status }: { status: LessonStatus }) {
  const styles = {
    complete: "border-green-700 bg-green-50 text-green-900",
    next: "border-amber-700 bg-amber-50 text-amber-950",
    upcoming: "border-gray-400 bg-white text-black",
  };

  const labels = {
    complete: "Complete",
    next: "Next Lesson",
    upcoming: "Upcoming",
  };

  return (
    <span
      className={`inline-flex rounded-md border px-3 py-1 text-sm font-bold ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      <header className="border-b border-gray-300 bg-[#1f5c99] text-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <p className="mb-2 text-base font-bold uppercase tracking-wide">
            Quickbase Tutorials
          </p>

          <h1 className="text-3xl font-bold md:text-4xl">
            Code Pages Developer Lab
          </h1>

          <p className="mt-3 max-w-4xl text-lg text-white">
            Learn Quickbase development by building real working Code Page
            examples one concept at a time.
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[280px_1fr]">
        <aside>
          <div className="sticky top-6 rounded-lg border border-gray-300 bg-[#f7f8fa] p-5">
            <h2 className="mb-4 text-xl font-bold">Lab Progress</h2>

            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between text-base">
                <span>Lessons Completed</span>
                <strong>1 / 11</strong>
              </div>

              <div className="h-3 overflow-hidden rounded-full border border-gray-300 bg-white">
                <div className="h-full w-[9%] bg-[#216e39]" />
              </div>
            </div>

            <nav aria-label="Developer Lab lessons">
              <ul className="space-y-2">
                {lessons.map((lesson) => (
                  <li key={lesson.number}>
                    <a
                      href={`#lesson-${lesson.number.toLowerCase()}`}
                      className="block rounded-md border border-transparent px-3 py-2 text-base font-semibold hover:border-gray-300 hover:bg-white"
                    >
                      <span className="mr-2 font-bold">{lesson.number}</span>
                      {lesson.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        <section>
          <div className="mb-10">
            <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
              Developer Training
            </p>

            <h2 className="text-3xl font-bold">
              Quickbase Code Pages Learning Roadmap
            </h2>

            <p className="mt-4 max-w-4xl">
              Each lesson introduces one development concept and builds upon a
              previously working example. Completed lessons remain intact so
              that the differences between Quickbase technologies can be
              examined directly.
            </p>
          </div>

          <div className="mb-10 rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6">
            <h2 className="text-2xl font-bold">Current Position</h2>

            <p className="mt-3">
              Lesson <strong>1A</strong> is complete. The working
              <code className="mx-2 rounded border border-gray-300 bg-white px-2 py-1">
                PeoplePage_xml.html
              </code>
              Code Page reads five records from the Quickbase People table using
              the legacy XML API.
            </p>

            <p className="mt-3">
              The next lesson will query the exact same table using the modern
              Quickbase RESTful API so that the two API architectures can be
              compared directly.
            </p>
          </div>

          <div className="space-y-5">
            {lessons.map((lesson) => (
              <article
                key={lesson.number}
                id={`lesson-${lesson.number.toLowerCase()}`}
                className="scroll-mt-6 rounded-lg border border-gray-300 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="mb-1 text-base font-bold text-[#1f5c99]">
                      Lesson {lesson.number}
                    </p>

                    <h3 className="text-2xl font-bold">{lesson.title}</h3>
                  </div>

                  <StatusBadge status={lesson.status} />
                </div>

                <p className="mt-4">{lesson.description}</p>

                {lesson.status === "complete" && (
                  <div className="mt-5 border-t border-gray-200 pt-4">
                    <strong>Working example:</strong>{" "}
                    <code>PeoplePage_xml.html</code>
                  </div>
                )}

                {lesson.status === "next" && (
                  <div className="mt-5 border-t border-gray-200 pt-4">
                    <strong>Next objective:</strong> Replace XML request and
                    response handling with the Quickbase RESTful JSON API while
                    keeping the People dataset unchanged.
                  </div>
                )}

                <div className="mt-5">
                  <Link
                    href={lesson.link}
                    className="inline-flex rounded-md bg-[#1f5c99] px-4 py-2 font-bold text-white hover:bg-[#164875]"
                  >
                    Open Lesson {lesson.number} →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <footer className="mt-10 border-t border-gray-300 bg-[#f7f8fa]">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <p className="font-semibold">Quickbase Code Pages Developer Lab</p>

          <p className="mt-1 text-base">
            Build it. Inspect it. Understand why it works.
          </p>
        </div>
      </footer>
    </main>
  );
}
