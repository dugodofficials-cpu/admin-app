'use client';

import { useCreateProduct, useGetAlbumCovers } from '@/hooks/products';
import {
  CreateProductDto,
  AlbumCover,
  ProductStatus,
  ProductType,
} from '@/lib/api/products';
import { singleFormSchema, type SingleFormData } from '@/lib/validations/music';
import { ROUTES } from '@/utils/paths';
import { zodResolver } from '@hookform/resolvers/zod';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function AddSinglePage() {
  const { data: albumCovers, isLoading: isLoadingAlbumCovers } =
    useGetAlbumCovers();
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<{
    cover?: File;
    audio?: File;
  }>({});

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SingleFormData>({
    resolver: zodResolver(singleFormSchema),
    defaultValues: {
      name: '',
      albumId: '',
      duration: '',
      sku: '',
      order: '',
      price: '',
      description: '',
      categories: '',
      tags: '',
      isActive: true,
    },
  });

  const { mutate: addSingleMutation, isPending } = useCreateProduct(
    ROUTES.DASHBOARD.MUSIC_MANAGER.HOME,
  );

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'cover' | 'audio',
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'audio') {
        setSelectedFileName(file.name);
        setUploadedFiles((prev) => ({ ...prev, audio: file }));
        setValue('audioFile', file.name);
      }
    }
  };

  const onSubmit = async (data: SingleFormData) => {
    console.log(data);
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          const stringValue =
            typeof value === 'boolean' ? value.toString() : value;
          formData.append(key, stringValue);
        }
      });

      if (uploadedFiles.audio) {
        formData.append('audio', uploadedFiles.audio);
      }
      if (uploadedFiles.cover) {
        formData.append('cover', uploadedFiles.cover);
      }

      formData.append('type', ProductType.DIGITAL);
      formData.append('status', ProductStatus.DRAFT);
      formData.append('albumPrice', '1000');
      formData.append(
        'album',
        albumCovers?.data?.find((cover) => cover.id === data.albumId)?.title ||
          '',
      );

      addSingleMutation(formData as unknown as CreateProductDto);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          mb: 4,
          flexDirection: 'column',
        }}
      >
        <Button
          component={Link}
          href={ROUTES.DASHBOARD.MUSIC_MANAGER.HOME}
          startIcon={<ArrowBackIcon />}
          sx={{ mr: 2 }}
        >
          Back to Songs
        </Button>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontFamily: 'ClashDisplay', fontWeight: 700 }}
        >
          Add Song
        </Typography>
      </Box>

      <Paper
        sx={{
          p: 4,
          maxWidth: 800,
          backgroundColor: '#F5F5F5',
          borderRadius: 2,
        }}
      >
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Single Title
          </Typography>
          <TextField
            fullWidth
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register('name')}
            sx={{ mb: 3 }}
          />

          <Typography variant="h6" sx={{ mb: 1 }}>
            Album
          </Typography>
          <TextField
            fullWidth
            select
            error={!!errors.albumId}
            helperText={errors.albumId?.message}
            {...register('albumId')}
            sx={{ mb: 3 }}
            disabled={isLoadingAlbumCovers}
          >
            <MenuItem value="" disabled={isLoadingAlbumCovers}>
              {isLoadingAlbumCovers ? 'Loading albums...' : 'Select an album'}
            </MenuItem>
            {albumCovers?.data?.map((cover: AlbumCover) => (
              <MenuItem key={cover.id} value={cover.id}>
                {cover.title}
              </MenuItem>
            ))}
          </TextField>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Order
          </Typography>
          <TextField
            fullWidth
            type="number"
            error={!!errors.order}
            helperText={errors.order?.message}
            {...register('order')}
            sx={{ mb: 3 }}
          />

          <Typography variant="h6" sx={{ mb: 1 }}>
            Duration
          </Typography>
          <TextField
            fullWidth
            placeholder="e.g., 03:54"
            error={!!errors.duration}
            helperText={errors.duration?.message}
            {...register('duration')}
            sx={{ mb: 3 }}
          />
          <Typography variant="h6" sx={{ mb: 1 }}>
            SKU
          </Typography>
          <TextField
            fullWidth
            placeholder="e.g., SKU123"
            error={!!errors.sku}
            helperText={errors.sku?.message}
            {...register('sku')}
            sx={{ mb: 3 }}
          />

          <Typography variant="h6" sx={{ mb: 1 }}>
            Genre
          </Typography>
          <TextField
            fullWidth
            placeholder="e.g., Afro-fusion, Hip-hop"
            error={!!errors.categories}
            helperText={errors.categories?.message}
            {...register('categories')}
            sx={{ mb: 3 }}
          />

          <Typography variant="h6" sx={{ mb: 1 }}>
            Price
          </Typography>
          <TextField
            fullWidth
            placeholder="e.g., ₦12,000"
            error={!!errors.price}
            helperText={errors.price?.message}
            {...register('price')}
            sx={{ mb: 3 }}
          />

          <Typography variant="h6" sx={{ mb: 1 }}>
            Feature Artist(s) (optional)
          </Typography>
          <TextField
            fullWidth
            placeholder="Ft. Maka, Oz, Sheva"
            error={!!errors.tags}
            helperText={errors.tags?.message}
            {...register('tags')}
            sx={{ mb: 3 }}
          />

          <Typography variant="h6" sx={{ mb: 1 }}>
            Description
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            error={!!errors.description}
            helperText={errors.description?.message}
            {...register('description')}
            sx={{ mb: 3 }}
          />

          <Typography variant="h6" sx={{ mb: 1 }}>
            Audio Upload (MP3, WAV, M4A, AAC, OGG)
          </Typography>
          <Box
            sx={{
              border: '2px dashed #ccc',
              borderRadius: 2,
              p: 3,
              mb: 3,
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': { borderColor: '#2FD65D' },
            }}
            onClick={() => document.getElementById('audio-upload')?.click()}
          >
            <IconButton size="large" sx={{ mb: 1 }}>
              <CloudUploadIcon />
            </IconButton>
            <Typography>
              {errors.audioFile ? (
                <span style={{ color: 'red' }}>{errors.audioFile.message}</span>
              ) : selectedFileName ? (
                <Box>
                  <Typography>Selected file:</Typography>
                  <Typography sx={{ color: '#2FD65D', fontWeight: 'medium' }}>
                    {selectedFileName}
                  </Typography>
                </Box>
              ) : (
                'Drop Audio files (MP3, WAV, M4A, AAC, OGG)'
              )}
            </Typography>
            <input
              id="audio-upload"
              type="file"
              accept="audio/mp3,audio/wav,audio/m4a,audio/aac,audio/ogg"
              hidden
              {...register('audioFile')}
              onChange={(e) => handleFileChange(e, 'audio')}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{
              bgcolor: '#2FD65D',
              color: 'white',
              '&:hover': { bgcolor: '#2AC152' },
              py: 1.5,
            }}
            disabled={isPending}
          >
            {isPending ? 'Saving...' : 'Save Song'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
