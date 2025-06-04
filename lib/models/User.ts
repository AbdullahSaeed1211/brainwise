import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  clerkId: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  profilePicture?: string;
  dateOfBirth?: Date;
  gender?: "male" | "female" | "other" | "prefer not to say";
  preferences: {
    emailNotifications: boolean;
    reminderFrequency: "daily" | "weekly" | "never";
    theme: "light" | "dark" | "system";
  };
  healthProfile?: {
    height?: number; // in cm
    weight?: number; // in kg
    medicalConditions?: string[];
    medications?: string[];
  };
  newsletterSubscribed: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    profilePicture: { type: String },
    dateOfBirth: { type: Date },
    gender: { 
      type: String, 
      enum: ["male", "female", "other", "prefer not to say"] 
    },
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      reminderFrequency: { 
        type: String, 
        enum: ["daily", "weekly", "never"],
        default: "weekly"
      },
      theme: { 
        type: String, 
        enum: ["light", "dark", "system"],
        default: "system"
      }
    },
    healthProfile: {
      height: { type: Number },
      weight: { type: Number },
      medicalConditions: [{ type: String }],
      medications: [{ type: String }]
    },
    newsletterSubscribed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Prevent model overwrite error during hot reloading in development
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema); 