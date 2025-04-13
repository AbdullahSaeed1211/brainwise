import { getModelEndpoint } from './model-loader';

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

// Risk categories based on probability thresholds
const RISK_CATEGORIES = {
  'Very Low Risk': 0.1,
  'Low Risk': 0.2,
  'Moderate Risk': 0.4,
  'High Risk': 0.6,
  'Very High Risk': 0.8
};

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
 * Predict stroke risk using the Hugging Face API
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
    // Use Hugging Face endpoint directly
    const endpoint = getModelEndpoint('stroke');
    const apiUrl = options?.version ? 
      `${endpoint}/api/predict?version=${options.version}` : 
      `${endpoint}/api/predict`;
      
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      return predictWithTemporaryModel(data);
    }
    
    const result = await response.json();
    const inferenceTimeMs = Date.now() - startTime;
    
    if (result?.prediction && typeof result.probability === 'number') {
      return {
        prediction: result.prediction,
        probability: result.probability,
        riskFactors: result.riskFactors,
        modelVersion: result.modelVersion || 'huggingface',
        inferenceTimeMs
      };
    }
    
    // Fallback to temporary model if API response format is unexpected
    return predictWithTemporaryModel(data);
  } catch (error) {
    console.error('Error during stroke prediction:', error);
    return predictWithTemporaryModel(data);
  }
}

/**
 * Temporary model based on risk factors - used as fallback
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
    riskFactors: riskFactors.map(rf => rf.factor),
    totalRiskScore,
    modelVersion: 'fallback-model',
    inferenceTimeMs: 5 // Nominal value for the fallback model
  };
} 