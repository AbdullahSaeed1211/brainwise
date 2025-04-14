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
}

// Risk categories based on probability thresholds
const RISK_CATEGORIES = {
  'Very Low Risk': 0.1,
  'Low Risk': 0.2,
  'Moderate Risk': 0.4,
  'High Risk': 0.6,
  'Very High Risk': 0.8
};

// Get risk category based on probability
function getRiskCategory(probability: number): string {
  for (const [category, threshold] of Object.entries(RISK_CATEGORIES)) {
    if (probability < threshold) {
      return category;
    }
  }
  return 'Very High Risk';
}

// Map form data to model input format
export function mapFormToModelInput(data: StrokeRiskInput): StrokeRiskInput {
  return {
    gender: data.gender,
    age: data.age,
    hypertension: data.hypertension,
    heartDisease: data.heartDisease,
    everMarried: data.everMarried,
    workType: data.workType,
    residenceType: data.residenceType,
    avgGlucoseLevel: data.avgGlucoseLevel,
    bmi: data.bmi,
    smokingStatus: data.smokingStatus
  };
}

// Predict stroke risk using the Hugging Face API
export async function predictStroke(data: StrokeRiskInput): Promise<PredictionResult> {
  try {
    // Format the data for the API
    const apiData = {
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
    };
    
    // Call the Hugging Face API
    const response = await fetch("https://abdullah1211-ml-stroke.hf.space/api/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiData),
    });
    
    if (!response.ok) {
      console.error('Hugging Face API error:', response.statusText);
      return predictWithTemporaryModel(data);
    }
    
    const result = await response.json();
    
    return { 
      prediction: result.prediction,
      probability: result.probability
    };
  } catch (error) {
    console.error('Error during stroke prediction:', error);
    return predictWithTemporaryModel(data);
  }
}

// Temporary model based on risk factors (fallback if API fails)
function predictWithTemporaryModel(data: StrokeRiskInput): PredictionResult {
  // Count risk factors
  const riskFactors = [];
  
  if (data.hypertension === 1) riskFactors.push('Hypertension');
  if (data.heartDisease === 1) riskFactors.push('Heart Disease');
  if (data.age > 65) riskFactors.push('Age > 65');
  if (data.smokingStatus === 'smokes') riskFactors.push('Smoking');
  if (data.avgGlucoseLevel > 140) riskFactors.push('High Blood Glucose');
  if (data.bmi > 30) riskFactors.push('Obesity');
  
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
  
  return {
    prediction: getRiskCategory(probability),
    probability
  };
} 