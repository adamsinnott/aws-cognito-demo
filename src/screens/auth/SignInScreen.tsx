import * as React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '../../store/authStore';
import { authStyles } from './styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignIn'>;

export function SignInScreen({ navigation }: Props) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { signIn, isLoading, error, clearError } = useAuthStore(
    useShallow((state) => ({
      signIn: state.signIn,
      isLoading: state.isLoading,
      error: state.error,
      clearError: state.clearError,
    }))
  );

  const handleSignIn = async () => {
    clearError();
    await signIn(email.trim(), password);
  };

  return (
    <View style={authStyles.container}>
      <Text style={authStyles.title}>Welcome back</Text>
      <Text style={authStyles.subtitle}>Sign in to continue</Text>

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
        placeholder="Your password"
        placeholderTextColor="#9A9A9A"
        textContentType="password"
      />

      {error ? <Text style={authStyles.error}>{error}</Text> : null}

      <Pressable
        style={[authStyles.button, isLoading && authStyles.buttonDisabled]}
        onPress={handleSignIn}
        disabled={isLoading}
      >
        <Text style={authStyles.buttonText}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={authStyles.link}>Forgot password?</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('SignUp')}>
        <Text style={authStyles.link}>Create an account</Text>
      </Pressable>
    </View>
  );
}
