---
title: ml-alzheimers
emoji: 🧠
colorFrom: blue
colorTo: indigo
sdk: gradio
sdk_version: 3.44.0
app_file: app.py
pinned: false
---

Check out the configuration reference at https://huggingface.co/docs/hub/spaces-config-reference

# Alzheimer's Detection Model

This Hugging Face Space provides an API for Alzheimer's disease detection from brain MRI scans. It's designed to work with the BrainHealth AI application.

## API Usage

The model can be accessed via API in two ways:

1. **Direct Image Upload** - Upload an image file directly for analysis
2. **URL Processing** - Provide an image URL (such as from Uploadcare) for analysis

### Response Format

```json
{
  "prediction": "Non Demented/Very Mild Demented/Mild Demented/Moderate Demented",
  "confidence": 0.92
}
```

## Classification Classes

The model classifies brain scans into four categories:
- **Non Demented** - No signs of Alzheimer's disease
- **Very Mild Demented** - Early signs of cognitive decline
- **Mild Demented** - Mild Alzheimer's disease
- **Moderate Demented** - Moderate Alzheimer's disease

## Model Details

This space uses a [description of your model architecture] trained on [your dataset details]. The model achieves [accuracy metrics] on validation data.

## Integration with BrainHealth AI

This model is part of the BrainHealth AI system, which provides comprehensive brain health assessment and monitoring tools. 