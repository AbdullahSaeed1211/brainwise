"use client";

import { Brain, ExternalLink, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";

export default function AlzheimersDetectionPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  return (
    <div className="container px-4 py-6 md:py-10">
      <div className="mb-8 space-y-4">
        <div className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Alzheimer&apos;s Detection</h1>
        </div>
        <p className="text-muted-foreground">
          Advanced Alzheimer&apos;s detection and assessment using AI-powered analysis. 
          Upload brain scans or use our interactive assessment tools for comprehensive evaluation.
        </p>
      </div>

      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Model Information</CardTitle>
            <CardDescription>About the Alzheimer&apos;s detection system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">System Type</h4>
                <p className="text-sm text-muted-foreground">Adaptive AI Assessment System</p>
              </div>
              <div>
                <h4 className="font-medium">Detection Capabilities</h4>
                <p className="text-sm text-muted-foreground">Early-stage Alzheimer&apos;s indicators</p>
              </div>
              <div>
                <h4 className="font-medium">Input Methods</h4>
                <p className="text-sm text-muted-foreground">Brain scans, cognitive assessments</p>
              </div>
              <div>
                <h4 className="font-medium">Hosted On</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Hugging Face Spaces</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open('https://arssite-adap-system-alzheimer-detection-assessm-96b22c3.hf.space', '_blank')}
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

      {/* Error handling */}
      {hasError && (
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            The Alzheimer&apos;s detection interface is experiencing connectivity issues. 
            You can access it directly at{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-primary underline"
              onClick={() => window.open('https://arssite-adap-system-alzheimer-detection-assessm-96b22c3.hf.space', '_blank')}
            >
              Hugging Face Spaces
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Alzheimer&apos;s Assessment Interface</CardTitle>
          <CardDescription>
            Interactive assessment tools and brain scan analysis for Alzheimer&apos;s detection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-muted">
              <p className="text-sm font-medium mb-2">Assessment Features:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Adaptive cognitive assessment system</li>
                <li>• Brain scan analysis capabilities</li>
                <li>• Early-stage detection indicators</li>
                <li>• Comprehensive risk assessment</li>
              </ul>
            </div>
            
            {/* Main assessment interface using iframe */}
            <div className="border rounded-lg overflow-hidden relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
                  <div className="text-center space-y-2">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-muted-foreground">Loading Alzheimer&apos;s assessment interface...</p>
                  </div>
                </div>
              )}
              
              <iframe
                src="https://arssite-adap-system-alzheimer-detection-assessm-96b22c3.hf.space"
                width="100%"
                height="800"
                frameBorder="0"
                title="Alzheimer's Detection Assessment"
                className="w-full"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                allow="camera; microphone; clipboard-read; clipboard-write"
                sandbox="allow-scripts allow-same-origin allow-forms allow-downloads"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>How to Use the Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium">Step 1: Choose Assessment Type</h4>
                <p className="text-sm text-muted-foreground">
                  Select between cognitive assessment tools or brain scan analysis based on your needs.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Step 2: Follow Instructions</h4>
                <p className="text-sm text-muted-foreground">
                  Complete the interactive assessment or upload brain scan images as guided by the interface.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Step 3: Review Results</h4>
                <p className="text-sm text-muted-foreground">
                  Analyze the assessment results including risk indicators and recommendations.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Step 4: Consult Professionals</h4>
                <p className="text-sm text-muted-foreground">
                  Share results with healthcare professionals for proper medical evaluation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 p-4 border rounded-lg bg-amber-50 dark:bg-amber-950/20">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>Medical Disclaimer:</strong> This assessment tool is for educational and screening purposes only. 
          Results should not be used for medical diagnosis. Always consult with qualified healthcare 
          professionals and neurologists for proper Alzheimer&apos;s diagnosis and treatment planning.
        </p>
      </div>
    </div>
  );
} 