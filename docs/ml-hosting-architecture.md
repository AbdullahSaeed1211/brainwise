# ML Model Hosting Architecture

## Overview

This document outlines how machine learning models are hosted and integrated into the BrainWise application. Our models power various features including stroke prediction, brain tumor detection, and Alzheimer's risk assessment.

## Current Architecture

Our ML models are hosted on Hugging Face Spaces with the following endpoints:

- Stroke Prediction: `https://abdullah1211-ml-stroke.hf.space`
- Brain Tumor Detection: `https://abdullah1211-ml-tumor.hf.space`
- Alzheimer's Detection: `https://abdullah1211-ml-alzheimers.hf.space`

These models are called from our application through a server-side API route (`/api/brain-scan/analyze`) that handles authentication, logging, and error handling.

## Media Storage with Uploadcare

For brain scan images and other medical imagery, we use Uploadcare as our storage solution:

1. Images are uploaded directly from the client browser to Uploadcare
2. Uploadcare provides a CDN URL for the image
3. Our application passes this URL to the ML models for analysis
4. Results are stored in our database linked to the image URL

Benefits of this approach:
- Offloads storage and bandwidth concerns
- Provides fast CDN access to images
- Handles image transformations and optimizations
- Allows direct browser-to-storage uploads

## System Architecture

```
Client Browser ─┐
                │ 1. Upload Image
                ▼
           Uploadcare ───┐
                         │ 2. Return CDN URL
                         ▼
Client Browser ─────────┐
                        │ 3. Send CDN URL + Metadata
                        ▼
                 BrainWise API ─┐
                               │ 4. Forward to ML Model
                               ▼
                     Hugging Face Spaces
                               │
                               │ 5. Return Analysis
                               ▼
                        BrainWise API
                               │
                               │ 6. Store Results
                               ▼
                          MongoDB
```

## Model Deployment

Each model is deployed as a FastAPI application inside a Docker container on Hugging Face Spaces:

1. The model is trained and exported in the appropriate format (joblib for tabular data, h5 for CNN models)
2. A FastAPI app is created to load the model and expose prediction endpoints
3. The app is containerized and deployed to Hugging Face Spaces
4. Our application's API routes forward requests to these model endpoints

## Implementation Details

### Phase 1: Hugging Face Integration (Completed)
- ✅ Deploy models to Hugging Face Spaces
- ✅ Implement error handling for API failures
- ✅ Add logging and monitoring

### Phase 2: Media Handling (Completed)
- ✅ Integrate Uploadcare for direct browser uploads
- ✅ Implement server-side API route for scan analysis
- ✅ Create assessment tracking and status polling

## Security Considerations

1. **Access Control**:
   - Hugging Face Spaces provide a simple hosting solution with built-in security
   - Our API routes add an additional layer of security with authentication

2. **Data Privacy**:
   - No patient data is stored on Hugging Face
   - Models are trained on anonymized data
   - Uploadcare files are configured for privacy and temporary access

3. **Model Protection**:
   - Models are versioned to ensure consistency
   - Backups are maintained for all model versions

## Performance Optimization

1. **Model Optimization**:
   - Models are optimized for size and performance before deployment
   - Smaller models are used where accuracy is not significantly affected

2. **Caching**:
   - API responses are cached where appropriate
   - Client-side caching is implemented for frequently accessed resources

## Monitoring and Analytics

1. **Usage Tracking**:
   - Model usage is tracked via application analytics
   - Performance metrics are collected (response time, accuracy)

2. **Error Monitoring**:
   - Failed model calls are tracked and reported
   - Automatic fallbacks are triggered when models fail

## Future Improvements

1. **Enhanced Model Versioning**:
   - Implement more robust model versioning and A/B testing
   - Add automated model retraining based on performance metrics

2. **Advanced Monitoring**:
   - Add more comprehensive monitoring of model performance
   - Implement alerts for model drift or accuracy issues

3. **Client-side Models**:
   - Explore TensorFlow.js for client-side inference where appropriate
   - Implement progressive model loading for improved user experience

## Fallback Strategy

If models fail to respond, the application falls back to:

1. Simplified local heuristics
2. Previously cached results where appropriate
3. Clear user messaging about service limitations