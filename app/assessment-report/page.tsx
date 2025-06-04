import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, FileText, Activity, Info, AlertCircle, Trophy, ShieldAlert } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Assessment Report | Brainwise',
  description: 'View your comprehensive cognitive assessment report and track progress over time.',
};

export default function AssessmentReportPage() {
  // In a real implementation, this would be fetched from your API
  const hasAssessmentData = false;
  const hasHistoricalData = false;

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold">Cognitive Assessment Report</h1>
        <p className="text-muted-foreground">
          View detailed information about your cognitive performance and track progress over time.
        </p>
      </div>

      <Card className="mb-8 border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
        <CardContent className="pt-6 pb-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800 dark:text-amber-300 mb-1">For Recreational and Self-Improvement Purposes Only</h3>
              <p className="text-sm text-amber-700 dark:text-amber-300/80">
                The results and scores presented here are based on your interactions with our cognitive tools and are designed 
                for recreational use and personal improvement. These assessments are not medical evaluations, do not diagnose 
                any medical conditions, and should not replace professional medical advice. Always consult with healthcare 
                professionals for medical concerns or before making health-related decisions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {hasAssessmentData ? (
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="domains">Cognitive Domains</TabsTrigger>
            <TabsTrigger value="history">Historical Data</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">83/100</div>
                  <p className="text-xs text-muted-foreground">
                    Above average performance
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Memory</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78/100</div>
                  <p className="text-xs text-muted-foreground">
                    Average performance
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Executive Function</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89/100</div>
                  <p className="text-xs text-muted-foreground">
                    Above average performance
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Processing Speed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">85/100</div>
                  <p className="text-xs text-muted-foreground">
                    Above average performance
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Assessment Summary</CardTitle>
                <CardDescription>
                  Based on your performance across multiple cognitive tests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Your cognitive assessment indicates strong overall performance, with particular strengths in executive function and processing speed. Your memory performance is within the average range compared to your age group.
                </p>
                <p>
                  Regular cognitive training in all domains can help maintain and potentially improve your cognitive performance. Focus on memory exercises may be beneficial to strengthen this domain.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="domains" className="space-y-6">
            {/* Domain details would go here */}
            <Card>
              <CardHeader>
                <CardTitle>Memory</CardTitle>
                <CardDescription>Ability to encode, store, and recall information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Short-term Memory</span>
                    <span className="text-sm">Good</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Working Memory</span>
                    <span className="text-sm">Average</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Visual Memory</span>
                    <span className="text-sm">Good</span>
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Memory Insights</h4>
                  <p className="text-sm text-muted-foreground">
                    Your memory performance is within normal range. Working memory showed the most room for improvement, which can be enhanced through targeted exercises.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Additional domain cards would go here */}
          </TabsContent>
          
          <TabsContent value="history" className="space-y-6">
            {hasHistoricalData ? (
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>Your cognitive performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Chart would go here */}
                  <div className="h-80 w-full bg-muted rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Performance trend visualization</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>Your cognitive performance over time</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Info className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Not enough historical data</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-md">
                    Complete at least two assessments to see how your cognitive performance changes over time.
                    Regular assessments provide valuable insights into your brain health journey.
                  </p>
                  <Button className="mt-6">Take Another Assessment</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personalized Recommendations</CardTitle>
                <CardDescription>
                  Based on your assessment results
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="bg-muted rounded-lg p-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <Brain className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Memory Enhancement</h3>
                        <p className="text-sm text-muted-foreground">
                          Regular working memory exercises could help improve this aspect of your cognitive performance.
                        </p>
                        <Link href="/tools" className="text-xs text-primary hover:underline inline-block mt-2">
                          View recommended exercises
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted rounded-lg p-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <Activity className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Physical Exercise</h3>
                        <p className="text-sm text-muted-foreground">
                          Regular physical activity has been shown to support cognitive health. Aim for 30 minutes of moderate exercise 5 days a week.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted rounded-lg p-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Regular Assessment</h3>
                        <p className="text-sm text-muted-foreground">
                          Schedule another cognitive assessment in 3 months to track your progress and adjust your training plan accordingly.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted rounded-lg p-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <Activity className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Health Metrics Monitoring</h3>
                        <p className="text-sm text-muted-foreground">
                          Track key health indicators like blood pressure, glucose levels, and sleep patterns which significantly impact brain health.
                        </p>
                        <Link href="/health-metrics" className="text-xs text-primary hover:underline inline-block mt-2">
                          Monitor your health metrics
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="h-16 w-16 text-muted-foreground mb-6" />
            <h2 className="text-2xl font-bold mb-2">No Assessment Data Available</h2>
            <p className="text-muted-foreground text-center max-w-md mb-8">
              Complete your first cognitive assessment to receive a detailed report of your brain health across multiple domains.
              Regular assessments help track changes over time and provide personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/tools">
                <Button className="flex items-center gap-2" size="lg">
                  <Trophy className="h-4 w-4" />
                  Take Your First Assessment
                </Button>
              </Link>
              <Link href="/brain-health">
                <Button variant="outline" className="flex items-center gap-2" size="lg">
                  <Brain className="h-4 w-4" />
                  Learn About Brain Health
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 