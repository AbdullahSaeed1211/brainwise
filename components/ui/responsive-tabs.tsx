"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./button"

const ResponsiveTabs = TabsPrimitive.Root

interface ResponsiveTabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  scrollable?: boolean;
}

const ResponsiveTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  ResponsiveTabsListProps
>(({ className, scrollable = true, ...props }, ref) => {
  const listRef = React.useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = React.useState(false);
  const [showRightArrow, setShowRightArrow] = React.useState(false);

  const handleScroll = React.useCallback(() => {
    if (listRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = listRef.current;
      // Show left arrow if not at the start
      setShowLeftArrow(scrollLeft > 10);
      // Show right arrow if not at the end
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  React.useEffect(() => {
    const listElement = listRef.current;
    if (listElement && scrollable) {
      handleScroll();
      listElement.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);

      // Do an initial check to see if arrows are needed
      setShowRightArrow(listElement.scrollWidth > listElement.clientWidth);
      
      return () => {
        listElement.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      };
    }
  }, [handleScroll, scrollable]);

  const scrollLeft = () => {
    if (listRef.current) {
      listRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (listRef.current) {
      listRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  if (!scrollable) {
    return (
      <TabsPrimitive.List
        ref={ref}
        className={cn(
          "flex w-full items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
          className
        )}
        {...props}
      />
    );
  }

  return (
    <div className="relative w-full flex items-center">
      {showLeftArrow && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 z-10 h-8 w-8 rounded-full bg-background shadow-sm hover:bg-muted"
          onClick={scrollLeft}
          type="button"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Scroll left</span>
        </Button>
      )}
      
      <div
        ref={listRef}
        className="overflow-x-auto scrollbar-hide flex-1 mx-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <TabsPrimitive.List
          ref={ref}
          className={cn(
            "inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground min-w-full",
            scrollable ? "px-8" : "",
            className
          )}
          {...props}
        />
      </div>
      
      {showRightArrow && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 z-10 h-8 w-8 rounded-full bg-background shadow-sm hover:bg-muted"
          onClick={scrollRight}
          type="button"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Scroll right</span>
        </Button>
      )}
    </div>
  );
});
ResponsiveTabsList.displayName = "ResponsiveTabsList";

const ResponsiveTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
));
ResponsiveTabsTrigger.displayName = "ResponsiveTabsTrigger";

const ResponsiveTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:zoom-out-95 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95 duration-200",
      className
    )}
    {...props}
  />
));
ResponsiveTabsContent.displayName = "ResponsiveTabsContent";

export { ResponsiveTabs, ResponsiveTabsList, ResponsiveTabsTrigger, ResponsiveTabsContent }; 