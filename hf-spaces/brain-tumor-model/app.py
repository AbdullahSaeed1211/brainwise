import gradio as gr
import numpy as np
import tensorflow as tf
from PIL import Image
import io
import requests

# Load the trained model
try:
    model = tf.keras.models.load_model("BRAIINTUMORMODEL.h5")
    print("✅ Brain tumor model loaded successfully!")
    MODEL_LOADED = True
        except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None
    MODEL_LOADED = False

# Define class labels
class_labels = ["Glioma", "Meningioma", "No Tumor", "Pituitary"]

def predict_brain_tumor(img):
    """Predict brain tumor type from PIL Image"""
    if not MODEL_LOADED or model is None:
        return "❌ Model not available. Please check model file."
    
    try:
        # Convert to RGB if needed
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Preprocess image
        img = img.resize((224, 224))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        # Make prediction
        prediction = model.predict(img_array)[0]
        predicted_class_idx = np.argmax(prediction)
        predicted_class = class_labels[predicted_class_idx]
        confidence = float(np.max(prediction))
        
        # Format output
        result = f"🧠 **Prediction: {predicted_class}**\n"
        result += f"📊 **Confidence: {confidence*100:.2f}%**\n\n"
        result += "📈 **Class Probabilities:**\n"
        
        for i, label in enumerate(class_labels):
            prob = prediction[i] * 100
            result += f"• {label}: {prob:.2f}%\n"
        
        return result
        
    except Exception as e:
        return f"❌ Error during prediction: {str(e)}"

# Create Gradio Interface
with gr.Blocks(title="Brain Tumor Classification") as demo:
    gr.Markdown("# 🧠 Brain Tumor Classification")
    gr.Markdown("Upload an MRI image to classify the tumor type. You can also click on the example images below.")
    
    with gr.Row():
        with gr.Column():
            img_input = gr.Image(type="pil", label="img")
            
            with gr.Row():
                clear_btn = gr.Button("Clear", variant="secondary")
                submit_btn = gr.Button("Submit", variant="primary")
        
        with gr.Column():
            output = gr.Textbox(label="Prediction Result", lines=10)
            share_btn = gr.Button("🔗 Share via Link", variant="secondary")
    
    # Example images
    gr.Markdown("## Examples")
    with gr.Row():
        example_images = [
            "example_glioma.jpg",
            "example_meningioma.jpeg", 
            "example_notumor.jpeg",
            "example_pit.jpg"
        ]
        
        for img_path in example_images:
            with gr.Column():
                example_img = gr.Image(img_path, label=None, show_label=False, interactive=False)
                example_img.click(
                    fn=lambda x: x,
                    inputs=example_img,
                    outputs=img_input
                )
    
    # Event handlers
    submit_btn.click(
        fn=predict_brain_tumor,
        inputs=img_input,
        outputs=output
    )
    
    clear_btn.click(
        fn=lambda: (None, ""),
        outputs=[img_input, output]
    )

# Launch the app
if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=7860) 