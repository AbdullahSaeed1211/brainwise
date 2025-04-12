"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("training");

  const toolsData: Tool[] = [
    {
      id: "memory-game",
      title: "Memory Game",
      description: "Test and improve your short-term memory",
      icon: <Brain className="h-8 w-8" />,
      component: <MemoryGame />,
      category: "training",
      duration: "3-5 minutes",
      benefits: ["Improves short-term memory", "Enhances pattern recognition", "Builds visual recall abilities"]
    },
    {
      id: "reaction-test",
      title: "Reaction Time Test",
      description: "Measure your response time",
      icon: <Clock className="h-8 w-8" />,
      component: <ReactionTest />,
      category: "training",
      duration: "2 minutes",
      benefits: ["Measures neural processing speed", "Helps track cognitive alertness", "Trains hand-eye coordination"]
    },
    {
      id: "visual-attention",
      title: "Visual Attention",
      description: "Improve focus and attention",
      icon: <Target className="h-8 w-8" />,
      component: <div className="p-8 border rounded-lg">Coming soon</div>,
      category: "training",
      duration: "3 minutes",
      benefits: ["Builds selective attention", "Improves visual processing", "Enhances focus abilities"]
    },
    {
      id: "mental-math",
      title: "Mental Math",
      description: "Enhance cognitive processing",
      icon: <Calculator className="h-8 w-8" />,
      component: <div className="p-8 border rounded-lg">Coming soon</div>,
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
      icon: <TestTube className="h-8 w-8" />,
      component: <div className="p-8 border rounded-lg">Coming soon</div>,
      category: "assessment",
      duration: "10-15 minutes",
      benefits: ["Provides cognitive baseline", "Identifies cognitive strengths", "Tracks changes over time"],
      comingSoon: true
    },
    {
      id: "stroke-risk-calculator",
      title: "Stroke Risk Calculator",
      description: "Personalized assessment of your stroke risk based on health factors",
      icon: <Stethoscope className="h-8 w-8" />,
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
      icon: <Microscope className="h-8 w-8" />,
      component: <div className="p-8 border rounded-lg">Coming soon</div>,
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
      icon: <LineChart className="h-8 w-8" />,
      component: <div className="p-8 border rounded-lg">Coming soon</div>,
      category: "tracking",
      duration: "Ongoing",
      benefits: ["Visualizes progress over time", "Identifies cognitive trends", "Provides actionable insights"],
      comingSoon: true
    },
    {
      id: "sleep-tracker",
      title: "Sleep Quality Monitor",
      description: "Track how your sleep patterns affect cognitive performance",
      icon: <Activity className="h-8 w-8" />,
      component: <div className="p-8 border rounded-lg">Coming soon</div>,
      category: "tracking",
      duration: "Daily tracking",
      benefits: ["Correlates sleep with cognition", "Identifies optimal sleep patterns", "Improves sleep hygiene"],
      comingSoon: true
    },
    {
      id: "health-metrics",
      title: "Health Metrics Dashboard",
      description: "Track health indicators that affect brain function and cognitive performance",
      icon: <BarChart className="h-8 w-8" />,
      component: <div className="p-8 border rounded-lg">Coming soon</div>,
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
      icon: <BookOpen className="h-8 w-8" />,
      component: <div className="p-8 border rounded-lg">Coming soon</div>,
      category: "education",
      duration: "Self-paced",
      benefits: ["Evidence-based information", "Easy-to-understand explanations", "Actionable health strategies"],
      comingSoon: true
    },
    {
      id: "neuroscience-courses",
      title: "Neuroscience Mini-Courses",
      description: "Short, interactive courses about the brain and cognitive function",
      icon: <School className="h-8 w-8" />,
      component: <div className="p-8 border rounded-lg">Coming soon</div>,
      category: "education",
      duration: "15-30 minutes per course",
      benefits: ["Builds neuroscience literacy", "Interactive learning", "Self-paced modules"],
      comingSoon: true
    },
    {
      id: "research-digest",
      title: "Brain Research Digest",
      description: "Summaries of the latest research in neuroscience and brain health",
      icon: <BookMarked className="h-8 w-8" />,
      component: <div className="p-8 border rounded-lg">Coming soon</div>,
      category: "education",
      duration: "5-10 minutes per article",
      benefits: ["Stays current with research", "Simplified explanations", "Practical applications"],
      comingSoon: true
    }
  ];

  const filteredTools = activeCategory === "all" 
    ? toolsData 
    : activeCategory === "featured"
    ? toolsData.filter(t => !t.comingSoon).slice(0, 4)
    : toolsData.filter(tool => tool.category === activeCategory);

  const handleToolSelect = (toolId: string) => {
    setActiveTool(toolId);
  };

  const handleBackToTools = () => {
    setActiveTool(null);
  };

  // Function to get category title
  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "training": return "Brain Training Tools";
      case "assessment": return "Cognitive Assessment Tools";
      case "tracking": return "Health Tracking Tools";
      case "education": return "Educational Resources";
      default: return "All Tools";
    }
  };

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/4">
          <div className="sticky top-24 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Cognitive Tools</h2>
              <p className="text-muted-foreground">
                Explore a variety of tools designed to help you improve your cognitive abilities.
              </p>
            </div>

            <Tabs defaultValue="training" value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="training" className="text-sm sm:text-base px-3 sm:px-4">Training</TabsTrigger>
                <TabsTrigger value="assessment" className="text-sm sm:text-base px-3 sm:px-4">Assessment</TabsTrigger>
                <TabsTrigger value="tracking" className="text-sm sm:text-base px-3 sm:px-4">Tracking</TabsTrigger>
                <TabsTrigger value="education" className="text-sm sm:text-base px-3 sm:px-4">Learning</TabsTrigger>
              </TabsList>

              <TabsContent value="training" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredTools.map((tool) => (
                    <Card key={tool.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleToolSelect(tool.id)}>
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          {tool.icon}
                          <div>
                            <CardTitle className="text-xl">{tool.title}</CardTitle>
                            <CardDescription>{tool.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{tool.duration}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {tool.benefits.map((benefit, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center">
                        {tool.comingSoon ? (
                          <Badge variant="outline">Coming Soon</Badge>
                        ) : (
                          <Button>Start</Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="assessment" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredTools.map((tool) => (
                    <Card key={tool.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleToolSelect(tool.id)}>
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          {tool.icon}
                          <div>
                            <CardTitle className="text-xl">{tool.title}</CardTitle>
                            <CardDescription>{tool.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{tool.duration}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {tool.benefits.map((benefit, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center">
                        {tool.comingSoon ? (
                          <Badge variant="outline">Coming Soon</Badge>
                        ) : (
                          <Button>Start</Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="tracking" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredTools.map((tool) => (
                    <Card key={tool.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleToolSelect(tool.id)}>
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          {tool.icon}
                          <div>
                            <CardTitle className="text-xl">{tool.title}</CardTitle>
                            <CardDescription>{tool.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{tool.duration}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {tool.benefits.map((benefit, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center">
                        {tool.comingSoon ? (
                          <Badge variant="outline">Coming Soon</Badge>
                        ) : (
                          <Button>Start</Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="education" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredTools.map((tool) => (
                    <Card key={tool.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleToolSelect(tool.id)}>
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          {tool.icon}
                          <div>
                            <CardTitle className="text-xl">{tool.title}</CardTitle>
                            <CardDescription>{tool.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{tool.duration}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {tool.benefits.map((benefit, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center">
                        {tool.comingSoon ? (
                          <Badge variant="outline">Coming Soon</Badge>
                        ) : (
                          <Button>Start</Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </aside>

        <div className="flex-1 lg:max-w-3xl">
          {activeTool ? (
            <div className="space-y-6">
              <Button 
                variant="ghost" 
                onClick={handleBackToTools}
                className="mb-4 flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" /> Back to Tools
              </Button>
              
              {toolsData.find(tool => tool.id === activeTool)?.component}
            </div>
          ) : (
            <Tabs defaultValue="training" value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="hidden">
                <TabsTrigger value="training">Training</TabsTrigger>
                <TabsTrigger value="assessment">Assessment</TabsTrigger>
                <TabsTrigger value="tracking">Tracking</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
              </TabsList>
              
              <TabsContent value="training" className="mt-0">
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-primary">{getCategoryTitle("training")}</h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {filteredTools.map((tool) => (
                      <Card 
                        key={tool.id} 
                        className={`overflow-hidden transition-all hover:shadow-sm ${
                          tool.comingSoon 
                            ? 'border-dashed border-muted-foreground/30' 
                            : 'border'
                        }`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="bg-primary/10 text-primary p-3 rounded-md">
                              {tool.icon}
                            </div>
                            <div className="flex items-center gap-2">
                              {tool.comingSoon && (
                                <span className="text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md">
                                  Under Development
                                </span>
                              )}
                              <div className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
                                {tool.duration}
                              </div>
                            </div>
                          </div>
                          <CardTitle className="text-xl mt-4">{tool.title}</CardTitle>
                          <CardDescription>{tool.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <div className="space-y-1.5">
                            <p className="text-sm font-medium text-primary">Benefits:</p>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {tool.benefits.map((benefit, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                                    <Brain className="h-3 w-3 text-primary" />
                                  </div>
                                  <span>{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            className="w-full" 
                            onClick={() => handleToolSelect(tool.id)}
                            variant={tool.comingSoon ? "outline" : "default"}
                            disabled={tool.comingSoon}
                          >
                            {tool.comingSoon ? "Coming Soon" : `Start ${tool.title}`}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="assessment" className="mt-0">
                <div className="flex items-center mb-8">
                  <h2 className="text-2xl font-semibold text-primary">{getCategoryTitle("assessment")}</h2>
                  <div className="ml-4 flex-grow h-px bg-primary/30 rounded-full max-w-[200px]"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTools.map((tool) => (
                    <Card 
                      key={tool.id} 
                      className={`overflow-hidden transition-all hover:shadow-sm ${
                        tool.comingSoon 
                          ? 'border-dashed border-muted-foreground/30' 
                          : 'border'
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="bg-primary/10 text-primary p-3 rounded-md">
                            {tool.icon}
                          </div>
                          <div className="flex items-center gap-2">
                            {tool.comingSoon && (
                              <span className="text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md">
                                Under Development
                              </span>
                            )}
                            <div className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
                              {tool.duration}
                            </div>
                          </div>
                        </div>
                        <CardTitle className="text-xl mt-4">{tool.title}</CardTitle>
                        <CardDescription>{tool.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="space-y-1.5">
                          <p className="text-sm font-medium text-primary">Benefits:</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {tool.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                                  <Brain className="h-3 w-3 text-primary" />
                                </div>
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full" 
                          onClick={() => handleToolSelect(tool.id)}
                          variant={tool.comingSoon ? "outline" : "default"}
                          disabled={tool.comingSoon}
                        >
                          {tool.comingSoon ? "Coming Soon" : `Start ${tool.title}`}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="tracking" className="mt-0">
                <div className="flex items-center mb-8">
                  <h2 className="text-2xl font-semibold text-primary">{getCategoryTitle("tracking")}</h2>
                  <div className="ml-4 flex-grow h-px bg-primary/30 rounded-full max-w-[200px]"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTools.map((tool) => (
                    <Card 
                      key={tool.id} 
                      className={`overflow-hidden transition-all hover:shadow-sm ${
                        tool.comingSoon 
                          ? 'border-dashed border-muted-foreground/30' 
                          : 'border'
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="bg-primary/10 text-primary p-3 rounded-md">
                            {tool.icon}
                          </div>
                          <div className="flex items-center gap-2">
                            {tool.comingSoon && (
                              <span className="text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md">
                                Under Development
                              </span>
                            )}
                            <div className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
                              {tool.duration}
                            </div>
                          </div>
                        </div>
                        <CardTitle className="text-xl mt-4">{tool.title}</CardTitle>
                        <CardDescription>{tool.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="space-y-1.5">
                          <p className="text-sm font-medium text-primary">Benefits:</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {tool.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                                  <Brain className="h-3 w-3 text-primary" />
                                </div>
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full" 
                          onClick={() => handleToolSelect(tool.id)}
                          variant={tool.comingSoon ? "outline" : "default"}
                          disabled={tool.comingSoon}
                        >
                          {tool.comingSoon ? "Coming Soon" : `Start ${tool.title}`}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="education" className="mt-0">
                <div className="flex items-center mb-8">
                  <h2 className="text-2xl font-semibold text-primary">{getCategoryTitle("education")}</h2>
                  <div className="ml-4 flex-grow h-px bg-primary/30 rounded-full max-w-[200px]"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTools.map((tool) => (
                    <Card 
                      key={tool.id} 
                      className={`overflow-hidden transition-all hover:shadow-sm ${
                        tool.comingSoon 
                          ? 'border-dashed border-muted-foreground/30' 
                          : 'border'
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="bg-primary/10 text-primary p-3 rounded-md">
                            {tool.icon}
                          </div>
                          <div className="flex items-center gap-2">
                            {tool.comingSoon && (
                              <span className="text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md">
                                Under Development
                              </span>
                            )}
                            <div className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
                              {tool.duration}
                            </div>
                          </div>
                        </div>
                        <CardTitle className="text-xl mt-4">{tool.title}</CardTitle>
                        <CardDescription>{tool.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="space-y-1.5">
                          <p className="text-sm font-medium text-primary">Benefits:</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {tool.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                                  <Brain className="h-3 w-3 text-primary" />
                                </div>
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full" 
                          onClick={() => handleToolSelect(tool.id)}
                          variant={tool.comingSoon ? "outline" : "default"}
                          disabled={tool.comingSoon}
                        >
                          {tool.comingSoon ? "Coming Soon" : `Start ${tool.title}`}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}