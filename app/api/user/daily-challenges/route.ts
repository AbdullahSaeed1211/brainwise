import { NextRequest } from "next/server";
import mongoose from "mongoose";
import db from "@/lib/mongodb";
import {
  badRequestResponse,
  createdResponse,
  notFoundResponse,
  serverErrorResponse,
  successResponse,
  unauthorizedResponse,
} from "@/lib/api-utils";
import { auth } from "@clerk/nextjs/server";
import { addDays, startOfDay } from "date-fns";

// Helper to get the DailyChallenge models dynamically
const getChallengeModels = async () => {
  try {
    console.log('Ensuring MongoDB connection in getChallengeModels');
    await db.ensureConnection();
    
    // Import the models to ensure they're registered
    const { DailyChallenge, ChallengeCompletion } = await import("@/lib/models/DailyChallenge");
    
    return { DailyChallenge, ChallengeCompletion };
  } catch (error) {
    console.error("Error in getChallengeModels:", error);
    throw new Error("Failed to get challenge models");
  }
};

// Helper to get the User model dynamically
const getUserModel = async () => {
  try {
    console.log('Ensuring MongoDB connection in getUserModel');
    await db.ensureConnection();
    
    // Import the model to ensure it's registered
    const { default: UserModel } = await import("@/lib/models/User");
    return UserModel;
  } catch (error) {
    console.error("Error in getUserModel:", error);
    throw new Error("Failed to get user model");
  }
};

// GET /api/user/daily-challenges - Get current and upcoming challenges
export async function GET(req: NextRequest) {
  try {
    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const date = searchParams.get("date")
      ? new Date(searchParams.get("date") as string)
      : new Date();
    
    const daysParam = searchParams.get("days");
    const days = daysParam ? parseInt(daysParam, 10) : 1;
    
    // Maximum of 7 days to prevent abuse
    const limit = Math.min(Math.max(days, 1), 7);
    
    // Check if we need to get user-specific completion data
    const { userId } = await auth();
    let user;
    
    // Ensure database connection
    await db.ensureConnection();
    const { DailyChallenge, ChallengeCompletion } = await getChallengeModels();
    
    // Get start and end dates
    const startDate = startOfDay(date);
    const endDate = addDays(startDate, limit);
    
    // Get challenges for the requested date range
    const challenges = await DailyChallenge.find({
      date: { $gte: startDate, $lt: endDate },
      isActive: true
    }).sort({ date: 1 }).lean();
    
    // If user is logged in, check which challenges they've completed
    if (userId) {
      // Get the user
      const User = await getUserModel();
      user = await User.findOne({ clerkId: userId });
      
      if (user) {
        // Get completion status for challenges in this range
        const completions = await ChallengeCompletion.find({
          user: user._id,
          challengeDate: { $gte: startDate, $lt: endDate }
        }).lean();
        
        // Create a map of completed dates for quick lookup
        const completedMap = new Map(
          completions.map(c => [c.challengeDate.toISOString().split('T')[0], c])
        );
        
        // Add completion status to each challenge
        const challengesWithCompletion = challenges.map(challenge => {
          const dateKey = new Date(challenge.date).toISOString().split('T')[0];
          const isCompleted = completedMap.has(dateKey);
          const completion = completedMap.get(dateKey);
          
          return {
            ...challenge,
            isCompleted,
            completedAt: completion ? completion.completedAt : null,
            earnedPoints: completion ? completion.earnedPoints : null
          };
        });
        
        return successResponse(challengesWithCompletion);
      }
    }
    
    // Return challenges without completion status for anonymous users
    return successResponse(challenges);
  } catch (error) {
    console.error("Error fetching daily challenges:", error);
    return serverErrorResponse("Failed to fetch daily challenges");
  }
}

