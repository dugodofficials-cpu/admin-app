'use client';

import { Logo } from '@/components/Logo';
import { useSignIn } from '@/hooks/auth';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { cookies } from '@/lib/utils/cookies';
import { useEffect } from 'react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean(),
});

type LoginCredentials = z.infer<typeof loginSchema>;

type FormErrors = {
  email?: string;
  password?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const token = cookies.getAuthToken();

  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (token) {
      router.push('/dashboard');
    }
  }, [token, router]);

  const loginMutation = useSignIn();

  const validateForm = (): boolean => {
    try {
      loginSchema.parse(credentials);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formErrors: FormErrors = {};
        error.issues.forEach((err) => {
          const path = err.path[0] as keyof FormErrors;
          if (path === 'email' || path === 'password') {
            formErrors[path] = err.message;
          }
        });
        setErrors(formErrors);
      }
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      loginMutation.mutate({
        email: credentials.email.toLowerCase(),
        password: credentials.password,
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          p: 4,
        }}
      >
        <Box sx={{ mb: 8 }}>
          <Logo />
        </Box>

        <Container maxWidth="sm">
          <Box component="form" onSubmit={handleSubmit}>
            <Typography
              variant="h3"
              component="h1"
              sx={{ mb: 4, fontWeight: 'bold' }}
            >
              Admin Login
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography sx={{ mb: 1 }}>Email Address</Typography>
              <TextField
                fullWidth
                placeholder="admin@dugod.com"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
                error={!!errors.email}
                helperText={errors.email}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography sx={{ mb: 1 }}>Password</Typography>
              <TextField
                fullWidth
                type="password"
                placeholder="********"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                error={!!errors.password}
                helperText={errors.password}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={credentials.rememberMe}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        rememberMe: e.target.checked,
                      })
                    }
                  />
                }
                label="Remember me"
              />
              <Link
                href="/forgot-password"
                underline="none"
                sx={{ color: 'text.primary' }}
              >
                Forgot Password?
              </Link>
            </Box>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              sx={{
                bgcolor: '#2FD65D',
                color: 'white',
                textTransform: 'none',
                fontSize: '1rem',
                py: 1.5,
                '&:hover': {
                  bgcolor: '#2AC152',
                },
              }}
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending
                ? 'Logging in...'
                : 'Login to Admin Panel'}
            </Button>
          </Box>
        </Container>
      </Box>

      <Box
        sx={{
          flex: 1,
          bgcolor: 'black',
          position: 'relative',
          backgroundImage: 'url(/assets/authbg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
    </Box>
  );
}
