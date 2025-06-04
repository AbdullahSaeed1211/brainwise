import { NextRequest } from "next/server";
import mongoose from "mongoose";
import db from "@/lib/mongodb";
import {
  badRequestResponse,
  createdResponse,
  serverErrorResponse,
  successResponse,
} from "@/lib/api-utils";

// Valid newsletter interest categories
type NewsletterInterest = "brain-health" | "cognitive-games" | "stroke-prevention" | "mental-fitness" | "general";
const VALID_INTERESTS: NewsletterInterest[] = ["brain-health", "cognitive-games", "stroke-prevention", "mental-fitness", "general"];

// Flag to indicate email delivery is not yet implemented
const EMAIL_DELIVERY_PENDING = true;

// Helper to get the Newsletter model dynamically
const getNewsletterModel = async () => {
  await db.connect();
  try {
    return mongoose.model('Newsletter');
  } catch {
    // If model doesn't exist yet, this will import it
    const { default: NewsletterModel } = await import("@/lib/models/Newsletter");
    return NewsletterModel;
  }
};

// Helper to validate and filter interests
function validateInterests(interests: unknown): NewsletterInterest[] {
  if (!interests || !Array.isArray(interests)) {
    return ["general"];
  }
  
  // Filter out invalid interests
  return interests.filter((interest): interest is NewsletterInterest => 
    typeof interest === 'string' && VALID_INTERESTS.includes(interest as NewsletterInterest)
  );
}

// POST /api/newsletter - Subscribe to the newsletter
export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const data = await req.json();
    
    // Validate required fields
    if (!data.email) {
      return badRequestResponse("Email is required");
    }

    // Connect to the database
    await db.connect();
    const Newsletter = await getNewsletterModel();

    // Check if email already exists
    const existingSubscription = await Newsletter.findOne({ email: data.email });
    
    if (existingSubscription) {
      // If already subscribed but unsubscribed status, reactivate
      if (existingSubscription.status === "unsubscribed") {
        existingSubscription.status = "active";
        existingSubscription.subscribedAt = new Date();
        
        // Add any new interests if provided
        if (data.interests) {
          const validInterests = validateInterests(data.interests);
          
          // Merge existing and new interests without duplicates
          const uniqueInterests = Array.from(new Set([
            ...existingSubscription.interests,
            ...validInterests
          ]));
          existingSubscription.interests = uniqueInterests;
        }
        
        await existingSubscription.save();
        return successResponse(existingSubscription, "Newsletter subscription reactivated");
      } else {
        // Already subscribed with active status
        return successResponse(existingSubscription, "Email already subscribed to the newsletter");
      }
    }

    // Create the subscription
    const subscription = await Newsletter.create({
      email: data.email,
      name: data.name || "",
      subscribedAt: new Date(),
      status: "active",
      source: data.source || "website",
      interests: validateInterests(data.interests)
    });

    if (EMAIL_DELIVERY_PENDING) {
      console.log("📧 [Newsletter] Email delivery not yet implemented - using Resend in the future");
      // This would be where we'd send a welcome email using Resend
    }

    return createdResponse(subscription, "Successfully subscribed to the newsletter");
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return serverErrorResponse("Failed to subscribe to the newsletter");
  }
}

// PUT /api/newsletter/unsubscribe - Unsubscribe from the newsletter
export async function PUT(req: NextRequest) {
  try {
    // Parse the request body
    const data = await req.json();
    
    // Validate required fields
    if (!data.email) {
      return badRequestResponse("Email is required");
    }

    // Connect to the database
    await db.connect();
    const Newsletter = await getNewsletterModel();

    // Find the subscription
    const subscription = await Newsletter.findOne({ email: data.email });
    if (!subscription) {
      return badRequestResponse("Email not found in our subscription list");
    }

    // Update the status
    subscription.status = "unsubscribed";
    await subscription.save();

    return successResponse(null, "Successfully unsubscribed from the newsletter");
  } catch (error) {
    console.error("Error unsubscribing from newsletter:", error);
    return serverErrorResponse("Failed to unsubscribe from the newsletter");
  }
} 