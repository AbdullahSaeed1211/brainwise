import React from "react";
import { Metadata } from "next";
import { 
  Search,
  Brain,
  BookOpen,
  Layers,
  Clock,
  Zap,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Brain Health Library | Brainwise",
  description: "Educational resources about brain health, cognitive functions, and strategies for maintaining optimal brain health throughout life.",
  keywords: "brain health, cognitive functions, neuroplasticity, brain aging, mental health, brain exercises",
};

export default function BrainHealthLibraryPage() {
  return (
    <div className="container py-8 px-4 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">
            Brain Health Library
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-3xl mx-auto text-center">
            Explore our comprehensive collection of resources on brain health, cognitive function, and strategies for keeping your brain sharp.
          </p>

          <div className="relative max-w-md mx-auto mt-6">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search the library..."
              className="w-full pl-9 py-2"
            />
          </div>
        </div>

        <Tabs defaultValue="fundamentals" className="w-full">
          <div className="flex justify-center overflow-x-auto pb-2 scrollbar-hide">
            <TabsList className="mb-8">
              <TabsTrigger value="fundamentals" className="text-sm sm:text-base px-3 sm:px-4 flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span>Brain Fundamentals</span>
              </TabsTrigger>
              <TabsTrigger value="cognitive" className="text-sm sm:text-base px-3 sm:px-4 flex items-center gap-2">
                <Layers className="h-4 w-4" />
                <span>Cognitive Functions</span>
              </TabsTrigger>
              <TabsTrigger value="aging" className="text-sm sm:text-base px-3 sm:px-4 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Brain Aging</span>
              </TabsTrigger>
              <TabsTrigger value="optimization" className="text-sm sm:text-base px-3 sm:px-4 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span>Brain Optimization</span>
              </TabsTrigger>
              <TabsTrigger value="resources" className="text-sm sm:text-base px-3 sm:px-4 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Resources</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Brain Fundamentals Tab */}
          <TabsContent value="fundamentals" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Brain Structure & Function</CardTitle>
                  <CardDescription>The essential guide to neuroanatomy</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm">
                    Learn about the key structures of the brain and their functions in cognition, emotion, and bodily regulation.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between" asChild>
                    <Link href="#">
                      Read More <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Neuroplasticity</CardTitle>
                  <CardDescription>How your brain changes throughout life</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm">
                    Discover how the brain forms new neural connections and adapts to experiences, learning, and recovery.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between" asChild>
                    <Link href="#">
                      Read More <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Brain Chemistry</CardTitle>
                  <CardDescription>Neurotransmitters and brain function</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm">
                    Explore the role of neurotransmitters like dopamine, serotonin, and acetylcholine in brain function and mood.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between" asChild>
                    <Link href="#">
                      Read More <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Brain-Body Connection</CardTitle>
                  <CardDescription>How physical health impacts brain function</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm">
                    Understand the bidirectional relationship between your brain and body systems, including the gut-brain axis and neuroendocrine system.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between" asChild>
                    <Link href="#">
                      Read More <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>The Developing Brain</CardTitle>
                  <CardDescription>From childhood to adulthood</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm">
                    Follow the journey of brain development from infancy through adolescence and into adulthood, with key milestones and changes.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between" asChild>
                    <Link href="#">
                      Read More <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Cognitive Functions Tab */}
          <TabsContent value="cognitive" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Memory</CardTitle>
                  <CardDescription>Types and mechanisms of memory</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm">
                    Explore the different types of memory (working, short-term, long-term), how memories are formed, stored, and retrieved.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between" asChild>
                    <Link href="#">
                      Read More <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Attention</CardTitle>
                  <CardDescription>Focus, divided attention, and concentration</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm">
                    Learn about the attention networks in the brain, how focus is regulated, and strategies to improve concentration.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between" asChild>
                    <Link href="#">
                      Read More <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Executive Function</CardTitle>
                  <CardDescription>The brain&apos;s management system</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm">
                    Discover the frontal lobe functions that help you plan, organize, and execute complex activities and behavior.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between" asChild>
                    <Link href="#">
                      Read More <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Language Processing</CardTitle>
                  <CardDescription>How the brain processes and produces language</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm">
                    Understand the brain areas involved in language comprehension, speech production, and how bilingualism affects brain structure.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between" asChild>
                    <Link href="#">
                      Read More <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Processing Speed</CardTitle>
                  <CardDescription>The efficiency of brain operations</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm">
                    Learn about factors that affect how quickly your brain processes information and responds to stimuli.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between" asChild>
                    <Link href="#">
                      Read More <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Brain Aging Tab */}
          <TabsContent value="aging" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Normal Cognitive Aging</CardTitle>
                  <CardDescription>Expected changes with age</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm">
                    Understand the natural changes in cognition that occur with aging, including which abilities tend to decline and which remain stable.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between" asChild>
                    <Link href="#">
                      Read More <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Brain Health vs. Pathology</CardTitle>
                  <CardDescription>Distinguishing normal aging from disease</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm">
                    Learn the difference between normal age-related changes and signs of neurodegenerative conditions like dementia or Alzheimer&apos;s disease. 
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between" asChild>
                    <Link href="#">
                      Read More <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Stroke & Brain Health</CardTitle>
                  <CardDescription>Impact and recovery</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm">
                    Explore the effects of stroke on brain function, prevention strategies, and rehabilitation approaches.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between" asChild>
                    <Link href="/stroke-prevention">
                      Read More <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Cognitive Reserve</CardTitle>
                  <CardDescription>Building brain resilience</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm">
                    Discover how education, mental stimulation, and social engagement can build cognitive reserve to protect against age-related decline.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between" asChild>
                    <Link href="#">
                      Read More <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Memory Loss</CardTitle>
                  <CardDescription>When to be concerned</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm">
                    Learn to distinguish between benign forgetfulness and concerning memory changes that warrant medical attention.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between" asChild>
                    <Link href="#">
                      Read More <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Brain Optimization Tab */}
          <TabsContent value="optimization" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Nutrition for Brain Health</CardTitle>
                  <CardDescription>Dietary patterns and nutrients</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm">
                    Explore the MIND diet, omega-3 fatty acids, antioxidants, and other nutritional approaches to support brain health.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between" asChild>
                    <Link href="#">
                      Read More <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Exercise & Brain Function</CardTitle>
                  <CardDescription>Physical activity impacts cognition</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm">
                    Learn how various types of exercise affect brain structure, function, and cognitive performance across the lifespan.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between" asChild>
                    <Link href="#">
                      Read More <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Sleep & Cognitive Function</CardTitle>
                  <CardDescription>How sleep affects your brain</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm">
                    Discover the critical role of sleep in memory consolidation, toxin clearance, and overall brain health.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between" asChild>
                    <Link href="#">
                      Read More <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Cognitive Training</CardTitle>
                  <CardDescription>Exercise your brain effectively</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm">
                    Explore evidence-based brain training approaches and understand what works and what doesn&apos;t for cognitive enhancement.
                  </p>
                  <div className="mt-4">
                    <Button className="w-full micro-bounce" asChild>
                      <Link href="/tools">
                        Try Our Brain Training Tools
                      </Link>
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between" asChild>
                    <Link href="#">
                      Read More <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Stress Management</CardTitle>
                  <CardDescription>Protecting your brain from chronic stress</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm">
                    Learn how chronic stress damages the brain and discover evidence-based techniques to manage stress for better brain health.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between" asChild>
                    <Link href="#">
                      Read More <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Brain Health Assessment Tools</CardTitle>
                <CardDescription>Evaluate your cognitive health</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Brainwise offers several assessment tools to help you understand and monitor your brain health over time.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <Card className="border border-muted">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Brain Health Assessment</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm mb-4">Comprehensive evaluation of cognitive domains</p>
                      <Button size="sm" className="w-full micro-bounce" asChild>
                        <Link href="/assessment-report">
                          Start Assessment
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-muted">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Stroke Risk Calculator</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm mb-4">Evaluate your stroke risk based on health factors</p>
                      <Button size="sm" className="w-full micro-bounce" asChild>
                        <Link href="/stroke-prediction">
                          Calculate Risk
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-muted">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Cognitive Game Suite</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm mb-4">Interactive games to test and train specific cognitive skills</p>
                      <Button size="sm" className="w-full micro-bounce" asChild>
                        <Link href="/tools">
                          Browse Tools
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-muted">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Health Metrics Tracking</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm mb-4">Monitor key health indicators related to brain health</p>
                      <Button size="sm" className="w-full micro-bounce" asChild>
                        <Link href="/health-metrics">
                          View Metrics
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expert Resources</CardTitle>
                <CardDescription>Trusted information sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Medical Organizations:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>National Institute on Aging</li>
                      <li>Alzheimer&apos;s Association</li>
                      <li>American Stroke Association</li>
                      <li>Dana Foundation for Brain Research</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Academic Resources:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Harvard Brain Science Initiative</li>
                      <li>Stanford Center for Longevity</li>
                      <li>MIT AgeLab</li>
                      <li>University of California Memory and Aging Center</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 