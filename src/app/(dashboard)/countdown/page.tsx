'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Tab,
  Tabs,
  Typography,
  Alert,
  Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {
  CountdownForm,
  CountdownList,
  CountdownDisplay,
} from '@/components/countdown';
import { Countdown } from '@/components/countdown/types';
import {
  useActiveCountdown,
  useCountdowns,
  useDeleteCountdown,
} from '@/hooks/countdown';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`countdown-tabpanel-${index}`}
      aria-labelledby={`countdown-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `countdown-tab-${index}`,
    'aria-controls': `countdown-tabpanel-${index}`,
  };
}

export default function CountdownPage() {
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCountdown, setSelectedCountdown] = useState<Countdown | null>(
    null,
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const {
    data: activeCountdownData,
    isLoading: isActiveCountdownLoading,
    error: activeCountdownError,
  } = useActiveCountdown();
  const {
    data: countdownsData,
    isLoading: isCountdownsLoading,
    error: countdownsError,
  } = useCountdowns();
  const { mutate: deleteCountdown } = useDeleteCountdown();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddCountdown = () => {
    setSelectedCountdown(null);
    setIsAddDialogOpen(true);
  };

  const handleEditCountdown = (countdown: Countdown) => {
    setSelectedCountdown(countdown);
    setIsEditDialogOpen(true);
  };

  const handleViewCountdown = (countdown: Countdown) => {
    setSelectedCountdown(countdown);
    setIsViewDialogOpen(true);
  };

  const handleDeleteCountdown = (id: string) => {
    if (window.confirm('Are you sure you want to delete this countdown?')) {
      deleteCountdown(id, {
        onSuccess: () => {
          showSnackbar('Countdown deleted successfully', 'success');
        },
        onError: (error) => {
          showSnackbar(error.message || 'Failed to delete countdown', 'error');
        },
      });
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const showSnackbar = (
    message: string,
    severity: 'success' | 'error' | 'info' | 'warning',
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const countdowns = countdownsData?.data || [];
  const activeCountdowns = activeCountdownData?.data || null;
  const totalCountdowns = countdowns?.length || 0;

  if (countdownsError || activeCountdownError) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">
          Failed to load countdowns:{' '}
          {countdownsError?.message || activeCountdownError?.message}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontFamily: 'ClashDisplay', fontWeight: 700 }}
      >
        Event Countdown
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Create and manage countdown timers for your website launches and events.
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
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
            label="All Countdowns"
            {...a11yProps(0)}
            sx={{
              '&.Mui-selected': {
                color: '#2FD65D',
              },
            }}
          />
          <Tab
            label="Active Countdowns"
            {...a11yProps(1)}
            sx={{
              '&.Mui-selected': {
                color: '#2FD65D',
              },
            }}
          />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            color="text.primary"
            sx={{ fontFamily: 'ClashDisplay', fontWeight: 700 }}
          >
            Total countdowns: {totalCountdowns}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddCountdown}
            sx={{
              bgcolor: '#2FD65D',
              '&:hover': { bgcolor: '#2AC152' },
            }}
          >
            Add Countdown
          </Button>
        </Box>

        {isCountdownsLoading ? (
          <Typography>Loading countdowns...</Typography>
        ) : (
          <CountdownList
            countdowns={countdowns}
            page={page}
            rowsPerPage={rowsPerPage}
            onEditCountdown={handleEditCountdown}
            onDeleteCountdown={handleDeleteCountdown}
            onViewCountdown={handleViewCountdown}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            color="text.primary"
            sx={{ fontFamily: 'ClashDisplay', fontWeight: 700 }}
          >
            Active countdowns: {activeCountdowns ? 1 : 0}
          </Typography>
          {activeCountdowns === null && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddCountdown}
              sx={{
                bgcolor: '#2FD65D',
                '&:hover': { bgcolor: '#2AC152' },
              }}
            >
              Add Countdown
            </Button>
          )}
        </Box>

        {isActiveCountdownLoading ? (
          <Typography>Loading active countdowns...</Typography>
        ) : activeCountdowns === null || !activeCountdowns ? (
          <Typography color="text.secondary">
            No active countdowns found. Create one to get started!
          </Typography>
        ) : (
          <CountdownList
            countdowns={[activeCountdowns]}
            page={page}
            rowsPerPage={rowsPerPage}
            onEditCountdown={handleEditCountdown}
            onDeleteCountdown={handleDeleteCountdown}
            onViewCountdown={handleViewCountdown}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </TabPanel>

      <Dialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Countdown</DialogTitle>
        <DialogContent>
          <CountdownForm
            countdown={null}
            onCancel={() => setIsAddDialogOpen(false)}
            onSuccess={() => {
              setIsAddDialogOpen(false);
              showSnackbar('Countdown created successfully', 'success');
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Countdown</DialogTitle>
        <DialogContent>
          <CountdownForm
            countdown={selectedCountdown}
            onCancel={() => setIsEditDialogOpen(false)}
            onSuccess={() => {
              setIsEditDialogOpen(false);
              showSnackbar('Countdown updated successfully', 'success');
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          {selectedCountdown && (
            <CountdownDisplay
              countdown={selectedCountdown}
              onClose={() => setIsViewDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
