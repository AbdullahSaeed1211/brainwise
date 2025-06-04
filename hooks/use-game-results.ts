"use client";

import { useState, useEffect, useCallback } from "react";
import type { GameResult } from "@/lib/types";
import { useAuth } from "@clerk/nextjs";
import { v4 as uuidv4 } from "uuid";

// Define the type for game result input
interface GameResultInput {
  gameType: string;
  score: number;
  level?: number;
  duration: number;
  difficulty?: string;
  accuracy?: number;
  metrics?: Record<string, unknown>;
  tags?: string[];
}

export function useGameResults() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const [results, setResults] = useState<GameResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch results on component mount
  useEffect(() => {
    async function fetchResults() {
      if (!isLoaded) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // For signed in users, fetch from API
        if (isSignedIn && userId) {
          try {
            // Try to fetch from server first
            console.log('Fetching game results from server for user:', userId);
            const response = await fetch('/api/user/game-results', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include', // Include credentials for auth
            });
            
            if (!response.ok) {
              const errorText = await response.text();
              console.error('Server response not OK:', response.status, errorText);
              throw new Error(`Failed to fetch from server: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Successfully fetched game results from server:', data);
            
            // Check for both formats - either the results array directly or nested in a results property
            const resultsList = data.results || data;
            
            // Validate that we received an array
            if (!Array.isArray(resultsList)) {
              console.error('Received invalid results format from server:', data);
              throw new Error('Server returned invalid data format');
            }
            
            setResults(resultsList);
          } catch (err) {
            // Log the detailed error for debugging
            console.error('Server fetch failed, using local storage as fallback', err);
            
            // Fall back to local storage if server fetch fails
            const localResults = localStorage.getItem('gameResults');
            if (localResults) {
              try {
                const parsedResults = JSON.parse(localResults);
                if (Array.isArray(parsedResults)) {
                  console.log('Successfully loaded game results from localStorage');
                  setResults(parsedResults);
                } else {
                  console.error('Invalid format in localStorage:', parsedResults);
                  setResults([]);
                }
              } catch (parseError) {
                console.error('Error parsing localStorage results:', parseError);
                setResults([]);
              }
            } else {
              console.log('No results found in localStorage');
              setResults([]);
            }
          }
        } 
        // For non-signed in users, fetch from localStorage
        else {
          console.log('User not signed in, using localStorage for game results');
          const localResults = localStorage.getItem('gameResults');
          if (localResults) {
            try {
              const parsedResults = JSON.parse(localResults);
              if (Array.isArray(parsedResults)) {
                setResults(parsedResults);
              } else {
                console.error('Invalid format in localStorage:', parsedResults);
                setResults([]);
              }
            } catch (parseError) {
              console.error('Error parsing localStorage results:', parseError);
              setResults([]);
            }
          } else {
            setResults([]);
          }
        }
      } catch (err) {
        console.error('Error in fetchResults:', err);
        setError('Failed to load results. Please try again later.');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchResults();
  }, [isLoaded, isSignedIn, userId]);

  // Save result to server function
  const saveResultToServer = async (result: GameResult) => {
    try {
      console.log('Saving game result to server:', result);
      
      const payload = {
        gameType: result.gameType,
        score: result.score,
        level: result.level,
        timeSpent: result.duration, // Match API field name
        difficulty: result.difficulty || 'medium', // Provide default difficulty
        movesOrAttempts: result.metrics?.attempts || 0,
        completedAt: result.completedAt,
        cognitiveDomainsAffected: result.tags || []
      };
      
      console.log('Formatted payload for API:', payload);
      
      const response = await fetch('/api/user/game-results', {
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
      console.log('Successfully saved game result to server:', responseData);
      return responseData;
    } catch (error) {
      console.error('Error saving to server:', error);
      // We don't throw here - we've already updated local state and storage
      // Just log the error and return null to indicate server save failed
      return null;
    }
  };
  
  // Save a new game result, with both local state update and server sync
  const saveResult = useCallback(
    async (data: GameResultInput) => {
      setIsLoading(true);
      setError(null);

      try {
        // Validate required fields
        if (!data.gameType || data.score === undefined || data.duration === undefined) {
          throw new Error('Missing required game result fields');
        }
        
        console.log('Saving game result:', data);
        
        const newResult: GameResult = {
          id: uuidv4(),
          ...data,
          completedAt: new Date().toISOString(),
          userId: userId || ''
        };

        // Update the local state immediately for better UX
        setResults(prevResults => [newResult, ...prevResults]);
        console.log('Updated local state with new result');

        // Store in localStorage regardless of auth state for backup and offline capabilities
        try {
          const existingResults = JSON.parse(localStorage.getItem('gameResults') || '[]');
          const updatedResults = [newResult, ...existingResults];
          
          // Keep only the last 100 results to prevent localStorage from growing too large
          const trimmedResults = updatedResults.slice(0, 100);
          
          localStorage.setItem('gameResults', JSON.stringify(trimmedResults));
          console.log('Saved game result to localStorage');
        } catch (storageError) {
          console.error('Error saving to localStorage:', storageError);
          // Continue even if localStorage fails - we still have state update
        }

        // If user is signed in, sync with the server
        let serverResult = null;
        if (isSignedIn && userId) {
          console.log('User is signed in, syncing with server');
          try {
            // If server fails, we still have the local copy
            serverResult = await saveResultToServer(newResult);
          } catch (serverError) {
            console.error('Server sync failed but local save succeeded:', serverError);
          }
        } else {
          console.log('User not signed in, skipping server sync');
        }

        setIsLoading(false);
        return serverResult || newResult; // Return server result if available, otherwise local result
      } catch (err) {
        console.error('Error saving game result:', err);
        setError(typeof err === 'object' && err !== null && 'message' in err 
          ? (err as Error).message 
          : 'Failed to save result. Please try again.');
        setIsLoading(false);
        throw err;
      }
    },
    [isSignedIn, userId]
  );

  return {
    results,
    isLoading,
    error,
    saveResult,
  };
} 