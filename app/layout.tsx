import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://quickbase-api-tan.vercel.app"),

  title: {
    default: "Quickbase Code Pages Developer Lab",
    template: "%s | Quickbase Developer Lab",
  },

  description:
    "A hands-on Quickbase developer training lab for learning Code Pages, the XML API, RESTful JSON API, JavaScript, CRUD operations, relationships, and reusable development techniques.",

  keywords: [
    "Quickbase",
    "Quickbase API",
    "Quickbase REST API",
    "Quickbase JSON API",
    "Quickbase XML API",
    "Quickbase Code Pages",
    "Quickbase Developer",
    "Quickbase Tutorial",
    "JavaScript",
    "TypeScript",
    "REST API",
    "JSON",
  ],

  authors: [
    {
      name: "Darian Ross",
      url: "https://github.com/dariansweb",
    },
  ],

  creator: "Darian Ross",

  openGraph: {
    title: "Quickbase Code Pages Developer Lab",
    description:
      "Learn Quickbase development by building real Code Page and API examples one concept at a time.",
    url: "https://quickbase-api-tan.vercel.app",
    siteName: "Quickbase Code Pages Developer Lab",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Global navigation */}
        <nav className="sticky top-0 z-50 border-b border-gray-300 bg-[#173f67] text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2">
            <Link
              href="/"
              className="text-sm font-bold tracking-wide text-white hover:underline"
            >
              Quickbase Developer Lab
            </Link>

            <div className="flex items-center gap-5 text-sm font-semibold">
              <Link href="/" className="text-white hover:underline">
                Home
              </Link>

              <Link href="/lessons" className="text-white hover:underline">
                Table of Contents
              </Link>
            </div>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}
