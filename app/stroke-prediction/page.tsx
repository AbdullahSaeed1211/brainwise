import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Stroke Risk Assessment | Brainwise",
  description: "Evaluate your stroke risk based on health factors and get personalized recommendations to reduce your risk.",
  keywords: "stroke risk, stroke prediction, brain health, stroke assessment, stroke prevention, risk factors",
  openGraph: {
    title: "Stroke Risk Assessment | Brainwise",
    description: "Evaluate your stroke risk based on health factors and get personalized recommendations to reduce your risk.",
    url: "https://brainwise-sigma.vercel.app/stroke-prediction",
    type: "website",
    images: [
      {
        url: "/images/og-stroke-prediction.jpg",
        width: 1200,
        height: 630,
        alt: "Brainwise Stroke Risk Assessment"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Stroke Risk Assessment | Brainwise",
    description: "Evaluate your stroke risk based on health factors and get personalized recommendations to reduce your risk.",
    images: ["/images/og-stroke-prediction.jpg"]
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function StrokePredictionPage() {
  // Redirect to the new predictor page
  redirect("/predictors/stroke");
} 