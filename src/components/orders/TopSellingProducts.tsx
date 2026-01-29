'use client';

import { Box, Typography, Paper } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface Product {
  name: string;
  sales: number;
}

const products: Product[] = [
  { name: 'Dugod Hoodie', sales: 32 },
  { name: 'Volys', sales: 125 },
  { name: 'Cap Monayo', sales: 18 },
  { name: 'Dugod Jean', sales: 43 },
];

export function TopSellingProducts() {
  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Top-Selling Products
      </Typography>
      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={products} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={100} />
            <Bar
              dataKey="sales"
              fill="#2FD65D"
              label={{ position: 'right', fill: '#666' }}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
} 