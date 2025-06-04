"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Clock, 
  CheckCircle2, 
  XCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type GameState = "idle" | "playing" | "completed";
type Difficulty = "easy" | "medium" | "hard";
type PatternType = "sequence" | "matrix" | "mixed";

interface GameStats {
  correct: number;
  incorrect: number;
  skipped: number;
  timeElapsed: number;
  startTime: number;
  patternsCompleted: number;
}

interface PatternQuestion {
  type: "sequence" | "matrix";
  options: number[];
  correctAnswer: number;
  pattern: number[][];
  description: string;
}

// Configuration for different difficulty levels
const difficultyConfig = {
  easy: {
    timeLimit: 120,
    matrixSize: 3,
    sequenceLength: 4,
    questionCount: 8
  },
  medium: {
    timeLimit: 180,
    matrixSize: 4,
    sequenceLength: 6,
    questionCount: 12
  },
  hard: {
    timeLimit: 240,
    matrixSize: 5,
    sequenceLength: 8,
    questionCount: 16
  }
};

export function PatternRecognitionTest() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [patternType, setPatternType] = useState<PatternType>("mixed");
  const [gameState, setGameState] = useState<GameState>("idle");
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<PatternQuestion[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [stats, setStats] = useState<GameStats>({
    correct: 0,
    incorrect: 0,
    skipped: 0,
    timeElapsed: 0,
    startTime: 0,
    patternsCompleted: 0
  });
  
  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameState === "playing" && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (gameState === "playing" && timeLeft === 0) {
      endGame();
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [gameState, timeLeft]);
  
  // Start a new game
  const startGame = () => {
    // Reset game state
    const config = difficultyConfig[difficulty];
    
    setStats({
      correct: 0,
      incorrect: 0,
      skipped: 0,
      timeElapsed: 0,
      startTime: Date.now(),
      patternsCompleted: 0
    });
    
    setTimeLeft(config.timeLimit);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    
    // Generate questions based on difficulty and pattern type
    setQuestions(generateQuestions(difficulty, patternType, config.questionCount));
    
    // Start the game
    setGameState("playing");
  };
  
  // Generate a set of pattern questions
  const generateQuestions = (
    difficulty: Difficulty, 
    type: PatternType, 
    count: number
  ): PatternQuestion[] => {
    const questions: PatternQuestion[] = [];
    const config = difficultyConfig[difficulty];
    
    for (let i = 0; i < count; i++) {
      // For mixed type, alternate between sequence and matrix
      const questionType = type === "mixed" 
        ? (i % 2 === 0 ? "sequence" : "matrix") 
        : type as "sequence" | "matrix";
      
      if (questionType === "sequence") {
        questions.push(generateSequenceQuestion(config.sequenceLength));
      } else {
        questions.push(generateMatrixQuestion(config.matrixSize));
      }
    }
    
    return questions;
  };
  
  // Generate a sequence-based pattern question
  const generateSequenceQuestion = (length: number): PatternQuestion => {
    // Create a sequence based on a rule (e.g., +2, +3, etc.)
    const sequence: number[] = [];
    const rules = [
      (n: number) => n + 1,  // +1
      (n: number) => n + 2,  // +2
      (n: number) => n + 3,  // +3
      (n: number) => n * 2,  // *2
      (n: number) => Math.floor(n * 1.5), // *1.5
      (n: number) => n ** 2, // square
      (n: number) => n + (sequence.length > 0 ? sequence[sequence.length - 1] : 0) // Fibonacci-like
    ];
    
    // Select a random rule
    const rule = rules[Math.floor(Math.random() * rules.length)];
    
    // Start with a small number
    let value = Math.floor(Math.random() * 5) + 1;
    sequence.push(value);
    
    // Generate the sequence
    for (let i = 1; i < length; i++) {
      value = rule(value);
      sequence.push(value);
    }
    
    // The correct answer is the next value in the sequence
    const correctAnswer = rule(value);
    
    // Format the sequence for display
    const pattern = [sequence.map(n => isNaN(n) ? 0 : n)];
    
    // Generate options (including the correct answer)
    const options = generateOptions(correctAnswer, 4);
    
    const description = "Find the next number in the sequence";
    
    return {
      type: "sequence",
      options,
      correctAnswer,
      pattern,
      description
    };
  };
  
  // Helper function to calculate the missing number in a matrix
  const calculateMissingNumber = (matrix: number[][]): number => {
    // For this simple implementation, we'll use a sum-based pattern
    // The missing number makes the sum of each row, column and diagonal equal
    
    const size = matrix.length;
    let missingRow = -1;
    let missingCol = -1;
    
    // Find the position of the missing number (marked as 0)
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (matrix[i][j] === 0) {
          missingRow = i;
          missingCol = j;
          break;
        }
      }
      if (missingRow !== -1) break;
    }
    
    // If we can't find the missing position, return a random value
    if (missingRow === -1 || missingCol === -1) {
      return Math.floor(Math.random() * 9) + 1;
    }
    
    // For a simple pattern, we'll make the row sum equal to other rows
    // First, find a complete row to get the target sum
    let targetSum = 0;
    let completeRowFound = false;
    
    for (let i = 0; i < size; i++) {
      if (i !== missingRow) {
        let rowSum = 0;
        let hasZero = false;
        for (let j = 0; j < size; j++) {
          if (matrix[i][j] === 0) {
            hasZero = true;
            break;
          }
          rowSum += matrix[i][j];
        }
        if (!hasZero) {
          targetSum = rowSum;
          completeRowFound = true;
          break;
        }
      }
    }
    
    // If no complete row found, use a reasonable default
    if (!completeRowFound) {
      targetSum = 15; // A simple default
    }
    
    // Calculate what the missing number should be
    let rowSum = 0;
    for (let j = 0; j < size; j++) {
      if (j !== missingCol) {
        rowSum += matrix[missingRow][j];
      }
    }
    
    const missingNumber = targetSum - rowSum;
    return missingNumber > 0 ? missingNumber : Math.floor(Math.random() * 9) + 1;
  };
  
  const generateMatrixQuestion = (size: number): PatternQuestion => {
    // Create a matrix with a pattern
    const matrix: number[][] = [];
    
    // Fill the matrix with random numbers
    for (let i = 0; i < size; i++) {
      const row: number[] = [];
      for (let j = 0; j < size; j++) {
        // Leave one cell empty (represented by 0)
        if (i === Math.floor(size/2) && j === Math.floor(size/2)) {
          row.push(0);
        } else {
          row.push(Math.floor(Math.random() * 9) + 1);
        }
      }
      matrix.push(row);
    }
    
    // Determine the correct answer
    const correctAnswer = calculateMissingNumber(matrix);
    
    // Generate options (including the correct answer)
    const options = generateOptions(correctAnswer, 4);
    
    const description = "Find the missing number that completes the pattern";
    
    return {
      type: "matrix",
      options,
      correctAnswer,
      pattern: matrix,
      description
    };
  };
  
  // Generate options including the correct answer
  const generateOptions = (correctAnswer: number, count: number): number[] => {
    const options = [correctAnswer];
    
    // Generate unique distractors
    while (options.length < count) {
      const distractor = correctAnswer + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 5) + 1);
      if (!options.includes(distractor) && distractor >= 0) {
        options.push(distractor);
      }
    }
    
    // Shuffle options
    return options.sort(() => Math.random() - 0.5);
  };
  
  // Handle answer selection
  const handleAnswerSelect = (optionIndex: number) => {
    if (selectedAnswer !== null) return; // Already answered
    
    const currentPatternQuestion = questions[currentQuestion];
    const correct = optionIndex === currentPatternQuestion.correctAnswer;
    
    setSelectedAnswer(optionIndex);
    setIsCorrect(correct);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      correct: prev.correct + (correct ? 1 : 0),
      incorrect: prev.incorrect + (correct ? 0 : 1),
      patternsCompleted: prev.patternsCompleted + 1
    }));
    
    // Move to next question after a delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        endGame();
      }
    }, 1500);
  };
  
  // Skip the current question
  const handleSkip = () => {
    if (selectedAnswer !== null) return; // Already answered
    
    // Update stats
    setStats(prev => ({
      ...prev,
      skipped: prev.skipped + 1,
      patternsCompleted: prev.patternsCompleted + 1
    }));
    
    // Move to next question
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
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
    const total = stats.correct + stats.incorrect + stats.skipped;
    if (total === 0) return 0;
    
    return Math.round((stats.correct / total) * 100);
  };
  
  // Get performance feedback based on score
  const getPerformanceFeedback = () => {
    const score = calculateScore();
    
    if (score >= 90) {
      return {
        title: "Exceptional Pattern Recognition!",
        description: "Your ability to recognize and complete patterns is outstanding."
      };
    } else if (score >= 75) {
      return {
        title: "Excellent Pattern Recognition!",
        description: "You have strong pattern recognition abilities."
      };
    } else if (score >= 60) {
      return {
        title: "Good Pattern Recognition",
        description: "You have solid pattern recognition skills."
      };
    } else if (score >= 40) {
      return {
        title: "Fair Pattern Recognition",
        description: "With practice, you can improve your pattern recognition abilities."
      };
    } else {
      return {
        title: "Developing Pattern Recognition",
        description: "Regular practice can significantly enhance your pattern recognition skills."
      };
    }
  };
  
  // Get brain health insights based on performance
  const getBrainHealthInsights = () => {
    const score = calculateScore();
    
    if (score >= 75) {
      return "Strong pattern recognition is associated with higher fluid intelligence and problem-solving ability. This cognitive skill may help with learning new concepts and adapting to novel situations.";
    } else if (score >= 50) {
      return "Pattern recognition involves your brain's ability to identify relationships and predict outcomes. Regular practice can enhance this cognitive function, which is valuable for learning and problem-solving.";
    } else {
      return "Pattern recognition engages multiple brain regions and is a foundational cognitive skill. Daily mental exercises that involve finding relationships between objects or numbers can improve this ability.";
    }
  };
  
  // Render a sequence-type pattern
  const renderSequencePattern = (pattern: number[][]) => {
    const sequence = pattern[0];
    
    return (
      <div className="flex items-center justify-center gap-2 py-4">
        {sequence.map((number, index) => (
          <div 
            key={index}
            className="w-12 h-12 flex items-center justify-center text-lg font-bold rounded-md bg-secondary"
          >
            {number}
          </div>
        ))}
        <div className="w-12 h-12 flex items-center justify-center text-lg font-bold rounded-md border-2 border-dashed border-primary bg-background">
          ?
        </div>
      </div>
    );
  };
  
  // Render a matrix-type pattern
  const renderMatrixPattern = (pattern: number[][]) => {
    return (
      <div className="grid gap-2 py-4 mx-auto" style={{ 
        gridTemplateColumns: `repeat(${pattern.length}, minmax(0, 1fr))`
      }}>
        {pattern.flat().map((cell, index) => (
          <div 
            key={index}
            className={cn(
              "w-10 h-10 flex items-center justify-center text-lg font-bold rounded-md",
              cell === -1 
                ? "border-2 border-dashed border-primary bg-background" 
                : "bg-secondary"
            )}
          >
            {cell === -1 ? "?" : cell}
          </div>
        ))}
      </div>
    );
  };
  
  // Render the appropriate game content based on state
  const renderGameContent = () => {
    switch (gameState) {
      case "idle":
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-medium">Choose Difficulty and Pattern Type</h3>
              <p className="text-muted-foreground">Select your preferred difficulty level and pattern types.</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Difficulty</h4>
                <div className="flex flex-col gap-2">
                  <Button 
                    variant={difficulty === "easy" ? "default" : "outline"} 
                    onClick={() => setDifficulty("easy")}
                    className="justify-between"
                  >
                    <span>Easy</span>
                    <Badge variant="secondary">{difficultyConfig.easy.questionCount} patterns</Badge>
                  </Button>
                  
                  <Button 
                    variant={difficulty === "medium" ? "default" : "outline"} 
                    onClick={() => setDifficulty("medium")}
                    className="justify-between"
                  >
                    <span>Medium</span>
                    <Badge variant="secondary">{difficultyConfig.medium.questionCount} patterns</Badge>
                  </Button>
                  
                  <Button 
                    variant={difficulty === "hard" ? "default" : "outline"} 
                    onClick={() => setDifficulty("hard")}
                    className="justify-between"
                  >
                    <span>Hard</span>
                    <Badge variant="secondary">{difficultyConfig.hard.questionCount} patterns</Badge>
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Pattern Types</h4>
                <div className="flex gap-2">
                  <Button 
                    variant={patternType === "sequence" ? "default" : "outline"} 
                    onClick={() => setPatternType("sequence")}
                    className="flex-1"
                  >
                    Sequences
                  </Button>
                  
                  <Button 
                    variant={patternType === "matrix" ? "default" : "outline"} 
                    onClick={() => setPatternType("matrix")}
                    className="flex-1"
                  >
                    Matrices
                  </Button>
                  
                  <Button 
                    variant={patternType === "mixed" ? "default" : "outline"} 
                    onClick={() => setPatternType("mixed")}
                    className="flex-1"
                  >
                    Mixed
                  </Button>
                </div>
              </div>
            </div>
            
            <Button onClick={startGame} className="w-full" size="lg">
              Start Test
            </Button>
            
            <div className="text-sm text-muted-foreground">
              <h4 className="font-medium mb-2">How It Works:</h4>
              <ol className="list-decimal list-inside space-y-1">
                <li>You&apos;ll be presented with number patterns to complete</li>
                <li>Select the option that best fits the pattern</li>
                <li>Answer as many correctly as you can within the time limit</li>
                <li>Skip if you&apos;re not sure</li>
              </ol>
            </div>
          </div>
        );
        
      case "playing":
        if (questions.length === 0) return null;
        
        const currentPatternQuestion = questions[currentQuestion];
        
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-medium">Complete the Pattern</h3>
                <p className="text-muted-foreground">{currentPatternQuestion.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline">
                  {currentQuestion + 1} of {questions.length}
                </Badge>
                <div className="flex items-center gap-1 text-lg font-mono">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className={cn(
                    timeLeft <= 10 ? "text-red-500 animate-pulse font-bold" : ""
                  )}>{timeLeft}s</span>
                </div>
              </div>
            </div>
            
            <Progress value={(timeLeft / difficultyConfig[difficulty].timeLimit) * 100} />
            
            <div className="flex flex-col items-center">
              {currentPatternQuestion.type === "sequence" 
                ? renderSequencePattern(currentPatternQuestion.pattern)
                : renderMatrixPattern(currentPatternQuestion.pattern)
              }
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {currentPatternQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === null ? "outline" : 
                    selectedAnswer === index ? 
                      (isCorrect ? "default" : "destructive") : 
                      index === currentPatternQuestion.correctAnswer && selectedAnswer !== null ? 
                        "default" : "outline"
                  }
                  className={cn(
                    "h-16 text-xl font-mono",
                    selectedAnswer === index && isCorrect && "bg-green-500 hover:bg-green-500",
                    selectedAnswer === index && !isCorrect && "bg-red-500 hover:bg-red-500"
                  )}
                  disabled={selectedAnswer !== null}
                  onClick={() => handleAnswerSelect(index)}
                >
                  {option}
                  {selectedAnswer === index && isCorrect && (
                    <CheckCircle2 className="ml-2 h-5 w-5" />
                  )}
                  {selectedAnswer === index && !isCorrect && (
                    <XCircle className="ml-2 h-5 w-5" />
                  )}
                  {index === currentPatternQuestion.correctAnswer && selectedAnswer !== null && selectedAnswer !== index && (
                    <CheckCircle2 className="ml-2 h-5 w-5 text-green-500" />
                  )}
                </Button>
              ))}
            </div>
            
            {selectedAnswer === null && (
              <Button onClick={handleSkip} variant="outline" className="w-full">
                Skip Question
              </Button>
            )}
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div>Correct: {stats.correct}</div>
              <div>Incorrect: {stats.incorrect}</div>
              <div>Skipped: {stats.skipped}</div>
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
                <div className="text-sm text-muted-foreground">Score</div>
              </div>
              
              <Separator orientation="vertical" className="h-12" />
              
              <div className="text-center">
                <div className="text-4xl font-bold">{stats.correct}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              
              <Separator orientation="vertical" className="h-12" />
              
              <div className="text-center">
                <div className="text-4xl font-bold">{stats.patternsCompleted}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
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
                Change Settings
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
          <Brain className="h-6 w-6 text-primary" />
          Pattern Recognition Test
        </CardTitle>
        <CardDescription>
          Recognize and complete visual patterns to enhance your logical reasoning and cognitive flexibility.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderGameContent()}
      </CardContent>
    </Card>
  );
} 