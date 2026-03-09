export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ConfirmCode: { email?: string } | undefined;
  ForgotPassword: undefined;
  ResetPassword: { email?: string } | undefined;
};

export type AppTabParamList = {
  Home: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  App: undefined;
};
