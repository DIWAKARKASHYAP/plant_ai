// src/services/scanStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const SCANS_KEY = 'plant_scans';
const FAVORITES_KEY = 'favorite_scans';

// Type definition
interface ScanResult {
  id: string;
  plantName: string;
  plantType: string;
  growthStage: string;
  healthStatus: string;
  healthScore: number;
  issues: any[];
  careRecommendations: any;
  recommendations: string[];
  image: string;
  timestamp: number;
}

interface StoredScan extends ScanResult {
  createdAt: number;
  updatedAt: number;
}

/**
 * Save a scan result to AsyncStorage
 */
export const saveScan = async (scan: ScanResult): Promise<boolean> => {
  try {
    const storedScan: StoredScan = {
      ...scan,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Get existing scans
    const existingScans = await getAllScans();

    // Add new scan to the beginning
    const updatedScans = [storedScan, ...existingScans];

    // Save to AsyncStorage
    await AsyncStorage.setItem(
      SCANS_KEY,
      JSON.stringify(updatedScans)
    );

    console.log('Scan saved successfully:', scan.id);
    return true;
  } catch (error) {
    console.error('Error saving scan:', error);
    return false;
  }
};

/**
 * Get all stored scans
 */
export const getAllScans = async (): Promise<StoredScan[]> => {
  try {
    const scans = await AsyncStorage.getItem(SCANS_KEY);

    if (!scans) {
      return [];
    }

    const parsedScans: StoredScan[] = JSON.parse(scans);
    return parsedScans.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Error retrieving scans:', error);
    return [];
  }
};

/**
 * Get a specific scan by ID
 */
export const getScanById = async (scanId: string): Promise<StoredScan | null> => {
  try {
    const scans = await getAllScans();
    const scan = scans.find(s => s.id === scanId);

    return scan || null;
  } catch (error) {
    console.error('Error getting scan by ID:', error);
    return null;
  }
};

/**
 * Get recent scans (last N scans)
 */
export const getRecentScans = async (limit: number = 5): Promise<StoredScan[]> => {
  try {
    const scans = await getAllScans();
    return scans.slice(0, limit);
  } catch (error) {
    console.error('Error getting recent scans:', error);
    return [];
  }
};

/**
 * Delete a scan by ID
 */
export const deleteScan = async (scanId: string): Promise<boolean> => {
  try {
    const scans = await getAllScans();
    const filteredScans = scans.filter(s => s.id !== scanId);

    await AsyncStorage.setItem(
      SCANS_KEY,
      JSON.stringify(filteredScans)
    );

    console.log('Scan deleted:', scanId);
    return true;
  } catch (error) {
    console.error('Error deleting scan:', error);
    return false;
  }
};

/**
 * Update a scan (e.g., add notes, mark as favorite)
 */
export const updateScan = async (
  scanId: string,
  updates: Partial<StoredScan>
): Promise<boolean> => {
  try {
    const scans = await getAllScans();
    const scanIndex = scans.findIndex(s => s.id === scanId);

    if (scanIndex === -1) {
      console.error('Scan not found');
      return false;
    }

    scans[scanIndex] = {
      ...scans[scanIndex],
      ...updates,
      updatedAt: Date.now(),
    };

    await AsyncStorage.setItem(
      SCANS_KEY,
      JSON.stringify(scans)
    );

    console.log('Scan updated:', scanId);
    return true;
  } catch (error) {
    console.error('Error updating scan:', error);
    return false;
  }
};

/**
 * Clear all scans
 */
export const clearAllScans = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(SCANS_KEY);
    console.log('All scans cleared');
    return true;
  } catch (error) {
    console.error('Error clearing scans:', error);
    return false;
  }
};

/**
 * Get scan statistics
 */
export const getScanStats = async (): Promise<{
  totalScans: number;
  healthyCount: number;
  stressedCount: number;
  diseasedCount: number;
  averageHealth: number;
}> => {
  try {
    const scans = await getAllScans();

    const stats = {
      totalScans: scans.length,
      healthyCount: 0,
      stressedCount: 0,
      diseasedCount: 0,
      averageHealth: 0,
    };

    if (scans.length === 0) {
      return stats;
    }

    let totalScore = 0;

    scans.forEach(scan => {
      totalScore += scan.healthScore;

      if (scan.healthScore >= 80) {
        stats.healthyCount++;
      } else if (scan.healthScore >= 60) {
        stats.stressedCount++;
      } else {
        stats.diseasedCount++;
      }
    });

    stats.averageHealth = Math.round(totalScore / scans.length);

    return stats;
  } catch (error) {
    console.error('Error getting scan stats:', error);
    return {
      totalScans: 0,
      healthyCount: 0,
      stressedCount: 0,
      diseasedCount: 0,
      averageHealth: 0,
    };
  }
};

/**
 * Search scans by plant name
 */
export const searchScans = async (query: string): Promise<StoredScan[]> => {
  try {
    const scans = await getAllScans();
    const lowerQuery = query.toLowerCase();

    return scans.filter(
      scan =>
        scan.plantName.toLowerCase().includes(lowerQuery) ||
        scan.plantType?.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error('Error searching scans:', error);
    return [];
  }
};

/**
 * Add scan to favorites
 */
export const addFavorite = async (scanId: string): Promise<boolean> => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    const favoritesList = favorites ? JSON.parse(favorites) : [];

    if (!favoritesList.includes(scanId)) {
      favoritesList.push(scanId);
      await AsyncStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(favoritesList)
      );
    }

    return true;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return false;
  }
};

/**
 * Remove scan from favorites
 */
export const removeFavorite = async (scanId: string): Promise<boolean> => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    const favoritesList = favorites ? JSON.parse(favorites) : [];

    const filteredFavorites = favoritesList.filter((id: string) => id !== scanId);

    await AsyncStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(filteredFavorites)
    );

    return true;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return false;
  }
};

/**
 * Get favorite scans
 */
export const getFavoriteScan = async (): Promise<StoredScan[]> => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    const favoritesList = favorites ? JSON.parse(favorites) : [];

    const scans = await getAllScans();

    return scans.filter(scan => favoritesList.includes(scan.id));
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

/**
 * Check if scan is favorite
 */
export const isFavorite = async (scanId: string): Promise<boolean> => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    const favoritesList = favorites ? JSON.parse(favorites) : [];

    return favoritesList.includes(scanId);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};

export default {
  saveScan,
  getAllScans,
  getScanById,
  getRecentScans,
  deleteScan,
  updateScan,
  clearAllScans,
  getScanStats,
  searchScans,
  addFavorite,
  removeFavorite,
  getFavoriteScan,
  isFavorite,
};