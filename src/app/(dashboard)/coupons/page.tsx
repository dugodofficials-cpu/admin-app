'use client';

import { Box, Container, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import { TabPanel } from '@/components/coupons/TabPanel';
import CouponList from '@/components/coupons/CouponList';
import AddCouponForm from '@/components/coupons/AddCouponForm';

export default function CouponsPage() {
  const [value, setValue] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ width: '100%', mt: 3 }}>
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontFamily: 'ClashDisplay', fontWeight: 700 }}
          >
            Coupons
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage coupons for products and orders.
          </Typography>
        </Box>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Active Coupons" />
            <Tab label="Add New Coupon" />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <CouponList />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <AddCouponForm />
        </TabPanel>
      </Box>
    </Container>
  );
}
