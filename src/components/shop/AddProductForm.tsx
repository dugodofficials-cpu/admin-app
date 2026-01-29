'use client';

import React from 'react';
import {
  Box,
  Button,
  MenuItem,
  Paper,
  TextField,
  Typography,
  FormHelperText,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SaveIcon from '@mui/icons-material/Save';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createProductSchema,
  CreateProductFormData,
} from '@/lib/validations/product';
import {
  CreateProductDto,
  ProductStatus,
  ProductType,
} from '@/lib/api/products';
import { useCreateProduct } from '@/hooks/products';
import { enqueueSnackbar } from 'notistack';
import { ROUTES } from '@/utils/paths';
import { productCategories } from '@/lib/utils/categories';

const shippingCategories = ['Small', 'Medium', 'Large', 'Extra Large'];
const sizes = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

export function AddProductForm() {
  const [images, setImages] = React.useState<File[]>([]);

  const { mutate: createProduct, isPending: isCreatingProduct } =
    useCreateProduct(ROUTES.DASHBOARD.SHOP.HOME);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: '',
      description: '',
      sizes: [],
      color: '',
      sku: '',
      price: '',
      stockQuantity: '',
      categories: [],
      status: ProductStatus.DRAFT,
      type: ProductType.PHYSICAL,
      images: [],
      tags: '',
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 4) {
      alert('You can only upload up to 4 images');
      return;
    }
    setImages(files);
  };

  const onSubmit = async (data: CreateProductFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => formData.append(key, item as string));
      } else {
        formData.append(key, value.toString());
      }
    });

    images.forEach((image) => {
      formData.append('image', image);
    });

    createProduct(formData as unknown as CreateProductDto, {
      onSuccess: () => {
        enqueueSnackbar('Product created successfully', { variant: 'success' });
        reset();
      },
      onError: (error) => {
        enqueueSnackbar(error.message, { variant: 'error' });
      },
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ maxWidth: 800 }}
    >
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: '1rem' }}
      >
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Item Name"
              error={!!errors.name}
              helperText={errors.name?.message}
              required
            />
          )}
        />

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
                <FormHelperText>{errors.categories.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />

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
            />
          )}
        />

        <Controller
          name="sizes"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.sizes} required>
              <InputLabel id="sizes-label">Size</InputLabel>
              <Select
                {...field}
                labelId="sizes-label"
                label="Sizes"
                multiple
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                input={<OutlinedInput label="Sizes" />}
              >
                {sizes.map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
              {errors.sizes && (
                <FormHelperText>{errors.sizes.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />

        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Color"
              error={!!errors.color}
              helperText={errors.color?.message}
              required
            />
          )}
        />

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

        <Controller
          name="stockQuantity"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Inventory Quantity"
              type="number"
              error={!!errors.stockQuantity}
              helperText={errors.stockQuantity?.message}
              required
            />
          )}
        />

        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              fullWidth
              label="Shipping Category"
              error={!!errors.tags}
              helperText={errors.tags?.message}
              required
            >
              {shippingCategories.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

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

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Cover Art Upload
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              bgcolor: 'grey.50',
            }}
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            <input
              type="file"
              id="image-upload"
              hidden
              multiple
              accept="image/jpeg,image/png"
              onChange={handleImageUpload}
            />
            <FileUploadIcon
              sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }}
            />
            <Typography>Upload image (.jpg, .png, less than 2MB)</Typography>
            {images.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="primary">
                  {images.length} image(s) selected
                </Typography>
              </Box>
            )}
            {errors.images && (
              <FormHelperText error>{errors.images.message}</FormHelperText>
            )}
          </Paper>
        </Box>

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isCreatingProduct}
          startIcon={<SaveIcon />}
          sx={{
            bgcolor: '#2FD65D',
            '&:hover': { bgcolor: '#2AC152' },
            color: 'white',
          }}
        >
          {isCreatingProduct ? 'Saving...' : 'Save Product'}
        </Button>
      </Box>
    </Box>
  );
}
