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
import { GameEditorForm } from '@/components/game/GameEditorForm';

function a11yProps(index: number) {
  return {
    id: `game-tab-${index}`,
    'aria-controls': `game-tabpanel-${index}`,
  };
}

export default function GameEditorPage() {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Game Editor Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage, edit, or replace the BlackBox game
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
          aria-label="game editor tabs"
          sx={{
            '& .MuiTab-root.Mui-selected': {
              color: '#2FD65D'
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#2FD65D'
            }
          }}
        >
          <Tab label="Game Type & Description" {...a11yProps(0)} />
          <Tab label="Clue Management" {...a11yProps(1)} />
          <Tab label="Unlock Conditions" {...a11yProps(2)} />
          <Tab label="Reward Items Management" {...a11yProps(3)} />
          <Tab label="Game Page Layout Editor" {...a11yProps(4)} />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <GameEditorForm />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Typography>Clue Management content</Typography>
      </TabPanel>

      <TabPanel value={value} index={2}>
        <Typography>Unlock Conditions content</Typography>
      </TabPanel>

      <TabPanel value={value} index={3}>
        <Typography>Reward Items Management content</Typography>
      </TabPanel>

      <TabPanel value={value} index={4}>
        <Typography>Game Page Layout Editor content</Typography>
      </TabPanel>
    </Container>
  );
} 