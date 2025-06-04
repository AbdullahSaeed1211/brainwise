/**
 * Risk categories with their corresponding probability thresholds
 */
export const RISK_CATEGORIES: Record<string, number> = {
  'Very Low Risk': 0.1,
  'Low Risk': 0.2,
  'Moderate Risk': 0.5,
  'High Risk': 0.7,
  'Very High Risk': 1.0
};

/**
 * Interface for stroke risk input data
 */
export interface StrokeRiskInput {
  gender: string;
  age: number;
  hypertension: number;
  heartDisease: number;
  everMarried: string;
  workType: string;
  residenceType: string;
  avgGlucoseLevel: number;
  bmi: number;
  smokingStatus: string;
}

/**
 * Interface for prediction result
 */
export interface PredictionResult {
  prediction: string;
  probability: number;
  riskCategory: string;
  riskFactors: string[];
  modelStatus: 'production' | 'fallback';
} 