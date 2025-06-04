import { NextRequest } from "next/server";
import mongoose from "mongoose";
import db from "@/lib/mongodb";
import {
  notFoundResponse,
  serverErrorResponse,
  successResponse,
  unauthorizedResponse,
} from "@/lib/api-utils";
import { auth } from "@clerk/nextjs/server";
import { addDays, format, parseISO, startOfDay, subDays } from "date-fns";

// Define interfaces for the different game results
interface BaseGameResult {
  _id: string;
  user: string;
  score: number;
  createdAt: Date;
}

interface MemoryGameResult extends BaseGameResult {
  totalTimeMs: number;
  mistakes: number;
}

interface VisualAttentionResult extends BaseGameResult {
  accuracy: number;
  averageReactionTimeMs: number;
}

interface PatternRecognitionResult extends BaseGameResult {
  correctPatterns: number;
  missedPatterns: number;
}

interface VerbalFluencyResult extends BaseGameResult {
  validWordsCount: number;
  uniqueCategories: number;
}

interface CognitiveScore {
  _id: string;
  user: string;
  domain: string;
  score: number;
  previousScore: number | null;
  assessmentDate: Date;
}

// Helper to get cognitive scores model
const getCognitiveScoreModel = async () => {
  try {
    console.log('Connecting to MongoDB for CognitiveScore');
    await db.connect();
    try {
      return mongoose.model('CognitiveScore');
    } catch (modelError: unknown) {
      console.log('CognitiveScore model not found, importing it now', modelError instanceof Error ? modelError.message : '');
      const { default: CognitiveScoreModel } = await import("@/lib/models/CognitiveScore");
      return CognitiveScoreModel;
    }
  } catch (error) {
    console.error("MongoDB connection error in getCognitiveScoreModel:", error);
    throw new Error("Database connection failed");
  }
};

// Helper to get game results models
const getGameResultModels = async () => {
  try {
    console.log('Connecting to MongoDB for game results');
    await db.connect();
    
    // Define a type for the mongoose models with their corresponding interfaces
    type GameModels = {
      memoryGame: mongoose.Model<IMemoryGameResult>;
      visualAttention: mongoose.Model<IVisualAttentionResult>;
      patternRecognition: mongoose.Model<IPatternRecognitionResult>;
      verbalFluency: mongoose.Model<IVerbalFluencyResult>;
    };
    
    // Import all the interfaces
    interface IMemoryGameResult extends mongoose.Document {
      user: mongoose.Types.ObjectId;
      score: number;
      totalTimeMs: number;
      mistakes: number;
    }
    
    interface IVisualAttentionResult extends mongoose.Document {
      user: mongoose.Types.ObjectId;
      score: number;
      accuracy: number;
      averageReactionTimeMs: number;
    }
    
    interface IPatternRecognitionResult extends mongoose.Document {
      user: mongoose.Types.ObjectId;
      score: number;
      correctPatterns: number;
      missedPatterns: number;
    }
    
    interface IVerbalFluencyResult extends mongoose.Document {
      user: mongoose.Types.ObjectId;
      score: number;
      validWordsCount: number;
      uniqueCategories: number;
    }
    
    const models = {} as GameModels;
    
    try {
      models.memoryGame = mongoose.model<IMemoryGameResult>('MemoryGameResult');
    } catch {
      const { default: MemoryGameModel } = await import("@/lib/models/games/MemoryGameResult");
      models.memoryGame = MemoryGameModel as unknown as mongoose.Model<IMemoryGameResult>;
    }
    
    try {
      models.visualAttention = mongoose.model<IVisualAttentionResult>('VisualAttentionResult');
    } catch {
      const { default: VisualAttentionModel } = await import("@/lib/models/games/VisualAttentionResult");
      models.visualAttention = VisualAttentionModel as unknown as mongoose.Model<IVisualAttentionResult>;
    }
    
    try {
      models.patternRecognition = mongoose.model<IPatternRecognitionResult>('PatternRecognitionResult');
    } catch {
      const { default: PatternRecognitionModel } = await import("@/lib/models/games/PatternRecognitionResult");
      models.patternRecognition = PatternRecognitionModel as unknown as mongoose.Model<IPatternRecognitionResult>;
    }
    
    try {
      models.verbalFluency = mongoose.model<IVerbalFluencyResult>('VerbalFluencyResult');
    } catch {
      const { default: VerbalFluencyModel } = await import("@/lib/models/games/VerbalFluencyResult");
      models.verbalFluency = VerbalFluencyModel as unknown as mongoose.Model<IVerbalFluencyResult>;
    }
    
    return models;
  } catch (error) {
    console.error("MongoDB connection error in getGameResultModels:", error);
    throw new Error("Database connection failed");
  }
};

