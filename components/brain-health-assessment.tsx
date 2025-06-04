"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Brain, CheckCircle, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ExportButton } from "@/components/export-button";

interface Question {
  id: number;
  text: string;
  domain: "memory" | "attention" | "processing" | "executive" | "verbal";
  options: {
    text: string;
    score: number;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "How often do you find yourself forgetting where you placed everyday items (keys, phone, etc.)?",
    domain: "memory",
    options: [
      { text: "Rarely or never", score: 3 },
      { text: "Occasionally", score: 2 },
      { text: "Frequently", score: 1 },
      { text: "Almost daily", score: 0 }
    ]
  },
  {
    id: 2,
    text: "How difficult is it for you to focus on a task when there are distractions around you?",
    domain: "attention",
    options: [
      { text: "Not difficult at all", score: 3 },
      { text: "Slightly difficult", score: 2 },
      { text: "Moderately difficult", score: 1 },
      { text: "Very difficult", score: 0 }
    ]
  },
  {
    id: 3,
    text: "How quickly can you typically solve simple problems compared to others your age?",
    domain: "processing",
    options: [
      { text: "Faster than most", score: 3 },
      { text: "About average", score: 2 },
      { text: "Somewhat slower", score: 1 },
      { text: "Much slower", score: 0 }
    ]
  },
  {
    id: 4,
    text: "How often do you have trouble planning and organizing tasks or activities?",
    domain: "executive",
    options: [
      { text: "Rarely or never", score: 3 },
      { text: "Occasionally", score: 2 },
      { text: "Frequently", score: 1 },
      { text: "Almost daily", score: 0 }
    ]
  },
  {
    id: 5,
    text: "How easily can you find the words you want to use during conversations?",
    domain: "verbal",
    options: [
      { text: "Very easily", score: 3 },
      { text: "Somewhat easily", score: 2 },
      { text: "With some difficulty", score: 1 },
      { text: "With great difficulty", score: 0 }
    ]
  },
  {
    id: 6,
    text: "After reading a few pages of a book, how well can you recall what you just read?",
    domain: "memory",
    options: [
      { text: "Very well", score: 3 },
      { text: "Moderately well", score: 2 },
      { text: "Not very well", score: 1 },
      { text: "Poorly", score: 0 }
    ]
  },
  {
    id: 7,
    text: "How often do you lose track of a conversation when multiple people are speaking?",
    domain: "attention",
    options: [
      { text: "Rarely or never", score: 3 },
      { text: "Occasionally", score: 2 },
      { text: "Frequently", score: 1 },
      { text: "Almost daily", score: 0 }
    ]
  },
  {
    id: 8,
    text: "How difficult is it for you to switch between different tasks or activities?",
    domain: "executive",
    options: [
      { text: "Not difficult at all", score: 3 },
      { text: "Slightly difficult", score: 2 },
      { text: "Moderately difficult", score: 1 },
      { text: "Very difficult", score: 0 }
    ]
  }
];

