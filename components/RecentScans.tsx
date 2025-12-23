import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const RecentScans = ({ scans }: any) => {
  const renderScanCard = ({ item }: any) => (
    <View style={styles.scanCard}>
      <View style={styles.scanCardLeft}>
        <Text style={styles.scanIcon}>{item.icon}</Text>
        <View style={styles.scanInfo}>
          <Text style={styles.scanPlantName}>{item.plantName}</Text>
          <Text style={styles.scanDate}>{item.date}</Text>
        </View>
      </View>
      <View
        style={[
          styles.statusBadge,
          item.status === 'Healthy' ? styles.statusHealthy : styles.statusWarning,
        ]}
      >
        <Text
          style={[
            styles.statusText,
            item.status === 'Healthy' ? styles.statusTextHealthy : styles.statusTextWarning,
          ]}
        >
          {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.recentScansSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Scans</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All →</Text>
        </TouchableOpacity>
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
    color: '#333',
  },
  viewAll: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  scanCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scanCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  scanIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  scanInfo: {
    flex: 1,
  },
  scanPlantName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  scanDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusHealthy: {
    backgroundColor: '#D4EDDA',
  },
  statusWarning: {
    backgroundColor: '#FFE5E5',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusTextHealthy: {
    color: '#155724',
  },
  statusTextWarning: {
    color: '#721C24',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 8,
  },
});

export default RecentScans;