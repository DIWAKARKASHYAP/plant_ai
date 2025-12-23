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
  ScrollView,
} from 'react-native';
import {
  getAllScans,
  getScanStats,
  deleteScan,
  addFavorite,
  removeFavorite,
  isFavorite,
} from '../services/scanStorage';

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

      // Check favorite status for each scan
      const favStatus: { [key: string]: boolean } = {};
      for (const scan of allScans) {
        favStatus[scan.id] = await isFavorite(scan.id);
      }
      setFavorites(favStatus);

      // Get stats
      const scanStats = await getScanStats();
      setStats(scanStats);
    } catch (error) {
      console.error('Error loading scans:', error);
      Alert.alert('Error', 'Failed to load scan history');
    } finally {
      setLoading(false);
    }
  };

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
    if (score >= 80) return '#34C759';
    if (score >= 60) return '#FF9500';
    return '#ff3b30';
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
      {/* Plant Image */}
      <Image
        source={{ uri: item.image }}
        style={styles.scanImage}
      />

      {/* Plant Info */}
      <View style={styles.scanInfo}>
        <Text style={styles.plantName}>{item.plantName}</Text>
        <Text style={styles.scanDate}>{formatDate(item.createdAt)}</Text>
        {item.plantType && (
          <Text style={styles.plantType}>📍 {item.plantType}</Text>
        )}
      </View>

      {/* Health Score */}
      <View style={styles.scoreContainer}>
        <View
          style={[
            styles.scoreCircle,
            { borderColor: getHealthColor(item.healthScore) },
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
        <Text style={styles.scoreStatus}>
          {getHealthStatus(item.healthScore)}
        </Text>
      </View>

      {/* Action Buttons */}
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => handleToggleFavorite(item.id)}
      >
        <Text style={styles.favoriteIcon}>
          {favorites[item.id] ? '❤️' : '🤍'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteScan(item.id)}
      >
        <Text style={styles.deleteIcon}>🗑️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderDetailModal = () => {
    if (!selectedScan) return null;

    return (
      <Modal
        visible={showDetailModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowDetailModal(false)}
      >
        <SafeAreaView style={styles.detailContainer}>
          {/* Detail Header */}
          <View style={styles.detailHeader}>
            <TouchableOpacity
              onPress={() => setShowDetailModal(false)}
              style={styles.detailCloseButton}
            >
              <Text style={styles.detailCloseText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.detailTitle}>Scan Details</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.detailScrollContent}
          >
            {/* Plant Image */}
            <Image
              source={{ uri: selectedScan.image }}
              style={styles.detailImage}
            />

            {/* Plant Info Card */}
            <View style={styles.detailCard}>
              <Text style={styles.detailCardTitle}>🌿 Plant Information</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Plant Name</Text>
                <Text style={styles.detailValue}>{selectedScan.plantName}</Text>
              </View>
              {selectedScan.plantType && (
                <View style={[styles.detailRow, styles.detailRowBorder]}>
                  <Text style={styles.detailLabel}>Plant Type</Text>
                  <Text style={styles.detailValue}>{selectedScan.plantType}</Text>
                </View>
              )}
              {selectedScan.growthStage && (
                <View style={[styles.detailRow, styles.detailRowBorder]}>
                  <Text style={styles.detailLabel}>Growth Stage</Text>
                  <Text style={styles.detailValue}>{selectedScan.growthStage}</Text>
                </View>
              )}
              <View style={[styles.detailRow, styles.detailRowBorder]}>
                <Text style={styles.detailLabel}>Scan Date</Text>
                <Text style={styles.detailValue}>
                  {formatDate(selectedScan.createdAt)}
                </Text>
              </View>
            </View>

            {/* Health Status Card */}
            <View style={styles.detailCard}>
              <Text style={styles.detailCardTitle}>❤️ Health Status</Text>
              <View style={styles.healthDetailContainer}>
                <View style={styles.healthDetailLeft}>
                  <View
                    style={[
                      styles.healthDetailCircle,
                      {
                        borderColor: getHealthColor(selectedScan.healthScore),
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.healthDetailScore,
                        {
                          color: getHealthColor(selectedScan.healthScore),
                        },
                      ]}
                    >
                      {selectedScan.healthScore}
                    </Text>
                  </View>
                </View>
                <View style={styles.healthDetailRight}>
                  <Text style={styles.healthDetailStatus}>
                    {getHealthStatus(selectedScan.healthScore)}
                  </Text>
                  <View
                    style={[
                      styles.healthDetailBar,
                      {
                        backgroundColor: getHealthColor(
                          selectedScan.healthScore
                        ),
                        width: `${selectedScan.healthScore}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>

            {/* Issues Card */}
            {selectedScan.issues && selectedScan.issues.length > 0 ? (
              <View style={styles.detailCard}>
                <Text style={styles.detailCardTitle}>🦠 Issues Detected</Text>
                {selectedScan.issues.map((issue: any, index: number) => (
                  <View key={index} style={styles.issueDetailCard}>
                    <View style={styles.issueDetailHeader}>
                      <Text style={styles.issueName}>{issue.name}</Text>
                      <Text style={styles.issueSeverity}>
                        {issue.severity?.toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.issueDescription}>
                      {issue.description}
                    </Text>
                    {issue.possibleCauses && issue.possibleCauses.length > 0 && (
                      <View style={styles.causesContainer}>
                        <Text style={styles.causesLabel}>Possible Causes:</Text>
                        {issue.possibleCauses.map((cause: string, i: number) => (
                          <Text key={i} style={styles.causeItem}>
                            • {cause}
                          </Text>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.detailCard}>
                <View style={styles.noIssuesContainer}>
                  <Text style={styles.noIssuesIcon}>✓</Text>
                  <Text style={styles.noIssuesText}>
                    No issues detected. Plant is healthy!
                  </Text>
                </View>
              </View>
            )}

            {/* Care Recommendations */}
            {selectedScan.careRecommendations && (
              <View style={styles.detailCard}>
                <Text style={styles.detailCardTitle}>
                  💡 Care Recommendations
                </Text>
                <View style={styles.careRow}>
                  <Text style={styles.careLabel}>☀️ Sunlight</Text>
                  <Text style={styles.careValue}>
                    {selectedScan.careRecommendations.sunlight}
                  </Text>
                </View>
                <View style={[styles.careRow, styles.careRowBorder]}>
                  <Text style={styles.careLabel}>💧 Watering</Text>
                  <Text style={styles.careValue}>
                    {selectedScan.careRecommendations.wateringFrequency}
                  </Text>
                </View>
                <View style={[styles.careRow, styles.careRowBorder]}>
                  <Text style={styles.careLabel}>🌱 Soil Type</Text>
                  <Text style={styles.careValue}>
                    {selectedScan.careRecommendations.soilType}
                  </Text>
                </View>
                <View style={[styles.careRow, styles.careRowBorder]}>
                  <Text style={styles.careLabel}>🥗 Fertilization</Text>
                  <Text style={styles.careValue}>
                    {selectedScan.careRecommendations.fertilization}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.detailActions}>
            <TouchableOpacity
              style={styles.detailDeleteButton}
              onPress={() => {
                setShowDetailModal(false);
                handleDeleteScan(selectedScan.id);
              }}
            >
              <Text style={styles.detailDeleteText}>🗑️ Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.detailFavoriteButton}
              onPress={() => {
                handleToggleFavorite(selectedScan.id);
              }}
            >
              <Text style={styles.detailFavoriteText}>
                {favorites[selectedScan.id] ? '❤️ Unfavorite' : '🤍 Favorite'}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📸</Text>
      <Text style={styles.emptyTitle}>No Scans Yet</Text>
      <Text style={styles.emptyText}>
        Start scanning your plants to build your scan history
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan History</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Stats */}
      {stats && stats.totalScans > 0 && (
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats.totalScans}</Text>
            <Text style={styles.statLabel}>Total Scans</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats.averageHealth}</Text>
            <Text style={styles.statLabel}>Avg Health</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats.healthyCount}</Text>
            <Text style={styles.statLabel}>Healthy</Text>
          </View>
        </View>
      )}

      {/* Scans List */}
      <FlatList
        data={scans}
        renderItem={renderScanCard}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Detail Modal */}
      {renderDetailModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#f0f0f0',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  scanCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  scanImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    marginRight: 12,
  },
  scanInfo: {
    flex: 1,
  },
  plantName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  scanDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  plantType: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  scoreContainer: {
    alignItems: 'center',
    marginRight: 8,
  },
  scoreCircle: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '700',
  },
  scoreStatus: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    fontWeight: '600',
  },
  favoriteButton: {
    padding: 8,
    marginRight: 4,
  },
  favoriteIcon: {
    fontSize: 18,
  },
  deleteButton: {
    padding: 8,
  },
  deleteIcon: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Detail Modal Styles
  detailContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailCloseButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  detailCloseText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  detailScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 100,
  },
  detailImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
    marginBottom: 16,
  },
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  detailCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  detailRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  detailLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },
  healthDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  healthDetailLeft: {
    alignItems: 'center',
  },
  healthDetailCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  healthDetailScore: {
    fontSize: 28,
    fontWeight: '700',
  },
  healthDetailRight: {
    flex: 1,
  },
  healthDetailStatus: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  healthDetailBar: {
    height: 8,
    borderRadius: 4,
    width: '100%',
  },
  issueDetailCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ff3b30',
  },
  issueDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  issueName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
  },
  issueSeverity: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ff3b30',
  },
  issueDescription: {
    fontSize: 12,
    color: '#555',
    lineHeight: 18,
    marginBottom: 8,
  },
  causesContainer: {
    marginTop: 8,
  },
  causesLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
  },
  causeItem: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
    lineHeight: 16,
  },
  noIssuesContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noIssuesIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  noIssuesText: {
    fontSize: 13,
    color: '#34C759',
    fontWeight: '600',
  },
  careRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  careRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  careLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  careValue: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  detailActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  detailDeleteButton: {
    flex: 1,
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  detailDeleteText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  detailFavoriteButton: {
    flex: 1,
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  detailFavoriteText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ScanHistoryScreen;