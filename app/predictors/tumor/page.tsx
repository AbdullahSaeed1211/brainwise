// Server component for Brain Tumor Detection page
import type { Metadata } from "next";
import BrainTumorDetectionClient from "./tumor-client";

export const metadata: Metadata = {
  title: "Brain Tumor Detection | Brainwise",
  description: "Upload brain MRI scans to detect potential tumors using our advanced AI model",
};

export default function BrainTumorDetectionPage() {
  return <BrainTumorDetectionClient />;
} 