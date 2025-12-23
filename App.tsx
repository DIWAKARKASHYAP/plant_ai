// src/App.tsx
import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PreHome from './pages/PreHome';
import Home from './pages/Home';
import PlantScan from './pages/PlantScan';
import ScanResultModal from './components/plantScan/ScanResultModal';
import RemediesScreen from './pages/RemediesScreen';
import ScanHistoryScreen from './pages/ScanHistoryScreen';
import ProfileScreen from './pages/ProfileScreen';

type ScreenType = 'home' | 'scan' | 'history' | 'remedies' | 'profile';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [selectedScan, setSelectedScan] = useState<any>(null);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const completed = await AsyncStorage.getItem('hasCompletedOnboarding');
      if (completed === 'true') {
        setIsOnboarded(true);
      } else {
        setIsOnboarded(false);
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setIsOnboarded(false);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToHome = async () => {
    try {
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      setIsOnboarded(true);
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  const handleNavigateToScan = () => {
    setCurrentScreen('scan');
  };

  const handleBackFromScan = () => {
    setCurrentScreen('home');
  };

  const handleNavigateToHistory = () => {
    setCurrentScreen('history');
  };

  const handleSelectScan = (scan: any) => {
    setSelectedScan(scan);
    // Show scan result modal
  };

  const handleViewRemedies = (issue: any) => {
    setSelectedIssue(issue);
    setCurrentScreen('remedies');
  };

  const handleBackFromHistory = () => {
    setCurrentScreen('home');
  };

  const handleBackFromRemedies = () => {
    setCurrentScreen('home');
  };

  const handleNavigateToProfile = () => {
    setCurrentScreen('profile');
  };

  const handleBackFromProfile = () => {
    setCurrentScreen('home');
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.setItem('hasCompletedOnboarding', 'false');
      setIsOnboarded(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleCloseScanResult = () => {
    setSelectedScan(null);
    setCurrentScreen('home');
  };

  const handleRetryFromResult = () => {
    setSelectedScan(null);
    setCurrentScreen('scan');
  };

  if (loading) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={styles.container} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
        {!isOnboarded ? (
          <PreHome onNavigateToHome={handleNavigateToHome} />
        ) : currentScreen === 'scan' ? (
          <PlantScan
            onBack={handleBackFromScan}
            onScanComplete={(result: any) => {
              setSelectedScan(result);
            }}
          />
        ) : currentScreen === 'history' ? (
          <ScanHistoryScreen
            onSelectScan={handleSelectScan}
            onBack={handleBackFromHistory}
          />
        ) : currentScreen === 'remedies' ? (
          <RemediesScreen
            issue={selectedIssue}
            onBack={handleBackFromRemedies}
          />
        ) : currentScreen === 'profile' ? (
          <ProfileScreen
            onBack={handleBackFromProfile}
            onLogout={handleLogout}
          />
        ) : (
          <>
            <Home
              onScanPlant={handleNavigateToScan}
              onViewHistory={handleNavigateToHistory}
              onViewProfile={handleNavigateToProfile}
            />
            
            {/* Show scan result modal if a scan is selected */}
            {selectedScan && (
              <ScanResultModal
                result={selectedScan}
                onComplete={handleCloseScanResult}
                onRetry={handleRetryFromResult}
              />
            )}
          </>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;