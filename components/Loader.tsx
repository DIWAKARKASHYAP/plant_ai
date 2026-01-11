import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { BACKEND_URL } from '../global';
import Loader from '../components/Loader';

GoogleSignin.configure({
  webClientId: '263100516892-vth2faik4ua4ba4bbobmesnn749a3847.apps.googleusercontent.com',
  offlineAccess: true,
});

const LoginScreen = ({ onSuccess }: any) => {
  const [loading, setLoading] = useState(false);
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    checkStoredUser();
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const checkStoredUser = async () => {
    const storedUser = await AsyncStorage.getItem('user');
    if (storedUser && onSuccess) {
      onSuccess(JSON.parse(storedUser));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const signInResponse: any = await GoogleSignin.signIn();
      const user = signInResponse?.data?.user || signInResponse?.user;
      if (!user) {
        throw new Error('Google user not found');
      }
      console.log('google is working fine');
      const response = await fetch(`${BACKEND_URL}/save_user_data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          photo: user.photo,
          googleId: user.id,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to save user data');
      }
      await AsyncStorage.setItem('user', JSON.stringify(user));
      setLoading(false);
      Alert.alert('Success', `Welcome ${user.name}!`);
      if (onSuccess) {
        onSuccess(user);
      }
    } catch (error: any) {
      setLoading(false);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Cancelled', 'Google sign-in cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('In Progress', 'Login already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Play Services not available');
      } else {
        console.log('Google Login Error:', error);
        Alert.alert('Error', error.message || 'Login failed');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Loader Component */}
      <Loader visible={loading} size="medium" color="#10B981" />

      {/* Decorative elements */}
      <View style={[styles.decorativeCircle, styles.circle1]} />
      <View style={[styles.decorativeCircle, styles.circle2]} />
      <View style={[styles.decorativeCircle, styles.circle3]} />
      <View style={[styles.decorativeCircle, styles.circle4]} />
      <View style={[styles.decorativeCircle, styles.circle5]} />
      <View style={[styles.decorativeCircle, styles.circle6]} />

      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            {/* Plant/Flower Icon */}
            <View style={styles.plantIcon}>
              <View style={styles.stem} />
              <View style={styles.petalContainer}>
                <View style={[styles.petal, styles.petal1]} />
                <View style={[styles.petal, styles.petal2]} />
                <View style={[styles.petal, styles.petal3]} />
                <View style={[styles.petal, styles.petal4]} />
                <View style={styles.center} />
              </View>
              <View style={[styles.leaf, styles.leftLeaf]} />
              <View style={[styles.leaf, styles.rightLeaf]} />
            </View>
          </View>
          <Text style={styles.brandName}>Plant Love</Text>
          <Text style={styles.brandTagline}>GROW WITH CARE</Text>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome Back!</Text>
          <Text style={styles.welcomeSubtitle}>
            Sign in to nurture your plant journey
          </Text>
        </View>

        {/* Login Card */}
        <View style={styles.loginCard}>
          {/* Google Sign In Button */}
          <TouchableOpacity
            style={[styles.googleButton, loading && styles.googleButtonDisabled]}
            onPress={handleGoogleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              {/* Google G Icon */}
              <View style={styles.googleIconContainer}>
                <Text style={styles.googleG}>G</Text>
              </View>
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our{' '}
            <Text style={styles.footerLink}>Terms</Text>
            {' & '}
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#10B981',
    position: 'relative',
  },
  decorativeCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 100,
  },
  circle1: {
    width: 20,
    height: 20,
    top: 60,
    left: 40,
  },
  circle2: {
    width: 15,
    height: 15,
    top: 150,
    right: 60,
  },
  circle3: {
    width: 25,
    height: 25,
    bottom: 220,
    left: 30,
  },
  circle4: {
    width: 15,
    height: 15,
    bottom: 120,
    right: 80,
  },
  circle5: {
    width: 18,
    height: 18,
    top: '35%',
    left: 25,
  },
  circle6: {
    width: 12,
    height: 12,
    top: '28%',
    right: 45,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  plantIcon: {
    width: 60,
    height: 70,
    alignItems: 'center',
    position: 'relative',
  },
  stem: {
    width: 4,
    height: 35,
    backgroundColor: '#fff',
    borderRadius: 2,
    position: 'absolute',
    bottom: 0,
  },
  petalContainer: {
    width: 40,
    height: 40,
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  petal: {
    width: 16,
    height: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    position: 'absolute',
  },
  petal1: {
    top: 0,
    left: 12,
  },
  petal2: {
    top: 10,
    right: 0,
  },
  petal3: {
    bottom: 10,
    left: 12,
  },
  petal4: {
    top: 10,
    left: 0,
  },
  center: {
    width: 12,
    height: 12,
    backgroundColor: '#FCD34D',
    borderRadius: 6,
    position: 'absolute',
  },
  leaf: {
    width: 18,
    height: 25,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 5,
    position: 'absolute',
  },
  leftLeaf: {
    bottom: 15,
    left: -5,
    transform: [{ rotate: '-45deg' }],
  },
  rightLeaf: {
    bottom: 15,
    right: -5,
    transform: [{ rotate: '45deg' }],
  },
  brandName: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  brandTagline: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: 3,
    fontWeight: '600',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.75)',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  loginCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 30,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  googleButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  googleButtonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  googleG: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  googleButtonText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 30,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLink: {
    color: '#fff',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});