'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material';
import { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SnackbarProvider } from 'notistack';

const theme = createTheme({
  typography: {
    fontFamily: ['Satoshi', 'sans-serif'].join(','),
    h1: {
      fontFamily: 'Satoshi',
      fontWeight: 700,
    },
    h2: {
      fontFamily: 'Satoshi',
      fontWeight: 700,
    },
    h3: {
      fontFamily: 'Satoshi',
      fontWeight: 700,
    },
    h4: {
      fontFamily: 'Satoshi',
      fontWeight: 500,
    },
    h5: {
      fontFamily: 'Satoshi',
      fontWeight: 500,
    },
    h6: {
      fontFamily: 'Satoshi',
      fontWeight: 500,
    },
    body1: {
      fontFamily: 'Satoshi',
      fontWeight: 400,
    },
    body2: {
      fontFamily: 'Satoshi',
      fontWeight: 400,
    },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#22C55E',
      light: '#4ADE80',
      dark: '#15803D',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#0F172A',
      light: '#334155',
      dark: '#020617',
      contrastText: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
    },
    background: {
      default: '#F3F6FB',
      paper: '#FFFFFF',
    },
    divider: '#E2E8F0',
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
          boxShadow: 'none',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiSelect: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: '1px solid #E2E8F0',
          boxShadow: '0 10px 30px rgba(2, 6, 23, 0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider
            maxSnack={1}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          />
          <CssBaseline />
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </ThemeProvider>
      </QueryClientProvider>
    </LocalizationProvider>
  );
}
