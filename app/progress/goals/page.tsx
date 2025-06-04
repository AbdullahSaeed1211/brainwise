import { Metadata } from "next";
import GoalsClient from "./goals-client";

export const metadata: Metadata = {
  title: "Goals & Milestones | Cognitive Progress Tracking",
  description: "Set and track personalized goals for your cognitive wellness journey",
};

export default function GoalsPage() {
  return <GoalsClient />;
} 