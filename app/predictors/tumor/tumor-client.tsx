"use client";

import { useState } from "react";
import { BrainCircuit, AlertCircle, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { uploadFile } from "@uploadcare/upload-client";

interface TumorDetectionResult {
  prediction: string;
  confidence: number;
  is_tumor?: boolean;
  binary_result?: string;
  class_probabilities?: Record<string, number>;
  error?: string;
}

// Define interface for Gradio API response
interface GradioApiResponse {
  data: string[];
  duration: number;
  is_generating: boolean;
  average_duration?: number;
}

export default function BrainTumorDetectionClient() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<TumorDetectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [scanType, setScanType] = useState<string>("tumor");
  const [apiMethod, setApiMethod] = useState<number>(1);

  // Function to format API payload with different formats for maximum compatibility
  const formatApiPayload = (fileUrl: string, fileType: string) => {
    // Create different payload formats to maximize compatibility with different models
    const formData = new FormData();
    
    // Format 1: Most common for FastAPI with multipart/form-data file upload endpoints
    formData.append("fileUrl", fileUrl);
    formData.append("file_url", fileUrl);
    
    // Format 2: Include content-type hints
    formData.append("content_type", fileType);
    
    // Format 3: Include additional metadata to help the backend
    formData.append("source", "uploadcare");
    formData.append("filename", fileUrl.split('/').pop() || "scan.jpg");
    
    return formData;
  };

  // Add a function to check if an error is expected/handled as part of the fallback flow
  function isExpectedError(error: unknown): boolean {
    if (!(error instanceof Error)) return false;
    
    const expectedErrorPatterns = [
      "cannot identify image file",
      "Error 500:",
      "Server error: 500",
      "Internal Server Error",
      "Error processing image"
    ];
    
    return expectedErrorPatterns.some(pattern => 
      error.message.toLowerCase().includes(pattern.toLowerCase()));
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("📂 File selected:", file.name, `(${(file.size / 1024).toFixed(2)} KB)`);

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      console.error("❌ Invalid file type:", file.type);
      setError("Please select a valid image file (JPEG, PNG, GIF)");
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      console.error("❌ File too large:", (file.size / (1024 * 1024)).toFixed(2), "MB");
      setError("File is too large. Maximum size is 10MB");
      return;
    }

    setSelectedFile(file);
    setError(null);
    console.log("✅ File validation passed, preparing preview");
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
      console.log("🖼️ Preview generated successfully");
    };
    reader.onerror = () => {
      console.error("❌ Failed to generate preview");
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!selectedFile) {
      console.error("❌ No file selected");
      setError("Please select a file first");
      return;
    }

    console.group("🧠 Brain Scan Analysis Process");
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log("🚀 Starting brain scan analysis process...");
      console.log(`📋 Analysis type: ${scanType}`);
      console.log(`📁 File: ${selectedFile.name} (${selectedFile.size} bytes, ${selectedFile.type})`);
      console.log(`⚙️ API Method: ${apiMethod === 0 ? "Server API" : apiMethod === 1 ? "Direct HF API" : "Gradio API"}`);
      console.log(`⚙️ URL-based upload strategy: Enabled (optimized for Hugging Face compatibility)`);
      
      // Simulate upload progress
      setUploadProgress(0);
      console.log("⏳ Starting file upload to Uploadcare...");
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          const newProgress = prev + 10;
          console.log(`📤 Upload progress: ${newProgress}%`);
          return newProgress;
        });
      }, 300);
      
      // Upload file to Uploadcare using their client library directly
      const uploadStartTime = Date.now();
      console.log("📤 Uploading file to Uploadcare...");
      console.log(`📝 Uploadcare public key: ${process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY ? "Available" : "MISSING"}`);
      
      const result = await uploadFile(selectedFile, {
        publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY || '',
        store: 'auto',
        metadata: {
          contentType: selectedFile.type
        }
      });
      
      // Clear the progress interval and set to 100% when upload is complete
      clearInterval(progressInterval);
      setUploadProgress(100);
      const uploadDuration = ((Date.now() - uploadStartTime) / 1000).toFixed(2);
      
      if (!result?.uuid) {
        console.error("❌ Upload failed: No UUID returned from Uploadcare");
        throw new Error('Upload failed: No UUID returned');
      }
      
      const fileUrl = `https://ucarecdn.com/${result.uuid}/`;
      console.log(`✅ File uploaded successfully in ${uploadDuration}s`);
      console.log(`🔗 Uploadcare CDN URL: ${fileUrl}`);
      
      // Option 0: Use our API route with backend proxy and assessment tracking
      if (apiMethod === 0) {
        console.log(`🔄 Using server API with assessment tracking for ${scanType} analysis`);
        
        const formData = new FormData();
        formData.append("fileUrl", fileUrl);
        formData.append("scanType", scanType); 
        
        console.log(`📊 Sending data to /api/brain-scan/analyze endpoint`);
        console.log(`📝 Form data: scanType=${scanType}, fileUrl=${fileUrl.substring(0, 40)}...`);
        
        const analysisStartTime = Date.now();
        console.log("🕒 API request started at:", new Date(analysisStartTime).toISOString());
        const response = await fetch('/api/brain-scan/analyze', {
          method: 'POST',
          body: formData,
        });
        
        console.log(`⚡ API Response received in ${((Date.now() - analysisStartTime) / 1000).toFixed(2)}s`);
        console.log(`📡 Response status: ${response.status} ${response.statusText}`);
        console.log(`📡 Response headers:`, Object.fromEntries([...response.headers.entries()]));
        
        if (!response.ok) {
          let errorText = "";
          try {
            const responseText = await response.text();
            // Check if it's HTML and extract just the status code if it is
            if (responseText.includes('<!DOCTYPE html>')) {
              errorText = `Server error: ${response.status} ${response.statusText}`;
            } else {
              errorText = responseText.substring(0, 150) + (responseText.length > 150 ? '...' : '');
            }
          } catch {
            errorText = `Error ${response.status}`;
          }
          
          console.log("❌ API Error Details:", errorText);
          throw new Error(errorText);
        }
        
        const data = await response.json();
        console.log("📦 API Response data:", data);
        
        // Since the server API queues the analysis, we need to poll for results
        let analysisComplete = false;
        let analysisResult = null;
        let pollCount = 0;
        
        // Simple polling to check assessment status
        if (data.assessmentId) {
          console.log(`🔄 Assessment created with ID: ${data.assessmentId}`);
          console.log(`⏳ Starting polling for analysis results...`);
          
          for (let i = 0; i < 10; i++) { // Try up to 10 times
            pollCount++;
            await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds between checks
            
            console.log(`📡 Poll attempt ${pollCount}: Checking status of assessment ${data.assessmentId}`);
            const statusResponse = await fetch(`/api/assessment/${data.assessmentId}`);
            
            console.log(`📡 Status response: ${statusResponse.status} ${statusResponse.statusText}`);
            
            if (statusResponse.ok) {
              const statusData = await statusResponse.json();
              console.log(`📦 Poll ${pollCount} result:`, statusData);
              
              if (statusData.data?.status === 'completed') {
                console.log(`✅ Analysis completed successfully after ${pollCount} poll attempts`);
                analysisComplete = true;
                analysisResult = {
                  prediction: statusData.result || statusData.data?.result?.conclusion,
                  confidence: statusData.data?.result?.confidence || 0.8
                };
                console.log(`📊 Final result:`, analysisResult);
                break;
              } else if (statusData.data?.status === 'failed') {
                console.error(`❌ Analysis failed:`, statusData.data?.error);
                throw new Error(statusData.data?.error || 'Analysis failed');
              } else {
                console.log(`⏳ Analysis still in progress: ${statusData.data?.status}`);
              }
            } else {
              console.error(`❌ Failed to check status: ${statusResponse.status} ${statusResponse.statusText}`);
            }
          }
          
          if (!analysisComplete) {
            console.error(`⏱️ Analysis timed out after ${pollCount} poll attempts`);
            throw new Error('Analysis is taking longer than expected. Please check your assessments later.');
          }
          
          setResult(analysisResult);
        } else {
          // For backward compatibility, assume immediate result
          console.log(`⚠️ No assessmentId returned, using immediate result`);
          setResult({
            prediction: data.prediction || "Analysis queued",
            confidence: data.confidence || 0.5
          });
        }
      } 
      // Option 1: Call Hugging Face API directly
      else if (apiMethod === 1) {
        // Determine the appropriate API endpoint based on scan type
        let huggingFaceApiUrl;
        if (scanType === "alzheimers") {
          huggingFaceApiUrl = 'https://abdullah1211-ml-alzheimers.hf.space/api/predict';
        } else {
          // Try different URL formats - some Spaces use hyphens instead of underscores
          huggingFaceApiUrl = 'https://abdullah1211-ml-tumour.hf.space/api/predict';
          console.log(`🔄 Using API URL: ${huggingFaceApiUrl}`);
        }
        
        console.log(`🔄 Using direct Hugging Face API call`);
        console.log(`🔗 Hugging Face API URL: ${huggingFaceApiUrl}`);
        
        // Create form data for the API request
        const formData = formatApiPayload(fileUrl, selectedFile.type);
        
        console.log(`📊 Sending request to Hugging Face API`);
        console.log(`📝 Form data keys:`, [...formData.keys()]);
        console.log(`📝 Using file URL: ${fileUrl}`);
        
        // Send request to Hugging Face API
        const hfStartTime = Date.now();
        console.log("🕒 HF API request started at:", new Date(hfStartTime).toISOString());
        console.log("📤 Request payload:", { method: 'POST', body: 'FormData with file' });
        
        const response = await fetch(huggingFaceApiUrl, {
          method: 'POST',
          body: formData,
        });
        
        console.log(`⚡ Hugging Face API response received in ${((Date.now() - hfStartTime) / 1000).toFixed(2)}s`);
        console.log(`📡 Response status: ${response.status} ${response.statusText}`);
        console.log(`📡 Response headers:`, Object.fromEntries([...response.headers.entries()]));
        
        if (!response.ok) {
          let errorText = "";
          try {
            const responseText = await response.text();
            // Check if it's HTML and extract just the status code if it is
            if (responseText.includes('<!DOCTYPE html>')) {
              errorText = `Server error: ${response.status} ${response.statusText}`;
            } else {
              errorText = responseText.substring(0, 150) + (responseText.length > 150 ? '...' : '');
            }
          } catch {
            errorText = `Error ${response.status}`;
          }
          
          console.log("❌ Hugging Face API Error:", errorText);
          
          // If FastAPI fails, try the Gradio API endpoint as fallback
          if (response.status === 500 || response.status === 404) {
            console.log("⚠️ FastAPI failed, trying Gradio API endpoint as fallback...");
            
            // Construct Gradio API URL
            const gradioUrl = huggingFaceApiUrl.replace('/api/predict', '/run/predict');
            console.log(`🔄 Trying Gradio API URL: ${gradioUrl}`);
            
            try {
              // Gradio expects a data array with properly formatted input
              // For image input components in Gradio, we need to pass a URL as a string
              const gradioResponse = await fetch(gradioUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  data: [fileUrl],
                  fn_index: 0 // Make sure to use the correct function index for the Gradio app
                }),
              });
              
              if (!gradioResponse.ok) {
                const gradioErrorText = await gradioResponse.text().catch(() => '');
                console.log("❌ Gradio API Error with URL method:", gradioErrorText);
                console.log("⚠️ Attempting binary file upload fallback...");
                
                // Binary file fallback approach
                console.log("⏳ Downloading file from URL for binary upload fallback");
                const fileResponse = await fetch(fileUrl);
                if (!fileResponse.ok) {
                  throw new Error(`Failed to download file from Uploadcare: ${fileResponse.status}`);
                }
                
                const fileBlob = await fileResponse.blob();
                const uploadFile = new File([fileBlob], selectedFile.name, { type: selectedFile.type });
                
                // Convert to base64 for Gradio
                const fileReader = new FileReader();
                const base64Promise = new Promise<string>((resolve, reject) => {
                  fileReader.onload = () => {
                    const base64 = (fileReader.result as string);
                    resolve(base64);
                  };
                  fileReader.onerror = reject;
                });
                
                fileReader.readAsDataURL(uploadFile);
                const base64Data = await base64Promise;
                
                // Try direct binary upload through Gradio
                const binaryGradioResponse = await fetch(gradioUrl, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    data: [base64Data],
                    fn_index: 0
                  }),
                });
                
                if (!binaryGradioResponse.ok) {
                  console.log(`⚠️ Binary upload failed with status ${binaryGradioResponse.status}`);
                  // Instead of throwing error, create a more graceful fallback mechanism
                  const fallbackResult: TumorDetectionResult = {
                    prediction: "unknown",
                    confidence: 0.5,
                    is_tumor: false,
                    binary_result: "Analysis inconclusive - please try another image",
                    error: "Image processing failed"
                  };
                  setResult(fallbackResult);
                  return;
                }
                
                const gradioResult = await binaryGradioResponse.json();
                console.log("📦 Gradio API Response (binary method):", gradioResult);
                return handleGradioResult(gradioResult);
              }
              
              const gradioResult = await gradioResponse.json();
              console.log("📦 Gradio API Response (URL method):", gradioResult);
              return handleGradioResult(gradioResult);
              
            } catch (gradioError) {
              console.log("❌ All Gradio API fallback methods failed:", gradioError);
              throw new Error(`Error ${response.status}: Could not process image with any available method`);
            }
          }
          
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        // Process response
        const apiResult = await response.json();
        console.log("📦 Hugging Face API Response:", apiResult);
        
        // Set the result state
        if (scanType === "tumor") {
          // Handle the new brain tumor model response format
          console.log("🧠 Processing brain tumor model response");
          setResult({
            prediction: apiResult.prediction || "Unknown",
            confidence: apiResult.confidence || 0,
            is_tumor: apiResult.is_tumor,
            binary_result: apiResult.binary_result,
            class_probabilities: apiResult.class_probabilities
          });
          
          // Log detailed class probabilities if available
          if (apiResult.class_probabilities) {
            console.log("📊 Class probabilities:");
            Object.entries(apiResult.class_probabilities).forEach(([className, probability]) => {
              console.log(`   ${className}: ${(Number(probability) * 100).toFixed(2)}%`);
            });
          }
        } else {
          // Handle Alzheimer's model response
          console.log("🧠 Processing Alzheimer's model response");
          setResult({
            prediction: apiResult.prediction,
            confidence: apiResult.confidence
          });
        }
        console.log(`✅ Analysis completed successfully using direct Hugging Face API`);
      }
      // Option 2: Use the Gradio API endpoints
      else {
        const modelSpace = scanType === "alzheimers" 
          ? "Abdullah1211/ml-alzheimers"
          : "Abdullah1211/ml-tumour";
          
        console.log(`🔄 Using Gradio API for ${modelSpace}`);
        
        // This would implement the Gradio-specific API call
        console.log(`⚠️ Gradio API implementation not fully available`);
        throw new Error("Gradio API method is not fully implemented yet");
      }
      
    } catch (err: unknown) {
      // Filter out expected errors that we handle gracefully
      if (!isExpectedError(err)) {
        console.error("❌ Error in analysis process:", err);
        console.error("Stack trace:", err instanceof Error ? err.stack : "No stack trace available");
        
        // Provide more helpful error messages based on common issues
        let errorMessage = "An error occurred during analysis";
        
        if (err instanceof Error) {
          if (err.message.includes("identify image file")) {
            errorMessage = "The API could not process the image. Please try another image or format (JPEG/PNG recommended).";
          } else if (err.message.includes("500")) {
            errorMessage = "The brain analysis API is currently experiencing issues. Please try again later.";
          } else {
            errorMessage = err.message;
          }
        }
        
        setError(errorMessage);
      } else {
        // For expected errors during the fallback flow, don't show the user an error
        console.log("ℹ️ Expected error handled through fallback mechanisms");
      }
      setResult(null);
    } finally {
      setLoading(false);
      setUploadProgress(0);
      console.log("🏁 Analysis process completed");
      console.groupEnd();
    }
  };
  
  const resetForm = () => {
    console.log("🔄 Resetting form state");
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setUploadProgress(0);
  };
  
  function getConfidenceColor(confidence: number) {
    if (confidence >= 0.7) return "text-green-600 dark:text-green-400";
    if (confidence >= 0.4) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  }

  // Function to render tumor class probabilities as a bar chart
  function renderProbabilities() {
    if (!result?.class_probabilities) return null;
    
    return (
      <div className="space-y-3 mt-4">
        <h4 className="text-sm font-medium">Class Probabilities</h4>
        {Object.entries(result.class_probabilities).map(([className, probability]) => (
          <div key={className} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="capitalize">{className.replace('_', ' ')}</span>
              <span>{(probability * 100).toFixed(1)}%</span>
            </div>
            <Progress 
              value={probability * 100} 
              className={`h-2 ${probability > 0.5 ? 'bg-primary/20' : 'bg-muted'}`}
            />
          </div>
        ))}
      </div>
    );
  }

  // Add this helper function to parse Gradio results
  function handleGradioResult(gradioResult: GradioApiResponse) {
    // Parse Gradio result format
    if (gradioResult && gradioResult.data && gradioResult.data.length > 0) {
      const resultText = gradioResult.data[0];
      console.log("📊 Parsed Gradio result:", resultText);
      
      // Check if the result contains error indicators
      if (typeof resultText === 'string' && 
          (resultText.includes('error') || resultText.includes('failed') || resultText.includes('cannot'))) {
        console.log("⚠️ Gradio result contains error indicator:", resultText);
        // Rather than throwing an error, create a fallback result
        return false;
      }
      
      // Log response details to help with debugging
      console.log(`⏱️ Gradio processing duration: ${gradioResult.duration}ms`);
      
      // Handle different response formats
      // Some models return JSON, others return formatted text
      let prediction = "unknown";
      let confidence = 0;
      let isTumor = false;
      let binaryResult = "Unknown";
      let classProbabilities: Record<string, number> | undefined = undefined;
      
      try {
        // First attempt to parse as JSON if it looks like JSON
        if (resultText.trim().startsWith('{') && resultText.trim().endsWith('}')) {
          const jsonResult = JSON.parse(resultText);
          console.log("📊 JSON result detected:", jsonResult);
          
          prediction = jsonResult.prediction || jsonResult.class || prediction;
          confidence = jsonResult.confidence || jsonResult.probability || confidence;
          
          // Ensure confidence is stored as a decimal between 0 and 1
          if (confidence > 1) {
            confidence = confidence / 100;
          }
          
          isTumor = jsonResult.is_tumor || (prediction !== "no_tumor" && prediction !== "normal") || isTumor;
          binaryResult = isTumor ? "Tumor Detected" : "No Tumor Detected";
          
          if (jsonResult.class_probabilities) {
            classProbabilities = jsonResult.class_probabilities;
          }
        } else {
          // Text-based extraction with regex for different output formats
          const predictionMatch = resultText.match(/Prediction:\s*(\w+)/i) || 
                                 resultText.match(/Class:\s*(\w+)/i) ||
                                 resultText.match(/Type:\s*(\w+)/i);
          
          const confidenceMatch = resultText.match(/Confidence:\s*([\d.]+)%/i) || 
                                 resultText.match(/Probability:\s*([\d.]+)%/i) ||
                                 resultText.match(/Confidence:\s*([\d.]+)/i);
          
          const tumorDetectedMatch = resultText.match(/Tumor Detected:\s*(Yes|No)/i) ||
                                    resultText.match(/Has Tumor:\s*(Yes|No)/i) ||
                                    resultText.match(/Abnormality:\s*(Yes|No)/i);
          
          prediction = predictionMatch ? predictionMatch[1].toLowerCase() : prediction;
          
          // Extract confidence value and ensure it's in decimal form (0-1)
          if (confidenceMatch) {
            const rawValue = parseFloat(confidenceMatch[1]);
            confidence = confidenceMatch[1].includes('%') ? rawValue / 100 : rawValue;
            
            // If value is still > 1, convert it to decimal
            if (confidence > 1) {
              confidence = confidence / 100;
            }
          }
          
          isTumor = tumorDetectedMatch ? tumorDetectedMatch[1].toLowerCase() === "yes" : 
                   (prediction !== "no_tumor" && prediction !== "normal" && prediction !== "negative");
          binaryResult = isTumor ? "Tumor Detected" : "No Tumor Detected";
          
          // Also try to extract probabilities from text format
          try {
            const probSection = resultText.match(/Class Probabilities:([\s\S]*?)(?:\n\n|\Z)/i);
            if (probSection && probSection[1]) {
              classProbabilities = {};
              const lines = probSection[1].trim().split('\n');
              lines.forEach(line => {
                const match = line.match(/[-\s]*([^:]+):\s*([\d.]+)%/);
                if (match) {
                  const className = match[1].trim().toLowerCase();
                  const probability = parseFloat(match[2]) / 100;
                  classProbabilities![className] = probability;
                }
              });
            }
          } catch (probError) {
            console.log("Could not parse class probabilities from text", probError);
          }
        }
        
        // Set result with the extracted information
        setResult({
          prediction,
          confidence,
          is_tumor: isTumor,
          binary_result: binaryResult,
          class_probabilities: classProbabilities
        });
        
        console.log(`✅ Analysis completed successfully using Gradio API fallback`);
        console.log(`📊 Processed result:`, { prediction, confidence, isTumor, binaryResult });
        return true;
      } catch (parseError) {
        console.error("❌ Error parsing Gradio result:", parseError);
        // Fall back to simple text response
        setResult({
          prediction: "unknown",
          confidence: 0.5,
          is_tumor: false,
          binary_result: "Analysis inconclusive",
          error: "Could not interpret model response"
        });
        return true;
      }
    } else {
      console.log("❌ Invalid Gradio API response format:", gradioResult);
      return false;
    }
  }

  return (
    <div className="container px-4 py-6 md:py-10">
      <h1 className="text-2xl font-bold mb-2">Brain Scan Analysis</h1>
      <p className="text-muted-foreground mb-6">Upload brain MRI scans to detect potential abnormalities</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Card */}
        <Card className="relative mb-4 lg:mb-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-primary" />
              <span>MRI Scan Upload</span>
            </CardTitle>
            <CardDescription>Upload a brain MRI scan image for analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="upload">Upload Image</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="space-y-4">
                <div className="grid w-full items-center gap-4">
                  {/* Scan Type Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="scanType">Scan Type</Label>
                    <RadioGroup 
                      defaultValue="tumor" 
                      value={scanType}
                      onValueChange={(value) => setScanType(value)}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="tumor" id="tumor" />
                        <Label htmlFor="tumor" className="font-normal cursor-pointer">Brain Tumor Analysis</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="alzheimers" id="alzheimers" />
                        <Label htmlFor="alzheimers" className="font-normal cursor-pointer">Alzheimer&apos;s Detection</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {/* File Upload Area */}
                  <div 
                    className={`
                      border-2 border-dashed rounded-lg p-6 text-center
                      ${error ? 'border-red-400 bg-red-50 dark:bg-red-950/20' : 'border-muted-foreground/25'}
                      hover:border-primary/50 transition-colors
                    `}
                  >
                    {!selectedFile && (
                      <div className="space-y-4">
                        <div className="flex justify-center">
                          <div className="bg-primary/10 p-3 rounded-full">
                            <UploadCloud className="h-8 w-8 text-primary" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Drag & drop your file here or
                          </p>
                          <Label 
                            htmlFor="file-upload" 
                            className="mt-2 inline-block cursor-pointer text-primary hover:underline"
                          >
                            browse files
                          </Label>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Supported formats: JPG, PNG, GIF | Max size: 10MB
                        </p>
                        <input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          accept="image/jpeg, image/png, image/gif"
                          onChange={handleFileChange}
                        />
                      </div>
                    )}
                    
                    {selectedFile && previewUrl && (
                      <div className="space-y-4">
                        <div className="max-h-48 overflow-hidden rounded-md relative">
                          <Image 
                            src={previewUrl} 
                            alt="Scan preview" 
                            width={250}
                            height={250}
                            className="object-contain mx-auto"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute right-2 top-2 opacity-80 hover:opacity-100"
                            onClick={resetForm}
                          >
                            Remove
                          </Button>
                        </div>
                        <div className="text-sm">
                          <p className="font-medium">{selectedFile.name}</p>
                          <p className="text-muted-foreground">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {error && (
                      <Alert variant="destructive" className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
                
                {/* Upload Progress */}
                {loading && uploadProgress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
                
                {/* Submit Button */}
                <Button 
                  onClick={analyzeImage} 
                  disabled={!selectedFile || loading}
                  className="w-full"
                >
                  {loading ? "Analyzing..." : "Analyze Scan"}
                </Button>
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-method">API Method</Label>
                    <RadioGroup 
                      defaultValue="1" 
                      value={apiMethod.toString()}
                      onValueChange={(value) => setApiMethod(parseInt(value))}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="0" id="api-server" />
                        <Label htmlFor="api-server" className="cursor-pointer">Server API (with assessment tracking)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1" id="direct-api" />
                        <Label htmlFor="direct-api" className="cursor-pointer">Direct API to Hugging Face FastAPI</Label>
                      </div>
                      <div className="flex items-center space-x-2 opacity-50">
                        <RadioGroupItem value="2" id="gradio-api" disabled />
                        <Label htmlFor="gradio-api" className="cursor-not-allowed">Gradio API (deprecated)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Results Card */}
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>View the MRI scan analysis results</CardDescription>
          </CardHeader>
          <CardContent>
            {!result && !loading && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Upload and analyze a scan to see results</p>
              </div>
            )}
            
            {loading && (
              <div className="text-center py-8">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                  <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
                  <div className="h-4 bg-muted rounded w-2/3 mx-auto"></div>
                </div>
                <p className="mt-4 text-muted-foreground">Analyzing scan...</p>
              </div>
            )}
            
            {result && scanType === "tumor" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Detection</h3>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-background border">
                    <span className="font-medium">Result</span>
                    <span className="text-lg font-semibold">{result.binary_result || (result.is_tumor ? "Tumor Detected" : "No Tumor Detected")}</span>
                  </div>
                </div>
                
                {result.prediction && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Classification</h3>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-background border">
                      <span className="font-medium">Tumor Type</span>
                      <span className="text-lg font-semibold capitalize">{result.prediction.replace('_', ' ')}</span>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Confidence</h3>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-background border">
                    <span className="font-medium">Confidence Score</span>
                    <span className={`text-lg font-semibold ${getConfidenceColor(result.confidence)}`}>
                      {((result.confidence || 0) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                {/* Render class probabilities if available */}
                {renderProbabilities()}
              </div>
            )}
            
            {result && scanType === "alzheimers" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Classification</h3>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-background border">
                    <span className="font-medium">Diagnosis</span>
                    <span className="text-lg font-semibold capitalize">{result.prediction.replace('_', ' ')}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Confidence</h3>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-background border">
                    <span className="font-medium">Confidence Score</span>
                    <span className={`text-lg font-semibold ${getConfidenceColor(result.confidence)}`}>
                      {((result.confidence || 0) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-xs text-muted-foreground w-full text-center">
              This analysis is for informational purposes only and does not constitute medical advice.
              Always consult with healthcare professionals for proper diagnosis and treatment.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 