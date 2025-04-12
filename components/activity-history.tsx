"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useActivityHistory } from "@/hooks/use-activity-history";
import { formatDistanceToNow } from "date-fns";
import { Brain, Clock, Target, ChevronDown, ChevronUp, Calculator, FileText, Activity, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function getActivityIcon(activityType: string, metadata: {
  gameType?: string;
  score?: number;
  difficulty?: string;
  assessmentType?: string;
  title?: string;
  sessionType?: string;
  gameResultId?: string;
  riskScore?: number;
  riskLevel?: string;
  [key: string]: unknown;
} | null | undefined) {
  const isValidMetadata = metadata && typeof metadata === 'object';
  const gameType = isValidMetadata && 'gameType' in metadata ? metadata.gameType : null;
  
  switch (activityType) {
    case "game-played":
      if (typeof gameType === 'string') {
        if (gameType.includes("memory")) return <Brain className="h-4 w-4" />;
        if (gameType.includes("reaction")) return <Clock className="h-4 w-4" />;
        if (gameType.includes("visual") || gameType.includes("attention")) return <Target className="h-4 w-4" />;
        if (gameType.includes("math")) return <Calculator className="h-4 w-4" />;
      }
      return <Brain className="h-4 w-4" />;
    case "assessment-completed":
      return <FileText className="h-4 w-4" />;
    case "stroke-risk-calculated":
      return <Activity className="h-4 w-4" />;
    case "stroke-prediction":
      return <Activity className="h-4 w-4" />;
    case "profile-updated":
      return <User className="h-4 w-4" />;
    default:
      return <Brain className="h-4 w-4" />;
  }
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "hard":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
}

function getRiskLevelColor(riskLevel: string) {
  switch (riskLevel.toLowerCase()) {
    case "low":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "moderate":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "high":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "very high":
      return "bg-red-200 text-red-900 dark:bg-red-800 dark:text-red-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
}

export function ActivityHistory() {
  const { activities, isLoading, error, pagination, changePage, getActivityLabel } = useActivityHistory();
  const [expanded, setExpanded] = useState(false);
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading activity history...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="pt-6 flex flex-col items-center text-center py-12">
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!activities.length) {
    return (
      <Card>
        <CardContent className="pt-6 flex flex-col items-center text-center py-12">
          <Clock className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Activity Yet</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            Complete cognitive activities to see your history here.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Limit to 5 unless expanded
  const displayActivities = expanded ? activities : activities.slice(0, 5);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest brain training activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
              <div className="bg-primary/10 p-2 rounded-full">
                {getActivityIcon(activity.activityType, activity.metadata)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium truncate">
                    {getActivityLabel(activity)}
                  </h4>
                  {activity.activityType === "game-played" && 
                   activity.metadata && 
                   typeof activity.metadata === 'object' && 
                   'difficulty' in activity.metadata && 
                   typeof activity.metadata.difficulty === 'string' && (
                    <div className={cn("px-2 py-1 rounded-md text-xs font-medium", getDifficultyColor(activity.metadata.difficulty))}>
                      {activity.metadata.difficulty}
                    </div>
                  )}
                  {(activity.activityType === "stroke-risk-calculated" || activity.activityType === "stroke-prediction") && 
                   activity.metadata && 
                   typeof activity.metadata === 'object' && 
                   'riskLevel' in activity.metadata && 
                   typeof activity.metadata.riskLevel === 'string' && (
                    <div className={cn("px-2 py-1 rounded-md text-xs font-medium", getRiskLevelColor(activity.metadata.riskLevel))}>
                      {activity.metadata.riskLevel}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.completedAt), { addSuffix: true })}
                  </p>
                  {activity.duration > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Duration: {activity.duration}s
                    </p>
                  )}
                  {(activity.activityType === "stroke-risk-calculated" || activity.activityType === "stroke-prediction") && 
                   activity.metadata && 
                   typeof activity.metadata === 'object' && 
                   'riskScore' in activity.metadata && 
                   typeof activity.metadata.riskScore === 'number' && (
                    <p className="text-xs text-muted-foreground">
                      Risk Score: {activity.metadata.riskScore}%
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {activities.length > 5 && !expanded && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-2"
              onClick={() => setExpanded(true)}
            >
              Show More 
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          )}
          
          {expanded && (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-2"
                onClick={() => setExpanded(false)}
              >
                Show Less
                <ChevronUp className="ml-2 h-4 w-4" />
              </Button>
              
              {pagination.pages > 1 && (
                <div className="flex justify-center mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            if (pagination.page > 1) {
                              changePage(pagination.page - 1);
                            }
                          }}
                          aria-disabled={pagination.page === 1}
                          className={pagination.page === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                        .filter(page => {
                          // Show first and last page, and 1 page before and after current page
                          return (
                            page === 1 || 
                            page === pagination.pages || 
                            Math.abs(page - pagination.page) <= 1
                          );
                        })
                        .map((page, i, array) => {
                          // If there's a gap in sequence, add ellipsis
                          const prevPage = array[i - 1];
                          const showEllipsisBefore = prevPage && page - prevPage > 1;
                          
                          return (
                            <React.Fragment key={page}>
                              {showEllipsisBefore && (
                                <PaginationItem>
                                  <span className="flex h-9 w-9 items-center justify-center">...</span>
                                </PaginationItem>
                              )}
                              <PaginationItem>
                                <PaginationLink 
                                  href="#" 
                                  isActive={page === pagination.page}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    changePage(page);
                                  }}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            </React.Fragment>
                          );
                        })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            if (pagination.page < pagination.pages) {
                              changePage(pagination.page + 1);
                            }
                          }}
                          aria-disabled={pagination.page === pagination.pages}
                          className={pagination.page === pagination.pages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 