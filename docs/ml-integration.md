# ML Integration Documentation

## Overview

This application uses Hugging Face Spaces for all machine learning functionality, rather than loading models locally. The connection to these models is made through direct API calls to Hugging Face endpoints.

## Model Endpoints

All ML models are hosted on Hugging Face Spaces:

- Stroke Prediction: `https://abdullah1211-ml-stroke.hf.space`
- Brain Tumor Detection: `https://abdullah1211-ml-tumor.hf.space`
- Alzheimer's Detection: `https://abdullah1211-ml-alzheimers.hf.space`

## Implementation Details

1. **API Access**: The application makes direct HTTP requests to the Hugging Face endpoints.
   
2. **Model Access**: The endpoints for each model can be retrieved using the `getModelEndpoint` function in `lib/ml/model-loader.ts`.

3. **Fallback Models**: For each model category, we maintain simple rule-based fallback models that run entirely in JavaScript. These are used when:
   - The API request fails
   - The API response is invalid
   - The model is unavailable

4. **File Structure**:
   - `lib/ml/model-loader.ts`: Provides endpoints for the Hugging Face models
   - `lib/ml/stroke-model.ts`: Handles stroke risk predictions using the Hugging Face API
   - `lib/ml/alzheimers-model.ts`: Handles Alzheimer's risk predictions using the Hugging Face API

5. **API Routes**:
   - `/api/stroke/predict`: Predicts stroke risk based on input parameters
   - `/api/alzheimers/predict`: Predicts Alzheimer's risk based on input parameters
   - `/api/brain-scan/analyze`: Analyzes brain scans for tumors or Alzheimer's markers

## Usage Example

```typescript
import { predictStroke } from '@/lib/ml/stroke-model';

const result = await predictStroke({
  gender: 'Male',
  age: 67,
  hypertension: 1,
  heartDisease: 0,
  // other parameters...
});

console.log(result.prediction);  // 'High Risk'
console.log(result.probability); // 0.72
```

## Uploadcare Integration

For brain scan image uploads, the application uses Uploadcare to:

1. Upload and store the image
2. Get a CDN URL for the image
3. Pass the CDN URL to the Hugging Face API for analysis

## Development Notes

- Do not attempt to load models locally - all ML functionality should use the Hugging Face APIs
- Always implement fallback models for each type of prediction
- Cache API responses where appropriate to reduce load on the Hugging Face servers 