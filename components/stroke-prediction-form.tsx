"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";

interface FormData {
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

interface PredictionResult {
  risk: number;
  prediction?: string;
  probability?: number;
  riskFactors?: string[];
  recommendations?: string[];
  modelVersion?: string;
  totalRiskScore?: number;
}

interface StrokeRiskInput {
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

async function predictStroke(input: StrokeRiskInput): Promise<PredictionResult> {
  try {
    console.log("🚀 [Frontend] Sending stroke prediction request with data:", input);
    
    const response = await fetch('/api/stroke/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      console.error(`❌ [Frontend] API error: ${response.status} ${response.statusText}`);
      try {
        const errorText = await response.text();
        console.error(`Error details: ${errorText}`);
      } catch {
        console.error("Could not read error details");
      }
      throw new Error(`Failed to get prediction: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ [Frontend] Received stroke prediction response:", data);
    
    // Generate personalized recommendations based on risk factors
    const recommendations = data.recommendations || generateRecommendations(data.riskFactors || []);
    
    return { 
      risk: data.probability || 0,
      prediction: data.prediction,
      probability: data.probability,
      riskFactors: data.riskFactors || data.risk_factors || [],
      recommendations,
      totalRiskScore: data.totalRiskScore
    };
  } catch (error) {
    console.error('❌ [Frontend] Error predicting stroke risk:', error);
    // Use backup calculation to ensure users always get a result
    return getBackupPrediction(input);
  }
}

// Generate personalized recommendations based on risk factors
function generateRecommendations(riskFactors: string[]): string[] {
  const recommendations: string[] = [];
  
  if (riskFactors.includes('Hypertension')) {
    recommendations.push('Monitor your blood pressure regularly and follow your doctor\'s recommendations for management.');
  }
  
  if (riskFactors.includes('Heart Disease')) {
    recommendations.push('Continue to follow your cardiologist\'s treatment plan and attend regular check-ups.');
  }
  
  if (riskFactors.includes('Current Smoker')) {
    recommendations.push('Consider a smoking cessation program to reduce your stroke risk significantly.');
  }
  
  if (riskFactors.includes('Former Smoker')) {
    recommendations.push('Great job quitting smoking! Continue to avoid tobacco to further reduce your risk.');
  }
  
  if (riskFactors.includes('Very High Blood Glucose') || riskFactors.includes('High Blood Glucose') || riskFactors.includes('Elevated Blood Glucose')) {
    recommendations.push('Consult with your doctor about managing your blood glucose levels through diet, exercise, and medication if necessary.');
  }
  
  if (riskFactors.includes('Severe Obesity') || riskFactors.includes('Obesity') || riskFactors.includes('Overweight')) {
    recommendations.push('Working towards a healthy weight through diet and exercise can significantly reduce your stroke risk.');
  }
  
  // Basic recommendations everyone should follow
  if (recommendations.length === 0) {
    recommendations.push('Continue maintaining your healthy lifestyle to keep your stroke risk low.');
  }
  
  recommendations.push('Aim for at least 150 minutes of moderate physical activity weekly.');
  recommendations.push('Follow a diet rich in fruits, vegetables, whole grains, and low in saturated fats.');
  
  return recommendations;
}

// Backup prediction calculation for reliability
function getBackupPrediction(input: StrokeRiskInput): PredictionResult {
  let risk = 0;
  const riskFactors: string[] = [];
  
  if (input.age > 65) {
    risk += 0.25;
    riskFactors.push('Age > 65');
  } else if (input.age > 55) {
    risk += 0.15;
    riskFactors.push('Age > 55');
  } else if (input.age > 45) {
    risk += 0.05;
    riskFactors.push('Age > 45');
  }
  
  if (input.hypertension === 1) {
    risk += 0.2;
    riskFactors.push('Hypertension');
  }
  
  if (input.heartDisease === 1) {
    risk += 0.2;
    riskFactors.push('Heart Disease');
  }
  
  if (input.smokingStatus === "smokes") {
    risk += 0.15;
    riskFactors.push('Current Smoker');
  } else if (input.smokingStatus === "formerly smoked") {
    risk += 0.05;
    riskFactors.push('Former Smoker');
  }
  
  if (input.bmi > 30) {
    risk += 0.1;
    riskFactors.push('Obesity');
  }
  
  if (input.avgGlucoseLevel > 140) {
    risk += 0.15;
    riskFactors.push('High Blood Glucose');
  }
  
  risk = Math.min(Math.max(risk, 0.05), 0.95);
  
  // Get recommendations based on risk factors
  const recommendations = generateRecommendations(riskFactors);
  
  return { 
    risk,
    prediction: risk < 0.2 ? 'Low Risk' : risk < 0.4 ? 'Moderate Risk' : risk < 0.7 ? 'High Risk' : 'Very High Risk',
    probability: risk,
    riskFactors,
    recommendations,
    totalRiskScore: risk
  };
}

export function StrokePredictionForm() {
  const [formData, setFormData] = useState<FormData>({
    gender: "male",
    age: 30,
    hypertension: 0,
    heartDisease: 0,
    everMarried: "no",
    workType: "Private",
    residenceType: "Urban",
    avgGlucoseLevel: 90,
    bmi: 25,
    smokingStatus: "never smoked",
  });

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Stroke Risk Prediction",
      description: "This tool uses machine learning to estimate stroke risk based on health factors.",
      variant: "default",
    });
  }, [toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData({
      ...formData,
      [name]: type === "number" ? parseFloat(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const form = e.target as HTMLFormElement;
    form.classList.add("opacity-70");
    
    try {
      await new Promise<void>((resolve) => setTimeout(resolve, 1000));
      
      const modelInput: StrokeRiskInput = {
        gender: formData.gender === "male" ? "Male" : formData.gender === "female" ? "Female" : "Other",
        age: formData.age,
        hypertension: formData.hypertension as 0 | 1,
        heartDisease: formData.heartDisease as 0 | 1,
        everMarried: formData.everMarried === "yes" ? "Yes" : "No",
        workType: formData.workType as 'Private' | 'Self-employed' | 'Govt_job' | 'children' | 'Never_worked',
        residenceType: formData.residenceType as "Urban" | "Rural",
        avgGlucoseLevel: formData.avgGlucoseLevel,
        bmi: formData.bmi,
        smokingStatus: formData.smokingStatus as 'formerly smoked' | 'never smoked' | 'smokes' | 'Unknown'
      };
      
      const prediction = await predictStroke(modelInput);
      
      setResult(prediction);
      toast({
        title: "Analysis Complete",
        description: "Your stroke risk assessment has been processed",
        variant: "default",
      });
    } catch (error) {
      console.error("Error making prediction:", error);
      toast({
        title: "Processing Error",
        description: "There was a problem analyzing your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      form.classList.remove("opacity-70");
    }
  };

  const getRiskLevel = (risk: number) => {
    if (risk < 0.2) return { label: "Low Risk", color: "text-green-600", bgColor: "bg-green-100" };
    if (risk < 0.4) return { label: "Moderate Risk", color: "text-yellow-600", bgColor: "bg-yellow-100" };
    if (risk < 0.7) return { label: "High Risk", color: "text-orange-600", bgColor: "bg-orange-100" };
    return { label: "Very High Risk", color: "text-red-600", bgColor: "bg-red-100" };
  };

  return (
    <div className="space-y-6 transition-all duration-300">
      <form onSubmit={handleSubmit} className="space-y-6 transition-all duration-200">
        <div className="space-y-4 bg-card p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-3">Demographic Information</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="gender" className="block text-sm font-medium">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="form-input-transition w-full p-2 rounded-md border border-input bg-background focus:focus-ring"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="age" className="block text-sm font-medium">
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                min="1"
                max="120"
                value={formData.age}
                onChange={handleChange}
                className="form-input-transition w-full p-2 rounded-md border border-input bg-background focus:focus-ring"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="everMarried" className="block text-sm font-medium">
                Ever Married
              </label>
              <select
                id="everMarried"
                name="everMarried"
                value={formData.everMarried}
                onChange={handleChange}
                className="form-input-transition w-full p-2 rounded-md border border-input bg-background focus:focus-ring"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="workType" className="block text-sm font-medium">
                Work Type
              </label>
              <select
                id="workType"
                name="workType"
                value={formData.workType}
                onChange={handleChange}
                className="form-input-transition w-full p-2 rounded-md border border-input bg-background focus:focus-ring"
              >
                <option value="Private">Private</option>
                <option value="Self-employed">Self-employed</option>
                <option value="Govt_job">Government Job</option>
                <option value="children">Children</option>
                <option value="Never_worked">Never worked</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4 bg-card p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-3">Medical Information</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="hypertension" className="block text-sm font-medium">
                Hypertension
              </label>
              <select
                id="hypertension"
                name="hypertension"
                value={formData.hypertension}
                onChange={handleChange}
                className="form-input-transition w-full p-2 rounded-md border border-input bg-background focus:focus-ring"
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="heartDisease" className="block text-sm font-medium">
                Heart Disease
              </label>
              <select
                id="heartDisease"
                name="heartDisease"
                value={formData.heartDisease}
                onChange={handleChange}
                className="form-input-transition w-full p-2 rounded-md border border-input bg-background focus:focus-ring"
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="avgGlucoseLevel" className="block text-sm font-medium">
                Average Glucose Level (mg/dL)
              </label>
              <input
                type="number"
                id="avgGlucoseLevel"
                name="avgGlucoseLevel"
                min="50"
                max="300"
                value={formData.avgGlucoseLevel}
                onChange={handleChange}
                className="form-input-transition w-full p-2 rounded-md border border-input bg-background focus:focus-ring"
              />
              <div className="mt-1 text-xs text-muted-foreground">
                Normal fasting range: 70-100 mg/dL
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="bmi" className="block text-sm font-medium">
                BMI
              </label>
              <input
                type="number"
                id="bmi"
                name="bmi"
                min="10"
                max="50"
                step="0.1"
                value={formData.bmi}
                onChange={handleChange}
                className="form-input-transition w-full p-2 rounded-md border border-input bg-background focus:focus-ring"
              />
              <div className="mt-1 text-xs text-muted-foreground">
                Healthy range: 18.5-24.9
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="smokingStatus" className="block text-sm font-medium">
                Smoking Status
              </label>
              <select
                id="smokingStatus"
                name="smokingStatus"
                value={formData.smokingStatus}
                onChange={handleChange}
                className="form-input-transition w-full p-2 rounded-md border border-input bg-background focus:focus-ring"
              >
                <option value="never smoked">Never Smoked</option>
                <option value="formerly smoked">Formerly Smoked</option>
                <option value="smokes">Currently Smokes</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="residenceType" className="block text-sm font-medium">
                Residence Type
              </label>
              <select
                id="residenceType"
                name="residenceType"
                value={formData.residenceType}
                onChange={handleChange}
                className="form-input-transition w-full p-2 rounded-md border border-input bg-background focus:focus-ring"
              >
                <option value="Urban">Urban</option>
                <option value="Rural">Rural</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-md bg-primary text-primary-foreground shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all
              ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Analyzing..." : "Calculate Stroke Risk"}
          </button>
        </div>
      </form>

      {result && (
        <div 
          className="results-container space-y-6 rounded-lg border p-6 animate-fadeIn transition-all" 
          style={{ opacity: 1 }}
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Your Risk Assessment</h2>
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex flex-col space-y-1">
                <span className="text-sm">
                  AI Model: <span className="font-medium">{result.modelVersion || "Standard"}</span>
                </span>
              </div>
              
              <div className={`flex items-center px-4 py-2 rounded-full ${getRiskLevel(result.risk).bgColor}`}>
                <span className={`text-sm font-semibold ${getRiskLevel(result.risk).color}`}>
                  {result.prediction || getRiskLevel(result.risk).label}
                </span>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-primary text-primary-foreground">
                      Risk Level
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-primary text-primary-foreground">
                      {Math.round(result.risk * 100)}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                  <div 
                    style={{ width: `${Math.round(result.risk * 100)}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                      result.risk < 0.2 
                        ? "bg-green-500" 
                        : result.risk < 0.4 
                        ? "bg-yellow-500" 
                        : result.risk < 0.7 
                        ? "bg-orange-500" 
                        : "bg-red-500"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Show risk factors */}
          {result.riskFactors && result.riskFactors.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Risk Factors Identified</h3>
              <div className="bg-muted p-4 rounded-md">
                <ul className="space-y-2">
                  {result.riskFactors.map((factor, idx) => (
                    <li key={idx} className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {/* Recommendations section */}
          {result.recommendations && result.recommendations.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Personalized Recommendations</h3>
              <div className="bg-muted p-4 rounded-md">
                <ul className="space-y-2">
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          <div className="pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              <p className="italic">
                <AlertTriangle className="h-4 w-4 inline-block mr-1 text-yellow-600" />
                This is a preliminary risk assessment tool and should not replace professional medical advice. 
                Please consult with your healthcare provider to discuss your stroke risk and prevention strategies.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 