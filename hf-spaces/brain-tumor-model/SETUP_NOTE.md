# Setup Note

No trained model or dataset was found during deployment.

## To complete setup:

1. Download the brain tumor dataset from Kaggle:
   https://www.kaggle.com/datasets/masoudnickparvar/brain-tumor-mri-dataset/data

2. Place the dataset in: `ml-stuff/tumour/dataset`

3. Run the Jupyter notebook: `ml-stuff/tumour/Brain_Tumor_Classification_Using_DL_&_GradCAM (1).ipynb`

4. Copy the resulting `best_model.pth` to: `hf-spaces/brain-tumor-model/tumor_detection_model.pth`

The model will fall back to using pretrained weights if no trained model is found.
