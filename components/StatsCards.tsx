import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatsCards = ({ data }: any) => {
  return (
    <View style={styles.statsContainer}>
      {/* Healthy Plants Card */}
      <View style={[styles.statCard, styles.statCardGreen]}>
        <View style={styles.iconCircle}>
          <View style={styles.leafIcon} />
        </View>
        <Text style={styles.statValue}>{data?.healthyPlants || 0}</Text>
        <Text style={styles.statLabel}>Healthy Plants</Text>
      </View>

      {/* Needs Attention Card */}
      <View style={[styles.statCard, styles.statCardOrange]}>
        <View style={styles.iconCircle}>
          <View style={styles.alertIcon}>
            <View style={styles.alertTriangle} />
            <View style={styles.alertDot} />
          </View>
        </View>
        <Text style={styles.statValue}>{data?.plantsNeedingAttention || 0}</Text>
        <Text style={styles.statLabel}>Needs Care</Text>
      </View>

      {/* Last Scan Card */}
      <View style={[styles.statCard, styles.statCardBlue]}>
        <View style={styles.iconCircle}>
          <View style={styles.calendarIcon}>
            <View style={styles.calendarTop} />
            <View style={styles.calendarBody}>
              <View style={styles.calendarDot} />
            </View>
          </View>
        </View>
        <Text style={styles.statValueSmall}>{data?.lastScanDate || 'Never'}</Text>
        <Text style={styles.statLabel}>Last Scan</Text>
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
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    minHeight: 120,
    justifyContent: 'space-between',
  },
  statCardGreen: {
    backgroundColor: '#10B981',
  },
  statCardOrange: {
    backgroundColor: '#F59E0B',
  },
  statCardBlue: {
    backgroundColor: '#3B82F6',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  leafIcon: {
    width: 18,
    height: 22,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 4,
  },
  alertIcon: {
    width: 20,
    height: 22,
    position: 'relative',
  },
  alertTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 18,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#fff',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  alertDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#F59E0B',
    position: 'absolute',
    bottom: 3,
    left: 8.5,
  },
  calendarIcon: {
    width: 20,
    height: 22,
    position: 'relative',
  },
  calendarTop: {
    width: 20,
    height: 4,
    backgroundColor: '#fff',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    position: 'absolute',
    top: 0,
  },
  calendarBody: {
    width: 20,
    height: 16,
    backgroundColor: '#fff',
    borderRadius: 3,
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statValueSmall: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default StatsCards;