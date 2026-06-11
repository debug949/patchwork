import type { Metadata } from "next";
import { DemoClient } from "@/components/DemoClient";

export const metadata: Metadata = {
  title: "Live Demo — Patchwork",
  description: "Try Patchwork without signing in. See AI-generated changelogs from real GitHub repos.",
};

export default function DemoPage() {
  return <DemoClient />;
}
