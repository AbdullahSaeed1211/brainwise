import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brain Health Dashboard | Brainwise",
  description: "Track your brain health metrics, view cognitive scores, and get personalized training recommendations.",
  robots: {
    index: false,  // Don't index the dashboard as it contains personal data
    follow: true
  }
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 