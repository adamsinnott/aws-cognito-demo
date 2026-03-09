import * as React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export function SplashScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1B6E5A" />
      <Text style={styles.text}>Loading session...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F5F2',
  },
  text: {
    marginTop: 12,
    color: '#5B5B5B',
  },
});
