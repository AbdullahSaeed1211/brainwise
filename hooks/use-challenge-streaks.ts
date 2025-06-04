"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import { useToast } from "./use-toast";
import { addDays, format, isSameDay, parseISO, subDays } from "date-fns";

interface ChallengeStats {
  currentStreak: number;
  longestStreak: number;
  lastActiveDay: string | null;
  totalPoints: number;
  completedToday: string[];
  challengeHistory: DailyChallengeHistory[];
  unlockedRewards: Reward[];
  nextRewards: Reward[];
}

interface DailyChallengeHistory {
  date: string;
  formattedDate: string;
  completedChallenges: string[];
  totalChallenges: number;
  points: number;
}

interface Reward {
  id: string;
  title: string;
  requirementType: "streak" | "points";
  requirementValue: number;
  isUnlocked: boolean;
}

interface ChallengeCompletion {
  _id: string;
  user: string;
  challengeDate: string;
  completedAt: string;
  points: number;
  gameType: string;
  earnedPoints: number;
  gameResultId?: string;
}

export function useChallengeStreaks() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<ChallengeStats>({
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDay: null,
    totalPoints: 0,
    completedToday: [],
    challengeHistory: [],
    unlockedRewards: [],
    nextRewards: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define rewards with useMemo to prevent recreation on every render
  const availableRewards = useMemo<Reward[]>(() => [
    { id: "reward-1", title: "3-Day Streak Badge", requirementType: "streak", requirementValue: 3, isUnlocked: false },
    { id: "reward-2", title: "7-Day Streak Badge", requirementType: "streak", requirementValue: 7, isUnlocked: false },
    { id: "reward-3", title: "14-Day Streak Badge", requirementType: "streak", requirementValue: 14, isUnlocked: false },
    { id: "reward-4", title: "30-Day Streak Badge", requirementType: "streak", requirementValue: 30, isUnlocked: false },
    { id: "reward-5", title: "Bronze Brain", requirementType: "points", requirementValue: 500, isUnlocked: false },
    { id: "reward-6", title: "Silver Brain", requirementType: "points", requirementValue: 1000, isUnlocked: false },
    { id: "reward-7", title: "Gold Brain", requirementType: "points", requirementValue: 2500, isUnlocked: false },
    { id: "reward-8", title: "Platinum Brain", requirementType: "points", requirementValue: 5000, isUnlocked: false },
  ], []);

  // Helper to update rewards status
  const updateRewards = (rewards: Reward[], streak: number, points: number): Reward[] => {
    return rewards.map(reward => ({
      ...reward,
      isUnlocked: reward.requirementType === "streak" 
        ? streak >= reward.requirementValue 
        : points >= reward.requirementValue
    })).filter(reward => reward.isUnlocked);
  };

  // Helper to get next rewards to achieve
  const getNextRewards = (rewards: Reward[]): Reward[] => {
    // Filter rewards that are not yet unlocked
    const nextStreakReward = rewards
      .filter(r => r.requirementType === "streak" && !r.isUnlocked)
      .sort((a, b) => a.requirementValue - b.requirementValue)[0];
    
    const nextPointsReward = rewards
      .filter(r => r.requirementType === "points" && !r.isUnlocked)
      .sort((a, b) => a.requirementValue - b.requirementValue)[0];
    
    return [nextStreakReward, nextPointsReward].filter(Boolean) as Reward[];
  };
  
  // Define calculateStatsLocally first to avoid circular dependency
  const calculateStatsLocally = useCallback(() => {
    console.log('Calculating challenge stats locally from storage');
    
    try {
      // Get completions from localStorage
      const storedCompletions = localStorage.getItem('challengeCompletions');
      const completions: ChallengeCompletion[] = storedCompletions 
        ? JSON.parse(storedCompletions) 
        : [];
      
      // Sort by date
      completions.sort((a, b) => 
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      );
      
      // Group by date
      const completionsByDay = new Map<string, ChallengeCompletion[]>();
      
      completions.forEach(completion => {
        const dateKey = format(parseISO(completion.challengeDate), 'yyyy-MM-dd');
        if (!completionsByDay.has(dateKey)) {
          completionsByDay.set(dateKey, []);
        }
        completionsByDay.get(dateKey)!.push(completion);
      });
      
      // Calculate streak
      let currentStreak = 0;
      let longestStreak = 0;
      let lastActiveDay: string | null = null;
      let totalPoints = 0;
      
      // Check if there's a completion today
      const today = format(new Date(), 'yyyy-MM-dd');
      const hasCompletionToday = completionsByDay.has(today);
      
      if (hasCompletionToday) {
        currentStreak = 1;
        lastActiveDay = today;
      }
      
      // Get all dates in descending order (newest first)
      const dates = Array.from(completionsByDay.keys())
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      
      // If we have any completions
      if (dates.length > 0) {
        // If we didn't already set lastActiveDay from today's completion
        if (!lastActiveDay) {
          lastActiveDay = dates[0];
        }
        
        // Calculate total points
        completions.forEach(completion => {
          totalPoints += completion.earnedPoints;
        });
        
        // Calculate current streak
        if (hasCompletionToday) {
          // Start with 1 for today
          let checkDate = subDays(new Date(), 1);
          let consecutiveDays = 1;
          
          while (true) {
            const dateToCheck = format(checkDate, 'yyyy-MM-dd');
            if (completionsByDay.has(dateToCheck)) {
              consecutiveDays++;
              checkDate = subDays(checkDate, 1);
            } else {
              break;
            }
          }
          
          currentStreak = consecutiveDays;
        } else if (dates.length > 0) {
          // Check if last completion was yesterday
          const lastCompletionDate = parseISO(dates[0]);
          const yesterday = subDays(new Date(), 1);
          
          if (isSameDay(lastCompletionDate, yesterday)) {
            let checkDate = subDays(yesterday, 1);
            let consecutiveDays = 1; // Start with 1 for yesterday
            
            while (true) {
              const dateToCheck = format(checkDate, 'yyyy-MM-dd');
              if (completionsByDay.has(dateToCheck)) {
                consecutiveDays++;
                checkDate = subDays(checkDate, 1);
              } else {
                break;
              }
            }
            
            currentStreak = consecutiveDays;
          }
        }
        
        // Calculate longest streak
        let tempStreak = 0;
        const datesSorted = [...dates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
        
        for (let i = 0; i < datesSorted.length; i++) {
          const currentDate = new Date(datesSorted[i]);
          
          if (i === 0) {
            tempStreak = 1;
          } else {
            const prevDate = new Date(datesSorted[i - 1]);
            const expectedDate = addDays(prevDate, 1);
            
            if (isSameDay(currentDate, expectedDate)) {
              tempStreak++;
            } else {
              if (tempStreak > longestStreak) {
                longestStreak = tempStreak;
              }
              tempStreak = 1;
            }
          }
        }
        
        // Check the last streak
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      }
      
      // Create challenge history
      const challengeHistory: DailyChallengeHistory[] = [];
      
      dates.forEach(date => {
        const dayCompletions = completionsByDay.get(date) || [];
        const dayPoints = dayCompletions.reduce((sum, c) => sum + c.earnedPoints, 0);
        const completedChallenges = dayCompletions.map(c => c.gameType);
        
        challengeHistory.push({
          date,
          formattedDate: format(parseISO(date), 'MMM d, yyyy'),
          completedChallenges,
          totalChallenges: 1, // Assuming 1 challenge per day
          points: dayPoints
        });
      });
      
      // Get completed challenges for today
      const completedToday = hasCompletionToday 
        ? completionsByDay.get(today)!.map(c => c.gameType)
        : [];
      
      // Update rewards
      const unlockedRewards = updateRewards(availableRewards, currentStreak, totalPoints);
      const nextRewards = getNextRewards(availableRewards);
      
      setStats({
        currentStreak,
        longestStreak,
        lastActiveDay,
        totalPoints,
        completedToday,
        challengeHistory,
        unlockedRewards,
        nextRewards
      });
    } catch (err) {
      console.error('Error calculating local stats:', err);
      // Reset to defaults
      setStats({
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDay: null,
        totalPoints: 0,
        completedToday: [],
        challengeHistory: [],
        unlockedRewards: [],
        nextRewards: getNextRewards(availableRewards)
      });
    }
  }, [availableRewards]);
  
  // Now define fetchCompletions after calculateStatsLocally is defined
  const fetchCompletions = useCallback(async () => {
    if (!isLoaded) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (isSignedIn && userId) {
        // For signed-in users, fetch from API
        try {
          // Get completions from the last 30 days
          const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd');
          const response = await fetch(`/api/user/challenge-stats?startDate=${thirtyDaysAgo}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });
          
          if (!response.ok) {
            throw new Error(`Failed to fetch challenge stats: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (data.success) {
            // Update stats with API data
            const apiStats = data.data;
            setStats({
              currentStreak: apiStats.currentStreak,
              longestStreak: apiStats.longestStreak,
              lastActiveDay: apiStats.lastActiveDay,
              totalPoints: apiStats.totalPoints,
              completedToday: apiStats.completedToday || [],
              challengeHistory: apiStats.challengeHistory || [],
              unlockedRewards: updateRewards(availableRewards, apiStats.currentStreak, apiStats.totalPoints),
              nextRewards: getNextRewards(availableRewards)
            });
          } else {
            throw new Error('Invalid response format');
          }
        } catch (err) {
          console.error('Failed to fetch from API, calculating locally:', err);
          calculateStatsLocally();
        }
      } else {
        // For non-signed in users, calculate locally
        calculateStatsLocally();
      }
    } catch (err) {
      console.error('Error in fetchCompletions:', err);
      setError('Failed to load challenge streaks');
      
      toast({
        title: "Couldn't load challenge streaks",
        description: "We'll use local data instead.",
        variant: "destructive",
      });
      
      calculateStatsLocally();
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, isSignedIn, userId, toast, availableRewards, calculateStatsLocally]);

  // Fetch completions on mount and when auth state changes
  useEffect(() => {
    if (isLoaded) {
      fetchCompletions();
    }
  }, [isLoaded, isSignedIn, fetchCompletions]);

  // Save completion to both API and localStorage
  const saveCompletion = useCallback(async (completion: Omit<ChallengeCompletion, '_id' | 'user'>) => {
    try {
      // Update local storage first for better UX
      const newCompletion = {
        ...completion,
        _id: `local-${Date.now()}`,
        user: userId || 'anonymous',
      };
      
      // Save to localStorage
      const storedCompletions = localStorage.getItem('challengeCompletions');
      const completions: ChallengeCompletion[] = storedCompletions 
        ? JSON.parse(storedCompletions) 
        : [];
      
      localStorage.setItem('challengeCompletions', JSON.stringify([
        newCompletion,
        ...completions
      ]));
      
      // If signed in, save to API
      if (isSignedIn && userId) {
        const response = await fetch('/api/user/daily-challenges', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            challengeDate: completion.challengeDate,
            gameResultId: completion.gameResultId,
          }),
        });
        
        if (!response.ok) {
          console.error('Failed to save completion to API:', await response.text());
        } else {
          console.log('Saved completion to API successfully');
        }
      }
      
      // Refresh stats
      fetchCompletions();
      
      return true;
    } catch (err) {
      console.error('Error saving completion:', err);
      toast({
        title: "Couldn't save challenge completion",
        description: "There was an error recording your progress.",
        variant: "destructive",
      });
      return false;
    }
  }, [isSignedIn, userId, fetchCompletions, toast]);

  // Return hook functions and state
  return {
    stats,
    isLoading,
    error,
    saveCompletion,
    refreshStats: fetchCompletions,
    getPointsUntilNextReward: (requirementType: "streak" | "points", requirementValue: number) => {
      if (requirementType !== "points") return 0;
      return Math.max(0, requirementValue - stats.totalPoints);
    },
    getDaysUntilNextReward: (requirementType: "streak" | "points", requirementValue: number) => {
      if (requirementType !== "streak") return 0;
      return Math.max(0, requirementValue - stats.currentStreak);
    }
  };
} 