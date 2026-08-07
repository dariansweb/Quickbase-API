import Link from "next/link";

const lessonLinks = [
  {
    number: "1A",
    title: "Read Records with XML API",
    href: "/lessons/1a",
    status: "complete",
  },
  {
    number: "1B",
    title: "Read Records with REST API",
    href: "/lessons/1b",
    status: "next",
  },
  {
    number: "2",
    title: "Client-Side Sorting",
    href: "/lessons/2",
    status: "upcoming",
  },
  {
    number: "3",
    title: "Client-Side Searching",
    href: "/lessons/3",
    status: "upcoming",
  },
  {
    number: "4",
    title: "Client-Side Filtering",
    href: "/lessons/4",
    status: "upcoming",
  },
  {
    number: "5",
    title: "Add Records",
    href: "/lessons/5",
    status: "upcoming",
  },
  {
    number: "6",
    title: "Edit Records",
    href: "/lessons/6",
    status: "upcoming",
  },
  {
    number: "7",
    title: "Delete Records",
    href: "/lessons/7",
    status: "upcoming",
  },
  {
    number: "8",
    title: "Pagination",
    href: "/lessons/8",
    status: "upcoming",
  },
  {
    number: "9",
    title: "Relationships",
    href: "/lessons/9",
    status: "upcoming",
  },
  {
    number: "10",
    title: "Reusable JavaScript Library",
    href: "/lessons/10",
    status: "upcoming",
  },
];

export default function LessonsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-white text-black">
      <header className="border-b border-gray-300 bg-[#1f5c99] text-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <Link
            href="/"
            className="text-base font-bold uppercase tracking-wide"
          >
            Quickbase Tutorials
          </Link>

          <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Code Pages Developer Lab</h1>

              <p className="mt-2 text-lg text-white">
                Quickbase API development from working code.
              </p>
            </div>

            <Link
              href="/lessons"
              className="inline-flex w-fit rounded-md border border-white px-4 py-2 font-bold hover:bg-white hover:text-[#1f5c99]"
            >
              Table of Contents
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[290px_1fr]">
        <aside>
          <div className="sticky top-6 rounded-lg border border-gray-300 bg-[#f7f8fa] p-5">
            <h2 className="mb-4 text-xl font-bold">Lessons</h2>

            <nav aria-label="Quickbase lessons">
              <ul className="space-y-2">
                {lessonLinks.map((lesson) => (
                  <li key={lesson.number}>
                    <Link
                      href={lesson.href}
                      className="block rounded-md border border-transparent px-3 py-3 hover:border-gray-300 hover:bg-white"
                    >
                      <div className="flex items-start gap-3">
                        <span className="min-w-10 font-bold text-[#1f5c99]">
                          {lesson.number}
                        </span>

                        <div>
                          <div className="font-semibold">{lesson.title}</div>

                          <div className="mt-1 text-sm font-bold">
                            {lesson.status === "complete" && (
                              <span className="text-green-800">Complete</span>
                            )}

                            {lesson.status === "next" && (
                              <span className="text-amber-800">
                                Next Lesson
                              </span>
                            )}

                            {lesson.status === "upcoming" && (
                              <span className="text-black">Upcoming</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>

      <footer className="border-t border-gray-300 bg-[#f7f8fa]">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <p className="font-semibold">Quickbase Code Pages Developer Lab</p>

          <p className="mt-1 text-base">One Quickbase concept per lesson.</p>
        </div>
      </footer>
    </div>
  );
}
