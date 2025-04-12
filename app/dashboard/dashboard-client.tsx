"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivityHistory } from "@/components/activity-history";
import { CognitiveScoreCard } from "@/components/cognitive-score-card";
import { DailyChallenge } from "@/components/daily-challenge";
import { Brain, Activity, FileText, Zap, Target, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";

export default function DashboardClient() {
  const { isLoaded, isSignedIn } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch user data when component mounts
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    async function fetchDashboardData() {
      try {
        setIsLoading(true);
        
        // Fetch activities and assessments
        await Promise.all([
          fetch('/api/user/activity?limit=5'),
          fetch('/api/user/assessments?limit=5')
        ]).catch(error => {
          console.error('API request failed:', error);
        });
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
      
      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity">
          <ActivityHistory />
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