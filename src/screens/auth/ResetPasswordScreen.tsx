import * as React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '../../store/authStore';
import { authStyles } from './styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'ResetPassword'>;

export function ResetPasswordScreen({ route, navigation }: Props) {
  const pendingEmail = useAuthStore((state) => state.pendingEmail);
  const [email, setEmail] = React.useState(
    route.params?.email ?? pendingEmail ?? ''
  );
  const [code, setCode] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const { resetPassword, isLoading, error, clearError } = useAuthStore(
    useShallow((state) => ({
      resetPassword: state.resetPassword,
      isLoading: state.isLoading,
      error: state.error,
      clearError: state.clearError,
    }))
  );

  const handleReset = async () => {
    clearError();
    const success = await resetPassword(email.trim(), code.trim(), newPassword);
    if (success) {
      navigation.navigate('SignIn');
    }
  };

  return (
    <View style={authStyles.container}>
      <Text style={authStyles.title}>Set a new password</Text>
      <Text style={authStyles.subtitle}>Use the code we emailed you</Text>

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

      <Text style={authStyles.label}>Reset code</Text>
      <TextInput
        style={authStyles.input}
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        placeholder="123456"
        placeholderTextColor="#9A9A9A"
      />

      <Text style={authStyles.label}>New password</Text>
      <TextInput
        style={authStyles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        placeholder="New password"
        placeholderTextColor="#9A9A9A"
        textContentType="newPassword"
      />

      {error ? <Text style={authStyles.error}>{error}</Text> : null}

      <Pressable
        style={[authStyles.button, isLoading && authStyles.buttonDisabled]}
        onPress={handleReset}
        disabled={isLoading}
      >
        <Text style={authStyles.buttonText}>
          {isLoading ? 'Updating...' : 'Update Password'}
        </Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('SignIn')}>
        <Text style={authStyles.link}>Back to sign in</Text>
      </Pressable>
    </View>
  );
}
