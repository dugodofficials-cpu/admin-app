'use client';

import { Box, Typography } from '@mui/material';
import { OrdersTable } from '@/components/orders/OrdersTable';
import { StatisticsTiles } from '@/components/dashboard/StatisticsTiles';

export default function DashboardPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 4,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontFamily: 'ClashDisplay', fontWeight: 700 }}
            >
              Admin Dashboard
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ m: 0 }}>
            Here&apos;s what&apos;s happening across DuGod today.
          </Typography>
        </Box>
      </Box>

      <StatisticsTiles />

      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        Recent Orders
      </Typography>
      <OrdersTable hideSearch />
    </Box>
  );
}
