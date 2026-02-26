'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cookies } from '@/lib/utils/cookies';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '@/hooks/use-auth';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { isLoading, error } = useAuth();
  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>(
    'checking',
  );

  useEffect(() => {
    const token = cookies.getAuthToken();
    setAuthStatus(token ? 'authenticated' : 'unauthenticated');
  }, []);

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.replace('/login');
    }
  }, [router, authStatus]);

  useEffect(() => {
    if (authStatus !== 'authenticated') return;
    if (!error) return;
    cookies.removeAuthToken();
    router.replace('/login');
  }, [authStatus, error, router]);

  if (authStatus !== 'authenticated' || isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}