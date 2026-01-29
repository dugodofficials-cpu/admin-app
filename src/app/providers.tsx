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
      main: '#2AC318',
      light: '#4FD840',
      dark: '#1E8911',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
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
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
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
