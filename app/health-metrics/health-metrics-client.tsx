"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Heart, 
  Plus, 
  Droplet,
  Utensils,
  Moon,
  List,
  Dumbbell,
  CalendarDays,
  ArrowUpRight,
  PlusCircle
} from "lucide-react";
import Link from "next/link";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { HealthMetricsForm } from "@/components/health-metrics-form";

export default function HealthMetricsClient() {
  const [timeRange, setTimeRange] = useState("30d");
  const [showAddMetricForm, setShowAddMetricForm] = useState(false);
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1">
            <List className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <CalendarDays className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="180d">Last 6 months</SelectItem>
              <SelectItem value="365d">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setShowAddMetricForm(true)}>
          <Plus className="h-4 w-4" />
          <span>Add Measurement</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                <CardTitle className="text-base">Blood Pressure</CardTitle>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowAddMetricForm(true)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="text-center py-6">
            <div className="flex flex-col items-center justify-center space-y-2">
              <PlusCircle className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No blood pressure data yet</p>
              <p className="text-xs text-muted-foreground">Add your first measurement to see your data here</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => setShowAddMetricForm(true)}>Add Data</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplet className="h-5 w-5 text-blue-500" />
                <CardTitle className="text-base">Glucose</CardTitle>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowAddMetricForm(true)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="text-center py-6">
            <div className="flex flex-col items-center justify-center space-y-2">
              <PlusCircle className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No glucose measurements yet</p>
              <p className="text-xs text-muted-foreground">Track your glucose levels to monitor their impact on brain health</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => setShowAddMetricForm(true)}>Add Data</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-purple-500" />
                <CardTitle className="text-base">Physical Activity</CardTitle>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowAddMetricForm(true)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="text-center py-6">
            <div className="flex flex-col items-center justify-center space-y-2">
              <PlusCircle className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No activity data yet</p>
              <p className="text-xs text-muted-foreground">Record your exercise to see how it affects your cognitive health</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => setShowAddMetricForm(true)}>Track Activity</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="h-5 w-5 text-indigo-400" />
                <CardTitle className="text-base">Sleep</CardTitle>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowAddMetricForm(true)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="text-center py-6">
            <div className="flex flex-col items-center justify-center space-y-2">
              <PlusCircle className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No sleep data yet</p>
              <p className="text-xs text-muted-foreground">Track your sleep patterns to improve brain recovery</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => setShowAddMetricForm(true)}>Log Sleep</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <div className="flex justify-center overflow-x-auto pb-2 scrollbar-hide">
          <TabsList className="mb-8">
            <TabsTrigger value="overview" className="text-sm sm:text-base px-3 sm:px-4">Overview</TabsTrigger>
            <TabsTrigger value="vitals" className="text-sm sm:text-base px-3 sm:px-4">Vitals</TabsTrigger>
            <TabsTrigger value="activity" className="text-sm sm:text-base px-3 sm:px-4">Activity</TabsTrigger>
            <TabsTrigger value="nutrition" className="text-sm sm:text-base px-3 sm:px-4">Nutrition</TabsTrigger>
            <TabsTrigger value="sleep" className="text-sm sm:text-base px-3 sm:px-4">Sleep</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Health Overview</CardTitle>
              <CardDescription>Summary of your key health metrics and their impact on brain health</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-6">
                <Activity className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Health Data Available Yet</h3>
                <div className="space-y-6">
                  <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
                    Start tracking your health metrics to see how they impact your brain health. Add measurements 
                    manually or connect your health devices for automatic tracking.
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Note: This is a demo version. In a production environment, you would be able to connect your 
                    fitness devices and medical equipment for automatic data import.
                  </p>
                  <Button onClick={() => setShowAddMetricForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Measurement
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-3 justify-between">
              <Button variant="outline" size="sm" className="flex items-center">
                <Link href="/stroke-prediction" className="flex items-center">
                  Stroke Risk Assessment
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
              <Button size="sm" className="flex items-center">
                <Link href="/brain-health" className="flex items-center">
                  Brain Health Library
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="vitals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vitals History</CardTitle>
              <CardDescription>Detailed view of your vital measurements over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <Activity className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Connect Your Health Devices</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Connect your health monitoring devices or manually track vital measurements to see trends 
                  in your blood pressure, heart rate, glucose levels, and other health indicators.
                </p>
                <Button className="mt-4">Connect Health Device</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Physical Activity</CardTitle>
              <CardDescription>Track exercise and movement that benefits brain health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <Dumbbell className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Activity Tracking</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Track your physical activity including steps, exercise sessions, heart rate zones, 
                  and how these activities benefit your brain health.
                </p>
                <Button className="mt-4">Connect Fitness Tracker</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nutrition</CardTitle>
              <CardDescription>Track dietary patterns that impact brain health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <Utensils className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Nutrition Tracking</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Log your meals and track nutritional intake, especially foods that benefit brain health 
                  like omega-3 fatty acids, antioxidants, and Mediterranean diet components.
                </p>
                <Button className="mt-4">Connect Nutrition App</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sleep" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sleep</CardTitle>
              <CardDescription>Monitor sleep quality and its impact on cognitive function</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <Moon className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Sleep Tracking</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Track your sleep duration, quality, and patterns to understand how they affect your 
                  cognitive performance and brain health over time.
                </p>
                <Button className="mt-4">Connect Sleep Tracker</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-center space-y-4 pt-6">
        <p className="text-sm text-muted-foreground">
          Regular tracking of health metrics can help identify trends and improvements in your brain health profile.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button variant="outline" asChild>
            <Link href="/brain-health">
              Brain Health Resources
            </Link>
          </Button>
          <Button asChild>
            <Link href="/tools">
              Brain Health Tools
            </Link>
          </Button>
        </div>
      </div>

      <Dialog open={showAddMetricForm} onOpenChange={setShowAddMetricForm}>
        <DialogContent className="max-w-lg">
          <HealthMetricsForm 
            onClose={() => setShowAddMetricForm(false)}
            onSuccess={() => {
              setShowAddMetricForm(false);
              // In a real app, you'd fetch updated metrics here
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
} 