// Server component for Tools page
import type { Metadata } from "next";
import ToolsClient from "./tools-client";

export const metadata: Metadata = {
  title: "Brain Training Tools | Brainwise",
  description: "Enhance your cognitive abilities with our specialized brain training tools and exercises",
};

export default function ToolsPage() {
  return <ToolsClient />;
}