import { NextRequest } from "next/server";
import mongoose from "mongoose";
import db from "@/lib/mongodb";
import { getCurrentUserId } from "@/lib/auth";
import {
  badRequestResponse,
  notFoundResponse,
  serverErrorResponse,
  successResponse,
  unauthorizedResponse,
} from "@/lib/api-utils";

// Helper to get the User model dynamically
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

// GET /api/user/profile - Get the current user's profile
export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return unauthorizedResponse("You must be logged in to access your profile");
    }

    // Connect to the database
    await db.connect();
    const User = await getUserModel();

    // Find the user in the database with projection to exclude __v
    const user = await User.findOne({ clerkId: userId }, { __v: 0 }).lean();
    if (!user) {
      return notFoundResponse("User profile not found");
    }

    return successResponse(user);
  } catch (error) {
    console.error("Error getting user profile:", error);
    return serverErrorResponse("Failed to fetch user profile");
  }
}

// PATCH /api/user/profile - Update the current user's profile
export async function PATCH(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return unauthorizedResponse("You must be logged in to update your profile");
    }

    // Parse the request body
    const updates = await req.json();

    // Validate the updates
    const allowedFields = [
      "dateOfBirth",
      "gender",
      "preferences",
      "healthProfile",
      "newsletterSubscribed",
    ];

    // Filter out any fields that aren't in the allowed list
    const validUpdates = Object.keys(updates).reduce((acc, key) => {
      if (allowedFields.includes(key)) {
        acc[key] = updates[key];
      }
      return acc;
    }, {} as Record<string, unknown>);

    if (Object.keys(validUpdates).length === 0) {
      return badRequestResponse("No valid fields to update");
    }

    // Connect to the database
    await db.connect();
    const User = await getUserModel();

    // Find and update the user with projection to exclude __v
    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { $set: validUpdates },
      { new: true, runValidators: true, projection: { __v: 0 } }
    ).lean();

    if (!user) {
      return notFoundResponse("User profile not found");
    }

    return successResponse(user, "Profile updated successfully");
  } catch (error) {
    console.error("Error updating user profile:", error);
    return serverErrorResponse("Failed to update user profile");
  }
} 