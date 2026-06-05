import type { Metadata } from "next";
import { Poppins, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400"],
});

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${sourceSerif.variable}`}>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
