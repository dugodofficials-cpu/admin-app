import { authApi } from '@/lib/api/auth';
import { cookies } from '@/lib/utils/cookies';
import { SignInInput } from '@/lib/validations/auth';
import { ROUTES } from '@/utils/paths';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';


export function useSignIn() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignInInput) => authApi.signIn(data),
    onSuccess: (response) => {
      if (!response || !response) {
        console.error('Invalid auth response:', response);
        return;
      }

      cookies.setAuthToken(response.data.token);

      queryClient.clear();
      router.push(ROUTES.DASHBOARD.HOME);
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
  });
}

export function useGoogleSignUp() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { token: string }) => authApi.googleSignUp(data),
    onSuccess: (response) => {
      if (!response || !response) {
        console.error('Invalid auth response:', response);
        return;
      }

      cookies.setAuthToken(response.data.token);
      queryClient.clear();
      router.push(ROUTES.DASHBOARD.HOME);
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to sign up with Google', { variant: 'error' });
    },
  });
}

export function useVerifyEmail() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
    onSuccess: () => {
      queryClient.clear();
      router.push(ROUTES.DASHBOARD.HOME);
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to verify email', { variant: 'error' });
    },
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: (email: string) => authApi.resendVerification(email),
    onSuccess: () => {
      enqueueSnackbar('Verification email sent successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to resend verification email', { variant: 'error' });
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    onSuccess: () => {
      enqueueSnackbar('Password reset email sent successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to send password reset email', { variant: 'error' });
    },
  });
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authApi.resetPassword(token, password),
    onSuccess: () => {
      enqueueSnackbar('Password reset successfully', { variant: 'success' });
      router.push(ROUTES.DASHBOARD.HOME);
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to reset password', { variant: 'error' });
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      cookies.removeAuthToken();

      queryClient.clear();
      router.push(ROUTES.DASHBOARD.HOME);
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to logout', { variant: 'error' });
    },
  });
}
