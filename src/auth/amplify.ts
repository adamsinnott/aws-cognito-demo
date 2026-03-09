import { Amplify } from "aws-amplify";
import { ENV } from "../config/env";

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: ENV.COGNITO_USER_POOL_ID,
            userPoolClientId: ENV.COGNITO_APP_CLIENT_ID,
        },
    },
});
