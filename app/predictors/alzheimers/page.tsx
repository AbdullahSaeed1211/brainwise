"use client";

import { useState } from "react";
import { Activity, AlertCircle, UploadCloud, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { uploadFile } from "@uploadcare/upload-client";

interface AlzheimersDetectionResult {
  prediction: string;
  confidence: number;
}

export default function AlzheimersDetectionPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AlzheimersDetectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Classification categories for Alzheimer's
  const classifications = [
    { 
      id: 'non-demented', 
      name: 'Non Demented', 
      description: 'No signs of Alzheimer\'s disease found in the scan.',
      color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    },
    { 
      id: 'very-mild', 
      name: 'Very Mild Demented', 
      description: 'Very early signs of cognitive decline may be present, indicating potential early-stage Alzheimer\'s.',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    },
    { 
      id: 'mild', 
      name: 'Mild Demented', 
      description: 'Mild signs of Alzheimer\'s disease, showing moderate cognitive decline.',
      color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
    },
    { 
      id: 'moderate', 
      name: 'Moderate Demented', 
      description: 'Significant signs of Alzheimer\'s disease with substantial cognitive impairment.',
      color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    }
  ];

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
      console.log("Starting Alzheimer's image analysis process");
      
      // Simulate upload progress
      setUploadProgress(0);
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);
      
      // Upload file to Uploadcare using their client library directly
      console.log("Uploading file:", selectedFile.name, selectedFile.type, selectedFile.size);
      
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
      
      if (!result?.uuid) {
        throw new Error('Upload failed: No UUID returned');
      }
      
      const fileUrl = `https://ucarecdn.com/${result.uuid}/`;
      console.log("File uploaded successfully, URL:", fileUrl);
      
      // Use our API route to analyze the image
      const formData = new FormData();
      formData.append("fileUrl", fileUrl);
      formData.append("scanType", "alzheimers"); // Set scan type to alzheimers
      
      console.log("Sending data to brain-scan API with scan type: alzheimers");
      
      const response = await fetch('/api/brain-scan/analyze', {
        method: 'POST',
        body: formData,
      });
      
      console.log("Response status:", response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        console.error("API Error Response:", errorText);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Received data from API:", data);
      
      // Since the server API queues the analysis, we need to poll for results
      let analysisComplete = false;
      let analysisResult = null;
      
      // Simple polling to check assessment status
      if (data.assessmentId) {
        for (let i = 0; i < 10; i++) { // Try up to 10 times
          await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds between checks
          
          const statusResponse = await fetch(`/api/assessment/${data.assessmentId}`);
          if (statusResponse.ok) {
            const statusData = await statusResponse.json();
            
            if (statusData.data?.status === 'completed') {
              analysisComplete = true;
              analysisResult = {
                prediction: statusData.result || statusData.data?.result?.conclusion,
                confidence: statusData.data?.result?.confidence || 0.8
              };
              break;
            } else if (statusData.data?.status === 'failed') {
              throw new Error(statusData.data?.error || 'Analysis failed');
            }
          }
        }
        
        if (!analysisComplete) {
          throw new Error('Analysis is taking longer than expected. Please check your assessments later.');
        }
        
        setResult(analysisResult);
      } else {
        // For backward compatibility, assume immediate result
        setResult({
          prediction: data.prediction || "Analysis queued",
          confidence: data.confidence || 0.5
        });
      }
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setUploadProgress(0);
  };

  function getClassification(prediction: string) {
    return classifications.find(c => 
      prediction.toLowerCase().includes(c.name.toLowerCase())
    ) || classifications[0];
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 space-y-4">
        <div className="flex items-center space-x-2">
          <Activity className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold">Alzheimer&apos;s Detection</h1>
        </div>
        <p className="text-muted-foreground">
          Upload a brain MRI scan to analyze for signs of Alzheimer&apos;s disease. Our AI model will 
          examine the image and classify it according to recognized stages of Alzheimer&apos;s progression. 
          This tool is for informational purposes only and is not a substitute for professional medical diagnosis.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Classification guide */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-blue-500" />
            Alzheimer&apos;s Classification Guide
          </CardTitle>
          <CardDescription>
            Our AI model classifies brain scans into four categories based on Alzheimer&apos;s progression
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {classifications.map((classification) => (
              <div 
                key={classification.id} 
                className="p-3 border rounded-lg"
              >
                <Badge variant="outline" className={classification.color}>
                  {classification.name}
                </Badge>
                <p className="mt-2 text-xs text-muted-foreground">
                  {classification.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {result ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              Based on the uploaded MRI scan, our AI model has classified the image for signs of Alzheimer&apos;s disease.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {previewUrl && (
              <div className="mb-4 flex justify-center">
                <div className="relative w-64 h-64 border rounded-md overflow-hidden">
                  <Image 
                    src={previewUrl} 
                    alt="Brain MRI Scan" 
                    fill 
                    className="object-cover"
                  />
                </div>
              </div>
            )}
            
            <div className="p-4 border rounded-lg bg-muted">
              <h3 className="text-xl font-semibold mb-2">
                Classification Result:
              </h3>
              <div className="flex justify-center mb-3">
                <Badge 
                  variant="outline" 
                  className={`text-base px-4 py-1 ${getClassification(result.prediction).color}`}
                >
                  {result.prediction}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground text-center">
                <p>Confidence: {(result.confidence * 100).toFixed(1)}%</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">What this means:</h4>
              <p className="text-sm text-muted-foreground">
                {getClassification(result.prediction).description} This analysis is based on AI detection patterns and should be confirmed with a healthcare professional.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={resetForm} className="w-full">
              Analyze Another Scan
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Upload Brain MRI Scan</CardTitle>
            <CardDescription>
              Select a brain MRI image file to upload for Alzheimer&apos;s detection analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="upload">File Upload</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="space-y-4">
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    previewUrl ? "border-primary" : "border-muted-foreground/25 hover:border-muted-foreground/50"
                  }`}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  {previewUrl ? (
                    <div className="flex flex-col items-center">
                      <div className="relative w-48 h-48 mb-4">
                        <Image 
                          src={previewUrl} 
                          alt="Brain MRI Preview" 
                          fill 
                          className="object-cover rounded-md"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {selectedFile?.name} ({(selectedFile?.size || 0) / 1024 > 1024 
                          ? `${((selectedFile?.size || 0) / 1024 / 1024).toFixed(2)} MB` 
                          : `${((selectedFile?.size || 0) / 1024).toFixed(2)} KB`})
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-1">Drag and drop or click to upload</p>
                      <p className="text-xs text-muted-foreground/75">
                        Supports JPEG, PNG, and GIF (Max 10MB)
                      </p>
                    </div>
                  )}
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
                
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={analyzeImage} 
              className="w-full" 
              disabled={!selectedFile || loading}
            >
              {loading ? "Analyzing..." : "Analyze Brain Scan"}
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="mt-12 p-6 border rounded-lg bg-muted">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          Important Notice
        </h3>
        <p className="text-sm text-muted-foreground mb-2">
          This tool is for informational purposes only and does not provide medical advice. 
          The predictions are based on AI models and should not be used to make 
          medical decisions without consulting a healthcare professional.
        </p>
        <p className="text-sm text-muted-foreground">
          If you&apos;re concerned about your cognitive health or are experiencing symptoms, 
          please contact a healthcare provider immediately.
        </p>
      </div>
    </div>
  );
} 