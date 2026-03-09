# AWS Cognito Demo

This project is a React Native/Expo spike used to explore how we might use AWS Cognito in future applications and how straightforward Cognito integration is in practice.

## What it supports

The app currently includes a complete email/password authentication path:

- Create account (sign up)
- Verify email address with confirmation code
- Sign in
- Forgot password (request reset code)
- Reset password with code
- Sign out
- Session restore on app launch

Signed-in users are routed to a basic app shell (`Home` and `Settings`) to validate authenticated navigation.

## Stack

- React Native + Expo + TypeScript
- AWS Amplify Auth (`aws-amplify`) with Amazon Cognito
- Zustand + AsyncStorage for persisted auth state
- React Navigation for auth/app routing

## Cognito setup

Update [`src/config/env.ts`](src/config/env.ts) with your Cognito values:

- `COGNITO_REGION`
- `COGNITO_USER_POOL_ID`
- `COGNITO_APP_CLIENT_ID`

The app client should be configured as a public client (no client secret) for mobile usage.

## Run locally

```sh
npm install
npm start
```

Optional platform commands:

```sh
npm run ios
npm run android
npm run web
```

`npm start` uses Expo dev client (`expo start --dev-client`), so this project is intended for development builds rather than Expo Go.

## Hosted demo (GitHub Pages)

This project has been modified to support Expo Web export so it can be hosted on GitHub Pages.

Live demo URL: https://adamsinnott.github.io/aws-cognito-demo/

Deployment scripts:

- `npm run predeploy` to export the web build (`expo export -p web`)
- `npm run deploy` to publish `dist` to GitHub Pages

## Scope

This repository is intended as an exploration/proof-of-concept for Cognito auth flows, not a production-hardened auth starter.
