'use client';

import { Box, Paper, Typography, Stack } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

interface TopTrack {
  name: string;
  plays: number;
}

interface Product {
  name: string;
  sales: number;
}

const topTracks: TopTrack[] = [
  { name: 'Life na war', plays: 230 },
  { name: 'Friends & Enemies', plays: 56 },
  { name: 'My Ex No ment', plays: 1572 },
  { name: 'Mama', plays: 42 },
];

const topProducts: Product[] = [
  { name: 'Dugod Hoodie', sales: 32 },
  { name: 'Volys', sales: 125 },
  { name: 'Cap Monayo', sales: 18 },
  { name: 'Dugod Jean', sales: 43 },
];

const earningsData = [
  { step: 'Step 1', amount: 1250 },
  { step: 'Step 2', amount: 2800 },
  { step: 'Step 3', amount: 1800 },
  { step: 'Step 4', amount: 3000 },
  { step: 'Step 5', amount: 2000 },
  { step: 'Step 6', amount: 2500 },
  { step: 'Step 7', amount: 2300 },
];

export const SalesAnalysis = () => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Sales Analysis
      </Typography>

      <Box
        sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}
      >
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Top-Selling Tracks
          </Typography>
          <Stack spacing={2}>
            {topTracks.map((track) => (
              <Box
                key={track.name}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography>{track.name}</Typography>
                <Typography
                  sx={{
                    bgcolor: '#E8F5E9',
                    color: '#2FD65D',
                    px: 1,
                    borderRadius: 1,
                  }}
                >
                  {track.plays}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Top-Selling Products
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis />
              <Bar dataKey="sales" fill="#2FD65D" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Earnings Report</Typography>
            <Typography variant="h6" color="#2FD65D">
              ₦457,000
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Your Total earnings
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={earningsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="step" />
              <YAxis />
              <Bar dataKey="amount" fill="#2FD65D" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </Box>
  );
};
