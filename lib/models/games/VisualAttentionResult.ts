import mongoose, { Schema } from "mongoose";

// Interface for Visual Attention Game Result
export interface IVisualAttentionResult {
  user: Schema.Types.ObjectId;
  score: number;
  accuracy: number;
  averageReactionTimeMs: number;
  totalTimeMs: number;
  difficulty: string;
  targetsFound: number;
  totalTargets: number;
  distractorsClicked: number;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Visual Attention Game Result
const VisualAttentionResultSchema = new Schema<IVisualAttentionResult>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    accuracy: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    averageReactionTimeMs: {
      type: Number,
      required: true,
      min: 0,
    },
    totalTimeMs: {
      type: Number,
      required: true,
      min: 0,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
      default: "medium",
    },
    targetsFound: {
      type: Number,
      required: true,
      min: 0,
    },
    totalTargets: {
      type: Number,
      required: true,
      min: 0,
    },
    distractorsClicked: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create or retrieve the model
let VisualAttentionResult: mongoose.Model<IVisualAttentionResult>;

try {
  // Try to retrieve existing model
  VisualAttentionResult = mongoose.model<IVisualAttentionResult>("VisualAttentionResult");
} catch {
  // Create the model if it doesn't exist
  VisualAttentionResult = mongoose.model<IVisualAttentionResult>(
    "VisualAttentionResult",
    VisualAttentionResultSchema
  );
}

export default VisualAttentionResult; 