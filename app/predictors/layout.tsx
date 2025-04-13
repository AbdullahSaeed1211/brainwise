import { Metadata } from "next";

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
      <div className="container flex-1 py-8 md:py-10">
        {children}
      </div>
    </div>
  );
} 