import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CareTip = () => {
  const dailyCareTips = [
    '💧 Water your succulents only when soil is completely dry.',
    '☀️ Most houseplants need 6-8 hours of indirect sunlight daily.',
    '🌿 Rotate your plants weekly for even growth.',
    '✂️ Prune dead leaves to encourage new growth.',
    '🪴 Use well-draining soil to prevent root rot.',
  ];

  const getTodayTip = (): string => {
    const today = new Date().getDate();
    return dailyCareTips[today % dailyCareTips.length];
  };

  return (
    <View style={styles.careTipContainer}>
      <Text style={styles.careTipTitle}>💡 Daily Care Tip</Text>
      <Text style={styles.careTipText}>{getTodayTip()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  careTipContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  careTipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  careTipText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default CareTip;