import Link from "next/link";

type LessonStatus = "complete" | "next" | "upcoming";

type Lesson = {
  number: string;
  title: string;
  description: string;
  href: string;
  status: LessonStatus;
};

const lessons: Lesson[] = [
  {
    number: "1A",
    title: "Read Records with XML API",
    description:
      "Learn how Quickbase tables, field IDs, API_DoQuery, Application Tokens, signed-in sessions, XML request bodies, and structured XML responses connect together.",
    href: "/lessons/1a",
    status: "complete",
  },
  {
    number: "1B",
    title: "Read Records with REST API",
    description:
      "Read the same People table using the modern Quickbase RESTful API and JSON.",
    href: "/lessons/1b",
    status: "next",
  },
  {
    number: "2",
    title: "Client-Side Sorting",
    description:
      "Sort records already loaded into the browser without requesting the data again.",
    href: "/lessons/2",
    status: "upcoming",
  },
  {
    number: "3",
    title: "Client-Side Searching",
    description: "Search records already retrieved from Quickbase.",
    href: "/lessons/3",
    status: "upcoming",
  },
  {
    number: "4",
    title: "Client-Side Filtering",
    description:
      "Filter displayed records by selected field values and conditions.",
    href: "/lessons/4",
    status: "upcoming",
  },
  {
    number: "5",
    title: "Add Records",
    description: "Create records in Quickbase from a Code Page.",
    href: "/lessons/5",
    status: "upcoming",
  },
  {
    number: "6",
    title: "Edit Records",
    description: "Update existing Quickbase records.",
    href: "/lessons/6",
    status: "upcoming",
  },
  {
    number: "7",
    title: "Delete Records",
    description: "Delete Quickbase records and process the response correctly.",
    href: "/lessons/7",
    status: "upcoming",
  },
  {
    number: "8",
    title: "Pagination",
    description: "Retrieve and display larger datasets in controlled groups.",
    href: "/lessons/8",
    status: "upcoming",
  },
  {
    number: "9",
    title: "Relationships",
    description: "Work with Quickbase parent and child table relationships.",
    href: "/lessons/9",
    status: "upcoming",
  },
  {
    number: "10",
    title: "Reusable JavaScript Library",
    description:
      "Extract repeated Quickbase API logic into reusable development utilities.",
    href: "/lessons/10",
    status: "upcoming",
  },
];

function StatusBadge({ status }: { status: LessonStatus }) {
  const classes = {
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
      className={`inline-flex rounded-md border px-3 py-1 text-sm font-bold ${classes[status]}`}
    >
      {labels[status]}
    </span>
  );
}

export default function LessonsPage() {
  return (
    <section>
      <div className="mb-10 border-b border-gray-300 pb-8">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Developer Lab
        </p>

        <h1 className="text-4xl font-bold">Table of Contents</h1>

        <p className="mt-4 max-w-4xl">
          This lab assumes working knowledge of HTML, CSS, and JavaScript. The
          lessons concentrate specifically on how Quickbase applications,
          tables, fields, records, APIs, authentication, and relationships are
          represented and manipulated in code.
        </p>
      </div>

      <div className="mb-10 rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6">
        <h2 className="text-2xl font-bold">Learning Method</h2>

        <p className="mt-3">
          Each lesson introduces one new Quickbase development concept. Previous
          working examples remain intact so that new API behavior can be
          compared directly with earlier lessons.
        </p>

        <p className="mt-3">
          The objective is not merely to make code execute. The objective is to
          understand exactly which Quickbase object each value references and
          why the API requires it.
        </p>
      </div>

      <div className="space-y-5">
        {lessons.map((lesson) => (
          <article
            key={lesson.number}
            className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="font-bold text-[#1f5c99]">
                  Lesson {lesson.number}
                </p>

                <h2 className="mt-1 text-2xl font-bold">{lesson.title}</h2>
              </div>

              <StatusBadge status={lesson.status} />
            </div>

            <p className="mt-4">{lesson.description}</p>

            {(lesson.status === "complete" || lesson.status === "next") && (
              <div className="mt-5 border-t border-gray-200 pt-4">
                <Link
                  href={lesson.href}
                  className="inline-flex rounded-md bg-[#1f5c99] px-4 py-2 font-bold text-white hover:bg-[#164875]"
                >
                  Open Lesson {lesson.number}
                </Link>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
