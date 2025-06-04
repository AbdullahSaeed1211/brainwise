"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Play, RotateCcw } from "lucide-react";
import type { GameResult } from "@/lib/types";
import { useGameResults } from "@/hooks/use-game-results";
import { useCognitiveScores } from "@/components/cognitive-score-card";

// Card icons for the memory game
const CARD_ICONS = [
  "🧠", "❤️", "🏥", "💊", "🩺", "🍎", "🥦", "🏃", 
  "💧", "🛌", "🧘", "⏱️", "🚭", "🥗", "📊", "🧪"
];

type MemoryCard = {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
};

type Difficulty = "easy" | "medium" | "hard";

interface GameStats {
  moves: number;
  matches: number;
  startTime: number;
  endTime: number | null;
}

export function MemoryGame() {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [gameStats, setGameStats] = useState<GameStats>({
    moves: 0,
    matches: 0,
    startTime: 0,
    endTime: null,
  });
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Use the game results hook
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
  
  // Shuffle an array using Fisher-Yates algorithm
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Initialize the game
  const initializeGame = useCallback(() => {
    const cardCount = difficulty === "easy" ? 12 : difficulty === "medium" ? 16 : 24;
    const iconCount = cardCount / 2;
    const selectedIcons = CARD_ICONS.slice(0, iconCount);
    
    // Create pairs of cards with the same icon
    const cardPairs = [...selectedIcons, ...selectedIcons].map((icon, index) => ({
      id: index,
      icon,
      isFlipped: false,
      isMatched: false,
    }));
    
    // Shuffle the cards
    const shuffledCards = shuffleArray(cardPairs);
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setIsGameComplete(false);
    setGameStats({
      moves: 0,
      matches: 0,
      startTime: 0,
      endTime: null,
    });
    setFeedback("");
    setTimeElapsed(0);
    setGameStarted(false);
  }, [difficulty]);

  // Initialize the game when difficulty changes
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);
  
  // Setup timer for the game
  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;
    
    if (gameStarted && !isGameComplete && cards.length > 0) {
      timerId = setInterval(() => {
        setTimeElapsed(Date.now() - gameStats.startTime);
      }, 100);
    }
    
    // Cleanup function
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [gameStarted, isGameComplete, cards.length, gameStats.startTime]);

  // Start the game
  const startGame = () => {
    setGameStarted(true);
    setGameStats(prev => ({
      ...prev,
      startTime: Date.now()
    }));
  };

  // Handle card click
  const handleCardClick = (id: number) => {
    // Ignore if game not started or the card is already flipped or matched
    if (
      !gameStarted ||
      cards[id].isFlipped ||
      cards[id].isMatched ||
      flippedCards.length >= 2
    ) {
      return;
    }

    // Flip the card
    const updatedCards = [...cards];
    updatedCards[id].isFlipped = true;
    setCards(updatedCards);

    // Add to flipped cards
    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    // If two cards are flipped, check for a match
    if (newFlippedCards.length === 2) {
      const [firstId, secondId] = newFlippedCards;
      const firstCard = updatedCards[firstId];
      const secondCard = updatedCards[secondId];

      setGameStats((prev) => ({
        ...prev,
        moves: prev.moves + 1,
      }));

      // Check if the icons match
      if (firstCard.icon === secondCard.icon) {
        // Mark as matched
        updatedCards[firstId].isMatched = true;
        updatedCards[secondId].isMatched = true;
        
        // Update stats
        const newMatches = gameStats.matches + 1;
        setGameStats((prev) => ({
          ...prev,
          matches: newMatches,
        }));

        // Clear flipped cards
        setFlippedCards([]);
        
        // Check if all cards are matched
        const totalPairs = cards.length / 2;
        if (newMatches === totalPairs) {
          const endTime = Date.now();
          setGameStats((prev) => ({
            ...prev,
            endTime,
          }));
          setIsGameComplete(true);
          handleSaveGameData();
          provideFeedback(endTime - gameStats.startTime, gameStats.moves, totalPairs);
        }
      } else {
        // If no match, flip back after a delay
        setTimeout(() => {
          updatedCards[firstId].isFlipped = false;
          updatedCards[secondId].isFlipped = false;
          setCards(updatedCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Handle saving game data
  const handleSaveGameData = async () => {
    if (!isGameComplete || !gameStats.endTime) return;
    
    // Calculate score based on difficulty and completion time
    const baseScore = difficulty === "easy" ? 100 : difficulty === "medium" ? 150 : 200;
    const timeBonus = Math.max(0, 300 - Math.floor(timeElapsed / 1000)); // Time bonus decreases as time increases
    const movesPerMatch = gameStats.moves / gameStats.matches;
    const efficiencyBonus = Math.max(0, 100 - (movesPerMatch - 2) * 20); // Efficiency bonus (ideally 2 moves per match)
    
    const totalScore = Math.floor(baseScore + timeBonus + efficiencyBonus);
    
    try {
      // Save the game result to the database
      await saveGameResult({
        gameType: "memory-game",
        score: totalScore,
        level: 1,
        duration: Math.floor(timeElapsed / 1000), // Convert to seconds
        difficulty,
        metrics: {
          moves: gameStats.moves,
          matches: gameStats.matches,
          timeElapsed,
          movesPerMatch: parseFloat(movesPerMatch.toFixed(2)),
        },
        tags: ["memory", "visual", "attention"]
      });
      
      // Also save cognitive score
      await saveCognitiveScore({
        domain: "Memory",
        score: Math.min(100, totalScore / 3)
      });
      
      console.log("Game data saved successfully!");
    } catch (error) {
      console.error("Error saving game data:", error);
    }
  };
  
  const provideFeedback = (timeElapsed: number, moves: number, totalPairs: number) => {
    const perfectMoves = totalPairs;
    const efficiency = perfectMoves / moves;
    
    let feedbackText = "";
    
    if (efficiency >= 0.9) {
      feedbackText = "Excellent! Your memory is exceptional.";
    } else if (efficiency >= 0.7) {
      feedbackText = "Great job! You have a very good memory.";
    } else if (efficiency >= 0.5) {
      feedbackText = "Good work! Your memory is functioning well.";
    } else if (efficiency >= 0.3) {
      feedbackText = "Nice effort! With practice, your memory can improve.";
    } else {
      feedbackText = "Good try! Regular memory exercises can help strengthen your memory.";
    }
    
    setFeedback(feedbackText);
  };
  
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };
  
  // Get grid columns based on difficulty
  const getGridColumns = () => {
    if (difficulty === "easy") return "grid-cols-3 sm:grid-cols-4";
    if (difficulty === "medium") return "grid-cols-4";
    return "grid-cols-4 sm:grid-cols-6";
  };

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Memory Card Game</h2>
        <p className="text-muted-foreground text-sm">
          Test and improve your short-term memory. Match pairs of cards to complete the game.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Tabs 
          value={difficulty} 
          onValueChange={(value) => setDifficulty(value as Difficulty)}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-3 w-full sm:w-auto">
            <TabsTrigger 
              value="easy" 
              className="text-xs sm:text-sm px-3 py-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              disabled={gameStarted && !isGameComplete}
            >
              Easy
            </TabsTrigger>
            <TabsTrigger 
              value="medium" 
              className="text-xs sm:text-sm px-3 py-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              disabled={gameStarted && !isGameComplete}
            >
              Medium
            </TabsTrigger>
            <TabsTrigger 
              value="hard" 
              className="text-xs sm:text-sm px-3 py-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              disabled={gameStarted && !isGameComplete}
            >
              Hard
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {!gameStarted && !isGameComplete ? (
            <Button 
              onClick={startGame}
              className="px-4 py-2 flex items-center gap-2"
              variant="default"
            >
              <Play className="h-4 w-4" />
              Start Game
            </Button>
          ) : (
            <Button 
              onClick={initializeGame}
              className="px-4 py-2 flex items-center gap-2"
              variant={isGameComplete ? "default" : "outline"}
            >
              <RotateCcw className="h-4 w-4" />
              Restart
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm">
        <div className="flex gap-4">
          <div>
            <span className="font-medium">Moves:</span> {gameStats.moves}
          </div>
          <div>
            <span className="font-medium">Matches:</span> {gameStats.matches} of {cards.length / 2}
          </div>
        </div>
        <div>
          <span className="font-medium">Time:</span> {formatTime(timeElapsed)}
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto w-full"> 
        <div className={`grid ${getGridColumns()} gap-3 sm:gap-4`}>
          {cards.map((card) => (
            <div
              key={card.id}
              className={cn(
                "aspect-square rounded-lg cursor-pointer transition-all duration-300 transform",
                "flex items-center justify-center text-2xl sm:text-3xl",
                "select-none shadow-sm hover:shadow",
                !gameStarted ? "opacity-70 pointer-events-none" : "",
                card.isMatched
                  ? "bg-primary/20 border-primary border-2"
                  : card.isFlipped
                  ? "bg-card border-primary border-2 rotate-y-180"
                  : "bg-primary/5 border border-border hover:border-primary/30"
              )}
              onClick={() => handleCardClick(card.id)}
              aria-label={`Card ${card.id + 1}`}
              tabIndex={0}
              role="button"
              style={{
                perspective: "1000px",
              }}
            >
              <div
                className={cn(
                  "transition-all duration-300 transform",
                  card.isFlipped ? "rotate-y-180" : "rotate-y-0"
                )}
              >
                {card.isFlipped || card.isMatched ? card.icon : ""}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {isGameComplete && (
        <div className="rounded-lg bg-primary/10 p-4 text-center mt-4">
          <h3 className="font-semibold mb-1">Game Complete! 🎉</h3>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
} 