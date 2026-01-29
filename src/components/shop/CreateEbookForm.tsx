/* eslint-disable @next/next/no-img-element */
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
  Grid,
} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SaveIcon from '@mui/icons-material/Save';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  CreateProductDto,
  ProductStatus,
  ProductType,
} from '@/lib/api/products';
import { useCreateProduct } from '@/hooks/products';
import { enqueueSnackbar } from 'notistack';
import { ROUTES } from '@/utils/paths';
import { productCategories } from '@/lib/utils/categories';

const ebookSchema = z.object({
  name: z.string().min(3, 'Ebook name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  sku: z.string().min(1, 'SKU is required'),
  price: z.string().min(1, 'Price is required'),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  status: z.nativeEnum(ProductStatus),
  tags: z.string().optional(),
  images: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  order: z.number().optional(),
});

type EbookFormData = z.infer<typeof ebookSchema>;

export function CreateEbookForm() {
  const [coverImage, setCoverImage] = React.useState<File | null>(null);
  const [ebookFile, setEbookFile] = React.useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = React.useState<
    string | null
  >(null);

  const { mutate: createProduct, isPending: isCreatingProduct } =
    useCreateProduct(ROUTES.DASHBOARD.SHOP.HOME);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EbookFormData>({
    resolver: zodResolver(ebookSchema),
    defaultValues: {
      name: '',
      description: '',
      sku: '',
      price: '',
      categories: [],
      status: ProductStatus.DRAFT,
      images: [],
      tags: '',
      isActive: true,
    },
  });

  const handleCoverImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        enqueueSnackbar('Please upload an image file', { variant: 'error' });
        return;
      }
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEbookFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = [
        'application/pdf',
        'application/epub+zip',
        'application/x-mobipocket-ebook',
        'application/vnd.amazon.ebook',
      ];
      if (
        !validTypes.includes(file.type) &&
        !file.name.match(/\.(pdf|epub|mobi)$/i)
      ) {
        enqueueSnackbar('Please upload a valid ebook file (PDF, EPUB, MOBI)', {
          variant: 'error',
        });
        return;
      }
      setEbookFile(file);
    }
  };

  const onSubmit = async (data: EbookFormData) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === 'categories' && Array.isArray(value)) {
        value.forEach((item) => formData.append('categories', item));
      } else if (key === 'images' && Array.isArray(value)) {
        value.forEach((item) => formData.append('images', item));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    formData.append('type', ProductType.EBOOK);

    if (coverImage) {
      formData.append('bookCoverArt', coverImage);
      formData.append('images', coverImage);
    }

    if (ebookFile) {
      formData.append('downloadUrl', ebookFile);
    }

    createProduct(formData as unknown as CreateProductDto, {
      onSuccess: () => {
        enqueueSnackbar('Ebook created successfully', { variant: 'success' });
        reset();
        setCoverImage(null);
        setEbookFile(null);
        setCoverImagePreview(null);
      },
      onError: (error) => {
        enqueueSnackbar(error.message || 'Failed to create ebook', {
          variant: 'error',
        });
      },
    });
  };

  return (
    <Paper sx={{ p: 4, mt: 2 }}>
      <Typography
        variant="h5"
        component="h2"
        sx={{ mb: 3, fontFamily: 'ClashDisplay', fontWeight: 600 }}
      >
        Create Ebook Product
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ maxWidth: 800 }}
      >
        <Box
          sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: '1rem' }}
        >
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
              <Typography variant="subtitle1" gutterBottom>
                Book Cover Art
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  bgcolor: 'grey.50',
                  minHeight: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={() =>
                  document.getElementById('cover-image-upload')?.click()
                }
              >
                <input
                  type="file"
                  id="cover-image-upload"
                  hidden
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleCoverImageUpload}
                />
                {coverImagePreview ? (
                  <Box sx={{ width: '100%', mb: 2 }}>
                    <img
                      src={coverImagePreview}
                      alt="Cover preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: 300,
                        objectFit: 'contain',
                      }}
                    />
                  </Box>
                ) : (
                  <>
                    <FileUploadIcon
                      sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }}
                    />
                    <Typography>Upload cover image (.jpg, .png)</Typography>
                  </>
                )}
                {coverImage && (
                  <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                    {coverImage.name}
                  </Typography>
                )}
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" gutterBottom>
                Ebook File (PDF, EPUB, MOBI)
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  bgcolor: 'grey.50',
                  minHeight: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={() =>
                  document.getElementById('ebook-file-upload')?.click()
                }
              >
                <input
                  type="file"
                  id="ebook-file-upload"
                  hidden
                  accept=".pdf,.epub,.mobi,application/pdf,application/epub+zip,application/x-mobipocket-ebook,application/vnd.amazon.ebook"
                  onChange={handleEbookFileUpload}
                />
                <FileUploadIcon
                  sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }}
                />
                <Typography>Upload ebook file</Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  PDF, EPUB, or MOBI format
                </Typography>
                {ebookFile && (
                  <Typography variant="body2" color="primary" sx={{ mt: 2 }}>
                    {ebookFile.name} (
                    {(ebookFile.size / 1024 / 1024).toFixed(2)} MB)
                  </Typography>
                )}
              </Paper>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isCreatingProduct || !coverImage || !ebookFile}
                startIcon={<SaveIcon />}
                sx={{
                  bgcolor: '#2FD65D',
                  '&:hover': { bgcolor: '#2AC152' },
                  color: 'white',
                }}
              >
                {isCreatingProduct ? 'Creating Ebook...' : 'Create Ebook'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Paper>
  );
}
