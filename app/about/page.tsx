import React from "react";
import Link from "next/link";
import type { Metadata, Viewport } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Users, BookOpen, HeartPulse, Sparkles } from "lucide-react";
import { defaultViewport } from "@/lib/meta-config";

export const viewport: Viewport = defaultViewport;

export const metadata: Metadata = {
  title: "About Brainwise | Brain Health Platform",
  description: "Our mission is to make brain health analysis accessible to everyone through innovative AI-powered tools and evidence-based approaches.",
  keywords: "about brainwise, brain health mission, cognitive health team, brain science, neurological wellbeing",
  openGraph: {
    title: "About Brainwise | Brain Health Platform",
    description: "Our mission is to make brain health analysis accessible to everyone through innovative AI-powered tools and evidence-based approaches.",
    url: "https://brainwise-sigma.vercel.app/about",
    type: "website",
    images: [
      {
        url: "/images/og-about.jpg",
        width: 1200,
        height: 630,
        alt: "About Brainwise"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "About Brainwise | Brain Health Platform",
    description: "Our mission is to make brain health analysis accessible to everyone through innovative AI-powered tools and evidence-based approaches.",
    images: ["/images/og-about.jpg"]
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function AboutPage() {
  return (
    <div className="container py-8 px-4 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            About Brainwise
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-3xl mx-auto">
            Our mission is to make brain health analysis accessible to everyone through innovative AI-powered tools.
          </p>
        </div>

        <div className="prose dark:prose-invert max-w-none space-y-6">
          <p className="lead text-lg text-muted-foreground">
            Brainwise was founded with a simple yet powerful mission: to leverage artificial intelligence to improve brain health outcomes worldwide. By making advanced diagnostic tools accessible to everyone, we aim to empower individuals to take control of their neurological wellbeing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-start space-x-4">
              <Brain className="h-8 w-8 text-primary mt-1" />
              <div>
                <CardTitle>Our Mission</CardTitle>
                <CardDescription>Democratizing brain health</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
            Our mission is to democratize access to brain health information and provide reliable tools for monitoring and improving neurological wellbeing. We believe that prevention and early detection are critical to addressing neurological disorders.
          </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                    <Sparkles className="h-3 w-3 text-primary" />
                  </span>
                  <span>Make advanced brain health tracking accessible to everyone</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                    <Sparkles className="h-3 w-3 text-primary" />
                  </span>
                  <span>Provide evidence-based tools for cognitive assessment and training</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                    <Sparkles className="h-3 w-3 text-primary" />
                  </span>
                  <span>Empower users with knowledge to make informed health decisions</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-start space-x-4">
              <Users className="h-8 w-8 text-primary mt-1" />
              <div>
                <CardTitle>Our Team</CardTitle>
                <CardDescription>Multidisciplinary expertise</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Brainwise was developed by a multidisciplinary team of medical professionals, data scientists, and software engineers passionate about improving healthcare through technology. Our team combines expertise in:
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                    <Sparkles className="h-3 w-3 text-primary" />
                  </span>
                  <span>Neurology and cognitive science</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                    <Sparkles className="h-3 w-3 text-primary" />
                  </span>
                  <span>Artificial intelligence and machine learning</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                    <Sparkles className="h-3 w-3 text-primary" />
                  </span>
                  <span>User experience and accessible design</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-start space-x-4">
              <BookOpen className="h-8 w-8 text-primary mt-1" />
              <div>
                <CardTitle>Our Approach</CardTitle>
                <CardDescription>Evidence-based methodology</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We believe in a science-first approach to brain health. All our tools and content are developed with input from experts and based on the latest research.
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                    <Sparkles className="h-3 w-3 text-primary" />
                  </span>
                  <span>Research-backed assessment methods</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                    <Sparkles className="h-3 w-3 text-primary" />
                  </span>
                  <span>Continuous updates based on new findings</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                    <Sparkles className="h-3 w-3 text-primary" />
                  </span>
                  <span>Transparent methodology and sources</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-start space-x-4">
              <HeartPulse className="h-8 w-8 text-primary mt-1" />
              <div>
                <CardTitle>Medical Disclaimer</CardTitle>
                <CardDescription>Educational purpose</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Brainwise is designed to be an educational and screening tool, not a replacement for professional medical advice. Our services provide:
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                    <Sparkles className="h-3 w-3 text-primary" />
                  </span>
                  <span>Educational resources about brain health</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                    <Sparkles className="h-3 w-3 text-primary" />
                  </span>
                  <span>Self-assessment tools for personal awareness</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                    <Sparkles className="h-3 w-3 text-primary" />
                  </span>
                  <span>Information to discuss with healthcare providers</span>
                </li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                Always consult with a qualified healthcare provider for diagnosis and treatment of any medical condition.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col items-center justify-center pt-6 space-y-4">
          <p className="text-muted-foreground text-center max-w-lg">
            Ready to start your brain health journey? Explore our tools and resources designed to help you understand and improve your cognitive wellbeing.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild className="micro-bounce">
              <Link href="/tools">
                Explore Our Tools
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/brain-health">
                Brain Health Library
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">
                Contact Us
          </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 