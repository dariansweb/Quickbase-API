import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quickbase Code Pages Developer Lab",
  description:
    "Interactive developer training for Quickbase Code Pages, APIs, JavaScript, and CRUD development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}