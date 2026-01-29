'use client';

import { useOrderStatistics } from '@/hooks/order';
import { useUserStatistics } from '@/hooks/users';
import {
  AttachMoney,
  LocalShipping,
  People,
  Refresh,
  ShoppingCart,
  TrendingUp,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Typography,
} from '@mui/material';
import React from 'react';

interface StatTileProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  isLoading?: boolean;
}

function StatTile({
  title,
  value,
  subtitle,
  icon,
  color,
  isLoading = false,
}: StatTileProps) {
  return (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}20`,
        borderRadius: 3,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 25px ${color}20`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500, mb: 0.5 }}
            >
              {title}
            </Typography>
            {isLoading ? (
              <Skeleton variant="text" width={80} height={32} />
            ) : (
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  fontFamily: 'ClashDisplay',
                  color: 'text.primary',
                }}
              >
                {value}
              </Typography>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: '0.875rem' }}
          >
            {subtitle}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export function StatisticsTiles() {
  const { data: orderStats, isLoading: orderStatsLoading } =
    useOrderStatistics();
  const { data: userStats, isLoading: userStatsLoading } = useUserStatistics();

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      const millions = amount / 1000000;
      return `₦${millions.toFixed(1)}M`;
    }

    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-NG').format(num);
  };

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatTile
          title="Total Users"
          value={
            userStatsLoading
              ? '...'
              : formatNumber(userStats?.data.totalUsers || 0)
          }
          subtitle="Registered users"
          icon={<People sx={{ color: 'white', fontSize: 24 }} />}
          color="#6366f1"
          isLoading={userStatsLoading}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatTile
          title="Total Orders"
          value={
            orderStatsLoading
              ? '...'
              : formatNumber(orderStats?.totalOrders || 0)
          }
          subtitle="All time orders"
          icon={<ShoppingCart sx={{ color: 'white', fontSize: 24 }} />}
          color="#2FD65D"
          isLoading={orderStatsLoading}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatTile
          title="Total Revenue"
          value={
            orderStatsLoading
              ? '...'
              : formatCurrency(orderStats?.totalRevenue || 0)
          }
          subtitle="Gross revenue"
          icon={<AttachMoney sx={{ color: 'white', fontSize: 24 }} />}
          color="#f59e0b"
          isLoading={orderStatsLoading}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatTile
          title="Products Sold"
          value={
            orderStatsLoading
              ? '...'
              : formatNumber(orderStats?.totalProductsSold || 0)
          }
          subtitle="Units sold"
          icon={<LocalShipping sx={{ color: 'white', fontSize: 24 }} />}
          color="#ef4444"
          isLoading={orderStatsLoading}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatTile
          title="Pending Orders"
          value={
            orderStatsLoading
              ? '...'
              : formatNumber(orderStats?.totalPendingOrders || 0)
          }
          subtitle="Awaiting confirmation"
          icon={<Refresh sx={{ color: 'white', fontSize: 24 }} />}
          color="#8b5cf6"
          isLoading={orderStatsLoading}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatTile
          title="Total Customers"
          value={
            orderStatsLoading
              ? '...'
              : formatNumber(orderStats?.totalCustomers || 0)
          }
          subtitle="Unique customers"
          icon={<People sx={{ color: 'white', fontSize: 24 }} />}
          color="#06b6d4"
          isLoading={orderStatsLoading}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatTile
          title="Total Refunds"
          value={
            orderStatsLoading
              ? '...'
              : formatNumber(orderStats?.totalRefunds || 0)
          }
          subtitle="Refunded orders"
          icon={<Refresh sx={{ color: 'white', fontSize: 24 }} />}
          color="#ec4899"
          isLoading={orderStatsLoading}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatTile
          title="Conversion Rate"
          value={
            orderStatsLoading
              ? '...'
              : `${(
                  ((orderStats?.totalCustomers || 0) /
                    (userStats?.data.totalUsers || 1)) *
                  100
                ).toFixed(1)}%`
          }
          subtitle="Users to customers"
          icon={<TrendingUp sx={{ color: 'white', fontSize: 24 }} />}
          color="#10b981"
          isLoading={orderStatsLoading || userStatsLoading}
        />
      </Grid>
    </Grid>
  );
}
