'use client';

import {
  useDeleteProduct,
  useGetAlbumCovers,
  useProductById,
} from '@/hooks/products';
import { apiClient } from '@/lib/api/client';
import { ProductStatus, ProductType } from '@/lib/api/products';
import { ROUTES } from '@/utils/paths';
import { zodResolver } from '@hookform/resolvers/zod';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const editSongSchema = z.object({
  name: z.string().min(1, 'Song title is required'),
  album: z.string().min(1, 'Album is required'),
  description: z.string().min(1, 'Description is required'),
  duration: z.string().min(1, 'Duration is required'),
  price: z.number().min(0, 'Price must be a positive number'),
  categories: z.array(z.string()).min(1, 'At least one genre is required'),
  status: z.nativeEnum(ProductStatus),
  albumId: z.string().min(1, 'Album ID is required'),
  order: z
    .number()
    .min(0, 'Order must be a positive number')
    .default(0)
    .optional(),
  digitalDeliveryInfo: z.object({
    downloadUrl: z.string().min(1, 'Download URL is required'),
    fileSize: z.number().optional(),
    accessKey: z.string().optional(),
    expiryDays: z.number().optional(),
    maxDownloads: z.number().optional(),
  }),
});

type EditSongFormData = z.infer<typeof editSongSchema>;

