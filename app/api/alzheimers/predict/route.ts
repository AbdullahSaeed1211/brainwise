import { NextRequest, NextResponse } from "next/server";
import { withAuth, createErrorResponse } from "@/lib/auth";
import db from "@/lib/mongodb";
import User from "@/lib/models/User";
import Assessment from "@/lib/models/Assessment";
import { predictAlzheimers } from "@/lib/ml/alzheimers-model";
import { preloadModels } from "@/lib/ml/model-loader";
import mongoose from "mongoose";

export const POST = withAuth(async (request: NextRequest, userId: string) => {
  try {
    // Preload alzheimers model to avoid cold starts if possible
    try {
      await preloadModels(['alzheimers']);
    } catch (error) {
      console.warn('Failed to preload alzheimer\'s model:', error);
    }

    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['age', 'sex', 'education', 'memoryComplaints', 'familyHistory', 
                           'cognitiveAssessment', 'mobility', 'independentLiving'];
    const missingFields = requiredFields.filter(field => body[field] == null);
    
    if (missingFields.length > 0) {
      return createErrorResponse(`Missing required fields: ${missingFields.join(', ')}`, 400);
    }
    
    // Process risk factors
    const riskFactors = [];
    if (body.age > 65) riskFactors.push('Age > 65');
    if (body.memoryComplaints) riskFactors.push('Memory Complaints');
    if (body.familyHistory) riskFactors.push('Family History');
    if (body.cognitiveAssessment < 24) riskFactors.push('Low Cognitive Score');
    if (body.mobility === 'limited') riskFactors.push('Limited Mobility');
    if (body.independentLiving === 'needs assistance') riskFactors.push('Needs Assistance');
    
    // Connect to database
    await db.connect();
    
    // Get user record
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return createErrorResponse("User not found", 404);
    }
    
    // Optional parameters
    const options = {
      version: body.version,
      forceRefresh: body.forceRefresh === true
    };
    
    // Run prediction using ML model
    const inputData = {
      age: Number(body.age),
      sex: body.sex,
      education: body.education,
      memoryComplaints: body.memoryComplaints,
      familyHistory: body.familyHistory, 
      cognitiveAssessment: Number(body.cognitiveAssessment),
      mobility: body.mobility,
      independentLiving: body.independentLiving
    };
    
    const prediction = await predictAlzheimers(inputData, options);
    
    // Save the assessment result
    const assessment = await Assessment.create({
      user: user._id,
      type: 'alzheimers-risk',
      result: prediction.prediction,
      risk: prediction.riskLevel,
      data: {
        ...inputData,
        riskFactors,
        modelVersion: prediction.modelVersion,
        probability: prediction.probability
      },
      date: new Date()
    });
    
    // Log activity for completed assessment
    try {
      const Activity = mongoose.models.Activity || 
        (await import("@/lib/models/Activity")).default;
      
      await Activity.create({
        user: user._id,
        activityType: "assessment-completed",
        completedAt: new Date(),
        duration: 0, // Immediate calculation
        metadata: {
          assessmentId: assessment._id,
          assessmentType: 'alzheimers-risk',
          result: prediction.prediction,
          riskLevel: prediction.riskLevel,
          probability: prediction.probability,
          riskFactors: riskFactors
        }
      });
      
      console.log(`✅ [Alzheimer's Risk] Activity logged for user ${user._id}`);
    } catch (activityError) {
      console.error("❌ [Alzheimer's Risk] Error logging activity:", activityError);
      // Don't fail the whole request if activity logging fails
    }
    
    // Return prediction results
    return NextResponse.json({
      prediction: prediction.prediction,
      probability: prediction.probability,
      riskLevel: prediction.riskLevel,
      riskFactors,
      modelVersion: prediction.modelVersion,
      inferenceTimeMs: prediction.inferenceTimeMs
    });
    
  } catch (error) {
    console.error("Error in Alzheimer's prediction:", error);
    return createErrorResponse("Failed to process Alzheimer's risk assessment", 500);
  }
});

// Optionally, you can add a GET method for model information
export async function GET() {
  return NextResponse.json({
    modelInfo: {
      name: "Alzheimer's Risk Prediction Model",
      description: "Predicts the risk of Alzheimer's disease based on various risk factors",
      features: [
        'Age', 'Sex', 'Education', 'Memory Complaints',
        'Family History', 'Cognitive Assessment Score',
        'Mobility Status', 'Independent Living Status'
      ],
      outputClasses: [
        'Very Low Risk', 'Low Risk', 'Moderate Risk',
        'High Risk', 'Very High Risk'
      ],
      version: 'latest',
      status: 'active'
    }
  });
} 