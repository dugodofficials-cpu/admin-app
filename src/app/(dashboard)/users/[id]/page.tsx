'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Chip,
  Avatar,
  Alert,
  Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import { OrdersTable } from '@/components/orders/OrdersTable';
import { useUser, useResendVerification } from '@/hooks/users';
import { useParams, useRouter } from 'next/navigation';
import { useRoles } from '@/hooks/users';
import dayjs from 'dayjs';

export default function UserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const { data: userInfo, isLoading, error } = useUser(userId);
  const userData = userInfo?.data;
  const { data: rolesData } = useRoles();
  const roles = rolesData?.data ?? [];
  const resendVerification = useResendVerification();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleResendVerification = async () => {
    if (!showConfirmation) {
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 5000);
      return;
    }

    if (!userData) {
      return;
    }

    resendVerification.mutate(userData.email);
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          sx={{ mb: 4 }}
        >
          Back to Users
        </Button>
        <Typography>Loading user details...</Typography>
      </Box>
    );
  }

  if (error || !userData) {
    return (
      <Box sx={{ p: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          sx={{ mb: 4 }}
        >
          Back to Users
        </Button>
        <Typography color="error">
          Error loading user details: {error?.message}
        </Typography>
      </Box>
    );
  }

  const user = userData;
  const currentRole = user.userRoles?.[0]?.roleId;
  const currentRoleName = roles.find((role) => role.id === currentRole)?.name;

  return (
    <Box sx={{ p: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => router.back()}
        sx={{ mb: 4 }}
      >
        Back to Users
      </Button>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontFamily: 'ClashDisplay',
            gap: 2,
            mb: 3,
            fontWeight: 700,
            color: '#374151',
          }}
        >
          User Details
        </Typography>

        <Paper
          sx={{
            p: 4,
            borderRadius: '12px',
            boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 4,
            }}
          >
            <Box sx={{ flex: { xs: '1', md: '0 0 300px' } }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: '#2FD65D',
                    fontSize: '32px',
                    fontWeight: 600,
                  }}
                >
                  {user.firstName?.charAt(0)}
                  {user.lastName?.charAt(0)}
                </Avatar>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 3,
                }}
              >
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Phone Number
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {user.phone || 'Not provided'}
                  </Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Account Status
                  </Typography>
                  <Chip
                    label={user.status}
                    size="small"
                    sx={{
                      backgroundColor:
                        user.status === 'active'
                          ? '#2FD65D'
                          : user.status === 'suspended'
                          ? '#FFD700'
                          : '#FF6B6B',
                      color: '#000',
                      textTransform: 'capitalize',
                      fontWeight: 600,
                    }}
                  />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Role
                  </Typography>
                  <Chip
                    label={currentRoleName?.toLowerCase() || 'No Role'}
                    size="small"
                    sx={{
                      backgroundColor:
                        currentRoleName?.toLowerCase() === 'admin'
                          ? '#2FD65D'
                          : '#6B7280',
                      color: 'white',
                      textTransform: 'capitalize',
                      fontWeight: 600,
                    }}
                  />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Email Verification
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2,
                      flexDirection: 'column',
                    }}
                  >
                    <Chip
                      label={user.isEmailVerified ? 'Verified' : 'Not Verified'}
                      size="small"
                      sx={{
                        backgroundColor: user.isEmailVerified
                          ? '#2FD65D'
                          : '#FF6B6B',
                        color: 'white',
                        textTransform: 'capitalize',
                        fontWeight: 600,
                      }}
                    />
                    {!user.isEmailVerified && (
                      <Tooltip title="Send a new verification email to the user's email address">
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<EmailIcon />}
                          onClick={handleResendVerification}
                          disabled={resendVerification.isPending}
                          sx={{
                            borderColor: showConfirmation
                              ? '#FF6B6B'
                              : '#2FD65D',
                            color: showConfirmation ? '#FF6B6B' : '#2FD65D',
                            '&:hover': {
                              borderColor: showConfirmation
                                ? '#FF6B6B'
                                : '#2FD65D',
                              backgroundColor: showConfirmation
                                ? 'rgba(255, 107, 107, 0.1)'
                                : 'rgba(47, 214, 93, 0.1)',
                            },
                          }}
                        >
                          {resendVerification.isPending
                            ? 'Sending...'
                            : showConfirmation
                            ? 'Click again to confirm'
                            : 'Resend Verification'}
                        </Button>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Total Orders
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, color: '#2FD65D' }}
                  >
                    {user.totalOrdersCount || 0}
                  </Typography>
                </Box>
                <Box sx={{ mb: 3, gridColumn: { xs: '1', sm: '1 / -1' } }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Member Since
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {dayjs(user.createdAt).format('MMMM DD, YYYY')}
                  </Typography>
                </Box>
                {user.address && (
                  <Box sx={{ mb: 3, gridColumn: { xs: '1', sm: '1 / -1' } }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Address
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {user.address.street}, {user.address.city},{' '}
                      {user.address.state} {user.address.postalCode}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Paper>

        {resendVerification.isSuccess && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="success" sx={{ borderRadius: '8px' }}>
              Verification email sent successfully! Please check the user&apos;s
              email inbox.
            </Alert>
          </Box>
        )}

        {resendVerification.isError && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="error" sx={{ borderRadius: '8px' }}>
              Failed to send verification email. Please try again.
            </Alert>
          </Box>
        )}
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontFamily: 'ClashDisplay',
            gap: 2,
            mb: 3,
            fontWeight: 600,
            color: '#374151',
          }}
        >
          User Orders
        </Typography>

        <OrdersTable hideSearch={true} userId={userId} />
      </Box>
    </Box>
  );
}
