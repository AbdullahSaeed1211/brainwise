"use client";

import { useChallengeStreaks } from "@/hooks/use-challenge-streaks";
import { Flame } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export function StreakStats() {
  const { stats, isLoading } = useChallengeStreaks();

  if (isLoading) {
    return <StreakStatsSkeleton />;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <span>Your Streak</span>
        </CardTitle>
        <CardDescription>Keep your daily training consistent</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center py-4">
          <div className="relative flex items-center justify-center">
            <div className="absolute flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20" />
            <div className="absolute flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-orange-500/30 to-red-500/30" />
            <div className="flex flex-col items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-500">
              <span className="text-2xl font-bold text-white">{stats.currentStreak}</span>
              <span className="text-xs text-white">days</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Longest streak</span>
            <span className="font-medium">{stats.longestStreak} days</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total points</span>
            <span className="font-medium">{stats.totalPoints}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Today&apos;s status</span>
            <span className="font-medium text-emerald-500">
              {stats.completedToday.length} of 3 done
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StreakStatsSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <span>Your Streak</span>
        </CardTitle>
        <CardDescription>Keep your daily training consistent</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center py-4">
          <Skeleton className="w-20 h-20 rounded-full" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/6" />
          </div>
          <div className="flex justify-between text-sm">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/6" />
          </div>
          <div className="flex justify-between text-sm">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 