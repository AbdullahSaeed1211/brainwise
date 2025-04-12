import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mental Math Challenge | Brain Training",
  description: "Enhance cognitive processing with mental math exercises for improved processing speed and working memory",
};

export default function MentalMathLayout({ children }: { children: React.ReactNode }) {
  return children;
} 