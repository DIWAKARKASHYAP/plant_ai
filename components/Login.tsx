import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import {BACKEND_URL} from '../global'
// 🔹 already configured in App.js, no need to reconfigure here

GoogleSignin.configure({
  webClientId: '263100516892-vth2faik4ua4ba4bbobmesnn749a3847.apps.googleusercontent.com', // From Google Cloud Console -> Credentials -> OAuth 2.0 Client IDs -> Web client
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
});
const LoginScreen = ({ onSuccess }: any) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkStoredUser();
  }, []);

  // 🔹 Auto-login if user already exists in AsyncStorage
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

      // 🔹 Save user to backend
      await fetch(`${BACKEND_URL}/save_user_data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          photo: user.photo,
          googleId: user.id,
        }),
      });

      // 🔹 Save user locally
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
      <View style={styles.content}>
        <Text style={styles.title}>Login</Text>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.googleButtonText}>
              Continue with Google
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    color: '#333',
  },
  googleButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 4,
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
