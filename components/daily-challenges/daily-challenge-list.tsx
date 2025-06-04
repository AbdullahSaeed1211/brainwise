"use client";

import { useChallengeStreaks } from "@/hooks/use-challenge-streaks";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CircleCheck, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Challenge {
  id: string;
  title: string;
  description: string;
  iconType: "memory" | "verbal" | "pattern";
  routePath: string;
  isCompleted: boolean;
}

export function DailyChallengeList() {
  const { stats, isLoading } = useChallengeStreaks();

  // Define today's challenges
  const challenges: Challenge[] = [
    {
      id: "memory",
      title: "Memory Challenge",
      description: "Complete a sequence memory test game and reach level 5",
      iconType: "memory",
      routePath: "/tools/sequence-memory-test",
      isCompleted: stats.completedToday.includes("sequence-memory"),
    },
    {
      id: "verbal",
      title: "Verbal Challenge",
      description: "Complete a verbal fluency test and list at least 10 items",
      iconType: "verbal",
      routePath: "/tools/verbal-fluency-test",
      isCompleted: stats.completedToday.includes("verbal-fluency"),
    },
    {
      id: "pattern",
      title: "Pattern Challenge",
      description: "Complete a pattern recognition test with at least 80% accuracy",
      iconType: "pattern",
      routePath: "/tools/pattern-recognition-test",
      isCompleted: stats.completedToday.includes("pattern-recognition"),
    },
  ];

  // Calculate completion percentage
  const completedCount = challenges.filter(challenge => challenge.isCompleted).length;
  const completionPercentage = (completedCount / challenges.length) * 100;

  // Helper function to get icon background color
  function getIconBackground(type: Challenge["iconType"], completed: boolean) {
    if (completed) {
      return "bg-emerald-100 text-emerald-700";
    }
    
    switch (type) {
      case "memory":
        return "bg-blue-100 text-blue-700";
      case "verbal":
        return "bg-indigo-100 text-indigo-700";
      case "pattern":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  if (isLoading) {
    return <ChallengeListSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border"
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${getIconBackground(
                challenge.iconType,
                challenge.isCompleted
              )}`}
            >
              {challenge.isCompleted ? (
                <CircleCheck className="h-5 w-5" />
              ) : (
                <Star className="h-5 w-5" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium">{challenge.title}</h3>
              <p className="text-xs text-muted-foreground">{challenge.description}</p>
            </div>
            <Button
              size="sm"
              variant={challenge.isCompleted ? "default" : "outline"}
              className={challenge.isCompleted ? "bg-emerald-500 hover:bg-emerald-600" : ""}
              disabled={challenge.isCompleted}
              asChild={!challenge.isCompleted}
            >
              {challenge.isCompleted ? (
                <span>Completed</span>
              ) : (
                <a href={challenge.routePath}>Start Now</a>
              )}
            </Button>
          </div>
        ))}
      </div>

      <div className="pt-2">
        <p className="text-sm text-muted-foreground mb-2">Today&apos;s progress</p>
        <Progress value={completionPercentage} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2 text-right">
          {completedCount} of {challenges.length} completed
        </p>
      </div>
    </div>
  );
}

function ChallengeListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border animate-pulse"
          >
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
            </div>
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        ))}
      </div>

      <div className="pt-2">
        <Skeleton className="h-4 w-1/3 mb-2" />
        <Skeleton className="h-2 w-full mb-2" />
        <Skeleton className="h-3 w-1/6 ml-auto" />
      </div>
    </div>
  );
} 