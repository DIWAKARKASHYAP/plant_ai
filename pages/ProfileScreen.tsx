// src/pages/ProfileScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Animated,
  BackHandler,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getScanStats } from "../services/scanStorage";
import LinearGradient from "react-native-linear-gradient";

interface Stats {
  totalScans: number;
  healthyCount: number;
  stressedCount: number;
  diseasedCount: number;
  averageHealth: number;
}

interface GoogleUser {
  photo: string;
  givenName: string;
  familyName: string | null;
  email: string;
  name: string;
  id: string;
}

const ProfileScreen = ({ onBack, onLogout }: any) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [scrollY] = useState(new Animated.Value(0));

  useEffect(() => {
    loadUserData();
    loadStats();
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

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) setUser(JSON.parse(userData));
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const loadStats = async () => {
    try {
      const scanStats = await getScanStats();
      setStats(scanStats);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.setItem("hasCompletedOnboarding", "false");
            await AsyncStorage.removeItem("user");
            onLogout?.();
          } catch {
            Alert.alert("Error", "Failed to logout");
          }
        },
      },
    ]);
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "This will delete all your scans and data. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("plant_scans");
              Alert.alert("Success", "All data has been cleared");
              loadStats();
            } catch {
              Alert.alert("Error", "Failed to clear data");
            }
          },
        },
      ]
    );
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View style={[styles.fixedHeader, { opacity: headerOpacity }]}>
        <LinearGradient
          colors={["#10B981", "#34D399"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <TouchableOpacity onPress={onBack} style={styles.headerBackButton}>
            <Text style={styles.headerBackIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerPlaceholder} />
        </LinearGradient>
      </Animated.View>

      {/* Background like Home */}
      <View style={styles.plantBackground}>
        {/* Decorative leaves */}
        <View style={styles.leafOne} />
        <View style={styles.leafTwo} />
        <View style={styles.leafThree} />

        {/* Soft glow */}
        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />

        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        >
          {/* Hero */}
          <View style={styles.heroSection}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>

            <View style={styles.avatarContainer}>
              <View style={styles.avatarRing}>
                <Image
                  source={{
                    uri:
                      user?.photo ||
                      `https://ui-avatars.com/api/?name=${
                        user?.name || "User"
                      }&size=200&background=10B981&color=fff`,
                  }}
                  style={styles.avatar}
                />
              </View>
            </View>

            <Text style={styles.welcomeText}>Welcome back 🌿</Text>
            <Text style={styles.userName}>{user?.name || "Plant Lover"}</Text>
            <Text style={styles.userEmail}>{user?.email || "user@example.com"}</Text>
          </View>

          {/* Stats Card */}
          {stats && (
            <View style={styles.statsCard}>
              <View style={styles.statsHeader}>
                <Text style={styles.statsTitle}>Your Plant Journey</Text>
                <Text style={styles.statsEmoji}>🌱</Text>
              </View>

              <View style={styles.mainStatsRow}>
                <View style={styles.mainStatBox}>
                  <Text style={styles.mainStatNumber}>{stats.totalScans}</Text>
                  <Text style={styles.mainStatLabel}>Total Scans</Text>
                </View>

                <View style={styles.statsDivider} />

                <View style={styles.mainStatBox}>
                  <Text style={styles.mainStatNumber}>{stats.averageHealth}%</Text>
                  <Text style={styles.mainStatLabel}>Avg Health</Text>
                </View>
              </View>

              <View style={styles.detailStatsRow}>
                <View style={styles.detailStatItem}>
                  <View style={[styles.statDot, { backgroundColor: "#34C759" }]} />
                  <View>
                    <Text style={styles.detailStatNumber}>{stats.healthyCount}</Text>
                    <Text style={styles.detailStatLabel}>Healthy</Text>
                  </View>
                </View>

                <View style={styles.detailStatItem}>
                  <View style={[styles.statDot, { backgroundColor: "#FF9500" }]} />
                  <View>
                    <Text style={styles.detailStatNumber}>{stats.stressedCount}</Text>
                    <Text style={styles.detailStatLabel}>Stressed</Text>
                  </View>
                </View>

                <View style={styles.detailStatItem}>
                  <View style={[styles.statDot, { backgroundColor: "#FF3B30" }]} />
                  <View>
                    <Text style={styles.detailStatNumber}>{stats.diseasedCount}</Text>
                    <Text style={styles.detailStatLabel}>Diseased</Text>
                  </View>
                </View>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressTrack}>
                  <LinearGradient
                    colors={["#10B981", "#34D399"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.progressFill, { width: `${stats.averageHealth}%` }]}
                  />
                </View>
                <Text style={styles.progressLabel}>Overall Health Score</Text>
              </View>
            </View>
          )}

          {/* Account */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>

            <View style={styles.card}>
              <TouchableOpacity style={styles.itemRow}>
                <Text style={styles.itemIcon}>👤</Text>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemLabel}>Full Name</Text>
                  <Text style={styles.itemValue}>{user?.name || "Not set"}</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.itemRow}>
                <Text style={styles.itemIcon}>📧</Text>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemLabel}>Email Address</Text>
                  <Text style={styles.itemValue}>{user?.email || "Not set"}</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.itemRow}>
                <Text style={styles.itemIcon}>🔔</Text>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemLabel}>Notifications</Text>
                  <Text style={styles.itemValue}>Enabled</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Danger Zone */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Danger Zone</Text>

            <View style={[styles.card, styles.dangerCard]}>
              <TouchableOpacity style={styles.itemRow} onPress={handleClearData}>
                <Text style={styles.itemIcon}>🗑️</Text>
                <View style={styles.itemInfo}>
                  <Text style={styles.dangerTitle}>Clear All Data</Text>
                  <Text style={styles.dangerSubtitle}>Delete all scans permanently</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.itemRow} onPress={handleLogout}>
                <Text style={styles.itemIcon}>🚪</Text>
                <View style={styles.itemInfo}>
                  <Text style={styles.dangerTitle}>Logout</Text>
                  <Text style={styles.dangerSubtitle}>Sign out of your account</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Green Apple Wellness</Text>
            <Text style={styles.footerVersion}>Version 1.0.0</Text>
          </View>
        </Animated.ScrollView>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D1FAE5",
  },

  // ✅ Home background style
  plantBackground: {
    flex: 1,
    backgroundColor: "#D1FAE5",
    position: "relative",
  },

  glowTop: {
    position: "absolute",
    top: -100,
    left: -80,
    width: 300,
    height: 300,
    backgroundColor: "#6EE7B7",
    borderRadius: 200,
    opacity: 0.6,
  },

  glowBottom: {
    position: "absolute",
    bottom: -140,
    right: -100,
    width: 320,
    height: 320,
    backgroundColor: "#34D399",
    borderRadius: 220,
    opacity: 0.45,
  },

  leafOne: {
    position: "absolute",
    top: 120,
    left: -40,
    width: 160,
    height: 280,
    backgroundColor: "#A7F3D0",
    borderTopLeftRadius: 120,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 140,
    opacity: 0.35,
    transform: [{ rotate: "-20deg" }],
  },

  leafTwo: {
    position: "absolute",
    top: 360,
    right: -60,
    width: 200,
    height: 300,
    backgroundColor: "#6EE7B7",
    borderTopLeftRadius: 140,
    borderTopRightRadius: 60,
    borderBottomLeftRadius: 120,
    borderBottomRightRadius: 180,
    opacity: 0.25,
    transform: [{ rotate: "18deg" }],
  },

  leafThree: {
    position: "absolute",
    bottom: -60,
    left: 40,
    width: 240,
    height: 200,
    backgroundColor: "#34D399",
    borderTopLeftRadius: 160,
    borderTopRightRadius: 120,
    borderBottomLeftRadius: 180,
    borderBottomRightRadius: 80,
    opacity: 0.2,
    transform: [{ rotate: "-10deg" }],
  },

  fixedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },

  headerGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },

  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },

  headerBackIcon: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "800",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
  },

  headerPlaceholder: {
    width: 40,
  },

  scrollContent: {
    paddingBottom: 40,
  },

  heroSection: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(16,185,129,0.15)",
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  backIcon: {
    fontSize: 22,
    color: "#065F46",
    fontWeight: "800",
  },

  avatarContainer: {
    alignItems: "center",
    marginBottom: 14,
  },

  avatarRing: {
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: "rgba(255,255,255,0.55)",
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },

  avatar: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: "#fff",
  },

  welcomeText: {
    fontSize: 14,
    color: "#065F46",
    textAlign: "center",
    marginBottom: 6,
    fontWeight: "700",
    opacity: 0.9,
  },

  userName: {
    fontSize: 26,
    fontWeight: "900",
    color: "#064E3B",
    textAlign: "center",
    marginBottom: 4,
  },

  userEmail: {
    fontSize: 13,
    color: "#047857",
    textAlign: "center",
    fontWeight: "600",
    opacity: 0.8,
  },

  statsCard: {
    backgroundColor: "rgba(255,255,255,0.9)",
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 20,
    padding: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.12)",
  },

  statsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  statsTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#064E3B",
  },

  statsEmoji: {
    fontSize: 22,
  },

  mainStatsRow: {
    flexDirection: "row",
    marginBottom: 20,
  },

  mainStatBox: {
    flex: 1,
    alignItems: "center",
  },

  statsDivider: {
    width: 1,
    backgroundColor: "rgba(16,185,129,0.18)",
    marginHorizontal: 16,
  },

  mainStatNumber: {
    fontSize: 34,
    fontWeight: "900",
    color: "#064E3B",
    marginBottom: 4,
  },

  mainStatLabel: {
    fontSize: 11,
    color: "#059669",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  detailStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(16,185,129,0.15)",
    marginBottom: 16,
  },

  detailStatItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  detailStatNumber: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },

  detailStatLabel: {
    fontSize: 10,
    color: "#6B7280",
    fontWeight: "700",
  },

  progressContainer: {
    marginTop: 6,
  },

  progressTrack: {
    height: 8,
    backgroundColor: "rgba(16,185,129,0.18)",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 8,
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
  },

  progressLabel: {
    fontSize: 11,
    color: "#059669",
    fontWeight: "800",
    textAlign: "center",
  },

  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#064E3B",
    marginBottom: 10,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 4,
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },

  itemIcon: {
    fontSize: 22,
    marginRight: 14,
  },

  itemInfo: {
    flex: 1,
  },

  itemLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 3,
    fontWeight: "800",
  },

  itemValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "800",
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(17,24,39,0.06)",
    marginHorizontal: 16,
  },

  dangerCard: {
    borderColor: "rgba(239,68,68,0.2)",
  },

  dangerTitle: {
    fontSize: 14,
    color: "#DC2626",
    fontWeight: "900",
    marginBottom: 2,
  },

  dangerSubtitle: {
    fontSize: 12,
    color: "rgba(220,38,38,0.7)",
    fontWeight: "700",
  },

  footer: {
    alignItems: "center",
    paddingVertical: 22,
    marginTop: 18,
  },

  footerText: {
    fontSize: 13,
    color: "#059669",
    fontWeight: "800",
    marginBottom: 3,
  },

  footerVersion: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "700",
  },
});
