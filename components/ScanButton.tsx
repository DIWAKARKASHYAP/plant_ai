import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

const ScanButton = ({ onPress }: any) => {
  return (
    <TouchableOpacity style={styles.scanButton} onPress={onPress}>
      <Text style={styles.scanButtonIcon}>📷</Text>
      <View style={styles.scanButtonContent}>
        <Text style={styles.scanButtonTitle}>Scan Plant</Text>
        <Text style={styles.scanButtonSubtitle}>Check plant health instantly</Text>
      </View>
      <Text style={styles.scanButtonArrow}>→</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  scanButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 18,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  scanButtonIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  scanButtonContent: {
    flex: 1,
  },
  scanButtonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  scanButtonSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  scanButtonArrow: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ScanButton;