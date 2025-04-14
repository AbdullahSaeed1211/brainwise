# Machine Learning Model Hosting Guide

This document outlines the setup for hosting ML models on Hugging Face Spaces for the Brain AI application.

## Current Setup

### Stroke Prediction Model
- **Model Type**: Random Forest Classifier
- **Hosting**: Hugging Face Spaces
- **URL**: [https://abdullah1211-ml-stroke.hf.space](https://abdullah1211-ml-stroke.hf.space)
- **Files**:
  - `model.joblib`: Trained model file
  - `app.py`: FastAPI application for serving predictions
  - `Dockerfile`: Container configuration

### Brain Tumor Detection Model
- **Model Type**: Convolutional Neural Network
- **Hosting**: Hugging Face Spaces
- **URL**: [https://abdullah1211-ml-tumor.hf.space](https://abdullah1211-ml-tumor.hf.space)
- **Files**:
  - `model.h5`: Trained CNN model
  - `app.py`: FastAPI application for serving predictions
  - `Dockerfile`: Container configuration

### Alzheimer's Detection Model
- **Model Type**: Convolutional Neural Network
- **Hosting**: Hugging Face Spaces
- **URL**: [https://abdullah1211-ml-alzheimers.hf.space](https://abdullah1211-ml-alzheimers.hf.space)
- **Files**:
  - `model.h5`: Trained CNN model
  - `app.py`: FastAPI application for serving predictions
  - `Dockerfile`: Container configuration

## Image Upload and Analysis Flow

For brain scan analysis (tumor detection and Alzheimer's detection), we use the following flow:

1. **Client-side Image Upload**:
   - Images are uploaded directly from the browser to Uploadcare using their JavaScript client library
   - The upload provides a CDN URL that can be used for analysis

2. **Server-side Analysis**:
   - The CDN URL is sent to our API endpoint `/api/brain-scan/analyze`
   - Our API creates an assessment record and queues the analysis
   - The API forwards the request to the appropriate Hugging Face model endpoint

3. **Result Processing**:
   - Analysis results are stored in the database
   - Clients can poll for results using the assessment ID

## How to Update the Model

To update the stroke prediction model:

1. Train a new model using your notebook
2. Export to joblib format
3. Replace the `model.joblib` file in the Hugging Face Space repository
4. The API will automatically use the new model

To update the image analysis models (tumor/Alzheimer's):

1. Train a new model using your deep learning framework
2. Export to .h5 or ONNX format
3. Replace the model file in the appropriate Hugging Face Space repository
4. Update preprocessing logic if needed

## How to Add a New Model

To host a new model (e.g., MRI scan analysis):

1. Create a new Space on Hugging Face
2. Upload your model file (ONNX, TensorFlow, or joblib format)
3. Create an `app.py` file with FastAPI to serve predictions
4. Create a `Dockerfile` for containerization
5. Update the frontend code to call the new API endpoint

## API Usage

### Stroke Prediction API Example

```typescript
// Frontend code
export async function predictStroke(data: StrokeRiskInput): Promise<PredictionResult> {
  try {
    const response = await fetch("https://abdullah1211-ml-stroke.hf.space", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gender: data.gender,
        age: data.age,
        hypertension: data.hypertension,
        heart_disease: data.heartDisease,
        ever_married: data.everMarried,
        work_type: data.workType,
        Residence_type: data.residenceType,
        avg_glucose_level: data.avgGlucoseLevel,
        bmi: data.bmi,
        smoking_status: data.smokingStatus
      }),
    });
    
    if (!response.ok) {
      throw new Error("API request failed");
    }
    
    const result = await response.json();
    return { 
      prediction: result.prediction,
      probability: result.probability
    };
  } catch (error) {
    // Fallback to local model
    console.error("Error calling stroke prediction API:", error);
    return fallbackPrediction(data);
  }
}
```

### Brain Scan Analysis API Example

```typescript
// Client-side code for uploading and analyzing a brain scan
import { uploadFile } from "@uploadcare/upload-client";

async function analyzeBrainScan(file: File, scanType: 'tumor' | 'alzheimers') {
  // 1. Upload to Uploadcare
  const result = await uploadFile(file, {
    publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY || '',
    store: 'auto',
    metadata: {
      contentType: file.type
    }
  });
  
  const fileUrl = `https://ucarecdn.com/${result.uuid}/`;
  
  // 2. Send to our API for analysis
  const formData = new FormData();
  formData.append("fileUrl", fileUrl);
  formData.append("scanType", scanType);
  
  const response = await fetch('/api/brain-scan/analyze', {
    method: 'POST',
    body: formData,
  });
  
  const data = await response.json();
  
  // 3. Poll for results
  let analysisResult = null;
  
  if (data.assessmentId) {
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const statusResponse = await fetch(`/api/assessment/${data.assessmentId}`);
      const statusData = await statusResponse.json();
      
      if (statusData.data?.status === 'completed') {
        return {
          prediction: statusData.result || statusData.data?.result?.conclusion,
          confidence: statusData.data?.result?.confidence
        };
      } else if (statusData.data?.status === 'failed') {
        throw new Error(statusData.data?.error || 'Analysis failed');
      }
    }
  }
  
  throw new Error('Analysis is taking longer than expected');
}
```

## Using Uploadcare for Image Management

We use Uploadcare for efficient image upload and storage:

1. **Client-side Integration**:
   - The Uploadcare JavaScript client is used directly in the browser
   - No server is needed for the upload process

2. **Configuration**:
   - Environment variable `NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY` must be set
   - For server-side usage, use the `UPLOADCARE_PUBLIC_KEY` environment variable

3. **Benefits**:
   - CDN distribution of uploaded files
   - Image transformation capabilities
   - Secure and efficient uploads

## Benefits of Hugging Face Hosting

1. **Free Tier**: Suitable for pet projects and prototypes
2. **Simple Deployment**: No complex infrastructure to manage
3. **Scalability**: Can upgrade to paid tiers if needed
4. **Versioning**: Easy model versioning and rollback
5. **Community**: Part of a larger ML community

## Future Improvements

- Implement authentication for the API
- Add monitoring for model performance
- Set up automatic retraining pipeline
- Create a dashboard for model metrics
- Add webhook support for asynchronous analysis completion notification 