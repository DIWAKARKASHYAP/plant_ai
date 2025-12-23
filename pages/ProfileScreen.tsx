// src/pages/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  Switch,
  ActionSheetIOS,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getScanStats } from '../services/scanStorage';

interface Stats {
  totalScans: number;
  healthyCount: number;
  stressedCount: number;
  diseasedCount: number;
  averageHealth: number;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  joinedDate: string;
}

const ProfileScreen = ({ onBack, onLogout }: any) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    joinedDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [showActionSheet, setShowActionSheet] = useState<boolean>(false);

  useEffect(() => {
    loadStats();
    loadUserProfile();
  }, []);

  const loadStats = async () => {
    try {
      const scanStats = await getScanStats();
      setStats(scanStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadUserProfile = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem('userProfile');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.setItem('hasCompletedOnboarding', 'false');
              onLogout?.();
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your scans and data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('plant_scans');
              Alert.alert('Success', 'All data has been cleared');
              loadStats();
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.prompt(
      'Edit Name',
      'Enter your full name',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: async (text:any) => {
            const updatedProfile = { ...profile, name: text };
            setProfile(updatedProfile);
            try {
              await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
              Alert.alert('Success', 'Profile updated');
            } catch (error) {
              Alert.alert('Error', 'Failed to update profile');
            }
          },
        },
      ],
      'plain-text',
      profile.name
    );
  };

  const handleChangePassword = () => {
    Alert.alert(
      'Change Password',
      'You will be logged out and asked to set a new password',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: () => {
            Alert.alert('Password Reset', 'A password reset link has been sent to your email');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatarContainer}>
            <Image
              source={{ uri: 'https://ui-avatars.com/api/?name=' + profile.name }}
              style={styles.profileAvatar}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Text style={styles.editAvatarIcon}>📷</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileEmail}>{profile.email}</Text>

          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={handleEditProfile}
          >
            <Text style={styles.editProfileButtonText}>✏️ Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Statistics Card */}
        {stats && (
          <View style={styles.statsCard}>
            <Text style={styles.sectionTitle}>📊 Plant Statistics</Text>

            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.totalScans}</Text>
                <Text style={styles.statName}>Total Scans</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.averageHealth}</Text>
                <Text style={styles.statName}>Avg Health</Text>
              </View>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#34C759' }]}>
                  {stats.healthyCount}
                </Text>
                <Text style={styles.statName}>Healthy</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#FF9500' }]}>
                  {stats.stressedCount}
                </Text>
                <Text style={styles.statName}>Stressed</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#ff3b30' }]}>
                  {stats.diseasedCount}
                </Text>
                <Text style={styles.statName}>Diseased</Text>
              </View>
            </View>
          </View>
        )}

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Account Settings</Text>

          <View style={styles.settingCard}>
            <TouchableOpacity style={styles.settingRow} onPress={handleChangePassword}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>🔐</Text>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Change Password</Text>
                  <Text style={styles.settingSubtitle}>Update your password</Text>
                </View>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>

            <View style={styles.settingDivider} />

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>📧</Text>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Email</Text>
                  <Text style={styles.settingSubtitle}>{profile.email}</Text>
                </View>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </View>

            <View style={styles.settingDivider} />

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>📱</Text>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Phone</Text>
                  <Text style={styles.settingSubtitle}>{profile.phone}</Text>
                </View>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </View>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎨 Preferences</Text>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>🔔</Text>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Notifications</Text>
                  <Text style={styles.settingSubtitle}>Plant care reminders</Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#767577', true: '#81C784' }}
                thumbColor={notificationsEnabled ? '#34C759' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingDivider} />

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>🌙</Text>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Dark Mode</Text>
                  <Text style={styles.settingSubtitle}>Coming soon</Text>
                </View>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                disabled={true}
                trackColor={{ false: '#767577', true: '#81C784' }}
                thumbColor={darkMode ? '#34C759' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        {/* Help & Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💬 Help & Support</Text>

          <View style={styles.settingCard}>
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>❓</Text>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>FAQ</Text>
                  <Text style={styles.settingSubtitle}>Common questions</Text>
                </View>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>

            <View style={styles.settingDivider} />

            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>📧</Text>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Contact Support</Text>
                  <Text style={styles.settingSubtitle}>Get help from our team</Text>
                </View>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>

            <View style={styles.settingDivider} />

            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>ℹ️</Text>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>About App</Text>
                  <Text style={styles.settingSubtitle}>Version 1.0.0</Text>
                </View>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <View style={styles.dangerCard}>
            <TouchableOpacity
              style={styles.dangerButton}
              onPress={handleClearData}
            >
              <Text style={styles.dangerButtonIcon}>🗑️</Text>
              <Text style={styles.dangerButtonText}>Clear All Data</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.dangerButton, styles.logoutButton]}
              onPress={handleLogout}
            >
              <Text style={styles.dangerButtonIcon}>🚪</Text>
              <Text style={styles.dangerButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>

          {/* Account Info */}
          <View style={styles.accountInfo}>
            <Text style={styles.accountInfoLabel}>Account Info</Text>
            <Text style={styles.accountInfoText}>
              Joined on {profile.joinedDate}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  profileCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  profileAvatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  editAvatarIcon: {
    fontSize: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
  },
  editProfileButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  editProfileButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  statsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  statsGrid: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#f0f0f0',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  statName: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    fontWeight: '600',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  settingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingIcon: {
    fontSize: 20,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  settingArrow: {
    fontSize: 18,
    color: '#ccc',
  },
  settingDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 16,
  },
  dangerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  logoutButton: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  dangerButtonIcon: {
    fontSize: 18,
  },
  dangerButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ff3b30',
  },
  accountInfo: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  accountInfoLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
  },
  accountInfoText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default ProfileScreen;