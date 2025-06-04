"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle } from "lucide-react";

type Difficulty = "easy" | "medium" | "hard";
type GameState = "idle" | "playing" | "completed";

interface Symbol {
  value: string;
  isTarget: boolean;
  isSelected: boolean;
}

interface GameStats {
  correctSelections: number;
  incorrectSelections: number;
  timeElapsed: number;
  startTime: number;
}

interface LevelConfig {
  gridSize: number;
  targetCount: number;
  distractorCount: number;
  timeLimit: number; // in seconds
}

const DIFFICULTY_SETTINGS: Record<Difficulty, LevelConfig> = {
  easy: { gridSize: 5, targetCount: 5, distractorCount: 20, timeLimit: 30 },
  medium: { gridSize: 6, targetCount: 7, distractorCount: 29, timeLimit: 25 },
  hard: { gridSize: 7, targetCount: 9, distractorCount: 40, timeLimit: 20 }
};

// Symbols for the test
const TARGET_SYMBOLS = ["★", "♥", "♦", "↑", "→"];
const DISTRACTOR_SYMBOLS = ["☆", "♡", "◇", "↗", "↘", "↓", "↙", "↖", "◯", "□", "△", "☐", "☑", "☒"];

export function VisualAttentionTest() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [gameState, setGameState] = useState<GameState>("idle");
  const [symbols, setSymbols] = useState<Symbol[]>([]);
  const [targetSymbol, setTargetSymbol] = useState<string>("");
  const [stats, setStats] = useState<GameStats>({
    correctSelections: 0,
    incorrectSelections: 0,
    timeElapsed: 0,
    startTime: 0
  });
  const [timeRemaining, setTimeRemaining] = useState<number>(DIFFICULTY_SETTINGS.easy.timeLimit);

  // Initialize game
  const initializeGame = () => {
    const config = DIFFICULTY_SETTINGS[difficulty];
    const targetCount = config.targetCount;
    const distractorCount = config.distractorCount;
    
    // Select a random target symbol
    const selectedTargetSymbol = TARGET_SYMBOLS[Math.floor(Math.random() * TARGET_SYMBOLS.length)];
    setTargetSymbol(selectedTargetSymbol);
    
    // Create symbol array
    const newSymbols: Symbol[] = [];
    
    // Add target symbols
    for (let i = 0; i < targetCount; i++) {
      newSymbols.push({
        value: selectedTargetSymbol,
        isTarget: true,
        isSelected: false
      });
    }
    
    // Add distractor symbols
    for (let i = 0; i < distractorCount; i++) {
      const distractorSymbol = DISTRACTOR_SYMBOLS[Math.floor(Math.random() * DISTRACTOR_SYMBOLS.length)];
      newSymbols.push({
        value: distractorSymbol,
        isTarget: false,
        isSelected: false
      });
    }
    
    // Shuffle symbols
    const shuffledSymbols = shuffleArray(newSymbols);
    setSymbols(shuffledSymbols);
    
    // Reset stats
    setStats({
      correctSelections: 0,
      incorrectSelections: 0,
      timeElapsed: 0,
      startTime: Date.now()
    });
    
    // Set time remaining
    setTimeRemaining(config.timeLimit);
    
    // Set game state to playing
    setGameState("playing");
  };
  
  // Handle timer
  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;
    
    if (gameState === "playing" && timeRemaining > 0) {
      timerId = setInterval(() => {
        setTimeRemaining((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            endGame();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [gameState, timeRemaining]);
  
  // Shuffle array using Fisher-Yates algorithm
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  // Handle symbol click
  const handleSymbolClick = (index: number) => {
    if (gameState !== "playing" || symbols[index].isSelected) return;
    
    const newSymbols = [...symbols];
    const clickedSymbol = newSymbols[index];
    clickedSymbol.isSelected = true;
    
    // Update stats
    if (clickedSymbol.isTarget) {
      setStats((prevStats) => ({
        ...prevStats,
        correctSelections: prevStats.correctSelections + 1
      }));
      
      // Check if all targets have been found
      const allTargetsFound = newSymbols.filter(s => s.isTarget && !s.isSelected).length === 0;
      if (allTargetsFound) {
        endGame();
      }
    } else {
      setStats((prevStats) => ({
        ...prevStats,
        incorrectSelections: prevStats.incorrectSelections + 1
      }));
    }
    
    setSymbols(newSymbols);
  };
  
  // End game and calculate final stats
  const endGame = () => {
    setGameState("completed");
    setStats((prevStats) => ({
      ...prevStats,
      timeElapsed: Math.floor((Date.now() - prevStats.startTime) / 1000)
    }));
  };
  
  // Calculate score
  const calculateScore = () => {
    const { incorrectSelections, timeElapsed } = stats;
    const config = DIFFICULTY_SETTINGS[difficulty];
    const maxScore = config.targetCount * 100;
    
    // Start with max score
    let score = maxScore;
    
    // Deduct for incorrect selections
    score -= incorrectSelections * 50;
    
    // Deduct for time (less deduction for harder difficulties)
    const timeDeduction = 
      difficulty === "easy" ? 5 : 
      difficulty === "medium" ? 3 : 
      2;
    
    score -= Math.floor(timeElapsed * timeDeduction);
    
    // Minimum score is 0
    return Math.max(0, score);
  };
  
  // Get performance feedback
  const getPerformanceFeedback = () => {
    const score = calculateScore();
    const config = DIFFICULTY_SETTINGS[difficulty];
    const maxScore = config.targetCount * 100;
    const performance = score / maxScore;
    
    if (performance >= 0.9) {
      return "Excellent! Your visual attention and processing speed are outstanding.";
    } else if (performance >= 0.7) {
      return "Good job! You have strong visual processing abilities.";
    } else if (performance >= 0.5) {
      return "Nice work! With practice, you can improve your visual attention skills.";
    } else {
      return "Keep practicing! Visual attention is a skill that can be improved with regular exercise.";
    }
  };
  
  // Get health insights
  const getHealthInsights = () => {
    const targetCount = DIFFICULTY_SETTINGS[difficulty].targetCount;
    const correctPercentage = (stats.correctSelections / targetCount) * 100;
    
    if (correctPercentage < 60) {
      return "Visual attention skills are important for many daily activities, including driving and reading. Regular practice can help improve these skills.";
    } else if (stats.incorrectSelections > stats.correctSelections) {
      return "Your accuracy can be improved. Focus on carefully examining each item before making a selection.";
    } else if (timeRemaining === 0) {
      return "Processing speed is an important cognitive skill. Try to improve your speed while maintaining accuracy.";
    } else {
      return "Good visual attention indicates healthy cognitive processing. Continue to challenge yourself with regular brain exercises.";
    }
  };
  
  // Render game content based on state
  const renderGameContent = () => {
    const config = DIFFICULTY_SETTINGS[difficulty];
    
    switch (gameState) {
      case "idle":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Visual Attention Test</CardTitle>
                <CardDescription>
                  Find all instances of the target symbol as quickly as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    This test measures your visual attention and processing speed. 
                    You&apos;ll need to quickly scan and identify target symbols among distractors.
                  </p>
                  
                  <div className="flex items-center justify-center gap-2 p-4 border rounded-md">
                    <div className="text-2xl font-bold">Example:</div>
                    <div className="text-xl">Find all the</div>
                    <div className="text-3xl text-primary">★</div>
                    <div className="text-xl">symbols:</div>
                    <div className="flex items-center gap-3 text-2xl ml-2">
                      <span>☆</span>
                      <span className="text-primary">★</span>
                      <span>□</span>
                      <span className="text-primary">★</span>
                      <span>◯</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mt-4">
                    <h3 className="font-medium">Select Difficulty:</h3>
                    <div className="flex gap-3">
                      <Button
                        variant={difficulty === "easy" ? "default" : "outline"}
                        onClick={() => setDifficulty("easy")}
                      >
                        Easy
                      </Button>
                      <Button
                        variant={difficulty === "medium" ? "default" : "outline"}
                        onClick={() => setDifficulty("medium")}
                      >
                        Medium
                      </Button>
                      <Button
                        variant={difficulty === "hard" ? "default" : "outline"}
                        onClick={() => setDifficulty("hard")}
                      >
                        Hard
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <div className="px-6 py-4 border-t">
                <Button onClick={initializeGame}>Start Test</Button>
              </div>
            </Card>
          </div>
        );
      
      case "playing":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="text-sm font-medium">Find all the <span className="text-primary text-xl">{targetSymbol}</span> symbols</div>
                <div className="text-sm text-muted-foreground">
                  Found: {stats.correctSelections} of {config.targetCount}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">
                  {timeRemaining}s
                </div>
                <div className="text-sm text-muted-foreground">
                  Time Remaining
                </div>
              </div>
            </div>
            
            <Progress value={(timeRemaining / config.timeLimit) * 100} className="h-2" />
            
            <Card className="overflow-hidden">
              <div
                className="grid gap-2 p-4"
                style={{
                  gridTemplateColumns: `repeat(${config.gridSize}, minmax(0, 1fr))`
                }}
              >
                {symbols.map((symbol, index) => (
                  <div
                    key={index}
                    className={`
                      aspect-square flex items-center justify-center text-2xl border rounded-md cursor-pointer transition-all
                      ${symbol.isSelected ? 
                        (symbol.isTarget ? "bg-green-100 dark:bg-green-900 border-green-500 text-green-600 dark:text-green-400" : 
                                          "bg-red-100 dark:bg-red-900 border-red-500 text-red-600 dark:text-red-400") : 
                        "hover:bg-muted/50"}
                    `}
                    onClick={() => handleSymbolClick(index)}
                  >
                    {symbol.value}
                  </div>
                ))}
              </div>
            </Card>
            
            <div className="text-center">
              <Button variant="outline" onClick={endGame}>End Test</Button>
            </div>
          </div>
        );
      
      case "completed":
        const score = calculateScore();
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
                <CardDescription>
                  {getPerformanceFeedback()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">{score}</div>
                    <div className="text-sm text-muted-foreground">Score</div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="p-3 border rounded-md">
                      <div className="text-xl font-medium">{stats.correctSelections}</div>
                      <div className="text-xs text-muted-foreground">Correct</div>
                    </div>
                    <div className="p-3 border rounded-md">
                      <div className="text-xl font-medium">{stats.incorrectSelections}</div>
                      <div className="text-xs text-muted-foreground">Errors</div>
                    </div>
                    <div className="p-3 border rounded-md">
                      <div className="text-xl font-medium">{config.targetCount - stats.correctSelections}</div>
                      <div className="text-xs text-muted-foreground">Missed</div>
                    </div>
                    <div className="p-3 border rounded-md">
                      <div className="text-xl font-medium">{stats.timeElapsed}s</div>
                      <div className="text-xs text-muted-foreground">Time</div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-md bg-muted/50 flex gap-2">
                    <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Brain Health Insight:</p>
                      <p className="text-sm text-muted-foreground">{getHealthInsights()}</p>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mt-4">
                    <p>
                      Visual attention tests can help identify cognitive processing issues. 
                      Poor performance on this test is not diagnostic, but consistently low scores 
                      may indicate attention deficits that could benefit from professional assessment.
                    </p>
                  </div>
                </div>
              </CardContent>
              <div className="p-4 border-t flex justify-between">
                <Button variant="outline" onClick={() => setGameState("idle")}>
                  Change Difficulty
                </Button>
                <Button onClick={initializeGame}>
                  Try Again
                </Button>
              </div>
            </Card>
          </div>
        );
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      {renderGameContent()}
    </div>
  );
} 