import { NextRequest, NextResponse } from 'next/server';
import { protectApiRoute } from '@/lib/auth';
import { predictStroke, StrokeRiskInput } from '@/lib/ml/stroke-model';
import { preloadModels } from '@/lib/ml/model-loader';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  return protectApiRoute(async () => {
    try {
      // Parse request body
      const body = await req.json();
      console.log('🔍 [API] Received stroke prediction request:', body);
      
      // Validate required fields
      const requiredFields = [
        'gender', 'age', 'hypertension', 'heartDisease', 
        'everMarried', 'workType', 'residenceType', 
        'avgGlucoseLevel', 'bmi', 'smokingStatus'
      ];
      
      const missingFields = requiredFields.filter(field => !(field in body));
      
      if (missingFields.length > 0) {
        console.warn(`❌ [API] Missing required fields: ${missingFields.join(', ')}`);
        return NextResponse.json(
          { error: `Missing required fields: ${missingFields.join(', ')}` },
          { status: 400 }
        );
      }
      
      // Preload stroke model to avoid cold starts - only when handling request
      try {
        await preloadModels(['stroke']);
      } catch (error) {
        console.warn('❓ [API] Failed to preload stroke model:', error);
        // Continue with prediction - the model loader will handle fallbacks
      }
      
      // Parse input data
      const inputData: StrokeRiskInput = {
        gender: body.gender,
        age: Number(body.age),
        hypertension: Number(body.hypertension) as 0 | 1,
        heartDisease: Number(body.heartDisease) as 0 | 1,
        everMarried: body.everMarried,
        workType: body.workType,
        residenceType: body.residenceType,
        avgGlucoseLevel: Number(body.avgGlucoseLevel),
        bmi: Number(body.bmi),
        smokingStatus: body.smokingStatus
      };
      
      console.log('🚀 [API] Calling predictStroke with data:', inputData);
      
      // Optional parameters
      const options = {
        version: body.version,
        forceRefresh: body.forceRefresh === true
      };
      
      // Run prediction
      const prediction = await predictStroke(inputData, options);
      console.log('✅ [API] Prediction result:', prediction);
      
      // Generate recommendations based on risk factors if not already present
      if (prediction.riskFactors && Array.isArray(prediction.riskFactors)) {
        // Define a type that extends the base prediction with our additional fields
        type EnhancedPrediction = typeof prediction & {
          recommendations?: string[];
        };
        
        const enhancedPrediction = prediction as EnhancedPrediction;
        if (!enhancedPrediction.recommendations) {
          enhancedPrediction.recommendations = generateRecommendations(prediction.riskFactors);
          console.log('✨ [API] Generated recommendations:', enhancedPrediction.recommendations);
        }
      }
      
      // Log activity for stroke risk calculation
      try {
        const userId = req.headers.get('x-user-id');
        
        if (userId) {
          const Activity = mongoose.models.Activity || 
            (await import("@/lib/models/Activity")).default;
          
          await Activity.create({
            user: userId,
            activityType: "stroke-risk-calculated",
            completedAt: new Date(),
            duration: 0, // Immediate calculation
            metadata: {
              riskProbability: prediction.probability,
              riskCategory: prediction.prediction,
              riskFactors: prediction.riskFactors || [],
              inputData: {
                age: inputData.age,
                gender: inputData.gender,
                // Include non-sensitive data
                bmi: inputData.bmi,
                smokingStatus: inputData.smokingStatus,
                workType: inputData.workType,
                residenceType: inputData.residenceType
              }
            }
          });
          
          console.log(`✅ [API] Activity logged for user ${userId}`);
        }
      } catch (activityError) {
        console.error("❌ [API] Error logging activity:", activityError);
        // Don't fail the whole request if activity logging fails
      }
      
      // Return the prediction result
      return NextResponse.json(prediction);
    } catch (error) {
      console.error('❌ [API] Stroke prediction error:', error);
      
      return NextResponse.json(
        { error: 'Failed to process stroke risk prediction' },
        { status: 500 }
      );
    }
  });
}

// Function to generate recommendations based on risk factors
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
  
  if (riskFactors.some(factor => factor.includes('Blood Glucose'))) {
    recommendations.push('Consult with your doctor about managing your blood glucose levels through diet, exercise, and medication if necessary.');
  }
  
  if (riskFactors.some(factor => factor.includes('Obesity') || factor.includes('Overweight'))) {
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

// GET method for model information
export async function GET() {
  return protectApiRoute(async () => {
    return NextResponse.json({
      modelInfo: {
        name: 'Enhanced Stroke Risk Prediction Model',
        description: 'Predicts the risk of stroke based on various health and demographic factors with weighted risk analysis',
        features: [
          'Gender', 'Age', 'Hypertension', 'Heart Disease',
          'Marital Status', 'Work Type', 'Residence Type',
          'Average Glucose Level', 'BMI', 'Smoking Status'
        ],
        outputClasses: [
          'Very Low Risk', 'Low Risk', 'Moderate Risk',
          'High Risk', 'Very High Risk'
        ],
        version: 'enhanced-v2',
        lastUpdated: new Date().toISOString()
      }
    });
  });
}