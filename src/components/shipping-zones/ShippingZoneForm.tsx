'use client';

import { useCountries } from '@/hooks/locations';
import {
  useCreateShippingZone,
  useUpdateShippingZone,
} from '@/hooks/shipping-zones';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
  CreateShippingZoneDto,
  ShippingZone,
  UpdateShippingZoneDto,
} from './types';

interface ShippingZoneFormProps {
  zone: ShippingZone | null;
  onCancel: () => void;
}

export function ShippingZoneForm({ zone, onCancel }: ShippingZoneFormProps) {
  const createShippingZone = useCreateShippingZone();
  const updateShippingZone = useUpdateShippingZone();
  const { data: countriesData } = useCountries();
  const countries = countriesData?.data.map((country) => country.name);

  const [formData, setFormData] = useState({
    name: '',
    countries: [] as string[],
    regions: [] as string[],
    rate: 0,
    isActive: true,
    postalCodes: [] as string[],
  });

  const [newPostalCode, setNewPostalCode] = useState('');

  useEffect(() => {
    if (zone) {
      setFormData({
        name: zone.name,
        countries: zone.countries.map((country) => country.name),
        regions: zone.regions || [],
        rate: zone.rate,
        postalCodes: zone.postalCodes || [],
        isActive: zone.isActive,
      });
    }
  }, [zone]);

  const handleInputChange = (field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddPostalCode = () => {
    if (newPostalCode.trim()) {
      setFormData((prev) => ({
        ...prev,
        postalCodes: [...prev.postalCodes, newPostalCode.trim()],
      }));
      setNewPostalCode('');
    }
  };

  const handleRemovePostalCode = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      postalCodes: prev.postalCodes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const shippingZoneData: CreateShippingZoneDto = {
      name: formData.name,
      countries:
        countriesData?.data
          .filter((country) => formData.countries.includes(country.name))
          ?.map((country) => country._id) || [],
      regions: formData.regions,
      rate: Number(formData.rate),
      postalCodes: formData.postalCodes,
    };

    if (zone) {
      updateShippingZone.mutate({
        id: zone._id,
        data: shippingZoneData as UpdateShippingZoneDto,
      });
    } else {
      createShippingZone.mutate(shippingZoneData);
    }
    onCancel();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid size={6}>
          <TextField
            fullWidth
            label="Zone Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
            placeholder="e.g., Nigeria - Standard, West Africa"
          />
        </Grid>
        <Grid size={6}>
          <TextField
            fullWidth
            label="Rate"
            value={formData.rate}
            onChange={(e) => handleInputChange('rate', e.target.value)}
            required
            placeholder="e.g., 1000"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Autocomplete
            multiple
            options={countries || []}
            value={formData.countries || []}
            onChange={(_, newValue) => handleInputChange('countries', newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Countries"
                placeholder="Select countries"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option}
                  size="small"
                  variant="outlined"
                />
              ))
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Autocomplete
            multiple
            options={formData.countries
              .map(
                (country) =>
                  countriesData?.data.find((c) => c.name === country)?.region ||
                  [],
              )
              .flat()}
            value={formData.regions || []}
            onChange={(_, newValue) => handleInputChange('regions', newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Regions"
                placeholder="Select regions"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={index + 1}
                  label={option}
                  size="small"
                  variant="outlined"
                />
              ))
            }
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                label="Add Postal Code"
                value={newPostalCode}
                onChange={(e) => setNewPostalCode(e.target.value)}
                placeholder="Enter postal code"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddPostalCode();
                  }
                }}
              />
              <Button
                variant="outlined"
                onClick={handleAddPostalCode}
                disabled={!newPostalCode.trim()}
                startIcon={<AddIcon />}
              >
                Add
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.postalCodes.map((postalCode, index) => (
                <Chip
                  key={`postal-${index}-${postalCode}`}
                  label={postalCode}
                  onDelete={() => handleRemovePostalCode(index)}
                  deleteIcon={<DeleteIcon />}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: '#2FD65D',
                    color: '#2FD65D',
                    '&:hover': {
                      bgcolor: '#2FD65D',
                      color: 'white',
                    },
                  }}
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
            label="Active Zone"
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
                formData.countries.length === 0 ||
                formData.regions.length === 0
              }
            >
              {zone ? 'Update Zone' : 'Create Zone'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
