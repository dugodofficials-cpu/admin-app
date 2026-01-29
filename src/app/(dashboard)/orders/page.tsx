'use client';

import { OrdersTable } from '@/components/orders/OrdersTable';
import { Box, Typography } from '@mui/material';

export default function OrdersPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontFamily: 'ClashDisplay', fontWeight: 700 }}
        >
          Orders Manager
        </Typography>
      </Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Monitor, track, and update all customer purchases in real-time.
      </Typography>

      <OrdersTable />
    </Box>
  );
}
