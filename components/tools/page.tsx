"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Brain, 
  Activity, 
  LineChart, 
  Gauge, 
  Lightbulb, 
  Calendar, 
  Scale, 
  BookOpen,
  ListOrdered,
  MessageSquare,
  Grid
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const toolsData = [
  {
    id: "cognitive-assessment",
    title: "Cognitive Assessment",
    description: "Evaluate your cognitive function across memory, attention, and processing speed domains.",
    icon: <Brain className="h-8 w-8 text-primary" />,
    component: "BrainHealthAssessment",
    tags: ["Assessment", "5 min"]
  },
  {
    id: "memory-game",
    title: "Memory Game",
    description: "Train your short-term memory by matching pairs of cards.",
    icon: <Lightbulb className="h-8 w-8 text-primary" />,
    component: "MemoryGame",
    tags: ["Training", "2-5 min"]
  },
  {
    id: "visual-attention",
    title: "Visual Attention Test",
    description: "Improve focus by identifying specific symbols among distractors.",
    icon: <Activity className="h-8 w-8 text-primary" />,
    component: "VisualAttentionTest",
    tags: ["Training", "3 min"]
  },
  {
    id: "mental-math",
    title: "Mental Math Challenge",
    description: "Enhance cognitive processing with arithmetic exercises.",
    icon: <Gauge className="h-8 w-8 text-primary" />,
    component: "MentalMathChallenge",
    tags: ["Training", "2 min"]
  },
  {
    id: "word-memory-test",
    title: "Word Memory Test",
    description: "Test and improve your verbal memory by recalling words from a list.",
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    component: "WordMemoryTest",
    tags: ["Training", "3 min"]
  },
  {
    id: "sequence-memory-test",
    title: "Sequence Memory Test",
    description: "Remember and repeat increasingly complex sequences to improve working memory.",
    icon: <ListOrdered className="h-8 w-8 text-primary" />,
    component: "SequenceMemoryTest",
    tags: ["Training", "3-5 min"]
  },
  {
    id: "verbal-fluency-test",
    title: "Verbal Fluency Test",
    description: "List words in a category to assess language skills and executive function.",
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    component: "VerbalFluencyTest",
    tags: ["Training", "1 min"]
  },
  {
    id: "pattern-recognition-test",
    title: "Pattern Recognition Test",
    description: "Recognize and complete patterns to enhance logical reasoning abilities.",
    icon: <Grid className="h-8 w-8 text-primary" />,
    component: "PatternRecognitionTest",
    tags: ["Training", "5-10 min"]
  },
  {
    id: "mood-tracker",
    title: "Mood Tracker",
    description: "Track your emotional wellbeing and identify patterns that affect brain health.",
    icon: <Calendar className="h-8 w-8 text-primary" />,
    component: "MoodTracker",
    tags: ["Tracking", "1 min daily"]
  },
  {
    id: "stroke-risk",
    title: "Stroke Risk Assessment",
    description: "Evaluate personal risk factors for stroke based on health data.",
    icon: <Scale className="h-8 w-8 text-primary" />,
    component: "StrokePredictionForm",
    tags: ["Assessment", "3 min"]
  },
  {
    id: "brain-health-trends",
    title: "Brain Health Trends",
    description: "Visualize your brain health metrics and progress over time.",
    icon: <LineChart className="h-8 w-8 text-primary" />,
    component: "BrainHealthTrends",
    tags: ["Analytics", "Ongoing"]
  }
];

export default function ToolsPage() {
  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Brain Health Toolkit</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Access a comprehensive set of tools designed to assess, train, and monitor your brain health. Regular use can help improve cognitive function and resilience.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {toolsData.map((tool) => (
          <Card key={tool.id} className="overflow-hidden border-muted hover:border-primary/50 transition-colors">
            <CardHeader className="p-6 pb-3">
              <div className="mb-3 bg-primary/10 w-fit p-3 rounded-md">
                {tool.icon}
              </div>
              <CardTitle className="text-xl">{tool.title}</CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="flex gap-2 mb-4">
                {tool.tags.map((tag, i) => (
                  <span 
                    key={i}
                    className="px-2 py-1 bg-muted text-xs rounded-md font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button asChild className="w-full">
                <Link href={`/tools/${tool.id}`}>
                  Launch Tool
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-16 bg-muted/50 rounded-lg p-6 md:p-8 text-center">
        <h2 className="text-2xl font-bold mb-3">Brain Health Training Program</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          Get a personalized training program tailored to your specific cognitive needs. Our AI-powered system will recommend the optimal tools and schedule.
        </p>
        <Button size="lg">
          Create Your Training Plan
        </Button>
      </div>
    </div>
  );
} 