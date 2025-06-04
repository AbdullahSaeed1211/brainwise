import { uploadFile } from '@uploadcare/upload-client';

/**
 * Uploads a file to Uploadcare
 * @param file File object from form data
 * @returns Uploadcare file info including UUID and CDN URL
 */
export async function uploadToUploadcare(fileBuffer: Buffer, fileName: string, mimeType: string) {
  try {
    // Convert Buffer to Blob for uploadcare client
    const blob = new Blob([fileBuffer], { type: mimeType });
    
    // Create a File object from the blob
    const file = new File([blob], fileName, { type: mimeType });
    
    // Upload file to Uploadcare
    const result = await uploadFile(file, {
      publicKey: process.env.UPLOADCARE_PUBLIC_KEY || '',
      store: 'auto',
      metadata: {
        contentType: mimeType
      }
    });
    
    if (!result.uuid) {
      throw new Error('Upload failed: No UUID returned');
    }
    
    return {
      uuid: result.uuid,
      cdnUrl: `https://ucarecdn.com/${result.uuid}/`,
      fileName: fileName
    };
  } catch (error) {
    console.error('Error uploading to Uploadcare:', error);
    throw new Error('Failed to upload file to Uploadcare');
  }
} 