"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface NumberTickerProps {
  value: number | string;
  direction?: "up" | "down";
  delay?: number;
  decimalPlaces?: number;
  startValue?: number;
  className?: string;
  duration?: number;
  suffix?: string;
}

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  decimalPlaces = 0,
  startValue = 0,
  className,
  duration = 1500,
  suffix = "",
}: NumberTickerProps) {
  // Parse the value if it's a string (e.g., "5+" becomes 5)
  const numericValue = typeof value === "string" 
    ? parseFloat(value.replace(/[^0-9.]/g, "")) 
    : value;
  
  const [currentValue, setCurrentValue] = useState(startValue);
  const counterRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (counterRef.current) {
      clearTimeout(counterRef.current);
    }

    // Delay the start of the animation if necessary
    setTimeout(() => {
      startTimeRef.current = Date.now();
      animateValue();
    }, delay);

    function animateValue() {
      const now = Date.now();
      const elapsedTime = startTimeRef.current ? now - startTimeRef.current : 0;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Use easeOutQuad for smoother animation
      const easeProgress = 1 - (1 - progress) * (1 - progress);
      
      if (direction === "up") {
        const nextValue = startValue + (numericValue - startValue) * easeProgress;
        setCurrentValue(nextValue);
      } else {
        const nextValue = startValue - (startValue - numericValue) * easeProgress;
        setCurrentValue(nextValue);
      }

      if (progress < 1) {
        counterRef.current = setTimeout(animateValue, 16); // ~60fps
      }
    }

    return () => {
      if (counterRef.current) {
        clearTimeout(counterRef.current);
      }
    };
  }, [numericValue, direction, delay, startValue, duration]);

  // Format the number with the specified decimal places
  const formattedValue = 
    typeof currentValue === "number" 
      ? currentValue.toFixed(decimalPlaces)
      : "0";

  return (
    <span className={cn("tabular-nums", className)}>
      {formattedValue}{suffix}
    </span>
  );
} 