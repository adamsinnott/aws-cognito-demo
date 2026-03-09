import { useEffect, ComponentProps } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { ConfirmCodeScreen } from '../screens/auth/ConfirmCodeScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { ResetPasswordScreen } from '../screens/auth/ResetPasswordScreen';
import { SignInScreen } from '../screens/auth/SignInScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { HomeScreen } from '../screens/app/HomeScreen';
import { SettingsScreen } from '../screens/app/SettingsScreen';
import { SplashScreen } from '../screens/app/SplashScreen';
import type {
  AppTabParamList,
  AuthStackParamList,
  RootStackParamList,
} from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppTabs = createBottomTabNavigator<AppTabParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{ title: 'Sign In' }}
      />
      <AuthStack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ title: 'Create Account' }}
      />
      <AuthStack.Screen
        name="ConfirmCode"
        component={ConfirmCodeScreen}
        options={{ title: 'Confirm Email' }}
      />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ title: 'Reset Password' }}
      />
      <AuthStack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{ title: 'Set New Password' }}
      />
    </AuthStack.Navigator>
  );
}

function AppNavigator() {
  return (
    <AppTabs.Navigator>
      <AppTabs.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <AppTabs.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </AppTabs.Navigator>
  );
}

type NavigationProps = Omit<
  ComponentProps<typeof NavigationContainer>,
  'children'
>;

export function Navigation(props: NavigationProps) {
  const status = useAuthStore((state) => state.status);
  const restoreSession = useAuthStore((state) => state.restoreSession);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return (
    <NavigationContainer {...props}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {status === 'booting' && (
          <RootStack.Screen name="Splash" component={SplashScreen} />
        )}
        {status === 'signedOut' && (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
        {status === 'signedIn' && (
          <RootStack.Screen name="App" component={AppNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export type { RootStackParamList, AuthStackParamList, AppTabParamList };

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}
