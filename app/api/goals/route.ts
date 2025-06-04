import { NextRequest, NextResponse } from "next/server";
import { withAuth, createErrorResponse } from "@/lib/auth.mock";

// Define the Goal interface
interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: string;
  targetDate: Date;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

// Mock database for development (replace with actual DB model later)
// Using let because we modify the array in the API routes
const goals: Goal[] = [];

// Get goals for the authenticated user
export const GET = withAuth(async (request: NextRequest, userId: string) => {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    
    // Filter by userId (and optionally by category)
    const userGoals = goals.filter(goal => 
      goal.userId === userId && 
      (!category || goal.category === category)
    );
    
    return NextResponse.json({ goals: userGoals });
  } catch (error) {
    console.error("Error fetching goals:", error);
    return createErrorResponse("Internal server error", 500);
  }
});

// Create a new goal for the authenticated user
export const POST = withAuth(async (request: NextRequest, userId: string) => {
  try {
    const body = await request.json();
    
    // Validate the required fields
    if (!body.title || !body.category || !body.targetDate) {
      return createErrorResponse("Missing required fields: title, category, targetDate", 400);
    }
    
    const newGoal: Goal = {
      id: Date.now().toString(), // Use a proper ID generator in production
      userId,
      title: body.title,
      description: body.description || "",
      category: body.category,
      targetDate: new Date(body.targetDate),
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add to our mock database
    goals.push(newGoal);
    
    return NextResponse.json({ goal: newGoal });
  } catch (error) {
    console.error("Error creating goal:", error);
    return createErrorResponse("Internal server error", 500);
  }
});

// Update a goal by ID
export const PUT = withAuth(async (request: NextRequest, userId: string) => {
  try {
    const body = await request.json();
    const { id } = body;
    
    if (!id) {
      return createErrorResponse("Goal ID is required", 400);
    }
    
    const goalIndex = goals.findIndex(goal => goal.id === id && goal.userId === userId);
    
    if (goalIndex === -1) {
      return createErrorResponse("Goal not found or not authorized to update", 404);
    }
    
    // Update goal properties
    const updatedGoal = {
      ...goals[goalIndex],
      title: body.title || goals[goalIndex].title,
      description: body.description !== undefined ? body.description : goals[goalIndex].description,
      category: body.category || goals[goalIndex].category,
      targetDate: body.targetDate ? new Date(body.targetDate) : goals[goalIndex].targetDate,
      progress: body.progress !== undefined ? body.progress : goals[goalIndex].progress,
      updatedAt: new Date()
    };
    
    goals[goalIndex] = updatedGoal;
    
    return NextResponse.json({ goal: updatedGoal });
  } catch (error) {
    console.error("Error updating goal:", error);
    return createErrorResponse("Internal server error", 500);
  }
});

// Delete a goal by ID
export const DELETE = withAuth(async (request: NextRequest, userId: string) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    
    if (!id) {
      return createErrorResponse("Goal ID is required", 400);
    }
    
    const goalIndex = goals.findIndex(goal => goal.id === id && goal.userId === userId);
    
    if (goalIndex === -1) {
      return createErrorResponse("Goal not found or not authorized to delete", 404);
    }
    
    // Remove the goal
    goals.splice(goalIndex, 1);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting goal:", error);
    return createErrorResponse("Internal server error", 500);
  }
}); 