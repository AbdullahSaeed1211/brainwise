import { getModelEndpoint } from './model-loader';

// Interface for Alzheimer's risk input data
export interface AlzheimersRiskInput {
  age: number;
  sex: string;
  education: string;
  memoryComplaints: boolean;
  familyHistory: boolean;
  cognitiveAssessment: number;
  mobility: string;
  independentLiving: string;
}

// Interface for model prediction result
export interface PredictionResult {
  prediction: string;
  probability: number;
  riskLevel: string;
  modelVersion?: string;
  inferenceTimeMs?: number;
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
 * Get risk level (low, moderate, high) for database storage
 */
function getRiskLevel(probability: number): string {
  if (probability < 0.1) return 'low';
  if (probability < 0.3) return 'moderate';
  return 'high';
}

/**
 * Predict Alzheimer's risk using the Hugging Face model API
 */
export async function predictAlzheimers(
  data: AlzheimersRiskInput,
  options?: { version?: string; forceRefresh?: boolean }
): Promise<PredictionResult> {
  const startTime = Date.now();
  
  try {
    // Use Hugging Face endpoint directly
    const endpoint = getModelEndpoint('alzheimers');
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
        riskLevel: getRiskLevel(result.probability),
        modelVersion: result.modelVersion || 'huggingface',
        inferenceTimeMs
      };
    }
    
    return predictWithTemporaryModel(data);
  } catch (error) {
    console.error('Error during Alzheimer\'s prediction:', error);
    return predictWithTemporaryModel(data);
  }
}

/**
 * Temporary model based on risk factors - used as fallback
 */
function predictWithTemporaryModel(data: AlzheimersRiskInput): PredictionResult {
  // Count risk factors
  const riskFactors = [];
  
  if (data.age > 65) riskFactors.push('Age > 65');
  if (data.memoryComplaints) riskFactors.push('Memory Complaints');
  if (data.familyHistory) riskFactors.push('Family History');
  if (data.cognitiveAssessment < 24) riskFactors.push('Low Cognitive Score');
  if (data.mobility === 'limited') riskFactors.push('Limited Mobility');
  if (data.independentLiving === 'needs assistance') riskFactors.push('Needs Assistance');
  
  const riskCount = riskFactors.length;
  
  // Simple logic based on risk factor count
  let probability: number;
  
  if (riskCount === 0) {
    probability = 0.05;
  } else if (riskCount === 1) {
    probability = 0.15;
  } else if (riskCount === 2) {
    probability = 0.30;
  } else if (riskCount === 3) {
    probability = 0.60;
  } else {
    probability = 0.80;
  }
  
  const prediction = getRiskCategory(probability);
  const riskLevel = getRiskLevel(probability);
  
  return {
    prediction,
    probability,
    riskLevel,
    modelVersion: 'fallback-model',
    inferenceTimeMs: 5 // Nominal value for the fallback model
  };
} 