---
title: Brain Tumor MRI Classification
emoji: 🧠
colorFrom: red
colorTo: purple
sdk: gradio
sdk_version: 3.50.0
app_file: app.py
pinned: false
license: mit
---

# Brain Tumor MRI Classification

This Hugging Face Space provides an interactive demo for brain tumor classification from MRI scans.

## Model Overview

The model can classify brain MRI scans into four categories:
- **Glioma**: A type of tumor that occurs in the brain and spinal cord
- **Meningioma**: A tumor that forms on membranes that cover the brain and spinal cord
- **Pituitary**: A tumor that forms in the pituitary gland
- **No Tumor**: Normal brain tissue without tumor

## How to Use

1. Upload a brain MRI scan image using the interface
2. The model will process the image and provide predictions for each tumor class
3. Results show the probability for each possible class

## API Integration

This app provides a FastAPI endpoint for programmatic access:

### POST `/api/predict`

Upload an MRI scan image for analysis.

**Request Format:**
- Form data with either:
  - `file`: An image file upload
  - `fileUrl`: A URL to an image

**Example using cURL:**
```bash
# With file upload
curl -X POST https://yourusername-brain-tumor-model.hf.space/api/predict -F "file=@/path/to/brain_scan.jpg"

# With URL
curl -X POST https://yourusername-brain-tumor-model.hf.space/api/predict -F "fileUrl=https://example.com/brain_scan.jpg"
```

**Response Format:**
```json
{
  "prediction": "glioma",
  "confidence": 0.92,
  "is_tumor": true,
  "binary_result": "Tumor Detected",
  "class_probabilities": {
    "glioma": 0.92,
    "meningioma": 0.05,
    "pituitary": 0.02,
    "no_tumor": 0.01
  }
}
```

## Model Details

- **Architecture**: ResNet50 with transfer learning
- **Input**: MRI brain scans (axial view preferred)
- **Output**: Probabilities for each tumor class
- **Dataset**: Brain Tumor MRI Dataset from Kaggle with 7,023 images across four classes

## Model Performance

- **Accuracy**: 95%+
- **Training Methodology**: Transfer learning with data augmentation
- **Validation Method**: 80/20 train-validation split with stratification

## Integration with BrainWise App

This model serves as the backend for the BrainWise application's brain tumor detection feature, providing users with rapid analysis of brain MRI scans.

## Limitations

- This model should be used for preliminary screening only
- The model may not detect tumors of types not included in the training data
- Performance may vary depending on the quality and orientation of the MRI scans
- Always consult with medical professionals for diagnosis

## Disclaimer

This model is intended for research and educational purposes only. It should not be used as a substitute for professional medical diagnosis. The model's predictions should always be reviewed by qualified healthcare professionals.

## Citation

If you use this model in research, please cite:

```
@misc{brainwise-tumor-detection,
  author = {BrainWise Health},
  title = {Brain Tumor Classification from MRI Scans},
  year = {2023},
  howpublished = {Hugging Face Spaces},
  url = {https://huggingface.co/spaces/abdullah1211-ml-tumour}
}
```

## License

This project is licensed under the MIT License - see the LICENSE file for details. 