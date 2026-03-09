import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '../../store/authStore';

export function SettingsScreen() {
  const { signOut, isLoading } = useAuthStore(
    useShallow((state) => ({
      signOut: state.signOut,
      isLoading: state.isLoading,
    }))
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Manage your session</Text>

      <Pressable
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={() => signOut()}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Signing out...' : 'Sign Out'}
        </Text>
      </Pressable>
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
  button: {
    backgroundColor: '#1B6E5A',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
