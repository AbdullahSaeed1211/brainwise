import { HealthMetricTracker } from "@/components/health-metric-tracker";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Health Metrics | BrainWise",
  description: "Track your health metrics and see how they correlate with your cognitive progress",
};

export default function HealthMetricsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Health Metrics</h1>
        <p className="text-muted-foreground">
          Track important health indicators that may influence your cognitive recovery
        </p>
      </div>
      
      <HealthMetricTracker />
    </div>
  );
} 