"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, Clock, Grid3X3, Check } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@clerk/nextjs";

interface Challenge {
  _id: string;
  title: string;
  description: string;
  points: number;
  gameType: string;
  link: string;
  difficulty: "easy" | "medium" | "hard";
  date: string;
  isCompleted?: boolean;
  completedAt?: string | null;
  earnedPoints?: number | null;
}

export function DailyChallenge() {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { isLoaded } = useAuth();

  const fetchChallenge = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/user/daily-challenges', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include credentials for auth
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch challenge: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        setChallenge(data.data[0]);
      } else {
        setChallenge(getDefaultChallenge());
        console.log('No challenge found for today, using default challenge');
      }
    } catch (err) {
      console.error('Error fetching daily challenge:', err);
      setError('Failed to load daily challenge');
      setChallenge(getDefaultChallenge());
      
      toast({
        title: "Loading Challenge",
        description: "We've prepared a special challenge for you today!",
        variant: "default",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isLoaded) {
      fetchChallenge();
    }
  }, [fetchChallenge, isLoaded]);

  // Default challenge selection
  const getDefaultChallenge = (): Challenge => {
    // Select challenge based on day of month
    const today = new Date();
    const dayOfMonth = today.getDate();
    const challenges = [
      {
        _id: "fallback-1",
        title: "Memory Matrix",
        description: "Memorize and recall a sequence of highlighted squares in a grid",
        points: 100,
        gameType: "memory",
        link: "/tools/memory-game",
        difficulty: "medium",
        date: today.toISOString()
      },
      {
        _id: "fallback-2",
        title: "Word Association",
        description: "Test your verbal fluency by naming related words within a time limit",
        points: 75,
        gameType: "verbal",
        link: "/tools/verbal-fluency",
        difficulty: "easy",
        date: today.toISOString()
      },
      {
        _id: "fallback-3",
        title: "Pattern Completion",
        description: "Identify the missing element in visual or numerical patterns",
        points: 125,
        gameType: "pattern",
        link: "/tools/pattern-recognition",
        difficulty: "hard",
        date: today.toISOString()
      },
      {
        _id: "fallback-4",
        title: "Quick Reaction",
        description: "Test your processing speed with this reaction time challenge",
        points: 90,
        gameType: "reaction",
        link: "/tools/reaction-game",
        difficulty: "medium",
        date: today.toISOString()
      },
      {
        _id: "fallback-5",
        title: "Sequence Memory",
        description: "Remember and reproduce increasingly complex sequences",
        points: 110,
        gameType: "sequence",
        link: "/tools/sequence-memory",
        difficulty: "medium",
        date: today.toISOString()
      }
    ];
    
    return challenges[dayOfMonth % challenges.length] as Challenge;
  };

  if (isLoading) {
    return (
      <Card className="h-[280px] flex items-center justify-center">
        <CardContent>
          <div className="text-center text-muted-foreground">Loading challenge...</div>
        </CardContent>
      </Card>
    );
  }

  if (error && !challenge) {
    return (
      <Card className="h-[280px] flex items-center justify-center">
        <CardContent>
          <div className="text-center text-muted-foreground">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!challenge) {
    return (
      <Card className="h-[280px] flex items-center justify-center">
        <CardContent>
          <div className="text-center text-muted-foreground">No challenge available today</div>
        </CardContent>
      </Card>
    );
  }

  const getIcon = (gameType: string) => {
    switch (gameType) {
      case "memory":
      case "sequence":
        return <Brain className="h-5 w-5 text-primary" />;
      case "verbal":
        return <Zap className="h-5 w-5 text-primary" />;
      case "pattern":
        return <Grid3X3 className="h-5 w-5 text-primary" />;
      case "reaction":
        return <Clock className="h-5 w-5 text-primary" />;
      default:
        return <Brain className="h-5 w-5 text-primary" />;
    }
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
      case "hard":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
      default:
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getIcon(challenge.gameType)}
            Daily Challenge
          </CardTitle>
          <Badge className={`${getDifficultyColor(challenge.difficulty)} capitalize`}>
            {challenge.difficulty}
          </Badge>
        </div>
        <CardDescription>
          Complete today&apos;s challenge to earn points
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium text-lg">{challenge.title}</h3>
          <p className="text-muted-foreground text-sm">{challenge.description}</p>
        </div>
        
        <div className="bg-muted/50 p-3 rounded-lg flex items-center justify-between">
          <div className="text-sm font-medium">Reward</div>
          <div className="flex items-center gap-1">
            <div className="text-lg font-bold">{challenge.points}</div>
            <div className="text-xs text-muted-foreground">pts</div>
          </div>
        </div>
        
        {challenge.isCompleted ? (
          <div className="w-full">
            <Button variant="outline" className="w-full" disabled>
              <Check className="h-4 w-4 mr-2" />
              Completed
              {challenge.earnedPoints && <span className="ml-2">+{challenge.earnedPoints} pts</span>}
            </Button>
          </div>
        ) : (
          <Link href={challenge.link} className="block w-full">
            <Button className="w-full">
              Start Challenge
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
} 