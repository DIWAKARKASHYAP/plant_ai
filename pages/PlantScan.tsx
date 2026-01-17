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
  BackHandler,
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
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(true);
  const [cameraReady, setCameraReady] = useState<boolean>(false);

  useEffect(() => {
    checkCameraPermission();
  }, []);

  useEffect(() => {
  const backAction = () => {
    onBack?.();  // ✅ go back inside app
    return true; // ✅ prevent app from closing
  };

  const backHandler = BackHandler.addEventListener(
    "hardwareBackPress",
    backAction
  );

  return () => backHandler.remove();
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
        setAnalyzing(true);
        await uploadAndAnalyzeImage(photo.path);
      } else {
        throw new Error('Photo path not available');
      }
    } catch (error) {
      console.error('Camera capture error:', error);
      setCameraActive(true);
      setAnalyzing(false);
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
        setAnalyzing(true);
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

  // Show AI Analysis Loading
  if (analyzing) {
    return <AIAnalysisLoading />;
  }

  // Show Scan Result Modal
  if (showResult && scanResult) {
    return (
      <ScanResultModal
        result={scanResult}
        onComplete={handleScanComplete}
        onRetry={handleRetry}
      />
    );
  }

  // Permission Denied Screen
  if (cameraPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <View style={styles.permissionIconContainer}>
            <Text style={styles.permissionIcon}>📷</Text>
          </View>
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
          <TouchableOpacity style={styles.backButtonAlt} onPress={onBack}>
            <Text style={styles.backButtonTextAlt}>← Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Checking Permissions
  if (cameraPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <ActivityIndicator size="large" color="#5BB885" />
          <Text style={styles.permissionText}>Checking permissions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // No Camera Device Found
  if (device == null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <View style={styles.permissionIconContainer}>
            <Text style={styles.permissionIcon}>📷</Text>
          </View>
          <Text style={styles.permissionTitle}>No Camera Found</Text>
          <Text style={styles.permissionText}>
            Unable to detect a camera device on your phone.
          </Text>
          <TouchableOpacity style={styles.backButtonAlt} onPress={onBack}>
            <Text style={styles.backButtonTextAlt}>← Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Main Camera Screen
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

        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Scan Plant</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Camera Controls */}
        <CameraControls
          flashEnabled={flashEnabled}
          onFlashToggle={() => setFlashEnabled(!flashEnabled)}
          onCapture={handleCapture}
          onGalleryUpload={handleGalleryUpload}
          onCancel={onBack}
          loading={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(91, 184, 133, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  backButtonIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '700',
  },
  placeholder: {
    width: 44,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#F5F5F5',
  },
  permissionIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F9F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  permissionIcon: {
    fontSize: 48,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  permissionText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  permissionButton: {
    backgroundColor: '#5BB885',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#5BB885',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  backButtonAlt: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 8,
  },
  backButtonTextAlt: {
    color: '#5BB885',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PlantScan;