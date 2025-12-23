import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WeatherAlert = ({ message }: any) => {
  return (
    <View style={styles.weatherAlert}>
      <Text style={styles.weatherAlertText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  weatherAlert: {
    backgroundColor: '#FFF3CD',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  weatherAlertText: {
    fontSize: 14,
    color: '#856404',
    fontWeight: '500',
  },
});

export default WeatherAlert;