import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CareTip = () => {
  const dailyCareTips = [
    '💧 Water your succulents only when the soil is completely dry.',
    '☀️ Most houseplants need 6–8 hours of indirect sunlight daily.',
    '🌿 Rotate your plants weekly for even growth.',
    '✂️ Prune dead leaves to encourage fresh growth.',
    '🪴 Use well-draining soil to prevent root rot.',
  ];

  const getTodayTip = () => {
    const today = new Date().getDate();
    return dailyCareTips[today % dailyCareTips.length];
  };

  return (
    <View style={styles.gradientShell}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconBubble}>
            <Text style={styles.icon}>💡</Text>
          </View>
          <Text style={styles.title}>Daily Care Tip</Text>
        </View>

        <Text style={styles.tip}>{getTodayTip()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  /* Fake gradient using layered greens */
  gradientShell: {
    backgroundColor: '#6EE7B7',
    borderRadius: 24,
    padding: 2,
    marginBottom: 24,
    shadowColor: '#34D399',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },

  /* Glass card */
  card: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 22,
    padding: 18,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  iconBubble: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  icon: {
    fontSize: 18,
  },

  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#065F46',
    letterSpacing: 0.4,
  },

  tip: {
    fontSize: 14,
    lineHeight: 22,
    color: '#047857',
  },
});

export default CareTip;
