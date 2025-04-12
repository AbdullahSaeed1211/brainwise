"use client";

import React from "react";
import { MentalMathChallenge } from "@/components/mental-math-challenge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MentalMathPage() {
  return (
    <div className="container max-w-6xl pb-12 pt-8 px-4">
      <div className="mb-8">
        <Button variant="ghost" className="flex items-center gap-2 mb-6" asChild>
          <Link href="/tools">
            <ArrowLeft className="h-4 w-4" /> Back to Tools
          </Link>
        </Button>
      
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Mental Math Challenge</h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Enhance cognitive processing with mental calculations
          </p>
        </div>
      </div>
      
      <div className="relative py-2">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl -z-10"></div>
        <MentalMathChallenge />
      </div>
      
      <div className="mt-12 grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-3">How It Works</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              The Mental Math Challenge presents you with arithmetic problems of varying difficulty that you must solve mentally—without using a calculator or pen and paper.
            </p>
            <p>
              Choose your difficulty level and type of operations (addition, subtraction, multiplication, division, or mixed) to customize your practice session.
            </p>
            <p>
              Each session consists of 10 problems, with a timer to encourage quick thinking. Your score is based on both accuracy and speed.
            </p>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-3">Brain Health Benefits</h2>
          <ul className="space-y-2">
            <li className="flex gap-2 items-start">
              <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              </span>
              <span>
                <strong className="font-medium">Processing Speed:</strong> Regular mental math practice improves your brain&apos;s ability to process information quickly.
              </span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              </span>
              <span>
                <strong className="font-medium">Working Memory:</strong> Challenges you to hold multiple numbers in mind while performing operations.
              </span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              </span>
              <span>
                <strong className="font-medium">Numerical Cognition:</strong> Strengthens your brain&apos;s ability to manipulate and understand numbers.
              </span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              </span>
              <span>
                <strong className="font-medium">Focus:</strong> Requires concentrated attention, helping to improve overall focus abilities.
              </span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="mt-12 flex flex-col md:flex-row justify-between gap-8 border-t pt-8">
        <div>
          <h3 className="font-medium mb-2">Recommended Use</h3>
          <p className="text-sm text-muted-foreground">For optimal results, practice mental math for 5-10 minutes, 3-4 times per week.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/health-metrics">Track Progress</Link>
          </Button>
          <Button asChild>
            <Link href="/tools">Explore More Tools</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 