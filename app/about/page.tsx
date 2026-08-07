import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "About the Quickbase Code Pages Developer Lab, an independent personal training and learning project.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <header className="border-b border-gray-300 bg-[#1f5c99] text-white">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <p className="mb-2 text-base font-bold uppercase tracking-wide">
            Quickbase Code Pages Developer Lab
          </p>

          <h1 className="text-3xl font-bold md:text-4xl">About This Project</h1>

          <p className="mt-3 max-w-3xl text-lg text-white">
            A personal developer notebook, training laboratory, and growing
            record of what I am learning about Quickbase development.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <section className="mb-10">
          <h2 className="text-3xl font-bold">Why This Project Exists</h2>

          <p className="mt-4">
            The Quickbase Code Pages Developer Lab is a personal learning
            project I created to improve my own understanding of Quickbase
            application development.
          </p>

          <p className="mt-4">
            I am using the project as a structured record of the lessons,
            experiments, mistakes, discoveries, and working examples I encounter
            while learning Quickbase Code Pages and its APIs.
          </p>

          <p className="mt-4">
            Rather than keeping scattered notes, I decided to build the lessons
            into a small developer training site so I can return to them later,
            compare different approaches, and progressively build upon what I
            have already learned.
          </p>
        </section>

        <section className="mb-10 rounded-lg border-2 border-[#1f5c99] bg-[#eaf3fb] p-6">
          <h2 className="text-2xl font-bold">
            This Is Not an Official Quickbase Project
          </h2>

          <p className="mt-4">
            This website, its source code, tutorials, examples, commentary, and
            associated GitHub repository are independently created materials.
          </p>

          <p className="mt-4 font-bold">
            I am not affiliated with, employed by, sponsored by, endorsed by, or
            representing Quickbase, Inc.
          </p>

          <p className="mt-4">
            Nothing published here should be interpreted as an official
            Quickbase tutorial, official Quickbase documentation, official
            technical guidance, or a statement made on behalf of Quickbase.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-3xl font-bold">
            A Learning Log, Not an Authority
          </h2>

          <p className="mt-4">
            The material reflects my understanding at the point in time when a
            lesson is written.
          </p>

          <p className="mt-4">
            As I continue learning, I may discover that an explanation can be
            improved, that an implementation has a better alternative, or that a
            previous assumption was incomplete. When that happens, the tutorial
            may be revised.
          </p>

          <p className="mt-4">
            That evolution is intentional. This project is designed to preserve
            the learning process rather than pretend that every first attempt
            represents the definitive way to develop with Quickbase.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-3xl font-bold">
            Official Documentation Comes First
          </h2>

          <p className="mt-4">
            Anyone using these examples should independently verify API
            behavior, authentication requirements, supported features, security
            guidance, limits, and current product behavior against official
            Quickbase documentation.
          </p>

          <p className="mt-4">
            Quickbase can change its APIs, documentation, platform behavior, or
            recommended development practices over time. Material in this
            project can therefore become incomplete or outdated.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-3xl font-bold">Example Code and Security</h2>

          <p className="mt-4">
            Code in this project exists primarily for education and
            experimentation. It should not automatically be treated as
            production-ready code.
          </p>

          <p className="mt-4">
            Examples may intentionally favor clarity and visibility of Quickbase
            behavior over abstraction or production architecture.
          </p>

          <p className="mt-4">
            Credentials, User Tokens, private application information, and other
            sensitive values should never be copied into public source code.
            Training examples use placeholders where appropriate.
          </p>

          <pre className="mt-5 overflow-x-auto rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-base">
            <code>{`const APP_TOKEN = "YOUR_APPLICATION_TOKEN";
const TABLE_DBID = "YOUR_TABLE_DBID";`}</code>
          </pre>

          <p className="mt-4">
            Anyone adapting an example is responsible for reviewing the security
            implications of their own implementation and Quickbase environment.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-3xl font-bold">No Warranty</h2>

          <p className="mt-4">
            The project and its examples are provided for educational purposes
            on an &quot;as is&quot; basis without warranties or guarantees of
            correctness, completeness, fitness for a particular purpose, or
            continued compatibility with Quickbase.
          </p>

          <p className="mt-4">
            Anyone choosing to use or adapt the code is responsible for testing
            it within their own environment before relying upon it.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-3xl font-bold">Quickbase Names and Trademarks</h2>

          <p className="mt-4">
            The name Quickbase and other Quickbase product names, terminology,
            trademarks, and related intellectual property belong to their
            respective owners.
          </p>

          <p className="mt-4">
            Their use within this project is solely for identifying the platform
            and technologies being studied and discussed.
          </p>
        </section>

        <section className="mb-10 rounded-lg border border-gray-300 bg-[#f7f8fa] p-6">
          <h2 className="text-2xl font-bold">Why Make the Project Public?</h2>

          <p className="mt-4">
            Although this began as a personal training notebook, making the
            project public provides an opportunity for other developers to
            follow along, point out mistakes, suggest better approaches, and
            contribute improvements.
          </p>

          <p className="mt-4">
            Corrections and constructive contributions are welcome. The purpose
            remains the same: understand Quickbase development better by
            building real examples and documenting what was learned along the
            way.
          </p>

          <div className="mt-6">
            <a
              href="https://github.com/dariansweb/Quickbase-API"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-md bg-[#1f5c99] px-5 py-3 font-bold text-white hover:bg-[#164875]"
            >
              View the Project on GitHub →
            </a>
          </div>
        </section>

        <section className="mb-10 rounded-lg border-2 border-amber-700 bg-amber-50 p-6">
          <h2 className="text-2xl font-bold">In Short</h2>

          <p className="mt-4">I&apos;m learning Quickbase development.</p>

          <p className="mt-3">I&apos;m documenting what I learn.</p>

          <p className="mt-3">
            I&apos;m sharing the work publicly in case it helps someone else or
            someone more experienced can help improve it.
          </p>

          <p className="mt-3 font-bold">
            That&apos;s it. No secret corporate alliance, no official
            curriculum, and definitely no Quickbase executives hiding behind the
            curtains. 😄
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
            href="/get-started"
            className="inline-flex rounded-md bg-[#1f5c99] px-5 py-3 font-bold text-white hover:bg-[#164875]"
          >
            Get Started →
          </Link>
        </div>
      </div>
    </main>
  );
}
