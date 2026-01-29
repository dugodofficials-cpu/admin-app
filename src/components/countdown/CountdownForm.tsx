'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid,
  Typography,
  Alert,
  SelectChangeEvent,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Countdown, CountdownStatus, CreateCountdownData } from './types';
import { useCreateCountdown, useUpdateCountdown } from '@/hooks/countdown';

interface CountdownFormProps {
  countdown?: Countdown | null;
  onCancel: () => void;
  onSuccess?: () => void;
}

export const CountdownForm = ({
  countdown,
  onCancel,
  onSuccess,
}: CountdownFormProps) => {
  const [formData, setFormData] = useState<CreateCountdownData>({
    title: '',
    description: '',
    launchDate: '',
    status: CountdownStatus.INACTIVE,
    isActive: false,
    showDays: true,
    showHours: true,
    showMinutes: true,
    showSeconds: true,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [launchDate, setLaunchDate] = useState<Date | null>(null);

  const createMutation = useCreateCountdown();
  const updateMutation = useUpdateCountdown();

  const isLoading = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (countdown) {
      setFormData({
        title: countdown.title,
        description: countdown.description || '',
        launchDate: countdown.launchDate,
        status: countdown.status,
        isActive: countdown.isActive,
        showDays: countdown.showDays,
        showHours: countdown.showHours,
        showMinutes: countdown.showMinutes,
        showSeconds: countdown.showSeconds,
        timezone:
          countdown.timezone ||
          Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      setLaunchDate(new Date(countdown.launchDate));
    }
  }, [countdown]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!launchDate) {
      newErrors.launchDate = 'Launch date is required';
    } else if (launchDate <= new Date()) {
      newErrors.launchDate = 'Launch date must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      launchDate: launchDate?.toISOString() || '',
    };

    try {
      if (countdown) {
        await updateMutation.mutateAsync({
          id: countdown.id,
          data: submitData,
        });
      } else {
        await createMutation.mutateAsync(submitData);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Error saving countdown:', error);
    }
  };

  const handleInputChange =
    (field: keyof CreateCountdownData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: '',
        }));
      }
    };

  const handleSwitchChange =
    (field: keyof CreateCountdownData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.checked,
      }));
    };

  const handleSelectChange =
    (field: keyof CreateCountdownData) => (e: SelectChangeEvent) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        {(createMutation.error || updateMutation.error) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {createMutation.error?.message || updateMutation.error?.message}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={handleInputChange('title')}
              error={!!errors.title}
              helperText={errors.title}
              required
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={handleInputChange('description')}
              multiline
              rows={3}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <DateTimePicker
              label="Launch Date"
              value={launchDate}
              onChange={(newValue) => {
                setLaunchDate(newValue as Date);
                if (errors.launchDate) {
                  setErrors((prev) => ({
                    ...prev,
                    launchDate: '',
                  }));
                }
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.launchDate,
                  helperText: errors.launchDate,
                  required: true,
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={handleSelectChange('status')}
                label="Status"
              >
                {Object.values(CountdownStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={12}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Display Options
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={handleSwitchChange('isActive')}
                />
              }
              label="Active"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.showDays}
                  onChange={handleSwitchChange('showDays')}
                />
              }
              label="Show Days"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.showHours}
                  onChange={handleSwitchChange('showHours')}
                />
              }
              label="Show Hours"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.showMinutes}
                  onChange={handleSwitchChange('showMinutes')}
                />
              }
              label="Show Minutes"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.showSeconds}
                  onChange={handleSwitchChange('showSeconds')}
                />
              }
              label="Show Seconds"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Timezone"
              value={formData.timezone}
              onChange={handleInputChange('timezone')}
              helperText="Leave empty to use browser timezone"
            />
          </Grid>
        </Grid>

        <Box
          sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}
        >
          <Button variant="outlined" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{
              bgcolor: '#2FD65D',
              '&:hover': { bgcolor: '#2AC152' },
            }}
          >
            {isLoading ? 'Saving...' : countdown ? 'Update' : 'Create'}
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};
