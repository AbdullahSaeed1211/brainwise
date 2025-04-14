import gradio as gr
import torch
import torchvision.transforms as transforms
import torchvision.models as models
from torch import nn
from PIL import Image
import os
import numpy as np
import io
import requests
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
from typing import Optional

# Constants
MODEL_PATH = "tumor_detection_model.pth"
CLASS_NAMES = ["glioma", "meningioma", "pituitary", "no_tumor"]

# Create a FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Global model variable
model = None

# Load or create model
def load_model():
    global model
    if model is not None:
        return model
    
    # Using ResNet50 as base model with weights parameter
    resnet_model = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V1)
    # Modify for our classification task
    num_classes = len(CLASS_NAMES)
    resnet_model.fc = nn.Sequential(
        nn.Dropout(0.3),
        nn.Linear(resnet_model.fc.in_features, num_classes)
    )
    
    # Load saved weights if available
    if os.path.exists(MODEL_PATH):
        print(f"Loading model from {MODEL_PATH}")
        try:
            # Load model weights
            resnet_model.load_state_dict(torch.load(MODEL_PATH, map_location=torch.device('cpu')))
            print("Model loaded successfully!")
        except Exception as e:
            print(f"Error loading model: {e}")
            print("Using pretrained model without tumor-specific weights")
    else:
        print(f"Model file {MODEL_PATH} not found. Using pretrained model without tumor-specific weights")
    
    resnet_model.eval()
    model = resnet_model
    return model

# Preprocess image
def preprocess_image(image):
    # Define transformations
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    # Convert to PIL if needed
    if isinstance(image, np.ndarray):
        image = Image.fromarray(image.astype('uint8'))
            
    # Convert to RGB if needed and apply transformations
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    return transform(image).unsqueeze(0)  # Add batch dimension

# Predict image function for Gradio interface
def predict_image(image):
    if image is None:
        return "Please upload an image"
    
    try:
        # Load model
        current_model = load_model()
        
        # Preprocess the image
        processed_image = preprocess_image(image)
        
        # Make prediction
        with torch.no_grad():
            outputs = current_model(processed_image)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)[0]
        
        # Get prediction results
        probs = {CLASS_NAMES[i]: float(probabilities[i]) for i in range(len(CLASS_NAMES))}
        predicted_class = max(probs, key=probs.get)
        confidence = probs[predicted_class]
        
        # Format the result
        result = f"Prediction: {predicted_class.capitalize()}\n"
        result += f"Confidence: {confidence*100:.1f}%\n"
        result += f"Tumor Detected: {'Yes' if predicted_class != 'no_tumor' else 'No'}\n\n"
        result += "Class Probabilities:\n"
        
        for cls, prob in probs.items():
            result += f"- {cls.capitalize()}: {prob*100:.1f}%\n"
        
        return result
    except Exception as e:
        return f"Error analyzing image: {str(e)}"

# Function to process image from URL for API
def process_url(url):
    try:
        response = requests.get(url)
        image = Image.open(BytesIO(response.content))
        
        # Load model
        current_model = load_model()
        
        # Preprocess the image
        processed_image = preprocess_image(image)
        
        # Make prediction
        with torch.no_grad():
            outputs = current_model(processed_image)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)[0]
        
        # Get prediction results
        probs = {CLASS_NAMES[i]: float(probabilities[i]) for i in range(len(CLASS_NAMES))}
        predicted_class = max(probs, key=probs.get)
        confidence = probs[predicted_class]
        
        return {
            "prediction": predicted_class,
            "confidence": confidence,
            "is_tumor": predicted_class != "no_tumor",
            "binary_result": "Tumor Detected" if predicted_class != "no_tumor" else "No Tumor Detected",
            "class_probabilities": probs
        }
    except Exception as e:
        return {
            "error": str(e),
            "prediction": None,
            "confidence": 0,
            "is_tumor": False,
            "binary_result": "Error",
            "class_probabilities": {label: 0.0 for label in CLASS_NAMES}
        }

# FastAPI endpoint for API calls
@app.post("/api/predict")
async def api_predict(
    file: Optional[UploadFile] = File(None),
    fileUrl: Optional[str] = Form(None)
):
    try:
        if file:
            # Process uploaded file
            content = await file.read()
            image = Image.open(io.BytesIO(content))
            
            # Load model
            current_model = load_model()
            
            # Preprocess the image
            processed_image = preprocess_image(image)
            
            # Make prediction
            with torch.no_grad():
                outputs = current_model(processed_image)
                probabilities = torch.nn.functional.softmax(outputs, dim=1)[0]
            
            # Get prediction results
            probs = {CLASS_NAMES[i]: float(probabilities[i]) for i in range(len(CLASS_NAMES))}
            predicted_class = max(probs, key=probs.get)
            confidence = probs[predicted_class]
            
            return {
                "prediction": predicted_class,
                "confidence": confidence,
                "is_tumor": predicted_class != "no_tumor",
                "binary_result": "Tumor Detected" if predicted_class != "no_tumor" else "No Tumor Detected",
                "class_probabilities": probs
            }
        elif fileUrl:
            # Process image from URL
            return process_url(fileUrl)
        else:
            return {"error": "Either file or fileUrl is required"}
    except Exception as e:
        return {"error": str(e)}

# Load the model at startup
load_model()

# Title and description
title = "Brain Tumor MRI Classification"
description = """
This model can classify brain MRI scans into four categories:
- Glioma: A tumor that occurs in the brain and spinal cord
- Meningioma: A tumor that forms on membranes that cover the brain and spinal cord
- Pituitary: A tumor that forms in the pituitary gland
- No Tumor: Normal brain tissue without tumor

Upload a brain MRI scan image for analysis.
"""

# Create Gradio interface
demo = gr.Interface(
    fn=predict_image,
    inputs=gr.Image(type="pil"),
    outputs=gr.Textbox(),
    title=title,
    description=description,
    allow_flagging=False  # Using older parameter format
)

# Create the FastAPI app with Gradio
app = gr.mount_gradio_app(app, demo, path="/")

# This is only used when running the file directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860) 