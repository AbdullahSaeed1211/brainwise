import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import db from "@/lib/mongodb";
import { getCurrentUserId } from "@/lib/auth";

// GET /api/user/activity - Get the current user's activity history
export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    // Connect to MongoDB
    await db.connect();
    
    if (!mongoose.connection || !mongoose.connection.db) {
      throw new Error("Database connection not established");
    }
    
    // Extract query parameters for pagination
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    
    // Get total count of activities for this user
    const totalCount = await mongoose.connection.db.collection("activities")
      .countDocuments({ userId });
    
    // Get paginated activities
    const activities = await mongoose.connection.db.collection("activities")
      .find({ userId })
      .sort({ completedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    const totalPages = Math.ceil(totalCount / limit);
    
    return NextResponse.json({
      activities,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
      }
    });
  } catch (error) {
    console.error("Error fetching user activities:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to fetch activities" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    // Connect to MongoDB
    await db.connect();
    
    if (!mongoose.connection || !mongoose.connection.db) {
      throw new Error("Database connection not established");
    }
    
    const data = await request.json();
    
    if (!data.type || !data.name) {
      return new NextResponse(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    const activity = {
      userId,
      type: data.type,         // e.g., "assessment", "training", "article"
      name: data.name,         // e.g., "Memory Assessment", "Attention Training"
      details: data.details || {},
      completedAt: data.completedAt || new Date(),
      score: data.score,       // Optional score if applicable
      duration: data.duration, // Optional duration in seconds/minutes
      createdAt: new Date(),
    };
    
    const result = await mongoose.connection.db.collection("activities").insertOne(activity);
    
    return NextResponse.json({
      success: true,
      activityId: result.insertedId,
      activity
    });
  } catch (error) {
    console.error("Error creating activity:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to create activity" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
} 