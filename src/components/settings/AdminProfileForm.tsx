import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

export function AdminProfileForm() {
  const [formData, setFormData] = useState({
    fullName: 'Mr. Ikenna',
    email: 'admin@dugod.com',
    role: 'Super Admin',
    contactNumber: '+234 802 000 1111',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600 }}>
      <Typography variant="subtitle1" gutterBottom>
        Full Name
      </Typography>
      <TextField
        fullWidth
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        sx={{ mb: 3 }}
      />

      <Typography variant="subtitle1" gutterBottom>
        Email
      </Typography>
      <TextField
        fullWidth
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        sx={{ mb: 3 }}
      />

      <Typography variant="subtitle1" gutterBottom>
        Role (readonly)
      </Typography>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <Select value={formData.role} disabled>
          <MenuItem value="Super Admin">Super Admin</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="subtitle1" gutterBottom>
        Contact Number
      </Typography>
      <TextField
        fullWidth
        name="contactNumber"
        value={formData.contactNumber}
        onChange={handleChange}
        sx={{ mb: 3 }}
      />

      <Button
        type="submit"
        variant="contained"
        startIcon={<SaveIcon />}
        fullWidth
        sx={{
          bgcolor: '#2FD65D',
          '&:hover': {
            bgcolor: '#2AC152',
          },
        }}
      >
        Save Admin Info
      </Button>
    </Box>
  );
}
