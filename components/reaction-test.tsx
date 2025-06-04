"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useGameResults } from "@/hooks/use-game-results";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Timer, RefreshCcw } from "lucide-react";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

// Types for the game
interface GameState {
  status: "waiting" | "ready" | "started" | "finished";
  startTime: number | null;
  reactionTime: number | null;
  countDown: number;
  attempts: number[];
  currentAttempt: number;
  tooEarly: boolean;
}

// Difficulty settings
interface Difficulty {
  attempts: number;
  minDelay: number;
  maxDelay: number;
}

const DIFFICULTIES: Record<string, Difficulty> = {
  easy: { attempts: 3, minDelay: 1500, maxDelay: 3500 },
  medium: { attempts: 5, minDelay: 1000, maxDelay: 3000 },
  hard: { attempts: 7, minDelay: 500, maxDelay: 2500 },
};

export default function ReactionTest() {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [gameState, setGameState] = useState<GameState>({
    status: "waiting",
    startTime: null,
    reactionTime: null,
    countDown: 0,
    attempts: [],
    currentAttempt: 1,
    tooEarly: false,
  });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const gameSettings = DIFFICULTIES[difficulty];
  const { saveResult } = useGameResults();
  const { toast } = useToast();

  // Clean up timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Function to get random delay based on difficulty
  const getRandomDelay = useCallback(() => {
    return Math.floor(
      Math.random() * (gameSettings.maxDelay - gameSettings.minDelay) + gameSettings.minDelay
    );
  }, [gameSettings]);

  // Prepare the test with random delay
  const prepareTest = useCallback(() => {
    const delay = getRandomDelay();
    
    setGameState(prev => ({
      ...prev,
      status: "ready",
      tooEarly: false
    }));

    // Set timeout to change circle to green
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        status: "started",
        startTime: Date.now()
      }));
    }, delay);
  }, [getRandomDelay]);

  // Start game
  const startGame = useCallback(() => {
    setGameState({
      status: "ready",
      startTime: null,
      reactionTime: null,
      countDown: 3,
      attempts: [],
      currentAttempt: 1,
      tooEarly: false,
    });

    // Create a countdown from 3 to go
    let count = 3;
    const countdownInterval = setInterval(() => {
      count -= 1;
      setGameState(prev => ({ ...prev, countDown: count }));
      
      if (count === 0) {
        clearInterval(countdownInterval);
        prepareTest();
      }
    }, 1000);
  }, [prepareTest]);

  // Handle click on the circle
  const handleClick = useCallback(() => {
    // If already in waiting/finished state, ignore clicks
    if (gameState.status === "waiting" || gameState.status === "finished") {
      return;
    }

    // If clicked during ready state, it's too early
    if (gameState.status === "ready") {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setGameState(prev => ({
        ...prev,
        tooEarly: true
      }));

      // After a delay, reset and prepare the test again
      setTimeout(() => {
        prepareTest();
      }, 1000);
      return;
    }

    // Calculate reaction time
    const endTime = Date.now();
    const reactionTime = gameState.startTime ? endTime - gameState.startTime : 0;
    
    const newAttempts = [...gameState.attempts, reactionTime];
    const isLastAttempt = gameState.currentAttempt >= gameSettings.attempts;

    if (isLastAttempt) {
      // Game is finished
      setGameState(prev => ({
        ...prev,
        status: "finished",
        reactionTime, 
        attempts: newAttempts
      }));

      // Save the result
      const averageTime = Math.round(
        newAttempts.reduce((a, b) => a + b, 0) / newAttempts.length
      );
      
      saveResult({
        gameType: "reaction-test",
        score: averageTime, // Lower is better for reaction time
        duration: newAttempts.length * 5000, // Estimate total time spent
        difficulty,
        accuracy: 100, // Always 100% for reaction test
        metrics: { attempts: newAttempts },
        tags: ["Processing", "Attention"]
      })
      .then(() => {
        toast({
          title: "Result saved!",
          description: `Your average reaction time: ${averageTime}ms`,
          variant: "default"
        });
      })
      .catch(error => {
        toast({
          title: "Error saving result",
          description: "Please try again later",
          variant: "destructive",
        });
        console.error("Error saving result:", error);
      });
    } else {
      // Continue to next attempt
      setGameState(prev => ({
        ...prev,
        reactionTime,
        attempts: newAttempts,
        currentAttempt: prev.currentAttempt + 1,
      }));

      // Prepare for next test after a short delay
      setTimeout(() => {
        prepareTest();
      }, 1500);
    }
  }, [gameState, gameSettings.attempts, prepareTest, saveResult, difficulty, toast]);

  // Reset the game
  const resetGame = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setGameState({
      status: "waiting",
      startTime: null,
      reactionTime: null,
      countDown: 0,
      attempts: [],
      currentAttempt: 1,
      tooEarly: false,
    });
  }, []);

  // Calculate average reaction time
  const averageReactionTime = gameState.attempts.length > 0
    ? Math.round(gameState.attempts.reduce((a, b) => a + b, 0) / gameState.attempts.length)
    : 0;

  // Get the background color based on game status
  const getCircleColor = () => {
    if (gameState.tooEarly) return "bg-red-500";
    if (gameState.status === "started") return "bg-green-500";
    return "bg-slate-300 dark:bg-slate-700";
  };

  // Get the text inside the circle
  const getCircleText = () => {
    if (gameState.status === "waiting") return "Click to Start";
    if (gameState.status === "ready" && gameState.countDown > 0) return gameState.countDown;
    if (gameState.status === "ready") return "Wait...";
    if (gameState.tooEarly) return "Too early!";
    if (gameState.status === "started") return "Click!";
    if (gameState.status === "finished") return "Done!";
    return "";
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col w-full items-center space-y-4">
        <div className="flex space-x-2 items-center">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Timer className="h-3 w-3" />
            <span>Test {gameState.currentAttempt} of {gameSettings.attempts}</span>
          </Badge>
          
          {gameState.status !== "waiting" && (
            <Button variant="ghost" size="sm" onClick={resetGame}>
              <RefreshCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          )}
        </div>
        
        {/* Progress bar for attempts */}
        {gameState.status !== "waiting" && (
          <Progress 
            value={(gameState.currentAttempt - 1) / gameSettings.attempts * 100} 
            className="w-full h-2"
          />
        )}
      </div>

      {/* Main game circle */}
      <div 
        className={`w-56 h-56 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-100 ${getCircleColor()} text-center text-white text-2xl font-bold shadow-lg`}
        onClick={gameState.status === "waiting" ? startGame : handleClick}
      >
        {getCircleText()}
      </div>

      {/* Instruction text */}
      <Card className="p-4 w-full">
        {gameState.status === "waiting" ? (
          <div className="text-center space-y-2">
            <p>Click the circle when it turns green to test your reaction time.</p>
            <p className="text-sm text-muted-foreground">You will have {gameSettings.attempts} attempts.</p>
          </div>
        ) : gameState.status === "finished" ? (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-center">Results</h3>
            <div className="flex justify-between items-center px-4">
              <span>Average reaction time:</span>
              <span className="font-bold">{averageReactionTime}ms</span>
            </div>
            <div className="space-y-1">
              {gameState.attempts.map((time, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>Attempt {index + 1}:</span>
                  <span>{time}ms</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-center mt-4">
              <AlertCircle className="h-4 w-4 inline mr-1" />
              Average human reaction time: 200-250ms
            </p>
          </div>
        ) : (
          <div className="text-center">
            {gameState.tooEarly ? (
              <p className="text-red-500">You clicked too early! Wait for the circle to turn green.</p>
            ) : gameState.status === "ready" ? (
              <p>Wait for the circle to turn green, then click as fast as you can!</p>
            ) : (
              <p>{gameState.reactionTime ? `Last: ${gameState.reactionTime}ms` : "Click now!"}</p>
            )}
          </div>
        )}
      </Card>

      {/* Difficulty selector */}
      <div className="flex space-x-2">
        {["easy", "medium", "hard"].map((diff) => (
          <Button
            key={diff}
            variant={difficulty === diff ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setDifficulty(diff as "easy" | "medium" | "hard");
              resetGame();
            }}
            disabled={gameState.status !== "waiting" && gameState.status !== "finished"}
          >
            {diff.charAt(0).toUpperCase() + diff.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  );
} 