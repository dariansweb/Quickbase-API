import Link from "next/link";

import {
  lessons,
  type LessonStatus,
} from "../data/lessons";

function StatusBadge({
  status,
}: {
  status: LessonStatus;
}) {
  const classes: Record<LessonStatus, string> = {
    complete:
      "border-green-700 bg-green-50 text-green-900",
    next:
      "border-amber-700 bg-amber-50 text-amber-950",
    upcoming:
      "border-gray-400 bg-white text-black",
  };

  const labels: Record<LessonStatus, string> = {
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
  const completedCount = lessons.filter(
    (lesson) => lesson.status === "complete",
  ).length;

  const totalLessons = lessons.length;

  const nextLesson = lessons.find(
    (lesson) => lesson.status === "next",
  );

  return (
    <section>
      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <div className="mb-10 border-b border-gray-300 pb-8">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Developer Lab
        </p>

        <h1 className="text-4xl font-bold">
          Table of Contents
        </h1>

        <p className="mt-4 max-w-4xl">
          This lab assumes working knowledge of HTML, CSS,
          and JavaScript. The lessons concentrate specifically
          on how Quickbase applications, tables, fields,
          records, APIs, authentication, client-side data,
          and relationships are represented and manipulated
          in code.
        </p>
      </div>

      {/* ======================================================
          CURRENT PROGRESS
      ====================================================== */}

      <div className="mb-10 rounded-lg border border-gray-300 bg-[#f7f8fa] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#1f5c99]">
              Lab Progress
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              {completedCount} of {totalLessons} lessons complete
            </h2>

            {nextLesson && (
              <p className="mt-2">
                Next: Lesson{" "}
                <strong>{nextLesson.number}</strong> —{" "}
                {nextLesson.title}
              </p>
            )}
          </div>

          <div className="min-w-32 text-left sm:text-right">
            <span className="text-3xl font-bold text-[#1f5c99]">
              {Math.round(
                (completedCount / totalLessons) * 100,
              )}
              %
            </span>

            <p className="text-sm font-semibold">
              Complete
            </p>
          </div>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full border border-gray-300 bg-white">
          <div
            className="h-full bg-[#216e39] transition-all"
            style={{
              width: `${
                (completedCount / totalLessons) * 100
              }%`,
            }}
          />
        </div>
      </div>

      {/* ======================================================
          LEARNING METHOD
      ====================================================== */}

      <div className="mb-10 rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6">
        <h2 className="text-2xl font-bold">
          Learning Method
        </h2>

        <p className="mt-3">
          Each lesson introduces one new Quickbase
          development concept. Previous working examples
          remain intact so that new behavior can be compared
          directly with earlier lessons.
        </p>

        <p className="mt-3">
          The objective is not merely to make code execute.
          The objective is to understand exactly which
          Quickbase object each value references, how the
          returned data is represented, and what JavaScript
          can do with that data after Quickbase supplies it.
        </p>
      </div>

      {/* ======================================================
          LESSON CARDS
      ====================================================== */}

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

                <h2 className="mt-1 text-2xl font-bold">
                  {lesson.title}
                </h2>
              </div>

              <StatusBadge
                status={lesson.status}
              />
            </div>

            <p className="mt-4">
              {lesson.description}
            </p>

            {lesson.workingExample && (
              <div className="mt-5 border-t border-gray-200 pt-4">
                <strong>Working example:</strong>{" "}
                <code className="rounded bg-[#f7f8fa] px-2 py-1">
                  {lesson.workingExample}
                </code>
              </div>
            )}

            {lesson.nextObjective && (
              <div className="mt-5 border-t border-gray-200 pt-4">
                <strong>Next objective:</strong>{" "}
                {lesson.nextObjective}
              </div>
            )}

            {(lesson.status === "complete" ||
              lesson.status === "next") && (
              <div className="mt-5">
                <Link
                  href={lesson.link}
                  className="inline-flex rounded-md bg-[#1f5c99] px-4 py-2 font-bold text-white hover:bg-[#164875]"
                >
                  Open Lesson {lesson.number} →
                </Link>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}