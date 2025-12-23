// src/services/imageStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

/**
 * Saves image URI to storage (uses cache path directly)
 * The camera already saves to cache, so we just need to track it
 * @param imagePath - The camera cache path
 * @returns The image URI for use in Image component
 */
export const saveCapturedImage = async (imagePath: string): Promise<string> => {
  try {
    console.log('Processing captured image:', imagePath);

    // Camera images are already in cache, we can use them directly
    // Format as file:// URI for Image component compatibility
    const imageUri = imagePath.startsWith('file://')
      ? imagePath
      : `file://${imagePath}`;

    console.log('Image URI formatted:', imageUri);
    return imageUri;
  } catch (error) {
    console.error('Error processing image:', error);
    // Return original path as fallback
    return imagePath;
  }
};

/**
 * Formats image URI to file:// scheme if needed
 * @param path - The image path
 * @returns Formatted file URI
 */
export const formatImageUri = (path: string): string => {
  if (path.startsWith('file://')) {
    return path;
  }
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `file://${path}`;
};

/**
 * Saves image metadata to AsyncStorage for later retrieval
 * @param id - Unique scan ID
 * @param imagePath - Path to the image
 */
export const saveImageMetadata = async (id: string, imagePath: string): Promise<void> => {
  try {
    const metadata = {
      id,
      imagePath,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(`image_metadata_${id}`, JSON.stringify(metadata));
    console.log('Image metadata saved:', id);
  } catch (error) {
    console.error('Error saving image metadata:', error);
  }
};

/**
 * Retrieves image metadata from AsyncStorage
 * @param id - Unique scan ID
 */
export const getImageMetadata = async (id: string) => {
  try {
    const data = await AsyncStorage.getItem(`image_metadata_${id}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving image metadata:', error);
    return null;
  }
};