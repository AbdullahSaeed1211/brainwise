---
title: Stroke Prediction Model
emoji: 🧠
colorFrom: red
colorTo: blue
sdk: docker
app_file: app.py
pinned: false
---

# Stroke Risk Prediction Model

This Hugging Face Space hosts a machine learning model for stroke risk prediction based on various health and demographic factors.

## Model Overview

- **Type**: Random Forest Classifier
- **Target**: Binary classification (stroke risk)
- **Output**: Probability of stroke risk + risk category
- **Features**: Age, gender, hypertension, heart disease, BMI, glucose levels, and more

## API Endpoints

### POST `/api/predict`

Predicts stroke risk based on patient health data.

#### Request Format

```json
{
  "gender": "Male",
  "age": 67,
  "hypertension": 1,
  "heart_disease": 0,
  "ever_married": "Yes",
  "work_type": "Private",
  "Residence_type": "Urban",
  "avg_glucose_level": 228.69,
  "bmi": 36.6,
  "smoking_status": "formerly smoked"
}
```

#### Response Format

```json
{
  "probability": 0.72,
  "prediction": "High Risk",
  "stroke_prediction": 1,
  "risk_factors": [
    "Advanced Age (>65)",
    "Very High Blood Glucose (>200)",
    "Obesity (BMI > 30)",
    "Former Smoker"
  ],
  "important_features": [
    {"feature": "avg_glucose_level", "importance": 0.31},
    {"feature": "age", "importance": 0.28},
    {"feature": "bmi", "importance": 0.15}
  ],
  "execution_time_ms": 50,
  "using_model": true,
  "model_version": "1.0"
}
```

### GET `/`

Returns information about the model and API usage.

## Parameter Details

| Parameter | Description | Type | Values |
|-----------|-------------|------|--------|
| gender | Gender of the patient | String | "Male", "Female", "Other" |
| age | Age in years | Number | 0-120 |
| hypertension | Whether patient has hypertension | Number | 0 (No), 1 (Yes) |
| heart_disease | Whether patient has heart disease | Number | 0 (No), 1 (Yes) |
| ever_married | Whether patient has ever been married | String | "Yes", "No" |
| work_type | Type of work/employment | String | "Private", "Self-employed", "Govt_job", "children", "Never_worked" |
| Residence_type | Type of residence | String | "Urban", "Rural" |
| avg_glucose_level | Average glucose level in blood (mg/dL) | Number | 50-300+ |
| bmi | Body Mass Index | Number | 10-50+ |
| smoking_status | Smoking status of patient | String | "never smoked", "formerly smoked", "smokes", "Unknown" |

## Risk Categories

- **Very Low Risk**: < 10% probability 
- **Low Risk**: 10-20% probability
- **Moderate Risk**: 20-40% probability
- **High Risk**: 40-60% probability
- **Very High Risk**: > 60% probability

## Model Training

This model was trained on a dataset of over 5,000 patients with various health metrics and stroke outcomes. It identifies key risk factors like:

- Age
- High blood pressure
- Heart disease
- Glucose levels
- BMI
- Smoking status

## Integration with BrainWise App

This model serves as the backend for the BrainWise app's stroke risk calculator, providing users with risk assessments based on their health metrics.

## Disclaimer

This model is for informational purposes only and should not replace professional medical advice. Always consult with healthcare providers for medical decisions. 