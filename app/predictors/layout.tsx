import { Metadata } from "next";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Brain Health Predictors",
  description: "Advanced AI-powered predictors for brain health conditions",
};

export default function PredictorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        heading="Brain Health Predictors"
        subheading="Advanced AI models to predict and detect brain health conditions"
      />
      <div className="container flex-1 py-8 md:py-10">
        {children}
      </div>
    </div>
  );
} 