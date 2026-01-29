import { Box, Typography, Paper } from '@mui/material';

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}

export const StatCard = ({ icon, value, label }: StatCardProps) => {
  return (
    <Paper
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        bgcolor: '#f9f9f9',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {icon}
        <Typography variant="h4" component="div" fontWeight="bold">
          {value}
        </Typography>
      </Box>
      <Typography color="text.secondary" variant="body2">
        {label}
      </Typography>
    </Paper>
  );
}; 