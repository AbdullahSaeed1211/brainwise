"use client";

import { useChallengeStreaks } from "@/hooks/use-challenge-streaks";
import { Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export function ChallengeRewards() {
  const { stats, isLoading, getPointsUntilNextReward, getDaysUntilNextReward } = useChallengeStreaks();

  if (isLoading) {
    return <RewardsSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          <span>Rewards & Achievements</span>
        </h2>
        <div className="inline-flex items-center justify-between bg-muted px-3 py-1.5 rounded-full text-sm">
          <span className="text-muted-foreground mr-2">Total Points:</span>
          <span className="font-medium">{stats.totalPoints}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Render unlocked rewards */}
        {stats.unlockedRewards.slice(0, 1).map(reward => (
          <Card 
            key={reward.id} 
            className="border-amber-200 bg-gradient-to-br from-amber-50 to-white"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-500" />
                <span>{reward.title}</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Unlocked for maintaining a {reward.requirementType === "streak" 
                  ? `${reward.requirementValue}-day streak` 
                  : `earning ${reward.requirementValue} points`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-3">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-100">
                  <Award className="h-8 w-8 text-amber-500" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-3 bg-amber-50/50">
              <p className="text-xs text-amber-700 w-full text-center">
                Unlocked! Continue your streak for more rewards
              </p>
            </CardFooter>
          </Card>
        ))}

        {/* Render next rewards */}
        {stats.nextRewards.map(reward => {
          // Calculate progress
          const progressValue = reward.requirementType === "streak"
            ? (stats.currentStreak / reward.requirementValue) * 100
            : (stats.totalPoints / reward.requirementValue) * 100;
          
          // Calculate remaining amount
          const remaining = reward.requirementType === "streak"
            ? getDaysUntilNextReward(reward.requirementType, reward.requirementValue)
            : getPointsUntilNextReward(reward.requirementType, reward.requirementValue);
          
          // Current value to display
          const currentValue = reward.requirementType === "streak"
            ? stats.currentStreak
            : stats.totalPoints;
          
          return (
            <Card 
              key={reward.id} 
              className="border-slate-200 bg-slate-50/50"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600">{reward.title}</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Unlock by {reward.requirementType === "streak" 
                    ? `maintaining a ${reward.requirementValue}-day streak` 
                    : `earning ${reward.requirementValue} points`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-3">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-100">
                    <Award className="h-8 w-8 text-slate-300" />
                  </div>
                </div>
                <div className="mt-3">
                  <Progress value={progressValue} className="h-1.5" />
                  <p className="text-xs text-muted-foreground mt-1 text-right">
                    {currentValue} of {reward.requirementValue} {reward.requirementType === "streak" ? "days" : "points"}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-3 bg-slate-50/70">
                <p className="text-xs text-slate-500 w-full text-center">
                  {remaining} more {reward.requirementType === "streak" ? "days" : "points"} to unlock
                </p>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function RewardsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          <span>Rewards & Achievements</span>
        </h2>
        <Skeleton className="h-8 w-32 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-5 w-3/4" />
              </CardTitle>
              <Skeleton className="h-3 w-full mt-1" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-3">
                <Skeleton className="w-16 h-16 rounded-full" />
              </div>
              <div className="mt-3">
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-3 w-2/5 mt-1 ml-auto" />
              </div>
            </CardContent>
            <CardFooter className="border-t pt-3">
              <Skeleton className="h-3 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 