/**
 * Standardized authentication helpers for Clerk
 */
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import db from "@/lib/mongodb";
import mongoose from "mongoose";

// This type defines a Next.js API route handler that requires authentication
export type AuthenticatedHandler = (
  request: NextRequest,
  userId: string
) => Promise<NextResponse>;

/**
 * Handles authentication for route handlers in App Router
 * @returns The authenticated userId or throws a 401 response
 */
export async function requireAuth() {
  const session = await auth();
  if (!session.userId) {
    throw new Error('Unauthorized');
  }
  return session.userId;
}

/**
 * Protected route handler wrapper with improved type safety for Next.js 15
 */
export async function protectApiRoute(handler: (userId: string) => Promise<NextResponse>) {
  try {
    const session = await auth();
    if (!session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return handler(session.userId);
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}

/**
 * Higher-order function that wraps an API route handler with authentication
 */
export function withAuth(handler: AuthenticatedHandler) {
  // For development without Clerk, use this mock implementation
  if (process.env.NEXT_PUBLIC_MOCK_AUTH === 'true') {
    return async (request: NextRequest) => {
      try {
        // Mock user ID for demo purposes
        const userId = "user-123456";
        
        // Call the handler with the authenticated user ID
        return handler(request, userId);
      } catch (error) {
        console.error("Authentication error:", error instanceof Error ? error.message : "Unknown error");
        return createErrorResponse("Unauthorized", 401);
      }
    };
  }
  
  // Production implementation using Clerk
  return async (request: NextRequest) => {
    return protectApiRoute((userId) => handler(request, userId));
  };
}

interface ErrorOptions {
  status?: number;
  code?: string;
  details?: unknown;
}

/**
 * Enhanced createErrorResponse that handles both formats
 */
export function createErrorResponse(
  message: string,
  statusOrOptions: number | ErrorOptions = 500
) {
  if (typeof statusOrOptions === 'number') {
    return NextResponse.json(
      { error: message },
      { status: statusOrOptions }
    );
  } else {
    const { status = 500, code, details } = statusOrOptions;
    const errorObj: Record<string, unknown> = { message };
    
    if (code) errorObj.code = code;
    if (details !== undefined) errorObj.details = details;
    
    return NextResponse.json(
      { error: errorObj },
      { status }
    );
  }
}

/**
 * Import User model dynamically to avoid circular dependencies
 * and fix the import error
 */
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

/**
 * Get the current user ID from Clerk
 */
export async function getCurrentUserId(): Promise<string | null> {
  // For development without Clerk, return a mock user ID
  if (process.env.NEXT_PUBLIC_MOCK_AUTH === 'true') {
    return "user-123456";
  }
  
  try {
    // Rename the variable to avoid collision with the imported auth function
    const authData = await auth();
    return authData?.userId || null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Get the current user from the database
 */
export async function getCurrentUser() {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    return null;
  }
  
  try {
    // Get the User model
    const User = await getUserModel();
    
    // Find the user in the database
    const user = await User.findOne({ clerkId: userId });
    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    throw error;
  }
}

/**
 * Create a user in the database if it doesn't exist
 */
export async function createUserIfNotExists(clerkUser: {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string;
}) {
  try {
    // Get the User model
    const User = await getUserModel();
    
    // Check if user exists
    let user = await User.findOne({ clerkId: clerkUser.id });
    
    // If user doesn't exist, create it
    if (!user) {
      const name = [clerkUser.firstName, clerkUser.lastName]
        .filter(Boolean)
        .join(" ");
      
      user = await User.create({
        clerkId: clerkUser.id,
        email: clerkUser.email,
        name: name || "User",
        profilePicture: clerkUser.imageUrl,
      });
    }
    
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
} 