---
language: en
tags:
  - healthcare
  - stroke-prediction
  - medical
license: mit
datasets:
  - stroke-prediction
model-index:
  - name: Stroke Risk Prediction Model
    results:
      - task:
          type: binary-classification
          name: stroke prediction
        metrics:
          - type: accuracy
            value: 0.95
          - type: f1
            value: 0.82
---

# Stroke Risk Prediction Model

This model predicts the likelihood of a person experiencing a stroke based on various health and demographic features.

## Model Description

The model is a Random Forest classifier trained on healthcare data to predict stroke risk and categorize individuals into risk levels.

### Input

The model accepts the following features:
- **gender**: Male, Female, Other
- **age**: Age in years (numeric)
- **hypertension**: Whether the patient has hypertension (0: No, 1: Yes)
- **heart_disease**: Whether the patient has heart disease (0: No, 1: Yes)
- **ever_married**: Whether the patient has ever been married (Yes/No)
- **work_type**: Type of work (Private, Self-employed, Govt_job, children, Never_worked)
- **Residence_type**: Type of residence (Urban/Rural)
- **avg_glucose_level**: Average glucose level in blood (mg/dL)
- **bmi**: Body Mass Index
- **smoking_status**: Smoking status (formerly smoked, never smoked, smokes, Unknown)

### Output

The model outputs:
- **probability**: Numerical probability of stroke (0-1)
- **prediction**: Risk category (Very Low Risk, Low Risk, Moderate Risk, High Risk, Very High Risk)
- **stroke_prediction**: Binary prediction (0: No stroke, 1: Stroke)

### Limitations and Biases

- The model was trained on a dataset that may have demographic limitations
- Performance may vary across different population groups
- This model should be used as a screening tool only and not as a definitive medical diagnosis

## Usage

```python
import requests

API_URL = "https://api-inference.huggingface.co/models/Abdullah1211/ml-stroke"
headers = {"Authorization": "Bearer YOUR_API_TOKEN"}

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
``` 