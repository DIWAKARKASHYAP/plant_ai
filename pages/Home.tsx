// src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import Header from '../components/Header';
import ScanButton from '../components/ScanButton';
import StatsCards from '../components/StatsCards';
import WeatherAlert from '../components/WeatherAlert';
import CareTip from '../components/CareTip';
import RecentScans from '../components/RecentScans';
import QuickActions from '../components/QuickActions';
import { getScanStats, getRecentScans } from '../services/scanStorage';

import { Modal } from 'react-native';
import ScanResultModal from '../components/plantScan/ScanResultModal';

const normalizeScanForModal = (scan: any) => ({
  plantName: scan.plantName,
  plantType: scan.plantType || 'Unknown',
  growthStage: scan.growthStage || 'Unknown',
  healthScore: scan.healthScore,
  image: scan.image,
  issues: scan.issues || [],
});

const Home = ({ onScanPlant, onViewHistory, onViewProfile }: any) => {
  const [selectedScan, setSelectedScan] = useState<any>(null);
const [showResultModal, setShowResultModal] = useState(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Get scan statistics
      const scanStats = await getScanStats();
      setStats(scanStats);

      // Get recent scans
      const recentScans = await getRecentScans(3);

      setDashboardData({
        healthyPlants: scanStats.healthyCount,
        plantsNeedingAttention: scanStats.stressedCount + scanStats.diseasedCount,
        lastScanDate: recentScans.length > 0 
          ? new Date(recentScans[0].createdAt).toLocaleDateString()
          : 'Never',
        weatherAlert: '⚠️ Rain expected tomorrow - reduce watering frequency',
        recentScans
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Set default data
      setDashboardData({
        healthyPlants: 0,
        plantsNeedingAttention: 0,
        lastScanDate: 'Never',
        weatherAlert: '⚠️ Rain expected tomorrow - reduce watering frequency',
        recentScans: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const formatScanDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getPlantIcon = (plantName: string): string => {
    const name = plantName.toLowerCase();
    if (name.includes('monstera')) return '🌿';
    if (name.includes('snake')) return '🪴';
    if (name.includes('pothos')) return '🌱';
    if (name.includes('succulent')) return '🌵';
    if (name.includes('fern')) return '🍃';
    return '🌿';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.loadingText}>Loading your plants...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.plantBackground}>
    {/* Decorative leaves */}
    <View style={styles.leafOne} />
    <View style={styles.leafTwo} />
    <View style={styles.leafThree} />

    {/* Soft glow */}
    <View style={styles.glowTop} />
    <View style={styles.glowBottom} />
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header with Tabs */}
        <View style={styles.headerSection}>
          <Header />
          <View style={styles.tabNavigation}>
            <TouchableOpacity 
              style={[styles.tab, styles.tabActive]}
              disabled={true}
              activeOpacity={0.7}
            >
              <Text style={styles.tabIconActive}>🏠</Text>
              <Text style={styles.tabTextActive}>Home</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.tab}
              onPress={onViewHistory}
              activeOpacity={0.7}
            >
              <Text style={styles.tabIcon}>📋</Text>
              <Text style={styles.tabText}>History</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.tab}
              onPress={onViewProfile}
              activeOpacity={0.7}
            >
              <Text style={styles.tabIcon}>👤</Text>
              <Text style={styles.tabText}>Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.contentPadding}>
          <ScanButton onPress={onScanPlant} />
          <StatsCards data={dashboardData} />
          {dashboardData?.weatherAlert && <WeatherAlert message={dashboardData.weatherAlert} />}
          <CareTip />
          {dashboardData?.recentScans && dashboardData.recentScans.length > 0 && (
<RecentScans
  scans={dashboardData.recentScans}
onSelect={(scan:any) => {
  setSelectedScan(normalizeScanForModal(scan));
  setShowResultModal(true);
}}

/>
          )}
          {/* <QuickActions /> */}
        </View>
      </ScrollView>
      </View>
      <Modal
  visible={showResultModal}
  animationType="slide"
  transparent={false}
>
  {selectedScan && (
    <ScanResultModal
      result={selectedScan}
      onComplete={() => setShowResultModal(false)}
      onRetry={() => {
        setShowResultModal(false);
        onScanPlant();
      }}
    />
  )}
</Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  plantBackground: {
  flex: 1,
  backgroundColor: '#D1FAE5',
  position: 'relative',
},

/* Soft glowing plant light */
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

/* Leaf shapes */
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

  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  headerSection: {
    backgroundColor: '#10B981',
    paddingBottom: 16,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  tabNavigation: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  tabActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  tabIcon: {
    fontSize: 18,
  },
  tabIconActive: {
    fontSize: 18,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  tabTextActive: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10B981',
  },
  contentPadding: {
    paddingHorizontal: 20,
  },
});

export default Home;