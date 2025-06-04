import mongoose, { Schema, Document, Model } from 'mongoose';

// Domain score interface
export interface DomainScore {
  domain: string;
  score: number;
  change?: number;
}

// Progress document interface
export interface IProgress extends Document {
  userId: string;
  date: Date;
  domains: DomainScore[];
  totalScore: number;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for domain scores
const DomainScoreSchema = new Schema({
  domain: {
    type: String,
    required: true,
    enum: ['memory', 'attention', 'processing', 'executive', 'language'],
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  change: {
    type: Number,
    default: 0,
  },
});

// Progress schema
const ProgressSchema = new Schema<IProgress>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    domains: [DomainScoreSchema],
    totalScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Create or retrieve the model
let Progress: Model<IProgress>;

try {
  // Try to get the existing model
  Progress = mongoose.model<IProgress>('Progress');
} catch {
  // Create the model if it doesn't exist
  Progress = mongoose.model<IProgress>('Progress', ProgressSchema);
}

export { Progress }; 