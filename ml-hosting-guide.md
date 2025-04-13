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

## How to Update the Model

To update the stroke prediction model:

1. Train a new model using your notebook
2. Export to joblib format
3. Replace the `model.joblib` file in the Hugging Face Space repository
4. The API will automatically use the new model

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