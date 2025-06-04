import mongoose, { Schema, Document } from 'mongoose';

export interface IAssessment extends Document {
  userId: string;
  type: 'stroke' | 'tumor' | 'alzheimers';
  result: string;
  risk: 'low' | 'moderate' | 'high';
  data: Record<string, string | number | boolean | null | {
    status?: string;
    result?: string;
    [key: string]: unknown;
  }>;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentSchema: Schema = new Schema(
  {
    userId: { 
      type: String, 
      required: true,
      index: true
    },
    type: { 
      type: String, 
      enum: ['stroke', 'tumor', 'alzheimers'], 
      required: true 
    },
    result: { type: String, required: true },
    risk: { 
      type: String, 
      enum: ['low', 'moderate', 'high'], 
      required: true 
    },
    data: { type: Schema.Types.Mixed },
    date: { type: Date, default: Date.now }
  },
  { 
    timestamps: true 
  }
);

// Compound index for efficient queries by user, type, and date
AssessmentSchema.index({ userId: 1, type: 1, date: -1 });

export default mongoose.models.Assessment || 
  mongoose.model<IAssessment>('Assessment', AssessmentSchema); 