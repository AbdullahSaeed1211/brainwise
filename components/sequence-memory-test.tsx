"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ListOrdered, Brain, AlertCircle, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useGameResults } from "@/hooks/use-game-results";
import { useToast } from "@/hooks/use-toast";

type GameState = "idle" | "watch" | "recall" | "completed";
type Difficulty = "easy" | "medium" | "hard";

interface GameStats {
  level: number;
  maxLevel: number;
  correctSequences: number;
  incorrectSequences: number;
  sequenceLength: number;
  timeElapsed: number;
  startTime: number;
}

// Difficulty configurations
const difficultyConfig = {
  easy: { 
    startingLength: 3,
    buttonCount: 4,
    playbackSpeed: 1000,
    playbackGap: 500
  },
  medium: { 
    startingLength: 4,
    buttonCount: 6,
    playbackSpeed: 800,
    playbackGap: 400
  },
  hard: { 
    startingLength: 5,
    buttonCount: 9,
    playbackSpeed: 600,
    playbackGap: 300
  }
};

// Button colors for visual appeal
const buttonColors = [
  "bg-red-500 hover:bg-red-600",
  "bg-blue-500 hover:bg-blue-600",
  "bg-green-500 hover:bg-green-600",
  "bg-yellow-500 hover:bg-yellow-600",
  "bg-purple-500 hover:bg-purple-600",
  "bg-pink-500 hover:bg-pink-600",
  "bg-indigo-500 hover:bg-indigo-600",
  "bg-orange-500 hover:bg-orange-600",
  "bg-teal-500 hover:bg-teal-600",
];

