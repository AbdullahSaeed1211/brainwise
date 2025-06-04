"use client";

import React from "react";
import { 
  Brain, 
  Activity, 
  Award, 
  Clock, 
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import Link from "next/link";

export function MobileHeroSection() {
  const [menuOpen, setMenuOpen] = useState(false);
  
  return (
    <div className="relative">
      {/* Mobile-optimized sticky header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/90 border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <span className="font-semibold text-lg">Brainwise</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            Log in
          </Button>
          <Button variant="outline" size="sm" className="hidden sm:flex">
            Sign Up
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>
      
      {/* Mobile navigation drawer */}
      {menuOpen && (
        <div className="absolute top-[60px] left-0 right-0 bg-background border-b z-40 p-4 md:hidden">
          <div className="flex flex-col space-y-2">
            <Link 
              href="/tools" 
              className="flex items-center justify-between p-3 rounded-md hover:bg-muted"
              onClick={() => setMenuOpen(false)}
            >
              <span>Brain Tools</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link 
              href="/stroke-prediction" 
              className="flex items-center justify-between p-3 rounded-md hover:bg-muted"
              onClick={() => setMenuOpen(false)}
            >
              <span>Health Assessment</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link 
              href="/login" 
              className="flex items-center justify-between p-3 rounded-md hover:bg-muted"
              onClick={() => setMenuOpen(false)}
            >
              <span>Log In</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Button className="w-full mt-2" onClick={() => setMenuOpen(false)}>
              Create Free Account
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Hero CTA */}
      <div className="px-4 pt-4 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Train, Assess & <span className="text-primary">Optimize</span> Your Brain Health
        </h1>
        <p className="text-base text-muted-foreground mb-4">
          Discover cognitive tools designed to strengthen your brain and improve mental performance.
        </p>
        <div className="flex flex-col gap-3">
          <Button className="w-full py-6 text-lg">Start Free Assessment</Button>
          <div className="text-xs text-center text-muted-foreground">
            <span className="font-medium">No credit card</span> • <span className="font-medium">Only 2 minutes</span>
          </div>
        </div>
      </div>

      {/* Mobile-optimized quick stats */}
      <div className="grid grid-cols-2 gap-3 px-4 pb-6">
        <Card className="overflow-hidden border-primary/10">
          <CardContent className="p-3 flex flex-col items-center text-center">
            <Activity className="h-5 w-5 text-primary mb-1" />
            <span className="text-sm font-medium">5+ Brain Tools</span>
            <span className="text-xs text-muted-foreground">For daily training</span>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-primary/10">
          <CardContent className="p-3 flex flex-col items-center text-center">
            <Award className="h-5 w-5 text-primary mb-1" />
            <span className="text-sm font-medium">Proven Results</span>
            <span className="text-xs text-muted-foreground">For all age groups</span>
          </CardContent>
        </Card>
      </div>

      {/* Tool preview carousel - mobile optimized horizontal scroll */}
      <div className="pb-6">
        <div className="px-4 mb-2">
          <h2 className="text-lg font-medium">Popular Brain Tools</h2>
        </div>
        <div className="flex overflow-x-auto pb-4 px-4 space-x-3 scrollbar-hide">
          {tools.map((tool, index) => (
            <div key={index} className="flex-shrink-0 w-[200px]">
              <Card className="h-full">
                <CardContent className="p-3">
                  <div className="bg-primary/10 p-2 w-fit rounded-md mb-2">
                    {tool.icon}
                  </div>
                  <h3 className="font-medium text-sm">{tool.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{tool.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom sticky CTA bar for mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-3 flex justify-between items-center z-40">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium">2-min assessment</span>
        </div>
        <Button className="px-4" size="sm">
          Start Now
        </Button>
      </div>

      {/* Mobile bottom padding to account for fixed CTA */}
      <div className="h-16"></div>
    </div>
  );
}

// Sample tool data for the carousel
const tools = [
  {
    icon: <Brain className="h-5 w-5 text-primary" />,
    title: "Memory Game",
    description: "Train your short-term memory through matching challenges"
  },
  {
    icon: <Clock className="h-5 w-5 text-primary" />,
    title: "Reaction Time",
    description: "Test and improve your brain's processing speed"
  },
  {
    icon: <Activity className="h-5 w-5 text-primary" />,
    title: "Visual Attention",
    description: "Enhance focus and concentration abilities"
  },
  {
    icon: <Award className="h-5 w-5 text-primary" />,
    title: "Mental Math",
    description: "Boost cognitive processing with arithmetic challenges"
  }
]; 