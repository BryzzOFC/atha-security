import type { Metadata } from "next";
import OpsConsole from "@/components/agents/OpsConsole";

export const metadata: Metadata = {
  title: "ATHA — Agent Ops Console",
  description:
    "Live operations console for the ATHA Security OS agent system: real scans, real workflows, real evidence.",
  robots: { index: false, follow: false },
};

export default function OpsPage() {
  return (
    <main className="min-h-screen bg-black">
      <OpsConsole />
    </main>
  );
}
