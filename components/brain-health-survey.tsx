"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Survey questions
const questions = [
  {
    id: 1,
    question: "How many hours do you sleep on average per night?",
    options: [
      { value: 1, text: "Less than 5 hours" },
      { value: 2, text: "5-6 hours" },
      { value: 3, text: "7-8 hours" },
      { value: 4, text: "More than 8 hours" }
    ],
    impact: "Sleep quality directly affects brain health and cognitive function. Less than 6 hours of sleep is associated with higher stroke risk."
  },
  {
    id: 2,
    question: "How often do you engage in physical exercise?",
    options: [
      { value: 1, text: "Rarely or never" },
      { value: 2, text: "1-2 times per week" },
      { value: 3, text: "3-4 times per week" },
      { value: 4, text: "5 or more times per week" }
    ],
    impact: "Regular physical activity improves blood flow to the brain and reduces stroke risk factors like hypertension."
  },
  {
    id: 3,
    question: "How would you rate your stress levels on average?",
    options: [
      { value: 1, text: "Very high" },
      { value: 2, text: "High" },
      { value: 3, text: "Moderate" },
      { value: 4, text: "Low" }
    ],
    impact: "Chronic stress can contribute to inflammation and high blood pressure, both risk factors for stroke and cognitive decline."
  },
  {
    id: 4,
    question: "How often do you engage in mentally stimulating activities?",
    options: [
      { value: 1, text: "Rarely or never" },
      { value: 2, text: "Once a week" },
      { value: 3, text: "Several times a week" },
      { value: 4, text: "Daily" }
    ],
    impact: "Mental stimulation helps build cognitive reserve and neuroplasticity, which can help protect against cognitive decline."
  },
  {
    id: 5,
    question: "How would you describe your diet?",
    options: [
      { value: 1, text: "High in processed foods and sugars" },
      { value: 2, text: "Mixed, with some healthy foods" },
      { value: 3, text: "Mostly healthy with occasional indulgences" },
      { value: 4, text: "Very healthy, rich in fruits, vegetables, and whole foods" }
    ],
    impact: "A diet rich in antioxidants, omega-3 fatty acids, and low in sodium supports brain health and reduces stroke risk."
  },
  {
    id: 6,
    question: "How often do you consume alcohol?",
    options: [
      { value: 4, text: "Never" },
      { value: 3, text: "Occasionally (1-2 drinks per month)" },
      { value: 2, text: "Moderately (1-2 drinks per week)" },
      { value: 1, text: "Frequently (Daily or several times per week)" }
    ],
    impact: "Excessive alcohol consumption can increase blood pressure and is linked to higher stroke risk."
  },
  {
    id: 7,
    question: "Do you smoke tobacco products?",
    options: [
      { value: 1, text: "Yes, regularly" },
      { value: 2, text: "Occasionally" },
      { value: 3, text: "No, but I have in the past" },
      { value: 4, text: "No, never" }
    ],
    impact: "Smoking significantly increases the risk of stroke by damaging blood vessels and promoting clot formation."
  },
  {
    id: 8,
    question: "How would you rate your social connections and interactions?",
    options: [
      { value: 1, text: "Very limited or isolated" },
      { value: 2, text: "Limited to a few interactions" },
      { value: 3, text: "Regular social interactions" },
      { value: 4, text: "Strong social network and frequent interactions" }
    ],
    impact: "Social engagement is linked to better cognitive health and may reduce stress and depression, which are risk factors for stroke."
  },
  {
    id: 9,
    question: "How often do you monitor your blood pressure?",
    options: [
      { value: 1, text: "Never" },
      { value: 2, text: "Rarely (once a year or less)" },
      { value: 3, text: "Sometimes (every few months)" },
      { value: 4, text: "Regularly (monthly or more)" }
    ],
    impact: "Hypertension is a leading risk factor for stroke. Regular monitoring helps with early detection and management."
  },
  {
    id: 10,
    question: "How would you rate your overall health awareness and preventive care?",
    options: [
      { value: 1, text: "I rarely think about health until there's a problem" },
      { value: 2, text: "I have some awareness but don't take many preventive actions" },
      { value: 3, text: "I try to stay informed and take some preventive measures" },
      { value: 4, text: "I am very proactive about my health and preventive care" }
    ],
    impact: "Preventive health care and awareness are essential for early detection and management of stroke risk factors."
  }
];

