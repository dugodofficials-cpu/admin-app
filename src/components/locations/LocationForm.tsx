'use client';

import {
  Box,
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Switch,
  Chip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from 'react';
import { Country, CreateCountryDto } from './types';
import { useCreateCountry, useUpdateCountry } from '@/hooks/locations';

interface LocationFormProps {
  location: Country | null;
  onCancel: () => void;
}

export function LocationForm({ location, onCancel }: LocationFormProps) {
  const createCountry = useCreateCountry();
  const updateCountry = useUpdateCountry();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    phoneCode: '',
    currency: '',
    region: [] as string[],
    isActive: true,
  });

  const [newRegion, setNewRegion] = useState('');

  useEffect(() => {
    if (location) {
      setFormData({
        name: location.name,
        code: location.code,
        phoneCode: location.phoneCode || '',
        currency: location.currency || '',
        region: location.region || [],
        isActive: location.isActive,
      });
    }
  }, [location]);

  const handleInputChange = (field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const countryData: CreateCountryDto = {
      name: formData.name,
      code: formData.code,
      phoneCode: formData.phoneCode,
      currency: formData.currency,
      region: formData.region,
      isActive: formData.isActive,
    };

    if (location) {
      updateCountry.mutate({
        id: location._id,
        data: countryData,
      });
    } else {
      createCountry.mutate(countryData);
    }
    onCancel();
  };

  const handleAddRegion = () => {
    if (newRegion.trim()) {
      setFormData((prev) => ({
        ...prev,
        region: [...prev.region, newRegion.trim()],
      }));
      setNewRegion('');
    }
  };

  const handleRemoveRegion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      region: prev.region.filter((_, i) => i !== index),
    }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid size={12}>
          <TextField
            fullWidth
            label="Country Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
            placeholder="Enter country name"
          />
        </Grid>

        <Grid size={12}>
          <TextField
            fullWidth
            label="Code"
            value={formData.code}
            onChange={(e) => handleInputChange('code', e.target.value)}
            required
            placeholder="Enter country code (e.g., NG, US)"
            inputProps={{ maxLength: 3 }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Phone Code"
            value={formData.phoneCode}
            onChange={(e) => handleInputChange('phoneCode', e.target.value)}
            required
            placeholder="e.g., +234"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Currency"
            value={formData.currency}
            onChange={(e) => handleInputChange('currency', e.target.value)}
            required
            placeholder="e.g., NGN, USD"
            inputProps={{ maxLength: 3 }}
          />
        </Grid>

        <Grid size={12}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Regions/States
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                label="Add Region/State"
                value={newRegion}
                onChange={(e) => setNewRegion(e.target.value)}
                placeholder="Enter region or state name"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRegion();
                  }
                }}
              />
              <Button
                variant="outlined"
                onClick={handleAddRegion}
                disabled={!newRegion.trim()}
                startIcon={<AddIcon />}
              >
                Add
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.region.map((region, index) => (
                <Chip
                  key={index}
                  label={region}
                  onDelete={() => handleRemoveRegion(index)}
                  deleteIcon={<DeleteIcon />}
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        </Grid>

        <Grid size={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={(e) =>
                  handleInputChange('isActive', e.target.checked)
                }
              />
            }
            label="Active"
          />
        </Grid>

        <Grid size={12}>
          <Box
            sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}
          >
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: '#2FD65D',
                '&:hover': { bgcolor: '#2AC152' },
              }}
              disabled={
                !formData.name ||
                !formData.code ||
                !formData.phoneCode ||
                !formData.currency ||
                createCountry.isPending ||
                updateCountry.isPending
              }
            >
              {location ? 'Update' : 'Create'} Country
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
