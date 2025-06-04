"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, PlusCircle, Target, Trophy, Calendar, Check, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

interface Goal {
  id: number;
  title: string;
  description: string;
  category: string;
  targetDate: Date;
  progress: number;
  createdAt: Date;
}

export default function GoalsClient() {
  const [isCreatingGoal, setIsCreatingGoal] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  const [goalCategory, setGoalCategory] = useState("memory");
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [newProgress, setNewProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load goals from localStorage on initial load
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const storedGoals = localStorage.getItem('brainwise_goals');
        if (storedGoals) {
          const parsedGoals = JSON.parse(storedGoals);
          // Convert string dates back to Date objects
          const goalsWithDates = parsedGoals.map((goal: Goal & {targetDate: string, createdAt: string}) => ({
            ...goal,
            targetDate: new Date(goal.targetDate),
            createdAt: new Date(goal.createdAt)
          }));
          setGoals(goalsWithDates);
        }
      } catch (error) {
        console.error("Error loading goals:", error);
        toast({
          title: "Error loading goals",
          description: "Your goals couldn't be loaded. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoals();
  }, [toast]);

  // Save goals to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('brainwise_goals', JSON.stringify(goals));
    }
  }, [goals, isLoading]);

  const handleCreateGoal = () => {
    if (!goalTitle || !goalCategory || !targetDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newGoal: Goal = {
      id: Date.now(),
      title: goalTitle,
      description: goalDescription,
      category: goalCategory,
      targetDate,
      progress: 0,
      createdAt: new Date(),
    };

    setGoals([...goals, newGoal]);
    
    // Reset form
    setGoalTitle("");
    setGoalDescription("");
    setGoalCategory("memory");
    setTargetDate(undefined);
    setIsCreatingGoal(false);

    toast({
      title: "Goal created",
      description: "Your cognitive improvement goal has been set.",
    });
  };

  const handleUpdateProgress = (goal: Goal) => {
    setSelectedGoal(goal);
    setNewProgress(goal.progress);
    setIsUpdatingProgress(true);
  };

  const saveProgressUpdate = () => {
    if (!selectedGoal) return;
    
    const updatedGoals = goals.map(g => 
      g.id === selectedGoal.id 
        ? { ...g, progress: newProgress } 
        : g
    );
    
    setGoals(updatedGoals);
    setIsUpdatingProgress(false);
    
    toast({
      title: "Progress updated",
      description: `Progress for "${selectedGoal.title}" has been updated to ${newProgress}%.`,
    });
  };

  const handleDeleteGoal = (goalId: number) => {
    const updatedGoals = goals.filter(g => g.id !== goalId);
    setGoals(updatedGoals);
    
    toast({
      title: "Goal deleted",
      description: "The goal has been removed from your list.",
    });
  };

  // Check if any goals exist
  const hasGoals = goals.length > 0;

  const categoryOptions = [
    { value: "memory", label: "Memory Enhancement" },
    { value: "attention", label: "Attention & Focus" },
    { value: "processing", label: "Processing Speed" },
    { value: "executive", label: "Executive Function" },
    { value: "language", label: "Language Skills" },
  ];

  return (
    <div className="container max-w-7xl py-8 sm:py-12 px-4 sm:px-6">
      <div className="mb-8">
        <Button variant="ghost" className="flex items-center gap-2 mb-6" asChild>
          <Link href="/progress">
            <ArrowLeft className="h-4 w-4" /> Back to Progress
          </Link>
        </Button>
      
        <div className="text-center space-y-4 sm:space-y-5 max-w-3xl mx-auto">
          <div className="flex justify-center mb-2">
            <div className="py-1 px-4 rounded-full bg-primary/10 text-primary text-sm font-medium inline-flex items-center gap-2">
              <Target className="h-4 w-4" /> Goal Setting
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Goals & Milestones</h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Set meaningful objectives and celebrate your cognitive improvement journey.
          </p>
          <div className="w-24 h-1 mx-auto mt-2 rounded-full bg-primary/50"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Current Goals</CardTitle>
                <CardDescription>Track your cognitive improvement objectives</CardDescription>
              </div>
              <Button 
                size="sm" 
                className="flex items-center gap-2"
                onClick={() => setIsCreatingGoal(true)}
              >
                <PlusCircle className="h-4 w-4" /> Add Goal
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading your goals...</p>
                </div>
              ) : hasGoals ? (
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <div key={goal.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium">{goal.title}</h3>
                          <p className="text-sm text-muted-foreground">{goal.description || "No description provided."}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="capitalize">{goal.category}</Badge>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive" 
                            onClick={() => handleDeleteGoal(goal.id)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Target: {goal.targetDate.toLocaleDateString()}</span>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleUpdateProgress(goal)}
                          >
                            Update Progress
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="rounded-full bg-muted p-3 inline-flex mb-4">
                    <Target className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Goals Set Yet</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                    Set cognitive improvement goals to track your progress and stay motivated on your brain health journey.
                  </p>
                  <Button onClick={() => setIsCreatingGoal(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" /> Create Your First Goal
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {isCreatingGoal && (
            <Card>
              <CardHeader>
                <CardTitle>Create New Goal</CardTitle>
                <CardDescription>Define a specific cognitive improvement goal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goal-title">Goal Title <span className="text-destructive">*</span></Label>
                  <Input 
                    id="goal-title" 
                    placeholder="e.g., Improve working memory score by 20%" 
                    value={goalTitle}
                    onChange={(e) => setGoalTitle(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="goal-description">Description</Label>
                  <Textarea 
                    id="goal-description" 
                    placeholder="Describe your goal and how you'll measure success..." 
                    value={goalDescription}
                    onChange={(e) => setGoalDescription(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormItem>
                      <FormLabel htmlFor="category">Goal Category</FormLabel>
                      <Select 
                        value={goalCategory} 
                        onValueChange={setGoalCategory}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryOptions.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Target Date <span className="text-destructive">*</span></Label>
                    <DatePicker 
                      date={targetDate} 
                      setDate={setTargetDate} 
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setIsCreatingGoal(false)}>Cancel</Button>
                <Button onClick={handleCreateGoal}>Create Goal</Button>
              </CardFooter>
            </Card>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Milestones</CardTitle>
                <CardDescription>Key achievements on your cognitive journey</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10 space-y-4">
                <Trophy className="h-12 w-12 mx-auto text-muted-foreground opacity-70" />
                <h3 className="text-xl font-medium">No Milestones Yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Complete assessments and training exercises to earn milestones and track your improvement.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/tools">Explore Training Tools</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Goal Setting Guide</CardTitle>
              <CardDescription>Tips for effective cognitive goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium flex items-center">
                  <Check className="h-4 w-4 mr-2 text-primary" />
                  Be Specific
                </h3>
                <p className="text-sm text-muted-foreground">
                  Define clear goals like &ldquo;Improve working memory score by 15%&rdquo; rather than vague objectives.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium flex items-center">
                  <Check className="h-4 w-4 mr-2 text-primary" />
                  Make it Measurable
                </h3>
                <p className="text-sm text-muted-foreground">
                  Ensure your goals can be tracked with concrete metrics from assessments.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium flex items-center">
                  <Check className="h-4 w-4 mr-2 text-primary" />
                  Set Realistic Timeframes
                </h3>
                <p className="text-sm text-muted-foreground">
                  Cognitive improvement takes time. Set achievable timeframes for your goals.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium flex items-center">
                  <Check className="h-4 w-4 mr-2 text-primary" />
                  Break it Down
                </h3>
                <p className="text-sm text-muted-foreground">
                  Divide larger goals into smaller milestones to maintain motivation.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <a 
                href="/goal-template.pdf" 
                download
                className="w-full"
              >
                <Button variant="outline" className="w-full">Download Goal Template</Button>
              </a>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Progress Update Dialog */}
      <Dialog open={isUpdatingProgress} onOpenChange={setIsUpdatingProgress}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Goal Progress</DialogTitle>
            <DialogDescription>
              Set your current progress for &quot;{selectedGoal?.title}&quot;
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="progress">Progress Percentage</Label>
              <div className="space-y-4">
                <Slider
                  id="progress"
                  min={0}
                  max={100}
                  step={5}
                  value={[newProgress]}
                  onValueChange={(value) => setNewProgress(value[0])}
                />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">0%</span>
                  <span className="font-medium">{newProgress}%</span>
                  <span className="text-sm text-muted-foreground">100%</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdatingProgress(false)}>Cancel</Button>
            <Button onClick={saveProgressUpdate}>Save Progress</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 