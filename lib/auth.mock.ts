import { NextRequest, NextResponse } from "next/server";

// This type defines a Next.js API route handler that requires authentication
export type AuthenticatedHandler = (
  request: NextRequest,
  userId: string
) => Promise<NextResponse>;

/**
 * Create a standardized error response
 */
export function createErrorResponse(message: string, status: number = 400): NextResponse {
  return NextResponse.json(
    { error: message },
    { status }
  );
}

/**
 * Mock implementation of withAuth for development
 * This avoids having to set up Clerk during development
 */
export function withAuth(handler: AuthenticatedHandler) {
  return async (request: NextRequest) => {
    try {
      // Mock user ID for development
      const userId = "user-123456";
      
      // Call the handler with the mock user ID
      return handler(request, userId);
    } catch (error) {
      console.error("Authentication error:", error instanceof Error ? error.message : "Unknown error");
      return createErrorResponse("Unauthorized", 401);
    }
  };
}

/**
 * Mock implementation to get the current user ID
 */
export function getCurrentUserId(): string | null {
  // Return a mock user ID for development
  return "user-123456";
} 