import { NextRequest, NextResponse } from "next/server";
import { withAuth, createErrorResponse } from "@/lib/auth.mock";

// Define the Assessment Result interface
interface AssessmentResult {
  id: string;
  userId: string;
  assessmentType: string;
  date: Date;
  scores: {
    domain: string;
    score: number;
  }[];
  totalScore: number;
  duration: number; // in seconds
  createdAt: Date;
}

// Mock database for development
const assessmentResults: AssessmentResult[] = [];

// Get assessment results for the authenticated user
export const GET = withAuth(async (request: NextRequest, userId: string) => {
  try {
    const url = new URL(request.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const assessmentType = url.searchParams.get("type");
    
    // Filter by userId and optional parameters
    let userResults = assessmentResults.filter(result => result.userId === userId);
    
    if (startDate) {
      const start = new Date(startDate);
      userResults = userResults.filter(result => result.date >= start);
    }
    
    if (endDate) {
      const end = new Date(endDate);
      userResults = userResults.filter(result => result.date <= end);
    }
    
    if (assessmentType) {
      userResults = userResults.filter(result => result.assessmentType === assessmentType);
    }
    
    // Sort by date (most recent first)
    userResults.sort((a, b) => b.date.getTime() - a.date.getTime());
    
    return NextResponse.json({ results: userResults });
  } catch (error) {
    console.error("Error fetching assessment results:", error);
    return createErrorResponse("Internal server error", 500);
  }
});

// Save a new assessment result for the authenticated user
export const POST = withAuth(async (request: NextRequest, userId: string) => {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.assessmentType || !body.scores || !Array.isArray(body.scores)) {
      return createErrorResponse("Missing required fields: assessmentType, scores", 400);
    }
    
    // Calculate total score
    const totalScore = body.scores.reduce((total: number, score: { domain: string; score: number }) => total + score.score, 0);
    
    const newResult: AssessmentResult = {
      id: Date.now().toString(), // Use a proper ID generator in production
      userId,
      assessmentType: body.assessmentType,
      date: new Date(),
      scores: body.scores,
      totalScore,
      duration: body.duration || 0,
      createdAt: new Date()
    };
    
    // Add to our mock database
    assessmentResults.push(newResult);
    
    return NextResponse.json({ result: newResult });
  } catch (error) {
    console.error("Error saving assessment result:", error);
    return createErrorResponse("Internal server error", 500);
  }
});

// Get aggregated progress data by cognitive domain
export const PATCH = withAuth(async (request: NextRequest, userId: string) => {
  try {
    const body = await request.json();
    const { timeRange = '30d' } = body;
    
    // Calculate date range
    const endDate = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '180d':
        startDate.setDate(endDate.getDate() - 180);
        break;
      case '365d':
        startDate.setDate(endDate.getDate() - 365);
        break;
      case 'all':
        startDate = new Date(0); // Beginning of time
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }
    
    // Filter by date range and user
    const filteredResults = assessmentResults.filter(result => 
      result.userId === userId && 
      result.date >= startDate &&
      result.date <= endDate
    );
    
    // Aggregate by cognitive domain
    const domainScores: Record<string, { total: number, count: number }> = {};
    
    filteredResults.forEach(result => {
      result.scores.forEach(score => {
        if (!domainScores[score.domain]) {
          domainScores[score.domain] = { total: 0, count: 0 };
        }
        domainScores[score.domain].total += score.score;
        domainScores[score.domain].count += 1;
      });
    });
    
    // Calculate averages
    const progressData = Object.entries(domainScores).map(([domain, data]) => ({
      domain,
      averageScore: data.count > 0 ? Math.round(data.total / data.count) : 0,
      assessmentCount: data.count
    }));
    
    return NextResponse.json({ 
      progressData,
      timeRange,
      assessmentCount: filteredResults.length
    });
  } catch (error) {
    console.error("Error generating progress data:", error);
    return createErrorResponse("Internal server error", 500);
  }
}); 