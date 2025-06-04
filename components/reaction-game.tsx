"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clock, Brain, Zap, AlertCircle } from "lucide-react";
import { useGameResults } from "@/hooks/use-game-results";
import { useToast } from "@/hooks/use-toast";

type GameState = "waiting" | "ready" | "clicking" | "tooEarly" | "results";

export function ReactionGame() {
  const [gameState, setGameState] = useState<GameState>("waiting");
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number[]>([]);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { saveResult } = useGameResults();
  const { toast } = useToast();

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const startGame = () => {
    setGameState("ready");
    setReactionTime(null);
    
    // Random delay between 1-5 seconds
    const delay = Math.floor(Math.random() * 4000) + 1000;
    
    timeoutRef.current = setTimeout(() => {
      setGameState("clicking");
      startTimeRef.current = Date.now();
    }, delay);
  };

  const handleClick = () => {
    if (gameState === "ready") {
      // Clicked too early
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setGameState("tooEarly");
    } else if (gameState === "clicking") {
      // Record reaction time
      const endTime = Date.now();
      const time = endTime - startTimeRef.current;
      setReactionTime(time);
      
      // Update attempts and best time
      const newAttempts = [...attempts, time];
      setAttempts(newAttempts);
      
      if (bestTime === null || time < bestTime) {
        setBestTime(time);
      }
      
      setGameState("results");
    }
  };

  const handleComplete = () => {
    if (attempts.length >= 5) {
      const avgTime = Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length);
      
      // Save result to the game results system
      saveResult({
        gameType: "reaction-test",
        score: avgTime,
        duration: attempts.length * 5, // Approximate time spent in seconds
        difficulty: "medium",
        accuracy: 100, // All attempts are valid
        metrics: {
          attempts: attempts.length,
          bestTime,
          avgTime
        },
        tags: ["reaction-time", "processing-speed"]
      })
      .then(() => {
        toast({
          variant: "default",
          title: "Results saved!",
          description: `Your average reaction time: ${avgTime}ms`,
        });
      })
      .catch(error => {
        toast({
          variant: "destructive",
          title: "Error saving results",
          description: "Your results couldn&apos;t be saved. Please try again.",
        });
        console.error("Error saving game results:", error);
      });
      
      // Reset the game
      setAttempts([]);
      setBestTime(null);
    }
    
    setGameState("waiting");
  };

  const getReactionFeedback = (time: number): { text: string; color: string } => {
    if (time < 200) {
      return { 
        text: "Lightning fast! Exceptional reaction time.", 
        color: "text-green-500" 
      };
    } else if (time < 250) {
      return { 
        text: "Extremely fast! Better than most people.", 
        color: "text-green-500"
      };
    } else if (time < 300) {
      return { 
        text: "Very good reaction time.", 
        color: "text-green-500" 
      };
    } else if (time < 350) {
      return { 
        text: "Good reaction time, above average.", 
        color: "text-blue-500" 
      };
    } else if (time < 400) {
      return { 
        text: "Average reaction time.", 
        color: "text-blue-500" 
      };
    } else if (time < 500) {
      return { 
        text: "Slightly below average, but still normal.", 
        color: "text-yellow-500" 
      };
    } else if (time < 600) {
      return { 
        text: "Below average reaction time.", 
        color: "text-yellow-500" 
      };
    } else {
      return { 
        text: "Your reaction time is slow. Consider more practice.", 
        color: "text-red-500" 
      };
    }
  };

  const getAverageTime = () => {
    if (attempts.length === 0) return null;
    return Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length);
  };

  return (
    <div className="max-w-xl mx-auto">
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Reaction Time Test
              </CardTitle>
              <CardDescription>Test your brain&apos;s processing speed and reaction time</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {bestTime && (
                <div className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                  Best: {bestTime}ms
                </div>
              )}
              {attempts.length > 0 && (
                <div className="text-xs font-medium px-2 py-1 rounded-full bg-muted">
                  {attempts.length}/5 attempts
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {gameState === "waiting" && (
            <div className="py-10 text-center">
              <Zap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">Test Your Reaction Time</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                When the red box turns green, click as quickly as possible. 
                This measures your visual reaction time.
              </p>
              <Button size="lg" onClick={startGame}>
                Start Test
              </Button>
      </div>
          )}
          
          {gameState === "ready" && (
            <div 
              className="w-full h-64 bg-red-500/80 dark:bg-red-600/90 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
              onClick={handleClick}
            >
              <p className="text-white font-medium text-xl">Wait for green...</p>
            </div>
          )}
            
          {gameState === "clicking" && (
            <div
              className="w-full h-64 bg-green-500/80 dark:bg-green-600/90 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
              onClick={handleClick}
            >
              <p className="text-white font-medium text-xl">Click now!</p>
            </div>
          )}
          
          {gameState === "tooEarly" && (
            <div className="py-8 text-center">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">Too Early!</h3>
              <p className="text-muted-foreground mb-6">
                You clicked before the color changed. Please wait for the green color.
              </p>
              <Button onClick={startGame}>
                Try Again
              </Button>
            </div>
          )}
          
          {gameState === "results" && reactionTime && (
            <div className="py-8 space-y-6">
              <div className="text-center">
                <h3 className="text-3xl font-bold mb-1">{reactionTime} ms</h3>
                <p className={`${getReactionFeedback(reactionTime).color} font-medium`}>
                  {getReactionFeedback(reactionTime).text}
                </p>
              </div>
            
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Attempts</div>
                    <div className="font-medium">{attempts.length}/5</div>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Average</div>
                    <div className="font-medium">{getAverageTime() || "-"} ms</div>
                  </div>
                </div>
                
                {attempts.length >= 5 && (
                  <Alert className="bg-primary/10 border-primary/20">
                    <Brain className="h-4 w-4" />
                    <AlertTitle>Test completed!</AlertTitle>
                    <AlertDescription>
                      You&apos;ve completed 5 attempts. See your average score and save your results.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t bg-muted/20 p-4">
          {gameState === "results" && (
            <>
              {attempts.length < 5 ? (
                <>
                  <Button variant="outline" onClick={handleComplete}>
                    End Test
                  </Button>
                  <Button onClick={startGame}>
                    Next Attempt
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => {
                    setAttempts([]);
                    setBestTime(null);
                    setGameState("waiting");
                  }}>
                    Reset
                  </Button>
                  <Button onClick={handleComplete}>
                    Save Results
                  </Button>
                </>
              )}
          </>
        )}
        </CardFooter>
        </Card>
    </div>
  );
} 