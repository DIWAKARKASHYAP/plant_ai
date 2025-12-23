import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import LoginScreen from '../components/Login';
import OnboardingQuiz from '../components/Quiz';

const PreHome = ({ onNavigateToHome }: any) => {
  const [currentStep, setCurrentStep] = useState<string>('login'); // 'login', 'quiz', 'home'
  const [user, setUser] = useState<any>(null);
  const [quizResults, setQuizResults] = useState<any>(null);

  // Handle Login Success
  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    setCurrentStep('quiz');
  };

  // Handle Quiz Complete
  const handleQuizComplete = (result: any) => {
    setQuizResults(result);
    setCurrentStep('home');
  };

  // RENDER LOGIN SCREEN
  if (currentStep === 'login') {
    return <LoginScreen onSuccess={handleLoginSuccess} />;
  }

  // RENDER QUIZ SCREEN
  if (currentStep === 'quiz') {
    return (
      <OnboardingQuiz
        onComplete={handleQuizComplete}
        userName={user?.name}
      />
    );
  }

  // RENDER HOME SCREEN
  if (currentStep === 'home') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.homeContent}>
          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <Text style={styles.checkmark}>✓</Text>
            </View>

            <Text style={styles.homeTitle}>Onboarding Complete!</Text>

            <View style={styles.userInfo}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{user?.name}</Text>

              <Text style={[styles.infoLabel, { marginTop: 20 }]}>
                Email
              </Text>
              <Text style={styles.infoValue}>{user?.email}</Text>

              <Text style={[styles.infoLabel, { marginTop: 20 }]}>

                Quiz Score
              </Text>
              <Text style={styles.infoValue}>
                {quizResults?.score}/{quizResults?.totalQuestions}
              </Text>
            </View>

            <Text style={styles.homeMessage}>
              Your preferences have been saved. Ready to explore the app!
            </Text>

            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => onNavigateToHome?.()}
            >
              <Text style={styles.homeButtonText}>Go to Main App</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  homeContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  successContainer: {
    alignItems: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  checkmark: {
    fontSize: 48,
    color: '#fff',
    fontWeight: 'bold',
  },
  homeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  userInfo: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  homeMessage: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 24,
  },
  homeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PreHome;