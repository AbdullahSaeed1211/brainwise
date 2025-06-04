"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  SmilePlus,
  SmileIcon,
  MehIcon,
  FrownIcon,
  CloudRainIcon,
  SunIcon,
  ChevronRightIcon
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type Mood = "great" | "good" | "okay" | "poor" | "bad";

interface MoodEntry {
  date: Date;
  mood: Mood;
  notes?: string;
  factors?: string[];
}

// Emoji mapping for each mood type
const moodEmojis = {
  great: <SmilePlus className="h-6 w-6 text-emerald-500" />,
  good: <SmileIcon className="h-6 w-6 text-green-500" />,
  okay: <MehIcon className="h-6 w-6 text-amber-500" />,
  poor: <FrownIcon className="h-6 w-6 text-orange-500" />,
  bad: <CloudRainIcon className="h-6 w-6 text-red-500" />
};

const moodLabels = {
  great: "Great",
  good: "Good", 
  okay: "Okay",
  poor: "Poor",
  bad: "Bad"
};

const moodColors = {
  great: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
  good: "bg-green-100 text-green-800 hover:bg-green-200",
  okay: "bg-amber-100 text-amber-800 hover:bg-amber-200",
  poor: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  bad: "bg-red-100 text-red-800 hover:bg-red-200"
};

// Common factors that can affect mood
const commonFactors = [
  "Sleep Quality",
  "Physical Activity",
  "Nutrition",
  "Stress Level",
  "Social Interaction",
  "Screen Time",
  "Work Satisfaction",
  "Medication"
];

