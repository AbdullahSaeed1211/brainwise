import mongoose, { Schema } from "mongoose";

// Interface for Pattern Recognition Game Result
export interface IPatternRecognitionResult {
  user: Schema.Types.ObjectId;
  score: number;
  correctPatterns: number;
  missedPatterns: number;
  totalTimeMs: number;
  difficulty: string;
  totalPatterns: number;
  incorrectGuesses: number;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Pattern Recognition Game Result
const PatternRecognitionResultSchema = new Schema<IPatternRecognitionResult>(
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
    correctPatterns: {
      type: Number,
      required: true,
      min: 0,
    },
    missedPatterns: {
      type: Number,
      required: true,
      default: 0,
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
    totalPatterns: {
      type: Number,
      required: true,
      min: 0,
    },
    incorrectGuesses: {
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
let PatternRecognitionResult: mongoose.Model<IPatternRecognitionResult>;

try {
  // Try to retrieve existing model
  PatternRecognitionResult = mongoose.model<IPatternRecognitionResult>("PatternRecognitionResult");
} catch {
  // Create the model if it doesn't exist
  PatternRecognitionResult = mongoose.model<IPatternRecognitionResult>(
    "PatternRecognitionResult",
    PatternRecognitionResultSchema
  );
}

export default PatternRecognitionResult; 