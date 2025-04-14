import { NextRequest, NextResponse } from "next/server";
import { withAuth, createErrorResponse } from "@/lib/auth";
import db from "@/lib/mongodb";
import Assessment from "@/lib/models/Assessment";
import mongoose from "mongoose";

// URLs for the Hugging Face model APIs
const TUMOR_DETECTION_API = "https://abdullah1211-ml-tumour.hf.space/api/predict";
const ALZHEIMERS_API = "https://abdullah1211-ml-alzheimers.hf.space/api/predict";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function analyzeScanWithModel(fileUrl: string, scanType: 'tumor' | 'alzheimers') {
  try {
    // Create a form data object
    const formData = new FormData();
    
    // Add the file URL to the form data
    formData.append('fileUrl', fileUrl);
    
    // Determine which API to call based on scan type
    const apiUrl = scanType === 'tumor' ? TUMOR_DETECTION_API : ALZHEIMERS_API;
    
    console.log(`🚀 [Hugging Face] Sending request to ${apiUrl} with file: ${fileUrl}`);
    const requestStartTime = Date.now();
    
    // Call the Hugging Face model API
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    });
    
    const requestDuration = Date.now() - requestStartTime;
    console.log(`⏱️ [Hugging Face] Response received in ${requestDuration}ms with status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`API responded with ${response.status}: ${response.statusText}`);
    }
    
    // Parse the results
    const result = await response.json();
    console.log(`✅ [Hugging Face] API call successful - Model: ${scanType}`, {
      prediction: result.prediction,
      confidence: result.confidence
    });
    
    // Return formatted results
    return {
      conclusion: result.prediction,
      confidence: result.confidence,
      processingTime: new Date().toISOString(),
      raw: result,
      modelUsed: scanType === 'tumor' ? 'Brain Tumor Detection' : 'Alzheimer\'s Detection',
      apiResponseTime: requestDuration
    };
  } catch (error: unknown) {
    console.error(`❌ [Hugging Face] Error analyzing scan with ${scanType} model:`, error);
    // Return error information
    return {
      conclusion: "Analysis failed",
      confidence: 0,
      error: error instanceof Error ? error.message : String(error),
      fallbackUsed: true
    };
  }
}

export const POST = withAuth(async (request: NextRequest, userId: string) => {
  try {
    // Handle form data
    const formData = await request.formData();
    const scanType = formData.get("scanType") as 'tumor' | 'alzheimers' || 'tumor';
    const fileUrl = formData.get("fileUrl") as string;
    
    if (!fileUrl) {
      return createErrorResponse("No file URL provided", 400);
    }
    
    console.log(`📝 [Brain Scan] Processing scan from URL: ${fileUrl}`);
    
    // Create assessment record
    await db.connect();
    
    const assessmentData = {
      userId,
      type: scanType,
      result: 'Analyzing...',
      risk: 'pending',
      data: { 
        fileUrl,
        status: 'processing',
        submitted: new Date(),
        modelStatus: 'processing'
      },
      date: new Date(),
    };
    
    const assessment = await Assessment.create(assessmentData);
    
    console.log("✅ [Brain Scan] Assessment record created");
    
    // Process the scan asynchronously to not block the response
    (async () => {
      try {
        // Call the model API
        const analysisResult = await analyzeScanWithModel(fileUrl, scanType);
        
        // Update the database with results
        await db.connect();
        await Assessment.findByIdAndUpdate(assessment._id, {
          result: analysisResult.conclusion,
          risk: analysisResult.confidence > 0.7 ? "high" : 
               analysisResult.confidence > 0.3 ? "moderate" : "low",
          "data.status": "completed",
          "data.result": analysisResult
        });
        
        // Log activity for the completed assessment
        try {
          const Activity = mongoose.models.Activity || 
            (await import("@/lib/models/Activity")).default;
          
          await Activity.create({
            user: assessment.userId,
            activityType: "assessment-completed",
            completedAt: new Date(),
            duration: (Date.now() - new Date(assessment.date).getTime()) / 1000, // Convert ms to seconds
            metadata: {
              assessmentId: assessment._id,
              assessmentType: scanType,
              result: analysisResult.conclusion,
              confidence: analysisResult.confidence,
              risk: analysisResult.confidence > 0.7 ? "high" : 
                   analysisResult.confidence > 0.3 ? "moderate" : "low",
            }
          });
          
          console.log(`✅ [Brain Scan] Activity logged for user ${assessment.userId} - ${scanType} assessment`);
        } catch (activityError) {
          console.error("❌ [Brain Scan] Error logging activity:", activityError);
          // Don't fail the whole process if activity logging fails
        }
        
        console.log(`✅ [Brain Scan] Analysis completed for ${assessment._id}`);
      } catch (err: unknown) {
        console.error("❌ [Brain Scan] Error in analysis:", err);
        
        // Update with error information
        await db.connect();
        await Assessment.findByIdAndUpdate(assessment._id, {
          result: "Analysis failed",
          "data.status": "failed",
          "data.error": err instanceof Error ? err.message : String(err)
        });
      }
    })();
    
    return NextResponse.json({
      message: "Scan uploaded successfully and queued for analysis",
      assessmentId: assessment._id,
      status: "processing",
      modelStatus: "processing",
      estimatedTime: "10-30 seconds"
    });
    
  } catch (error) {
    console.error("Brain scan upload error:", error);
    return createErrorResponse("Failed to process brain scan", 500);
  }
}); 