"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export function BrainScanUpload() {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "complete" | "failed">("idle");
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [assessmentId, setAssessmentId] = useState<string>("");
  const [scanType, setScanType] = useState<'tumor' | 'alzheimers'>('tumor');

  useEffect(() => {
    // Display notification about ML model construction status
    toast({
      title: "Brain Scan Analysis",
      description: "Upload a brain MRI scan for analysis with our AI models.",
      variant: "default",
    });
  }, [toast]);

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    setStatus('idle');
    setProgress(0);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    handleFileChange(selectedFile);
  };

  const handleClickUpload = () => {
    inputRef.current?.click();
  };

  // Handle upload
  const handleUpload = async () => {
    if (!file) return;

    try {
      // Start uploading
      setStatus('uploading');
      setProgress(10);
      setProgressMessage('Uploading scan...');
      
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('scanType', scanType);
      
      // Upload the file to API
      const response = await fetch('/api/brain-scan/analyze', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const data = await response.json();
      setAssessmentId(data.assessmentId);
      
      setStatus('processing');
      setProgress(50);
      setProgressMessage('Processing scan...');
      
      toast({
        title: 'Brain scan uploaded',
        description: `Your ${scanType} scan is being analyzed. You will be notified when the analysis is complete.`,
        variant: "default",
      });
      
      // In a real implementation, you would poll for status here
      
    } catch (error) {
      setStatus('failed');
      setProgressMessage('Upload failed');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to upload brain scan',
      });
      console.error('Error:', error);
    }
  };

  // Render the component with UI that uses all the variables
  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg">
      {/* Hidden file input */}
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileInputChange}
        className="hidden"
        accept="image/jpeg,image/png,application/dicom"
      />
      
      {/* Scan Type Selection */}
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Select Scan Type</h3>
        <RadioGroup 
          value={scanType} 
          onValueChange={(value) => setScanType(value as 'tumor' | 'alzheimers')}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="tumor" id="tumor" />
            <Label htmlFor="tumor" className="cursor-pointer">Brain Tumor Analysis</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="alzheimers" id="alzheimers" />
            <Label htmlFor="alzheimers" className="cursor-pointer">Alzheimer&apos;s Detection</Label>
          </div>
        </RadioGroup>
      </div>
      
      {/* File upload area with input that uses handleFileChange */}
      <div 
        className="border-dashed border-2 p-6 rounded-lg text-center cursor-pointer"
        onClick={handleClickUpload}
      >
        {file ? (
          <div>
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        ) : (
          <p>Drag and drop a scan file or click to browse</p>
        )}
      </div>
      
      {/* Upload button */}
      <button 
        onClick={handleUpload}
        disabled={!file || status === 'uploading' || status === 'processing'}
        className="bg-blue-500 text-white py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'idle' ? 'Upload Scan' : 'Processing...'}
      </button>
      
      {/* Progress indicator */}
      {status !== 'idle' && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-gray-600">{progressMessage}</p>
          {assessmentId && (
            <p className="mt-2 text-xs text-gray-500">Assessment ID: {assessmentId}</p>
          )}
        </div>
      )}
    </div>
  );
} 