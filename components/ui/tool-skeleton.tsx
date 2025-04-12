"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ToolCardSkeleton() {
  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <CardHeader className="pb-2 space-y-4">
        <div className="flex justify-between items-start">
          <Skeleton className="h-14 w-14 rounded-xl" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      
      <CardContent className="pb-2 pt-0 flex-grow space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={`benefit-skeleton-${i}`} className="flex items-start gap-2">
            <Skeleton className="h-5 w-5 rounded-full flex-shrink-0" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </CardContent>
      
      <CardFooter className="pt-2">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

export function ToolCardsGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ToolCardSkeleton key={`tool-skeleton-${i}`} />
      ))}
    </div>
  );
} 