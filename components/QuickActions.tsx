import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const QuickActions = () => {
  const actions = [
    { icon: '💧', label: 'Water Log' },
    { icon: '📊', label: 'Analytics' },
    { icon: '⚙️', label: 'Settings' },
  ];

  return (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActions}>
        {actions.map((action, index) => (
          <TouchableOpacity key={index} style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>{action.icon}</Text>
            <Text style={styles.quickActionText}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  quickActionsContainer: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  quickActionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default QuickActions;