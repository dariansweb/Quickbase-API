import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f8fa] px-6 py-16 text-black">
      {/* ======================================================
          BACKGROUND DECORATION
      ====================================================== */}
 
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#1f5c99]/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-cyan-300/15 blur-3xl" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(31,92,153,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(31,92,153,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#1f5c99]/40 to-transparent" />
      </div>

      {/* ======================================================
          ERROR CARD
      ====================================================== */}

      <div className="relative w-full max-w-5xl">
        <div className="overflow-hidden rounded-3xl border border-gray-300 bg-white/95 shadow-2xl shadow-slate-300/50 backdrop-blur-sm">
          {/* ==================================================
              TOP STATUS BAR
          ================================================== */}

          <div className="flex flex-col gap-4 border-b border-gray-200 bg-[#f7f8fa] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#1f5c99]">
                Quickbase API
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-600">
                Code Pages Developer Lab
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-30" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500" />
              </span>

              <span className="rounded-full border border-amber-500/40 bg-amber-50 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-amber-800">
                Request Failed
              </span>
            </div>
          </div>

          {/* ==================================================
              MAIN CONTENT
          ================================================== */}

          <div className="grid gap-10 px-6 py-10 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-12 lg:py-14">
            {/* -----------------------------------------------
                LEFT — ERROR MESSAGE
            ----------------------------------------------- */}

            <section>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
                HTTP Status
              </p>

              <div className="mt-1 bg-gradient-to-br from-[#164875] via-[#1f5c99] to-cyan-500 bg-clip-text text-[7rem] font-black leading-none tracking-tighter text-transparent sm:text-[9rem]">
                404
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
                Record Not Found.
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-8 text-gray-700">
                The browser submitted a perfectly respectable request.
                Unfortunately, the requested resource appears to have left the
                table without updating its relationship.
              </p>

              <p className="mt-4 max-w-xl leading-7 text-gray-600">
                We checked the URL, questioned the Record ID#, inspected the
                Field IDs, and stared suspiciously at the DBID. Nothing
                confessed.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/lessons"
                  className="group inline-flex items-center justify-center rounded-xl bg-[#1f5c99] px-5 py-3 font-bold text-white shadow-lg shadow-[#1f5c99]/20 transition duration-200 hover:-translate-y-0.5 hover:bg-[#164875] hover:shadow-xl hover:shadow-[#1f5c99]/25 focus:outline-none focus:ring-2 focus:ring-[#1f5c99] focus:ring-offset-2"
                >
                  Browse Lessons
                  <span
                    aria-hidden="true"
                    className="ml-2 transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>

                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-xl border-2 border-[#1f5c99] bg-white px-5 py-3 font-bold text-[#1f5c99] transition duration-200 hover:-translate-y-0.5 hover:bg-[#eaf3fb] focus:outline-none focus:ring-2 focus:ring-[#1f5c99] focus:ring-offset-2"
                >
                  Return Home
                </Link>
              </div>
            </section>

            {/* -----------------------------------------------
                RIGHT — MOCK API CONSOLE
            ----------------------------------------------- */}

            <section className="overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-xl shadow-gray-200/70">
              <div className="flex items-center justify-between border-b border-gray-200 bg-[#f7f8fa] px-5 py-3">
                <div className="flex gap-2" aria-hidden="true">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500" />
                </div>

                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                  response.json
                </p>
              </div>

              <div className="p-5 sm:p-6">
                <div className="mb-5 flex flex-wrap items-center gap-3 font-mono text-sm">
                  <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 font-bold text-emerald-800">
                    GET
                  </span>

                  <span className="break-all text-gray-700">
                    /api/v1/where-did-that-page-go
                  </span>
                </div>

                <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-xl border border-gray-200 bg-[#f7f8fa] p-4 font-mono text-sm leading-7 text-gray-700">
                  <code>
                    <span className="text-gray-500">{"{"}</span>
                    {"\n"}
                    {"  "}
                    <span className="font-semibold text-[#1f5c99]">
                      &quot;message&quot;
                    </span>
                    <span className="text-gray-500">: </span>
                    <span className="text-amber-800">
                      &quot;The requested resource could not be found.&quot;
                    </span>
                    <span className="text-gray-500">,</span>
                    {"\n"}
                    {"  "}
                    <span className="font-semibold text-[#1f5c99]">
                      &quot;code&quot;
                    </span>
                    <span className="text-gray-500">: </span>
                    <span className="font-semibold text-purple-700">404</span>
                    <span className="text-gray-500">,</span>
                    {"\n"}
                    {"  "}
                    <span className="font-semibold text-[#1f5c99]">
                      &quot;description&quot;
                    </span>
                    <span className="text-gray-500">: </span>
                    <span className="text-amber-800">
                      &quot;Even Quickbase can&apos;t find this one.&quot;
                    </span>
                    {"\n"}
                    <span className="text-gray-500">{"}"}</span>
                  </code>
                </pre>

                <div className="mt-6 border-t border-gray-200 pt-5">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">
                    Possible causes
                  </p>

                  <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-600">
                    <li>
                      <span className="mr-2 font-bold text-[#1f5c99]">›</span>
                      The URL is incorrect.
                    </li>

                    <li>
                      <span className="mr-2 font-bold text-[#1f5c99]">›</span>
                      The page moved.
                    </li>

                    <li>
                      <span className="mr-2 font-bold text-[#1f5c99]">›</span>A
                      Record ID# wandered off.
                    </li>

                    <li>
                      <span className="mr-2 font-bold text-[#1f5c99]">›</span>
                      Someone changed a Field ID and didn&apos;t tell anybody.
                    </li>

                    <li>
                      <span className="mr-2 font-bold text-[#1f5c99]">›</span>
                      Quickbase is innocent. Probably.
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>

          {/* ==================================================
              DEVELOPER NOTE
          ================================================== */}

          <div className="border-t border-gray-200 bg-gradient-to-r from-[#eaf3fb] via-cyan-50/60 to-white px-6 py-5 md:px-10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <span className="w-fit rounded-md border border-[#1f5c99]/20 bg-white px-2 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#1f5c99]">
                Developer Note
              </span>

              <p className="text-sm leading-6 text-gray-600 sm:ml-2">
                Unlike a mysterious Field ID 247, this error actually tells you
                what went wrong.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
          No records were harmed while generating this error.
        </p>
      </div>
    </main>
  );
}
