import mongoose, { Schema, Document } from "mongoose";

export interface INewsletter extends Document {
  email: string;
  name?: string;
  subscribedAt: Date;
  status: "active" | "unsubscribed";
  source: string;
  interests: string[];
}

const NewsletterSchema = new Schema<INewsletter>(
  {
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true
    },
    name: { 
      type: String,
      trim: true
    },
    subscribedAt: { 
      type: Date, 
      default: Date.now 
    },
    status: { 
      type: String, 
      enum: ["active", "unsubscribed"],
      default: "active"
    },
    source: {
      type: String,
      default: "website",
      enum: ["website", "landing-page", "blog", "referral"]
    },
    interests: [{
      type: String,
      enum: ["brain-health", "cognitive-games", "stroke-prevention", "mental-fitness", "general"]
    }]
  },
  { timestamps: true }
);

// Email validation
NewsletterSchema.path("email").validate(function(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}, "Invalid email address");

export default mongoose.models.Newsletter || 
  mongoose.model<INewsletter>("Newsletter", NewsletterSchema); 