export function MoodTracker() {
  const [date, setDate] = useState<Date>(new Date());
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("log");
  const [isLoading, setIsLoading] = useState(true);

  // Calculate dates with entries for highlighting on calendar
  const datesWithEntries = moodEntries.map(entry => entry.date.toDateString());
  
  // Find an entry for the selected date
  const selectedDateEntry = moodEntries.find(
    entry => entry.date.toDateString() === date.toDateString()
  );

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Log a new mood entry
  const handleLogMood = () => {
    if (!selectedMood) return;
    
    const newEntry: MoodEntry = {
      date: new Date(date),
      mood: selectedMood,
      notes: notes.trim() || undefined,
      factors: selectedFactors.length > 0 ? [...selectedFactors] : undefined
    };
    
    // Remove any existing entry for this date
    const filteredEntries = moodEntries.filter(
      entry => entry.date.toDateString() !== date.toDateString()
    );
    
    // Add the new entry
    setMoodEntries([...filteredEntries, newEntry]);
    
    // Reset the form
    setSelectedMood(null);
    setNotes("");
    setSelectedFactors([]);
    
    // Switch to insights tab
    setActiveTab("insights");
    
    // Add loading state when switching to insights
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  // Toggle a factor selection
  const toggleFactor = (factor: string) => {
    if (selectedFactors.includes(factor)) {
      setSelectedFactors(selectedFactors.filter(f => f !== factor));
    } else {
      setSelectedFactors([...selectedFactors, factor]);
    }
  };

  // Calculate mood distribution
  const calculateMoodDistribution = () => {
    const distribution: Record<Mood, number> = {
      great: 0,
      good: 0,
      okay: 0,
      poor: 0,
      bad: 0
    };
    
    moodEntries.forEach(entry => {
      distribution[entry.mood]++;
    });
    
    return distribution;
  };

  // Get weekly mood trend
  const getWeeklyTrend = () => {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const weekEntries = moodEntries.filter(entry => 
      entry.date >= lastWeek && entry.date <= today
    );
    
    // Sort by date
    weekEntries.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    return weekEntries;
  };

  // Find most common mood factors
  const getCommonFactors = () => {
    const factorCounts: Record<string, number> = {};
    
    moodEntries.forEach(entry => {
      if (entry.factors) {
        entry.factors.forEach(factor => {
          factorCounts[factor] = (factorCounts[factor] || 0) + 1;
        });
      }
    });
    
    // Convert to array and sort by count
    const sortedFactors = Object.entries(factorCounts)
      .map(([factor, count]) => ({ factor, count }))
      .sort((a, b) => b.count - a.count);
    
    return sortedFactors.slice(0, 5); // Return top 5
  };

  // Render the log mood form
  const renderMoodForm = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <div>
            <Skeleton className="h-5 w-48 mb-2" />
            <div className="flex justify-between">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-16 rounded-lg" />
              ))}
            </div>
          </div>
          
          <div>
            <Skeleton className="h-5 w-64 mb-2" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Skeleton key={i} className="h-6 w-20 rounded-full" />
              ))}
            </div>
          </div>
          
          <div>
            <Skeleton className="h-5 w-48 mb-2" />
            <Skeleton className="h-20 w-full rounded-md" />
          </div>
          
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">How are you feeling today?</h3>
          <div className="flex justify-between">
            {(Object.keys(moodEmojis) as Mood[]).map(mood => (
              <button
                key={mood}
                onClick={() => setSelectedMood(mood)}
                className={cn(
                  "flex flex-col items-center p-2 rounded-lg transition-colors",
                  selectedMood === mood ? moodColors[mood] : "hover:bg-muted"
                )}
              >
                <div className="mb-1">{moodEmojis[mood]}</div>
                <span className="text-xs font-medium">{moodLabels[mood]}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">What factors affected your mood?</h3>
          <div className="flex flex-wrap gap-2">
            {commonFactors.map(factor => (
              <Badge
                key={factor}
                variant={selectedFactors.includes(factor) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleFactor(factor)}
              >
                {factor}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Any notes about your day?</h3>
          <textarea
            className="w-full p-2 border rounded-md h-20 text-sm"
            placeholder="How was your day? What happened?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        
        <Button 
          onClick={handleLogMood} 
          disabled={!selectedMood}
          className="w-full"
        >
          Log Mood
        </Button>
      </div>
    );
  };

  // Render insights based on mood data
  const renderInsights = () => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
            <Skeleton className="h-6 w-48 mx-auto mb-2" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
          
          <div>
            <Skeleton className="h-5 w-48 mb-3" />
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <Skeleton className="h-6 w-6 rounded-full mb-1" />
                  <Skeleton className="h-24 w-full rounded-md" />
                  <Skeleton className="h-4 w-4 mt-1" />
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <Skeleton className="h-5 w-48 mb-3" />
            <Skeleton className="h-16 w-full rounded-md" />
          </div>
          
          <div>
            <Skeleton className="h-5 w-48 mb-3" />
            <Skeleton className="h-32 w-full rounded-md" />
          </div>
        </div>
      );
    }
    
    if (moodEntries.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center p-3 bg-muted rounded-full mb-4">
            <SunIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No mood data yet</h3>
          <p className="text-muted-foreground mb-4">
            Start logging your daily moods to see patterns and insights.
          </p>
          <Button onClick={() => setActiveTab("log")}>Log Your First Mood</Button>
        </div>
      );
    }
    
    const distribution = calculateMoodDistribution();
    const weeklyTrend = getWeeklyTrend();
    const topFactors = getCommonFactors();
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-3">Your Mood Distribution</h3>
          <div className="grid grid-cols-5 gap-2">
            {(Object.keys(distribution) as Mood[]).map(mood => (
              <div key={mood} className="flex flex-col items-center">
                <div className="mb-1">{moodEmojis[mood]}</div>
                <div className="h-24 w-full bg-muted rounded-md relative overflow-hidden">
                  <div 
                    className={cn(
                      "absolute bottom-0 w-full transition-all duration-500",
                      moodColors[mood].split(" ")[0]
                    )}
                    style={{ 
                      height: `${moodEntries.length > 0 
                        ? (distribution[mood] / moodEntries.length) * 100 
                        : 0}%` 
                    }}
                  />
                </div>
                <span className="text-xs font-medium mt-1">{distribution[mood]}</span>
              </div>
            ))}
          </div>
        </div>
        
        {weeklyTrend.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3">Your Week at a Glance</h3>
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between">
                  {weeklyTrend.map((entry, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div>{moodEmojis[entry.mood]}</div>
                      <span className="text-xs mt-1">
                        {entry.date.toLocaleDateString(undefined, { weekday: 'short' })}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {topFactors.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3">Common Mood Factors</h3>
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {topFactors.map(({ factor, count }) => (
                  <div key={factor} className="flex justify-between items-center">
                    <span className="text-sm">{factor}</span>
                    <div className="flex items-center gap-2">
                      <div className="bg-muted h-2 w-24 rounded-full overflow-hidden">
                        <div 
                          className="bg-primary h-full"
                          style={{ width: `${(count / moodEntries.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
        
        <div>
          <h3 className="text-sm font-medium mb-3">Mood Insights</h3>
          <Card>
            <CardContent className="p-4 text-sm">
              {moodEntries.length < 5 ? (
                <p>
                  Keep logging your moods! We&apos;ll generate personalized insights once you have at least 5 entries.
                </p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(distribution).sort((a, b) => b[1] - a[1])[0][0] === "great" || 
                   Object.entries(distribution).sort((a, b) => b[1] - a[1])[0][0] === "good" ? (
                    <p>
                      <span className="font-medium">Positive Trend:</span> Most of your entries are positive, which is great for brain health!
                    </p>
                  ) : Object.entries(distribution).sort((a, b) => b[1] - a[1])[0][0] === "bad" || 
                     Object.entries(distribution).sort((a, b) => b[1] - a[1])[0][0] === "poor" ? (
                    <p>
                      <span className="font-medium">Challenging Period:</span> You seem to be going through a difficult time. Consider discussing with a healthcare provider.
                    </p>
                  ) : (
                    <p>
                      <span className="font-medium">Mixed Moods:</span> Your mood varies throughout the week, which is normal.
                    </p>
                  )}
                  
                  {topFactors.length > 0 && (
                    <p>
                      <span className="font-medium">Key Factor:</span> {topFactors[0].factor} appears to have the strongest impact on your mood.
                    </p>
                  )}
                  
                  <p className="text-muted-foreground text-xs mt-2">
                    Regular mood tracking helps you recognize patterns and improve emotional awareness.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Render entry details for the selected date
  const renderEntryDetails = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
          
          <div>
            <Skeleton className="h-5 w-16 mb-2" />
            <div className="flex flex-wrap gap-1">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-5 w-16 rounded-full" />
              ))}
            </div>
          </div>
          
          <div>
            <Skeleton className="h-5 w-16 mb-1" />
            <Skeleton className="h-20 w-full rounded-md" />
          </div>
        </div>
      );
    }
    
    if (!selectedDateEntry) {
      return (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">No entry for this date</p>
          <Button variant="outline" className="mt-2" onClick={() => setActiveTab("log")}>
            Add Entry
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {moodEmojis[selectedDateEntry.mood]}
            <span className="font-medium">{moodLabels[selectedDateEntry.mood]}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setActiveTab("log")}>
            Edit
          </Button>
        </div>
        
        {selectedDateEntry.factors && selectedDateEntry.factors.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Factors</h3>
            <div className="flex flex-wrap gap-1">
              {selectedDateEntry.factors.map(factor => (
                <Badge key={factor} variant="secondary" className="text-xs">
                  {factor}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {selectedDateEntry.notes && (
          <div>
            <h3 className="text-sm font-medium mb-1">Notes</h3>
            <p className="text-sm text-muted-foreground">{selectedDateEntry.notes}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SmileIcon className="h-5 w-5 text-primary" />
            Mood Tracker
          </CardTitle>
          <CardDescription>
            Track your daily moods to discover patterns and improve wellbeing
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-b">
            {isLoading ? (
              <div className="p-4">
                <Skeleton className="h-64 w-full rounded-md" />
              </div>
            ) : (
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                className="p-0"
                modifiers={{
                  booked: (date) => datesWithEntries.includes(date.toDateString())
                }}
                modifiersStyles={{
                  booked: {
                    backgroundColor: 'var(--primary-50)',
                    fontWeight: 'bold'
                  }
                }}
              />
            )}
          </div>
          
          <div className="p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="log">Log Mood</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
              </TabsList>
              
              <TabsContent value="calendar" className="space-y-4">
                <div className="text-sm font-medium">
                  {date.toLocaleDateString(undefined, { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                {renderEntryDetails()}
              </TabsContent>
              
              <TabsContent value="log">
                {renderMoodForm()}
              </TabsContent>
              
              <TabsContent value="insights">
                {renderInsights()}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <div className="text-xs text-muted-foreground">
            {moodEntries.length} entries total
          </div>
          <div className="flex items-center text-xs text-primary cursor-pointer">
            <span className="font-medium">View Brain Health Tips</span>
            <ChevronRightIcon className="h-3 w-3 ml-1" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 