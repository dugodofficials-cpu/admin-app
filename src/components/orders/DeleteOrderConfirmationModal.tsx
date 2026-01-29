import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React from 'react';

interface DeleteOrderConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderNumber: string;
  isLoading?: boolean;
}

export function DeleteOrderConfirmationModal({
  open,
  onClose,
  onConfirm,
  orderNumber,
  isLoading = false,
}: DeleteOrderConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="delete-dialog-title">Delete Order</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          Are you sure you want to delete order &quot;{orderNumber}&quot;? This
          action cannot be undone and will permanently remove the order from the
          system.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={isLoading}
          sx={{
            borderColor: '#E5E7EB',
            color: '#6B7280',
            '&:hover': {
              borderColor: '#E5E7EB',
              bgcolor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          disabled={isLoading}
          autoFocus
          sx={{
            bgcolor: '#FF0000',
            '&:hover': {
              bgcolor: '#FF0000',
            },
          }}
        >
          {isLoading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
