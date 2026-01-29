'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Grid,
} from '@mui/material';
import { UserDetails } from './types';

interface UserProfileProps {
  user: UserDetails;
}

interface InfoRowProps {
  label: string;
  value: string | React.ReactNode;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <Box sx={{ py: 2, borderBottom: '1px solid #f0f0f0' }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
  );
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          component="h2"
          sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}
        >
          👤 User Profile
        </Typography>

        <Paper sx={{ p: 3, bgcolor: '#f5f5f5' }} elevation={0}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <InfoRow label="Full Name" value={user.name} />
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Phone" value={user.phone} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <InfoRow label="Account Created" value={user.accountCreated} />
              <InfoRow
                label="Status"
                value={
                  <Chip
                    label={user.status}
                    color={user.status === 'Active' ? 'success' : 'warning'}
                    sx={{
                      backgroundColor:
                        user.status === 'Active' ? '#2FD65D' : '#FFD700',
                      color: '#000',
                    }}
                  />
                }
              />
              <InfoRow label="Role" value={user.role} />
              <InfoRow label="Delivery Address" value={user.deliveryAddress} />
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          component="h2"
          sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}
        >
          🛍️ Purchase Summary
        </Typography>

        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#000' }}>
                <TableCell sx={{ color: '#fff' }}>#</TableCell>
                <TableCell sx={{ color: '#fff' }}>Item</TableCell>
                <TableCell sx={{ color: '#fff' }}>Type</TableCell>
                <TableCell sx={{ color: '#fff' }}>Date</TableCell>
                <TableCell sx={{ color: '#fff' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {user.purchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell>{purchase.id}</TableCell>
                  <TableCell>{purchase.item}</TableCell>
                  <TableCell>{purchase.type}</TableCell>
                  <TableCell>{purchase.date}</TableCell>
                  <TableCell>
                    <Chip
                      label={purchase.status}
                      color={
                        purchase.status === 'Published' ? 'success' : 'warning'
                      }
                      sx={{
                        backgroundColor:
                          purchase.status === 'Published'
                            ? '#2FD65D'
                            : '#FFD700',
                        color: '#000',
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
