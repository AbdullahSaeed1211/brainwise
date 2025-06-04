import React from "react";
import { Metadata } from "next";
import { TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { ExportButton } from "@/components/export-button";

export const metadata: Metadata = {
  title: "Progress Tracker | Brainwise",
  description: "Track your cognitive performance over time with detailed insights and performance metrics.",
  keywords: "cognitive tracking, brain health progress, performance metrics, cognitive testing results",
};

export default function ProgressTrackerPage() {
  // Sample data for export (empty array since we don't have real data yet)
  const sampleData: { [key: string]: string | number | boolean | null | undefined }[] = [];
  
  // Check if data exists
  const hasData = sampleData.length > 0;
  
  return (
    <div className="container py-8 px-4 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Progress Tracker
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-3xl">
            Track your cognitive performance over time, identify trends, and monitor improvement across different cognitive domains.
          </p>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Time Range:</span>
            <Select defaultValue="3m">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="1m">Last month</SelectItem>
                <SelectItem value="3m">Last 3 months</SelectItem>
                <SelectItem value="6m">Last 6 months</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ExportButton 
            data={sampleData} 
            filename="cognitive-progress" 
            label="Export Data"
          />
        </div>

        {!hasData ? (
          <Card className="flex flex-col items-center justify-center p-6 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <TrendingUp className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No Progress Data Yet</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Complete cognitive assessments and track health metrics to visualize your progress here. Regular tracking provides valuable insights into your brain health journey.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild>
                <Link href="/tools/cognitive-assessment">
                  Take Cognitive Assessment
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/health-metrics">
                  Add Health Metrics
                </Link>
              </Button>
            </div>
          </Card>
        ) : (
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="memory">Memory</TabsTrigger>
              <TabsTrigger value="attention">Attention</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-6">
              {/* Content would render real data when available */}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
} 