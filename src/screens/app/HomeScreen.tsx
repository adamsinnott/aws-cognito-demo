import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuthStore } from '../../store/authStore';

export function HomeScreen() {
  const user = useAuthStore((state) => state.user);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signed in</Text>
      <Text style={styles.subtitle}>Welcome, {user?.email ?? 'demo-user'}</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Stubbed API</Text>
        <Text style={styles.cardBody}>
          This is a placeholder. We'll wire the /me endpoint next.
        </Text>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Call /me (stub)</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F7F5F2',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E1E1E',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#5B5B5B',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2DDD5',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1E1E1E',
  },
  cardBody: {
    fontSize: 14,
    color: '#5B5B5B',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#1B6E5A',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
