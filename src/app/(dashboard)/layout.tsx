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
            p: { xs: 2, md: 3 },
          }}
        >
          <Box
            sx={{
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
              p: { xs: 2, md: 3 },
              minHeight: 'calc(100vh - 48px)',
              boxShadow: '0 10px 30px rgba(2, 6, 23, 0.04)',
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </AuthGuard>
  );
}
