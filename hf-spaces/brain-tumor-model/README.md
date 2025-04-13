---
title: ml-tumour
emoji: 🧠
colorFrom: pink
colorTo: purple
sdk: gradio
sdk_version: 3.44.0
app_file: app.py
pinned: false
---

Check out the configuration reference at https://huggingface.co/docs/hub/spaces-config-reference

# Brain Tumor Detection Model

This Hugging Face Space provides an API for brain tumor detection from MRI scans. It's designed to work with the BrainHealth AI application.

## API Usage

The model can be accessed via API in two ways:

1. **Direct Image Upload** - Upload an image file directly for analysis
2. **URL Processing** - Provide an image URL (such as from Uploadcare) for analysis

### Response Format

```json
{
  "prediction": "Tumor Detected or No Tumor Detected",
  "confidence": 0.85
}
```

## Model Details

This space uses a [description of your model architecture] trained on [your dataset details]. The model achieves [accuracy metrics] on validation data.

## Integration with BrainHealth AI

This model is part of the BrainHealth AI system, which provides comprehensive brain health assessment and monitoring tools. 