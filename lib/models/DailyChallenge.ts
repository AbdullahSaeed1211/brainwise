import mongoose, { Schema, Document } from "mongoose";

export interface IDailyChallenge extends Document {
  date: Date;
  title: string;
  description: string;
  points: number;
  gameType: string;
  link: string;
  difficulty: string;
  isActive: boolean;
}

export interface IChallengeCompletion extends Document {
  user: mongoose.Types.ObjectId;
  challengeDate: Date;
  completedAt: Date;
  points: number;
  gameType: string;
  gameResultId?: mongoose.Types.ObjectId;
  earnedPoints: number;
}

const DailyChallengeSchema = new Schema<IDailyChallenge>(
  {
    date: { 
      type: Date, 
      required: true,
      index: true
    },
    title: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    points: { 
      type: Number, 
      required: true,
      min: 0
    },
    gameType: { 
      type: String, 
      required: true,
      enum: [
        "memory", 
        "verbal", 
        "pattern", 
        "reaction", 
        "sequence",
        "attention"
      ] 
    },
    link: { 
      type: String, 
      required: true 
    },
    difficulty: { 
      type: String, 
      required: true,
      enum: ["easy", "medium", "hard"]
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Compound index to ensure uniqueness per day
DailyChallengeSchema.index({ date: 1 }, { unique: true });

const ChallengeCompletionSchema = new Schema<IChallengeCompletion>(
  {
    user: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    challengeDate: {
      type: Date,
      required: true
    },
    completedAt: { 
      type: Date, 
      default: Date.now 
    },
    points: {
      type: Number,
      required: true
    },
    gameType: {
      type: String,
      required: true
    },
    gameResultId: {
      type: Schema.Types.ObjectId,
      ref: "GameResult"
    },
    earnedPoints: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

// Compound index to ensure a user can only complete a challenge once per day
ChallengeCompletionSchema.index({ user: 1, challengeDate: 1 }, { unique: true });

export const DailyChallenge = mongoose.models.DailyChallenge || 
  mongoose.model<IDailyChallenge>("DailyChallenge", DailyChallengeSchema);

export const ChallengeCompletion = mongoose.models.ChallengeCompletion || 
  mongoose.model<IChallengeCompletion>("ChallengeCompletion", ChallengeCompletionSchema); 