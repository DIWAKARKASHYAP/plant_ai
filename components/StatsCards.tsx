import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatsCards = ({ data }: any) => {
  return (
    <View style={styles.statsContainer}>
      <View style={[styles.statCard, styles.statCardGreen]}>
        <View style={styles.statCardHeader}>
          <Text style={styles.statIcon}>🌱</Text>
          <Text style={styles.statValue}>{data?.healthyPlants}</Text>
        </View>
        <Text style={styles.statLabel}>Healthy Plants</Text>
      </View>

      <View style={[styles.statCard, styles.statCardOrange]}>
        <View style={styles.statCardHeader}>
          <Text style={styles.statIcon}>⚠️</Text>
          <Text style={styles.statValue}>{data?.plantsNeedingAttention}</Text>
        </View>
        <Text style={styles.statLabel}>Needs Attention</Text>
      </View>

      <View style={[styles.statCard, styles.statCardBlue]}>
        <View style={styles.statCardHeader}>
          <Text style={styles.statIcon}>📅</Text>
        </View>
        <Text style={styles.statLabelSmall}>Last Scan</Text>
        <Text style={styles.statValueSmall}>{data?.lastScanDate}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  statCardGreen: {
    backgroundColor: '#34C759',
  },
  statCardOrange: {
    backgroundColor: '#FF9500',
  },
  statCardBlue: {
    backgroundColor: '#007AFF',
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  statLabelSmall: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    marginBottom: 4,
  },
  statValueSmall: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '700',
  },
});

export default StatsCards;