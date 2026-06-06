import type { Metadata } from "next";
import { Poppins, Instrument_Serif } from "next/font/google";
import { CustomCursor } from "@/components/CustomCursor";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: "400",
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
    <html lang="en" className={`${poppins.variable} ${instrumentSerif.variable}`}>
      <body style={{ margin: 0 }}>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
