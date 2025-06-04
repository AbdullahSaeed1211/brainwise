"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle2, AlertTriangle, Brain } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SocialShare } from "@/components/social-share";

type Difficulty = "easy" | "medium" | "hard";
type Operation = "add" | "subtract" | "multiply" | "divide" | "mixed";
type GameState = "idle" | "playing" | "completed";

interface Problem {
  expression: string;
  answer: number;
  options: number[];
}

interface GameStats {
  correct: number;
  incorrect: number;
  skipped: number;
  timeElapsed: number;
  startTime: number;
}

export function MentalMathChallenge() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [operation, setOperation] = useState<Operation>("mixed");
  const [gameState, setGameState] = useState<GameState>("idle");
  const [problem, setProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [stats, setStats] = useState<GameStats>({
    correct: 0,
    incorrect: 0,
    skipped: 0,
    timeElapsed: 0,
    startTime: 0
  });
  const [timeRemaining, setTimeRemaining] = useState<number>(120); // 2 minutes
  const problemCount = 10;
  const [currentProblem, setCurrentProblem] = useState<number>(0);

  // Generate a math problem based on difficulty and operation
  const generateProblem = (): Problem => {
    let num1: number, num2: number, answer: number, expression: string;
    const operations = operation === "mixed" 
      ? ["add", "subtract", "multiply", "divide"] as Operation[]
      : [operation];
    
    const selectedOperation = operations[Math.floor(Math.random() * operations.length)];
    
    switch (difficulty) {
      case "easy":
        num1 = Math.floor(Math.random() * 10) + 1; // 1-10
        num2 = Math.floor(Math.random() * 10) + 1; // 1-10
        break;
      case "medium":
        num1 = Math.floor(Math.random() * 20) + 5; // 5-24
        num2 = Math.floor(Math.random() * 15) + 1; // 1-15
        break;
      case "hard":
        num1 = Math.floor(Math.random() * 50) + 10; // 10-59
        num2 = Math.floor(Math.random() * 25) + 5; // 5-29
        break;
      default:
        num1 = 5;
        num2 = 5;
    }
    
    // Ensure division problems have clean answers
    if (selectedOperation === "divide") {
      // For division, ensure num1 is divisible by num2
      num2 = Math.max(2, num2); // Ensure divisor is at least 2
      num1 = num2 * (Math.floor(Math.random() * 10) + 1); // Make num1 a multiple of num2
    }
    
    // Ensure subtraction problems don't have negative answers
    if (selectedOperation === "subtract" && num2 > num1) {
      [num1, num2] = [num2, num1]; // Swap to avoid negative answers
    }
    
    switch (selectedOperation) {
      case "add":
        answer = num1 + num2;
        expression = `${num1} + ${num2}`;
        break;
      case "subtract":
        answer = num1 - num2;
        expression = `${num1} - ${num2}`;
        break;
      case "multiply":
        answer = num1 * num2;
        expression = `${num1} × ${num2}`;
        break;
      case "divide":
        answer = num1 / num2;
        expression = `${num1} ÷ ${num2}`;
        break;
      default:
        answer = num1 + num2;
        expression = `${num1} + ${num2}`;
    }
    
    // Generate options (including the correct answer)
    const options = [answer];
    
    // Add wrong options
    while (options.length < 4) {
      const offset = Math.floor(Math.random() * 10) + 1;
      const sign = Math.random() > 0.5 ? 1 : -1;
      const wrongOption = answer + (sign * offset);
      
      // Ensure no duplicates and no negative answers
      if (!options.includes(wrongOption) && wrongOption > 0) {
        options.push(wrongOption);
      }
    }
    
    // Shuffle options
    const shuffledOptions = shuffleArray(options);
    
    return {
      expression,
      answer,
      options: shuffledOptions
    };
  };
  
  // Fisher-Yates shuffle algorithm
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  // Initialize game
  const startGame = () => {
    setGameState("playing");
    setCurrentProblem(0);
    setStats({
      correct: 0,
      incorrect: 0,
      skipped: 0,
      timeElapsed: 0,
      startTime: Date.now()
    });
    
    // Set time based on difficulty
    const timeLimit = difficulty === "easy" ? 120 : difficulty === "medium" ? 100 : 80;
    setTimeRemaining(timeLimit);
    
    // Generate first problem
    setProblem(generateProblem());
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
  
  // Handle answer selection
  const handleAnswerSelect = (selectedAnswer: number) => {
    if (gameState !== "playing" || userAnswer !== null) return;
    
    setUserAnswer(selectedAnswer);
    
    // Check if answer is correct
    const isCorrect = selectedAnswer === problem?.answer;
    
    if (isCorrect) {
      setStats((prev) => ({
        ...prev,
        correct: prev.correct + 1
      }));
    } else {
      setStats((prev) => ({
        ...prev,
        incorrect: prev.incorrect + 1
      }));
    }
    
    // Show answer feedback briefly before moving to next problem
    setTimeout(() => {
      nextProblem();
    }, 1000);
  };
  
  // Skip current problem
  const handleSkip = () => {
    if (gameState !== "playing") return;
    
    setStats((prev) => ({
      ...prev,
      skipped: prev.skipped + 1
    }));
    
    nextProblem();
  };
  
  // Move to next problem
  const nextProblem = () => {
    setUserAnswer(null);
    
    if (currentProblem + 1 >= problemCount) {
      endGame();
      return;
    }
    
    setCurrentProblem((prev) => prev + 1);
    setProblem(generateProblem());
  };
  
  // End game and calculate final stats
  const endGame = () => {
    setGameState("completed");
    setStats((prev) => ({
      ...prev,
      timeElapsed: Math.floor((Date.now() - prev.startTime) / 1000)
    }));
  };
  
  // Calculate score
  const calculateScore = () => {
    const { correct, incorrect, skipped, timeElapsed } = stats;
    const problemsSolved = correct + incorrect + skipped;
    
    // Base points from correct answers
    const basePoints = correct * 10;
    
    // Bonus points based on difficulty
    const difficultyMultiplier = 
      difficulty === "easy" ? 1 :
      difficulty === "medium" ? 1.5 :
      2;
    
    // Time efficiency bonus (faster = better)
    const timeBonus = problemsSolved > 0 
      ? Math.max(0, 30 - Math.floor(timeElapsed / problemsSolved)) 
      : 0;
    
    // Penalty for incorrect answers
    const incorrectPenalty = incorrect * 5;
    
    // Penalty for skipped problems
    const skippedPenalty = skipped * 2;
    
    const finalScore = Math.max(0, Math.floor(
      (basePoints * difficultyMultiplier) + timeBonus - incorrectPenalty - skippedPenalty
    ));
    
    return finalScore;
  };
  
  // Get performance feedback
  const getPerformanceFeedback = () => {
    const { correct, incorrect } = stats;
    const totalAttempted = correct + incorrect;
    const accuracy = totalAttempted > 0 ? (correct / totalAttempted) * 100 : 0;
    
    if (accuracy >= 90) {
      return "Excellent! Your mental math skills are very strong.";
    } else if (accuracy >= 70) {
      return "Good job! You're demonstrating solid mental math abilities.";
    } else if (accuracy >= 50) {
      return "Nice effort! With regular practice, you can improve your calculation speed.";
    } else {
      return "Keep practicing! Mental math is a skill that gets stronger with regular exercise.";
    }
  };
  
  // Get brain health insights
  const getBrainHealthInsights = () => {
    const { correct, incorrect, timeElapsed } = stats;
    const totalAttempted = correct + incorrect;
    const averageTimePerProblem = totalAttempted > 0 ? timeElapsed / totalAttempted : 0;
    
    if (averageTimePerProblem > 10) {
      return "Regular practice can help improve your processing speed. Just 5 minutes of mental math exercises daily can enhance your numerical fluency.";
    } else if (incorrect > correct) {
      return "Focus on accuracy before speed. Studies show that mental calculation exercises can strengthen working memory and concentration.";
    } else {
      return "Mental math exercises activate multiple brain regions, strengthening neural connections. Regular practice may help maintain cognitive vitality as you age.";
    }
  };

  // Render game content based on state
  const renderGameContent = () => {
    switch (gameState) {
      case "idle":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mental Math Challenge</CardTitle>
                <CardDescription>
                  Test and improve your mental calculation skills.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p>
                    This exercise challenges your ability to perform calculations quickly and accurately 
                    in your head. Regular practice can improve working memory, concentration, and 
                    cognitive processing speed.
                  </p>
                  
                  <Tabs defaultValue="difficulty" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="difficulty">Difficulty</TabsTrigger>
                      <TabsTrigger value="operation">Operation</TabsTrigger>
                    </TabsList>
                    <TabsContent value="difficulty" className="space-y-4 pt-4">
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
                    </TabsContent>
                    <TabsContent value="operation" className="space-y-4 pt-4">
                      <h3 className="font-medium">Select Operation:</h3>
                      <div className="flex flex-wrap gap-3">
                        <Button
                          variant={operation === "mixed" ? "default" : "outline"}
                          onClick={() => setOperation("mixed")}
                        >
                          Mixed
                        </Button>
                        <Button
                          variant={operation === "add" ? "default" : "outline"}
                          onClick={() => setOperation("add")}
                        >
                          Addition
                        </Button>
                        <Button
                          variant={operation === "subtract" ? "default" : "outline"}
                          onClick={() => setOperation("subtract")}
                        >
                          Subtraction
                        </Button>
                        <Button
                          variant={operation === "multiply" ? "default" : "outline"}
                          onClick={() => setOperation("multiply")}
                        >
                          Multiplication
                        </Button>
                        <Button
                          variant={operation === "divide" ? "default" : "outline"}
                          onClick={() => setOperation("divide")}
                        >
                          Division
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={startGame}>Start Challenge</Button>
              </CardFooter>
            </Card>
          </div>
        );
      
      case "playing":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-muted-foreground">Problem {currentProblem + 1} of {problemCount}</div>
                <div className="flex gap-2 items-center">
                  <div className="text-sm font-medium">Score: </div>
                  <div className="text-sm font-bold">{stats.correct * 10}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="text-xl font-bold">{timeRemaining}s</div>
              </div>
            </div>
            
            <Progress value={((currentProblem) / problemCount) * 100} className="h-2" />
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-6">
                  <div className="text-3xl font-bold">{problem?.expression}</div>
                  
                  <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                    {problem?.options.map((option, index) => (
                      <Button
                        key={index}
                        variant={
                          userAnswer === null ? "outline" :
                          userAnswer === option ? 
                            (option === problem.answer ? "default" : "destructive") :
                            option === problem.answer && userAnswer !== null ? "default" : "outline"
                        }
                        className={`text-lg py-6 ${
                          userAnswer === null ? "hover:bg-muted" : ""
                        } ${option === problem.answer && userAnswer !== null ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-400 border-green-500" : ""}`}
                        onClick={() => handleAnswerSelect(option)}
                        disabled={userAnswer !== null}
                      >
                        {option}
                        {userAnswer !== null && option === problem.answer && (
                          <CheckCircle2 className="ml-2 h-4 w-4" />
                        )}
                        {userAnswer === option && option !== problem.answer && (
                          <AlertTriangle className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline" onClick={handleSkip}>
                  Skip
                </Button>
              </CardFooter>
            </Card>
          </div>
        );
      
      case "completed":
        const score = calculateScore();
        const shareText = `I scored ${score} points in the Mental Math Challenge (${difficulty} difficulty, ${operation} operations)!`;
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Challenge Results</CardTitle>
                <CardDescription>
                  {getPerformanceFeedback()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">{score}</div>
                    <div className="text-sm text-muted-foreground">Final Score</div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="p-3 border rounded-md">
                      <div className="text-xl font-medium">{stats.correct}</div>
                      <div className="text-xs text-muted-foreground">Correct</div>
                    </div>
                    <div className="p-3 border rounded-md">
                      <div className="text-xl font-medium">{stats.incorrect}</div>
                      <div className="text-xs text-muted-foreground">Incorrect</div>
                    </div>
                    <div className="p-3 border rounded-md">
                      <div className="text-xl font-medium">{stats.skipped}</div>
                      <div className="text-xs text-muted-foreground">Skipped</div>
                    </div>
                    <div className="p-3 border rounded-md">
                      <div className="text-xl font-medium">{stats.timeElapsed}s</div>
                      <div className="text-xs text-muted-foreground">Time</div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-md bg-muted/50 flex gap-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Brain className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Brain Health Insight:</p>
                      <p className="text-sm text-muted-foreground">{getBrainHealthInsights()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <Button variant="outline" onClick={() => setGameState("idle")}>
                  Change Settings
                </Button>
                <div className="flex gap-2">
                  <SocialShare 
                    title="Mental Math Challenge Results" 
                    text={shareText}
                    hashtags={["mentalmath", "braintraining", "cognitivefitness"]}
                  />
                  <Button onClick={startGame}>
                    Try Again
                  </Button>
                </div>
              </CardFooter>
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