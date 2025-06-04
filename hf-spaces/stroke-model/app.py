import joblib
import pandas as pd
import numpy as np
from fastapi import FastAPI, Form, File, UploadFile, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time
import json
from typing import Optional, List, Union
import uvicorn

# Load the trained model
print("Loading model...")
model_path = "/app/model.joblib"
import os
print(f"Model path: {model_path}")
print(f"Model file exists: {os.path.exists(model_path)}")
print(f"Model file size: {os.path.getsize(model_path) / 1024:.2f} KB")

try:
    model_info = joblib.load(model_path)
    print("Model loaded successfully!")
    
    # Access model components
    pipeline = model_info['model']
    model = pipeline.named_steps['classifier']
    print(f"Model details: Type: {type(model)}")
    
    # Get preprocessing info
    numeric_cols = model_info['numeric_cols']
    categorical_cols = model_info['encoded_cols']
    print(f"Features: {len(numeric_cols)} numeric features, {len(categorical_cols)} encoded features")
    
    # Verify model has predict_proba
    has_predict_proba = hasattr(model, 'predict_proba')
    print(f"Model has predict_proba method: {'Yes' if has_predict_proba else 'No'}")
except Exception as e:
    print(f"Error loading model: {e}")
    model_info = None

# Initialize FastAPI
app = FastAPI(title="Stroke Prediction Model API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Check if python-multipart is installed
try:
    import multipart
    print("python-multipart is installed: ", multipart.__version__)
except ImportError:
    print("python-multipart is NOT installed")

# Define prediction endpoints
@app.post("/api/predict")
async def predict_stroke(
    gender: Optional[str] = Form(None),
    age: Optional[float] = Form(None),
    hypertension: Optional[int] = Form(None),
    heart_disease: Optional[int] = Form(None),
    ever_married: Optional[str] = Form(None),
    work_type: Optional[str] = Form(None),
    Residence_type: Optional[str] = Form(None),
    avg_glucose_level: Optional[float] = Form(None),
    bmi: Optional[float] = Form(None),
    smoking_status: Optional[str] = Form(None)
):
    start_time = time.time()
    
    # Log the received data
    form_data = {
        'gender': gender,
        'age': age,
        'hypertension': hypertension,
        'heart_disease': heart_disease,
        'ever_married': ever_married,
        'work_type': work_type,
        'Residence_type': Residence_type,
        'avg_glucose_level': avg_glucose_level,
        'bmi': bmi,
        'smoking_status': smoking_status
    }
    print("Received form data:", form_data)
    
    # Process data and fill default values if needed
    processed_data = {
        'gender': gender if gender else 'Male',
        'age': float(age) if age is not None else 0,
        'hypertension': int(hypertension) if hypertension is not None else 0,
        'heart_disease': int(heart_disease) if heart_disease is not None else 0,
        'ever_married': ever_married if ever_married else 'No',
        'work_type': work_type if work_type else 'Private',
        'Residence_type': Residence_type if Residence_type else 'Urban',
        'avg_glucose_level': float(avg_glucose_level) if avg_glucose_level is not None else 0,
        'bmi': float(bmi) if bmi is not None else 0,
        'smoking_status': smoking_status if smoking_status else 'never smoked'
    }
    print("Processed data for prediction:", processed_data)
    
    # Create a DataFrame from the processed data
    input_df = pd.DataFrame([processed_data])
    
    # Prediction with fallback
    try:
        if model_info is None:
            raise ValueError("Model not loaded")
        
        # Get prediction from model
        prediction_proba = pipeline.predict_proba(input_df)[0][1]
        prediction_binary = pipeline.predict(input_df)[0]
        
        # Calculate risk level
        if prediction_proba < 0.1:
            risk_level = "Very Low Risk"
        elif prediction_proba < 0.3:
            risk_level = "Low Risk"
        elif prediction_proba < 0.6:
            risk_level = "Moderate Risk"
        else:
            risk_level = "High Risk"
            
        # Identify risk factors
        risk_factors = []
        if processed_data['hypertension'] == 1:
            risk_factors.append("Hypertension")
        if processed_data['heart_disease'] == 1:
            risk_factors.append("Heart Disease")
        if processed_data['age'] > 65:
            risk_factors.append("Advanced Age (65+)")
        if processed_data['avg_glucose_level'] > 140:
            risk_factors.append("High Blood Glucose (>140)")
        if processed_data['bmi'] > 30:
            risk_factors.append("Obesity (BMI > 30)")
        if processed_data['smoking_status'] == 'formerly smoked':
            risk_factors.append("Former Smoker")
        if processed_data['smoking_status'] == 'smokes':
            risk_factors.append("Current Smoker")
        
        # Return results
        result = {
            "probability": float(prediction_proba),
            "prediction": risk_level,
            "stroke_prediction": int(prediction_binary),
            "risk_factors": risk_factors,
            "execution_time_ms": (time.time() - start_time) * 1000
        }
        
    except Exception as e:
        print("Error in preprocessing:", e)
        
        # Alternative risk calculation
        alternative_probability = 0.05  # Default low risk
        
        # Increase risk based on known factors
        if processed_data['hypertension'] == 1:
            alternative_probability += 0.1
            
        if processed_data['heart_disease'] == 1:
            alternative_probability += 0.1
            
        if processed_data['age'] > 65:
            alternative_probability += 0.15
        elif processed_data['age'] > 55:
            alternative_probability += 0.1
            
        if processed_data['avg_glucose_level'] > 180:
            alternative_probability += 0.1
        elif processed_data['avg_glucose_level'] > 140:
            alternative_probability += 0.05
            
        if processed_data['bmi'] > 30:
            alternative_probability += 0.05
            
        if processed_data['smoking_status'] == 'smokes':
            alternative_probability += 0.07
        elif processed_data['smoking_status'] == 'formerly smoked':
            alternative_probability += 0.03
            
        # Cap at 80%
        alternative_probability = min(alternative_probability, 0.8)
        
        # Determine risk level
        if alternative_probability < 0.1:
            risk_level = "Very Low Risk"
        elif alternative_probability < 0.3:
            risk_level = "Low Risk"
        elif alternative_probability < 0.6:
            risk_level = "Moderate Risk"
        else:
            risk_level = "High Risk"
            
        # Threshold for binary prediction
        stroke_prediction = 1 if alternative_probability > 0.5 else 0
        
        # Identify risk factors
        risk_factors = []
        if processed_data['hypertension'] == 1:
            risk_factors.append("Hypertension")
        if processed_data['heart_disease'] == 1:
            risk_factors.append("Heart Disease")
        if processed_data['age'] > 65:
            risk_factors.append("Advanced Age (65+)")
        if processed_data['avg_glucose_level'] > 140:
            risk_factors.append("High Blood Glucose (>140)")
        if processed_data['bmi'] > 30:
            risk_factors.append("Obesity (BMI > 30)")
        if processed_data['smoking_status'] == 'formerly smoked':
            risk_factors.append("Former Smoker")
        if processed_data['smoking_status'] == 'smokes':
            risk_factors.append("Current Smoker")
        
        result = {
            "probability": alternative_probability,
            "prediction": risk_level,
            "stroke_prediction": stroke_prediction,
            "risk_factors": risk_factors,
            "execution_time_ms": (time.time() - start_time) * 1000
        }
    
    print("Prediction result:", result)
    return result

@app.get("/")
async def root():
    return {"message": "Stroke Prediction API is running! Use /api/predict for predictions."}

# Run the server
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7860)
