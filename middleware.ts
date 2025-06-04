import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Create a matcher for public routes
const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/cognitive-games",
  "/brain-health",
  "/contact",
  "/api/newsletter",
  "/api/webhooks/clerk",
  "/api/newsletter/(.*)",
  "/api/webhooks/clerk/(.*)",
  "/404", // Make 404 page public
  "/_not-found", // Next.js internal route for 404
  "/sign-in(.*)", // All sign-in routes
  "/sign-up(.*)", // All sign-up routes
  "/login(.*)", // Custom login routes if used
  "/register(.*)" // Custom register routes if used
]);

export default clerkMiddleware(async (auth, req) => {
  // If the path is not public, protect it
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)",
  ],
}; 