import mongoose, { Schema, Document } from "mongoose";

export interface IActivity extends Document {
  user: mongoose.Types.ObjectId;
  activityType: string;
  completedAt: Date;
  duration: number; // in seconds
  metadata: Record<string, unknown>;
}

const ActivitySchema = new Schema<IActivity>(
  {
    user: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    activityType: { 
      type: String, 
      required: true,
      enum: [
        "game-played", 
        "assessment-completed", 
        "article-read", 
        "stroke-risk-calculated",
        "training-session",
        "profile-updated"
      ]
    },
    completedAt: { 
      type: Date, 
      default: Date.now 
    },
    duration: { 
      type: Number,
      default: 0
    },
    metadata: { 
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  { timestamps: true }
);

// Index for faster activity queries
ActivitySchema.index({ user: 1, completedAt: -1 });
ActivitySchema.index({ user: 1, activityType: 1 });

export default mongoose.models.Activity || 
  mongoose.model<IActivity>("Activity", ActivitySchema); 