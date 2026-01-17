// src/pages/ScanHistoryScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  BackHandler,
} from 'react-native';
import {
  getAllScans,
  getScanStats,
  deleteScan,
  addFavorite,
  removeFavorite,
  isFavorite,
} from '../services/scanStorage';
import ScanResultModal from '../components/plantScan/ScanResultModal';

interface StoredScan {
  id: string;
  plantName: string;
  plantType?: string;
  growthStage?: string;
  healthScore: number;
  healthStatus: string;
  image: string;
  timestamp: number;
  createdAt: number;
  issues?: any[];
  careRecommendations?: any;
}

interface Stats {
  totalScans: number;
  healthyCount: number;
  stressedCount: number;
  diseasedCount: number;
  averageHealth: number;
}

const ScanHistoryScreen = ({ onBack }: any) => {
  const [scans, setScans] = useState<StoredScan[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const [selectedScan, setSelectedScan] = useState<StoredScan | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  useEffect(() => {
    loadScans();
  }, []);

  const loadScans = async () => {
    setLoading(true);
    try {
      const allScans = await getAllScans();
      setScans(allScans);

      const favStatus: { [key: string]: boolean } = {};
      for (const scan of allScans) {
        favStatus[scan.id] = await isFavorite(scan.id);
      }
      setFavorites(favStatus);

      const scanStats = await getScanStats();
      setStats(scanStats);
    } catch (error) {
      console.error('Error loading scans:', error);
      Alert.alert('Error', 'Failed to load scan history');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
  const backAction = () => {
    onBack?.();  // ✅ go back inside app
    return true; // ✅ prevent app from closing
  };

  const backHandler = BackHandler.addEventListener(
    "hardwareBackPress",
    backAction
  );

  return () => backHandler.remove();
}, []);

  const handleDeleteScan = (scanId: string) => {
    Alert.alert(
      'Delete Scan',
      'Are you sure you want to delete this scan?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const deleted = await deleteScan(scanId);
            if (deleted) {
              loadScans();
              Alert.alert('Success', 'Scan deleted');
            }
          },
        },
      ]
    );
  };

  const handleToggleFavorite = async (scanId: string) => {
    const isFav = favorites[scanId];
    if (isFav) {
      await removeFavorite(scanId);
    } else {
      await addFavorite(scanId);
    }
    setFavorites(prev => ({
      ...prev,
      [scanId]: !prev[scanId],
    }));
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getHealthStatus = (score: number) => {
    if (score >= 80) return 'Healthy';
    if (score >= 60) return 'Stressed';
    return 'Diseased';
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  const openScanDetail = (scan: StoredScan) => {
    setSelectedScan(scan);
    setShowDetailModal(true);
  };

  const renderScanCard = ({ item }: { item: StoredScan }) => (
    <TouchableOpacity
      style={styles.scanCard}
      onPress={() => openScanDetail(item)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.image }} style={styles.scanImage} />

      <View style={styles.scanInfo}>
        <Text style={styles.plantName}>{item.plantName}</Text>
        <Text style={styles.scanDate}>{formatDate(item.createdAt)}</Text>
        {item.plantType && (
          <View style={styles.plantTypeContainer}>
            <View style={styles.locationDot} />
            <Text style={styles.plantType}>{item.plantType}</Text>
          </View>
        )}
      </View>

      <View style={styles.scoreContainer}>
        <View
          style={[
            styles.scoreCircle,
            { backgroundColor: getHealthColor(item.healthScore) + '20' },
          ]}
        >
          <Text
            style={[
              styles.scoreText,
              { color: getHealthColor(item.healthScore) },
            ]}
          >
            {item.healthScore}
          </Text>
        </View>
        <Text style={[styles.scoreStatus, { color: getHealthColor(item.healthScore) }]}>
          {getHealthStatus(item.healthScore)}
        </Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={(e) => {
            e.stopPropagation();
            handleToggleFavorite(item.id);
          }}
        >
          <Text style={styles.favoriteIcon}>
            {favorites[item.id] ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={(e) => {
            e.stopPropagation();
            handleDeleteScan(item.id);
          }}
        >
          <Text style={styles.deleteIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Text style={styles.emptyIcon}>🌱</Text>
      </View>
      <Text style={styles.emptyTitle}>No Scans Yet</Text>
      <Text style={styles.emptyText}>
        Start scanning your plants to build your collection and track their health over time
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.loadingText}>Loading your garden...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Botanical Background */}
      <View style={styles.plantBackground}>
        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />
        <View style={styles.leafOne} />
        <View style={styles.leafTwo} />
        <View style={styles.leafThree} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButtonContainer} activeOpacity={0.7}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backButton}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Garden</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Stats Card */}
        {stats && stats.totalScans > 0 && (
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <View style={styles.statIconContainer}>
                <Text style={styles.statIconEmoji}>🌿</Text>
              </View>
              <Text style={styles.statValue}>{stats.totalScans}</Text>
              <Text style={styles.statLabel}>Total Scans</Text>
            </View>
            <View style={styles.statBox}>
              <View style={styles.statIconContainer}>
                <Text style={styles.statIconEmoji}>💚</Text>
              </View>
              <Text style={styles.statValue}>{stats.averageHealth}</Text>
              <Text style={styles.statLabel}>Avg Health</Text>
            </View>
            <View style={styles.statBox}>
              <View style={styles.statIconContainer}>
                <Text style={styles.statIconEmoji}>✨</Text>
              </View>
              <Text style={styles.statValue}>{stats.healthyCount}</Text>
              <Text style={styles.statLabel}>Healthy</Text>
            </View>
          </View>
        )}

        {/* Scans List */}
        <FlatList
          data={scans}
          renderItem={renderScanCard}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Detail Modal */}
      <Modal
        visible={showDetailModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowDetailModal(false)}
      >
        {selectedScan && (
          <ScanResultModal
            result={{
              ...selectedScan,
              healthScore: selectedScan.healthScore,
              issues: selectedScan.issues || [],
              image: selectedScan.image,
              plantName: selectedScan.plantName,
              plantType: selectedScan.plantType,
              growthStage: selectedScan.growthStage,
            }}
            onComplete={() => setShowDetailModal(false)}
            onRetry={() => {
              setShowDetailModal(false);
            }}
          />
        )}
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D1FAE5',
  },

  // 🌿 Botanical Background (matching Home)
  plantBackground: {
    flex: 1,
    backgroundColor: '#D1FAE5',
    position: 'relative',
  },

  glowTop: {
    position: 'absolute',
    top: -100,
    left: -80,
    width: 300,
    height: 300,
    backgroundColor: '#6EE7B7',
    borderRadius: 200,
    opacity: 0.6,
  },

  glowBottom: {
    position: 'absolute',
    bottom: -140,
    right: -100,
    width: 320,
    height: 320,
    backgroundColor: '#34D399',
    borderRadius: 220,
    opacity: 0.45,
  },

  leafOne: {
    position: 'absolute',
    top: 120,
    left: -40,
    width: 160,
    height: 280,
    backgroundColor: '#A7F3D0',
    borderTopLeftRadius: 120,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 140,
    opacity: 0.35,
    transform: [{ rotate: '-20deg' }],
  },

  leafTwo: {
    position: 'absolute',
    top: 360,
    right: -60,
    width: 200,
    height: 300,
    backgroundColor: '#6EE7B7',
    borderTopLeftRadius: 140,
    borderTopRightRadius: 60,
    borderBottomLeftRadius: 120,
    borderBottomRightRadius: 180,
    opacity: 0.25,
    transform: [{ rotate: '18deg' }],
  },

  leafThree: {
    position: 'absolute',
    bottom: -60,
    left: 40,
    width: 240,
    height: 200,
    backgroundColor: '#34D399',
    borderTopLeftRadius: 160,
    borderTopRightRadius: 120,
    borderBottomLeftRadius: 180,
    borderBottomRightRadius: 80,
    opacity: 0.2,
    transform: [{ rotate: '-10deg' }],
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#10B981',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 36,
  },

  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  backArrow: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '700',
  },

  backButton: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },

  placeholder: {
    width: 60,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },

  // Stats Container (floating card)
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginHorizontal: 16,
    marginTop: -30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },

  statBox: {
    flex: 1,
    alignItems: 'center',
  },

  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  statIconEmoji: {
    fontSize: 24,
  },

  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#10B981',
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '700',
  },

  // List Content
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },

  // Scan Card
  scanCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  scanImage: {
    width: 70,
    height: 70,
    borderRadius: 14,
    backgroundColor: '#DCFCE7',
    marginRight: 14,
  },

  scanInfo: {
    flex: 1,
  },

  plantName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },

  scanDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '600',
  },

  plantTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },

  locationDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#10B981',
  },

  plantType: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '700',
  },

  // Health Score
  scoreContainer: {
    alignItems: 'center',
    marginRight: 8,
  },

  scoreCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },

  scoreText: {
    fontSize: 18,
    fontWeight: '900',
  },

  scoreStatus: {
    fontSize: 10,
    fontWeight: '700',
  },

  // Action Buttons
  actionButtons: {
    flexDirection: 'column',
    gap: 4,
  },

  favoriteButton: {
    padding: 6,
  },

  favoriteIcon: {
    fontSize: 20,
  },

  deleteButton: {
    padding: 6,
  },

  deleteIcon: {
    fontSize: 18,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 80,
  },

  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },

  emptyIcon: {
    fontSize: 64,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#10B981',
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '600',
  },
});

export default ScanHistoryScreen;