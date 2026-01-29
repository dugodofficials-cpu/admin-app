'use client';

import { useState } from 'react';
import { Box, TextField, Typography, Button, Paper } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SaveIcon from '@mui/icons-material/Save';
import ImageIcon from '@mui/icons-material/Image';

export function HeroBannerForm() {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    ctaButtonLabel: '',
    ctaButtonLink: '',
  });

  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setBackgroundImage(file);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
        <ImageIcon />
        <Typography variant="h6">Hero Banner Management</Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Whoever sees the contents of this box..."
          required
        />

        <TextField
          fullWidth
          label="Subtitle"
          name="subtitle"
          value={formData.subtitle}
          onChange={handleInputChange}
          placeholder="Can never leave the field."
          required
        />

        <TextField
          fullWidth
          label="CTA Button Label"
          name="ctaButtonLabel"
          value={formData.ctaButtonLabel}
          onChange={handleInputChange}
          placeholder="Sign Up to Enter the Field"
          required
        />

        <TextField
          fullWidth
          label="CTA Button Link"
          name="ctaButtonLink"
          value={formData.ctaButtonLink}
          onChange={handleInputChange}
          placeholder="/signup"
          required
        />

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Background Image
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              bgcolor: 'grey.50',
            }}
            onClick={() =>
              document.getElementById('banner-image-upload')?.click()
            }
          >
            <input
              type="file"
              id="banner-image-upload"
              hidden
              accept="image/jpeg,image/png"
              onChange={handleImageUpload}
            />
            <FileUploadIcon
              sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }}
            />
            <Typography>Upload JPG/PNG (Recommended size: 1600x900)</Typography>
            {backgroundImage && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="primary">
                  {backgroundImage.name}
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>

        <Button
          type="submit"
          variant="contained"
          size="large"
          startIcon={<SaveIcon />}
          sx={{
            bgcolor: '#2FD65D',
            '&:hover': { bgcolor: '#2AC152' },
            color: 'white',
          }}
        >
          Save Hero Banner
        </Button>
      </Box>
    </Box>
  );
}
