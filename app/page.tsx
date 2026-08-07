import Link from "next/link";

import { lessons, type LessonStatus } from "./data/lessons";

function StatusBadge({ status }: { status: LessonStatus }) {
  const styles: Record<LessonStatus, string> = {
    complete: "border-green-700 bg-green-50 text-green-900",
    next: "border-amber-700 bg-amber-50 text-amber-950",
    upcoming: "border-gray-400 bg-white text-black",
  };

  const labels: Record<LessonStatus, string> = {
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
  /*
   * ------------------------------------------------------------
   * DERIVED CURRICULUM DATA
   * ------------------------------------------------------------
   *
   * Nothing below is manually maintained.
   *
   * The page calculates its current state from lessons.ts.
   */

  const completedLessons = lessons.filter(
    (lesson) => lesson.status === "complete",
  );

  const completedCount = completedLessons.length;

  const totalLessons = lessons.length;

  const progressPercent =
    totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  const nextLesson = lessons.find((lesson) => lesson.status === "next");

  const mostRecentCompletedLesson = completedLessons.at(-1);

  return (
    <main className="min-h-screen bg-white text-black">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="border-b border-gray-300 bg-[#1f5c99] text-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
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

              <p className="mt-4 max-w-4xl text-base text-white">
                This lab is being built in public. Browse the source, follow the
                lessons, open an issue, or help improve an example.
                Contributions are very welcome. ❤️
              </p>
            </div>

            <a
              href="https://github.com/dariansweb/Quickbase-API"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center rounded-md border-2 border-white px-5 py-3 font-bold text-white transition hover:bg-white hover:text-[#1f5c99]"
            >
              View on GitHub →
            </a>
          </div>
        </div>
      </header>

      {/* ======================================================
          MAIN CONTENT GRID
      ====================================================== */}

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[280px_1fr]">
        {/* ====================================================
            SIDEBAR
        ==================================================== */}

        <aside>
          <div className="sticky top-6 rounded-lg border border-gray-300 bg-[#f7f8fa] p-5">
            <h2 className="mb-4 text-xl font-bold">Lab Progress</h2>

            {/* -----------------------------------------------
                AUTOMATIC PROGRESS
            ----------------------------------------------- */}

            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between text-base">
                <span>Lessons Completed</span>

                <strong>
                  {completedCount} / {totalLessons}
                </strong>
              </div>

              <div className="h-3 overflow-hidden rounded-full border border-gray-300 bg-white">
                <div
                  className="h-full bg-[#216e39] transition-all"
                  style={{
                    width: `${progressPercent}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-sm font-semibold">
                {progressPercent.toFixed(0)}% complete
              </p>
            </div>

            {/* -----------------------------------------------
                LESSON NAVIGATION
            ----------------------------------------------- */}

            <nav aria-label="Developer Lab lessons">
              <ul className="space-y-2">
                {lessons.map((lesson) => (
                  <li key={lesson.number}>
                    <a
                      href={`#lesson-${lesson.number.toLowerCase()}`}
                      className="block rounded-md border border-transparent px-3 py-2 text-base font-semibold hover:border-gray-300 hover:bg-white"
                    >
                      <span className="mr-2 font-bold text-[#1f5c99]">
                        {lesson.number}
                      </span>

                      {lesson.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-6 border-t border-gray-300 pt-5">
              <Link
                href="/lessons"
                className="inline-flex w-full justify-center rounded-md border-2 border-[#1f5c99] px-4 py-2 font-bold text-[#1f5c99] hover:bg-[#eaf3fb]"
              >
                Full Table of Contents
              </Link>
            </div>
          </div>
        </aside>

        {/* ====================================================
            ROADMAP
        ==================================================== */}

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

          {/* ==================================================
              CURRENT POSITION

              This section also derives itself from lessons.ts.
          ================================================== */}

          <div className="mb-10 rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6">
            <h2 className="text-2xl font-bold">Current Position</h2>

            {mostRecentCompletedLesson && (
              <p className="mt-3">
                Lesson <strong>{mostRecentCompletedLesson.number}</strong> is
                complete: <strong>{mostRecentCompletedLesson.title}</strong>.
                {mostRecentCompletedLesson.workingExample && (
                  <>
                    {" "}
                    The working example is{" "}
                    <code className="mx-1 rounded border border-gray-300 bg-white px-2 py-1">
                      {mostRecentCompletedLesson.workingExample}
                    </code>
                    .
                  </>
                )}
              </p>
            )}

            {nextLesson ? (
              <p className="mt-3">
                Next is Lesson <strong>{nextLesson.number}</strong>:{" "}
                <strong>{nextLesson.title}</strong>.
                {nextLesson.nextObjective && <> {nextLesson.nextObjective}</>}
              </p>
            ) : (
              <p className="mt-3">
                All currently defined lessons are complete.
              </p>
            )}
          </div>

          {/* ==================================================
              LESSON CARDS

              Every card comes from lessons.ts.
          ================================================== */}

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

                {/* -------------------------------------------
                    OPTIONAL WORKING EXAMPLE
                ------------------------------------------- */}

                {lesson.workingExample && (
                  <div className="mt-5 border-t border-gray-200 pt-4">
                    <strong>Working example:</strong>{" "}
                    <code className="rounded bg-[#f7f8fa] px-2 py-1">
                      {lesson.workingExample}
                    </code>
                  </div>
                )}

                {/* -------------------------------------------
                    OPTIONAL NEXT OBJECTIVE
                ------------------------------------------- */}

                {lesson.nextObjective && (
                  <div className="mt-5 border-t border-gray-200 pt-4">
                    <strong>Next objective:</strong> {lesson.nextObjective}
                  </div>
                )}

                {/* -------------------------------------------
                    LESSON LINK
                ------------------------------------------- */}

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

      {/* ======================================================
          FOOTER
      ====================================================== */}

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
