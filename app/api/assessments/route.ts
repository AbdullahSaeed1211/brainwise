import { NextRequest } from "next/server";
import mongoose from "mongoose";
import db from "@/lib/mongodb";
import {
  badRequestResponse,
  notFoundResponse,
  serverErrorResponse,
  successResponse,
} from "@/lib/api-utils";
import { auth } from "@clerk/nextjs/server";

// Helper to get the Assessment model dynamically
const getAssessmentModel = async () => {
  try {
    console.log('Connecting to MongoDB in getAssessmentModel');
    await db.connect();
    try {
      return mongoose.model('Assessment');
    } catch (modelError: unknown) {
      console.log('Assessment model not found, importing it now', modelError instanceof Error ? modelError.message : '');
      const { default: AssessmentModel } = await import("@/lib/models/Assessment");
      return AssessmentModel;
    }
  } catch (error) {
    console.error("MongoDB connection error in getAssessmentModel:", error);
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

// GET /api/assessments - Get user's assessments
export async function GET(req: NextRequest) {
  try {
    // Authenticate user and protect route
    const session = await auth();
    if (!session.userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const userId = session.userId;
    
    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get("type");
    const limit = Number(searchParams.get("limit") || "10");
    const page = Number(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;
    
    // Connect to database
    await db.connect();
    const User = await getUserModel();
    const Assessment = await getAssessmentModel();
    
    // Find user from clerkId
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return notFoundResponse("User not found");
    }
    
    // Build query
    interface AssessmentQuery {
      user: mongoose.Types.ObjectId;
      type?: string;
    }
    
    const query: AssessmentQuery = { user: user._id };
    if (type) query.type = type;
    
    // Get assessments with pagination
    const assessments = await Assessment.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await Assessment.countDocuments(query);
    
    // Return success response with results and pagination info
    return successResponse({
      results: assessments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error getting assessments:", error);
    return serverErrorResponse("Failed to retrieve assessments");
  }
}

// POST /api/assessments - Create a new assessment
export async function POST(req: NextRequest) {
  try {
    // Authenticate user and protect route
    const session = await auth();
    if (!session.userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const userId = session.userId;
    
    // Get request body
    const body = await req.json();
    
    // Validate required fields
    if (!body.type || !body.result) {
      return badRequestResponse("Assessment type and result are required");
    }
    
    // Connect to database
    await db.connect();
    const User = await getUserModel();
    const Assessment = await getAssessmentModel();
    
    // Find user from clerkId
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return notFoundResponse("User not found");
    }
    
    // Create assessment
    const assessment = await Assessment.create({
      user: user._id,
      type: body.type,
      result: body.result,
      risk: body.risk || 'unknown',
      data: body.data || {},
      date: body.date ? new Date(body.date) : new Date()
    });
    
    // Return success response with created assessment
    return successResponse(assessment);
  } catch (error) {
    console.error("Error creating assessment:", error);
    return serverErrorResponse("Failed to create assessment");
  }
} 