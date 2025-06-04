"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Brain, ArrowRight } from "lucide-react";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";

export function HeroSection() {
  return (
    <section className="relative pt-12 md:pt-16 pb-16 md:pb-24 px-4 md:px-6 border-b overflow-hidden">
      {/* Grid background pattern */}
      <div className="absolute inset-0 -z-10 bg-[length:20px_20px] bg-center [background-image:linear-gradient(rgba(var(--magic-primary),0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--magic-primary),0.05)_1px,transparent_1px)]"></div>
      
      {/* Gradient blobs */}
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-[rgba(var(--magic-primary),0.2)] to-[rgba(var(--magic-accent),0.2)] blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-[rgba(var(--magic-secondary),0.2)] to-[rgba(var(--magic-primary),0.2)] blur-3xl"></div>
      
      <div className="container mx-auto max-w-6xl relative z-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-4 md:space-y-6">
            <div className="inline-flex items-center rounded-full border px-3 py-1 md:px-4 md:py-1.5 text-xs md:text-sm font-medium bg-background/80 backdrop-blur-sm">
              <span className="bg-primary/20 text-primary rounded-full p-1 mr-2">
                <Brain className="h-3 w-3 md:h-3.5 md:w-3.5" />
              </span>
              <AnimatedShinyText shimmerWidth={150} shimmerDuration={3} shimmerDelay={4}>
                Brainwise — Complete Brain Health Toolkit
              </AnimatedShinyText>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">
              Train, Assess & <span className="magic-gradient-text">Optimize</span> Your Brain Health
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl">
              Discover a comprehensive suite of cognitive tools designed to strengthen your brain, 
              assess your health, and help you maintain optimal mental performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2 md:pt-4">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary/90 hover:opacity-90 text-primary-foreground shadow-lg hover:shadow-xl transition-all border-none" asChild>
                <Link href="/tools">
                  Start Free Training <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 backdrop-blur-sm bg-background/50" asChild>
                <Link href="/stroke-prediction">
                  Check Health Risks
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">No credit card required</span> • <span className="font-medium">5,000+</span> users improving their brain health
            </p>
          </div>
          <div className="relative h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]">
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-xl overflow-hidden border shadow-xl hover:shadow-2xl transition-all duration-500">
              <Image
                src="/brain-hero.png"
                alt="Brain health visualization"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="object-cover object-center opacity-90 hover:scale-105 transition-transform duration-700"
              />
              
              {/* Inner decorative elements */}
              <div className="absolute top-5 right-5 h-20 w-20 rounded-full bg-gradient-to-br from-[rgba(var(--magic-primary),0.15)] to-[rgba(var(--magic-accent),0.15)] blur-xl"></div>
              <div className="absolute bottom-5 left-5 h-16 w-16 rounded-full bg-gradient-to-tr from-[rgba(var(--magic-secondary),0.15)] to-[rgba(var(--magic-primary),0.15)] blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 