import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

const ScanButton = ({ onPress }: any) => {
  return (
    <TouchableOpacity 
      style={styles.scanButton} 
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.iconContainer}>
        <View style={styles.cameraIcon}>
          <View style={styles.cameraBody}>
            <View style={styles.cameraLens} />
          </View>
          <View style={styles.cameraFlash} />
        </View>
      </View>
      
      <View style={styles.scanButtonContent}>
        <Text style={styles.scanButtonTitle}>Scan Your Plant</Text>
        <Text style={styles.scanButtonSubtitle}>Get instant health analysis</Text>
      </View>
      
      <View style={styles.arrowContainer}>
        <View style={styles.arrowIcon} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  scanButton: {
    backgroundColor: '#10B981',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 6,
    shadowColor: '#10B981',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cameraIcon: {
    width: 32,
    height: 28,
    position: 'relative',
  },
  cameraBody: {
    width: 32,
    height: 24,
    backgroundColor: '#fff',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
  cameraLens: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  cameraFlash: {
    width: 6,
    height: 6,
    backgroundColor: '#fff',
    borderRadius: 3,
    position: 'absolute',
    top: 0,
    right: 4,
  },
  scanButtonContent: {
    flex: 1,
  },
  scanButtonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  scanButtonSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  arrowIcon: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 0,
    borderBottomWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: '#fff',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    marginLeft: 2,
  },
});

export default ScanButton;