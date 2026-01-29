'use client';

import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

interface StatsCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}

export function StatsCard({ icon, value, label }: StatsCardProps) {
  return (
    <Paper
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        bgcolor: '#f5f5f5',
        borderRadius: 2,
        minWidth: 200,
      }}
      elevation={0}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: '#e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Box>
      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Paper>
  );
} 