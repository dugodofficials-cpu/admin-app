'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip, Button } from '@mui/material';
import { Countdown, CountdownTimeRemaining } from './types';

interface CountdownDisplayProps {
  countdown: Countdown;
  onClose?: () => void;
}

export const CountdownDisplay = ({ countdown }: CountdownDisplayProps) => {
  const [timeRemaining, setTimeRemaining] = useState<CountdownTimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const launchDate = new Date(countdown.launchDate);
      const diff = launchDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          total: 0,
          isExpired: true,
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining({
        days,
        hours,
        minutes,
        seconds,
        total: diff,
        isExpired: false,
      });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [countdown.launchDate]);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        textAlign: 'center',
        minWidth: 80,
        background: 'linear-gradient(135deg, #2FD65D 0%, #2AC152 100%)',
        color: 'white',
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ fontFamily: 'ClashDisplay' }}
      >
        {value.toString().padStart(2, '0')}
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.9 }}>
        {label}
      </Typography>
    </Paper>
  );

  if (timeRemaining.isExpired) {
    return (
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          background:
            countdown.backgroundColor ||
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: countdown.textColor || 'white',
          position: 'relative',
        }}
      >
        {countdown.backgroundImage && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${countdown.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.3,
              zIndex: 0,
            }}
          />
        )}

        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontFamily: 'ClashDisplay',
              fontWeight: 700,
              mb: 2,
            }}
          >
            {countdown.title}
          </Typography>

          <Typography
            variant="h5"
            sx={{
              mb: 4,
              opacity: 0.9,
            }}
          >
            {countdown.customMessage || 'The countdown has ended!'}
          </Typography>

          {countdown.buttonText && (
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: countdown.buttonColor || '#2FD65D',
                color: countdown.buttonTextColor || 'white',
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                '&:hover': {
                  bgcolor: countdown.buttonColor || '#2AC152',
                },
              }}
            >
              {countdown.buttonText}
            </Button>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        background:
          countdown.backgroundColor ||
          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: countdown.textColor || 'white',
        position: 'relative',
      }}
    >
      {countdown.backgroundImage && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${countdown.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3,
            zIndex: 0,
          }}
        />
      )}

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          maxWidth: 800,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontFamily: 'ClashDisplay',
            fontWeight: 700,
            mb: 2,
          }}
        >
          {countdown.title}
        </Typography>

        {countdown.description && (
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              opacity: 0.9,
            }}
          >
            {countdown.description}
          </Typography>
        )}

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'center',
            mb: 4,
            flexWrap: 'wrap',
          }}
        >
          {countdown.showDays && (
            <TimeUnit value={timeRemaining.days} label="Days" />
          )}
          {countdown.showHours && (
            <TimeUnit value={timeRemaining.hours} label="Hours" />
          )}
          {countdown.showMinutes && (
            <TimeUnit value={timeRemaining.minutes} label="Minutes" />
          )}
          {countdown.showSeconds && (
            <TimeUnit value={timeRemaining.seconds} label="Seconds" />
          )}
        </Box>

        {countdown.customMessage && (
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              opacity: 0.9,
            }}
          >
            {countdown.customMessage}
          </Typography>
        )}

        {countdown.buttonText && (
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: countdown.buttonColor || '#2FD65D',
              color: countdown.buttonTextColor || 'white',
              px: 4,
              py: 2,
              fontSize: '1.1rem',
              '&:hover': {
                bgcolor: countdown.buttonColor || '#2AC152',
              },
            }}
          >
            {countdown.buttonText}
          </Button>
        )}

        <Box sx={{ mt: 3, display: 'flex', gap: 1, justifyContent: 'center' }}>
          <Chip
            label={`Status: ${countdown.status}`}
            color={countdown.isActive ? 'success' : 'default'}
            size="small"
          />
          {countdown.timezone && (
            <Chip
              label={`Timezone: ${countdown.timezone}`}
              variant="outlined"
              size="small"
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};
