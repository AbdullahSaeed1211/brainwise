import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MemoryGame } from "@/components/memory-game";
import { ConcentrationGame } from "@/components/concentration-game";
import { ReactionGame } from "@/components/reaction-game";
import { WordMemoryTest } from "@/components/word-memory-test";
import { SequenceMemoryTest } from "@/components/sequence-memory-test";
import { VerbalFluencyTest } from "@/components/verbal-fluency-test";
import { PatternRecognitionTest } from "@/components/pattern-recognition-test";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cognitive Games | Brainwise",
  description: "Improve your memory, attention, and processing speed with our scientifically designed cognitive games.",
  keywords: "cognitive games, brain training, memory games, attention exercises, processing speed, brain health",
  openGraph: {
    title: "Brain Training Games | Brainwise",
    description: "Enhance your cognitive abilities with fun, interactive games designed to improve memory, attention, and processing speed.",
    url: "https://brainwise.com/cognitive-games",
    type: "website",
    images: [
      {
        url: "/images/og-cognitive-games.jpg",
        width: 1200,
        height: 630,
        alt: "Brainwise Cognitive Games"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Brain Training Games | Brainwise",
    description: "Enhance your cognitive abilities with fun, interactive games designed to improve memory, attention, and processing speed.",
    images: ["/images/og-cognitive-games.jpg"]
  }
};

export default function CognitiveGamesPage() {
  return (
    <div className="container mx-auto py-6 md:py-8 px-4 space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Cognitive Games</h1>
        <p className="text-muted-foreground mb-4 md:mb-6">
          Exercise your brain with these cognitive games designed to train different domains of
          cognition. Your results will be tracked over time to help you monitor your progress.
        </p>
      </div>

      <Tabs defaultValue="memory" className="w-full">
        <TabsList className="grid grid-cols-7 mb-4 md:mb-8">
          <TabsTrigger value="memory" className="text-xs sm:text-sm md:text-base">Memory Game</TabsTrigger>
          <TabsTrigger value="concentration" className="text-xs sm:text-sm md:text-base">Concentration</TabsTrigger>
          <TabsTrigger value="reaction" className="text-xs sm:text-sm md:text-base">Reaction Time</TabsTrigger>
          <TabsTrigger value="word-memory" className="text-xs sm:text-sm md:text-base">Word Memory</TabsTrigger>
          <TabsTrigger value="sequence-memory" className="text-xs sm:text-sm md:text-base">Sequence Memory</TabsTrigger>
          <TabsTrigger value="verbal-fluency" className="text-xs sm:text-sm md:text-base">Verbal Fluency</TabsTrigger>
          <TabsTrigger value="pattern-recognition" className="text-xs sm:text-sm md:text-base">Pattern Recognition</TabsTrigger>
        </TabsList>
        
        <TabsContent value="memory" className="mt-0">
          <div className="bg-card rounded-lg p-3 sm:p-4 md:p-6">
            <MemoryGame />
          </div>
        </TabsContent>
        
        <TabsContent value="concentration" className="mt-0">
          <div className="bg-card rounded-lg p-3 sm:p-4 md:p-6">
            <ConcentrationGame />
          </div>
        </TabsContent>
        
        <TabsContent value="reaction" className="mt-0">
          <div className="bg-card rounded-lg p-3 sm:p-4 md:p-6">
            <ReactionGame />
          </div>
        </TabsContent>

        <TabsContent value="word-memory" className="mt-0">
          <div className="bg-card rounded-lg p-3 sm:p-4 md:p-6">
            <WordMemoryTest />
          </div>
        </TabsContent>

        <TabsContent value="sequence-memory" className="mt-0">
          <div className="bg-card rounded-lg p-3 sm:p-4 md:p-6">
            <SequenceMemoryTest />
          </div>
        </TabsContent>

        <TabsContent value="verbal-fluency" className="mt-0">
          <div className="bg-card rounded-lg p-3 sm:p-4 md:p-6">
            <VerbalFluencyTest />
          </div>
        </TabsContent>

        <TabsContent value="pattern-recognition" className="mt-0">
          <div className="bg-card rounded-lg p-3 sm:p-4 md:p-6">
            <PatternRecognitionTest />
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mt-8 md:mt-12">
        <div className="rounded-lg border bg-card p-4 md:p-6">
          <h3 className="font-semibold mb-2">Memory</h3>
          <p className="text-sm text-muted-foreground">
            Memory games test and enhance your short-term memory by challenging you to 
            remember information. Regular memory exercises can strengthen 
            neural connections associated with memory formation and recall.
          </p>
        </div>
        
        <div className="rounded-lg border bg-card p-4 md:p-6">
          <h3 className="font-semibold mb-2">Attention</h3>
          <p className="text-sm text-muted-foreground">
            Attention games test your ability to maintain focused attention on rapidly
            changing stimuli. Improving attention skills can help with everyday tasks that 
            require concentration and can enhance overall cognitive performance.
          </p>
        </div>
        
        <div className="rounded-lg border bg-card p-4 md:p-6">
          <h3 className="font-semibold mb-2">Processing Speed</h3>
          <p className="text-sm text-muted-foreground">
            Reaction time games measure how quickly you process and respond to visual
            stimuli. Processing speed is a fundamental cognitive function that affects
            many aspects of thinking and can decline with age if not exercised.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-4 md:p-6">
          <h3 className="font-semibold mb-2">Executive Function</h3>
          <p className="text-sm text-muted-foreground">
            Pattern recognition and verbal fluency tests assess executive functions like planning, 
            problem-solving, and cognitive flexibility. These high-level cognitive abilities are 
            essential for complex thinking and decision-making.
          </p>
        </div>
      </div>
    </div>
  );
} 