export function BrainHealthSurvey() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showImpact, setShowImpact] = useState(false);

  // Progress percentage
  const progress = (currentQuestion / questions.length) * 100;

  // Handle option selection
  const selectOption = (value: number) => {
    setSelectedOption(value);
  };

  // Go to next question
  const nextQuestion = () => {
    if (selectedOption !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedOption;
      setAnswers(newAnswers);
      
      setSelectedOption(null);
      setShowImpact(false);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowResults(true);
      }
    }
  };

  // Go to previous question
  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(answers[currentQuestion - 1] || null);
      setShowImpact(false);
    }
  };

  // Calculate the total score
  const calculateScore = () => {
    if (answers.length === 0) return 0;
    const sum = answers.reduce((acc, val) => acc + val, 0);
    return sum;
  };

  // Get assessment results
  const getAssessment = () => {
    const score = calculateScore();
    const maxScore = questions.length * 4;
    const percentage = (score / maxScore) * 100;

    if (percentage >= 80) {
      return {
        category: "Excellent",
        description: "Your brain health habits are excellent! Continue with your current lifestyle choices to maintain optimal brain health.",
        recommendations: [
          "Continue your healthy habits",
          "Consider becoming a health advocate in your community",
          "Stay updated on the latest brain health research"
        ]
      };
    } else if (percentage >= 60) {
      return {
        category: "Good",
        description: "You have good brain health habits. With a few improvements, you can further reduce your risk of stroke and cognitive decline.",
        recommendations: [
          "Focus on areas where you scored lower",
          "Consider adding more brain-healthy foods to your diet",
          "Aim for more consistent sleep patterns"
        ]
      };
    } else if (percentage >= 40) {
      return {
        category: "Moderate",
        description: "Your brain health habits have room for improvement. Making some lifestyle changes could significantly reduce your stroke risk.",
        recommendations: [
          "Increase physical activity to at least 150 minutes per week",
          "Reduce processed food consumption",
          "Consider stress reduction techniques like meditation",
          "Schedule a check-up to monitor blood pressure and other health markers"
        ]
      };
    } else {
      return {
        category: "Needs Improvement",
        description: "Your current lifestyle choices may be increasing your risk for stroke and cognitive issues. Consider making gradual changes to improve your brain health.",
        recommendations: [
          "Consult with a healthcare provider about stroke risk factors",
          "Start with small, sustainable changes to diet and exercise",
          "Consider quitting smoking and limiting alcohol consumption",
          "Focus on improving sleep quality",
          "Build more social connections"
        ]
      };
    }
  };

  // Render the current question
  const renderQuestion = () => {
    const question = questions[currentQuestion];
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          Question {currentQuestion + 1} of {questions.length}
        </h3>
        <p className="text-lg">{question.question}</p>
        
        <div className="space-y-2">
          {question.options.map((option) => (
            <div
              key={option.value}
              className={cn(
                "p-3 rounded-lg border cursor-pointer transition-colors",
                selectedOption === option.value
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => selectOption(option.value)}
            >
              {option.text}
            </div>
          ))}
        </div>

        {showImpact && (
          <Card className="bg-muted/50 border-muted">
            <CardContent className="pt-6">
              <h4 className="font-medium mb-1">Health Impact:</h4>
              <p className="text-sm text-muted-foreground">{question.impact}</p>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setShowImpact(!showImpact)}
          >
            {showImpact ? "Hide Impact" : "Learn Impact"}
          </Button>
          
          <Button
            onClick={nextQuestion}
            disabled={selectedOption === null}
          >
            {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>
      </div>
    );
  };

  // Render the results
  const renderResults = () => {
    const score = calculateScore();
    const maxScore = questions.length * 4;
    const percentage = (score / maxScore) * 100;
    const assessment = getAssessment();
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold">Your Brain Health Score</h3>
          <div className="my-4 flex justify-center">
            <div className="relative w-32 h-32 flex items-center justify-center bg-muted rounded-full">
              <div className="text-3xl font-bold">{Math.round(percentage)}%</div>
              <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * percentage) / 100}
                  className="text-primary"
                  transform="rotate(-90 50 50)"
                />
              </svg>
            </div>
          </div>
          <h4 className="text-xl font-semibold mb-2">{assessment.category}</h4>
          <p className="text-muted-foreground">{assessment.description}</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>
              Based on your responses, here are some suggestions to improve or maintain your brain health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {assessment.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-2 mt-0.5">
                    {index + 1}
                  </div>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <div className="space-x-2">
              <Button onClick={() => {
                setShowResults(false);
                setCurrentQuestion(0);
                setAnswers([]);
                setSelectedOption(null);
              }}>
                Retake Survey
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Stroke Risk Factors</CardTitle>
            <CardDescription>
              Understanding your modifiable risk factors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Many stroke risk factors can be managed with lifestyle changes and medical care. Monitor these key factors:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mr-2 mt-0.5">!</div>
                <span><strong>High Blood Pressure</strong> - The leading cause of stroke and a contributing factor to brain damage</span>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mr-2 mt-0.5">!</div>
                <span><strong>Smoking</strong> - Doubles the risk of stroke by damaging blood vessels</span>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mr-2 mt-0.5">!</div>
                <span><strong>Physical Inactivity</strong> - Regular exercise reduces stroke risk by up to 27%</span>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mr-2 mt-0.5">!</div>
                <span><strong>Poor Diet</strong> - High sodium, saturated fats, and processed foods increase risk</span>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mr-2 mt-0.5">!</div>
                <span><strong>Stress</strong> - Chronic stress contributes to hypertension and inflammation</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold">Brain Health Assessment</h2>
        <p className="text-muted-foreground">
          This assessment evaluates lifestyle factors that impact brain health and stroke risk.
        </p>
      </div>
      
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
        <CardContent className="pt-6">
          {showResults ? renderResults() : renderQuestion()}
        </CardContent>
      </Card>
    </div>
  );
} 