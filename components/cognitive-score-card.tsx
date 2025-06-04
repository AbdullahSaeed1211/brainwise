"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from "lucide-react";
import { useState, useEffect } from "react";
import type { CognitiveScore } from "@/lib/types";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

// Define a more complete cognitive score type to use internally
interface ExtendedCognitiveScore {
  userId: string;
  domain: string;
  score: number;
  previousScore: number | null;
  lastUpdated: string;
}

interface DomainScore {
  domain: string;
  score: number;
  previousScore: number | null;
  change: number | null;
  changeDirection: "positive" | "negative" | "neutral";
  color: string;
  icon: React.ReactNode;
}

// Create a custom hook to fetch cognitive scores
export function useCognitiveScores() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const [cognitiveScores, setCognitiveScores] = useState<ExtendedCognitiveScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  // Fetch scores on component mount
  useEffect(() => {
    async function fetchScores() {
      if (!isLoaded) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        let scoresData: ExtendedCognitiveScore[] = [];
        
        // For signed in users, fetch from API
        if (isSignedIn && userId) {
          try {
            // Try to fetch from server first
            console.log('Fetching cognitive scores from server for user:', userId);
            // Add a timeout to the fetch to prevent long hanging
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            const response = await fetch('/api/user/cognitive-scores', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include', // Include credentials for auth
              signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            // Handle error responses
            if (!response.ok) {
              // Fall back to demo data immediately
              throw new Error(`Server responded with ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Successfully fetched cognitive scores from server:', data);
            
            // Check for both formats - either the results array directly or nested in a results property
            const resultsList = data.results || data;
            
            // Map API results to our ExtendedCognitiveScore format
            if (Array.isArray(resultsList) && resultsList.length > 0) {
              scoresData = resultsList.map(item => ({
                userId: userId,
                domain: item.domain,
                score: item.score,
                previousScore: item.previousScore,
                lastUpdated: item.assessmentDate
              }));
              setIsUsingMockData(false);
            } else {
              // Empty results, use demo data
              console.log('No cognitive scores found, using demo data');
              setIsUsingMockData(true);
              scoresData = [
                { userId: userId, domain: "Memory", score: 78, previousScore: 72, lastUpdated: new Date().toISOString() },
                { userId: userId, domain: "Attention", score: 82, previousScore: 85, lastUpdated: new Date().toISOString() },
                { userId: userId, domain: "Processing", score: 65, previousScore: 65, lastUpdated: new Date().toISOString() }
              ];
            }
          } catch (err) {
            // Log the detailed error for debugging
            console.error('Server fetch failed, using demo data', err);
            setIsUsingMockData(true);
            
            // Fall back to local storage if server fetch fails
            const localScores = localStorage.getItem('cognitiveScores');
            if (localScores) {
              try {
                const parsedScores = JSON.parse(localScores);
                if (Array.isArray(parsedScores)) {
                  console.log('Successfully loaded cognitive scores from localStorage');
                  scoresData = parsedScores;
                }
              } catch (parseError) {
                console.error('Error parsing localStorage cognitive scores:', parseError);
                scoresData = [
                  { userId: userId || "guest", domain: "Memory", score: 78, previousScore: 72, lastUpdated: new Date().toISOString() },
                  { userId: userId || "guest", domain: "Attention", score: 82, previousScore: 85, lastUpdated: new Date().toISOString() },
                  { userId: userId || "guest", domain: "Processing", score: 65, previousScore: 65, lastUpdated: new Date().toISOString() }
                ];
              }
            } else {
              // No local storage data, use default demo data
              scoresData = [
                { userId: userId || "guest", domain: "Memory", score: 78, previousScore: 72, lastUpdated: new Date().toISOString() },
                { userId: userId || "guest", domain: "Attention", score: 82, previousScore: 85, lastUpdated: new Date().toISOString() },
                { userId: userId || "guest", domain: "Processing", score: 65, previousScore: 65, lastUpdated: new Date().toISOString() }
              ];
            }
          }
        } 
        // For non-signed in users, fetch from localStorage
        else {
          console.log('User not signed in, using demo data');
          setIsUsingMockData(true);
          scoresData = [
            { userId: "guest", domain: "Memory", score: 78, previousScore: 72, lastUpdated: new Date().toISOString() },
            { userId: "guest", domain: "Attention", score: 82, previousScore: 85, lastUpdated: new Date().toISOString() },
            { userId: "guest", domain: "Processing", score: 65, previousScore: 65, lastUpdated: new Date().toISOString() }
          ];
        }
        
        setCognitiveScores(scoresData);
      } catch (err) {
        console.error('Error in fetchScores:', err);
        setError('Failed to load cognitive scores. Using demo data instead.');
        setIsUsingMockData(true);
        // Always provide demo data on error
        const demoScores = [
          { userId: userId || "guest", domain: "Memory", score: 78, previousScore: 72, lastUpdated: new Date().toISOString() },
          { userId: userId || "guest", domain: "Attention", score: 82, previousScore: 85, lastUpdated: new Date().toISOString() },
          { userId: userId || "guest", domain: "Processing", score: 65, previousScore: 65, lastUpdated: new Date().toISOString() }
        ];
        
        setCognitiveScores(demoScores);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchScores();
  }, [isLoaded, isSignedIn, userId]);

  // Function to save a new cognitive score
  const saveCognitiveScore = async (data: Pick<CognitiveScore, "domain" | "score">) => {
    try {
      // Get existing scores from localStorage for calculating previous score
      const existingScoresJSON = localStorage.getItem('cognitiveScores') || '[]';
      const existingScores: ExtendedCognitiveScore[] = JSON.parse(existingScoresJSON);
      
      // Find the latest score for this domain to use as previous score
      const existingScore = existingScores
        .filter(score => score.domain === data.domain)
        .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())[0];
      
      // Create new score object for the local state
      const newScore: ExtendedCognitiveScore = {
        userId: userId || "guest",
        domain: data.domain,
        score: data.score,
        previousScore: existingScore?.score || null,
        lastUpdated: new Date().toISOString()
      };
      
      // For signed in users, save to API
      if (isSignedIn && userId) {
        try {
          console.log('Saving cognitive score to server:', data);
          
          const payload = {
            domain: data.domain,
            score: data.score,
            source: data.domain.toLowerCase() + "-game",
            assessmentDate: new Date().toISOString()
          };
          
          console.log('Formatted payload for API:', payload);
          
          const response = await fetch('/api/user/cognitive-scores', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // Include credentials for auth
            body: JSON.stringify(payload),
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response from server:', response.status, errorText);
            throw new Error(`Failed to save to server: ${response.status} ${response.statusText}`);
          }
          
          const responseData = await response.json();
          console.log('Successfully saved cognitive score to server:', responseData);
          
          // Update the newScore with server data if available
          if (responseData.data) {
            newScore.previousScore = responseData.data.previousScore;
            newScore.lastUpdated = responseData.data.assessmentDate;
          }
        } catch (serverError) {
          console.error('Server save failed, falling back to localStorage only:', serverError);
          // Continue with localStorage save even if server fails
        }
      }
      
      // Always update localStorage for backup and offline capabilities
      const updatedScores = [newScore, ...existingScores];
      localStorage.setItem('cognitiveScores', JSON.stringify(updatedScores));
      
      // Update state
      setCognitiveScores(updatedScores);
      
      return newScore;
    } catch (error) {
      console.error("Failed to save cognitive score:", error);
      throw error;
    }
  };

  return {
    cognitiveScores,
    isLoading,
    error,
    isUsingMockData,
    saveCognitiveScore
  };
}

export function CognitiveScoreCard() {
  // Use our custom hook to fetch cognitive scores
  const { cognitiveScores, isLoading, isUsingMockData } = useCognitiveScores();
  const { isSignedIn } = useAuth();

  // Process and sort the scores
  const processedScores: DomainScore[] = useMemo(() => {
    if (!cognitiveScores?.length) return [];

    const latestScores = new Map<string, { score: number; previousScore: number | null; lastUpdated: string }>();
    
    // Get the latest score for each domain
    cognitiveScores.forEach(score => {
      const existing = latestScores.get(score.domain);
      if (!existing || new Date(score.lastUpdated) > new Date(existing.lastUpdated)) {
        latestScores.set(score.domain, {
          score: score.score,
          previousScore: score.previousScore,
          lastUpdated: score.lastUpdated
        });
      }
    });
    
    // Process into our display format
    return Array.from(latestScores.entries()).map(([domain, data]) => {
      const change = data.previousScore !== null 
        ? data.score - data.previousScore 
        : null;
      
      let changeDirection: "positive" | "negative" | "neutral" = "neutral";
      if (change !== null) {
        changeDirection = change > 0 ? "positive" : change < 0 ? "negative" : "neutral";
      }

      // Determine color based on score
      let color = "text-yellow-500";
      if (data.score > 80) color = "text-green-500";
      else if (data.score < 50) color = "text-red-500";
      
      // Determine change icon
      let icon = <MinusIcon className="h-4 w-4 text-gray-400" />;
      if (changeDirection === "positive") {
        icon = <ArrowUpIcon className="h-4 w-4 text-green-500" />;
      } else if (changeDirection === "negative") {
        icon = <ArrowDownIcon className="h-4 w-4 text-red-500" />;
      }
      
      return {
        domain,
        score: data.score,
        previousScore: data.previousScore,
        change,
        changeDirection,
        color,
        icon
      };
    }).sort((a, b) => b.score - a.score); // Sort highest to lowest
  }, [cognitiveScores]);

  // Calculate overall cognition score (average)
  const overallScore = useMemo(() => {
    if (processedScores.length === 0) return 0;
    
    const sum = processedScores.reduce((acc, curr) => acc + curr.score, 0);
    return Math.round(sum / processedScores.length);
  }, [processedScores]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cognitive Assessment</CardTitle>
          <CardDescription>Loading your cognitive scores...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cognitive Assessment</CardTitle>
        <CardDescription>Your performance across different cognitive domains</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-4xl font-bold">{overallScore}</div>
            <div className="text-sm text-muted-foreground">Overall Cognition</div>
          </div>
          
          <div className="space-y-6">
            {processedScores.map((score) => (
              <div key={score.domain} className="space-y-2">
                <div className="flex justify-between">
                  <div className="text-sm font-medium">{score.domain}</div>
                  <div className="flex items-center gap-1">
                    <div className={`text-sm font-semibold ${score.color}`}>
                      {score.score}
                    </div>
                    {score.change !== null && (
                      <div className="flex items-center text-xs">
                        {score.icon}
                        <span className={score.changeDirection === "positive" 
                          ? "text-green-500" 
                          : score.changeDirection === "negative" 
                            ? "text-red-500" 
                            : "text-gray-400"
                        }>
                          {Math.abs(score.change)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <Progress value={score.score} className="h-2" />
              </div>
            ))}
          </div>
          
          {isUsingMockData && (
            <div className="rounded-md bg-amber-50 dark:bg-amber-950 p-3 text-sm border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300">
              <div className="font-medium mb-1">Sample Data Displayed</div>
              <p className="text-xs mb-2">
                {isSignedIn 
                  ? "This is sample data because you haven't completed any cognitive assessments yet." 
                  : "This is sample data because you're not signed in."}
              </p>
              <div className="text-xs">
                {isSignedIn ? (
                  <Link href="/tools/cognitive-assessment" className="font-medium underline">
                    Take an assessment to see your real scores
                  </Link>
                ) : (
                  <Link href="/sign-in" className="font-medium underline">
                    Sign in to track your real scores
                  </Link>
                )}
              </div>
            </div>
          )}
          
          <div className="text-xs text-muted-foreground">
            <p>Based on your performance in cognitive games. Play more games to increase accuracy.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 