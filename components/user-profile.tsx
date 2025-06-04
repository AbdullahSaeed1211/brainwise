"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  User, FileText, ActivitySquare, Calendar, Clock, Award,
  AlertTriangle, CheckCircle, ArrowUpRight
} from "lucide-react";

interface UserProfileProps {
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: "user" | "doctor" | "admin";
    createdAt: Date;
  };
}

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  date: Date;
  status: "normal" | "warning" | "critical";
}

interface Assessment {
  id: string;
  type: "stroke" | "tumor" | "alzheimers";
  result: string;
  date: Date;
  risk: "low" | "moderate" | "high";
}

export function UserProfile({ user }: UserProfileProps) {
  const { toast } = useToast();
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState({
    metrics: true,
    assessments: true
  });

  // Fetch health metrics
  useEffect(() => {
    if (!user) return; // Skip fetching if no user
    
    async function fetchHealthMetrics() {
      try {
        setIsLoading(prev => ({ ...prev, metrics: true }));
        
        // Call the API endpoint to fetch real data
        const response = await fetch(`/api/user/health-metrics?limit=10`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch health metrics');
        }
        
        const data = await response.json();
        
        if (data.status === "success" && Array.isArray(data.data)) {
          // Transform the data to match the expected format
          const metrics: HealthMetric[] = data.data.map((item: {
            _id: string;
            name: string;
            value: number;
            unit: string;
            date: string;
            status: "normal" | "warning" | "critical";
          }) => ({
            id: item._id,
            name: item.name,
            value: item.value,
            unit: item.unit,
            date: new Date(item.date),
            status: item.status
          }));
          
          setHealthMetrics(metrics);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching health metrics:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load health metrics'
        });
      } finally {
        setIsLoading(prev => ({ ...prev, metrics: false }));
      }
    }
    
    fetchHealthMetrics();
  }, [toast, user]);
  
  // Fetch assessments
  useEffect(() => {
    if (!user) return; // Skip fetching if no user
    
    async function fetchAssessments() {
      try {
        setIsLoading(prev => ({ ...prev, assessments: true }));
        
        // Call the API endpoint to fetch real assessment data
        const response = await fetch(`/api/user/assessments?limit=10`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch assessments');
        }
        
        const data = await response.json();
        
        if (data.status === "success" && Array.isArray(data.data)) {
          // Transform the data to match the expected format
          const assessments: Assessment[] = data.data.map((item: {
            _id: string;
            type: "stroke" | "tumor" | "alzheimers";
            result: string;
            date: string;
            risk: "low" | "moderate" | "high";
          }) => ({
            id: item._id,
            type: item.type,
            result: item.result,
            date: new Date(item.date),
            risk: item.risk
          }));
          
          setAssessments(assessments);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching assessments:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load assessments'
        });
      } finally {
        setIsLoading(prev => ({ ...prev, assessments: false }));
      }
    }
    
    fetchAssessments();
  }, [toast, user]);

  // No user, show sign-in prompt
  if (!user) {
    return (
      <Card className="w-full animate-in fade-in duration-500">
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
          <User className="w-16 h-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-medium mb-2">Account Required</h3>
          <p className="text-muted-foreground text-center mb-6">Please sign in to view your profile and health data</p>
          <Button size="lg" className="interactive micro-bounce">Sign In</Button>
        </CardContent>
      </Card>
    );
  }
  
  // Function to render risk badge with appropriate color
  const getRiskBadge = (risk: "low" | "moderate" | "high") => {
    const classes = {
      low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      moderate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    };
    
    const icons = {
      low: <CheckCircle className="w-3 h-3 mr-1" />,
      moderate: <AlertTriangle className="w-3 h-3 mr-1" />,
      high: <AlertTriangle className="w-3 h-3 mr-1" />
    };
    
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${classes[risk]}`}>
        {icons[risk]}
        {risk.charAt(0).toUpperCase() + risk.slice(1)} Risk
      </span>
    );
  };
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Card className="overflow-hidden border shadow-sm">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        <CardContent className="relative p-6">
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-end">
            <div className="relative -mt-20 h-28 w-28 overflow-hidden rounded-full border-4 border-background bg-background">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/10 text-4xl font-semibold uppercase text-primary">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2 text-center md:text-left">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  <Calendar className="mr-1 h-3 w-3" />
                  Member since {user.createdAt.toLocaleDateString()}
                </span>
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  <User className="mr-1 h-3 w-3" />
                  {user.role === "user" ? "Patient" : user.role}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="outline" size="sm" className="interactive micro-bounce">
                <FileText className="mr-1 h-4 w-4" />
                Edit Profile
              </Button>
              <Button size="sm" className="interactive micro-bounce">
                Contact Doctor
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="overview" className="interactive">Overview</TabsTrigger>
          <TabsTrigger value="assessments" className="interactive">Assessments</TabsTrigger>
          <TabsTrigger value="metrics" className="interactive">Health Metrics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium flex items-center">
                  <ActivitySquare className="mr-2 h-5 w-5 text-primary" />
                  Recent Activity
                </h3>
              </CardHeader>
              <CardContent>
                {isLoading.assessments || isLoading.metrics ? (
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4 border-b pb-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <ActivitySquare className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Completed Stroke Risk Assessment</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(Date.now() - 86400000 * 14).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 border-b pb-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Updated Health Metrics</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(Date.now() - 86400000 * 2).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Award className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Completed Cognitive Assessment</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(Date.now() - 86400000 * 7).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-primary" />
                  Health Summary
                </h3>
              </CardHeader>
              <CardContent>
                {isLoading.assessments ? (
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Cognitive Health</p>
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                          Moderate
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full w-[65%] rounded-full bg-yellow-500"></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Stroke Risk</p>
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                          Low
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full w-[12%] rounded-full bg-green-500"></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Overall Health</p>
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          Good
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full w-[78%] rounded-full bg-blue-500"></div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="assessments" className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Card>
            <CardContent className="p-6">
              {isLoading.assessments ? (
                <div className="space-y-6">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex flex-col space-y-3">
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ))}
                </div>
              ) : assessments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Assessments Yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Complete a health assessment to track your brain health over time
                  </p>
                  <Button className="interactive micro-bounce">
                    Start an Assessment
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {assessments.map((assessment) => (
                    <div key={assessment.id} className="rounded-lg border p-4 transition-all hover:bg-muted/50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium capitalize">
                          {assessment.type} Assessment
                        </h3>
                        {getRiskBadge(assessment.risk)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {assessment.result}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {assessment.date.toLocaleDateString()}
                        </span>
                        <Button variant="ghost" size="sm" className="h-8 text-xs">
                          View Details
                          <ArrowUpRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="metrics" className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Card>
            <CardContent className="p-6">
              {isLoading.metrics ? (
                <div className="space-y-6">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex flex-col space-y-3">
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ))}
                </div>
              ) : healthMetrics.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ActivitySquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Health Metrics Yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Add your health metrics to monitor your health status over time
                  </p>
                  <Button className="interactive micro-bounce">
                    Add Health Metrics
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {healthMetrics.map((metric) => (
                    <div key={metric.id} className="rounded-lg border p-4 transition-all hover:bg-muted/50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">
                          {metric.name}
                        </h3>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          metric.status === "normal" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" :
                          metric.status === "warning" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" :
                          "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}>
                          {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-2xl font-semibold">{metric.value}</span>
                        <span className="text-sm text-muted-foreground">{metric.unit}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {metric.date.toLocaleDateString()}
                        </span>
                        <Button variant="ghost" size="sm" className="h-8 text-xs">
                          Update
                          <ArrowUpRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 