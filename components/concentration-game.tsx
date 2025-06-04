"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { GameResult } from "@/lib/types";
import { useGameResults } from "@/hooks/use-game-results";
import { useCognitiveScores } from "@/components/cognitive-score-card";

type Difficulty = "easy" | "medium" | "hard";

interface GameSettings {
  gridSize: number;
  showDuration: number;
  gameLength: number;
}

export function ConcentrationGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [targetCell, setTargetCell] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [showCell, setShowCell] = useState(false);
  const [clickEnabled, setClickEnabled] = useState(false);
  const [feedback, setFeedback] = useState("");
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const roundTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Use the game results and cognitive scores hooks
  const { saveResult } = useGameResults();
  const { saveCognitiveScore } = useCognitiveScores();
  
  // Save game result function
  const saveGameResult = async (result: Omit<GameResult, "id" | "userId" | "completedAt">) => {
    try {
      // Now we use the real saveResult function from the hook
      return await saveResult(result);
    } catch (error) {
      console.error("Failed to save game result:", error);
      throw error;
    }
  };
  
  // Get game settings based on difficulty
  const getGameSettings = (): GameSettings => {
    switch (difficulty) {
      case "easy":
        return { gridSize: 3, showDuration: 1500, gameLength: 30000 };
      case "medium":
        return { gridSize: 4, showDuration: 1000, gameLength: 45000 };
      case "hard":
        return { gridSize: 5, showDuration: 750, gameLength: 60000 };
      default:
        return { gridSize: 3, showDuration: 1500, gameLength: 30000 };
    }
  };

  // Start a new game
  const startGame = () => {
    const settings = getGameSettings();
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setTotalTime(settings.gameLength);
    setRemainingTime(settings.gameLength);
    setFeedback("");
    startRound();
    
    // Start the game timer
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    gameTimerRef.current = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 100) {
          endGame();
          return 0;
        }
        return prev - 100;
      });
    }, 100);
  };

  // End the game
  const endGame = () => {
    setGameOver(true);
    setGameStarted(false);
    setClickEnabled(false);
    setShowCell(false);
    
    // Clear all timers
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (roundTimerRef.current) clearTimeout(roundTimerRef.current);
    
    // Save the results
    saveGameData();
    
    // Provide feedback
    const settings = getGameSettings();
    const maxRounds = Math.floor(settings.gameLength / (settings.showDuration + 1000));
    const successRate = Math.min(1, score / maxRounds);
    provideFeedback(successRate);
  };

  // Start a new round
  const startRound = () => {
    if (gameOver) return;
    
    const settings = getGameSettings();
    const gridCells = settings.gridSize * settings.gridSize;
    
    // Choose a random cell
    const newTargetCell = Math.floor(Math.random() * gridCells);
    setTargetCell(newTargetCell);
    setShowCell(true);
    setClickEnabled(false);
    
    // Hide the cell after the show duration
    if (roundTimerRef.current) clearTimeout(roundTimerRef.current);
    roundTimerRef.current = setTimeout(() => {
      setShowCell(false);
      setClickEnabled(true);
    }, settings.showDuration);
  };

  // Handle cell click
  const handleCellClick = (cellIndex: number) => {
    if (!clickEnabled || gameOver) return;
    
    if (cellIndex === targetCell) {
      // Correct cell clicked
      setScore(prev => prev + 1);
    }
    
    // Move to next round
    startRound();
  };

  // Save game data to our persistent storage
  const saveGameData = async () => {
    try {
      // Save the game result
      await saveGameResult({
        gameType: "concentration-game",
        score: score,
        level: 1,
        duration: totalTime,
        difficulty,
        accuracy: Math.round((score / (totalTime / 1000)) * 100) / 100,
        metrics: {
          successfulClicks: score,
          totalTime,
        },
        tags: ["attention", "reaction-time", "focus"]
      });
      
      // Also save this as a cognitive score for attention domain
      await saveCognitiveScore({
        domain: "Attention",
        score: Math.min(100, score * 5)
      });
      
      console.log("Game data saved successfully!");
    } catch (error) {
      console.error("Failed to save game data:", error);
    }
  };

  // Provide feedback based on performance
  const provideFeedback = (successRate: number) => {
    let feedbackMessage = "";
    
    if (successRate > 0.8) {
      feedbackMessage = "Excellent concentration! Your attention skills are impressive.";
    } else if (successRate > 0.6) {
      feedbackMessage = "Good job! Your concentration levels are solid.";
    } else if (successRate > 0.4) {
      feedbackMessage = "Not bad. Regular attention exercises can help improve your focus.";
    } else {
      feedbackMessage = "Keep practicing! Concentration games can help strengthen your attention span.";
    }
    
    setFeedback(feedbackMessage);
  };

  // Concentration and attention health tips
  const concentrationTips = [
    "Regular physical exercise can improve your ability to focus",
    "Meditation practices can help strengthen attention span",
    "Breaking tasks into smaller chunks can help maintain concentration",
    "Getting adequate sleep is crucial for maintaining attention",
    "Limiting distractions like notifications can improve focus"
  ];

  // Create the grid based on difficulty
  const renderGrid = () => {
    const { gridSize } = getGameSettings();
    const gridCells = gridSize * gridSize;
    
    return (
      <div 
        className={cn(
          "grid gap-2",
          gridSize === 3 ? "grid-cols-3" : 
          gridSize === 4 ? "grid-cols-4" : 
          "grid-cols-5"
        )}
      >
        {Array.from({ length: gridCells }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "aspect-square flex items-center justify-center rounded-lg cursor-pointer transition-all duration-100",
              showCell && targetCell === index
                ? "bg-primary"
                : "bg-muted hover:bg-muted/80"
            )}
            onClick={() => handleCellClick(index)}
          />
        ))}
      </div>
    );
  };

  // Cleanup timers on component unmount
  useEffect(() => {
    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (roundTimerRef.current) clearTimeout(roundTimerRef.current);
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Concentration Game</h2>
        <p className="text-muted-foreground">
          Test and improve your concentration. Click on the cell that lights up to score points.
        </p>
      </div>

      <Tabs 
        defaultValue="easy" 
        className="w-full" 
        onValueChange={(value: string) => setDifficulty(value as Difficulty)}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="easy" disabled={gameStarted}>Easy</TabsTrigger>
          <TabsTrigger value="medium" disabled={gameStarted}>Medium</TabsTrigger>
          <TabsTrigger value="hard" disabled={gameStarted}>Hard</TabsTrigger>
        </TabsList>
      </Tabs>

      {gameStarted && (
        <>
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">Score: {score}</p>
            <p className="text-sm font-medium">Time: {Math.ceil(remainingTime / 1000)}s</p>
          </div>
          
          <Progress value={(remainingTime / totalTime) * 100} />
          
          {renderGrid()}
        </>
      )}

      {!gameStarted && !gameOver && (
        <div className="flex justify-center my-8">
          <Button onClick={startGame} size="lg">Start Game</Button>
        </div>
      )}

      {gameOver && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-2">Game Complete!</h3>
            <p>Your score: {score}</p>
            <p>{feedback}</p>
            <div className="mt-4">
              <h4 className="font-medium mb-2">Brain Health Tips:</h4>
              <p className="text-sm text-muted-foreground">
                {concentrationTips[Math.floor(Math.random() * concentrationTips.length)]}
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={startGame}>Play Again</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 