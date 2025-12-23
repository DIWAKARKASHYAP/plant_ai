// src/components/plantScan/AIAnalysisLoading.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Animated } from 'react-native';

const AIAnalysisLoading = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const opacityAnim = React.useRef(new Animated.Value(0.6)).current;

  const steps = [
    { title: 'Analyzing plant health…', icon: '🔍' },
    { title: 'Checking disease patterns…', icon: '🦠' },
    { title: 'Finding natural remedies…', icon: '🌿' },
    { title: 'Generating recommendations…', icon: '✨' },
  ];

  // Animate the scanning effect
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
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
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    opacityAnimation.start();

    return () => opacityAnimation.stop();
  }, [opacityAnim]);

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
          <View style={styles.cornerBracket} />
          <View style={[styles.cornerBracket, styles.topRight]} />
          <View style={[styles.cornerBracket, styles.bottomLeft]} />
          <View style={[styles.cornerBracket, styles.bottomRight]} />
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
  scannerCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    borderColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerInner: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
  },
  cornerBracket: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#34C759',
    borderWidth: 2,
    top: 20,
    left: 20,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 20,
    left: 'auto',
    right: 20,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    top: 'auto',
    bottom: 20,
    left: 20,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    top: 'auto',
    bottom: 20,
    left: 'auto',
    right: 20,
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
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 30,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: '#34C759',
    width: 24,
  },
  inactiveDot: {
    backgroundColor: '#333',
  },
  loadingBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 30,
  },
  loadingBar: {
    height: '100%',
    backgroundColor: '#34C759',
    borderRadius: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default AIAnalysisLoading;