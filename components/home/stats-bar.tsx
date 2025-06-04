"use client";

import { motion } from "framer-motion";
import { NumberTicker } from "@/components/ui/number-ticker";

interface StatItemProps {
  value: string;
  label: string;
  delay: number;
}

function StatItem({ value, label, delay }: StatItemProps) {
  // Extract numeric part and any suffix (like +, %, etc.)
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));
  const suffix = value.replace(/[0-9.]/g, "");
  
  return (
    <motion.div 
      className="flex flex-col items-center text-center space-y-2"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="text-4xl md:text-5xl font-bold">
        <NumberTicker 
          value={numericValue} 
          suffix={suffix}
          delay={delay * 1000} 
          duration={2000}
          className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
        />
      </div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </motion.div>
  );
}

export function StatsBar() {
  return (
    <section className="bg-gradient-to-r from-muted/70 to-muted/30 dark:from-muted/20 dark:to-muted/5 border-y border-border/30">
      <div className="container mx-auto py-16 md:py-20 px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 lg:gap-10">
          <StatItem 
            value="5+" 
            label="Cognitive Tools" 
            delay={0}
          />
          <StatItem 
            value="15min" 
            label="Daily for Results" 
            delay={0.1}
          />
          <StatItem 
            value="47%" 
            label="Better Risk Awareness" 
            delay={0.2}
          />
          <StatItem 
            value="100%" 
            label="Adult-Optimized" 
            delay={0.3}
          />
        </div>
      </div>
    </section>
  );
} 