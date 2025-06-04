import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/mongodb";
import { withAuth, createErrorResponse } from "@/lib/auth";
import User from "@/lib/models/User";

export const GET = withAuth(async (req: NextRequest, userId: string) => {
  try {
    await db.connect();
    
    const user = await User.findOne({ clerkId: userId }).select("-__v");
    
    if (!user) {
      return createErrorResponse("User not found", 404);
    }
    
    return NextResponse.json({ user });
  } catch  {
    return createErrorResponse("Failed to fetch user data", 500);
  }
});

export const POST = withAuth(async (request: NextRequest, userId: string) => {
  try {
    const body = await request.json();
    const { firstName, lastName, email, profileImage } = body;
    
    if (!firstName || !lastName || !email) {
      return createErrorResponse("Missing required fields", 400);
    }
    
    await db.connect();
    
    // Check if user already exists
    let user = await User.findOne({ clerkId: userId });
    
    if (user) {
      // Update existing user
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      if (profileImage) user.profileImage = profileImage;
      
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        clerkId: userId,
        firstName,
        lastName,
        email,
        profileImage,
      });
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error creating/updating user:", error);
    return createErrorResponse("Internal server error", 500);
  }
});

export const PATCH = withAuth(async (req: NextRequest, userId: string) => {
  try {
    const updates = await req.json();
    
    // Validate the updates
    const allowedFields = ["name", "email", "preferences", "healthProfile"];
    
    // Create a new object with only the allowed fields
    const sanitizedUpdates = Object.entries(updates).reduce(
      (acc, [key, value]) => {
        if (allowedFields.includes(key)) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, unknown>
    );
    
    await db.connect();
    
    const updatedUser = await User.findOneAndUpdate(
      { clerkId: userId },
      { $set: sanitizedUpdates },
      { new: true }
    ).select("-__v");
    
    if (!updatedUser) {
      return createErrorResponse("User not found", 404);
    }
    
    return NextResponse.json({ user: updatedUser });
  } catch {
    return createErrorResponse("Failed to update user data", 500);
  }
}); 