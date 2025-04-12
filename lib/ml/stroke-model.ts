import * as tf from '@tensorflow/tfjs';
import { loadModel } from './model-loader';

// Interface for stroke risk input data
export interface StrokeRiskInput {
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  hypertension: 0 | 1;
  heartDisease: 0 | 1;
  everMarried: 'Yes' | 'No';
  workType: 'Private' | 'Self-employed' | 'Govt_job' | 'children' | 'Never_worked';
  residenceType: 'Urban' | 'Rural';
  avgGlucoseLevel: number;
  bmi: number;
  smokingStatus: 'formerly smoked' | 'never smoked' | 'smokes' | 'Unknown';
}

// Interface for model prediction result
export interface PredictionResult {
  prediction: string;
  probability: number;
  modelVersion?: string;
  inferenceTimeMs?: number;
  riskFactors?: string[];
  totalRiskScore?: number;
}

// Interface for normalization parameters
interface NormalizationParams {
  [key: string]: {
    mean: number;
    std: number;
  };
}

// Risk categories based on probability thresholds
const RISK_CATEGORIES = {
  'Very Low Risk': 0.1,
  'Low Risk': 0.2,
  'Moderate Risk': 0.4,
  'High Risk': 0.6,
  'Very High Risk': 0.8
};

// Normalization parameters (cached after first load)
let normalization: NormalizationParams | null = null;

/**
 * Load normalization parameters for the model
 */
export async function loadNormalizationParams(version?: string): Promise<NormalizationParams | null> {
  if (normalization) return normalization;
  
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    const baseUrl = isProduction 
      ? 'https://storage.googleapis.com/brain-ai-models/stroke-model'
      : '/models/stroke-model';
    
    const versionPath = version ? `/versions/${version}` : '';
    const url = `${baseUrl}${versionPath}/normalization.json`;
    
    const response = await fetch(url);
    if (!response.ok) {
      console.error('Failed to load normalization parameters:', response.statusText);
      return null;
    }
    
    normalization = await response.json() as NormalizationParams;
    return normalization;
  } catch (error) {
    console.error('Error loading normalization parameters:', error);
    return null;
  }
}

/**
 * One-hot encode categorical features
 */
function oneHotEncode(value: string, categories: string[]): number[] {
  const encoded = new Array(categories.length).fill(0);
  const index = categories.indexOf(value);
  if (index !== -1) {
    encoded[index] = 1;
  }
  return encoded;
}

/**
 * Normalize numeric features
 */
function normalizeFeature(value: number, feature: string): number {
  if (!normalization || !normalization[feature]) return value;
  
  const { mean, std } = normalization[feature];
  return (value - mean) / std;
}

/**
 * Prepare tensor input for the model
 */
function prepareModelInput(data: StrokeRiskInput): tf.Tensor {
  // Normalize numeric features
  const normalizedAge = normalizeFeature(data.age, 'age');
  const normalizedGlucose = normalizeFeature(data.avgGlucoseLevel, 'avgGlucoseLevel');
  const normalizedBmi = normalizeFeature(data.bmi, 'bmi');
  
  // One-hot encode categorical features
  const genderEncoded = oneHotEncode(data.gender, ['Female', 'Male', 'Other']);
  const marriedEncoded = oneHotEncode(data.everMarried, ['No', 'Yes']);
  const workTypeEncoded = oneHotEncode(data.workType, ['Govt_job', 'Never_worked', 'Private', 'Self-employed', 'children']);
  const residenceEncoded = oneHotEncode(data.residenceType, ['Rural', 'Urban']);
  const smokingEncoded = oneHotEncode(data.smokingStatus, ['Unknown', 'formerly smoked', 'never smoked', 'smokes']);
  
  // Combine all features
  const features = [
    normalizedAge,
    normalizedGlucose,
    normalizedBmi,
    data.hypertension,
    data.heartDisease,
    ...genderEncoded,
    ...marriedEncoded,
    ...workTypeEncoded,
    ...residenceEncoded,
    ...smokingEncoded
  ];
  
  return tf.tensor2d([features]);
}

/**
 * Get risk category based on probability
 */
function getRiskCategory(probability: number): string {
  for (const [category, threshold] of Object.entries(RISK_CATEGORIES)) {
    if (probability < threshold) {
      return category;
    }
  }
  return 'Very High Risk';
}

/**
 * Predict stroke risk using the model
 */
