import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

export function GameEditorForm() {
  const [formData, setFormData] = useState({
    gameTitle: 'The BlackBox Game',
    gameType: '',
    gameDescription:
      'A site-wide hunt where clues are hidden in lyrics, merch, and visuals. First to unlock the box wins.',
    gameDuration: '72 hours',
    startDate: '',
    endDate: '',
  });

  const handleTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600 }}>
      <Typography variant="subtitle1" gutterBottom>
        Game Title
      </Typography>
      <TextField
        fullWidth
        name="gameTitle"
        value={formData.gameTitle}
        onChange={handleTextChange}
        sx={{ mb: 3 }}
      />

      <Typography variant="subtitle1" gutterBottom>
        Game Type
      </Typography>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <Select
          value={formData.gameType}
          onChange={handleSelectChange}
          name="gameType"
          displayEmpty
        >
          <MenuItem value="" disabled>
            Select type
          </MenuItem>
          <MenuItem value="treasure-hunt">Treasure Hunt</MenuItem>
          <MenuItem value="puzzle">Puzzle</MenuItem>
          <MenuItem value="quiz">Quiz</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="subtitle1" gutterBottom>
        Game Description
      </Typography>
      <TextField
        fullWidth
        name="gameDescription"
        value={formData.gameDescription}
        onChange={handleTextChange}
        multiline
        rows={4}
        sx={{ mb: 3 }}
      />

      <Typography variant="subtitle1" gutterBottom>
        Game Duration
      </Typography>
      <TextField
        fullWidth
        name="gameDuration"
        value={formData.gameDuration}
        onChange={handleTextChange}
        sx={{ mb: 3 }}
      />

      <Typography variant="subtitle1" gutterBottom>
        Game Start Date
      </Typography>
      <TextField
        fullWidth
        name="startDate"
        type="date"
        value={formData.startDate}
        onChange={handleTextChange}
        sx={{ mb: 3 }}
      />

      <Typography variant="subtitle1" gutterBottom>
        Game End Date
      </Typography>
      <TextField
        fullWidth
        name="endDate"
        type="date"
        value={formData.endDate}
        onChange={handleTextChange}
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
        Save Game Settings
      </Button>
    </Box>
  );
}
