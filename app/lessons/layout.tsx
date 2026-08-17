import Link from "next/link";

export default function LessonsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* ======================================================
          LESSONS HEADER
      ====================================================== */}

      <header className="border-b border-gray-300 bg-[#1f5c99] text-white">
        <div className="mx-auto max-w-7xl px-6 py-7">
          <Link
            href="/"
            className="text-sm font-bold uppercase tracking-[0.18em] text-white/80 hover:text-white"
          >
            Quickbase Tutorials
          </Link>

          <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold sm:text-4xl">
                Code Pages Developer Lab
              </h1>

              <p className="mt-2 max-w-3xl text-base leading-7 text-white/90 sm:text-lg">
                A hands-on Quickbase API curriculum built from working Code Page
                examples.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/lessons"
                className="inline-flex rounded-md bg-white px-4 py-2 font-bold text-[#1f5c99] transition hover:bg-[#eef6fd]"
              >
                All Lessons
              </Link>

              <Link
                href="/get-started"
                className="inline-flex rounded-md border border-white/80 px-4 py-2 font-bold text-white transition hover:bg-white/10"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ======================================================
          CURRENT LESSON / LESSON INDEX
      ====================================================== */}

      <main className="mx-auto min-h-[60vh] w-full max-w-6xl px-6 py-10 sm:py-12">
        {children}
      </main>

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
    </div>
  );
}
