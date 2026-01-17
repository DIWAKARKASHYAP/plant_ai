import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const RecentScans = ({ scans, onSelect }: any) => {

  const getStatus = (score: number) => {
    if (score >= 80) return 'Healthy';
    if (score >= 60) return 'Stressed';
    return 'Diseased';
  };

  const getStatusStyle = (score: number) => {
    if (score >= 80) return styles.statusHealthy;
    if (score >= 60) return styles.statusWarning;
    return styles.statusDanger;
  };

  const getStatusTextStyle = (score: number) => {
    if (score >= 80) return styles.statusTextHealthy;
    if (score >= 60) return styles.statusTextWarning;
    return styles.statusTextDanger;
  };

  const renderScanCard = ({ item }: any) => {
    const status = getStatus(item.healthScore);

    return (
      <TouchableOpacity
        style={styles.scanCard}
        activeOpacity={0.7}
        onPress={() => onSelect(item)}
      >
        <View style={styles.scanCardLeft}>
          <Text style={styles.scanIcon}>🌿</Text>

          <View style={styles.scanInfo}>
            <Text style={styles.scanPlantName}>{item.plantName}</Text>
            <Text style={styles.scanDate}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={[styles.statusBadge, getStatusStyle(item.healthScore)]}>
          <Text style={[styles.statusText, getStatusTextStyle(item.healthScore)]}>
            {status}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.recentScansSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Scans</Text>
      </View>

      <FlatList
        data={scans}
        renderItem={renderScanCard}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  recentScansSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#065F46',
  },
  scanCard: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  scanCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  scanIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  scanInfo: {
    flex: 1,
  },
  scanPlantName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065F46',
  },
  scanDate: {
    fontSize: 12,
    color: '#059669',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusHealthy: {
    backgroundColor: '#D1FAE5',
  },
  statusWarning: {
    backgroundColor: '#FEF3C7',
  },
  statusDanger: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusTextHealthy: {
    color: '#065F46',
  },
  statusTextWarning: {
    color: '#92400E',
  },
  statusTextDanger: {
    color: '#7F1D1D',
  },
  separator: {
    height: 10,
  },
});

export default RecentScans;
