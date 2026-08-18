/* eslint-disable @typescript-eslint/no-explicit-any */
import { AWS_ACCESS_KEY_ID, AWS_AVT_COGNITO_ACCESS_KEY, AWS_AVT_COGNITO_SECRET_ACCESS_KEY, AWS_REGION, AWS_SECRET_ACCESS_KEY, COGNITO_CLIENT_ID, COGNITO_CLIENT_SECRET, USER_POOL_ID } from '@/env';
import { AdminGetUserCommand, AdminUpdateUserAttributesCommand, AuthFlowType, CognitoIdentityProviderClient, ConfirmForgotPasswordCommand, ConfirmSignUpCommand, ForgotPasswordCommand, InitiateAuthCommand, ResendConfirmationCodeCommand, SignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import crypto from 'crypto';



export const generateSecretHash = async (username: string) => {
    const hmac = crypto.createHmac('sha256', COGNITO_CLIENT_SECRET);
    hmac.update(username + COGNITO_CLIENT_ID);
    return hmac.digest('base64');
};

export const cognito = new CognitoIdentityProviderClient({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_AVT_COGNITO_ACCESS_KEY,
        secretAccessKey: AWS_AVT_COGNITO_SECRET_ACCESS_KEY,
    },
});


export async function cognitoAdminGetUser({ email }: { email: string }) {
    const params = {
        UserPoolId: USER_POOL_ID,
        Username: email,
    };
    const commandLogin = new AdminGetUserCommand(params);
    return cognito.send(commandLogin);
}

async function getCognitoAuthUsername(email: string) {
    try {
        const user = await cognitoAdminGetUser({ email });
        return user.Username ?? email;
    } catch {
        return email;
    }
}


export async function cognitoSignUp({ email, userAttribute, password }: { email: string, userAttribute: any, password: string }) {
    const createUserParams = {
        ClientId: COGNITO_CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: userAttribute,
         SecretHash: await generateSecretHash(email),
    };

    const createUserCommand = new SignUpCommand(createUserParams);
    return cognito.send(createUserCommand);
}


export async function cognitoUpdateUserAttribute({ userAttribute, email }: { userAttribute: any, email: string }) {
    const params = {
        UserPoolId: USER_POOL_ID,
        Username: email,
        UserAttributes: userAttribute,
    };
    const command = new AdminUpdateUserAttributesCommand(params);
    return cognito.send(command);
}


export async function cognitoConfirmSignUp({ email, code }: { email: string, code: string }) {
    const params = {
        ClientId: COGNITO_CLIENT_ID,
        Username: email,
        ConfirmationCode: code,
        SecretHash: await generateSecretHash(email),
    };

    const command = new ConfirmSignUpCommand(params);
    return cognito.send(command);
}

export async function cognitoResendConfirmationCode({ email }: { email: string }) {
    const params = {
        ClientId: COGNITO_CLIENT_ID,
        Username: email,
        SecretHash: await generateSecretHash(email),
    };

    const command = new ResendConfirmationCodeCommand(params);
    return cognito.send(command);
}

export async function authSingIn({ email, password }: { email: string, password: string }) {
    if (!email || !password) {
        throw new Error('Email and password are required.');
    }

    try {
        const response = await cognitoInitiateAuth({ email, password });
        return {
            message: 'Login successful.',
            accessToken: response.AuthenticationResult?.AccessToken,
            idToken: response.AuthenticationResult?.IdToken,
            refreshToken: response.AuthenticationResult?.RefreshToken,
            expiresIn: response.AuthenticationResult?.ExpiresIn,
            tokenType: response.AuthenticationResult?.TokenType,
        };
    } catch (error) {
        throw error;
    }
}


export async function cognitoInitiateAuth({ email, password }: { email: string, password: string }) {
    const username = await getCognitoAuthUsername(email);
    const paramsLogin = {
        AuthFlow: 'USER_PASSWORD_AUTH' as AuthFlowType,
        ClientId: COGNITO_CLIENT_ID,
        AuthParameters: {
            USERNAME: username,
            PASSWORD: password,
            SECRET_HASH: await generateSecretHash(username),
        },
    };
    const commandLogin = new InitiateAuthCommand(paramsLogin);
    return cognito.send(commandLogin);
}

export async function cognitoForgotPassword({ email }: { email: string }) {
    const params = {
        ClientId: COGNITO_CLIENT_ID,
        Username: email,
        SecretHash: await generateSecretHash(email),
    };

    const command = new ForgotPasswordCommand(params);
    return cognito.send(command);
}

export async function cognitoConfirmForgotPassword({ email, code, newPassword }: { email: string, code: string, newPassword: string }) {
    const params = {
        ClientId: COGNITO_CLIENT_ID,
        Username: email,
        ConfirmationCode: code,
        Password: newPassword,
        SecretHash: await generateSecretHash(email),
    };

    const command = new ConfirmForgotPasswordCommand(params);
    return cognito.send(command);
}
