import gradio as gr
import torch
import numpy as np
from PIL import Image
import requests
from io import BytesIO
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import io
from typing import Optional

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

# Classification classes for Alzheimer's
CLASSES = ["Non Demented", "Very Mild Demented", "Mild Demented", "Moderate Demented"]

# Model placeholder - replace with your actual model loading code
def load_model():
    # Load your trained model here
    # Example: model = torch.load("alzheimers_detection_model.pth")
    print("Alzheimer's detection model loaded")
    return None  # Replace with actual model

# Preprocessing function
def preprocess_image(image):
    # Add your preprocessing logic here
    # Example: resize, normalize, convert to tensor
    return image

# Prediction function
def predict(model, image):
    # Add your prediction logic here
    # Example: outputs = model(image)
    # This is a placeholder
    class_idx = np.random.randint(0, len(CLASSES))
    confidence = np.random.uniform(0.6, 0.95)
    prediction = CLASSES[class_idx]
    
    return prediction, float(confidence)

# Function to process direct image upload
def process_image(image):
    model = load_model()
    processed_image = preprocess_image(image)
    prediction, confidence = predict(model, processed_image)
    return {
        "prediction": prediction,
        "confidence": confidence
    }

# Function to process image from URL
def process_url(url):
    try:
        response = requests.get(url)
        image = Image.open(BytesIO(response.content))
        return process_image(image)
    except Exception as e:
        return {
            "prediction": "Error processing image",
            "confidence": 0,
            "error": str(e)
        }

# New FastAPI endpoint for API calls
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
        elif fileUrl:
            # Process image from Uploadcare URL
            return process_url(fileUrl)
        else:
            return {"error": "Either file or fileUrl is required"}
        
        # Process the image
        return process_image(image)
    except Exception as e:
        return {"error": str(e)}

# Original predict endpoint to maintain compatibility
@app.post("/predict")
async def predict_endpoint(file: UploadFile = File(...)):
    try:
        content = await file.read()
        image = Image.open(io.BytesIO(content))
        return process_image(image)
    except Exception as e:
        return {"error": str(e)}

# Create the Gradio interface
with gr.Blocks() as demo:
    gr.Markdown("# Alzheimer's Detection Model")
    gr.Markdown("Upload a brain MRI scan to detect signs of Alzheimer's disease.")
    
    with gr.Tab("Upload Image"):
        with gr.Row():
            with gr.Column():
                image_input = gr.Image(type="pil", label="Upload Brain MRI Scan")
                submit_btn = gr.Button("Analyze Scan")
            
            with gr.Column():
                prediction_output = gr.JSON(label="Analysis Results")
                gr.Markdown("### Classification Classes")
                gr.Markdown("\n".join([f"- {cls}" for cls in CLASSES]))
        
        submit_btn.click(fn=process_image, inputs=image_input, outputs=prediction_output)
    
    with gr.Tab("Process URL"):
        with gr.Row():
            with gr.Column():
                url_input = gr.Textbox(label="Image URL")
                url_submit_btn = gr.Button("Analyze from URL")
            
            with gr.Column():
                url_prediction_output = gr.JSON(label="Analysis Results")
        
        url_submit_btn.click(fn=process_url, inputs=url_input, outputs=url_prediction_output)

# Mount the Gradio app to FastAPI
app = gr.mount_gradio_app(app, demo, path="/")

# This is only used when running the file directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860) 