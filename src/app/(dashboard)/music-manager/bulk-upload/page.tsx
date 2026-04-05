'use client';

import { useBulkUploadAlbumTracks, useGetAlbumCovers } from '@/hooks/products';
import { AlbumCover, BulkUploadAlbumTracksResponse, ProductStatus } from '@/lib/api/products';
import { ROUTES } from '@/utils/paths';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useMemo, useRef, useState } from 'react';

type BulkUploadForm = {
  albumId: string;
  price: string;
  albumPrice: string;
  categories: string;
  tags: string;
  skuPrefix: string;
  startOrder: string;
  status: ProductStatus;
  isActive: boolean;
  duration: string;
  description: string;
};

const initialFormState: BulkUploadForm = {
  albumId: '',
  price: '1000',
  albumPrice: '',
  categories: 'Music',
  tags: '',
  skuPrefix: '',
  startOrder: '1',
  status: ProductStatus.ACTIVE,
  isActive: true,
  duration: '',
  description: '',
};

type FileWithRelativePath = File & { webkitRelativePath?: string };

function getUploadFileName(file: File): string {
  const fileWithPath = file as FileWithRelativePath;
  return fileWithPath.webkitRelativePath || file.name;
}

function sortByRelativePath(files: File[]): File[] {
  return [...files].sort((a, b) => {
    const aPath = getUploadFileName(a);
    const bPath = getUploadFileName(b);
    return aPath.localeCompare(bPath, undefined, { numeric: true, sensitivity: 'base' });
  });
}

function formatDuration(seconds: number): string {
  const safeSeconds = Math.max(0, Math.round(seconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainingSeconds = safeSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }

  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function readAudioDuration(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    const audio = document.createElement('audio');
    const objectUrl = URL.createObjectURL(file);

    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
      audio.removeAttribute('src');
      audio.load();
    };

    const finish = (value: string | null) => {
      cleanup();
      resolve(value);
    };

    audio.preload = 'metadata';

    audio.onloadedmetadata = () => {
      if (!Number.isFinite(audio.duration) || audio.duration <= 0) {
        finish(null);
        return;
      }
      finish(formatDuration(audio.duration));
    };

    audio.onerror = () => finish(null);
    audio.src = objectUrl;
  });
}

