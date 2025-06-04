import { NextRequest } from "next/server";
import mongoose from "mongoose";
import db from "@/lib/mongodb";
import { getCurrentUserId } from "@/lib/auth";
import {
  badRequestResponse,
  createdResponse,
  notFoundResponse,
  serverErrorResponse,
  successResponse,
  unauthorizedResponse,
} from "@/lib/api-utils";

// Import the interface for type safety
import { ICognitiveScore } from "@/lib/models/CognitiveScore";

// Helper to get the CognitiveScore model dynamically
const getCognitiveScoreModel = async () => {
  await db.connect();
  try {
    return mongoose.model('CognitiveScore');
  } catch {
    // If model doesn't exist yet, this will import it
    const { default: CognitiveScoreModel } = await import("@/lib/models/CognitiveScore");
    return CognitiveScoreModel;
  }
};

// Helper to get the User model dynamically
const getUserModel = async () => {
  await db.connect();
  try {
    return mongoose.model('User');
  } catch {
    // If model doesn't exist yet, this will import it
    const { default: UserModel } = await import("@/lib/models/User");
    return UserModel;
  }
};

// Define type for query object
interface CognitiveScoreQuery {
  user: mongoose.Types.ObjectId;
  domain?: string;
}

// GET /api/user/cognitive-scores - Get the current user's cognitive scores
export async function GET(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return unauthorizedResponse("You must be logged in to access your cognitive scores");
    }

    // Connect to the database
    await db.connect();
    const User = await getUserModel();
    const CognitiveScore = await getCognitiveScoreModel();

    // Find the user in the database
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return notFoundResponse("User not found");
    }

    // Parse query parameters
    const searchParams = req.nextUrl.searchParams;
    const domain = searchParams.get("domain");
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const skip = (page - 1) * limit;

    // Build query
    const query: CognitiveScoreQuery = { user: user._id };
    if (domain) query.domain = domain;

    // Get results with pagination
    const results = await CognitiveScore.find(query)
      .sort({ assessmentDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await CognitiveScore.countDocuments(query);

    return successResponse({
      results,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error getting cognitive scores:", error);
    return serverErrorResponse("Failed to fetch cognitive scores");
  }
}

// POST /api/user/cognitive-scores - Create a new cognitive score
export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return unauthorizedResponse("You must be logged in to save cognitive scores");
    }

    // Parse the request body
    const data = await req.json();
    
    // Validate required fields
    const requiredFields = ["domain", "score", "source"];
    for (const field of requiredFields) {
      if (!data[field]) {
        return badRequestResponse(`Missing required field: ${field}`);
      }
    }

    // Connect to the database
    await db.connect();
    const User = await getUserModel();
    const CognitiveScore = await getCognitiveScoreModel();

    // Find the user in the database
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return notFoundResponse("User not found");
    }

    // Get the previous score for this domain, if any
    const previousScore = await CognitiveScore.findOne({
      user: user._id,
      domain: data.domain,
    }).sort({ assessmentDate: -1 }).lean() as ICognitiveScore | null;

    // Create the cognitive score
    const cognitiveScore = await CognitiveScore.create({
      user: user._id,
      domain: data.domain,
      score: data.score,
      previousScore: previousScore?.score || null,
      assessmentDate: data.assessmentDate || new Date(),
      source: data.source,
      notes: data.notes,
    });

    // Create an activity record for this cognitive score
    try {
      // Get the Activity model
      const Activity = mongoose.models.Activity || 
        (await import("@/lib/models/Activity")).default;
      
      await Activity.create({
        user: user._id,
        activityType: 'COGNITIVE_ASSESSMENT',
        completedAt: data.assessmentDate || new Date(),
        duration: data.duration || 0,
        metadata: {
          domain: data.domain,
          score: data.score,
          source: data.source,
          cognitiveScoreId: cognitiveScore._id
        }
      });
    } catch (activityError) {
      console.error("Error creating activity record:", activityError);
      // Continue even if activity creation fails
    }

    return createdResponse(cognitiveScore, "Cognitive score saved successfully");
  } catch (error) {
    console.error("Error saving cognitive score:", error);
    return serverErrorResponse("Failed to save cognitive score");
  }
} 