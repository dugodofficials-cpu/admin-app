'use client';

import { useState } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import { TabPanel } from '@/components/content/TabPanel';
import { HeroBannerForm } from '@/components/content/HeroBannerForm';
import WebIcon from '@mui/icons-material/Web';

function a11yProps(index: number) {
  return {
    id: `content-tab-${index}`,
    'aria-controls': `content-tabpanel-${index}`,
  };
}

export default function ContentManagerPage() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <WebIcon />
        <Typography variant="h4" component="h1">
          Content Manager
        </Typography>
      </Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Update banners, game metadata, events, and core website text.
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          TabIndicatorProps={{
            style: {
              backgroundColor: '#2FD65D',
            },
          }}
        >
          <Tab
            label="Hero Banner"
            {...a11yProps(0)}
            sx={{
              '&.Mui-selected': {
                color: '#2FD65D',
              },
            }}
          />
          <Tab
            label="BlackBox Game"
            {...a11yProps(1)}
            sx={{
              '&.Mui-selected': {
                color: '#2FD65D',
              },
            }}
          />
          <Tab
            label="Event Highlights"
            {...a11yProps(2)}
            sx={{
              '&.Mui-selected': {
                color: '#2FD65D',
              },
            }}
          />
          <Tab
            label="Footer & Legal"
            {...a11yProps(3)}
            sx={{
              '&.Mui-selected': {
                color: '#2FD65D',
              },
            }}
          />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <HeroBannerForm />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6">BlackBox Game</Typography>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6">Event Highlights</Typography>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Typography variant="h6">Footer & Legal</Typography>
      </TabPanel>
    </Box>
  );
}
