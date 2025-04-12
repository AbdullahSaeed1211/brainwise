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
import { auth, currentUser } from "@clerk/nextjs/server";

// Helper to get the GameResult model dynamically
const getGameResultModel = async () => {
  try {
    console.log('Connecting to MongoDB in getGameResultModel');
    await db.connect();
    try {
      return mongoose.model('GameResult');
    } catch (modelError: unknown) {
      if (modelError instanceof Error) {
        console.log('GameResult model not found, importing it now', modelError.message);
      }
      // If model doesn't exist yet, this will import it
      const { default: GameResultModel } = await import("@/lib/models/GameResult");
      return GameResultModel;
    }
  } catch (error) {
    console.error("MongoDB connection error in getGameResultModel:", error);
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
      if (modelError instanceof Error) {
        console.log('User model not found, importing it now', modelError.message);
      }
      // If model doesn't exist yet, this will import it
      const { default: UserModel } = await import("@/lib/models/User");
      return UserModel;
    }
  } catch (error) {
    console.error("MongoDB connection error in getUserModel:", error);
    throw new Error("Database connection failed");
  }
};

// Helper to get the Activity model dynamically
const getActivityModel = async () => {
  try {
    console.log('Connecting to MongoDB in getActivityModel');
    await db.connect();
    try {
      return mongoose.model('Activity');
    } catch (modelError: unknown) {
      if (modelError instanceof Error) {
        console.log('Activity model not found, importing it now', modelError.message);
      }
      // If model doesn't exist yet, this will import it
      const { default: ActivityModel } = await import("@/lib/models/Activity");
      return ActivityModel;
    }
  } catch (error) {
    console.error("MongoDB connection error in getActivityModel:", error);
    throw new Error("Database connection failed");
  }
};

// Define type for query object
interface GameResultQuery {
  user: mongoose.Types.ObjectId;
  gameType?: string;
  difficulty?: string;
}

