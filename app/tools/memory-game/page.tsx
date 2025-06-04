import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Memory Game - BrainWise",
  description: "Test and improve your memory with our interactive memory games",
};

export default function MemoryGamePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Memory Games</h1>
          <p className="text-muted-foreground text-lg">
            Challenge your memory with our collection of brain training games
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-3">Sequence Memory</h3>
            <p className="text-muted-foreground mb-4">
              Remember and repeat increasingly complex sequences
            </p>
            <a 
              href="/tools/sequence-memory-test" 
              className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Play Now
            </a>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-3">Word Memory</h3>
            <p className="text-muted-foreground mb-4">
              Test your ability to remember words and their positions
            </p>
            <a 
              href="/tools/word-memory-test" 
              className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Play Now
            </a>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-3">Visual Attention</h3>
            <p className="text-muted-foreground mb-4">
              Improve your visual memory and attention to detail
            </p>
            <a 
              href="/tools/visual-attention" 
              className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Play Now
            </a>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">Why Memory Training Matters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div>
              <h3 className="text-lg font-medium mb-2">Cognitive Benefits</h3>
              <ul className="text-muted-foreground space-y-1">
                <li>• Improves working memory capacity</li>
                <li>• Enhances attention and focus</li>
                <li>• Strengthens neural connections</li>
                <li>• Supports healthy brain aging</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Daily Life Benefits</h3>
              <ul className="text-muted-foreground space-y-1">
                <li>• Better academic performance</li>
                <li>• Improved work productivity</li>
                <li>• Enhanced problem-solving skills</li>
                <li>• Reduced mental fatigue</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 