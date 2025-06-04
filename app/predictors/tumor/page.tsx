"use client";

import { BrainCircuit, ExternalLink, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";

export default function BrainTumorDetectionPage() {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  return (
    <div className="container px-4 py-6 md:py-10">
      <div className="mb-8 space-y-4">
        <div className="flex items-center space-x-2">
          <BrainCircuit className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Brain Tumor Detection</h1>
        </div>
        <p className="text-muted-foreground">
          Advanced brain tumor detection using our trained CNN model hosted on Hugging Face Spaces. 
          Upload MRI scans and get instant analysis results powered by deep learning.
        </p>
      </div>

      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Model Information</CardTitle>
            <CardDescription>About the brain tumor detection model</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">Model Type</h4>
                <p className="text-sm text-muted-foreground">Convolutional Neural Network (CNN)</p>
              </div>
              <div>
                <h4 className="font-medium">Detection Classes</h4>
                <p className="text-sm text-muted-foreground">Glioma, Meningioma, No Tumor, Pituitary</p>
              </div>
              <div>
                <h4 className="font-medium">Input Format</h4>
                <p className="text-sm text-muted-foreground">Brain MRI scan images (JPEG, PNG)</p>
              </div>
              <div>
                <h4 className="font-medium">Hosted On</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Hugging Face Spaces</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open('https://abdullah1211-brain-tumor-cnn.hf.space', '_blank')}
                    className="p-0 h-auto"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error handling for iframe issues */}
      {iframeError && (
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            The brain tumor detection interface is experiencing connectivity issues. 
            You can access it directly at{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-primary underline"
              onClick={() => window.open('https://abdullah1211-brain-tumor-cnn.hf.space', '_blank')}
            >
              Hugging Face Spaces
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Brain Tumor Analysis</CardTitle>
          <CardDescription>
            Upload your brain MRI scan and get instant analysis results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-muted">
              <p className="text-sm font-medium mb-2">Key Features:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Instant tumor classification and detection</li>
                <li>• Support for multiple tumor types</li>
                <li>• Confidence scores for each prediction</li>
                <li>• Example images for testing</li>
              </ul>
            </div>
            
            {/* Main analysis interface with error handling */}
            <div className="border rounded-lg overflow-hidden relative">
              {!iframeLoaded && !iframeError && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
                  <div className="text-center space-y-2">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-muted-foreground">Loading brain tumor detection interface...</p>
                  </div>
                </div>
              )}
              
              <iframe
                src="https://abdullah1211-brain-tumor-cnn.hf.space"
                frameBorder="0"
                width="100%"
                height="600"
                style={{ minHeight: '600px' }}
                title="Brain Tumor Detection Analysis"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-forms allow-downloads"
                onLoad={() => setIframeLoaded(true)}
                onError={() => {
                  setIframeError(true);
                  setIframeLoaded(true);
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium">Step 1: Upload Image</h4>
                <p className="text-sm text-muted-foreground">
                  Click the upload area or drag and drop your brain MRI scan image. 
                  Supported formats: JPEG, PNG, GIF.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Step 2: Submit Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Click the &ldquo;Submit&rdquo; button to process your image through our trained CNN model.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Step 3: View Results</h4>
                <p className="text-sm text-muted-foreground">
                  Review the analysis results including tumor classification and confidence scores.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Step 4: Try Examples</h4>
                <p className="text-sm text-muted-foreground">
                  Use the provided example images to test the model with different tumor types.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 p-4 border rounded-lg bg-amber-50 dark:bg-amber-950/20">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>Medical Disclaimer:</strong> This tool is for educational and research purposes only. 
          Results should not be used for medical diagnosis. Always consult with qualified healthcare 
          professionals for medical advice and diagnosis.
        </p>
      </div>
    </div>
  );
} 