export async function predictStroke(
  data: StrokeRiskInput,
  options: {
    version?: string;
    forceRefresh?: boolean;
  } = {}
): Promise<PredictionResult> {
  const startTime = Date.now();
  
  try {
    // Ensure normalization parameters are loaded
    if (!normalization) {
      await loadNormalizationParams(options.version);
    }
    
    // Load the model
    const model = await loadModel('stroke', options);
    
    if (!model) {
      console.log('Model not available, using temporary model');
      return predictWithTemporaryModel(data);
    }
    
    // Prepare input tensor
    const inputTensor = prepareModelInput(data);
    
    // Run prediction
    const result = model.predict(inputTensor) as tf.Tensor;
    const probability = (await result.data())[0];
    
    // Clean up tensors
    inputTensor.dispose();
    result.dispose();
    
    // Get risk category
    const prediction = getRiskCategory(probability);
    const inferenceTimeMs = Date.now() - startTime;
    
    return { 
      prediction, 
      probability,
      modelVersion: options.version || 'latest',
      inferenceTimeMs
    };
  } catch (error) {
    console.error('Error during stroke prediction:', error);
    return predictWithTemporaryModel(data);
  }
}

/**
 * Temporary model based on risk factors
 */
function predictWithTemporaryModel(data: StrokeRiskInput): PredictionResult {
  // Calculate weighted risk factors
  let totalRiskScore = 0;
  const riskFactors: {factor: string, weight: number}[] = [];
  
  // Major risk factors (higher weights)
  if (data.hypertension === 1) {
    riskFactors.push({factor: 'Hypertension', weight: 0.20});
    totalRiskScore += 0.20;
  }
  
  if (data.heartDisease === 1) {
    riskFactors.push({factor: 'Heart Disease', weight: 0.25});
    totalRiskScore += 0.25;
  }
  
  // Age is a critical factor with non-linear risk
  if (data.age > 75) {
    riskFactors.push({factor: 'Age > 75', weight: 0.25});
    totalRiskScore += 0.25;
  } else if (data.age > 65) {
    riskFactors.push({factor: 'Age > 65', weight: 0.15});
    totalRiskScore += 0.15;
  } else if (data.age > 55) {
    riskFactors.push({factor: 'Age > 55', weight: 0.10});
    totalRiskScore += 0.10;
  } else if (data.age > 45) {
    riskFactors.push({factor: 'Age > 45', weight: 0.05});
    totalRiskScore += 0.05;
  }
  
  // Smoking status with differentiated risk
  if (data.smokingStatus === 'smokes') {
    riskFactors.push({factor: 'Current Smoker', weight: 0.15});
    totalRiskScore += 0.15;
  } else if (data.smokingStatus === 'formerly smoked') {
    riskFactors.push({factor: 'Former Smoker', weight: 0.08});
    totalRiskScore += 0.08;
  }
  
  // Glucose levels with graduated risk
  if (data.avgGlucoseLevel > 200) {
    riskFactors.push({factor: 'Very High Blood Glucose', weight: 0.20});
    totalRiskScore += 0.20;
  } else if (data.avgGlucoseLevel > 140) {
    riskFactors.push({factor: 'High Blood Glucose', weight: 0.15});
    totalRiskScore += 0.15;
  } else if (data.avgGlucoseLevel > 110) {
    riskFactors.push({factor: 'Elevated Blood Glucose', weight: 0.05});
    totalRiskScore += 0.05;
  }
  
  // BMI categories
  if (data.bmi > 35) {
    riskFactors.push({factor: 'Severe Obesity', weight: 0.15});
    totalRiskScore += 0.15;
  } else if (data.bmi > 30) {
    riskFactors.push({factor: 'Obesity', weight: 0.10});
    totalRiskScore += 0.10;
  } else if (data.bmi > 25) {
    riskFactors.push({factor: 'Overweight', weight: 0.05});
    totalRiskScore += 0.05;
  }
  
  // Gender factor (males slightly higher risk)
  if (data.gender === 'Male') {
    riskFactors.push({factor: 'Male Gender', weight: 0.05});
    totalRiskScore += 0.05;
  }
  
  // Apply sigmoid function to create probability curve
  // This creates more reasonable probability distribution
  const probability = 1 / (1 + Math.exp(-5 * (totalRiskScore - 0.5)));
  
  return {
    prediction: getRiskCategory(probability),
    probability,
    riskFactors: riskFactors.map(rf => rf.factor), // Optional: include risk factors for UI
    totalRiskScore,
    modelVersion: 'enhanced-placeholder-v2',
    inferenceTimeMs: 5 // Nominal value for the placeholder model
  };
} 