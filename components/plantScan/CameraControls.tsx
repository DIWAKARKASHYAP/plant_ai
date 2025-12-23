// src/components/plantScan/CameraControls.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const CameraControls = ({
  flashEnabled,
  onFlashToggle,
  onCapture,
  onGalleryUpload,
  onCancel,
  loading,
}: any) => {
  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Top Flash Button */}
      <TouchableOpacity
        style={styles.flashButton}
        onPress={onFlashToggle}
        disabled={loading}
      >
        <Text style={styles.flashIcon}>{flashEnabled ? '⚡' : '🔦'}</Text>
      </TouchableOpacity>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        {/* Gallery Button */}
        <TouchableOpacity
          style={[styles.actionButton, loading && styles.actionButtonDisabled]}
          onPress={onGalleryUpload}
          disabled={loading}
        >
          <View style={styles.buttonBackground}>
            <Text style={styles.actionButtonIcon}>🖼️</Text>
          </View>
          <Text style={styles.actionButtonText}>Gallery</Text>
        </TouchableOpacity>

        {/* Capture Button */}
        <TouchableOpacity
          style={[styles.captureButton, loading && styles.captureButtonDisabled]}
          onPress={onCapture}
          disabled={loading}
          activeOpacity={0.8}
        >
          <View style={styles.captureOuter}>
            <View style={styles.captureInner} />
          </View>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          style={[styles.actionButton, loading && styles.actionButtonDisabled]}
          onPress={onCancel}
          disabled={loading}
        >
          <View style={styles.buttonBackground}>
            <Text style={styles.actionButtonIcon}>✕</Text>
          </View>
          <Text style={styles.actionButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    zIndex: 20,
  },
  flashButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  flashIcon: {
    fontSize: 28,
  },
  bottomControls: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: 10,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  buttonBackground: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionButtonIcon: {
    fontSize: 32,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  captureButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  captureOuter: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  captureInner: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#007AFF',
  },
});

export default CameraControls;