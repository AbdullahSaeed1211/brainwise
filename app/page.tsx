import { HeroSection } from "@/components/home/hero-section";
import { StatsBar } from "@/components/home/stats-bar";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { FeaturesSection } from "@/components/home/features-section";
import { ToolsShowcase } from "@/components/home/tools-showcase";
import { FaqSection } from "@/components/home/faq-section";
import { CtaSection } from "@/components/home/cta-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brainwise: Brain Health & Cognitive Training Platform",
  description: "Improve your brain health, assess stroke risk, and enhance cognitive abilities with science-backed tools and training games.",
  keywords: "brain health, cognitive training, stroke prediction, alzheimer's risk, memory games, brain exercises",
  openGraph: {
    title: "Brainwise: Brain Health & Cognitive Training Platform",
    description: "Improve your brain health, assess stroke risk, and enhance cognitive abilities with science-backed tools and training games.",
    url: "https://brainwise.vercel.app",
    type: "website",
    images: [
      {
        url: "/images/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Brainwise Brain Health Platform"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Brainwise: Brain Health & Cognitive Training Platform",
    description: "Improve your brain health, assess stroke risk, and enhance cognitive abilities with science-backed tools and training games.",
    images: ["/images/og-home.jpg"]
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function Home() {
  return (
    <main className="flex flex-col w-full overflow-hidden">
      <HeroSection />
      <StatsBar />
      <TestimonialsSection />
      <FeaturesSection />
      <ToolsShowcase />
      <FaqSection />
      <CtaSection />
    </main>
  );
}
