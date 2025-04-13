"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CognitiveScoreCard } from "@/components/cognitive-score-card";
import { DailyChallenge } from "@/components/daily-challenge";
import { Brain, Activity, FileText, Zap, Target, Info, Heart, TrendingUp, History } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import { RecentActivity } from "@/components/recent-activity";

// Define health metrics types
interface HealthMetric {
  _id: string;
  type: string;
  value: string;
  date: string;
}

// Simple component for metric visualization
const MetricCard = ({ 
  title, 
  value, 
  unit, 
  icon, 
  date, 
  change 
}: { 
  title: string; 
  value: string; 
  unit: string; 
  icon: React.ReactNode;
  date: string;
  change?: { value: number; isPositive: boolean; }; 
}) => (
  <div className="flex flex-col p-4 border rounded-lg bg-background">
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 p-2 rounded-full">
          {icon}
        </div>
        <span className="font-medium">{title}</span>
      </div>
      {change && (
        <div className={`text-xs px-1.5 py-0.5 rounded-full flex items-center ${
          change.isPositive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
        }`}>
          <span>{change.isPositive ? "↑" : "↓"} {Math.abs(change.value)}%</span>
        </div>
      )}
    </div>
    <div className="flex items-baseline gap-1 mt-2">
      <span className="text-2xl font-bold">{value}</span>
      <span className="text-sm text-muted-foreground">{unit}</span>
    </div>
    <div className="mt-auto pt-2 text-xs text-muted-foreground flex justify-between items-center">
      <span>Last updated: {format(new Date(date), "MMM d")}</span>
      <Link href="/health-metrics" className="text-primary hover:underline text-xs">Details</Link>
    </div>
  </div>
);

export default function DashboardClient() {
  const { isLoaded, isSignedIn } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const { toast } = useToast();

  // Fetch user data when component mounts
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    async function fetchDashboardData() {
      try {
        setIsLoading(true);
        
        // Fetch activities, assessments, and health metrics
        const responses = await Promise.all([
          fetch('/api/user/activity?limit=5'),
          fetch('/api/user/assessments?limit=5'),
          fetch('/api/health-metrics?limit=10')
        ]).catch(error => {
          console.error('API request failed:', error);
        });
        
        // Extract health metrics if available
        if (responses && responses[2] && responses[2].ok) {
          const healthData = await responses[2].json();
          setHealthMetrics(healthData.metrics || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your dashboard data.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, [isLoaded, isSignedIn, toast]);

  // Get the most recent metric of a specific type
  const getLatestMetric = (type: string) => {
    const metrics = healthMetrics.filter(m => m.type === type);
    return metrics.length > 0 ? metrics[0] : null;
  };

  const bloodPressure = getLatestMetric('blood_pressure');
  const heartRate = getLatestMetric('heart_rate');
  const weight = getLatestMetric('weight');
  const sleep = getLatestMetric('sleep');

  return (
    <div className="container px-4 py-6 md:py-10">
      <h1 className="text-2xl font-bold mb-2">Your Brain Health Dashboard</h1>
      <p className="text-muted-foreground mb-6">Track your cognitive performance and brain health metrics</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Cognitive Score</CardTitle>
            <CardDescription>Based on your latest assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <CognitiveScoreCard />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Daily Challenge</CardTitle>
            <CardDescription>Keep your brain active</CardDescription>
          </CardHeader>
          <CardContent>
            <DailyChallenge />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Tools and assessments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" size="sm" variant="outline" asChild>
              <Link href="/tools">
                <Brain className="mr-2 h-4 w-4" />
                Cognitive Games
              </Link>
            </Button>
            <Button className="w-full justify-start" size="sm" variant="outline" asChild>
              <Link href="/assessment-report">
                <FileText className="mr-2 h-4 w-4" />
                Take Assessment
              </Link>
            </Button>
            <Button className="w-full justify-start" size="sm" variant="outline" asChild>
              <Link href="/stroke-prediction">
                <Activity className="mr-2 h-4 w-4" />
                Stroke Risk Calculator
              </Link>
            </Button>
            <Button className="w-full justify-start" size="sm" variant="outline" asChild>
              <Link href="/health-metrics">
                <Target className="mr-2 h-4 w-4" />
                Health Metrics
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Health Metrics Card */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Health Metrics</CardTitle>
              <CardDescription>Your key health indicators</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/health-metrics">
                View All
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-[140px] w-full rounded-lg" />
              ))}
            </div>
          ) : healthMetrics.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
              <h3 className="text-lg font-medium mb-2">No Health Metrics Yet</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                Track important health indicators to monitor your brain health risk factors.
              </p>
              <Button asChild>
                <Link href="/health-metrics">Add Health Metrics</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {bloodPressure && (
                <MetricCard
                  title="Blood Pressure"
                  value={bloodPressure.value}
                  unit="mmHg"
                  icon={<Heart className="h-4 w-4 text-primary" />}
                  date={bloodPressure.date}
                  change={{ value: 3, isPositive: false }}
                />
              )}
              
              {heartRate && (
                <MetricCard
                  title="Heart Rate"
                  value={heartRate.value}
                  unit="bpm"
                  icon={<Activity className="h-4 w-4 text-primary" />}
                  date={heartRate.date}
                  change={{ value: 2, isPositive: true }}
                />
              )}
              
              {weight && (
                <MetricCard
                  title="Weight"
                  value={weight.value}
                  unit="kg"
                  icon={<TrendingUp className="h-4 w-4 text-primary" />}
                  date={weight.date}
                />
              )}
              
              {sleep && (
                <MetricCard
                  title="Sleep"
                  value={sleep.value}
                  unit="hours"
                  icon={<History className="h-4 w-4 text-primary" />}
                  date={sleep.date}
                  change={{ value: 8, isPositive: true }}
                />
              )}
              
              {!bloodPressure && !heartRate && !weight && !sleep && (
                <div className="col-span-full text-center py-6">
                  <p className="text-sm text-muted-foreground">
                    No health metrics data available. <Link href="/health-metrics" className="text-primary hover:underline">Add your first metric</Link>.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity">
          <RecentActivity />
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cognitive Trends</CardTitle>
              <CardDescription>How your performance has changed over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center bg-muted/50 rounded">
              {isLoading ? (
                <div className="space-y-2 w-full max-w-lg">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : (
                <div className="text-center">
                  <Info className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
                  <h3 className="text-lg font-medium mb-2">Trends Visualization</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Complete more cognitive activities to see your performance trends over time.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personalized Recommendations</CardTitle>
              <CardDescription>Based on your cognitive profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex gap-2">
                  <Brain className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Focus on Memory Training</h3>
                    <p className="text-sm text-muted-foreground">
                      Your memory performance could benefit from targeted exercises.
                    </p>
                    <Button size="sm" variant="link" className="px-0" asChild>
                      <Link href="/tools">Try memory games</Link>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex gap-2">
                  <Zap className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Daily Brain Training</h3>
                    <p className="text-sm text-muted-foreground">
                      Consistent practice helps build cognitive reserve.
                    </p>
                    <Button size="sm" variant="link" className="px-0" asChild>
                      <Link href="/tools">Explore daily challenges</Link>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex gap-2">
                  <Activity className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Track Health Metrics</h3>
                    <p className="text-sm text-muted-foreground">
                      Monitoring key health indicators can help reduce stroke risk.
                    </p>
                    <Button size="sm" variant="link" className="px-0" asChild>
                      <Link href="/health-metrics">View health metrics</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 