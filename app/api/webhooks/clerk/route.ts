import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from "@/lib/mongodb";
import mongoose from "mongoose";

// Define type for email address structure from Clerk
interface ClerkEmailAddress {
  id: string;
  email_address: string;
  verification: {
    status: string;
    strategy: string;
  };
  linked_to: unknown[];
}

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

export async function POST(req: Request) {
  try {
    // Get the request headers directly from the Request object
    const headerMap = req.headers;
    
    // Extract Svix headers
    const svix_id = headerMap.get("svix-id");
    const svix_timestamp = headerMap.get("svix-timestamp");
    const svix_signature = headerMap.get("svix-signature");

    // If there are no Svix headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Error: Missing svix headers", {
        status: 400,
      });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your webhook secret
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Error verifying webhook", {
        status: 400,
      });
    }

    // Get the ID and type
    const { id } = evt.data;
    const eventType = evt.type;

    // Connect to the database
    await db.connect();
    const User = await getUserModel();

    // Handle the event based on type
    switch (eventType) {
      case "user.created": {
        const { email_addresses, first_name, last_name, image_url } = evt.data;
        
        const primaryEmail = (email_addresses as ClerkEmailAddress[])?.find(
          (email) => email.id === evt.data.primary_email_address_id
        );
        const emailValue = primaryEmail ? primaryEmail.email_address : null;

        // Check if user already exists (should not, but just in case)
        const existingUser = await User.findOne({ clerkId: id });
        if (existingUser) {
          return NextResponse.json({ message: "User already exists" });
        }

        // Create a new user
        const name = [first_name, last_name].filter(Boolean).join(" ");
        await User.create({
          clerkId: id,
          email: emailValue,
          name: name || "User",
          profilePicture: image_url,
        });

        return NextResponse.json({ message: "User created successfully" });
      }

      case "user.updated": {
        const { email_addresses, first_name, last_name, image_url } = evt.data;
        
        const primaryEmail = (email_addresses as ClerkEmailAddress[])?.find(
          (email) => email.id === evt.data.primary_email_address_id
        );
        const emailValue = primaryEmail ? primaryEmail.email_address : null;

        // Find the user by Clerk ID
        const user = await User.findOne({ clerkId: id });
        if (!user) {
          return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Update the user
        const name = [first_name, last_name].filter(Boolean).join(" ");
        await User.findByIdAndUpdate(user._id, {
          email: emailValue,
          name: name || user.name,
          profilePicture: image_url || user.profilePicture,
        });

        return NextResponse.json({ message: "User updated successfully" });
      }

      case "user.deleted": {
        // Find the user by Clerk ID
        const user = await User.findOne({ clerkId: id });
        if (!user) {
          return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Delete the user
        await User.findByIdAndDelete(user._id);

        return NextResponse.json({ message: "User deleted successfully" });
      }

      default:
        // Handle other events
        return NextResponse.json({ message: `Webhook received: ${eventType}` });
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { message: "Error processing webhook" },
      { status: 500 }
    );
  }
} 