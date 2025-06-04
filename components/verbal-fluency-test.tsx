"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { MessageSquare, Clock, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface GameStats {
  wordsCount: number;
  uniqueWords: string[];
  repeatedWords: string[];
  category: string;
  timeElapsed: number;
  startTime: number;
}

type GameState = "idle" | "playing" | "completed";

// Categories for the verbal fluency test
const categories = [
  { name: "Animals", examples: "dog, cat, elephant..." },
  { name: "Fruits", examples: "apple, banana, orange..." },
  { name: "Vehicles", examples: "car, bus, train..." },
  { name: "Clothing", examples: "shirt, pants, dress..." },
  { name: "Countries", examples: "USA, France, Japan..." },
  { name: "Occupations", examples: "doctor, teacher, engineer..." },
  { name: "Sports", examples: "soccer, basketball, tennis..." },
  { name: "Kitchen Items", examples: "fork, pan, plate..." },
  { name: "Colors", examples: "red, blue, green..." },
  { name: "Furniture", examples: "chair, table, sofa..." }
];

export function VerbalFluencyTest() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [timeLeft, setTimeLeft] = useState(60);
  const [category, setCategory] = useState(categories[0]);
  const [currentWord, setCurrentWord] = useState("");
  const [words, setWords] = useState<string[]>([]);
  const [stats, setStats] = useState<GameStats>({
    wordsCount: 0,
    uniqueWords: [],
    repeatedWords: [],
    category: "",
    timeElapsed: 0,
    startTime: 0
  });
  
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);
  
  // Focus the input field when game starts
  useEffect(() => {
    if (gameState === "playing" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState]);
  
  // Timer countdown
  useEffect(() => {
    if (gameState === "playing") {
      if (timeLeft > 0) {
        timerRef.current = setTimeout(() => {
          setTimeLeft((prev) => prev - 1);
        }, 1000);
      } else {
        endGame();
      }
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, gameState]);
  
  // Start a new game
  const startGame = () => {
    // Reset game state
    setWords([]);
    setCurrentWord("");
    setTimeLeft(60);
    
    // Initialize stats
    setStats({
      wordsCount: 0,
      uniqueWords: [],
      repeatedWords: [],
      category: category.name,
      timeElapsed: 0,
      startTime: Date.now()
    });
    
    setGameState("playing");
  };
  
  // Handle user input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentWord(e.target.value);
  };
  
  // Submit a word
  const submitWord = () => {
    if (!currentWord.trim()) return;
    
    const word = currentWord.trim().toLowerCase();
    
    // Update stats
    setStats(prev => {
      // Check if the word has already been used
      if (prev.uniqueWords.includes(word)) {
        return {
          ...prev,
          repeatedWords: [...prev.repeatedWords, word]
        };
      } else {
        return {
          ...prev,
          wordsCount: prev.wordsCount + 1,
          uniqueWords: [...prev.uniqueWords, word]
        };
      }
    });
    
    // Add to words list and clear input
    setWords(prev => [...prev, currentWord.trim()]);
    setCurrentWord("");
  };
  
  // Handle key press (Enter)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submitWord();
    }
  };
  
  // End the game and calculate final stats
  const endGame = () => {
    setStats(prev => ({
      ...prev,
      timeElapsed: Date.now() - prev.startTime
    }));
    setGameState("completed");
  };
  
  // Calculate performance score and percentile
  const calculatePerformance = () => {
    const count = stats.uniqueWords.length;
    
    // Average words per minute by age group (rough estimates)
    const averages = {
      low: 10, // Below average
      average: 15, // Average
      high: 20, // Above average
      exceptional: 25 // Exceptional
    };
    
    let percentile = 0;
    
    if (count >= averages.exceptional) {
      percentile = 95;
    } else if (count >= averages.high) {
      percentile = 75;
    } else if (count >= averages.average) {
      percentile = 50;
    } else if (count >= averages.low) {
      percentile = 25;
    } else {
      percentile = 10;
    }
    
    return {
      uniqueCount: count,
      totalCount: words.length,
      percentile
    };
  };
  
  // Get performance feedback
  const getPerformanceFeedback = () => {
    const performance = calculatePerformance();
    
    if (performance.percentile >= 90) {
      return {
        title: "Exceptional Verbal Fluency!",
        description: "Your verbal fluency skills are in the top percentile."
      };
    } else if (performance.percentile >= 75) {
      return {
        title: "Excellent Verbal Fluency!",
        description: "Your verbal fluency skills are above average."
      };
    } else if (performance.percentile >= 40) {
      return {
        title: "Good Verbal Fluency",
        description: "Your verbal fluency skills are around average."
      };
    } else if (performance.percentile >= 20) {
      return {
        title: "Fair Verbal Fluency",
        description: "Your verbal fluency skills could benefit from practice."
      };
    } else {
      return {
        title: "Developing Verbal Fluency",
        description: "Regular verbal exercises can help improve your fluency."
      };
    }
  };
  
  // Get health insights based on performance
  const getHealthInsights = () => {
    const performance = calculatePerformance();
    
    if (performance.percentile >= 75) {
      return "Strong verbal fluency is associated with robust executive function and cognitive flexibility. This cognitive strength may provide protection against certain types of cognitive decline.";
    } else if (performance.percentile >= 40) {
      return "Regular practice of verbal fluency exercises may help maintain and improve language processing and executive function, both important for daily cognitive tasks.";
    } else {
      return "Verbal fluency is a complex cognitive skill that engages both language and executive function networks in the brain. Daily practice, reading widely, and engaging in conversation can enhance this ability.";
    }
  };
  
  // Select a random category
  const getRandomCategory = () => {
    const randomIndex = Math.floor(Math.random() * categories.length);
    setCategory(categories[randomIndex]);
  };
  
  // Render the appropriate game content based on state
  const renderGameContent = () => {
    switch (gameState) {
      case "idle":
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-medium">Category Selection</h3>
              <p className="text-muted-foreground">Select a category or get a random one.</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Selected Category</h4>
                  <p className="text-muted-foreground text-sm">{category.examples}</p>
                </div>
                <Badge variant="outline" className="text-lg px-3 py-1">{category.name}</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  onClick={getRandomCategory}
                  className="w-full"
                >
                  Random Category
                </Button>
                
                <Button 
                  onClick={startGame} 
                  className="w-full"
                >
                  Start Test
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Available Categories</h4>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat, index) => (
                  <Button
                    key={index}
                    variant={cat.name === category.name ? "default" : "outline"}
                    onClick={() => setCategory(cat)}
                    className="justify-start overflow-hidden text-ellipsis"
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <h4 className="font-medium mb-2">How It Works:</h4>
              <ol className="list-decimal list-inside space-y-1">
                <li>You will have 60 seconds to list as many items as possible in the selected category</li>
                <li>Type each word and press Enter to submit</li>
                <li>Try to list as many unique words as you can</li>
                <li>Repeated words will not count toward your score</li>
              </ol>
            </div>
          </div>
        );
        
      case "playing":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-medium">Category: {category.name}</h3>
                <p className="text-muted-foreground">
                  List as many {category.name.toLowerCase()} as you can
                </p>
              </div>
              <div className="flex items-center gap-2 text-lg font-mono">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className={cn(
                  timeLeft <= 10 ? "text-red-500 animate-pulse font-bold" : ""
                )}>{timeLeft}s</span>
              </div>
            </div>
            
            <Progress value={(timeLeft / 60) * 100} className={timeLeft <= 10 ? "bg-red-100" : ""} />
            
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={currentWord}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder={`Type a ${category.name.toLowerCase().slice(0, -1)} and press Enter...`}
                className="flex-1"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck="false"
              />
              <Button onClick={submitWord}>Add</Button>
            </div>
            
            <div className="bg-muted/40 rounded-md p-2 h-40 overflow-y-auto">
              <h4 className="font-medium mb-2">Your Words ({words.length}):</h4>
              <div className="flex flex-wrap gap-2">
                {words.map((word, index) => {
                  const isDuplicate = stats.uniqueWords.indexOf(word.toLowerCase()) !== 
                    stats.uniqueWords.lastIndexOf(word.toLowerCase());
                  
                  return (
                    <Badge 
                      key={index} 
                      variant={isDuplicate ? "outline" : "secondary"}
                      className={isDuplicate ? "opacity-60 line-through" : ""}
                    >
                      {word}
                    </Badge>
                  );
                })}
                {words.length === 0 && (
                  <p className="text-muted-foreground text-sm italic">
                    Words you add will appear here...
                  </p>
                )}
              </div>
            </div>
            
            <Button onClick={endGame} variant="outline" className="w-full">
              End Test Early
            </Button>
          </div>
        );
        
      case "completed":
        const feedback = getPerformanceFeedback();
        const { uniqueCount, totalCount, percentile } = calculatePerformance();
        
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
                <div className="text-4xl font-bold">{uniqueCount}</div>
                <div className="text-sm text-muted-foreground">Unique Words</div>
              </div>
              
              <Separator orientation="vertical" className="h-12" />
              
              <div className="text-center">
                <div className="text-4xl font-bold">{totalCount - uniqueCount}</div>
                <div className="text-sm text-muted-foreground">Repeated</div>
              </div>
              
              <Separator orientation="vertical" className="h-12" />
              
              <div className="text-center">
                <div className="text-4xl font-bold">{percentile}%</div>
                <div className="text-sm text-muted-foreground">Percentile</div>
              </div>
            </div>
            
            <div className="bg-muted/40 rounded-md p-4">
              <h4 className="font-medium mb-2">Words Generated for &quot;{stats.category}&quot;:</h4>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {stats.uniqueWords.length > 0 ? (
                  stats.uniqueWords.map((word, index) => (
                    <Badge key={index} variant="secondary">
                      {word}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm italic">No words generated</p>
                )}
              </div>
            </div>
            
            <Alert>
              <Brain className="h-4 w-4" />
              <AlertTitle>Brain Health Insight</AlertTitle>
              <AlertDescription>
                {getHealthInsights()}
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-3">
              <Button onClick={() => startGame()} className="flex-1">
                Try Again
              </Button>
              <Button variant="outline" onClick={() => setGameState("idle")} className="flex-1">
                Change Category
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          Verbal Fluency Test
        </CardTitle>
        <CardDescription>
          List as many words as possible in a given category to assess language skills and executive function.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderGameContent()}
      </CardContent>
    </Card>
  );
} 