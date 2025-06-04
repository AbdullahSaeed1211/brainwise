"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Activity, Zap, Scale } from "lucide-react";
import { motion } from "framer-motion";

export function ToolsShowcase() {
  const tools = [
    {
      icon: <Brain className="h-6 w-6 text-primary" />,
      title: "Memory Challenge",
      description: "Enhance your memory and recall abilities",
      href: "/tools/memory-game"
    },
    {
      icon: <Activity className="h-6 w-6 text-primary" />,
      title: "Reaction Time",
      description: "Test and improve your processing speed",
      href: "/tools/reaction-test"
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "Focus Trainer",
      description: "Sharpen your attention and concentration",
      href: "/tools"
    },
    {
      icon: <Scale className="h-6 w-6 text-primary" />,
      title: "Risk Assessment",
      description: "Evaluate your brain health risk factors",
      href: "/stroke-prediction"
    }
  ];

  return (
    <section className="py-20 px-4 md:px-6 bg-background">
      <div className="container mx-auto max-w-6xl">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-4">
            <span className="mr-2">🧠</span>
            <span>Interactive Tools</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Brain Health Toolkit
          </h2>
          <p className="text-xl text-muted-foreground">
            Scientifically designed exercises to assess and improve your cognitive function.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={tool.href} className="block h-full">
                <Card className="h-full border hover:border-primary/50 transition-all hover:shadow-md">
                  <CardHeader>
                    <motion.div 
                      className="bg-primary/10 p-3 w-fit rounded-lg mb-2"
                      whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      {tool.icon}
                    </motion.div>
                    <CardTitle>{tool.title}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="flex justify-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button size="lg" asChild>
            <Link href="/tools">
              View All Tools
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
} 