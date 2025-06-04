"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  pauseOnHover?: boolean;
  reverse?: boolean;
  vertical?: boolean;
  repeat?: number;
}

export function Marquee({
  children,
  className,
  pauseOnHover = false,
  reverse = false,
  vertical = false,
  repeat = 1,
  ...props
}: MarqueeProps) {
  const [shouldAnimate, setShouldAnimate] = React.useState(true);

  const handleMouseEnter = React.useCallback(() => {
    if (pauseOnHover) {
      setShouldAnimate(false);
    }
  }, [pauseOnHover]);

  const handleMouseLeave = React.useCallback(() => {
    if (pauseOnHover) {
      setShouldAnimate(true);
    }
  }, [pauseOnHover]);

  const contentArray = React.useMemo(
    () => Array(repeat).fill(React.Children.toArray(children)),
    [children, repeat]
  );

  const flattenedContent = contentArray.flat();

  return (
    <div
      className={cn(
        "flex w-full overflow-hidden [--duration:40s] [--gap:1rem]",
        vertical && "flex-col",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div
        className={cn(
          "flex shrink-0 justify-around gap-[--gap] [min-width:100%]",
          vertical && "flex-col",
          vertical && "[min-height:100%]",
          shouldAnimate && "animate-[marquee_var(--duration)_linear_infinite]",
          shouldAnimate &&
            reverse &&
            "animate-[marquee-reverse_var(--duration)_linear_infinite]"
        )}
      >
        {flattenedContent.map((item, index) => (
          <div
            key={index}
            className={cn(
              "flex shrink-0 justify-around gap-[--gap]",
              vertical && "flex-col"
            )}
          >
            {item}
          </div>
        ))}
      </div>
      <div
        aria-hidden
        className={cn(
          "flex shrink-0 justify-around gap-[--gap] [min-width:100%]",
          vertical && "flex-col",
          vertical && "[min-height:100%]",
          shouldAnimate && "animate-[marquee_var(--duration)_linear_infinite]",
          shouldAnimate &&
            reverse &&
            "animate-[marquee-reverse_var(--duration)_linear_infinite]"
        )}
      >
        {flattenedContent.map((item, index) => (
          <div
            key={index}
            className={cn(
              "flex shrink-0 justify-around gap-[--gap]",
              vertical && "flex-col"
            )}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
} 