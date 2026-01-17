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

  console.log(currentStep);

  // RENDER LOGIN SCREEN
  if (currentStep === 'login') {
    return <LoginScreen onSuccess={handleLoginSuccess} />;
  }

  // RENDER QUIZ SCREEN
  if (currentStep === 'quiz') {
    return (
      <OnboardingQuiz onComplete={handleQuizComplete} userName={user?.name} />
    );
  }
const profileTitle =
  quizResults?.profileTitle ||
  (quizResults?.score >= 3
    ? "Plant Pro 👑"
    : quizResults?.score >= 2
    ? "Growing Strong 🌿"
    : quizResults?.score >= 1
    ? "New Leaf 🪴"
    : "Plant Starter 🌱");

const profilePercent = Math.min(
  100,
  Math.round(((quizResults?.score || 0) / 4) * 100)
);

  // RENDER HOME SCREEN
  if (currentStep === 'home') {
    return (
      <SafeAreaView style={styles.container}>
        {/* Decorative circles */}
        <View style={[styles.decorativeCircle, styles.circle1]} />
        <View style={[styles.decorativeCircle, styles.circle2]} />
        <View style={[styles.decorativeCircle, styles.circle3]} />
        <View style={[styles.decorativeCircle, styles.circle4]} />

        <ScrollView contentContainerStyle={styles.homeContent}>
          <View style={styles.successContainer}>
            {/* Success Icon with Plant */}
            <View style={styles.successIcon}>
              <View style={styles.plantSuccessIcon}>
                <View style={styles.successStem} />
                <View style={styles.successPetalContainer}>
                  <View style={[styles.successPetal, styles.successPetal1]} />
                  <View style={[styles.successPetal, styles.successPetal2]} />
                  <View style={[styles.successPetal, styles.successPetal3]} />
                  <View style={[styles.successPetal, styles.successPetal4]} />
                  <View style={styles.successCenter} />
                </View>
                <View style={[styles.successLeaf, styles.successLeftLeaf]} />
                <View style={[styles.successLeaf, styles.successRightLeaf]} />
              </View>
            </View>

            <Text style={styles.homeTitle}>Welcome to Plant Love!</Text>
            <Text style={styles.homeSubtitle}>
              Your journey begins here 🌱
            </Text>

            {/* User Info Card */}
            <View style={styles.userCard}>
              <View style={styles.userHeader}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.userHeaderText}>
                  <Text style={styles.userName}>{user?.name}</Text>
                  <Text style={styles.userEmail}>{user?.email}</Text>
                </View>
              </View>
            </View>

            {/* Quiz Score Card */}
            <View style={styles.scoreCard}>
              <View style={styles.scoreIconContainer}>
                <View style={styles.scoreLeafIcon} />
              </View>
              <View style={styles.scoreTextContainer}>
                <Text style={styles.scoreLabel}>Plant Profile Score</Text>
                <Text style={styles.scoreValue}>
                  {profileTitle} • {profilePercent}%
                </Text>
              </View>
            </View>

            {/* Features Preview */}
            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>What's Next?</Text>
              
              <View style={styles.featureItem}>
                <View style={styles.featureIconContainer}>
                  <View style={styles.featureIconDot} />
                </View>
                <Text style={styles.featureText}>
                  Track your plants' growth journey
                </Text>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIconContainer}>
                  <View style={styles.featureIconDot} />
                </View>
                <Text style={styles.featureText}>
                  Get personalized care reminders
                </Text>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIconContainer}>
                  <View style={styles.featureIconDot} />
                </View>
                <Text style={styles.featureText}>
                  Learn expert plant care tips
                </Text>
              </View>
            </View>

            {/* CTA Button */}
            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => onNavigateToHome?.()}
              activeOpacity={0.8}
            >
              <Text style={styles.homeButtonText}>Start Growing</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#10B981',
    position: 'relative',
  },
  decorativeCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 100,
  },
  circle1: {
    width: 70,
    height: 70,
    top: 60,
    right: 30,
  },
  circle2: {
    width: 50,
    height: 50,
    top: 180,
    left: 40,
  },
  circle3: {
    width: 60,
    height: 60,
    bottom: 200,
    right: 50,
  },
  circle4: {
    width: 40,
    height: 40,
    bottom: 100,
    left: 30,
  },
  homeContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  successContainer: {
    alignItems: 'center',
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  plantSuccessIcon: {
    width: 50,
    height: 60,
    alignItems: 'center',
    position: 'relative',
  },
  successStem: {
    width: 4,
    height: 30,
    backgroundColor: '#10B981',
    borderRadius: 2,
    position: 'absolute',
    bottom: 0,
  },
  successPetalContainer: {
    width: 35,
    height: 35,
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successPetal: {
    width: 14,
    height: 18,
    backgroundColor: '#10B981',
    borderRadius: 10,
    position: 'absolute',
  },
  successPetal1: {
    top: 0,
    left: 10.5,
  },
  successPetal2: {
    top: 8,
    right: 0,
  },
  successPetal3: {
    bottom: 8,
    left: 10.5,
  },
  successPetal4: {
    top: 8,
    left: 0,
  },
  successCenter: {
    width: 10,
    height: 10,
    backgroundColor: '#FCD34D',
    borderRadius: 5,
    position: 'absolute',
  },
  successLeaf: {
    width: 15,
    height: 20,
    backgroundColor: '#10B981',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 4,
    position: 'absolute',
  },
  successLeftLeaf: {
    bottom: 12,
    left: -3,
    transform: [{ rotate: '-40deg' }],
  },
  successRightLeaf: {
    bottom: 12,
    right: -3,
    transform: [{ rotate: '40deg' }],
  },
  homeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  homeSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 40,
    textAlign: 'center',
  },
  userCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  userHeaderText: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  scoreCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  scoreIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  scoreLeafIcon: {
    width: 20,
    height: 26,
    backgroundColor: '#10B981',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 5,
  },
  scoreTextContainer: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 30,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIconContainer: {
    width: 8,
    height: 8,
    marginRight: 12,
  },
  featureIconDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  featureText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    flex: 1,
  },
  homeButton: {
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  homeButtonText: {
    color: '#10B981',
    fontSize: 17,
    fontWeight: '700',
  },
});

export default PreHome;