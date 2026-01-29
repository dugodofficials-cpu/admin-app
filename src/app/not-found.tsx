'use client';

import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function NotFound() {
  const router = useRouter();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '6rem', sm: '8rem' },
              fontWeight: 700,
              color: 'primary.main',
              lineHeight: 1,
              mb: 2,
            }}
          >
            404
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              mb: 2,
              color: 'text.primary',
            }}
          >
            Page Not Found
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mb: 4,
              maxWidth: 400,
              mx: 'auto',
            }}
          >
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Please check the URL or navigate back to the homepage.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.back()}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1.5,
              }}
            >
              Go Back
            </Button>

            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              onClick={() => router.push('/')}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1.5,
              }}
            >
              Go Home
            </Button>
          </Box>

          <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary">
              Need help? Contact support at{' '}
              <Typography
                component="span"
                variant="body2"
                color="primary.main"
                sx={{ fontWeight: 500 }}
              >
                support@dugod.com
              </Typography>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
