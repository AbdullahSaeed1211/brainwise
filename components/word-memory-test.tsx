"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Check, X, Brain, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type GameState = "idle" | "memorize" | "recall" | "completed";

interface GameStats {
  correctRecalls: number;
  incorrectRecalls: number;
  memorizedWords: string[];
  testedWords: string[];
  userAnswers: Record<string, boolean>;
  timeElapsed: number;
  startTime: number;
}

// Word pools for different difficulty levels
const wordPools = {
  easy: [
    "house", "apple", "book", "tree", "car", "dog", "table", "water", "sun", "chair",
    "phone", "bird", "paper", "door", "light", "flower", "window", "key", "milk", "bread",
    "shoe", "hat", "cat", "box", "cup", "pen", "clock", "hand", "bed", "road"
  ],
  medium: [
    "mountain", "journey", "computer", "elephant", "vacation", "universe", "kitchen", "library", 
    "station", "factory", "morning", "schedule", "painting", "message", "student", "birthday",
    "question", "apartment", "magazine", "medicine", "umbrella", "notebook", "furniture", "vegetable",
    "envelope", "language", "musician", "dessert", "telephone", "restaurant"
  ],
  hard: [
    "accomplishment", "contemporary", "distribution", "entrepreneur", "fundamental", "jurisdiction", 
    "laboratory", "maintenance", "negotiation", "opportunity", "parliamentary", "qualification", 
    "responsibility", "sophisticated", "transformation", "undergraduate", "vulnerability", 
    "contribution", "demonstration", "establishment", "infrastructure", "manufacturer", 
    "organization", "partnership", "recommendation", "substantial", "technological", "certificate", 
    "evaluation", "participation"
  ]
};

// Number of words to memorize based on difficulty
const difficultyConfig = {
  easy: { wordCount: 8, memorizeTime: 30, newWordRatio: 0.3 },
  medium: { wordCount: 12, memorizeTime: 45, newWordRatio: 0.4 },
  hard: { wordCount: 16, memorizeTime: 60, newWordRatio: 0.5 }
};

