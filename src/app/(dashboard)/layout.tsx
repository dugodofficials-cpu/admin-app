'use client';

import { Box } from '@mui/material';
import { Sidebar } from '@/components/Sidebar';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            ml: '250px',
            minHeight: '100vh',
            bgcolor: 'background.default',
          }}
        >
          {children}
        </Box>
      </Box>
    </AuthGuard>
  );
}
