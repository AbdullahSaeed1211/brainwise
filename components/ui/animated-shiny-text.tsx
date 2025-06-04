"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AnimatedShinyTextProps {
  children: React.ReactNode;
  className?: string;
  shimmerWidth?: number;
  shimmerDuration?: number;
  shimmerDelay?: number;
}

export function AnimatedShinyText({
  children,
  className,
  shimmerWidth = 100,
  shimmerDuration = 2.5,
  shimmerDelay = 3,
}: AnimatedShinyTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Add the shimmer effect via CSS
    container.style.setProperty("--shimmer-width", `${shimmerWidth}px`);
    container.style.setProperty("--shimmer-duration", `${shimmerDuration}s`);
    container.style.setProperty("--shimmer-delay", `${shimmerDelay}s`);
  }, [shimmerWidth, shimmerDuration, shimmerDelay]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative inline-block overflow-hidden whitespace-nowrap",
        "after:absolute after:inset-0 after:translate-x-[-150%] after:animate-[shimmer_var(--shimmer-duration)_var(--shimmer-delay)_infinite]",
        "after:bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)]",
        className
      )}
    >
      {children}
    </div>
  );
} 