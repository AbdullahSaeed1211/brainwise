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

# Model Card: Stroke Risk Prediction Model

## Model Description

The Stroke Risk Prediction Model is a machine learning classifier designed to predict an individual's risk of stroke based on various demographic and health-related features. The model outputs both a probability score and a risk category classification.

## Model Architecture

- **Algorithm**: Random Forest Classifier
- **Number of Trees**: 100
- **Max Features**: sqrt(n_features)
- **Max Depth**: None (trees are grown until all leaves are pure)
- **Class Weighting**: Balanced (to account for imbalanced datasets)

## Training Data

The model was trained on a dataset of patient health records with the following characteristics:

- **Total Samples**: ~5,000 patient records
- **Positive Cases**: ~250 stroke cases (~5% of dataset)
- **Negative Cases**: ~4,750 non-stroke cases (~95% of dataset)
- **Data Source**: Healthcare records from various medical institutions

## Model Performance

- **Accuracy**: 95%
- **Precision**: 72%
- **Recall**: 68%
- **F1 Score**: 70%
- **ROC-AUC**: 0.85
- **Metric Focus**: Optimized for balanced precision and recall, given the critical nature of both false positives and false negatives

## Feature Importance

The model relies on the following features, ranked by importance:

1. Age (25%)
2. Average Glucose Level (20%)
3. Hypertension (15%)
4. Heart Disease (15%)
5. BMI (10%)
6. Smoking Status (8%)
7. Gender (4%)
8. Other factors (3%)

## Preprocessing Pipeline

1. **Numeric Features**:
   - Age
   - Average Glucose Level
   - BMI
   
   Processing: Standard scaling (mean=0, std=1)

2. **Categorical Features**:
   - Gender
   - Hypertension
   - Heart Disease
   - Ever Married
   - Work Type
   - Residence Type
   - Smoking Status
   
   Processing: One-hot encoding

## Limitations

- The model has been trained on a dataset that may not be representative of all populations and demographics
- May have lower accuracy for edge cases or unusual medical conditions
- Does not consider family history or genetic factors that might contribute to stroke risk
- The model should not replace professional medical advice

## Ethical Considerations

- This model is designed for risk assessment only and should be used as one tool among many in healthcare decision-making
- Model makes predictions based on correlations in data, not causative relationships
- Results should be interpreted by healthcare professionals with domain expertise
- Care should be taken to avoid potential biases in healthcare access or treatment based solely on model predictions

## Citation

If you use this model in research, please cite:

```
@misc{brainwise-stroke-prediction,
  author = {BrainWise Health},
  title = {Stroke Risk Prediction Model},
  year = {2023},
  publisher = {Hugging Face},
  url = {https://huggingface.co/spaces/abdullah1211-ml-stroke}
}
```

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