import * as tf from '@tensorflow/tfjs';

// Define model types
export type ModelType = 'stroke' | 'alzheimers' | 'tumor';

// Interface for model metadata
interface ModelMetadata {
  version: string;
  lastUpdated: string;
  metrics: {
    accuracy?: number;
    precision?: number;
    recall?: number;
    f1Score?: number;
  };
}

// Model cache to store loaded models
const modelCache: Record<string, {
  model: tf.GraphModel | tf.LayersModel;
  metadata: ModelMetadata | null;
  loadedAt: Date;
}> = {};

// Configuration for model locations
const MODEL_CONFIG = {
  production: {
    baseUrl: 'https://storage.googleapis.com/brain-ai-models',
    useCache: true,
  },
  development: {
    baseUrl: '/models',
    useCache: true,
  }
};

// Get the current environment
const isProduction = process.env.NODE_ENV === 'production';
const isBuild = process.env.NEXT_PHASE === 'build';
const config = isProduction ? MODEL_CONFIG.production : MODEL_CONFIG.development;

/**
 * Get the URL for a specific model
 */
export function getModelUrl(modelType: ModelType, version?: string): string {
  const versionPath = version ? `/versions/${version}` : '';
  return `${config.baseUrl}/${modelType}-model${versionPath}`;
}

/**
 * Load model metadata
 */
export async function loadModelMetadata(modelType: ModelType, version?: string): Promise<ModelMetadata | null> {
  // Skip model loading during build
  if (isBuild) {
    console.log(`Skipping metadata load for ${modelType} model during build`);
    return null;
  }

  try {
    const modelUrl = getModelUrl(modelType, version);
    const response = await fetch(`${modelUrl}/metadata.json`);
    
    if (!response.ok) {
      console.error(`Failed to load metadata for ${modelType} model:`, response.statusText);
      return null;
    }
    
    return await response.json() as ModelMetadata;
  } catch (error) {
    console.error(`Error loading ${modelType} model metadata:`, error);
    return null;
  }
}

/**
 * Load a TensorFlow.js model from Hugging Face Space or local path
 * @param modelType Type of model to load (e.g., 'stroke', 'alzheimers')
 * @returns Loaded model or null if loading fails
 */
export async function loadModel(modelType: string) {
  try {
    // This is a placeholder - in the actual implementation, we'll call the Hugging Face API
    console.log(`Loading ${modelType} model from Hugging Face...`);
    return null;
  } catch (error) {
    console.error(`Error loading ${modelType} model:`, error);
    return null;
  }
}

/**
 * Get the URL for a model's API endpoint
 * @param modelType Type of model
 * @returns API endpoint URL
 */
export function getModelEndpoint(modelType: string): string {
  switch (modelType) {
    case 'stroke':
      return 'https://abdullah1211-ml-stroke.hf.space';
    case 'tumor':
      return 'https://abdullah1211-ml-tumor.hf.space';
    case 'alzheimers':
      return 'https://abdullah1211-ml-alzheimers.hf.space';
    default:
      throw new Error(`Unknown model type: ${modelType}`);
  }
}

/**
 * Preload models to avoid cold starts
 */
export async function preloadModels(modelTypes?: ModelType[]): Promise<void> {
  // Skip model preloading during build
  if (isBuild) {
    console.log('Skipping model preloading during build');
    return;
  }

  if (!modelTypes || modelTypes.length === 0) {
    // If no specific models provided, preload all available models
    modelTypes = ['stroke', 'alzheimers', 'tumor'];
  }
  
  console.log(`Preloading models: ${modelTypes.join(', ')}`);
  
  // Attempt to load each model in parallel
  await Promise.all(
    modelTypes.map(async (modelType) => {
      try {
        await loadModel(modelType);
        console.log(`✅ Preloaded model: ${modelType}`);
      } catch (error) {
        console.warn(`⚠️ Failed to preload model ${modelType}:`, error);
      }
    })
  );
}

/**
 * Clear the model cache
 */
export function clearModelCache(modelType?: ModelType): void {
  if (modelType) {
    // Clear specific model types
    Object.keys(modelCache).forEach(key => {
      if (key.startsWith(modelType)) {
        delete modelCache[key];
      }
    });
    console.log(`Cleared cache for ${modelType} models`);
  } else {
    // Clear all models
    Object.keys(modelCache).forEach(key => {
      delete modelCache[key];
    });
    console.log('Cleared entire model cache');
  }
}

/**
 * Get cache status
 */
export function getModelCacheStatus(): {
  totalModels: number;
  models: {
    type: string;
    version: string | undefined;
    loadedAt: Date;
    metadata: ModelMetadata | null;
  }[];
} {
  const models = Object.entries(modelCache).map(([key, { loadedAt, metadata }]) => {
    const [type, version] = key.split('-');
    return {
      type,
      version: version || undefined,
      loadedAt,
      metadata
    };
  });
  
  return {
    totalModels: models.length,
    models
  };
} 