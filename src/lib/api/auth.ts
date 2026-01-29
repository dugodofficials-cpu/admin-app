import { apiClient } from './client';
import { SignInInput, SignUpInput } from '../validations/auth';

export type AuthResponse = {
  data: {
    id: string;
    email: string;
    picture: string;
    emailVerified: boolean;
    token: string;
  };
};

export type VerificationResponse = {
  success: boolean;
  message: string;
};

export const authApi = {
  signUp: (data: Omit<SignUpInput, 'confirmPassword'>) =>
    apiClient<AuthResponse>('auth/signup', {
      method: 'POST',
      body: data,
    }),

  googleSignUp: (data: { token: string }) =>
    apiClient<AuthResponse>('auth/google', {
      method: 'POST',
      body: data,
    }),

  signIn: (data: SignInInput) =>
    apiClient<AuthResponse>('auth/signin/admin', {
      method: 'POST',
      body: data,
    }),

  verifyEmail: (token: string) =>
    apiClient<VerificationResponse>('auth/verify-email', {
      method: 'POST',
      body: { token },
    }),

  resendVerification: (email: string) =>
    apiClient<VerificationResponse>('auth/resend-verification', {
      method: 'POST',
      body: { email },
    }),

  forgotPassword: (email: string) =>
    apiClient<{ success: boolean; message: string }>('auth/forgot-password', {
      method: 'POST',
      body: { email },
    }),

  resetPassword: (token: string, password: string) =>
    apiClient<{ success: boolean; message: string }>('auth/reset-password', {
      method: 'POST',
      body: { token, password },
    }),

  logout: () =>
    apiClient<{ success: boolean }>('auth/logout', {
      method: 'POST',
    }),
};
