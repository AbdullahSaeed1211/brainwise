// Data models for our application

export interface GameResult {
  id: string;
  userId: string;
  gameType: string;
  score: number;
  level?: number;
  duration: number;
  difficulty?: string;
  accuracy?: number;
  completedAt: string;
  metrics?: Record<string, unknown>;
  tags?: string[];
}

export type CognitiveScore = {
  domain: string;
  score: number;
  change?: number;
  lastUpdated: string;
};

export type CognitiveScores = {
  overall: number;
  domains: CognitiveScore[];
};

export interface UserActivity {
  id: string;
  userId: string;
  activityType: string;
  completedAt: string;
  duration: number;
  metadata: Record<string, unknown>;
}

export interface UserAchievement {
  id: string;
  userId: string;
  title: string;
  description: string;
  unlockedAt: string | null;
  progress: number;
  requiredValue: number;
  icon: string;
}

export interface BrainHealthMetric {
  id: string;
  userId: string;
  score: number;
  date: string;
  domains: {
    memory: number;
    attention: number;
    processing: number;
    executive: number;
    language: number;
  }
}

export interface TrainingPlan {
  id: string;
  userId: string;
  focus: string[];
  weeklyActivities: {
    day: string;
    activities: {
      type: string;
      duration: number;
      difficulty: string;
    }[];
  }[];
  createdAt: string;
  updatedAt: string;
} 