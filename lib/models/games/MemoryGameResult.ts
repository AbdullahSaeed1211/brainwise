import mongoose, { Schema } from "mongoose";

// Interface for Memory Game Result
export interface IMemoryGameResult {
  user: Schema.Types.ObjectId;
  score: number;
  totalTimeMs: number;
  mistakes: number;
  difficulty: string;
  cardsMatched: number;
  totalCards: number;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Memory Game Result
const MemoryGameResultSchema = new Schema<IMemoryGameResult>(
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
    totalTimeMs: {
      type: Number,
      required: true,
      min: 0,
    },
    mistakes: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
      default: "medium",
    },
    cardsMatched: {
      type: Number,
      required: true,
      min: 0,
    },
    totalCards: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create or retrieve the model
let MemoryGameResult: mongoose.Model<IMemoryGameResult>;

try {
  // Try to retrieve existing model
  MemoryGameResult = mongoose.model<IMemoryGameResult>("MemoryGameResult");
} catch {
  // Create the model if it doesn't exist
  MemoryGameResult = mongoose.model<IMemoryGameResult>(
    "MemoryGameResult",
    MemoryGameResultSchema
  );
}

export default MemoryGameResult; 