"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface PersonAvatar {
  image?: string;
  name: string;
  fallback: string;
}

interface AvatarCirclesProps {
  people: PersonAvatar[];
  numPeople?: number;
  className?: string;
  limit?: number;
}

export function AvatarCircles({
  people,
  numPeople = 99,
  className,
  limit = 5,
}: AvatarCirclesProps) {
  const displayedPeople = people.slice(0, limit);
  const remainingCount = numPeople > people.length ? numPeople - people.length : people.length - limit;
  const shouldShowCount = people.length > limit;

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex -space-x-2">
        {displayedPeople.map((person, i) => (
          <Avatar
            key={i}
            className="border-2 border-background h-8 w-8 md:h-10 md:w-10 transition-transform hover:scale-105 hover:z-10"
          >
            {person.image ? (
              <AvatarImage src={person.image} alt={person.name} />
            ) : null}
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white text-xs">
              {person.fallback}
            </AvatarFallback>
          </Avatar>
        ))}
        {shouldShowCount && (
          <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
            +{remainingCount}
          </div>
        )}
      </div>
    </div>
  );
} 