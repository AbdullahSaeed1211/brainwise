import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mental Math Challenge | Brain AI",
  description: "Improve your cognitive abilities with our Mental Math Challenge. Test your arithmetic skills with timed math problems.",
  keywords: ["mental math", "brain training", "math challenge", "cognitive exercise", "mental calculation"],
};

export default function MentalMathLayout({ children }: { children: React.ReactNode }) {
  return children;
} 