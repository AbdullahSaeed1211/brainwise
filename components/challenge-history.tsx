"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface CompletedChallenge {
  date: string;
  title: string;
  points: number;
  completed: boolean;
}

export function ChallengeHistory() {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  // Generate sample completed challenges data
  const completedChallenges = generateSampleData(currentMonth);

  // Change month handlers
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Challenge History</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPreviousMonth}
              className="h-7 w-7"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">{formatMonth(currentMonth)}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNextMonth}
              className="h-7 w-7"
              disabled={isCurrentMonth(currentMonth)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {completedChallenges.length > 0 ? (
            completedChallenges.map((challenge, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-2 rounded-md border bg-muted/30"
              >
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{challenge.title}</div>
                    <div className="text-xs text-muted-foreground">{challenge.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {challenge.completed ? (
                    <Badge variant="default" className="flex items-center gap-1 bg-green-500/10 text-green-500 border-green-300/20">
                      <Check className="h-3 w-3" /> Completed
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      Missed
                    </Badge>
                  )}
                  {challenge.completed && (
                    <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      +{challenge.points} pts
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground text-sm">
              No challenge history available for this month
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper functions
function isCurrentMonth(date: Date): boolean {
  const today = new Date();
  return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
}

function generateSampleData(month: Date): CompletedChallenge[] {
  const result: CompletedChallenge[] = [];
  const today = new Date();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  
  // Only generate data for current or past months
  if (month.getTime() > today.getTime()) {
    return [];
  }
  
  // Challenge titles
  const challenges = [
    "Memory Matrix Challenge",
    "Word Association Test",
    "Pattern Recognition",
    "Reaction Time Challenge",
    "Sequence Memory Test"
  ];
  
  // Generate random data for the month
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(month.getFullYear(), month.getMonth(), i);
    
    // Don't include future dates within the current month
    if (date > today) {
      break;
    }
    
    // Only include some days (not every day has a challenge)
    if (i % 2 === 0 || i % 3 === 0) {
      // 80% chance of completion
      const completed = Math.random() > 0.2;
      
      result.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        title: challenges[Math.floor(Math.random() * challenges.length)],
        points: Math.floor(Math.random() * 50) + 50, // Points between 50-100
        completed
      });
    }
  }
  
  return result;
} 