import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  Linking,
} from 'react-native';
import { Camera, useCameraPermission, useCameraDevice } from 'react-native-vision-camera';
import { launchImageLibrary } from 'react-native-image-picker';
import ScanGuideOverlay from '../components/plantScan/ScanGuideOverlay';
import CameraControls from '../components/plantScan/CameraControls';
import ScanResultModal from '../components/plantScan/ScanResultModal';
import AIAnalysisLoading from '../components/plantScan/AIAnalysisLoading';
import { saveScan } from '../services/scanStorage';
import { saveCapturedImage, formatImageUri, saveImageMetadata } from '../services/imageStorage';
import {BACKEND_URL} from '../global';

const PlantScan = ({ onBack, onScanComplete }: any) => {
  const cameraRef = useRef<any>(null);
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [flashEnabled, setFlashEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(true);
  const [cameraReady, setCameraReady] = useState<boolean>(false);

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );
        setCameraPermission(granted);
      } else {
        setCameraPermission(hasPermission);
      }
    } catch (err) {
      console.error('Permission check error:', err);
      setCameraPermission(false);
    }
  };

  const handleRequestPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to your camera to scan plants.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setCameraPermission(true);
          await requestPermission();
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          Alert.alert(
            'Permission Required',
            'Camera permission is required. Please enable it in app settings.',
            [
              { text: 'Cancel', onPress: () => {} },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ]
          );
        }
      } else {
        const result = await requestPermission();
        setCameraPermission(result);
      }
    } catch (err) {
      console.error('Permission request error:', err);
      setCameraPermission(false);
      Alert.alert('Error', 'Failed to request camera permission');
    }
  };

  const handleCameraInitialized = useCallback(() => {
    console.log('Camera initialized successfully');
    setCameraReady(true);
  }, []);

  const handleCapture = async () => {
    try {
      if (!cameraActive) return;
      if (!cameraRef.current) {
        Alert.alert('Error', 'Camera reference is not available. Please try again.');
        return;
      }
      if (!cameraReady) {
        Alert.alert('Error', 'Camera is still initializing. Please wait.');
        return;
      }
      if (!cameraPermission) {
        Alert.alert('Permission Denied', 'Camera access is required to scan plants.');
        return;
      }

      console.log('Taking photo...');
      const photo = await cameraRef.current.takePhoto({
        flash: flashEnabled ? 'on' : 'off',
      });

      console.log('Photo captured successfully:', photo.path);

      if (photo?.path) {
        setCameraActive(false);
        setLoading(true);
        await uploadAndAnalyzeImage(photo.path);
      } else {
        throw new Error('Photo path not available');
      }
    } catch (error) {
      console.error('Camera capture error:', error);
      setCameraActive(true);
      setLoading(false);
      Alert.alert('Error', `Failed to capture image: ${String(error).substring(0, 100)}`);
    }
  };

  const handleGalleryUpload = async () => {
    try {
      const response: any = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: false,
        quality: 0.8,
      });

      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', 'Failed to pick image from gallery.');
        return;
      }

      if (response.assets && response.assets[0]?.uri) {
        setLoading(true);
        await uploadAndAnalyzeImage(response.assets[0].uri);
      }
    } catch (error) {
      console.error('Gallery upload error:', error);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    }
  };

const uploadAndAnalyzeImage = async (imageUri: string) => {
  try {
    console.log("Saving image...");
    const persistentImagePath = await saveCapturedImage(imageUri);
    const formattedImageUri = formatImageUri(persistentImagePath);
    const fileName = persistentImagePath.split("/").pop() || "plant.jpg";

    const formData = new FormData();
    formData.append("image", {
      uri: formattedImageUri,
      type: "image/jpeg",
      name: fileName,
    } as any);

    console.log("Uploading to AI backend...");

    const response = await fetch(`${BACKEND_URL}/scan-plant`, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("AI server failed");
    }

    const aiResult = await response.json();

    console.log("AI result:", aiResult);

    // attach image for UI
    aiResult.image = formattedImageUri;

    setAnalyzing(false);
    setScanResult(aiResult);
    setShowResult(true);

    await saveImageMetadata(aiResult.id, formattedImageUri);
    await saveScan(aiResult);

  } catch (error) {
    console.error("AI error:", error);
    setCameraActive(true);
    setLoading(false);
    setAnalyzing(false);
    Alert.alert("Error", "Plant analysis failed");
  }
};

  const handleScanComplete = () => {
    setShowResult(false);
    setCameraActive(true);
    setCameraReady(false);
    onScanComplete?.(scanResult);
  };

  const handleRetry = () => {
    setShowResult(false);
    setScanResult(null);
    setCameraActive(true);
    setCameraReady(true);
  };

  if (analyzing) {
    return <AIAnalysisLoading />;
  }

  if (showResult && scanResult) {
    return (
      <ScanResultModal
        result={scanResult}
        onComplete={handleScanComplete}
        onRetry={handleRetry}
      />
    );
  }

  if (cameraPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionIcon}>📷</Text>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            We need access to your camera to scan plants and analyze their health.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={handleRequestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (cameraPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.permissionText}>Checking permissions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.uploadingContainer}>
          <View style={styles.uploadingCard}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.uploadingTitle}>Uploading Image...</Text>
            <Text style={styles.uploadingText}>
              Preparing your plant for analysis
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (device == null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionIcon}>📷</Text>
          <Text style={styles.permissionText}>No camera device found</Text>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera
          ref={cameraRef}
          style={styles.camera}
          device={device}
          isActive={cameraActive}
          photo={true}
          video={false}
          enableZoomGesture={true}
          onInitialized={handleCameraInitialized}
          onError={(error) => {
            console.error('Camera error:', error);
            setCameraReady(false);
            Alert.alert('Camera Error', 'Failed to initialize camera');
          }}
        />

        <ScanGuideOverlay />

        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onBack}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Scan Plant</Text>
          <View style={styles.placeholder} />
        </View>

        <CameraControls
          flashEnabled={flashEnabled}
          onFlashToggle={() => setFlashEnabled(!flashEnabled)}
          onCapture={handleCapture}
          onGalleryUpload={handleGalleryUpload}
          onCancel={onBack}
          loading={loading}
        />
      </View>

      {showResult && scanResult && (
        <ScanResultModal
          result={scanResult}
          onComplete={handleScanComplete}
          onRetry={handleRetry}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  cameraContainer: { flex: 1, position: 'relative' },
  camera: { ...StyleSheet.absoluteFillObject },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    zIndex: 10,
  },
  title: { fontSize: 18, fontWeight: '600', color: '#fff' },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
  placeholder: { width: 40 },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
  },
  permissionIcon: { fontSize: 64, marginBottom: 16 },
  permissionTitle: { fontSize: 20, fontWeight: '700', color: '#333', marginBottom: 12 },
  permissionText: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 24, lineHeight: 24 },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  permissionButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  backButton: { paddingHorizontal: 24, paddingVertical: 12 },
  backButtonText: { color: '#007AFF', fontSize: 16, fontWeight: '600' },
  uploadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' },
  uploadingCard: { alignItems: 'center', paddingHorizontal: 20 },
  uploadingTitle: { fontSize: 20, fontWeight: '700', color: '#333', marginTop: 20 },
  uploadingText: { fontSize: 14, color: '#666', marginTop: 8, textAlign: 'center' },
});

export default PlantScan;