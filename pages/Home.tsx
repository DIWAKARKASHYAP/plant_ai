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

const Home = ({ onScanPlant, onViewHistory, onViewProfile }: any) => {
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
        recentScans: recentScans.map((scan: any) => ({
          id: scan.id,
          plantName: scan.plantName,
          status: scan.healthScore >= 80 ? 'Healthy' : scan.healthScore >= 60 ? 'Stressed' : 'Diseased',
          date: formatScanDate(scan.createdAt),
          icon: getPlantIcon(scan.plantName),
        })),
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
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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
            >
              <Text style={styles.tabIconActive}>🏠</Text>
              <Text style={styles.tabTextActive}>Home</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.tab}
              onPress={onViewHistory}
            >
              <Text style={styles.tabIcon}>📋</Text>
              <Text style={styles.tabText}>History</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.tab}
              onPress={onViewProfile}
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
            <RecentScans scans={dashboardData.recentScans} />
          )}
          <QuickActions />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSection: {
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 16,
  },
  tabNavigation: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tabActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
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
    color: '#666',
  },
  tabTextActive: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  contentPadding: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

export default Home;