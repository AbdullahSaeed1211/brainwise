import { VisualAttentionTest } from "@/components/visual-attention-test";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visual Attention Test | Brainwise",
  description: "Test and train your visual attention and processing speed with our interactive test.",
};

export default function VisualAttentionPage() {
  return (
    <div className="container mx-auto py-6 space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" className="h-8 w-8">
            <Link href="/tools">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back to Tools</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Visual Attention Test</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Train your ability to quickly identify specific visual patterns
        </p>
      </div>
      
      <div className="mx-auto max-w-3xl">
        <VisualAttentionTest />
      </div>
      
      <div className="mx-auto max-w-3xl mt-8">
        <div className="bg-card rounded-lg p-6 border shadow-sm">
          <h2 className="text-lg font-medium mb-2">About Visual Attention</h2>
          <p className="text-sm text-card-foreground mb-4">
            Visual attention is a cognitive process that allows you to selectively concentrate on specific 
            visual information while filtering out other perceivable stimuli. This skill is crucial for many 
            everyday activities like driving, reading, and navigating complex environments.
          </p>
          
          <h3 className="text-md font-medium mb-2">Benefits of Training</h3>
          <ul className="list-disc pl-5 text-sm space-y-1 text-card-foreground">
            <li>Improved reading speed and comprehension</li>
            <li>Enhanced driving safety through better hazard detection</li>
            <li>Better ability to find objects in cluttered environments</li>
            <li>Faster visual processing speed</li>
            <li>Improved capacity to ignore distractions</li>
          </ul>
          
          <div className="mt-4 text-sm text-muted-foreground">
            <p className="italic">
              Regular practice can significantly enhance visual attention abilities and overall cognitive performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 