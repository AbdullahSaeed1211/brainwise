import { NextRequest, NextResponse } from "next/server";
import { protectApiRoute, createErrorResponse } from "@/lib/auth";
import db from "@/lib/mongodb";
import Assessment from "@/lib/models/Assessment";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return protectApiRoute(async (userId) => {
    try {
      // Get params
      const resolvedParams = await params;
      const assessmentId = resolvedParams.id;
      
      if (!assessmentId) {
        return createErrorResponse("Assessment ID is required", 400);
      }
      
      await db.connect();
      
      const assessment = await Assessment.findById(assessmentId);
      
      if (!assessment) {
        return createErrorResponse("Assessment not found", 404);
      }
      
      // Verify ownership
      if (assessment.userId !== userId) {
        return createErrorResponse("Unauthorized", 403);
      }
      
      // Return the current status
      return NextResponse.json({
        status: assessment.data.status || "unknown",
        result: assessment.data.status === "completed" ? assessment.data.result : null
      });
      
    } catch (error) {
      console.error("Error retrieving brain scan status:", error);
      return createErrorResponse("Failed to retrieve scan status", 500);
    }
  });
} 