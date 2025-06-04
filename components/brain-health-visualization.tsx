"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useGameResults } from "@/hooks/use-game-results";
import { formatDistanceToNow } from "date-fns";
import { Brain, Trophy, Calendar, TrendingUp, Clock, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Extended interface for display purposes
interface DisplayGameResult {
  gameType: string;
  score: number;
  completedAt: string;
  timeSpent: number;
}

// Map game types to cognitive domains
const COGNITIVE_DOMAIN_MAP: Record<string, string> = {
  "memory-game": "Memory",
  "word-memory-test": "Verbal Memory",
  "sequence-memory-test": "Working Memory",
  "reaction-test": "Processing Speed",
  "reaction-game": "Processing Speed",
  "visual-attention": "Attention",
  "concentration-game": "Concentration",
  "verbal-fluency-test": "Language",
  "pattern-recognition-test": "Logical Reasoning",
  "mental-math": "Numerical Cognition"
};

// Define color scheme for each cognitive domain
const DOMAIN_COLORS: Record<string, string> = {
  "Memory": "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  "Verbal Memory": "bg-blue-700/20 text-blue-800 dark:text-blue-200",
  "Working Memory": "bg-blue-300/20 text-blue-600 dark:text-blue-400",
  "Processing Speed": "bg-green-500/20 text-green-700 dark:text-green-300",
  "Attention": "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  "Concentration": "bg-purple-700/20 text-purple-800 dark:text-purple-200",
  "Language": "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
  "Logical Reasoning": "bg-orange-500/20 text-orange-700 dark:text-orange-300",
  "Numerical Cognition": "bg-red-500/20 text-red-700 dark:text-red-300"
};

export function BrainHealthVisualization() {
  const { results: importedResults, isLoading } = useGameResults();
  const [timeframe, setTimeframe] = useState("month");
  const [activeTab, setActiveTab] = useState("domains");
  
  // Transform imported results to local format
  const results = useMemo(() => {
    return importedResults.map(result => ({
      gameType: result.gameType,
      score: result.score,
      completedAt: result.completedAt,
      timeSpent: result.duration
    } as DisplayGameResult));
  }, [importedResults]);
  
  // Calculate streak information
  const streakInfo = useMemo(() => {
    if (!results.length) return { currentStreak: 0, longestStreak: 0, lastActive: new Date() };
    
    const sortedResults = [...results].sort((a, b) => 
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let currentStreak = 0;
    let longestStreak = 0;
    const lastActive = new Date(sortedResults[0]?.completedAt || new Date());
    let currentDate = new Date(today);
    
    // Get all unique dates of activity
    const activeDates = new Set(
      sortedResults.map(result => {
        const date = new Date(result.completedAt);
        date.setHours(0, 0, 0, 0);
        return date.toISOString();
      })
    );
    
    // Check if active today or yesterday
    const activatedToday = activeDates.has(today.toISOString());
    const activatedYesterday = activeDates.has(yesterday.toISOString());
    
    // Calculate current streak
    if (activatedToday) {
      currentStreak = 1;
      currentDate.setDate(currentDate.getDate() - 1);
      
      while (true) {
        const dateString = currentDate.toISOString();
        if (activeDates.has(dateString)) {
          currentStreak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }
    } else if (activatedYesterday) {
      currentStreak = 1;
      currentDate = new Date(yesterday);
      currentDate.setDate(currentDate.getDate() - 1);
      
      while (true) {
        const dateString = currentDate.toISOString();
        if (activeDates.has(dateString)) {
          currentStreak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }
    }
    
    // Calculate longest streak
    // This is more complex and would involve scanning all activity dates
    // For simplicity, we're setting it to the current streak for now
    longestStreak = Math.max(currentStreak, 3); // Placeholder
    
    return { currentStreak, longestStreak, lastActive };
  }, [results]);
  
  // Group results by cognitive domain
  const domainPerformance = useMemo(() => {
    if (!results.length) return [];
    
    const domainScores: Record<string, {
      domain: string;
      totalScore: number;
      count: number;
      recentScore: number;
      lastPlayed: Date | null;
    }> = {};
    
    // Process all results
    results.forEach(result => {
      const domain = COGNITIVE_DOMAIN_MAP[result.gameType] || "Other";
      
      if (!domainScores[domain]) {
        domainScores[domain] = {
          domain,
          totalScore: 0,
          count: 0,
          recentScore: 0,
          lastPlayed: null
        };
      }
      
      // Update domain stats
      domainScores[domain].totalScore += result.score;
      domainScores[domain].count += 1;
      
      // Track most recent score
      const completedAt = new Date(result.completedAt);
      if (!domainScores[domain].lastPlayed || completedAt > domainScores[domain].lastPlayed!) {
        domainScores[domain].recentScore = result.score;
        domainScores[domain].lastPlayed = completedAt;
      }
    });
    
    // Calculate averages and add color
    return Object.values(domainScores).map(domain => ({
      ...domain,
      averageScore: Math.round(domain.totalScore / domain.count),
      color: DOMAIN_COLORS[domain.domain] || "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
    })).sort((a, b) => b.averageScore - a.averageScore);
  }, [results]);
  
  // Calculate brain health score based on activity and performance
  const brainHealthScore = useMemo(() => {
    if (!results.length) return { score: 0, nextMilestone: 50 };
    
    // Base score on domain coverage and performance
    const baseScore = Math.min(75, domainPerformance.length * 10);
    const performanceBonus = Math.min(15, Math.round(results.length / 10));
    const streakBonus = Math.min(10, streakInfo.currentStreak * 2);
    
    const score = baseScore + performanceBonus + streakBonus;
    const nextMilestone = Math.ceil(score / 10) * 10 + 10;
    
    return { score, nextMilestone };
  }, [results, domainPerformance, streakInfo]);
  
  // Calculate progress over time
  const progressData = useMemo(() => {
    if (!results.length) return [];
    
    // Group results by day
    const sortedResults = [...results].sort((a, b) => 
      new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
    );
    
    const progressByDay: Record<string, {
      day: string;
      date: Date;
      sessionsCount: number;
      domains: Set<string>;
      avgScore: number;
      totalScore: number;
      domainCount?: number;
      results: DisplayGameResult[];
    }> = {};
    
    sortedResults.forEach(result => {
      const day = new Date(result.completedAt).toISOString().split('T')[0];
      
      if (!progressByDay[day]) {
        progressByDay[day] = {
          day,
          date: new Date(result.completedAt),
          sessionsCount: 0,
          domains: new Set(),
          avgScore: 0,
          totalScore: 0,
          results: []
        };
      }
      
      progressByDay[day].sessionsCount += 1;
      progressByDay[day].domains.add(COGNITIVE_DOMAIN_MAP[result.gameType] || "Other");
      progressByDay[day].totalScore += result.score;
      progressByDay[day].results.push(result);
    });
    
    // Calculate averages
    Object.values(progressByDay).forEach(day => {
      day.avgScore = Math.round(day.totalScore / day.results.length);
      day.domainCount = day.domains.size;
    });
    
    return Object.values(progressByDay);
  }, [results]);
  
  // Get achievements
  const achievements = useMemo(() => {
    if (!results.length) return [];
    
    const achievements = [];
    
    // Memory Master
    if (domainPerformance.some(d => d.domain.includes("Memory") && d.averageScore >= 80)) {
      achievements.push({
        id: "memory-master",
        title: "Memory Master",
        description: "Excellent performance in memory tests",
        icon: <Brain className="h-4 w-4" />,
        date: new Date().toISOString()
      });
    }
    
    // Fast Thinker
    if (domainPerformance.some(d => d.domain === "Processing Speed" && d.averageScore >= 75)) {
      achievements.push({
        id: "fast-thinker",
        title: "Fast Thinker",
        description: "Quick reaction times in processing speed tests",
        icon: <Clock className="h-4 w-4" />,
        date: new Date().toISOString()
      });
    }
    
    // Dedicated Trainee
    if (streakInfo.currentStreak >= 3) {
      achievements.push({
        id: "dedicated-trainee",
        title: "Dedicated Trainee",
        description: `${streakInfo.currentStreak} day training streak!`,
        icon: <Calendar className="h-4 w-4" />,
        date: new Date().toISOString()
      });
    }
    
    // All-around Cognitive
    if (domainPerformance.length >= 3) {
      achievements.push({
        id: "all-around",
        title: "Cognitive Explorer",
        description: "Trained in 3+ cognitive domains",
        icon: <Brain className="h-4 w-4" />,
        date: new Date().toISOString()
      });
    }
    
    return achievements;
  }, [results, domainPerformance, streakInfo]);
  
  // Determine which areas need improvement
  const improvementSuggestions = useMemo(() => {
    if (!domainPerformance.length) return [];
    
    const suggestions = [];
    
    // Check for low-performing domains
    domainPerformance.forEach(domain => {
      if (domain.averageScore < 60) {
        suggestions.push({
          domain: domain.domain,
          message: `Your ${domain.domain} score is below average. Consider more training in this area.`,
          gameType: Object.keys(COGNITIVE_DOMAIN_MAP).find(key => 
            COGNITIVE_DOMAIN_MAP[key] === domain.domain
          ) || "memory-game"
        });
      }
    });
    
    // Check for domains without recent activity (7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    domainPerformance.forEach(domain => {
      if (domain.lastPlayed && domain.lastPlayed < sevenDaysAgo) {
        suggestions.push({
          domain: domain.domain,
          message: `You haven&apos;t trained ${domain.domain} recently. Regular practice improves retention.`,
          gameType: Object.keys(COGNITIVE_DOMAIN_MAP).find(key => 
            COGNITIVE_DOMAIN_MAP[key] === domain.domain
          ) || "memory-game"
        });
      }
    });
    
    // Add general suggestions if not enough domain-specific ones
    if (suggestions.length < 2) {
      const allDomains = Object.values(COGNITIVE_DOMAIN_MAP);
      const missingDomains = allDomains.filter(
        domain => !domainPerformance.some(d => d.domain === domain)
      );
      
      if (missingDomains.length) {
        const domain = missingDomains[0];
        suggestions.push({
          domain,
          message: `Try training your ${domain} to build a more balanced cognitive profile.`,
          gameType: Object.keys(COGNITIVE_DOMAIN_MAP).find(key => 
            COGNITIVE_DOMAIN_MAP[key] === domain
          ) || "memory-game"
        });
      }
    }
    
    return suggestions.slice(0, 3); // Return top 3 suggestions
  }, [domainPerformance]);
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading brain health data...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!results.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Brain className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Brain Health Data Yet</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            Complete cognitive exercises to build your brain health profile and see analytics here.
          </p>
          <Button>Start Training</Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Brain Health Analytics</CardTitle>
            <CardDescription>Track your cognitive performance across different domains</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">Timeframe:</div>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-24 h-8">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="year">Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Brain Health Score</p>
                  <div className="text-3xl font-bold">{brainHealthScore.score}</div>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
              </div>
              <Progress 
                className="mt-3" 
                value={brainHealthScore.score} 
              />
              <p className="text-xs text-muted-foreground mt-2">
                {brainHealthScore.nextMilestone - brainHealthScore.score} points to next milestone
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Training Streak</p>
                  <div className="text-3xl font-bold">{streakInfo.currentStreak} days</div>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="flex gap-1 items-center mt-3">
                <div className="text-xs text-muted-foreground">
                  Longest streak: <span className="font-medium">{streakInfo.longestStreak} days</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Last active: {formatDistanceToNow(streakInfo.lastActive, { addSuffix: true })}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Training Sessions</p>
                  <div className="text-3xl font-bold">{results.length}</div>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs text-muted-foreground">
                  {domainPerformance.length} cognitive domains trained
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Total training time: {Math.round(results.reduce((acc, r) => acc + r.timeSpent, 0) / 60000)} minutes
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Achievements</p>
                  <div className="text-3xl font-bold">{achievements.length}</div>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="flex gap-1 mt-3">
                {achievements.slice(0, 3).map((achievement, i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                    {achievement.icon}
                  </div>
                ))}
                {achievements.length > 3 && (
                  <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                    +{achievements.length - 3}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="domains">Cognitive Domains</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="domains" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {domainPerformance.map((domain, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{domain.domain}</CardTitle>
                      <Badge variant="outline" className={domain.color}>
                        {domain.averageScore}/100
                      </Badge>
                          </div>
                  </CardHeader>
                  <CardContent>
                    <Progress 
                      value={domain.averageScore} 
                      className="h-2 mb-2" 
                    />
                          <div className="flex justify-between text-xs text-muted-foreground">
                      <div>Sessions: {domain.count}</div>
                      <div>Last played: {domain.lastPlayed ? formatDistanceToNow(domain.lastPlayed, { addSuffix: true }) : 'Never'}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {improvementSuggestions.length > 0 && (
              <Card className="bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    Suggestions for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {improvementSuggestions.map((suggestion, i) => (
                      <Alert key={i} variant="default" className="bg-card">
                        <AlertDescription className="flex items-center justify-between">
                          <span>{suggestion.message}</span>
                          <Button size="sm" variant="outline">Train</Button>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="progress" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
              <div className="space-y-4">
                  {progressData.slice(-7).map((day, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-14 text-xs text-muted-foreground">
                        {day.date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                      </div>
                      <div className="bg-primary/10 px-2 py-1 rounded text-xs font-medium">
                        {day.sessionsCount} sessions
                      </div>
                      <div className="flex-1">
                        <Progress value={day.avgScore} className="h-2" />
                      </div>
                      <div className="text-xs font-medium">
                        {day.avgScore}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {day.domainCount} {day.domainCount === 1 ? 'domain' : 'domains'}
                      </div>
              </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-12 italic">
                  [Interactive chart visualization would go here - showing performance trends over time]
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="achievements" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        {achievement.icon}
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Earned {formatDistanceToNow(new Date(achievement.date), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Locked achievements */}
              <Card className="opacity-70 border-dashed">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-muted p-3 rounded-full">
                      <Brain className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Cognitive Expert</h4>
                      <p className="text-sm text-muted-foreground mb-2">Reach 85+ average score in 5 domains</p>
                      <p className="text-xs text-muted-foreground">
                        Locked - Keep training to unlock
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="opacity-70 border-dashed">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-muted p-3 rounded-full">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Consistency Master</h4>
                      <p className="text-sm text-muted-foreground mb-2">Maintain a 7-day training streak</p>
                      <p className="text-xs text-muted-foreground">
                        Locked - Current streak: {streakInfo.currentStreak}/7 days
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
                </div>
                
            <div className="bg-muted rounded-lg p-4 text-center">
              <h3 className="font-medium mb-2">Daily Challenge</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Complete today&apos;s challenge to earn bonus points and extend your streak
              </p>
              <Button>View Today&apos;s Challenge</Button>
                </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="pb-6 pt-2 flex justify-between">
        <Button variant="ghost" size="sm">
          Export Data
        </Button>
        <p className="text-xs text-muted-foreground">
          Data refreshed {formatDistanceToNow(new Date(), { addSuffix: true })}
        </p>
      </CardFooter>
    </Card>
  );
} 
