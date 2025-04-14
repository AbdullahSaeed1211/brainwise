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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, GIF)");
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File is too large. Maximum size is 10MB");
      return;
    }

    setSelectedFile(file);
    setError(null);
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log("🚀 Starting brain scan analysis process...");
      console.log(`📋 Analysis type: ${scanType}`);
      console.log(`📁 File: ${selectedFile.name} (${selectedFile.size} bytes)`);
      
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
        const response = await fetch('/api/brain-scan/analyze', {
          method: 'POST',
          body: formData,
        });
        
        console.log(`⚡ API Response received in ${((Date.now() - analysisStartTime) / 1000).toFixed(2)}s`);
        console.log(`📡 Response status: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
          const errorText = await response.text().catch(() => '');
          console.error("❌ API Error Details:", errorText);
          throw new Error(`Error ${response.status}: ${response.statusText}`);
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
        const huggingFaceApiUrl = scanType === "alzheimers" 
          ? 'https://abdullah1211-ml-alzheimers.hf.space/api/predict'
          : 'https://abdullah1211-ml-tumour.hf.space/api/predict';
        
        console.log(`🔄 Using direct Hugging Face API call`);
        console.log(`🔗 Hugging Face API URL: ${huggingFaceApiUrl}`);
        
        // Create form data for the API request
        const formData = new FormData();
        formData.append("fileUrl", fileUrl);
        
        console.log(`📊 Sending request to Hugging Face API`);
        console.log(`📝 Form data: fileUrl=${fileUrl.substring(0, 40)}...`);
        
        // Send request to Hugging Face API
        const hfStartTime = Date.now();
        const response = await fetch(huggingFaceApiUrl, {
          method: 'POST',
          body: formData,
        });
        
        console.log(`⚡ Hugging Face API response received in ${((Date.now() - hfStartTime) / 1000).toFixed(2)}s`);
        console.log(`📡 Response status: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
          const errorText = await response.text().catch(() => '');
          console.error("❌ Hugging Face API Error:", errorText);
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        // Process response
        const result = await response.json();
        console.log("📦 Hugging Face API Response:", result);
        
        // Set the result state
        setResult({
          prediction: result.prediction,
          confidence: result.confidence
        });
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
      
    } catch (error: unknown) {
      console.error("❌ Error in analysis process:", error);
      setError(error instanceof Error ? error.message : "An error occurred during analysis");
      setResult(null);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };
  
  const resetForm = () => {
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
                
                {loading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
                
                <div className="pt-4">
                  <Button
                    className="w-full"
                    disabled={!selectedFile || loading}
                    onClick={analyzeImage}
                  >
                    {loading ? 'Processing...' : 'Analyze Image'}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiMethod">API Method</Label>
                  <RadioGroup 
                    defaultValue="1" 
                    value={apiMethod.toString()}
                    onValueChange={(value) => setApiMethod(parseInt(value))}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0" id="method-0" />
                      <Label htmlFor="method-0" className="font-normal cursor-pointer">
                        Server API with Assessment Tracking
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="method-1" />
                      <Label htmlFor="method-1" className="font-normal cursor-pointer">
                        Direct Hugging Face API
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2" id="method-2" disabled />
                      <Label htmlFor="method-2" className="font-normal cursor-pointer text-muted-foreground">
                        Gradio API (Coming soon)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col items-start px-6 pt-0">
            <p className="text-xs text-muted-foreground mb-2">
              <strong>Note:</strong> This tool is for educational purposes only and should not replace professional medical advice.
            </p>
          </CardFooter>
        </Card>
        
        {/* Results Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              <span>Analysis Results</span>
            </CardTitle>
            <CardDescription>
              {result 
                ? 'Brain scan analysis complete' 
                : 'Results will appear here after analysis'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {!result && !loading && (
              <div className="text-center p-8">
                <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <BrainCircuit className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-medium mb-2">No Analysis Yet</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Upload a brain scan image and click &quot;Analyze Image&quot; to see results
                </p>
              </div>
            )}
            
            {loading && (
              <div className="text-center p-8">
                <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 p-4 rounded-full animate-pulse">
                    <BrainCircuit className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-medium mb-2">Analyzing your scan...</h3>
                <p className="text-muted-foreground max-w-sm mx-auto mb-4">
                  This may take up to 30 seconds depending on image size
                </p>
                <Progress value={uploadProgress > 0 ? uploadProgress : undefined} className="h-2 max-w-xs mx-auto" />
              </div>
            )}
            
            {result && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Prediction</h3>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        result.prediction.toLowerCase().includes('tumor') || 
                        result.prediction.toLowerCase().includes('positive')
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {result.prediction}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {result.prediction.toLowerCase().includes('tumor') || 
                       result.prediction.toLowerCase().includes('positive')
                        ? 'Potential abnormality detected. Please consult a healthcare professional.'
                        : 'No significant abnormalities detected in the scan.'}
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Confidence Score</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-2xl font-bold ${getConfidenceColor(result.confidence)}`}>
                        {(result.confidence * 100).toFixed(1)}%
                      </span>
                      <span className="text-sm text-muted-foreground">confidence</span>
                    </div>
                    <Progress 
                      value={result.confidence * 100} 
                      className={`h-2 ${
                        result.confidence >= 0.7 ? 'bg-green-100 dark:bg-green-900/30' : 
                        result.confidence >= 0.4 ? 'bg-amber-100 dark:bg-amber-900/30' : 
                        'bg-red-100 dark:bg-red-900/30'
                      }`} 
                    />
                  </div>
                </div>
                
                <div className="rounded-lg border p-4 bg-muted/50">
                  <h3 className="font-medium mb-2">Recommendations</h3>
                  <ul className="space-y-2 text-sm">
                    {result.prediction.toLowerCase().includes('tumor') || 
                     result.prediction.toLowerCase().includes('positive') ? (
                      <>
                        <li className="flex items-start gap-2">
                          <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">•</span>
                          <span>Consult with a neurologist to discuss these results.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">•</span>
                          <span>Consider additional diagnostic tests for confirmation.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">•</span>
                          <span>Share these results with your healthcare provider.</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-start gap-2">
                          <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">•</span>
                          <span>Continue regular health check-ups as recommended.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">•</span>
                          <span>Maintain a healthy lifestyle for overall brain health.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">•</span>
                          <span>Consider periodical brain health assessments.</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    onClick={resetForm}
                  >
                    Start New Analysis
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Disclaimer */}
      <div className="mt-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important Disclaimer</AlertTitle>
          <AlertDescription className="text-sm text-muted-foreground">
            This tool is intended for educational purposes only and should not be used for medical diagnosis. 
            The analysis provided by this tool is not a substitute for professional medical advice, diagnosis, 
            or treatment. Always seek the advice of a qualified healthcare provider with any questions you may 
            have regarding a medical condition.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
} 