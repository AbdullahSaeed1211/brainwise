import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import Assessment from "@/lib/models/Assessment";
import db from "@/lib/mongodb";

export interface AssessmentQuery {
  userId: string;
  type?: string;
}

export const GET = withAuth(async (req: NextRequest, userId: string) => {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || undefined;
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    
    await db.connect();
    
    const query: AssessmentQuery = { userId };
    
    if (type) {
      query.type = type;
    }
    
    const assessments = await Assessment.find(query)
      .sort({ date: -1 })
      .limit(limit);
    
    return NextResponse.json({
      status: "success",
      data: assessments
    });
  } catch (error) {
    console.error("Error fetching assessments:", error);
    return NextResponse.json(
      { error: "Failed to fetch assessments" },
      { status: 500 }
    );
  }
}); 