// Helper to get the User model dynamically
const getUserModel = async () => {
  try {
    console.log('Connecting to MongoDB in getUserModel');
    await db.connect();
    try {
      return mongoose.model('User');
    } catch (modelError: unknown) {
      console.log('User model not found, importing it now', modelError instanceof Error ? modelError.message : '');
      const { default: UserModel } = await import("@/lib/models/User");
      return UserModel;
    }
  } catch (error) {
    console.error("MongoDB connection error in getUserModel:", error);
    throw new Error("Database connection failed");
  }
};

// GET /api/assessments/report - Get user's cognitive assessment report
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return unauthorizedResponse("You must be logged in to access your assessment report");
    }

    // Get query parameters for date range
    const searchParams = req.nextUrl.searchParams;
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    
    // Default to last 90 days if not specified
    const startDate = startDateParam 
      ? startOfDay(parseISO(startDateParam))
      : startOfDay(subDays(new Date(), 90));
      
    const endDate = endDateParam
      ? startOfDay(addDays(parseISO(endDateParam), 1)) // Add 1 day to include the end date
      : startOfDay(addDays(new Date(), 1)); // Include today
    
    // Connect to the database
    await db.connect();
    const User = await getUserModel();
    const CognitiveScore = await getCognitiveScoreModel();
    const gameModels = await getGameResultModels();

    // Find the user
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return notFoundResponse("User not found");
    }

    // Get the user's cognitive scores within the date range
    const cognitiveScores = await CognitiveScore.find({
      user: user._id,
      assessmentDate: { $gte: startDate, $lt: endDate }
    }).sort({ assessmentDate: 1 }).lean() as unknown as CognitiveScore[];

    console.log(`Found ${cognitiveScores.length} cognitive scores for user ${user._id}`);

    // Get the latest cognitive scores for each domain
    const latestScores: Record<string, CognitiveScore> = {};
    const scoresByDomain: Record<string, CognitiveScore[]> = {};
    
    cognitiveScores.forEach(score => {
      // Store latest score by domain
      if (!latestScores[score.domain] || new Date(score.assessmentDate) > new Date(latestScores[score.domain].assessmentDate)) {
        latestScores[score.domain] = score;
      }
      
      // Group scores by domain for trend analysis
      if (!scoresByDomain[score.domain]) {
        scoresByDomain[score.domain] = [];
      }
      scoresByDomain[score.domain].push(score);
    });

    // Calculate domain health and improvement
    const domainHealth = {} as Record<string, { 
      score: number;
      previousScore: number | null;
      improvement: number | null;
      trend: 'improving' | 'declining' | 'stable' | 'insufficient-data';
      lastUpdated: string;
    }>;
    
    Object.keys(latestScores).forEach(domain => {
      const latest = latestScores[domain];
      const scores = scoresByDomain[domain];
      
      // Calculate trend
      let trend: 'improving' | 'declining' | 'stable' | 'insufficient-data' = 'insufficient-data';
      
      if (scores.length >= 3) {
        // Get average change over last 3 assessments
        const recentScores = scores.slice(-3);
        let totalChange = 0;
        
        for (let i = 1; i < recentScores.length; i++) {
          totalChange += recentScores[i].score - recentScores[i-1].score;
        }
        
        const avgChange = totalChange / (recentScores.length - 1);
        
        if (avgChange > 3) trend = 'improving';
        else if (avgChange < -3) trend = 'declining';
        else trend = 'stable';
      }
      
      domainHealth[domain] = {
        score: latest.score,
        previousScore: latest.previousScore,
        improvement: latest.previousScore ? latest.score - latest.previousScore : null,
        trend,
        lastUpdated: format(new Date(latest.assessmentDate), 'yyyy-MM-dd')
      };
    });

    // Get recent game results for detailed analysis
    const gameResults = {} as {
      memory: MemoryGameResult[];
      attention: VisualAttentionResult[];
      executiveFunction: PatternRecognitionResult[];
      language: VerbalFluencyResult[];
    };
    
    // Memory Game
    const memoryResults = await gameModels.memoryGame.find({
      user: user._id,
      createdAt: { $gte: startDate, $lt: endDate }
    }).sort({ createdAt: -1 }).limit(10).lean() as unknown as MemoryGameResult[];
    gameResults.memory = memoryResults;
    
    // Visual Attention
    const visualAttentionResults = await gameModels.visualAttention.find({
      user: user._id,
      createdAt: { $gte: startDate, $lt: endDate }
    }).sort({ createdAt: -1 }).limit(10).lean() as unknown as VisualAttentionResult[];
    gameResults.attention = visualAttentionResults;
    
    // Pattern Recognition
    const patternResults = await gameModels.patternRecognition.find({
      user: user._id,
      createdAt: { $gte: startDate, $lt: endDate }
    }).sort({ createdAt: -1 }).limit(10).lean() as unknown as PatternRecognitionResult[];
    gameResults.executiveFunction = patternResults;
    
    // Verbal Fluency
    const verbalResults = await gameModels.verbalFluency.find({
      user: user._id,
      createdAt: { $gte: startDate, $lt: endDate }
    }).sort({ createdAt: -1 }).limit(10).lean() as unknown as VerbalFluencyResult[];
    gameResults.language = verbalResults;

    // Extract insights from game results
    const insights = {} as Record<string, { 
      strengths: string[];
      weaknesses: string[];
      recommendations: string[];
    }>;
    
    // Memory insights
    if (memoryResults.length > 0) {
      const strengths: string[] = [];
      const weaknesses: string[] = [];
      const recommendations: string[] = [];
      
      // Calculate averages
      const avgScore = memoryResults.reduce((sum, result) => sum + result.score, 0) / memoryResults.length;
      const avgTime = memoryResults.reduce((sum, result) => sum + result.totalTimeMs, 0) / memoryResults.length;
      const avgMistakes = memoryResults.reduce((sum, result) => sum + result.mistakes, 0) / memoryResults.length;
      
      if (avgScore > 85) strengths.push("Strong short-term memory capacity");
      if (avgMistakes < 2) strengths.push("Excellent memory recall accuracy");
      if (avgTime < 30000) strengths.push("Quick memory retrieval");
      
      if (avgScore < 70) weaknesses.push("Difficulty with short-term memory retention");
      if (avgMistakes > 5) weaknesses.push("Frequent memory recall errors");
      if (avgTime > 60000) weaknesses.push("Slow memory retrieval speed");
      
      recommendations.push("Practice memory games regularly");
      if (avgMistakes > 3) recommendations.push("Focus on accuracy over speed");
      if (avgTime > 45000) recommendations.push("Work on quicker memory recall with timed exercises");
      
      insights.memory = { strengths, weaknesses, recommendations };
    }
    
    // Attention insights
    if (visualAttentionResults.length > 0) {
      const strengths: string[] = [];
      const weaknesses: string[] = [];
      const recommendations: string[] = [];
      
      const avgScore = visualAttentionResults.reduce((sum, result) => sum + result.score, 0) / visualAttentionResults.length;
      const avgAccuracy = visualAttentionResults.reduce((sum, result) => sum + result.accuracy, 0) / visualAttentionResults.length;
      const avgReactionTime = visualAttentionResults.reduce((sum, result) => sum + result.averageReactionTimeMs, 0) / visualAttentionResults.length;
      
      if (avgScore > 85) strengths.push("Strong sustained attention");
      if (avgAccuracy > 90) strengths.push("High visual attention accuracy");
      if (avgReactionTime < 500) strengths.push("Quick reaction time");
      
      if (avgScore < 70) weaknesses.push("Difficulty maintaining attention");
      if (avgAccuracy < 75) weaknesses.push("Inconsistent visual attention");
      if (avgReactionTime > 800) weaknesses.push("Delayed reaction time");
      
      recommendations.push("Practice focused attention exercises daily");
      if (avgAccuracy < 85) recommendations.push("Work on visual scanning techniques");
      if (avgReactionTime > 650) recommendations.push("Try quick-response exercises to improve processing speed");
      
      insights.attention = { strengths, weaknesses, recommendations };
    }
    
    // Executive function insights
    if (patternResults.length > 0) {
      const strengths: string[] = [];
      const weaknesses: string[] = [];
      const recommendations: string[] = [];
      
      const avgScore = patternResults.reduce((sum, result) => sum + result.score, 0) / patternResults.length;
      const avgCorrect = patternResults.reduce((sum, result) => sum + result.correctPatterns, 0) / patternResults.length;
      const avgMissed = patternResults.reduce((sum, result) => sum + result.missedPatterns, 0) / patternResults.length;
      
      if (avgScore > 85) strengths.push("Strong pattern recognition abilities");
      if (avgCorrect > 8) strengths.push("Excellent logical reasoning");
      if (avgMissed < 2) strengths.push("Good analytical thinking");
      
      if (avgScore < 70) weaknesses.push("Difficulty identifying patterns");
      if (avgCorrect < 5) weaknesses.push("Challenges with logical reasoning");
      if (avgMissed > 5) weaknesses.push("Struggles with complex patterns");
      
      recommendations.push("Engage in daily pattern recognition puzzles");
      if (avgCorrect < 7) recommendations.push("Practice sequence completion exercises");
      if (avgMissed > 3) recommendations.push("Work with progressive complexity in pattern exercises");
      
      insights.executiveFunction = { strengths, weaknesses, recommendations };
    }
    
    // Language insights
    if (verbalResults.length > 0) {
      const strengths: string[] = [];
      const weaknesses: string[] = [];
      const recommendations: string[] = [];
      
      const avgScore = verbalResults.reduce((sum, result) => sum + result.score, 0) / verbalResults.length;
      const avgWords = verbalResults.reduce((sum, result) => sum + result.validWordsCount, 0) / verbalResults.length;
      const avgUnique = verbalResults.reduce((sum, result) => sum + result.uniqueCategories, 0) / verbalResults.length;
      
      if (avgScore > 85) strengths.push("Strong verbal fluency");
      if (avgWords > 15) strengths.push("Extensive vocabulary");
      if (avgUnique > 4) strengths.push("Good categorical thinking");
      
      if (avgScore < 70) weaknesses.push("Limited verbal fluency");
      if (avgWords < 10) weaknesses.push("Restricted vocabulary access");
      if (avgUnique < 3) weaknesses.push("Difficulty with word categories");
      
      recommendations.push("Practice word association games regularly");
      if (avgWords < 12) recommendations.push("Expand vocabulary through reading diverse materials");
      if (avgUnique < 4) recommendations.push("Practice grouping words by categories");
      
      insights.language = { strengths, weaknesses, recommendations };
    }

    // Calculate overall brain health score
    let overallScore = 0;
    let domainCount = 0;
    
    Object.keys(domainHealth).forEach(domain => {
      overallScore += domainHealth[domain].score;
      domainCount++;
    });
    
    const brainHealthScore = domainCount > 0 ? Math.round(overallScore / domainCount) : null;
    
    // Generate recommendations based on overall assessment
    const overallRecommendations: string[] = [];
    
    if (brainHealthScore !== null) {
      // Basic recommendations for everyone
      overallRecommendations.push("Maintain a regular sleep schedule of 7-9 hours per night");
      overallRecommendations.push("Engage in regular physical exercise, aiming for 150 minutes per week");
      overallRecommendations.push("Follow a balanced diet rich in omega-3 fatty acids, antioxidants, and vitamins");
      
      // Score-based recommendations
      if (brainHealthScore < 70) {
        overallRecommendations.push("Consider comprehensive cognitive training across all domains");
        overallRecommendations.push("Consult with a healthcare professional for personalized strategies");
      } else if (brainHealthScore < 85) {
        overallRecommendations.push("Focus on specific domains with lower scores");
        overallRecommendations.push("Try daily brain training exercises to maintain cognitive function");
      } else {
        overallRecommendations.push("Continue with current brain health practices");
        overallRecommendations.push("Challenge yourself with progressively difficult cognitive exercises");
      }
    }
    
    // Prepare response object
    const report = {
      brainHealthScore,
      domainHealth,
      insights,
      overallRecommendations,
      scoreHistory: scoresByDomain,
      dateRange: {
        start: format(startDate, 'yyyy-MM-dd'),
        end: format(subDays(endDate, 1), 'yyyy-MM-dd')
      }
    };
    
    return successResponse(report);
  } catch (error) {
    console.error("Error generating assessment report:", error);
    return serverErrorResponse("Failed to generate assessment report");
  }
} 