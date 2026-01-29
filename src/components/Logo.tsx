import { Box } from '@mui/material';
import Image from 'next/image';

export const Logo = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '0.1rem',
        height: '100%',
      }}
    >
      <Image
        src={'/assets/logo.svg'}
        alt="DuGod Logo"
        width={100}
        height={32}
        style={{ objectFit: 'contain' }}
      />
      <span
        style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: '1rem',
          fontWeight: 'normal',
        }}
      >
        Admin
      </span>
    </Box>
  );
};
