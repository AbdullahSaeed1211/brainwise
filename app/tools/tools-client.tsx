"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Brain, 
  Clock, 
  Target,
  ChevronLeft,
  BarChart, 
  Activity,
  LineChart,
  BookOpen,
  School,
  BookMarked,
  TestTube,
  Stethoscope,
  Microscope,
  Calculator
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { ResponsiveTabs, ResponsiveTabsList, ResponsiveTabsTrigger, ResponsiveTabsContent } from "@/components/ui/responsive-tabs";
import { ToolCardsGridSkeleton } from "@/components/ui/tool-skeleton";
import { MemoryGame } from "@/components/memory-game";
import ReactionTest from "@/components/reaction-test";

type Tool = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  component: React.ReactNode;
  category: "training" | "assessment" | "tracking" | "education";
  duration: string;
  benefits: string[];
  comingSoon?: boolean;
};

// Custom styled ToolCard component
const ToolCard = ({ 
  tool, 
  onClick 
}: { 
  tool: Tool; 
  onClick: (id: string) => void 
}) => {
  return (
    <Card 
      className="flex flex-col h-full bg-background hover:shadow-md transition-all border-border/50 hover:border-primary/20 cursor-pointer overflow-hidden"
      onClick={() => onClick(tool.id)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="bg-primary/10 p-3 rounded-xl">
            {tool.icon}
          </div>
          <div className="text-xs px-2 py-1 rounded-full bg-primary/5 text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {tool.duration}
          </div>
        </div>
        <CardTitle className="text-xl mt-4">{tool.title}</CardTitle>
        <CardDescription className="text-sm">{tool.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2 pt-0 flex-grow">
        <div className="space-y-2">
          {tool.benefits.map((benefit, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="bg-primary/10 text-primary rounded-full p-1 mt-0.5 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs text-muted-foreground">{benefit}</span>
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button 
          className="w-full" 
          variant={tool.comingSoon ? "outline" : "default"}
          disabled={tool.comingSoon}
        >
          {tool.comingSoon ? "Coming Soon" : "Start"}
        </Button>
      </CardFooter>
    </Card>
  );
};

const ComingSoonComponent = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-muted/20">
    <div className="mb-4 mt-2 rounded-full bg-primary/10 p-2">
      <Clock className="h-8 w-8 text-primary/70" />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title} - Coming Soon</h3>
    <div className="mb-4">
      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-200">
        Under Development
      </Badge>
    </div>
    <p className="text-center text-muted-foreground mb-6 max-w-md">
      We&apos;re working hard to bring you this feature. It will be available in the next update.
    </p>
    <p className="text-sm text-center text-muted-foreground">
      Expected release: <span className="font-medium">Within 30 days</span>
    </p>
  </div>
);

export default function ToolsClient() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("training");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state when changing categories
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [activeCategory]);

  const toolsData: Tool[] = [
    {
      id: "memory-game",
      title: "Memory Game",
      description: "Test and improve your short-term memory",
      icon: <Brain className="h-8 w-8 text-primary" />,
      component: <MemoryGame />,
      category: "training",
      duration: "3-5 minutes",
      benefits: ["Improves short-term memory", "Enhances pattern recognition", "Builds visual recall abilities"]
    },
    {
      id: "reaction-test",
      title: "Reaction Time Test",
      description: "Measure your response time",
      icon: <Clock className="h-8 w-8 text-primary" />,
      component: <ReactionTest />,
      category: "training",
      duration: "2 minutes",
      benefits: ["Measures neural processing speed", "Helps track cognitive alertness", "Trains hand-eye coordination"]
    },
    {
      id: "visual-attention",
      title: "Visual Attention",
      description: "Improve focus and attention",
      icon: <Target className="h-8 w-8 text-primary" />,
      component: <div className="p-8 border rounded-lg">Coming soon</div>,
      category: "training",
      duration: "3 minutes",
      benefits: ["Builds selective attention", "Improves visual processing", "Enhances focus abilities"]
    },
    {
      id: "mental-math",
      title: "Mental Math",
      description: "Enhance cognitive processing",
      icon: <Calculator className="h-8 w-8 text-primary" />,
      component: <ComingSoonComponent title="Mental Math" />,
      category: "training",
      duration: "3-5 minutes",
      benefits: ["Improves processing speed", "Enhances working memory", "Strengthens numerical cognition"],
      comingSoon: true
    },
    // Assessment tools
    {
      id: "cognitive-assessment",
      title: "Cognitive Assessment",
      description: "Comprehensive assessment of your cognitive functions across multiple domains",
      icon: <TestTube className="h-8 w-8 text-primary" />,
      component: <ComingSoonComponent title="Cognitive Assessment" />,
      category: "assessment",
      duration: "10-15 minutes",
      benefits: ["Provides cognitive baseline", "Identifies cognitive strengths", "Tracks changes over time"],
      comingSoon: true
    },
    {
      id: "stroke-risk-calculator",
      title: "Stroke Risk Calculator",
      description: "Personalized assessment of your stroke risk based on health factors",
      icon: <Stethoscope className="h-8 w-8 text-primary" />,
      component: <div className="p-8 border rounded-lg">Coming soon</div>,
      category: "assessment",
      duration: "5 minutes",
      benefits: ["Identifies risk factors", "Provides personalized recommendations", "Facilitates prevention strategies"],
      comingSoon: true
    },
    {
      id: "brain-age-test",
      title: "Brain Age Test",
      description: "Estimate your cognitive age compared to population norms",
      icon: <Microscope className="h-8 w-8 text-primary" />,
      component: <ComingSoonComponent title="Brain Age Test" />,
      category: "assessment",
      duration: "8 minutes",
      benefits: ["Compares performance to age norms", "Tracks cognitive aging", "Motivates cognitive maintenance"],
      comingSoon: true
    },
    // Tracking tools
    {
      id: "cognitive-tracker",
      title: "Cognitive Performance Tracker",
      description: "Monitor your cognitive performance across various domains over time",
      icon: <LineChart className="h-8 w-8 text-primary" />,
      component: <ComingSoonComponent title="Cognitive Performance Tracker" />,
      category: "tracking",
      duration: "Ongoing",
      benefits: ["Visualizes progress over time", "Identifies cognitive trends", "Provides actionable insights"],
      comingSoon: true
    },
    {
      id: "sleep-tracker",
      title: "Sleep Quality Monitor",
      description: "Track how your sleep patterns affect cognitive performance",
      icon: <Activity className="h-8 w-8 text-primary" />,
      component: <ComingSoonComponent title="Sleep Quality Monitor" />,
      category: "tracking",
      duration: "Daily tracking",
      benefits: ["Correlates sleep with cognition", "Identifies optimal sleep patterns", "Improves sleep hygiene"],
      comingSoon: true
    },
    {
      id: "health-metrics",
      title: "Health Metrics Dashboard",
      description: "Track health indicators that affect brain function and cognitive performance",
      icon: <BarChart className="h-8 w-8 text-primary" />,
      component: <ComingSoonComponent title="Health Metrics Dashboard" />,
      category: "tracking",
      duration: "Ongoing",
      benefits: ["Holistic health monitoring", "Identifies health-cognition relationships", "Facilitates lifestyle optimization"],
      comingSoon: true
    },
    // Education tools
    {
      id: "brain-health-library",
      title: "Brain Health Library",
      description: "Educational resources about brain health, cognition, and neurological conditions",
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      component: <ComingSoonComponent title="Brain Health Library" />,
      category: "education",
      duration: "Self-paced",
      benefits: ["Evidence-based information", "Easy-to-understand explanations", "Actionable health strategies"],
      comingSoon: true
    },
    {
      id: "learning-exercises",
      title: "Brain-Boosting Learning Exercises",
      description: "Educational exercises designed to stimulate cognitive growth",
      icon: <School className="h-8 w-8 text-primary" />,
      component: <ComingSoonComponent title="Brain-Boosting Learning Exercises" />,
      category: "education",
      duration: "10-20 minutes",
      benefits: ["Enhances cognitive reserve", "Promotes neuroplasticity", "Builds cognitive resilience"],
      comingSoon: true
    },
    {
      id: "research-papers",
      title: "Brain Research Digest",
      description: "Summaries of the latest research on brain health and cognitive science",
      icon: <BookMarked className="h-8 w-8 text-primary" />,
      component: <ComingSoonComponent title="Brain Research Digest" />,
      category: "education",
      duration: "5-10 minutes",
      benefits: ["Keeps you updated on latest findings", "Translates complex science", "Evidence-based recommendations"],
      comingSoon: true
    },
  ];

  const filteredTools = toolsData.filter(tool => tool.category === activeCategory);
  
  const handleToolSelect = (toolId: string) => {
    setActiveTool(toolId);
  };
  
  const handleBackClick = () => {
    setActiveTool(null);
  };
  
  // Get the selected tool's component
  const getActiveToolComponent = () => {
    const tool = toolsData.find(t => t.id === activeTool);
    return tool?.component || null;
  };

  return (
    <div className="container px-4 py-6 md:py-10">
      {activeTool ? (
        // Active Tool View
        <div>
          <button 
            onClick={handleBackClick}
            className="flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to all tools
          </button>
          
          {getActiveToolComponent()}
        </div>
      ) : (
        // Tools Grid View
        <div>
          <h1 className="text-2xl font-bold mb-2">Brain Training Tools</h1>
          <p className="text-muted-foreground mb-6">Enhance your cognitive abilities with specialized exercises</p>
          
          <ResponsiveTabs defaultValue="training" value={activeCategory} onValueChange={setActiveCategory}>
            <ResponsiveTabsList className="mb-8">
              <ResponsiveTabsTrigger value="training">Training</ResponsiveTabsTrigger>
              <ResponsiveTabsTrigger value="assessment">Assessment</ResponsiveTabsTrigger>
              <ResponsiveTabsTrigger value="tracking">Tracking</ResponsiveTabsTrigger>
              <ResponsiveTabsTrigger value="education">Education</ResponsiveTabsTrigger>
            </ResponsiveTabsList>
            
            <ResponsiveTabsContent value="training" className="mt-0">
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Cognitive Training</h2>
                <p className="text-muted-foreground">Interactive exercises designed to challenge and improve specific cognitive abilities</p>
              </div>
              
              {isLoading ? (
                <ToolCardsGridSkeleton count={4} />
              ) : (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredTools.map((tool) => (
                    <ToolCard 
                      key={tool.id} 
                      tool={tool} 
                      onClick={handleToolSelect}
                    />
                  ))}
                </div>
              )}
            </ResponsiveTabsContent>
            
            <ResponsiveTabsContent value="assessment" className="mt-0">
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Cognitive Assessment</h2>
                <p className="text-muted-foreground">Evaluate your cognitive abilities and track your brain health over time</p>
              </div>
              
              {isLoading ? (
                <ToolCardsGridSkeleton count={3} />
              ) : (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredTools.map((tool) => (
                    <ToolCard 
                      key={tool.id} 
                      tool={tool} 
                      onClick={handleToolSelect}
                    />
                  ))}
                </div>
              )}
            </ResponsiveTabsContent>
            
            <ResponsiveTabsContent value="tracking" className="mt-0">
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Progress Tracking</h2>
                <p className="text-muted-foreground">Monitor your cognitive health and progress over time</p>
              </div>
              
              {isLoading ? (
                <ToolCardsGridSkeleton count={3} />
              ) : (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredTools.map((tool) => (
                    <ToolCard 
                      key={tool.id} 
                      tool={tool} 
                      onClick={handleToolSelect}
                    />
                  ))}
                </div>
              )}
            </ResponsiveTabsContent>
            
            <ResponsiveTabsContent value="education" className="mt-0">
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Educational Resources</h2>
                <p className="text-muted-foreground">Learn about brain health and cognitive enhancement</p>
              </div>
              
              {isLoading ? (
                <ToolCardsGridSkeleton count={3} />
              ) : (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredTools.map((tool) => (
                    <ToolCard 
                      key={tool.id} 
                      tool={tool} 
                      onClick={handleToolSelect}
                    />
                  ))}
                </div>
              )}
            </ResponsiveTabsContent>
          </ResponsiveTabs>
        </div>
      )}
    </div>
  );
} 