import * as React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '../../store/authStore';
import { authStyles } from './styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'ConfirmCode'>;

export function ConfirmCodeScreen({ route, navigation }: Props) {
  const pendingEmail = useAuthStore((state) => state.pendingEmail);
  const [email, setEmail] = React.useState(
    route.params?.email ?? pendingEmail ?? ''
  );
  const [code, setCode] = React.useState('');
  const { confirmSignUp, isLoading, error, clearError } = useAuthStore(
    useShallow((state) => ({
      confirmSignUp: state.confirmSignUp,
      isLoading: state.isLoading,
      error: state.error,
      clearError: state.clearError,
    }))
  );

  const handleConfirm = async () => {
    clearError();
    await confirmSignUp(email.trim(), code.trim());
  };

  return (
    <View style={authStyles.container}>
      <Text style={authStyles.title}>Confirm your email</Text>
      <Text style={authStyles.subtitle}>
        Enter the code we sent to your inbox
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

      <Text style={authStyles.label}>Confirmation code</Text>
      <TextInput
        style={authStyles.input}
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        placeholder="123456"
        placeholderTextColor="#9A9A9A"
      />

      {error ? <Text style={authStyles.error}>{error}</Text> : null}

      <Pressable
        style={[authStyles.button, isLoading && authStyles.buttonDisabled]}
        onPress={handleConfirm}
        disabled={isLoading}
      >
        <Text style={authStyles.buttonText}>
          {isLoading ? 'Confirming...' : 'Confirm'}
        </Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('SignIn')}>
        <Text style={authStyles.link}>Back to sign in</Text>
      </Pressable>
    </View>
  );
}
