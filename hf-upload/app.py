from fastapi import FastAPI, Request, HTTPException
import numpy as np
import joblib
import os

app = FastAPI()

# Risk categories
RISK_CATEGORIES = {
    'Very Low Risk': 0.1,
    'Low Risk': 0.2,
    'Moderate Risk': 0.4,
    'High Risk': 0.6,
    'Very High Risk': 0.8
}

# Load the model with better error handling
print("Loading model...")
try:
    model_path = os.path.join(os.path.dirname(__file__), "model.joblib")
    print(f"Model path: {model_path}")
    
    model_data = joblib.load(model_path)
    print("Model loaded successfully!")
    
    rf_model = model_data.get('model')
    encoded_cols = model_data.get('encoded_cols', [])
    numeric_cols = model_data.get('numeric_cols', [])
    preprocessor = model_data.get('preprocessor')
    
    print(f"Model details: {len(numeric_cols)} numeric features, {len(encoded_cols)} encoded features")
    model_loaded = True
except Exception as e:
    print(f"Error loading model: {str(e)}")
    rf_model = None
    preprocessor = None
    encoded_cols = []
    numeric_cols = []
    model_loaded = False

def get_risk_level(probability):
    """Get risk level based on probability score"""
    for category, threshold in RISK_CATEGORIES.items():
        if probability < threshold:
            return category
    return "Very High Risk"

def preprocess_without_pandas(data):
    """Preprocess input data without using pandas"""
    # Handle numeric features
    numeric_features = []
    for col in numeric_cols:
        if col == 'age':
            numeric_features.append(float(data.get('age', 0)))
        elif col == 'avg_glucose_level':
            numeric_features.append(float(data.get('avg_glucose_level', 0)))
        elif col == 'bmi':
            numeric_features.append(float(data.get('bmi', 0)))
            
    # Create input array for categorical processing
    categorical_input = np.array([[
        data.get('gender', 'Male'),
        data.get('hypertension', 0),
        data.get('heart_disease', 0),
        data.get('ever_married', 'No'),
        data.get('work_type', 'Private'),
        data.get('Residence_type', 'Urban'),
        data.get('smoking_status', 'never smoked')
    ]], dtype=object)
    
    # Apply preprocessing
    if preprocessor is not None:
        try:
            encoded_features = preprocessor.transform(categorical_input)
            # Combine numeric and encoded features
            features = np.concatenate([numeric_features, encoded_features.flatten()])
            return features.reshape(1, -1)
        except Exception as e:
            print(f"Error in preprocessing: {str(e)}")
            
    # Return none if preprocessing fails
    return None

def predict_with_model(features):
    """Make prediction using the loaded model"""
    try:
        if rf_model is not None and features is not None:
            probabilities = rf_model.predict_proba(features)
            stroke_probability = probabilities[0, 1]  # Class 1 probability (stroke)
            risk_level = get_risk_level(stroke_probability)
            return stroke_probability, risk_level, True
    except Exception as e:
        print(f"Error in model prediction: {str(e)}")
    
    return None, None, False

def fallback_prediction(data):
    """Fallback prediction when model fails"""
    # Count risk factors
    risk_factors = 0
    
    if data.get('hypertension', 0) == 1:
        risk_factors += 1
    if data.get('heart_disease', 0) == 1:
        risk_factors += 1
    if data.get('age', 0) > 65:
        risk_factors += 1
    if data.get('smoking_status', '') == 'smokes':
        risk_factors += 1
    if data.get('avg_glucose_level', 0) > 140:
        risk_factors += 1
    if data.get('bmi', 0) > 30:
        risk_factors += 1
    
    # Simple logic based on risk factor count
    if risk_factors == 0:
        probability = 0.05
    elif risk_factors == 1:
        probability = 0.15
    elif risk_factors == 2:
        probability = 0.30
    elif risk_factors == 3:
        probability = 0.60
    else:
        probability = 0.80
    
    return probability, get_risk_level(probability)

@app.get("/")
async def root():
    """Root endpoint for documentation and health check"""
    return {
        "message": "Stroke Prediction API is running",
        "model_loaded": model_loaded,
        "usage": "Send a POST request to / with patient data",
        "example": {
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
    }

@app.post("/")
async def predict(request: Request):
    """Make stroke prediction based on input data"""
    try:
        data = await request.json()
        
        # Try using the model first
        if model_loaded:
            # Preprocess the data
            features = preprocess_without_pandas(data)
            
            # Make prediction
            probability, risk_level, success = predict_with_model(features)
            
            if success:
                return {
                    "probability": float(probability),
                    "prediction": risk_level,
                    "stroke_prediction": int(probability > 0.5),
                    "using_model": True
                }
        
        # Use fallback if model fails or isn't loaded
        probability, risk_level = fallback_prediction(data)
        return {
            "probability": float(probability),
            "prediction": risk_level,
            "stroke_prediction": int(probability > 0.5),
            "using_model": False
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid input: {str(e)}") 