import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Patchwork — Changelog Generator",
  description:
    "Auto-generate beautiful changelogs from your GitHub commits. Public pages and embeddable widget included.",
  openGraph: {
    title: "Patchwork",
    description: "Auto-generate changelogs from GitHub commits.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
