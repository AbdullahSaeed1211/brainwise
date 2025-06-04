import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import db from "@/lib/mongodb";
import mongoose from "mongoose";

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
    
    // Extract query parameters for pagination
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    
    // Get total count of activities for this user
    if (!mongoose.connection.db) {
      throw new Error("Database connection not established");
    }
    
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