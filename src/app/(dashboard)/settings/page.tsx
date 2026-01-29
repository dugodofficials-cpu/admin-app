'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Button,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { TabPanel } from '@/components/settings/TabPanel';
import { AdminProfileForm } from '@/components/settings/AdminProfileForm';

function a11yProps(index: number) {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  };
}

export default function AdminSettingsPage() {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Admin Profile Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage albums, singles, and track-level metadata for DuGod releases.
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            sx={{ mr: 2 }}
          >
            Export as CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            sx={{
              bgcolor: '#2FD65D',
              '&:hover': {
                bgcolor: '#2AC152'
              }
            }}
          >
            Download PDF
          </Button>
        </Box>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="settings tabs"
          sx={{
            '& .MuiTab-root.Mui-selected': {
              color: '#2FD65D'
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#2FD65D'
            }
          }}
        >
          <Tab label="Admin Profile Info" {...a11yProps(0)} />
          <Tab label="Platform Configurations" {...a11yProps(1)} />
          <Tab label="Email & Notification Settings" {...a11yProps(2)} />
          <Tab label="System Metadata" {...a11yProps(3)} />
          <Tab label="Security Controls" {...a11yProps(4)} />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <AdminProfileForm />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Typography>Platform Configurations content</Typography>
      </TabPanel>

      <TabPanel value={value} index={2}>
        <Typography>Email & Notification Settings content</Typography>
      </TabPanel>

      <TabPanel value={value} index={3}>
        <Typography>System Metadata content</Typography>
      </TabPanel>

      <TabPanel value={value} index={4}>
        <Typography>Security Controls content</Typography>
      </TabPanel>
    </Container>
  );
} 