export function WordMemoryTest() {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [gameState, setGameState] = useState<GameState>("idle");
  const [timeLeft, setTimeLeft] = useState(0);
  const [wordList, setWordList] = useState<string[]>([]);
  const [testWords, setTestWords] = useState<{ word: string; isOriginal: boolean }[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [stats, setStats] = useState<GameStats>({
    correctRecalls: 0,
    incorrectRecalls: 0,
    memorizedWords: [],
    testedWords: [],
    userAnswers: {},
    timeElapsed: 0,
    startTime: 0
  });

  // Initialize the game
  const startGame = () => {
    const config = difficultyConfig[difficulty];
    
    // Select random words from the appropriate pool
    const shuffledWords = [...wordPools[difficulty]].sort(() => Math.random() - 0.5);
    const gameWords = shuffledWords.slice(0, config.wordCount);
    
    setWordList(gameWords);
    setTimeLeft(config.memorizeTime);
    setGameState("memorize");
    
    setStats({
      correctRecalls: 0,
      incorrectRecalls: 0,
      memorizedWords: gameWords,
      testedWords: [],
      userAnswers: {},
      timeElapsed: 0,
      startTime: Date.now()
    });
  };

  // Prepare the recall phase - wrapped in useCallback to prevent recreation on every render
  const startRecallPhase = useCallback(() => {
    const config = difficultyConfig[difficulty];
    const memorizedWords = [...wordList];
    
    // Calculate how many new words to add
    const newWordCount = Math.floor(memorizedWords.length * config.newWordRatio);
    
    // Get words not in the memorized list
    const unusedWords = wordPools[difficulty].filter(word => !memorizedWords.includes(word));
    const newWords = unusedWords.sort(() => Math.random() - 0.5).slice(0, newWordCount);
    
    // Create the test word list with a mix of original and new words
    const allTestWords = [
      ...memorizedWords.map(word => ({ word, isOriginal: true })),
      ...newWords.map(word => ({ word, isOriginal: false }))
    ].sort(() => Math.random() - 0.5);
    
    setTestWords(allTestWords);
    setCurrentWordIndex(0);
    setGameState("recall");
  }, [difficulty, wordList]);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameState === "memorize" && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (gameState === "memorize" && timeLeft === 0) {
      startRecallPhase();
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [gameState, timeLeft, startRecallPhase]);

  // Handle user's answer (yes/no) during recall phase
  const handleAnswer = (remembered: boolean) => {
    const currentWord = testWords[currentWordIndex];
    const isCorrect = (remembered && currentWord.isOriginal) || (!remembered && !currentWord.isOriginal);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      correctRecalls: prev.correctRecalls + (isCorrect ? 1 : 0),
      incorrectRecalls: prev.incorrectRecalls + (isCorrect ? 0 : 1),
      testedWords: [...prev.testedWords, currentWord.word],
      userAnswers: { ...prev.userAnswers, [currentWord.word]: isCorrect }
    }));
    
    // Move to next word or end game
    if (currentWordIndex < testWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      endGame();
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

  // Calculate the final score (0-100)
  const calculateScore = () => {
    const { correctRecalls, testedWords } = stats;
    return Math.round((correctRecalls / testedWords.length) * 100);
  };

  // Provide feedback based on performance
  const getPerformanceFeedback = () => {
    const score = calculateScore();
    
    if (score >= 90) {
      return {
        title: "Excellent Memory!",
        description: "You have exceptional verbal recall abilities."
      };
    } else if (score >= 75) {
      return {
        title: "Great Performance!",
        description: "Your verbal memory skills are above average."
      };
    } else if (score >= 60) {
      return {
        title: "Good Job!",
        description: "You have solid verbal memory abilities."
      };
    } else if (score >= 45) {
      return {
        title: "Fair Performance",
        description: "Your verbal memory could benefit from regular practice."
      };
    } else {
      return {
        title: "Room for Improvement",
        description: "Regular practice can significantly enhance your verbal memory."
      };
    }
  };

  // Brain health insights based on performance
  const getBrainHealthInsights = () => {
    const score = calculateScore();
    
    if (score >= 75) {
      return "Strong verbal memory is associated with reduced risk of cognitive decline. Continue practicing to maintain this advantage.";
    } else if (score >= 50) {
      return "Regular verbal memory training has been shown to improve cognitive resilience and may help maintain brain health as you age.";
    } else {
      return "Verbal memory is an important cognitive skill that can be improved with consistent practice. Daily word-based exercises may help strengthen this ability.";
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
              <p className="text-muted-foreground">Higher difficulty uses more complex words and shorter memorization time.</p>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button 
                variant={difficulty === "easy" ? "default" : "outline"} 
                onClick={() => setDifficulty("easy")}
                className="justify-between"
              >
                <span>Easy</span>
                <Badge variant="secondary">{difficultyConfig.easy.wordCount} words, {difficultyConfig.easy.memorizeTime}s</Badge>
              </Button>
              
              <Button 
                variant={difficulty === "medium" ? "default" : "outline"} 
                onClick={() => setDifficulty("medium")}
                className="justify-between"
              >
                <span>Medium</span>
                <Badge variant="secondary">{difficultyConfig.medium.wordCount} words, {difficultyConfig.medium.memorizeTime}s</Badge>
              </Button>
              
              <Button 
                variant={difficulty === "hard" ? "default" : "outline"} 
                onClick={() => setDifficulty("hard")}
                className="justify-between"
              >
                <span>Hard</span>
                <Badge variant="secondary">{difficultyConfig.hard.wordCount} words, {difficultyConfig.hard.memorizeTime}s</Badge>
              </Button>
            </div>
            
            <Button onClick={startGame} className="w-full" size="lg">
              Start Test
            </Button>
            
            <div className="text-sm text-muted-foreground">
              <h4 className="font-medium mb-2">How It Works:</h4>
              <ol className="list-decimal list-inside space-y-1">
                <li>You&apos;ll be shown a list of words to memorize</li>
                <li>After time expires, you&apos;ll be asked if you remember seeing each word</li>
                <li>Some words will be new ones you haven&apos;t seen</li>
                <li>Answer correctly to improve your score</li>
              </ol>
            </div>
          </div>
        );
        
      case "memorize":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-medium">Memorize These Words</h3>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono">{timeLeft}s</span>
              </div>
            </div>
            
            <Progress value={(timeLeft / difficultyConfig[difficulty].memorizeTime) * 100} />
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-2">
              {wordList.map((word, index) => (
                <div 
                  key={index} 
                  className="bg-secondary/50 rounded-md p-3 text-center font-medium"
                >
                  {word}
                </div>
              ))}
            </div>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Memorization Phase</AlertTitle>
              <AlertDescription>
                Remember these words. You&apos;ll be tested on them shortly.
              </AlertDescription>
            </Alert>
          </div>
        );
        
      case "recall":
        const currentWord = testWords[currentWordIndex];
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-medium">Did you see this word?</h3>
              <div className="text-sm text-muted-foreground">
                {currentWordIndex + 1} of {testWords.length}
              </div>
            </div>
            
            <Progress value={((currentWordIndex + 1) / testWords.length) * 100} />
            
            <div className="py-8 text-center">
              <div className="text-3xl font-bold mb-2">{currentWord.word}</div>
              <p className="text-muted-foreground">Was this word in the list you memorized?</p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 py-6" 
                onClick={() => handleAnswer(false)}
              >
                <X className="mr-2 h-5 w-5 text-destructive" />
                No
              </Button>
              
              <Button 
                className="flex-1 py-6" 
                onClick={() => handleAnswer(true)}
              >
                <Check className="mr-2 h-5 w-5" />
                Yes
              </Button>
            </div>
          </div>
        );
        
      case "completed":
        const feedback = getPerformanceFeedback();
        const score = calculateScore();
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
                <div className="text-4xl font-bold">{score}%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
              
              <Separator orientation="vertical" className="h-12" />
              
              <div className="text-center">
                <div className="text-4xl font-bold">{stats.correctRecalls}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              
              <Separator orientation="vertical" className="h-12" />
              
              <div className="text-center">
                <div className="text-4xl font-bold">{stats.incorrectRecalls}</div>
                <div className="text-sm text-muted-foreground">Incorrect</div>
              </div>
            </div>
            
            <Alert>
              <Brain className="h-4 w-4" />
              <AlertTitle>Brain Health Insight</AlertTitle>
              <AlertDescription>
                {getBrainHealthInsights()}
              </AlertDescription>
            </Alert>
            
            <div className="flex flex-col gap-4 pt-2">
              <Button onClick={() => startGame()} className="w-full">
                Try Again
              </Button>
              <Button variant="outline" onClick={() => setGameState("idle")} className="w-full">
                Change Difficulty
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
          <BookOpen className="h-6 w-6 text-primary" />
          Word Memory Test
        </CardTitle>
        <CardDescription>
          Test and improve your verbal memory by recalling words from a list.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderGameContent()}
      </CardContent>
    </Card>
  );
} 