import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { useRouter } from 'next/navigation';
import { cookies } from '@/lib/utils/cookies';
import { ROUTES } from '@/utils/paths';
import { enqueueSnackbar } from 'notistack';

interface User {
  id: string;
  email: string;
  emailVerified: boolean;
}

interface AuthResponse {
  data: User;
  token?: string;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface SignUpCredentials extends SignInCredentials {
  name: string;
}

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<AuthResponse>({
    queryKey: ['auth'],
    queryFn: async () => {
      try {
        return await apiClient<AuthResponse>('auth/me');
      } catch (error) {
        enqueueSnackbar((error as Error).message || 'Failed to fetch user', { variant: 'error' });
        throw error;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const handleAuthSuccess = (response: AuthResponse) => {
    if (response.token) {
      cookies.setAuthToken(response.token);
    }
    queryClient.setQueryData(['auth'], response);
    router.push(ROUTES.DASHBOARD.HOME);
  };

  const signIn = useMutation({
    mutationFn: (credentials: SignInCredentials) =>
      apiClient<AuthResponse>('auth/signin', {
        method: 'POST',
        body: credentials,
      }),
    onSuccess: handleAuthSuccess,
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Failed to sign in', { variant: 'error' });
    },
  });

  const signUp = useMutation({
    mutationFn: (credentials: SignUpCredentials) =>
      apiClient<AuthResponse>('auth/signup', {
        method: 'POST',
        body: credentials,
      }),
    onSuccess: handleAuthSuccess,
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Failed to sign up', { variant: 'error' });
    },
  });

  const signOut = useMutation({
    mutationFn: () =>
      apiClient('auth/signout', {
        method: 'POST',
      }),
    onSuccess: () => {
      cookies.removeAuthToken();
      queryClient.setQueryData(['auth'], { user: null });
      router.push(ROUTES.DASHBOARD.AUTH.LOGIN);
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Failed to sign out', { variant: 'error' });
    },
  });

  return {
    user: data,
    isAuthenticated: !!data?.data?.email,
    isLoading,
    error,
    signIn: {
      mutate: signIn.mutate,
      isLoading: signIn.isPending,
      error: signIn.error,
    },
    signUp: {
      mutate: signUp.mutate,
      isLoading: signUp.isPending,
      error: signUp.error,
    },
    signOut: {
      mutate: signOut.mutate,
      isLoading: signOut.isPending,
      error: signOut.error,
    },
  };
} 