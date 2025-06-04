import { RISK_CATEGORIES, StrokeRiskInput, PredictionResult } from './types';

/**
 * Get risk category based on probability
 * @param probability The probability of stroke
 * @returns Risk category
 */
export function getRiskCategory(probability: number): string {
  for (const [category, threshold] of Object.entries(RISK_CATEGORIES)) {
    if (probability <= threshold) {
      return category;
    }
  }
  return Object.keys(RISK_CATEGORIES)[Object.keys(RISK_CATEGORIES).length - 1];
}

/**
 * Maps form data to model input format
 * @param formData User-provided form data
 * @returns Formatted input for model
 */
export function mapFormToModelInput(formData: Record<string, unknown>): StrokeRiskInput {
  return {
    gender: String(formData.gender),
    age: Number(formData.age),
    hypertension: formData.hypertension ? 1 : 0,
    heartDisease: formData.heartDisease ? 1 : 0,
    everMarried: formData.everMarried ? "Yes" : "No",
    workType: String(formData.workType || "Private"),
    residenceType: String(formData.residenceType || "Urban"),
    avgGlucoseLevel: Number(formData.avgGlucoseLevel),
    bmi: Number(formData.bmi),
    smokingStatus: String(formData.smokingStatus || "never smoked")
  };
}

/**
 * Predicts stroke risk using the Hugging Face API
 * @param data Stroke risk input data
 * @returns Prediction result with probability and risk category
 */
export async function predictStroke(data: StrokeRiskInput): Promise<PredictionResult> {
  try {
    const response = await fetch("https://abdullah1211-ml-stroke.hf.space", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gender: data.gender,
        age: data.age,
        hypertension: data.hypertension,
        heart_disease: data.heartDisease,
        ever_married: data.everMarried,
        work_type: data.workType,
        Residence_type: data.residenceType,
        avg_glucose_level: data.avgGlucoseLevel,
        bmi: data.bmi,
        smoking_status: data.smokingStatus
      }),
    });
    
    if (!response.ok) {
      throw new Error("API request failed");
    }
    
    const result = await response.json();
    
    return {
      prediction: result.prediction,
      probability: result.probability,
      riskCategory: getRiskCategory(result.probability),
      riskFactors: calculateRiskFactors(data),
      modelStatus: "production"
    };
  } catch (error) {
    console.error("Error calling stroke prediction API:", error);
    
    // Fallback to temporary model if API fails
    return fallbackPrediction(data);
  }
}

/**
 * Temporary fallback model used when API is unavailable
 * This uses a simple rule-based approach to estimate stroke risk
 */
function fallbackPrediction(data: StrokeRiskInput): PredictionResult {
  let riskScore = 0;
  const riskFactors = calculateRiskFactors(data);
  
  // Simplified risk calculation based on risk factor count
  riskScore = riskFactors.length * 0.1;
  
  // Cap at 0.9 for fallback model
  const probability = Math.min(riskScore, 0.9);
  
  return {
    prediction: probability > 0.5 ? "Stroke Risk Detected" : "Low Stroke Risk",
    probability,
    riskCategory: getRiskCategory(probability),
    riskFactors,
    modelStatus: "fallback"
  };
}

/**
 * Calculates risk factors based on input data
 */
function calculateRiskFactors(data: StrokeRiskInput): string[] {
  const riskFactors = [];
  
  if (data.age > 65) riskFactors.push("Age > 65");
  if (data.hypertension === 1) riskFactors.push("Hypertension");
  if (data.heartDisease === 1) riskFactors.push("Heart Disease");
  if (data.avgGlucoseLevel > 140) riskFactors.push("High Blood Glucose");
  if (data.bmi > 30) riskFactors.push("Obesity (BMI > 30)");
  if (data.smokingStatus === "formerly smoked") riskFactors.push("Former Smoker");
  if (data.smokingStatus === "smokes") riskFactors.push("Current Smoker");
  
  return riskFactors;
} 