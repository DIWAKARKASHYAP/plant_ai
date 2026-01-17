import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface HeaderProps {
  userName?: string;
  userInitial?: string;
}

const Header: React.FC<HeaderProps> = ({ userName = 'Plant Lover', userInitial = 'P' }) => {
  return (
    <View style={styles.header}>
      <View style={styles.textContainer}>
        <Text style={styles.greeting}>Hello, {userName}!</Text>
        <Text style={styles.subtitle}>Let's care for your plants today 🌱</Text>
      </View>
      
      <TouchableOpacity style={styles.avatarContainer} activeOpacity={0.7}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userInitial.toUpperCase()}</Text>
        </View>
        {/* <View style={styles.notificationDot} /> */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#10B981',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 20,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#10B981',
  },
  // notificationDot: {
  //   position: 'absolute',
  //   top: 2,
  //   right: 2,
  //   width: 12,
  //   height: 12,
  //   borderRadius: 6,
  //   // backgroundColor: '#EF4444',
  //   borderWidth: 2,
  //   borderColor: '#fff',
  // },
});

export default Header;