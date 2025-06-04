"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

interface ActivityHistoryItem {
  id: string;
  activityType: string;
  completedAt: string;
  duration: number;
  metadata: {
    gameType?: string;
    score?: number;
    difficulty?: string;
    assessmentType?: string;
    title?: string;
    sessionType?: string;
    gameResultId?: string;
    [key: string]: unknown;
  };
}

interface PaginatedResponse {
  activities: Record<string, ActivityHistoryItem[]>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export function useActivityHistory() {
  const { isLoaded, isSignedIn } = useAuth();
  const [activities, setActivities] = useState<ActivityHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });

  // Fetch activities with pagination
  const fetchActivities = async (page = 1, limit = 10) => {
    if (!isLoaded || !isSignedIn) {
      setActivities([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/user/activity?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include credentials for auth
      });

      if (!response.ok) {
        throw new Error(`Error fetching activities: ${response.status}`);
      }

      const data: PaginatedResponse = await response.json();
      
      // Process the grouped activities into a flat array
      const flattenedActivities = Object.entries(data.activities)
        .flatMap(([date, dayActivities]) => dayActivities)
        .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
      
      // Set activities and pagination
      setActivities(flattenedActivities);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Error fetching activity history:', err);
      setError('Failed to load activity history. Please try again later.');
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch activities on component mount
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchActivities();
    } else if (isLoaded && !isSignedIn) {
      setActivities([]);
      setIsLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  // Change page
  const changePage = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      fetchActivities(newPage, pagination.limit);
    }
  };

  // Get activity label
  const getActivityLabel = (activity: ActivityHistoryItem): string => {
    const date = new Date(activity.completedAt).toLocaleDateString();
    
    switch (activity.activityType) {
      case 'game-played':
        const gameType = activity.metadata.gameType || 'Unknown game';
        const score = activity.metadata.score !== undefined ? activity.metadata.score : 'N/A';
        return `Played ${formatGameType(gameType)} - Score: ${score} (${date})`;
      
      case 'assessment-completed':
        return `Completed assessment: ${activity.metadata.assessmentType || 'Unknown assessment'} (${date})`;
      
      case 'article-read':
        return `Read article: ${activity.metadata.title || 'Unknown article'} (${date})`;
      
      case 'stroke-risk-calculated':
        return `Calculated stroke risk assessment (${date})`;
      
      case 'training-session':
        return `Completed training session: ${activity.metadata.sessionType || 'Unknown session'} (${date})`;
      
      case 'profile-updated':
        return `Updated profile (${date})`;
      
      default:
        return `${activity.activityType} (${date})`;
    }
  };

  // Format game type for display
  const formatGameType = (gameType: string): string => {
    // Convert kebab-case to title case
    return gameType
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .replace(' Test', ''); // Remove " Test" suffix if present
  };

  return {
    activities,
    isLoading,
    error,
    pagination,
    fetchActivities,
    changePage,
    getActivityLabel,
  };
} 