export default function SongDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditingAlbum, setIsEditingAlbum] = useState(false);
  const { data: albumCovers, isLoading: isLoadingAlbumCovers } =
    useGetAlbumCovers();

  const { mutate: deleteProduct } = useDeleteProduct(
    ROUTES.DASHBOARD.MUSIC_MANAGER.HOME,
  );

  const {
    data: productData,
    isLoading,
    isError,
  } = useProductById(params.id as string);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<EditSongFormData>({
    resolver: zodResolver(editSongSchema),
  });

  const updateProductMutation = useMutation({
    mutationFn: (data: EditSongFormData) =>
      apiClient(`/products/${params.id}`, {
        method: 'PUT',
        body: {
          ...data,
          type: ProductType.DIGITAL as const,
        } as const,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', params.id] });
      enqueueSnackbar('Item updated successfully', { variant: 'success' });
      router.push(ROUTES.DASHBOARD.MUSIC_MANAGER.HOME);
    },
  });

  useEffect(() => {
    if (productData?.data) {
      const albumId = productData.data.albumId?.id || '';

      reset({
        name: productData.data.name,
        album: productData.data.album,
        description: productData.data.description,
        duration: productData.data.duration || '',
        price: productData.data.price,
        categories: productData.data.categories || [],
        status: productData.data.status,
        order: productData.data.order || 0,
        albumId,
        digitalDeliveryInfo: {
          downloadUrl: productData.data.digitalDeliveryInfo?.downloadUrl || '',
          fileSize: productData.data.digitalDeliveryInfo?.fileSize,
          accessKey: productData.data.digitalDeliveryInfo?.accessKey,
          expiryDays: productData.data.digitalDeliveryInfo?.expiryDays,
          maxDownloads: productData.data.digitalDeliveryInfo?.maxDownloads,
        },
      });
      setIsEditingAlbum(false);
    }
  }, [productData, albumCovers, reset]);

  const onSubmit = (data: EditSongFormData) => {
    updateProductMutation.mutate(data);
    setIsEditingAlbum(false);
  };

  const handleDelete = () => {
    deleteProduct(params.id as string);
    setIsDeleteDialogOpen(false);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 4, color: 'error.main' }}>
        Error loading product details
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 0,
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
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontFamily: 'ClashDisplay', fontWeight: 700 }}
            >
              Edit Song Details
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Update song information and metadata
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          color="error"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          Delete music
        </Button>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <TextField
                  fullWidth
                  label="Title"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  {...register('name')}
                />
                <TextField
                  fullWidth
                  label="Album"
                  error={!!errors.album}
                  helperText={errors.album?.message}
                  {...register('album')}
                />
              </Box>

              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                error={!!errors.description}
                helperText={errors.description?.message}
                {...register('description')}
              />

              {productData?.data.albumId && !isEditingAlbum ? (
                <Card
                  elevation={0}
                  sx={{
                    border: '1px solid #E5E5E5',
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                    backgroundColor: '#FAFAFA',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                      borderColor: '#D0D0D0',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 3, p: 2.5 }}>
                    <Box
                      sx={{
                        position: 'relative',
                        flexShrink: 0,
                        width: 160,
                        height: 160,
                        borderRadius: '0.5rem',
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={productData.data.albumId.imageUrl}
                        alt={productData.data.albumId.title}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                    <CardContent
                      sx={{
                        flex: 1,
                        py: 0,
                        px: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#666',
                            fontWeight: 500,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            fontSize: '11px',
                          }}
                        >
                          Selected Album
                        </Typography>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<EditIcon />}
                          onClick={() => setIsEditingAlbum(true)}
                          sx={{
                            textTransform: 'none',
                            fontSize: '13px',
                            py: 0.5,
                            px: 1.5,
                            borderColor: '#E5E5E5',
                            color: '#000',
                            '&:hover': {
                              borderColor: '#000',
                              backgroundColor: 'transparent',
                            },
                          }}
                        >
                          Change
                        </Button>
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          mb: 1.5,
                          color: '#000',
                          fontFamily: 'ClashDisplay',
                          fontSize: '18px',
                          lineHeight: 1.3,
                        }}
                      >
                        {productData.data.albumId.title}
                      </Typography>
                      {productData.data.albumId.description && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#666',
                            lineHeight: 1.6,
                            fontSize: '14px',
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {productData.data.albumId.description}
                        </Typography>
                      )}
                    </CardContent>
                  </Box>
                </Card>
              ) : (
                <FormControl fullWidth error={!!errors.albumId}>
                  <InputLabel>Album</InputLabel>
                  <Select
                    value={watch('albumId') ?? ''}
                    label="Album"
                    onChange={(e) => {
                      const albumId = e.target.value;
                      const selectedCover = albumCovers?.data?.find(
                        (cover) => cover.id === albumId,
                      );
                      if (selectedCover) {
                        setValue('albumId', albumId, { shouldValidate: true });
                      }
                    }}
                    disabled={isLoadingAlbumCovers}
                  >
                    {albumCovers?.data?.map((cover) => (
                      <MenuItem key={cover.id} value={cover.id}>
                        {cover.title}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.albumId && (
                    <FormHelperText>{errors.albumId.message}</FormHelperText>
                  )}
                  {!errors.albumId && (
                    <FormHelperText>
                      Select an album for this song
                    </FormHelperText>
                  )}
                </FormControl>
              )}

              <TextField
                fullWidth
                label="Download URL"
                error={!!errors.digitalDeliveryInfo?.downloadUrl}
                helperText={
                  errors.digitalDeliveryInfo?.downloadUrl?.message ||
                  'Enter the URL where the song can be downloaded'
                }
                {...register('digitalDeliveryInfo.downloadUrl')}
                placeholder="https://example.com/song.mp3"
              />

              <Box sx={{ display: 'flex', gap: 3 }}>
                <TextField
                  fullWidth
                  label="Duration"
                  placeholder="00:00"
                  error={!!errors.duration}
                  helperText={errors.duration?.message}
                  {...register('duration')}
                />
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  error={!!errors.price}
                  helperText={errors.price?.message}
                  {...register('price', { valueAsNumber: true })}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>₦</Typography>,
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 3 }}>
                <TextField
                  fullWidth
                  label="Genres"
                  error={!!errors.categories}
                  helperText={
                    errors.categories?.message || 'Separate genres with commas'
                  }
                  value={watch('categories')?.join(', ')}
                  onChange={(e) => {
                    const value = e.target.value;
                    const categories = value
                      .split(',')
                      .map((cat) => cat.trim())
                      .filter(Boolean);
                    setValue('categories', categories);
                  }}
                />
                <TextField
                  fullWidth
                  label="Order"
                  error={!!errors.order}
                  helperText={
                    errors.order?.message || 'Enter the order of the song'
                  }
                  value={watch('order') ?? 0}
                  onChange={(e) => {
                    setValue('order', parseInt(e.target.value) || 0);
                  }}
                  type="number"
                  inputProps={{ min: 1 }}
                />
                <TextField
                  fullWidth
                  select
                  label="Status"
                  error={!!errors.status}
                  helperText={errors.status?.message}
                  defaultValue={productData?.data.status}
                  value={watch('status') || ''}
                  {...register('status')}
                >
                  {Object.values(ProductStatus).map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'flex-end',
                  mt: 2,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() =>
                    router.push(ROUTES.DASHBOARD.MUSIC_MANAGER.HOME)
                  }
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    bgcolor: '#2FD65D',
                    '&:hover': { bgcolor: '#2AC152' },
                  }}
                  disabled={updateProductMutation.isPending}
                >
                  {updateProductMutation.isPending
                    ? 'Saving...'
                    : 'Save Changes'}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </form>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this music? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