export function SequenceMemoryTest() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [gameState, setGameState] = useState<GameState>("idle");
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stats, setStats] = useState<GameStats>({
    level: 1,
    maxLevel: 1,
    correctSequences: 0,
    incorrectSequences: 0,
    sequenceLength: 0,
    timeElapsed: 0,
    startTime: 0
  });
  
  const { saveResult, isLoading: isSaving } = useGameResults();
  const { toast } = useToast();
  const sequenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const config = difficultyConfig[difficulty];
  
  // Clean up timers when component unmounts
  useEffect(() => {
    return () => {
      if (sequenceTimerRef.current) {
        clearTimeout(sequenceTimerRef.current);
      }
    };
  }, []);
  
  // Start a new game
  const startGame = () => {
    const newStats: GameStats = {
      level: 1,
      maxLevel: 1,
      correctSequences: 0,
      incorrectSequences: 0,
      sequenceLength: config.startingLength,
      timeElapsed: 0,
      startTime: Date.now()
    };
    
    setStats(newStats);
    generateNewSequence(config.startingLength);
    setGameState("watch");
  };
  
  // Generate a new random sequence
  const generateNewSequence = (length: number) => {
    const newSequence = Array.from({ length }, () => 
      Math.floor(Math.random() * config.buttonCount)
    );
    
    setSequence(newSequence);
    setUserSequence([]);
    
    // Start playing the sequence after a short delay
    setTimeout(() => {
      playSequence(newSequence);
    }, 500);
  };
  
  // Play the sequence for the user to watch
  const playSequence = (seq: number[]) => {
    setIsPlaying(true);
    let step = 0;
    
    const playStep = () => {
      // Highlight the current button
      setActiveButton(seq[step]);
      
      // Turn off highlight after a delay
      sequenceTimerRef.current = setTimeout(() => {
        setActiveButton(null);
        step++;
        
        if (step < seq.length) {
          // Play next button after the gap
          sequenceTimerRef.current = setTimeout(playStep, config.playbackGap);
        } else {
          // Sequence finished playing
          setIsPlaying(false);
          setGameState("recall");
        }
      }, config.playbackSpeed);
    };
    
    // Start playing
    sequenceTimerRef.current = setTimeout(playStep, config.playbackGap);
  };
  
  // Handle user clicking a button during recall
  const handleButtonClick = (buttonIndex: number) => {
    if (gameState !== "recall" || isPlaying) return;
    
    // Flash the button
    setActiveButton(buttonIndex);
    setTimeout(() => setActiveButton(null), 300);
    
    // Add to user sequence
    const newUserSequence = [...userSequence, buttonIndex];
    setUserSequence(newUserSequence);
    
    // Check if the user has made an error
    if (newUserSequence[newUserSequence.length - 1] !== sequence[newUserSequence.length - 1]) {
      // Incorrect!
      handleIncorrectSequence();
      return;
    }
    
    // Check if user completed the entire sequence
    if (newUserSequence.length === sequence.length) {
      // Correct!
      handleCorrectSequence();
    }
  };
  
  // Handle correct sequence completion
  const handleCorrectSequence = () => {
    const newLevel = stats.level + 1;
    const newLength = config.startingLength + newLevel - 1;
    
    // Update stats
    setStats(prev => ({
      ...prev,
      level: newLevel,
      maxLevel: Math.max(prev.maxLevel, newLevel),
      correctSequences: prev.correctSequences + 1,
      sequenceLength: newLength
    }));
    
    // Short celebration pause
    setTimeout(() => {
      generateNewSequence(newLength);
      setGameState("watch");
    }, 1000);
  };
  
  // Handle incorrect sequence
  const handleIncorrectSequence = () => {
    // Update stats
    setStats(prev => ({
      ...prev,
      incorrectSequences: prev.incorrectSequences + 1,
      timeElapsed: Date.now() - prev.startTime
    }));
    
    // Show correct sequence again
    setTimeout(() => {
      playSequence(sequence);
      setUserSequence([]);
    }, 1000);
  };
  
  // End the game
  const endGame = () => {
    const endTime = Date.now();
    const timeElapsed = endTime - stats.startTime;
    
    setStats(prev => ({
      ...prev,
      timeElapsed
    }));
    
    setGameState("completed");
    
    // Calculate metrics
    const { score, spanLength } = calculateScore();
    
    // Save the game result
    saveResult({
      gameType: "sequence-memory",
      score,
      level: stats.maxLevel,
      duration: Math.round(timeElapsed / 1000), // Convert to seconds
      difficulty,
      accuracy: stats.correctSequences / (stats.correctSequences + stats.incorrectSequences) * 100,
      metrics: {
        spanLength,
        correctSequences: stats.correctSequences,
        incorrectSequences: stats.incorrectSequences,
        cognitiveDomainsAffected: ["working memory", "attention", "processing speed"]
      },
      tags: ["memory", "cognitive training"]
    }).then(() => {
      toast({
        title: "Results saved!",
        description: "Your progress has been recorded.",
        variant: "default"
      });
    }).catch(error => {
      console.error("Failed to save results:", error);
      toast({
        title: "Could not save results",
        description: "There was an error saving your progress.",
        variant: "destructive"
      });
    });
  };
  
  // Get score based on max level reached
  const calculateScore = () => {
    return {
      score: stats.maxLevel,
      spanLength: config.startingLength + stats.maxLevel - 1
    };
  };
  
  // Get performance feedback based on level reached
  const getPerformanceFeedback = () => {
    const { spanLength } = calculateScore();
    
    // Average span is around 7 for adults
    const averageSpan = {
      easy: 7,
      medium: 6,
      hard: 5
    };
    
    if (spanLength >= averageSpan[difficulty] + 3) {
      return {
        title: "Exceptional Memory Span!",
        description: "Your working memory capacity is well above average."
      };
    } else if (spanLength >= averageSpan[difficulty] + 1) {
      return {
        title: "Excellent Memory Span!",
        description: "Your working memory capacity is above average."
      };
    } else if (spanLength >= averageSpan[difficulty] - 1) {
      return {
        title: "Good Memory Span",
        description: "Your working memory capacity is around average."
      };
    } else if (spanLength >= averageSpan[difficulty] - 2) {
      return {
        title: "Fair Memory Span",
        description: "Your working memory capacity is slightly below average."
      };
    } else {
      return {
        title: "Developing Memory Span",
        description: "Regular practice can help improve your working memory capacity."
      };
    }
  };
  
  // Get brain health insights based on performance
  const getBrainHealthInsights = () => {
    const { spanLength } = calculateScore();
    const averageSpan = {
      easy: 7,
      medium: 6,
      hard: 5
    };
    
    if (spanLength >= averageSpan[difficulty]) {
      return "Strong working memory is linked to better performance in problem-solving, learning, and multitasking. Keep practicing to maintain this cognitive advantage.";
    } else {
      return "Working memory is a core cognitive function that supports learning, reasoning, and decision-making. Regular practice of sequence memory exercises can help strengthen this important ability.";
    }
  };
  
  // Render the appropriate game content based on state
  const renderGameContent = () => {
    switch (gameState) {
      case "idle":
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-medium">Choose Difficulty</h3>
              <p className="text-muted-foreground">Higher difficulty means more buttons and faster sequences.</p>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button 
                variant={difficulty === "easy" ? "default" : "outline"} 
                onClick={() => setDifficulty("easy")}
                className="justify-between"
              >
                <span>Easy</span>
                <Badge variant="secondary">{difficultyConfig.easy.buttonCount} buttons, slow</Badge>
              </Button>
              
              <Button 
                variant={difficulty === "medium" ? "default" : "outline"} 
                onClick={() => setDifficulty("medium")}
                className="justify-between"
              >
                <span>Medium</span>
                <Badge variant="secondary">{difficultyConfig.medium.buttonCount} buttons, medium</Badge>
              </Button>
              
              <Button 
                variant={difficulty === "hard" ? "default" : "outline"} 
                onClick={() => setDifficulty("hard")}
                className="justify-between"
              >
                <span>Hard</span>
                <Badge variant="secondary">{difficultyConfig.hard.buttonCount} buttons, fast</Badge>
              </Button>
            </div>
            
            <Button onClick={startGame} className="w-full" size="lg">
              Start Test
            </Button>
            
            <div className="text-sm text-muted-foreground">
              <h4 className="font-medium mb-2">How It Works:</h4>
              <ol className="list-decimal list-inside space-y-1">
                <li>Watch the sequence of highlighted buttons</li>
                <li>After the sequence ends, repeat it by clicking the buttons in the same order</li>
                <li>Each successful round adds one more step to the sequence</li>
                <li>If you make a mistake, the sequence will replay</li>
                <li>Try to reach the highest level possible</li>
              </ol>
            </div>
          </div>
        );
        
      case "watch":
      case "recall":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Sequence Memory
              </h3>
              <Badge variant="outline">Level {stats.level}</Badge>
            </div>
            
            <Alert className={gameState === "watch" ? "" : "border-muted bg-transparent"}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>
                {gameState === "watch" ? "Memorizing Phase" : "Recall Phase"}
              </AlertTitle>
              <AlertDescription>
                {gameState === "watch" 
                  ? "Watch carefully. Remember the order of the highlighted buttons."
                  : "Click the buttons in the same order they were highlighted."}
              </AlertDescription>
            </Alert>
            
            <div className={cn(
              "grid gap-4 mx-auto",
              difficulty === "easy" ? "grid-cols-2" : "grid-cols-3",
              "max-w-md"
            )}>
              {Array.from({ length: config.buttonCount }).map((_, index) => (
                <button
                  key={index}
                  disabled={gameState === "watch" || isPlaying}
                  onClick={() => handleButtonClick(index)}
                  className={cn(
                    "w-full aspect-square rounded-lg transition-all transform shadow-md",
                    buttonColors[index % buttonColors.length],
                    activeButton === index ? "scale-95 brightness-150 ring-4 ring-white" : "",
                    gameState === "watch" || isPlaying ? "cursor-not-allowed opacity-80" : "cursor-pointer"
                  )}
                />
              ))}
            </div>
            
            {gameState === "recall" && (
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setUserSequence([])}>
                  Reset
                </Button>
                <Button variant="outline" onClick={endGame}>
                  End Game
                </Button>
              </div>
            )}
            
            {gameState === "recall" && (
              <div className="flex items-center justify-center gap-2">
                <div className="text-muted-foreground">Progress:</div>
                <div className="flex gap-1">
                  {sequence.map((_, index) => (
                    <div 
                      key={index}
                      className={cn(
                        "w-2 h-2 rounded-full",
                        index < userSequence.length 
                          ? (userSequence[index] === sequence[index] ? "bg-green-500" : "bg-red-500") 
                          : "bg-gray-300"
                      )}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
        
      case "completed":
        return renderCompletedState();
    }
  };

  // Render completed state
  const renderCompletedState = () => {
    const feedback = getPerformanceFeedback();
    const { spanLength } = calculateScore();
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <div className="inline-block p-3 rounded-full bg-primary/10 mb-4">
            <Brain className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-2xl font-bold">{feedback.title}</h3>
          <p className="text-muted-foreground">{feedback.description}</p>
        </div>
        
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <div className="text-4xl font-bold">{spanLength}</div>
            <div className="text-sm text-muted-foreground">Memory Span</div>
          </div>
          
          <Separator orientation="vertical" className="h-12" />
          
          <div className="text-center">
            <div className="text-4xl font-bold">{stats.correctSequences}</div>
            <div className="text-sm text-muted-foreground">Sequences</div>
          </div>
        </div>
        
        <Alert>
          <Brain className="h-4 w-4" />
          <AlertTitle>Brain Health Insight</AlertTitle>
          <AlertDescription>
            {getBrainHealthInsights()}
          </AlertDescription>
        </Alert>
        
        {isSaving ? (
          <div className="flex justify-center py-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>Saving your results...</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 pt-2">
            <Button onClick={() => startGame()} className="w-full">
              Try Again
            </Button>
            <Button variant="outline" onClick={() => setGameState("idle")} className="w-full">
              Change Difficulty
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListOrdered className="h-6 w-6 text-primary" />
          Sequence Memory Test
        </CardTitle>
        <CardDescription>
          Remember and repeat increasingly complex sequences to improve working memory.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderGameContent()}
      </CardContent>
    </Card>
  );
} 