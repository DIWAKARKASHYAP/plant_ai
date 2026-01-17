import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ScanGuideOverlay = () => {
  return (
    <View style={styles.overlay}>
      {/* Top guide text */}
      <View style={styles.topGuide}>
        <Text style={styles.guideText}>Position leaf in the frame</Text>
      </View>

      {/* Center leaf frame */}
      <View style={styles.center}>
        <View style={styles.leafFrame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      </View>

      {/* Bottom guide text */}
      <View style={styles.bottomGuide}>
        <Text style={styles.guideText}>Ensure good lighting</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,  // Add this
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  topGuide: {
    paddingTop: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leafFrame: {
    width: 250,
    height: 250,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#34C759',
    borderWidth: 3,
  },
  topLeft: {
    top: -5,
    left: -5,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: -5,
    right: -5,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: -5,
    left: -5,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: -5,
    right: -5,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  bottomGuide: {
    paddingBottom: 120,
  },
  guideText: {
    color: '#fff',
    fontSize: 14,
    paddingBottom: 120,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default ScanGuideOverlay;