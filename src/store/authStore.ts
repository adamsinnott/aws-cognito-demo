import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  autoSignIn,
  confirmResetPassword,
  confirmSignUp,
  fetchUserAttributes,
  getCurrentUser,
  resetPassword as amplifyResetPassword,
  signIn as amplifySignIn,
  signOut as amplifySignOut,
  signUp as amplifySignUp,
} from 'aws-amplify/auth';

export type AuthStatus = 'booting' | 'signedOut' | 'signedIn';

export type AuthUser = {
  id: string;
  email: string;
};

type AuthState = {
  status: AuthStatus;
  user: AuthUser | null;
  error: string | null;
  pendingEmail: string | null;
  isLoading: boolean;
  _hasHydrated: boolean;
};

type AuthActions = {
  restoreSession: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<boolean>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (
    email: string,
    code: string,
    newPassword: string
  ) => Promise<boolean>;
  clearError: () => void;
  setHasHydrated: (value: boolean) => void;
};

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const getAuthErrorMessage = (error: unknown) => {
  if (!error || typeof error !== 'object') {
    return 'Something went wrong. Please try again.';
  }

  const typedError = error as { name?: string; message?: string };

  switch (typedError.name) {
    case 'UserNotConfirmedException':
      return 'Please confirm your email before signing in.';
    case 'NotAuthorizedException':
      return 'Incorrect email or password.';
    case 'UserNotFoundException':
      return 'No account found with that email.';
    case 'UsernameExistsException':
      return 'An account with that email already exists.';
    case 'CodeMismatchException':
      return 'Invalid confirmation code.';
    case 'ExpiredCodeException':
      return 'That confirmation code has expired.';
    case 'LimitExceededException':
      return 'Too many attempts. Please try again later.';
    default:
      return typedError.message ?? 'Something went wrong. Please try again.';
  }
};

const loadCurrentUser = async (): Promise<AuthUser> => {
  const currentUser = await getCurrentUser();
  let email = currentUser.username;

  try {
    const attributes = await fetchUserAttributes();
    email = attributes.email ?? email;
  } catch {
    // If attributes fail to load, fall back to the username.
  }

  return { id: currentUser.userId, email };
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      status: 'booting',
      user: null,
      error: null,
      pendingEmail: null,
      isLoading: false,
      _hasHydrated: false,
      restoreSession: async () => {
        const waitForHydration = async () => {
          const start = Date.now();
          while (!get()._hasHydrated && Date.now() - start < 2000) {
            await sleep(50);
          }
        };
        await waitForHydration();
        try {
          const user = await loadCurrentUser();
          set({ status: 'signedIn', user, error: null, isLoading: false });
        } catch {
          set({ status: 'signedOut', user: null, error: null, isLoading: false });
        }
      },
      signIn: async (email, password) => {
        const trimmedEmail = email.trim();
        set({ isLoading: true, error: null });
        if (!trimmedEmail || !password) {
          set({
            error: 'Email and password are required.',
            isLoading: false,
          });
          return;
        }
        try {
          const { isSignedIn, nextStep } = await amplifySignIn({
            username: trimmedEmail,
            password,
          });

          if (isSignedIn) {
            const user = await loadCurrentUser();
            set({
              status: 'signedIn',
              user,
              pendingEmail: null,
              isLoading: false,
            });
            return;
          }

          if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
            set({
              status: 'signedOut',
              user: null,
              pendingEmail: trimmedEmail,
              error: 'Please confirm your email before signing in.',
              isLoading: false,
            });
            return;
          }

          set({
            status: 'signedOut',
            user: null,
            error: 'Additional sign-in steps are required.',
            isLoading: false,
          });
        } catch (error) {
          set({ error: getAuthErrorMessage(error), isLoading: false });
        }
      },
      signOut: async () => {
        set({ isLoading: true, error: null });
        try {
          await amplifySignOut();
        } catch (error) {
          set({ error: getAuthErrorMessage(error) });
        } finally {
          set({
            status: 'signedOut',
            user: null,
            pendingEmail: null,
            isLoading: false,
          });
        }
      },
      signUp: async (email, password) => {
        const trimmedEmail = email.trim();
        set({ isLoading: true, error: null });
        if (!trimmedEmail || !password) {
          set({
            error: 'Email and password are required',
            isLoading: false,
          });
          return false;
        }
        try {
          await amplifySignUp({
            username: trimmedEmail,
            password,
            options: {
              userAttributes: {
                email: trimmedEmail,
              },
              autoSignIn: true,
            },
          });
          set({ pendingEmail: trimmedEmail, isLoading: false });
          return true;
        } catch (error) {
          set({ error: getAuthErrorMessage(error), isLoading: false });
          return false;
        }
      },
      confirmSignUp: async (email, code) => {
        const trimmedEmail = email.trim();
        set({ isLoading: true, error: null });
        if (!trimmedEmail || !code) {
          set({
            error: 'Email and confirmation code are required.',
            isLoading: false,
          });
          return;
        }
        try {
          const { nextStep } = await confirmSignUp({
            username: trimmedEmail,
            confirmationCode: code,
          });

          if (nextStep.signUpStep === 'COMPLETE_AUTO_SIGN_IN') {
            try {
              const { isSignedIn } = await autoSignIn();
              if (isSignedIn) {
                const user = await loadCurrentUser();
                set({
                  status: 'signedIn',
                  user,
                  pendingEmail: null,
                  isLoading: false,
                });
                return;
              }
            } catch {
              // Auto sign-in is optional; fall back to manual sign-in.
            }
          }

          set({
            status: 'signedOut',
            user: null,
            pendingEmail: null,
            isLoading: false,
          });
        } catch (error) {
          set({ error: getAuthErrorMessage(error), isLoading: false });
        }
      },
      forgotPassword: async (email) => {
        const trimmedEmail = email.trim();
        set({ isLoading: true, error: null });
        if (!trimmedEmail) {
          set({ error: 'Email is required.', isLoading: false });
          return false;
        }
        try {
          await amplifyResetPassword({ username: trimmedEmail });
          set({ pendingEmail: trimmedEmail, isLoading: false });
          return true;
        } catch (error) {
          set({ error: getAuthErrorMessage(error), isLoading: false });
          return false;
        }
      },
      resetPassword: async (email, code, newPassword) => {
        const trimmedEmail = email.trim();
        set({ isLoading: true, error: null });
        if (!trimmedEmail || !code || !newPassword) {
          set({
            error: 'Email, code, and new password are required.',
            isLoading: false,
          });
          return false;
        }
        try {
          await confirmResetPassword({
            username: trimmedEmail,
            confirmationCode: code,
            newPassword,
          });
          set({ pendingEmail: null, isLoading: false });
          return true;
        } catch (error) {
          set({ error: getAuthErrorMessage(error), isLoading: false });
          return false;
        }
      },
      clearError: () => set({ error: null }),
      setHasHydrated: (value) => set({ _hasHydrated: value }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        status: state.status,
        user: state.user,
        pendingEmail: state.pendingEmail,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);

export const useAuthStatus = () => useAuthStore((state) => state.status);
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useAuthPendingEmail = () => useAuthStore((state) => state.pendingEmail);
export const useAuthHydrated = () => useAuthStore((state) => state._hasHydrated);
