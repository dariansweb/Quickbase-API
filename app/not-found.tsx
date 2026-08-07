import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f8fa] px-6 text-black">
      <div className="w-full max-w-3xl">
        <div className="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-lg">
          <div className="bg-[#1f5c99] px-6 py-4 text-white">
            <p className="font-bold uppercase tracking-wide">
              Quickbase Code Pages Developer Lab
            </p>
          </div>

          <div className="p-8 text-center md:p-12">
            <div className="text-7xl font-black text-[#1f5c99]">404</div>

            <h1 className="mt-5 text-3xl font-bold">
              Whoa there, Quickbase Developer!
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-xl">
              That page doesn&apos;t exist.
            </p>

            <div className="mx-auto mt-8 max-w-xl rounded-lg border-2 border-amber-600 bg-amber-50 p-6">
              <p className="text-2xl font-bold">
                Hey! I ain&apos;t to that lesson yet!
              </p>

              <p className="mt-3">
                Settle down! We&apos;re learning this stuff
                <strong> one Quickbase concept at a time.</strong>
              </p>
            </div>

            <div className="mx-auto mt-8 max-w-xl rounded-lg border border-gray-300 bg-[#f7f8fa] p-5 text-left">
              <p className="font-mono text-base">
                <strong>Quickbase Error:</strong>
                <br />
                Lesson_Not_Built_Yet
              </p>

              <p className="mt-4 font-mono text-base">
                errcode: 404
                <br />
                errtext: Developer got ahead of instructor
                <br />
                errdetail: Patience, grasshopper.
              </p>
            </div>

            <p className="mt-8">
              The requested lesson may be on the roadmap, but the code
              hasn&apos;t been written yet. No amount of refreshing is going to
              make me type faster. 😆
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/lessons"
                className="rounded-md bg-[#1f5c99] px-6 py-3 font-bold text-white hover:bg-[#164875]"
              >
                ← Back to the Lessons
              </Link>

              <Link
                href="/"
                className="rounded-md border-2 border-[#1f5c99] px-6 py-3 font-bold text-[#1f5c99] hover:bg-[#eaf3fb]"
              >
                Developer Lab Home
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-300 bg-[#f7f8fa] px-6 py-4 text-center text-base">
            <strong>Developer Tip:</strong> If the lesson says
            &quot;Upcoming,&quot; perhaps don&apos;t click it. 😂
          </div>
        </div>
      </div>
    </main>
  );
}
