// src/components/plantScan/AIAnalysisLoading.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Animated } from 'react-native';

const AIAnalysisLoading = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const opacityAnim = React.useRef(new Animated.Value(0.6)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  const steps = [
    { title: 'Uploading your plant photo…', icon: '📤' },
    { title: 'Analyzing plant health…', icon: '🔍' },
    { title: 'Detecting stress patterns…', icon: '🌡️' },
    { title: 'Finding natural remedies…', icon: '🌿' },
    { title: 'Generating care plan…', icon: '✨' },
  ];

  // Pulse animation for the main circle
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.15,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [scaleAnim]);

  // Opacity animation
  useEffect(() => {
    const opacityAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.4,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );

    opacityAnimation.start();

    return () => opacityAnimation.stop();
  }, [opacityAnim]);

  // Rotation animation for the outer ring
  useEffect(() => {
    const rotationAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    );

    rotationAnimation.start();

    return () => rotationAnimation.stop();
  }, [rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Change step every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Animated Scanner Circle */}
        <View style={styles.scannerContainer}>
          {/* Rotating Outer Ring */}
          <Animated.View
            style={[
              styles.outerRing,
              { transform: [{ rotate }] },
            ]}
          >
            <View style={styles.ringSegment1} />
            <View style={styles.ringSegment2} />
            <View style={styles.ringSegment3} />
          </Animated.View>

          {/* Pulsing Main Circle */}
          <Animated.View
            style={[
              styles.scannerCircle,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <Animated.View
              style={[
                styles.scannerInner,
                { opacity: opacityAnim },
              ]}
            />
          </Animated.View>

          {/* Corner brackets */}
          <View style={[styles.cornerBracket, styles.topLeft]} />
          <View style={[styles.cornerBracket, styles.topRight]} />
          <View style={[styles.cornerBracket, styles.bottomLeft]} />
          <View style={[styles.cornerBracket, styles.bottomRight]} />

          {/* Center Icon */}
          <View style={styles.centerIconContainer}>
            <Text style={styles.centerIcon}>🌱</Text>
          </View>
        </View>

        {/* Step Icon */}
        <Text style={styles.stepIcon}>{steps[currentStep].icon}</Text>

        {/* Current Step Title */}
        <Text style={styles.stepTitle}>{steps[currentStep].title}</Text>

        {/* Progress Dots */}
        <View style={styles.progressDots}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentStep ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        {/* Loading Bar */}
        <View style={styles.loadingBarContainer}>
          <Animated.View
            style={[
              styles.loadingBar,
              {
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              },
            ]}
          />
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Our AI is examining your plant and preparing personalized care advice
        </Text>

        {/* Decorative Elements */}
        <View style={styles.decorativeElements}>
          <View style={[styles.decorCircle, styles.decorCircle1]} />
          <View style={[styles.decorCircle, styles.decorCircle2]} />
          <View style={[styles.decorCircle, styles.decorCircle3]} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  scannerContainer: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  outerRing: {
    position: 'absolute',
    width: 260,
    height: 260,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringSegment1: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopColor: '#5BB885',
    borderRightColor: '#5BB885',
  },
  ringSegment2: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 2,
    borderColor: 'transparent',
    borderBottomColor: '#7FCC9A',
    borderLeftColor: '#7FCC9A',
  },
  ringSegment3: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    borderColor: 'transparent',
    borderTopColor: '#B4EFD3',
  },
  scannerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#5BB885',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(91, 184, 133, 0.05)',
    shadowColor: '#5BB885',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  scannerInner: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(91, 184, 133, 0.15)',
  },
  centerIconContainer: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(91, 184, 133, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerIcon: {
    fontSize: 40,
  },
  cornerBracket: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#5BB885',
    borderWidth: 3,
  },
  topLeft: {
    top: 10,
    left: 10,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 10,
    right: 10,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 10,
    left: 10,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 10,
    right: 10,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  stepIcon: {
    fontSize: 56,
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
    letterSpacing: -0.5,
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 30,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: '#5BB885',
    width: 32,
    shadowColor: '#5BB885',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  inactiveDot: {
    backgroundColor: '#333',
    width: 8,
  },
  loadingBarContainer: {
    width: '100%',
    height: 6,
    backgroundColor: '#1a1a1a',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#333',
  },
  loadingBar: {
    height: '100%',
    backgroundColor: '#5BB885',
    borderRadius: 3,
    shadowColor: '#5BB885',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  decorativeElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: 'rgba(91, 184, 133, 0.05)',
  },
  decorCircle1: {
    width: 100,
    height: 100,
    top: -20,
    right: -30,
  },
  decorCircle2: {
    width: 80,
    height: 80,
    bottom: 50,
    left: -20,
  },
  decorCircle3: {
    width: 60,
    height: 60,
    top: 100,
    left: -10,
  },
});

export default AIAnalysisLoading;