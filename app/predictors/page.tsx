import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart, BrainCircuit, Activity } from "lucide-react";

export const metadata: Metadata = {
  title: "Brain Health Predictors",
  description: "Advanced AI-powered predictors for brain health conditions",
};

const predictors = [
  {
    title: "Stroke Risk Predictor",
    description: "Assess your risk of stroke based on health data and lifestyle factors. Our AI model analyzes multiple variables to provide personalized risk assessment.",
    href: "/predictors/stroke",
    icon: <Heart className="h-8 w-8 text-red-500" />,
    color: "bg-red-100 dark:bg-red-950/40",
  },
  {
    title: "Brain Tumor Detection",
    description: "Upload brain MRI images for AI-powered tumor detection. Our model can identify potential tumors with high accuracy to support early diagnosis.",
    href: "/predictors/tumor",
    icon: <BrainCircuit className="h-8 w-8 text-purple-500" />,
    color: "bg-purple-100 dark:bg-purple-950/40",
  },
  {
    title: "Alzheimer's Detection",
    description: "Analyze brain MRI scans for early signs of Alzheimer's disease. Our AI model can detect patterns associated with different stages of Alzheimer's.",
    href: "/predictors/alzheimers",
    icon: <Activity className="h-8 w-8 text-blue-500" />,
    color: "bg-blue-100 dark:bg-blue-950/40",
  },
];

export default function PredictorsPage() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {predictors.map((predictor) => (
          <Card key={predictor.href} className="flex flex-col overflow-hidden">
            <CardHeader className={predictor.color}>
              <div className="flex justify-between items-start">
                {predictor.icon}
              </div>
              <CardTitle className="mt-4">{predictor.title}</CardTitle>
              <CardDescription>{predictor.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-6">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <span className="font-medium">Powered by AI</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-medium">Secure & Private Analysis</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-medium">Instant Results</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button asChild className="w-full">
                <Link href={predictor.href}>Use Predictor</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 