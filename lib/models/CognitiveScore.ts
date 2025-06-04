import mongoose, { Schema, Document } from "mongoose";

export interface ICognitiveScore extends Document {
  user: mongoose.Types.ObjectId;
  domain: string;
  score: number;
  previousScore: number | null;
  assessmentDate: Date;
  source: string; // e.g., "memory-game", "cognitive-assessment"
  notes?: string;
}

const CognitiveScoreSchema = new Schema<ICognitiveScore>(
  {
    user: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    domain: { 
      type: String, 
      required: true,
      enum: ["Memory", "Attention", "Processing", "Executive", "Language"]
    },
    score: { 
      type: Number, 
      required: true,
      min: 0,
      max: 100
    },
    previousScore: { 
      type: Number,
      default: null
    },
    assessmentDate: { 
      type: Date, 
      default: Date.now 
    },
    source: {
      type: String,
      required: true,
      enum: ["memory-game", "concentration-game", "reaction-game", "cognitive-assessment"]
    },
    notes: {
      type: String
    }
  },
  { timestamps: true }
);

// Index for faster queries on user and domain
CognitiveScoreSchema.index({ user: 1, domain: 1, assessmentDate: -1 });

export default mongoose.models.CognitiveScore || 
  mongoose.model<ICognitiveScore>("CognitiveScore", CognitiveScoreSchema); 