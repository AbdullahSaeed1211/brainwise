// This is a server component that exports metadata
import type { Metadata } from "next";
import DashboardClient from "./dashboard-client";

export async function generateMetadata(): Promise<Metadata> {
  return {
  title: "Brain Health Dashboard | Brainwise",
  description: "Track your brain health metrics, view cognitive scores, and get personalized training recommendations.",
  robots: {
      index: true,
      follow: true,
    },
  };
}

export default function DashboardPage() {
  return <DashboardClient />;
} 