export function BrainHealthAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const progress = ((currentQuestion) / questions.length) * 100;
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleNextQuestion = () => {
    if (selectedOption !== null) {
      setAnswers({...answers, [currentQuestion]: selectedOption});
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
        // Add brief loading state when moving to next question
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 500);
      } else {
        setShowResults(true);
        // Add loading state when calculating results
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1000);
      }
    }
  };
  
  const calculateDomainScores = () => {
    const domainScores: Record<string, {total: number, count: number}> = {
      memory: {total: 0, count: 0},
      attention: {total: 0, count: 0},
      processing: {total: 0, count: 0},
      executive: {total: 0, count: 0},
      verbal: {total: 0, count: 0}
    };
    
    questions.forEach((question, index) => {
      if (answers[index] !== undefined) {
        const score = question.options[answers[index]].score;
        domainScores[question.domain].total += score;
        domainScores[question.domain].count += 1;
      }
    });
    
    const results: Record<string, number> = {};
    Object.keys(domainScores).forEach(domain => {
      if (domainScores[domain].count > 0) {
        results[domain] = Math.round((domainScores[domain].total / domainScores[domain].count) * 100 / 3);
      } else {
        results[domain] = 0;
      }
    });
    
    return results;
  };
  
  const domainLabels: Record<string, string> = {
    memory: "Memory",
    attention: "Attention",
    processing: "Processing Speed",
    executive: "Executive Function",
    verbal: "Verbal Fluency"
  };
  
  const getStrengthsAndWeaknesses = (scores: Record<string, number>) => {
    const domains = Object.keys(scores);
    domains.sort((a, b) => scores[b] - scores[a]);
    
    return {
      strengths: domains.slice(0, 2),
      weaknesses: domains.slice(-2)
    };
  };
  
  const getRecommendations = (strengths: string[], weaknesses: string[]) => {
    const recommendations: Record<string, string[]> = {
      memory: [
        "Practice the Memory Game daily",
        "Try memory techniques like visualization",
        "Create associations between information"
      ],
      attention: [
        "Use the Visual Attention Test to improve focus",
        "Practice mindfulness meditation daily",
        "Break tasks into smaller, manageable chunks"
      ],
      processing: [
        "Use the Reaction Time Test regularly",
        "Challenge yourself with the Mental Math game",
        "Practice quick decision-making exercises"
      ],
      executive: [
        "Create structured daily plans",
        "Practice task-switching exercises",
        "Use organizational tools and reminders"
      ],
      verbal: [
        "Read diverse material regularly",
        "Practice word association games",
        "Engage in conversations on varied topics"
      ]
    };
    
    let result: string[] = [];
    
    weaknesses.forEach(weakness => {
      if (recommendations[weakness]) {
        result = [...result, ...recommendations[weakness]];
      }
    });
    
    return result.slice(0, 5); // Return top 5 recommendations
  };
  
  const renderQuestion = () => {
    const question = questions[currentQuestion];
    
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-6 w-3/4 mb-6" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <div className="text-lg font-medium">{question.text}</div>
        
        <RadioGroup value={selectedOption?.toString() || ""} onValueChange={(value) => setSelectedOption(parseInt(value))}>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option.text}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleNextQuestion} 
            disabled={selectedOption === null}
            className="mt-4"
          >
            {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };
  
  const renderResults = () => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
            <Skeleton className="h-7 w-48 mx-auto mb-2" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </div>
          
          <div className="space-y-4">
            <Skeleton className="h-5 w-40 mb-2" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          
          <Skeleton className="h-64 w-full" />
        </div>
      );
    }
    
    const scores = calculateDomainScores();
    const { strengths, weaknesses } = getStrengthsAndWeaknesses(scores);
    const recommendations = getRecommendations(strengths, weaknesses);
    
    // Create export data
    const exportData = [
      ...Object.keys(scores).map(domain => ({
        domain: domainLabels[domain],
        score: scores[domain],
        category: strengths.includes(domain) ? "Strength" : weaknesses.includes(domain) ? "Needs Improvement" : "Average"
      }))
    ];
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full text-primary mb-4">
            <Brain className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Your Brain Health Profile</h3>
          <p className="text-muted-foreground">
            Based on your responses, we&apos;ve created a personalized cognitive profile that highlights your strengths and areas for improvement.
          </p>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-lg">Cognitive Domain Scores</h4>
          
          {Object.keys(scores).map((domain) => (
            <div key={domain} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{domainLabels[domain]}</span>
                <span className="font-medium">{scores[domain]}%</span>
              </div>
              <Progress value={scores[domain]} className="h-2" />
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Your Cognitive Strengths</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {strengths.map((strength) => (
                  <li key={strength} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>{domainLabels[strength]}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Improvement Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {weaknesses.map((weakness) => (
                  <li key={weakness} className="flex items-start gap-2 text-muted-foreground">
                    <span className="h-4 w-4 rounded-full border border-muted-foreground flex items-center justify-center text-[10px] mt-0.5 shrink-0">!</span>
                    <span>{domainLabels[weakness]}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Personalized Recommendations</CardTitle>
            <CardDescription>
              Based on your assessment, we recommend these activities to help strengthen your cognitive abilities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="flex justify-between">
            <ExportButton 
              data={exportData}
              filename="brain-health-assessment"
              label="Export Results"
            />
            <Button asChild>
              <Link href={{
                pathname: "/tools",
                query: { recommendations: recommendations.map(r => encodeURIComponent(r)).join(",") }
              }}>
                Start Recommended Activities
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      {!showResults && (
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>{showResults ? "Assessment Results" : "Cognitive Health Assessment"}</CardTitle>
          {!showResults && (
            <CardDescription>
              This quick assessment will help us understand your current cognitive function across key areas.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {showResults ? renderResults() : renderQuestion()}
        </CardContent>
      </Card>
    </div>
  );
} 