// Define model types
export type ModelType = 'stroke' | 'alzheimers' | 'tumor';

// We'll keep this minimal since we're using the Hugging Face APIs directly
const isBuild = process.env.NEXT_PHASE === 'build';

/**
 * Get the URL for a model's API endpoint
 * @param modelType Type of model
 * @returns API endpoint URL
 */
export function getModelEndpoint(modelType: string): string {
  switch (modelType) {
    case 'stroke':
      return 'https://abdullah1211-ml-stroke.hf.space/api/predict';
    case 'tumor':
      return 'https://abdullah1211-ml-tumour.hf.space/api/predict';
    case 'alzheimers':
      return 'https://abdullah1211-ml-alzheimers.hf.space/api/predict';
    default:
      throw new Error(`Unknown model type: ${modelType}`);
  }
}

/**
 * Preload models to avoid cold starts
 * This is now just a placeholder that logs a message
 */
export async function preloadModels(modelTypes?: ModelType[]): Promise<void> {
  // Skip during build
  if (isBuild) {
    console.log('Skipping model preloading during build');
    return;
  }

  if (!modelTypes || modelTypes.length === 0) {
    modelTypes = ['stroke', 'alzheimers', 'tumor'];
  }
  
  console.log(`Models would be preloaded from: ${modelTypes.map(type => getModelEndpoint(type)).join(', ')}`);
  console.log('Note: Actual preloading is not implemented as we use APIs directly');
} 