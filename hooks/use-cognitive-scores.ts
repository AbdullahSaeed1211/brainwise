"use client";

import { useState, useEffect } from "react";
import type { CognitiveScore } from "@/lib/types";
import { useAuth } from "@clerk/nextjs";

// Define the type for cognitive score input
interface CognitiveScoreInput {
  domain: string;
  score: number;
  source: string;
  assessmentDate?: Date;
  notes?: string;
  duration?: number;
}

export function useCognitiveScores(domain?: string) {
  const [scores, setScores] = useState<CognitiveScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoaded, isSignedIn } = useAuth();

  // Fetch cognitive scores when the component mounts
  useEffect(() => {
    if (!isLoaded) return; // Wait for auth to load
    
    async function fetchScores() {
      if (!isSignedIn) {
        // Not signed in - use local storage or return empty array
        try {
          const storedScores = localStorage.getItem('cognitiveScores');
          let data: CognitiveScore[] = [];
          
          if (storedScores) {
            data = JSON.parse(storedScores);
            // Filter by domain if specified
            if (domain) {
              data = data.filter(score => score.domain === domain);
            }
          }
          
          setScores(data);
          setIsLoading(false);
        } catch (err) {
          console.error("Error fetching local cognitive scores:", err);
          setError("Failed to load cognitive scores");
          setIsLoading(false);
        }
      } else {
        // Use API if signed in
        try {
          const url = new URL("/api/user/cognitive-scores", window.location.origin);
          
          // Add domain filter if provided
          if (domain) {
            url.searchParams.append("domain", domain);
          }
          
          const response = await fetch(url.toString());
          
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (data.success) {
            setScores(data.data.results);
          } else {
            throw new Error(data.error || "Failed to load cognitive scores");
          }
          
          setIsLoading(false);
        } catch (err) {
          console.error("Error fetching cognitive scores:", err);
          setError(err instanceof Error ? err.message : "Failed to load cognitive scores");
          setIsLoading(false);
        }
      }
    }
    
    fetchScores();
  }, [isLoaded, isSignedIn, domain]);

  // Save a cognitive score
  const saveCognitiveScore = async (score: CognitiveScoreInput) => {
    try {
      setIsLoading(true);
      
      if (!isSignedIn) {
        // Not signed in - save to local storage
        // Get previous scores first
        const storedScores = localStorage.getItem('cognitiveScores');
        const allScores: CognitiveScore[] = storedScores ? JSON.parse(storedScores) : [];
        
        // Find previous score for this domain (if any)
        const previousScore = allScores
          .filter(s => s.domain === score.domain)
          .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())[0]?.score || null;
        
        // Create new score object
        const newScore: CognitiveScore = {
          domain: score.domain,
          score: score.score,
          change: previousScore !== null ? score.score - previousScore : undefined,
          lastUpdated: (score.assessmentDate || new Date()).toISOString()
        };
        
        // Update scores array
        const updatedScores = [newScore, ...allScores];
        
        // Save to localStorage
        localStorage.setItem('cognitiveScores', JSON.stringify(updatedScores));
        
        // Update state with filtered scores if domain is specified
        if (domain) {
          setScores(updatedScores.filter(s => s.domain === domain));
        } else {
          setScores(updatedScores);
        }
      } else {
        // Save to API if signed in
        const response = await fetch("/api/user/cognitive-scores", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            domain: score.domain,
            score: score.score,
            source: score.source,
            assessmentDate: score.assessmentDate || new Date(),
            notes: score.notes,
            duration: score.duration
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || "Failed to save cognitive score");
        }
        
        // Refresh the scores after saving
        const url = new URL("/api/user/cognitive-scores", window.location.origin);
        
        // Add domain filter if provided
        if (domain) {
          url.searchParams.append("domain", domain);
        }
        
        const refreshResponse = await fetch(url.toString());
        const refreshData = await refreshResponse.json();
        
        if (refreshData.success) {
          setScores(refreshData.data.results);
        }
      }
      
      setError(null);
    } catch (err) {
      console.error("Error saving cognitive score:", err);
      setError(err instanceof Error ? err.message : "Failed to save cognitive score");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    scores,
    isLoading,
    error,
    saveCognitiveScore,
  };
} 