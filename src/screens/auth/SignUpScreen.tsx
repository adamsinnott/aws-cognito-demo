import * as React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '../../store/authStore';
import { authStyles } from './styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

export function SignUpScreen({ navigation }: Props) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { signUp, isLoading, error, clearError } = useAuthStore(
    useShallow((state) => ({
      signUp: state.signUp,
      isLoading: state.isLoading,
      error: state.error,
      clearError: state.clearError,
    }))
  );

  const handleSignUp = async () => {
    clearError();
    const trimmedEmail = email.trim();
    const success = await signUp(trimmedEmail, password);
    if (success && trimmedEmail) {
      navigation.navigate('ConfirmCode', { email: trimmedEmail });
    }
  };

  return (
    <View style={authStyles.container}>
      <Text style={authStyles.title}>Create account</Text>
      <Text style={authStyles.subtitle}>Start your AWS Cognito demo</Text>

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

      <Text style={authStyles.label}>Password</Text>
      <TextInput
        style={authStyles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Choose a password"
        placeholderTextColor="#9A9A9A"
        textContentType="newPassword"
      />

      {error ? <Text style={authStyles.error}>{error}</Text> : null}

      <Pressable
        style={[authStyles.button, isLoading && authStyles.buttonDisabled]}
        onPress={handleSignUp}
        disabled={isLoading}
      >
        <Text style={authStyles.buttonText}>
          {isLoading ? 'Creating...' : 'Create Account'}
        </Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('SignIn')}>
        <Text style={authStyles.link}>Already have an account? Sign in</Text>
      </Pressable>
    </View>
  );
}
