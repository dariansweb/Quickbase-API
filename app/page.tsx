import Image from "next/image";
import Link from "next/link";

import { lessons } from "./data/lessons";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      {/* ======================================================
          HEADER
      ====================================================== */}
      <header className="border-b border-gray-300 bg-[#1f5c99] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
          <div className="relative overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute inset-6 rounded-full bg-cyan-300/20 blur-3xl"
            />

            <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
              <div className="max-w-5xl">
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-white/80 sm:text-base">
                  Quickbase Tutorials
                </p>

                <h1 className="max-w-4xl text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
                  Code Pages Developer Lab
                </h1>

                <p className="mt-4 max-w-3xl text-lg leading-8 text-white sm:text-xl">
                  Learn Quickbase development by building real working Code Page
                  examples, one concept at a time.
                </p>

                <p className="mt-4 max-w-4xl text-base leading-7 text-white/90 sm:text-lg">
                  Follow a complete lesson plan from Quickbase table and field
                  references through XML and REST API requests, server-side
                  queries, CRUD operations, pagination, schema discovery, and
                  relationships.
                </p>

                <p className="mt-4 max-w-4xl text-base leading-7 text-white/90">
                  Each tutorial preserves the working example from that stage of
                  the lab so you can follow the progression, inspect the code,
                  and see exactly what changed from one lesson to the next.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link
                    href="/get-started"
                    className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 font-bold text-[#1f5c99] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#eef6fd] hover:shadow-md"
                  >
                    Start the Tutorial →
                  </Link>

                  <Link
                    href="/lessons"
                    className="inline-flex items-center justify-center rounded-lg border-2 border-white px-5 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:bg-white hover:text-[#1f5c99]"
                  >
                    View All Lessons
                  </Link>

                  <a
                    href="https://github.com/dariansweb/Quickbase-API"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-lg border border-white/70 px-5 py-3 font-bold text-white transition hover:border-white hover:bg-white/10"
                  >
                    View on GitHub
                  </a>
                </div>
              </div>

              <div className="order-first flex justify-center lg:order-last lg:justify-end">
                <div className="relative">
                  <div
                    aria-hidden="true"
                    className="absolute inset-6 rounded-full bg-cyan-300/20 blur-3xl"
                  />

                  <Image
                    src="/qbimage.png"
                    alt="Quickbase Developer Training"
                    width={360}
                    height={360}
                    priority
                    className="relative h-auto w-40 rounded-[2rem] shadow-2xl ring-1 ring-white/20 transition duration-300 hover:-translate-y-1 hover:scale-[1.02] sm:w-52 lg:w-80"
                  />

                  <div className="mt-4 text-center">
                    <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white/80 backdrop-blur">
                      Learn • Build • Experiment
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ======================================================
          CURRICULUM INTRODUCTION
      ====================================================== */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="max-w-5xl">
          <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
            Developer Training
          </p>

          <h2 className="text-3xl font-bold sm:text-4xl">
            Quickbase Code Pages Learning Roadmap
          </h2>

          <p className="mt-5 text-lg leading-8">
            The lessons form one continuous curriculum. You begin by identifying
            the Quickbase objects an API request needs, retrieve records through
            both legacy XML and modern REST APIs, and then progressively learn
            how to query, create, update, delete, paginate, and inspect Quickbase
            application structure.
          </p>

          <p className="mt-4 text-lg leading-8">
            The goal is not merely to copy finished code. Each lesson isolates a
            specific Quickbase concept so you can see the request, response, and
            JavaScript behavior that make the example work.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-gray-300 bg-[#f7f8fa] p-6 sm:p-8">
          <p className="font-bold text-[#1f5c99]">The progression of the lab</p>

          <div className="mt-4 grid gap-3 text-base font-semibold sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
              1. Identify Quickbase objects
            </div>
            <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
              2. Retrieve Quickbase records
            </div>
            <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
              3. Understand the response
            </div>
            <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
              4. Control data with JavaScript
            </div>
            <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
              5. Change records through the API
            </div>
            <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
              6. Inspect and build application structure
            </div>
          </div>
          <div className="mt-10 rounded-2xl border-2 border-[#1f5c99] bg-[#eaf3fb] p-6 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8">
            <div>
              <h3 className="text-2xl font-bold">New to the lab?</h3>
              <p className="mt-2 max-w-3xl leading-7">
                Begin by creating the small People table used throughout the
                tutorials and identify the table DBID and Field IDs used by the
                API examples.
              </p>
            </div>

            <Link
              href="/get-started"
              className="mt-5 inline-flex shrink-0 rounded-lg bg-[#1f5c99] px-5 py-3 font-bold text-white transition hover:bg-[#164875] sm:mt-0"
            >
              Get Started →
            </Link>
          </div>

        </div>
      </section>

      {/* ======================================================
          LESSON DIRECTORY

          Each lesson is now a large tutorial entry point rather than
          a progress/status card.
      ====================================================== */}
      <section className="border-t border-gray-200 bg-[#f7f8fa]">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
          <div className="mb-8 max-w-4xl">
            <p className="mb-2 font-bold uppercase tracking-wide text-[#1f5c99]">
              Lesson Plan
            </p>
            <h2 className="text-3xl font-bold sm:text-4xl">Choose a lesson</h2>
            <p className="mt-4 text-lg leading-8 text-gray-700">
              Start at the beginning for the full progression, or open any lesson
              directly as a reference. Every lesson is a self-contained tutorial
              page with its own explanation and working example.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {lessons.map((lesson) => (
              <Link
                key={lesson.number}
                href={lesson.link}
                className="group block h-full rounded-2xl border border-gray-300 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#1f5c99] hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1f5c99]/20"
                aria-label={`Open Lesson ${lesson.number}: ${lesson.title}`}
              >
                <article className="flex h-full flex-col p-6 sm:p-7">
                  <div className="flex items-start gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#1f5c99] text-lg font-extrabold text-white shadow-sm transition group-hover:bg-[#164875]">
                      {lesson.number}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#1f5c99]">
                        Lesson {lesson.number}
                      </p>
                      <h3 className="mt-1 text-2xl font-bold leading-tight text-gray-950 group-hover:text-[#1f5c99]">
                        {lesson.title}
                      </h3>
                    </div>
                  </div>

                  <p className="mt-5 flex-1 leading-7 text-gray-700">
                    {lesson.description}
                  </p>

                  {lesson.workingExample && (
                    <div className="mt-5 rounded-lg border border-gray-200 bg-[#f7f8fa] px-4 py-3 text-sm">
                      <span className="font-bold text-gray-800">
                        Working example:
                      </span>{" "}
                      <code className="break-all text-[#164875]">
                        {lesson.workingExample}
                      </code>
                    </div>
                  )}

                  <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-5">
                    <span className="font-bold text-[#1f5c99]">
                      Open tutorial
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-2xl font-bold text-[#1f5c99] transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>


        </div>
      </section>

      {/* ======================================================
          FOOTER
      ====================================================== */}
      <footer className="border-t border-gray-300 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <p className="font-semibold">Quickbase Code Pages Developer Lab</p>
          <p className="mt-1 text-base">
            Build it. Inspect it. Understand why it works.
          </p>
        </div>
      </footer>
    </main>
  );
}
