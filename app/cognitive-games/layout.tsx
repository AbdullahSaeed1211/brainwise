import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cognitive Games | Brain AI",
  description: "Exercise your brain with cognitive games designed to train different domains",
};

export default function CognitiveGamesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="flex min-h-screen flex-col">
      {children}
    </section>
  );
} 