import Link from "next/link";

import { lessons } from "../data/lessons";

export default function LessonsPage() {
  return (
    <section>
      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <div className="mb-10 border-b border-gray-300 pb-8">
        <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
          Developer Curriculum
        </p>

        <h1 className="text-4xl font-extrabold sm:text-5xl">
          Lessons
        </h1>

        <p className="mt-4 max-w-4xl text-lg leading-8">
          This curriculum assumes working knowledge of HTML, CSS, and
          JavaScript. The lessons concentrate specifically on how Quickbase
          applications, tables, fields, records, APIs, authentication,
          client-side data, and relationships are represented and manipulated
          in code.
        </p>

        <p className="mt-4 max-w-4xl leading-8">
          You can follow the lessons in order as a complete learning path, or
          open an individual lesson when you need a focused Quickbase API
          reference.
        </p>
      </div>

      {/* ======================================================
          LEARNING METHOD
      ====================================================== */}

      <div className="mb-12 rounded-xl border-2 border-[#1f5c99] bg-[#eaf3fb] p-6 sm:p-8">
        <p className="font-bold uppercase tracking-wide text-[#1f5c99]">
          How the curriculum works
        </p>

        <h2 className="mt-1 text-2xl font-bold">
          One Quickbase concept at a time
        </h2>

        <p className="mt-4 max-w-4xl leading-8">
          Each lesson begins with a working example and introduces one new
          Quickbase development concept. Earlier examples remain intact so you
          can compare the code from lesson to lesson and see exactly what
          changed.
        </p>

        <p className="mt-3 max-w-4xl leading-8">
          The objective is not merely to make code execute. The objective is to
          understand which Quickbase object each value references, how requests
          are constructed, how returned data is represented, and what
          JavaScript can do with that data after Quickbase supplies it.
        </p>

        <div className="mt-6">
          <Link
            href="/get-started"
            className="inline-flex rounded-md bg-[#1f5c99] px-5 py-3 font-bold text-white transition hover:bg-[#164875]"
          >
            Prepare the Tutorial App →
          </Link>
        </div>
      </div>

      {/* ======================================================
          LESSON DIRECTORY
      ====================================================== */}

      <div className="mb-6">
        <p className="font-bold uppercase tracking-wide text-[#1f5c99]">
          Course Directory
        </p>

        <h2 className="mt-1 text-3xl font-bold">
          Quickbase API Learning Path
        </h2>

        <p className="mt-3 max-w-4xl">
          Select any lesson below to open the complete tutorial.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {lessons.map((lesson) => (
          <Link
            key={lesson.number}
            href={lesson.link}
            className="group flex h-full flex-col rounded-xl border border-gray-300 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#1f5c99] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#1f5c99] focus:ring-offset-2"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-14 min-w-14 items-center justify-center rounded-lg bg-[#1f5c99] px-3 text-lg font-extrabold text-white">
                {lesson.number}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-bold uppercase tracking-wide text-[#1f5c99]">
                  Lesson {lesson.number}
                </p>

                <h3 className="mt-1 text-2xl font-bold leading-tight group-hover:text-[#1f5c99]">
                  {lesson.title}
                </h3>
              </div>
            </div>

            <p className="mt-5 flex-1 leading-7">
              {lesson.description}
            </p>

            {lesson.workingExample && (
              <div className="mt-5 border-t border-gray-200 pt-4">
                <p className="text-sm font-bold uppercase tracking-wide text-gray-600">
                  Working Example
                </p>

                <code className="mt-2 inline-block break-all rounded bg-[#f7f8fa] px-2 py-1 text-sm">
                  {lesson.workingExample}
                </code>
              </div>
            )}

            <div className="mt-6 border-t border-gray-200 pt-4 font-bold text-[#1f5c99]">
              Open tutorial
              <span
                aria-hidden="true"
                className="ml-2 inline-block transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