// GET /api/user/game-results - Get the current user's game results
export async function GET(req: NextRequest) {
  console.log('GET /api/user/game-results - Request received');
  
  try {
    const { userId } = await auth();
    console.log('Current user ID:', userId);
    
    if (!userId) {
      console.log('No user ID found, returning unauthorized response');
      return unauthorizedResponse("You must be logged in to access your game results");
    }

    // Connect to the database
    try {
      console.log('Connecting to database');
      await db.connect();
      console.log('Database connection successful');
    } catch (dbError) {
      console.error("Database connection failed:", dbError);
      return serverErrorResponse("Database connection failed. Please try again later.");
    }

    let User, GameResult;
    try {
      console.log('Loading User and GameResult models');
      User = await getUserModel();
      GameResult = await getGameResultModel();
      console.log('Models loaded successfully');
    } catch (modelError) {
      console.error("Error loading database models:", modelError);
      return serverErrorResponse("Error initializing database models. Please try again later.");
    }

    // Find the user in the database
    let user;
    try {
      console.log('Finding user with clerkId:', userId);
      user = await User.findOne({ clerkId: userId });
      if (!user) {
        console.log('User not found in database');
        
        // Instead of creating a temporary user, try to create a real user record
        try {
          // Get information from Clerk
          const userInfo = await currentUser();
          
          if (!userInfo) {
            return notFoundResponse("User not found in authentication system");
          }
          
          // Create a proper user record
          console.log('Creating new user record in database');
          user = await User.create({
            clerkId: userId,
            email: userInfo.emailAddresses[0]?.emailAddress,
            name: `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim() || 'User',
            firstName: userInfo.firstName || '',
            lastName: userInfo.lastName || '',
            imageUrl: userInfo.imageUrl,
            onboardingCompleted: false,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          
          console.log('New user created with ID:', user._id);
        } catch (createError) {
          console.error("Error creating user:", createError);
          return serverErrorResponse("Failed to create user record. Please try again later.");
        }
      } else {
        console.log('User found with ID:', user._id);
      }
    } catch (userError) {
      console.error("Error finding user:", userError);
      return serverErrorResponse("Error retrieving user data. Please try again later.");
    }

    // Parse query parameters
    const searchParams = req.nextUrl.searchParams;
    const gameType = searchParams.get("gameType");
    const difficulty = searchParams.get("difficulty");
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const skip = (page - 1) * limit;

    console.log('Query parameters:', { gameType, difficulty, limit, page, skip });

    // Build query with proper typing
    const query: GameResultQuery = { user: user._id };
    if (gameType) query.gameType = gameType;
    if (difficulty) query.difficulty = difficulty;

    console.log('MongoDB query:', JSON.stringify(query));

    // Get total count for pagination
    let total, results;
    try {
      console.log('Counting documents matching query');
      total = await GameResult.countDocuments(query);
      console.log('Total matching documents:', total);

      // Get results with pagination
      console.log('Fetching results with pagination');
      results = await GameResult.find(query)
        .sort({ completedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
      
      console.log(`Found ${results.length} results`);
    } catch (queryError) {
      console.error("Error querying game results:", queryError);
      if (queryError instanceof mongoose.Error.CastError) {
        return serverErrorResponse("Invalid query parameters");
      }
      return serverErrorResponse("Error retrieving game results. Please try again later.");
    }

    const response = {
      results,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
    
    console.log('Returning success response with results');
    return successResponse(response);
  } catch (error) {
    console.error("Error getting game results:", error);
    
    // Provide more specific error messages for common errors
    if (error instanceof mongoose.Error.ValidationError) {
      return serverErrorResponse("Data validation error");
    } else if (error instanceof mongoose.Error.DocumentNotFoundError) {
      return notFoundResponse("Requested data not found");
    } else if (error instanceof mongoose.Error.CastError) {
      return serverErrorResponse("Invalid data format");
    }
    
    return serverErrorResponse("Failed to fetch game results");
  }
}

// POST /api/user/game-results - Create a new game result
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return unauthorizedResponse("You must be logged in to save game results");
    }

    // Parse the request body
    const data = await req.json();
    
    // Validate required fields
    const requiredFields = ["gameType", "score", "difficulty"];
    for (const field of requiredFields) {
      if (!data[field]) {
        return badRequestResponse(`Missing required field: ${field}`);
      }
    }

    // Connect to the database
    await db.connect();
    const User = await getUserModel();
    const GameResult = await getGameResultModel();
    const Activity = await getActivityModel();

    // Find the user in the database
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return notFoundResponse("User not found");
    }

    // Create the game result
    const gameResult = await GameResult.create({
      user: user._id,
      gameType: data.gameType,
      score: data.score,
      difficulty: data.difficulty,
      timeSpent: data.timeSpent || 0,
      movesOrAttempts: data.movesOrAttempts || 0,
      completedAt: data.completedAt || new Date(),
      cognitiveDomainsAffected: data.cognitiveDomainsAffected || [],
    });

    // Log activity
    try {
      await Activity.create({
        user: user._id,
        activityType: "game-played",
        completedAt: gameResult.completedAt,
        duration: data.timeSpent ? Math.round(data.timeSpent / 1000) : 0, // Convert ms to seconds
        metadata: {
          gameType: data.gameType,
          score: data.score,
          difficulty: data.difficulty,
          gameResultId: gameResult._id
        }
      });
      console.log(`Activity logged for user ${user._id} playing ${data.gameType}`);
    } catch (activityError) {
      // Don't fail the whole request if activity logging fails
      console.error("Error logging activity:", activityError);
    }

    return createdResponse(gameResult);
  } catch (error) {
    console.error("Error creating game result:", error);
    
    if (error instanceof mongoose.Error.ValidationError) {
      return badRequestResponse("Data validation error");
    }
    
    return serverErrorResponse("Failed to save game result");
  }
} 