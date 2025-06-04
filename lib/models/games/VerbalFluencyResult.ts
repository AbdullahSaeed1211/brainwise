import mongoose, { Schema } from "mongoose";

// Interface for Verbal Fluency Game Result
export interface IVerbalFluencyResult {
  user: Schema.Types.ObjectId;
  score: number;
  validWordsCount: number;
  uniqueCategories: number;
  totalTimeMs: number;
  difficulty: string;
  invalidWordsCount: number;
  repeatedWordsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Verbal Fluency Game Result
const VerbalFluencyResultSchema = new Schema<IVerbalFluencyResult>(
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
    validWordsCount: {
      type: Number,
      required: true,
      min: 0,
    },
    uniqueCategories: {
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
    invalidWordsCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    repeatedWordsCount: {
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
let VerbalFluencyResult: mongoose.Model<IVerbalFluencyResult>;

try {
  // Try to retrieve existing model
  VerbalFluencyResult = mongoose.model<IVerbalFluencyResult>("VerbalFluencyResult");
} catch {
  // Create the model if it doesn't exist
  VerbalFluencyResult = mongoose.model<IVerbalFluencyResult>(
    "VerbalFluencyResult",
    VerbalFluencyResultSchema
  );
}

export default VerbalFluencyResult; 