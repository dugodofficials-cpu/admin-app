'use client';

import {
  useDeleteAlbumCover,
  useGetAlbumCovers,
  useUpdateAlbumCover,
  useUploadAlbumCover,
} from '@/hooks/products';
import { AlbumCover } from '@/lib/api/products';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { enqueueSnackbar } from 'notistack';
import { useDropzone } from 'react-dropzone';
import { useState } from 'react';

export default function AlbumCoversPage() {
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    open: boolean;
    imageId: string | null;
    imageTitle: string | null;
  }>({
    open: false,
    imageId: null,
    imageTitle: null,
  });

  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    imageId: string | null;
    title: string;
    description: string;
  }>({
    open: false,
    imageId: null,
    title: '',
    description: '',
  });

  const { mutate: uploadAlbumCover, isPending: isUploading } =
    useUploadAlbumCover();
  const { data: albumCovers, isLoading: isLoadingAlbumCovers } =
    useGetAlbumCovers();
  const { mutate: deleteAlbumCover, isPending: isDeletingAlbumCover } =
    useDeleteAlbumCover();
  const { mutate: updateAlbumCover, isPending: isUpdatingAlbumCover } =
    useUpdateAlbumCover();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: 1,
    multiple: false,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', file.name.split('.')[0]);

      uploadAlbumCover(formData);
    },
  });

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    enqueueSnackbar('Link copied to clipboard!', {
      variant: 'success',
    });
  };

  const handleDeleteClick = (id: string, title: string) => {
    setDeleteConfirmation({
      open: true,
      imageId: id,
      imageTitle: title,
    });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmation.imageId) {
      deleteAlbumCover(deleteConfirmation.imageId, {
        onSuccess: () => {
          enqueueSnackbar('Album cover deleted successfully', {
            variant: 'success',
          });
          setDeleteConfirmation({
            open: false,
            imageId: null,
            imageTitle: null,
          });
        },
        onError: () => {
          enqueueSnackbar('Failed to delete album cover', {
            variant: 'error',
          });
        },
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({
      open: false,
      imageId: null,
      imageTitle: null,
    });
  };

  const handleEditClick = (id: string, title: string, description: string) => {
    setEditDialog({
      open: true,
      imageId: id,
      title,
      description: description,
    });
  };

  const handleEditCancel = () => {
    setEditDialog({
      open: false,
      imageId: null,
      title: '',
      description: '',
    });
  };

  const handleEditSave = () => {
    if (editDialog.imageId && editDialog.title.trim()) {
      updateAlbumCover(
        {
          id: editDialog.imageId,
          data: {
            title: editDialog.title.trim(),
            description: editDialog.description.trim(),
          },
        },
        {
          onSuccess: () => {
            enqueueSnackbar('Album cover title updated successfully', {
              variant: 'success',
            });
            setEditDialog({
              open: false,
              imageId: null,
              title: '',
              description: '',
            });
          },
          onError: () => {
            enqueueSnackbar('Failed to update album cover title', {
              variant: 'error',
            });
          },
        },
      );
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
          href="/music-manager"
          startIcon={<ArrowBackIcon />}
          sx={{ mr: 2, mb: 2 }}
        >
          Back
        </Button>
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontFamily: 'ClashDisplay', fontWeight: 700 }}
          >
            Album Covers
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Upload and manage album cover images
          </Typography>
        </Box>
      </Box>

      <Paper
        {...getRootProps()}
        sx={{
          p: 6,
          mb: 4,
          textAlign: 'center',
          backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'divider',
          cursor: isUploading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          opacity: isUploading ? 0.7 : 1,
          '&:hover': {
            backgroundColor: isUploading ? 'background.paper' : 'action.hover',
            borderColor: isUploading ? 'divider' : 'primary.main',
          },
        }}
      >
        <input {...getInputProps()} disabled={isUploading} />
        <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {isUploading
            ? 'Uploading...'
            : isDragActive
            ? 'Drop the file here...'
            : 'Drag & drop album cover here'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          or click to select file
        </Typography>
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          Supported formats: JPEG, PNG, WebP
        </Typography>
      </Paper>

      {isUploading && (
        <Box sx={{ width: '100%', mb: 4 }}>
          <LinearProgress />
        </Box>
      )}

      <Grid container spacing={3} sx={{ mt: 4 }}>
        {isLoadingAlbumCovers ? (
          Array.from(new Array(4)).map((_, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card>
                <Box sx={{ height: 200, bgcolor: 'action.hover' }} />
                <CardContent>
                  <Box
                    sx={{ height: 20, width: '60%', bgcolor: 'action.hover' }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : albumCovers?.data?.length ? (
          albumCovers.data.map((image: AlbumCover) => (
            <Grid key={image.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={image.imageUrl}
                  alt={image.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ pb: 1.5 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      mb: 0.5,
                      color: '#000',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {image.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#666',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      minHeight: '2.5em',
                    }}
                  >
                    {image.description || 'No description'}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleCopyLink(image.imageUrl)}
                      title="Copy link"
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleEditClick(
                          image.id,
                          image.title,
                          image.description,
                        )
                      }
                      title="Edit title"
                      disabled={isUpdatingAlbumCover}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(image.id, image.title)}
                    title="Delete"
                    color="error"
                    disabled={isDeletingAlbumCover}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid size={{ xs: 12 }}>
            <Typography textAlign="center" color="text.secondary">
              No album covers uploaded yet
            </Typography>
          </Grid>
        )}
      </Grid>

      <Dialog
        open={deleteConfirmation.open}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Album Cover</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the album cover for &quot;
            {deleteConfirmation.imageTitle}&quot;? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} disabled={isDeletingAlbumCover}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={isDeletingAlbumCover}
          >
            {isDeletingAlbumCover ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editDialog.open}
        onClose={handleEditCancel}
        aria-labelledby="edit-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="edit-dialog-title">Edit Album Cover Title</DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            value={editDialog.title}
            onChange={(e) =>
              setEditDialog({ ...editDialog, title: e.target.value })
            }
            disabled={isUpdatingAlbumCover}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            multiline
            rows={3}
            fullWidth
            value={editDialog.description}
            onChange={(e) =>
              setEditDialog({ ...editDialog, description: e.target.value })
            }
            disabled={isUpdatingAlbumCover}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditCancel} disabled={isUpdatingAlbumCover}>
            Cancel
          </Button>
          <Button
            onClick={handleEditSave}
            variant="contained"
            disabled={isUpdatingAlbumCover || !editDialog.title.trim()}
          >
            {isUpdatingAlbumCover ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
