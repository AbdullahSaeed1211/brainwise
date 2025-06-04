"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Calendar, Flame, CheckCircle2 } from "lucide-react";

interface Activity {
  id: string;
  name: string;
  description: string;
  completionRate: number;
  streak: number;
  lastCompleted: Date | null;
  icon: "memory" | "meditation" | "assessment" | "mood";
}

export function ProgressSystem() {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "memory-game",
      name: "Memory Game",
      description: "Train your short-term memory",
      completionRate: 65,
      streak: 3,
      lastCompleted: new Date(),
      icon: "memory"
    },
    {
      id: "meditation",
      name: "Meditation Timer",
      description: "Daily mindfulness practice",
      completionRate: 80,
      streak: 7,
      lastCompleted: new Date(),
      icon: "meditation"
    },
    {
      id: "cognitive-assessment",
      name: "Cognitive Assessment",
      description: "Weekly brain evaluation",
      completionRate: 30,
      streak: 0,
      lastCompleted: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      icon: "assessment"
    },
    {
      id: "mood-tracker",
      name: "Mood Tracking",
      description: "Daily mood logging",
      completionRate: 50,
      streak: 1,
      lastCompleted: new Date(),
      icon: "mood"
    }
  ]);
  
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  
  const getActivityIcon = (icon: string) => {
    switch (icon) {
      case "memory":
        return <Trophy className="h-5 w-5 text-indigo-500" />;
      case "meditation":
        return <Flame className="h-5 w-5 text-purple-500" />;
      case "assessment":
        return <Target className="h-5 w-5 text-blue-500" />;
      case "mood":
        return <Calendar className="h-5 w-5 text-green-500" />;
      default:
        return <CheckCircle2 className="h-5 w-5 text-primary" />;
    }
  };
  
  const getStreakClass = (streak: number) => {
    if (streak >= 7) return "text-orange-500";
    if (streak >= 3) return "text-amber-500";
    return "text-muted-foreground";
  };
  
  const getLastCompletedText = (date: Date | null) => {
    if (!date) return "Never completed";
    
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return "Over a month ago";
  };
  
  const completeActivity = (id: string) => {
    setActivities(prev => 
      prev.map(activity => {
        if (activity.id === id) {
          const wasCompletedToday = activity.lastCompleted && 
            new Date(activity.lastCompleted).toDateString() === new Date().toDateString();
          
          return {
            ...activity,
            completionRate: Math.min(100, activity.completionRate + 5),
            streak: wasCompletedToday ? activity.streak : activity.streak + 1,
            lastCompleted: new Date()
          };
        }
        return activity;
      })
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Progress</h2>
        <div className="flex items-center gap-2 text-sm">
          <Flame className="w-4 h-4 text-orange-500" />
          <span>Current Streak: 
            <span className="font-bold text-orange-500 ml-1">
              {Math.max(...activities.map(a => a.streak))} days
            </span>
          </span>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence>
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedActivity(activity.id === selectedActivity ? null : activity.id)}
              className="cursor-pointer"
            >
              <Card className={`h-full transition-all ${activity.id === selectedActivity ? 'ring-2 ring-primary' : ''}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {getActivityIcon(activity.icon)}
                      <CardTitle className="text-base">{activity.name}</CardTitle>
                    </div>
                    <div className={`text-sm font-medium flex items-center gap-1 ${getStreakClass(activity.streak)}`}>
                      <Flame className="h-3.5 w-3.5" />
                      <span>{activity.streak}</span>
                    </div>
                  </div>
                  <CardDescription className="text-xs">{activity.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Completion</span>
                      <span className="font-medium">{activity.completionRate}%</span>
                    </div>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${activity.completionRate}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    >
                      <Progress value={activity.completionRate} className="h-2" />
                    </motion.div>
                    <div className="text-xs text-muted-foreground">
                      Last completed: {getLastCompletedText(activity.lastCompleted)}
                    </div>
                  </div>
                </CardContent>
                
                {activity.id === selectedActivity && (
                  <CardFooter className="pt-0">
                    <Button 
                      size="sm" 
                      className="w-full text-xs" 
                      onClick={(e) => {
                        e.stopPropagation();
                        completeActivity(activity.id);
                      }}
                    >
                      Complete Today
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <div className="flex justify-between items-center pt-4">
        <div className="text-sm text-muted-foreground">
          Complete daily activities to build your streak and improve your brain health score.
        </div>
        <Button variant="outline" size="sm">View All Activities</Button>
      </div>
    </div>
  );
} 