// POST /api/user/daily-challenges - Mark a challenge as completed
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return unauthorizedResponse("You must be logged in to complete challenges");
    }

    // Parse the request body
    const data = await req.json();
    
    // Validate required fields
    const requiredFields = ["challengeDate", "gameResultId"];
    for (const field of requiredFields) {
      if (!data[field]) {
        return badRequestResponse(`Missing required field: ${field}`);
      }
    }

    // Ensure database connection
    await db.ensureConnection();
    const User = await getUserModel();
    const { DailyChallenge, ChallengeCompletion } = await getChallengeModels();
    
    // Try to get GameResult model, create if it doesn't exist
    let GameResult;
    try {
      GameResult = mongoose.model('GameResult');
    } catch {
      // If GameResult model doesn't exist, we'll need to handle this gracefully
      console.warn('GameResult model not found - this feature may not work properly');
      GameResult = null;
    }

    // Find the user in the database
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return notFoundResponse("User not found");
    }

    // Find the game result if GameResult model exists
    let gameResult = null;
    if (GameResult) {
      gameResult = await GameResult.findById(data.gameResultId);
      if (!gameResult) {
        return notFoundResponse("Game result not found");
      }
    } else {
      // If GameResult model doesn't exist, we can still proceed without validation
      console.warn('Proceeding without GameResult validation');
    }

    // Find the associated challenge
    const challengeDate = new Date(data.challengeDate);
    const startOfRequestedDay = startOfDay(challengeDate);
    
    const challenge = await DailyChallenge.findOne({
      date: {
        $gte: startOfRequestedDay,
        $lt: addDays(startOfRequestedDay, 1)
      }
    });

    if (!challenge) {
      return notFoundResponse("No challenge found for the specified date");
    }

    // Check if user already completed this challenge
    const existingCompletion = await ChallengeCompletion.findOne({
      user: user._id,
      challengeDate: {
        $gte: startOfRequestedDay,
        $lt: addDays(startOfRequestedDay, 1)
      }
    });

    if (existingCompletion) {
      return badRequestResponse("Challenge already completed");
    }

    // Calculate earned points based on game result
    // Could add bonus points or adjustments based on performance
    const earnedPoints = challenge.points;

    // Create the challenge completion record
    const completion = await ChallengeCompletion.create({
      user: user._id,
      challengeDate: startOfRequestedDay,
      completedAt: new Date(),
      points: challenge.points,
      gameType: challenge.gameType,
      gameResultId: gameResult ? gameResult._id : null,
      earnedPoints
    });

    // Update user's total points or streak in user model if needed
    // This is a good place to add gamification features
    
    return createdResponse({
      completion,
      challenge: {
        title: challenge.title,
        description: challenge.description,
        gameType: challenge.gameType,
        difficulty: challenge.difficulty
      },
      earnedPoints
    });
  } catch (error) {
    console.error("Error completing challenge:", error);
    
    if (error instanceof mongoose.Error.ValidationError) {
      return badRequestResponse("Data validation error");
    }
    
    return serverErrorResponse("Failed to complete challenge");
  }
}

// PUT /api/user/daily-challenges/admin - Create or update a daily challenge (admin only)
export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return unauthorizedResponse("You must be logged in to manage challenges");
    }

    // Check if user is admin (in a real app, this would use proper role-based checks)
    const User = await getUserModel();
    const user = await User.findOne({ clerkId: userId });
    
    if (!user || !user.isAdmin) {
      return unauthorizedResponse("You must be an admin to manage challenges");
    }

    // Parse the request body
    const data = await req.json();
    
    // Validate required fields
    const requiredFields = ["date", "title", "description", "points", "gameType", "link", "difficulty"];
    for (const field of requiredFields) {
      if (!data[field]) {
        return badRequestResponse(`Missing required field: ${field}`);
      }
    }

    // Connect to the database
    await db.connect();
    const { DailyChallenge } = await getChallengeModels();

    // Find existing challenge for the date or create new one
    const existingChallenge = await DailyChallenge.findOne({
      date: { $eq: new Date(data.date) }
    });

    let challenge;
    if (existingChallenge) {
      // Update existing challenge
      challenge = await DailyChallenge.findByIdAndUpdate(
        existingChallenge._id,
        {
          title: data.title,
          description: data.description,
          points: data.points,
          gameType: data.gameType,
          link: data.link,
          difficulty: data.difficulty,
          isActive: data.isActive !== undefined ? data.isActive : true
        },
        { new: true }
      );
    } else {
      // Create new challenge
      challenge = await DailyChallenge.create({
        date: new Date(data.date),
        title: data.title,
        description: data.description,
        points: data.points,
        gameType: data.gameType,
        link: data.link,
        difficulty: data.difficulty,
        isActive: data.isActive !== undefined ? data.isActive : true
      });
    }

    return successResponse(challenge);
  } catch (error) {
    console.error("Error managing daily challenge:", error);
    
    if (error instanceof mongoose.Error.ValidationError) {
      return badRequestResponse("Data validation error");
    }
    
    return serverErrorResponse("Failed to manage daily challenge");
  }
} 