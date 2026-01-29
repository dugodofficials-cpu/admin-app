'use client';

import { UserList } from '@/components/users/UserList';
import { Box, Typography } from '@mui/material';

export default function UsersPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{ mb: 1, fontFamily: 'ClashDisplay', fontWeight: 700 }}
          >
            Users
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View, filter, and manage users across the DuGod platform.
          </Typography>
        </Box>
      </Box>

      <UserList />
    </Box>
  );
}