export default function BulkUploadTracksPage() {
  const folderInputRef = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState<BulkUploadForm>(initialFormState);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedFolderName, setSelectedFolderName] = useState<string>('');
  const [uploadResult, setUploadResult] = useState<BulkUploadAlbumTracksResponse['data'] | null>(null);
  const [durationsByFile, setDurationsByFile] = useState<Record<string, string>>({});
  const [durationExtractionFailures, setDurationExtractionFailures] = useState<string[]>([]);
  const [isExtractingDurations, setIsExtractingDurations] = useState(false);

  const { data: albumCovers, isLoading: isLoadingAlbumCovers } = useGetAlbumCovers();
  const { mutateAsync: bulkUploadTracks, isPending } = useBulkUploadAlbumTracks();

  useEffect(() => {
    if (!folderInputRef.current) return;
    folderInputRef.current.setAttribute('webkitdirectory', '');
    folderInputRef.current.setAttribute('directory', '');
  }, []);

  const previewFiles = useMemo(() => selectedFiles.slice(0, 20), [selectedFiles]);

  const handleInputChange = <K extends keyof BulkUploadForm>(field: K, value: BulkUploadForm[K]) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFolderSelection = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(event.target.files || []);
    const audioFiles = picked.filter(file => file.type.startsWith('audio/'));
    setUploadResult(null);

    if (!audioFiles.length) {
      enqueueSnackbar('No audio files found in selected folder.', { variant: 'warning' });
      setSelectedFiles([]);
      setSelectedFolderName('');
      setDurationsByFile({});
      setDurationExtractionFailures([]);
      return;
    }

    const sortedFiles = sortByRelativePath(audioFiles);
    setSelectedFiles(sortedFiles);

    const firstPath = (sortedFiles[0] as FileWithRelativePath).webkitRelativePath || '';
    const folderName = firstPath.split('/')[0] || 'Selected files';
    setSelectedFolderName(folderName);

    setIsExtractingDurations(true);
    const extractedDurations: Record<string, string> = {};
    const failedFiles: string[] = [];

    for (const file of sortedFiles) {
      const detectedDuration = await readAudioDuration(file);
      const uploadName = getUploadFileName(file);
      if (detectedDuration) {
        extractedDurations[uploadName] = detectedDuration;
      } else {
        failedFiles.push(uploadName);
      }
    }

    setDurationsByFile(extractedDurations);
    setDurationExtractionFailures(failedFiles);
    setIsExtractingDurations(false);

    if (Object.keys(extractedDurations).length === 0) {
      enqueueSnackbar('Could not auto-detect durations. You can set a fallback duration manually.', {
        variant: 'warning',
      });
    }

    event.target.value = '';
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUploadResult(null);

    if (!form.albumId) {
      enqueueSnackbar('Please choose an album.', { variant: 'error' });
      return;
    }
    if (!selectedFiles.length) {
      enqueueSnackbar('Please select a folder with audio files.', { variant: 'error' });
      return;
    }

    const body = new FormData();
    body.append('albumId', form.albumId);
    body.append('price', form.price);
    body.append('albumPrice', form.albumPrice);
    body.append('categories', form.categories);
    body.append('tags', form.tags);
    body.append('skuPrefix', form.skuPrefix);
    body.append('startOrder', form.startOrder);
    body.append('status', form.status);
    body.append('isActive', String(form.isActive));
    body.append('duration', form.duration);
    body.append('description', form.description);
    if (Object.keys(durationsByFile).length > 0) {
      body.append('durationsByFile', JSON.stringify(durationsByFile));
    }

    selectedFiles.forEach(file => {
      body.append('audios', file, getUploadFileName(file));
    });

    const response = await bulkUploadTracks(body);
    setUploadResult(response.data);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1100 }}>
      <Box sx={{ mb: 3 }}>
        <Button
          component={Link}
          href={ROUTES.DASHBOARD.MUSIC_MANAGER.HOME}
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          Back to Songs
        </Button>
        <Typography variant="h4" component="h1" sx={{ fontFamily: 'ClashDisplay', fontWeight: 700 }}>
          Bulk Album Upload
        </Typography>
        <Typography color="text.secondary">
          Upload a full folder of tracks and create one song product per file automatically.
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box component="form" onSubmit={handleUpload} sx={{ display: 'grid', gap: 2 }}>
          <FormControl fullWidth disabled={isLoadingAlbumCovers}>
            <InputLabel id="album-select-label">Album</InputLabel>
            <Select
              labelId="album-select-label"
              label="Album"
              value={form.albumId}
              onChange={event => handleInputChange('albumId', event.target.value)}
              required
            >
              <MenuItem value="" disabled>
                {isLoadingAlbumCovers ? 'Loading albums...' : 'Select an album'}
              </MenuItem>
              {albumCovers?.data?.map((cover: AlbumCover) => (
                <MenuItem key={cover.id} value={cover.id}>
                  {cover.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' } }}>
            <TextField
              label="Track Price (NGN)"
              type="number"
              value={form.price}
              onChange={event => handleInputChange('price', event.target.value)}
              required
            />
            <TextField
              label="Album Price (NGN)"
              type="number"
              value={form.albumPrice}
              onChange={event => handleInputChange('albumPrice', event.target.value)}
              helperText="Optional; defaults to track price"
            />
            <TextField
              label="Starting Order"
              type="number"
              value={form.startOrder}
              onChange={event => handleInputChange('startOrder', event.target.value)}
            />
          </Box>

          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' } }}>
            <TextField
              label="Categories (comma-separated)"
              value={form.categories}
              onChange={event => handleInputChange('categories', event.target.value)}
              required
            />
            <TextField
              label="Tags (comma-separated)"
              value={form.tags}
              onChange={event => handleInputChange('tags', event.target.value)}
            />
            <TextField
              label="SKU Prefix"
              value={form.skuPrefix}
              onChange={event => handleInputChange('skuPrefix', event.target.value)}
              helperText="Optional"
            />
          </Box>

          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
            <FormControl fullWidth>
              <InputLabel id="status-select-label">Status</InputLabel>
              <Select
                labelId="status-select-label"
                label="Status"
                value={form.status}
                onChange={event => handleInputChange('status', event.target.value as ProductStatus)}
              >
                {Object.values(ProductStatus).map(status => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Duration (optional)"
              value={form.duration}
              onChange={event => handleInputChange('duration', event.target.value)}
              placeholder="e.g., 03:45"
              helperText="Fallback duration only; auto-detected durations are used when available"
            />
          </Box>

          <TextField
            label="Description Template (optional)"
            value={form.description}
            onChange={event => handleInputChange('description', event.target.value)}
            helperText="Used for every generated track when provided"
          />

          <FormControlLabel
            control={
              <Switch
                checked={form.isActive}
                onChange={event => handleInputChange('isActive', event.target.checked)}
              />
            }
            label="Set tracks as active"
          />

          <input
            ref={folderInputRef}
            type="file"
            accept="audio/*"
            multiple
            hidden
            onChange={handleFolderSelection}
          />

          <Box
            sx={{
              border: '2px dashed #d1d5db',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': { borderColor: '#2FD65D' },
            }}
            onClick={() => folderInputRef.current?.click()}
          >
            <CloudUploadIcon sx={{ fontSize: 32, mb: 1 }} />
            <Typography variant="subtitle1">Choose Album Folder</Typography>
            <Typography variant="body2" color="text.secondary">
              Select a directory containing your audio tracks.
            </Typography>
          </Box>

          {selectedFiles.length > 0 && (
            <Alert severity="info">
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Folder: {selectedFolderName || 'Selected'}
              </Typography>
              <Typography variant="body2">
                {selectedFiles.length} audio file(s) detected. Showing first {Math.min(20, selectedFiles.length)}:
              </Typography>
              {isExtractingDurations ? (
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  Extracting durations from audio metadata...
                </Typography>
              ) : (
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  Auto duration detected for {Object.keys(durationsByFile).length}/{selectedFiles.length} file(s).
                </Typography>
              )}
              {!isExtractingDurations && durationExtractionFailures.length > 0 && (
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  Could not detect duration for {durationExtractionFailures.length} file(s). Fallback duration will be used for them.
                </Typography>
              )}
              <Box component="ul" sx={{ mt: 1, mb: 0, pl: 3 }}>
                {previewFiles.map(file => (
                  <li key={`${file.name}-${file.size}`}>
                    <Typography variant="body2">{file.name}</Typography>
                  </li>
                ))}
              </Box>
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isPending || isExtractingDurations || !selectedFiles.length}
            sx={{
              bgcolor: '#2FD65D',
              '&:hover': { bgcolor: '#2AC152' },
              mt: 1,
            }}
          >
            {isExtractingDurations ? 'Processing Metadata...' : isPending ? 'Uploading Tracks...' : 'Upload Folder'}
          </Button>
        </Box>
      </Paper>

      {uploadResult && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Upload Summary
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {uploadResult.createdCount} created, {uploadResult.failedCount} failed, out of{' '}
            {uploadResult.totalReceived} file(s).
          </Typography>

          {uploadResult.failed.length > 0 && (
            <Alert severity="warning">
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                Failed files
              </Typography>
              <Box component="ul" sx={{ pl: 3, mb: 0 }}>
                {uploadResult.failed.map(item => (
                  <li key={`${item.fileName}-${item.reason}`}>
                    <Typography variant="body2">
                      {item.fileName}: {item.reason}
                    </Typography>
                  </li>
                ))}
              </Box>
            </Alert>
          )}
        </Paper>
      )}
    </Box>
  );
}
