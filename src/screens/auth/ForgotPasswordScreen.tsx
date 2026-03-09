import * as React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '../../store/authStore';
import { authStyles } from './styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = React.useState('');
  const { forgotPassword, isLoading, error, clearError } = useAuthStore(
    useShallow((state) => ({
      forgotPassword: state.forgotPassword,
      isLoading: state.isLoading,
      error: state.error,
      clearError: state.clearError,
    }))
  );

  const handleReset = async () => {
    clearError();
    const trimmedEmail = email.trim();
    const success = await forgotPassword(trimmedEmail);
    if (success && trimmedEmail) {
      navigation.navigate('ResetPassword', { email: trimmedEmail });
    }
  };

  return (
    <View style={authStyles.container}>
      <Text style={authStyles.title}>Forgot your password?</Text>
      <Text style={authStyles.subtitle}>
        We'll send a reset code to your email
      </Text>

      <Text style={authStyles.label}>Email</Text>
      <TextInput
        style={authStyles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="you@example.com"
        placeholderTextColor="#9A9A9A"
        textContentType="emailAddress"
      />

      {error ? <Text style={authStyles.error}>{error}</Text> : null}

      <Pressable
        style={[authStyles.button, isLoading && authStyles.buttonDisabled]}
        onPress={handleReset}
        disabled={isLoading}
      >
        <Text style={authStyles.buttonText}>
          {isLoading ? 'Sending...' : 'Send Reset Code'}
        </Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('SignIn')}>
        <Text style={authStyles.link}>Back to sign in</Text>
      </Pressable>
    </View>
  );
}
