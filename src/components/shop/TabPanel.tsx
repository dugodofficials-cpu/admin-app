import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';

interface TabPanelProps {
  tabs: Array<{
    label: string;
    value: string;
  }>;
  value: string;
  onChange: (newValue: string) => void;
}

export function TabPanel({ tabs, value, onChange }: TabPanelProps) {
  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    onChange(newValue);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        TabIndicatorProps={{
          style: {
            backgroundColor: '#2FD65D',
          }
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            label={tab.label}
            value={tab.value}
            sx={{
              '&.Mui-selected': {
                color: '#2FD65D',
              }
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
} 