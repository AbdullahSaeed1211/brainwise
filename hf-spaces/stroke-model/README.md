---
title: Stroke Prediction Model
emoji: 🧠
colorFrom: red
colorTo: blue
sdk: docker
app_file: app.py
pinned: false
---

# Stroke Prediction Model

This model predicts the risk of stroke based on demographic and health-related features.

## Model Details

- **Model Type**: Random Forest Classifier
- **Training Data**: Healthcare data including age, gender, various diseases, and lifestyle factors
- **Features**: Age, gender, hypertension, heart disease, marital status, work type, residence type, glucose level, BMI, smoking status
- **Output**: Probability of stroke risk (0-1) and risk category

## Usage

You can use this model through the Hugging Face Inference API:

```python
import requests

API_URL = "https://abdullah1211-ml-stroke.hf.space"
headers = {"Content-Type": "application/json"}

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()

data = {
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

output = query(data)
print(output)
```

## Response Format

```json
{
  "probability": 0.72,
  "prediction": "High Risk",
  "stroke_prediction": 1
}
```

## Risk Categories

- Very Low Risk: probability < 0.2
- Low Risk: probability between 0.2 and 0.4
- Moderate Risk: probability between 0.4 and 0.6
- High Risk: probability between 0.6 and 0.8
- Very High Risk: probability > 0.8 