'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cookies } from '@/lib/utils/cookies';
import { Box, CircularProgress } from '@mui/material';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const token = cookies.getAuthToken();

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [router, token]);

  if (!token) {
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