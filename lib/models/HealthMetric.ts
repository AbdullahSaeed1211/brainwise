import mongoose, { Schema, Document, Model } from 'mongoose';

// Health metric types
export type MetricType = 
  | 'blood_pressure' 
  | 'heart_rate' 
  | 'weight' 
  | 'sleep' 
  | 'cholesterol' 
  | 'glucose' 
  | 'activity'
  | 'water'
  | 'meditation'
  | 'stress';

// Health metric schema for MongoDB
export interface IHealthMetric extends Document {
  userId: string;
  type: MetricType;
  value: string;
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const HealthMetricSchema = new Schema<IHealthMetric>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        'blood_pressure',
        'heart_rate',
        'weight',
        'sleep',
        'cholesterol',
        'glucose',
        'activity',
        'water',
        'meditation',
        'stress',
      ],
      index: true,
    },
    value: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create the model if it doesn't exist or get the existing model
let HealthMetric: Model<IHealthMetric>;

try {
  // Try to get the existing model
  HealthMetric = mongoose.model<IHealthMetric>('HealthMetric');
} catch {
  // Create the model if it doesn't exist
  HealthMetric = mongoose.model<IHealthMetric>('HealthMetric', HealthMetricSchema);
}

export { HealthMetric }; 