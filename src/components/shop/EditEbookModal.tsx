'use client';

import { Product, ProductStatus } from '@/lib/api/products';
import { productCategories } from '@/lib/utils/categories';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const ebookSchema = z.object({
  name: z.string().min(3, 'Ebook name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  sku: z.string().min(1, 'SKU is required'),
  price: z.string().min(1, 'Price is required'),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  status: z.nativeEnum(ProductStatus),
  tags: z.string().optional(),
  order: z.number().optional(),
});

type EditEbookFormData = z.infer<typeof ebookSchema>;

interface EditEbookModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (updatedProduct: Product) => void;
  isLoading: boolean;
}

export function EditEbookModal({
  open,
  onClose,
  product,
  onSave,
  isLoading,
}: EditEbookModalProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditEbookFormData>({
    resolver: zodResolver(ebookSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      sku: product?.sku || '',
      price: product?.price.toString() || '',
      categories: product?.categories || [],
      status: product?.status || ProductStatus.DRAFT,
      tags: product?.tags?.join(', ') || '',
      order: product?.order || 0,
    },
  });

  React.useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        sku: product.sku,
        price: product.price.toString(),
        categories: product.categories || [],
        status: product.status,
        tags: product.tags?.join(', ') || '',
        order: product.order || 0,
      });
    }
  }, [product, reset]);

  const onSubmit = (data: EditEbookFormData) => {
    if (product) {
      const tagsArray = data.tags
        ? data.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [];

      const updatedProduct = {
        ...product,
        ...data,
        price: Number(data.price),
        tags: tagsArray,
        bundleItems: undefined,
        bundlePrice: undefined,
        bundleTier: undefined,
      };

      onSave(updatedProduct as Product);
    }
    onClose();
  };

  if (!product) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Edit Ebook</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {product.images && product.images.length > 0 && (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Box sx={{ width: 100, height: 100, position: 'relative' }}>
                  <Image
                    src={product.images[0] || '/assets/product-placeholder.svg'}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  To update the ebook cover image, please use the Add Inventory
                  form.
                </Typography>
              </Box>
            )}

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Ebook Title"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      required
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="sku"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="SKU"
                      error={!!errors.sku}
                      helperText={errors.sku?.message}
                      required
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Price"
                      type="number"
                      InputProps={{
                        startAdornment: '₦',
                      }}
                      error={!!errors.price}
                      helperText={errors.price?.message}
                      required
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.status}>
                      <InputLabel>Status</InputLabel>
                      <Select {...field} label="Status">
                        {Object.values(ProductStatus).map((status) => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.status && (
                        <FormHelperText>{errors.status.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Controller
                  name="categories"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.categories} required>
                      <InputLabel id="categories-label">Categories</InputLabel>
                      <Select
                        {...field}
                        labelId="categories-label"
                        label="Categories"
                        multiple
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        input={<OutlinedInput label="Categories" />}
                      >
                        {productCategories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.categories && (
                        <FormHelperText>
                          {errors.categories.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Description"
                      multiline
                      rows={4}
                      error={!!errors.description}
                      helperText={errors.description?.message}
                      required
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Tags (comma-separated)"
                      placeholder="fiction, romance, thriller"
                      error={!!errors.tags}
                      helperText={errors.tags?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="order"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      label="Order"
                      type="number"
                      error={!!errors.order}
                      helperText={errors.order?.message}
                      inputProps={{ min: 0 }}
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value === '' ? undefined : Number(value),
                        );
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ bgcolor: '#2FD65D', '&:hover': { bgcolor: '#2AC152' } }}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
