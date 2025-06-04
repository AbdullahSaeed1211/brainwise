"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, Medal, Target, CalendarDays, Trophy } from "lucide-react";
import { useGameResults } from "@/hooks/use-game-results";

interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  icon: React.ReactNode;
  unlocked: boolean;
}

export function AchievementsPanel() {
  const { results, isLoading } = useGameResults();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  
  useEffect(() => {
    if (!results.length) return;
    
    // Calculate achievements based on game results
    const memoryGames = results.filter(result => result.gameType === "memory-game");
    const reactionTests = results.filter(result => result.gameType === "reaction-test");
    
    // Get unique dates to calculate streaks
    const uniqueDates = new Set(
      results.map(result => 
        new Date(result.completedAt).toISOString().split("T")[0]
      )
    );
    
    // Calculate average reaction time
    const avgReactionTime = reactionTests.length > 0
      ? reactionTests.reduce((sum, test) => sum + test.duration, 0) / reactionTests.length
      : 0;
    
    const calculatedAchievements: Achievement[] = [
      {
        id: "memory-master",
        title: "Memory Master",
        description: "Complete 20 memory games",
        progress: Math.min(Math.round((memoryGames.length / 20) * 100), 100),
        icon: <Brain className="h-5 w-5 text-primary" />,
        unlocked: memoryGames.length >= 20
      },
      {
        id: "reaction-pro",
        title: "Lightning Reflexes",
        description: "Average reaction time under 250ms",
        progress: avgReactionTime > 0 
          ? Math.min(Math.round((250 / Math.max(avgReactionTime, 150)) * 100), 100)
          : 0,
        icon: <Target className="h-5 w-5 text-primary" />,
        unlocked: avgReactionTime > 0 && avgReactionTime < 250
      },
      {
        id: "streak-10",
        title: "10-Day Streak",
        description: "Complete activities for 10 consecutive days",
        progress: Math.min(Math.round((uniqueDates.size / 10) * 100), 100),
        icon: <CalendarDays className="h-5 w-5 text-primary" />,
        unlocked: uniqueDates.size >= 10
      },
      {
        id: "perfect-memory",
        title: "Perfect Memory",
        description: "Complete the memory game with perfect score",
        progress: memoryGames.some(game => game.score >= 95) ? 100 : 0,
        icon: <Trophy className="h-5 w-5 text-primary" />,
        unlocked: memoryGames.some(game => game.score >= 95)
      }
    ];
    
    setAchievements(calculatedAchievements);
  }, [results]);
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading achievements...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!achievements.length) {
    return (
      <Card>
        <CardContent className="pt-6 flex flex-col items-center text-center py-12">
          <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Achievements Yet</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            Complete cognitive activities to earn achievements and track your progress.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {achievements.map((achievement) => (
          <Card key={achievement.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="p-2 rounded-full bg-primary/10">
                  {achievement.icon}
                </div>
                {achievement.unlocked && (
                  <div className="text-amber-500">
                    <Medal className="h-5 w-5" />
                  </div>
                )}
              </div>
              <CardTitle className="text-base mt-2">{achievement.title}</CardTitle>
              <CardDescription>{achievement.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{achievement.progress}%</span>
                </div>
                <Progress value={achievement.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Activity Streak</CardTitle>
          <CardDescription>Your consecutive days of brain training</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-primary">
                {new Set(results.map(r => 
                  new Date(r.completedAt).toISOString().split("T")[0]
                )).size}
              </div>
              <p className="text-sm text-muted-foreground mt-2">unique days</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 