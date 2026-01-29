import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import React from 'react';
import { OrderStatus, PaymentStatus } from './types';

interface UpdateOrderModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    notes?: string;
  }) => void;
  currentStatus: OrderStatus;
  currentPaymentStatus: PaymentStatus;
  currentNotes?: string;
  isLoading?: boolean;
}

export function UpdateOrderModal({
  open,
  onClose,
  onSubmit,
  currentStatus,
  currentPaymentStatus,
  isLoading,
  currentNotes = '',
}: UpdateOrderModalProps) {
  const [status, setStatus] = React.useState<OrderStatus>(currentStatus);
  const [paymentStatus, setPaymentStatus] =
    React.useState<PaymentStatus>(currentPaymentStatus);
  const [notes, setNotes] = React.useState(currentNotes);

  React.useEffect(() => {
    if (open) {
      setStatus(currentStatus);
      setPaymentStatus(currentPaymentStatus);
      setNotes(currentNotes);
    }
  }, [open, currentStatus, currentPaymentStatus, currentNotes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      status,
      paymentStatus,
      notes,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Update Order</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Order Status</InputLabel>
              <Select
                value={status}
                label="Order Status"
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
              >
                {Object.values(OrderStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Payment Status</InputLabel>
              <Select
                value={paymentStatus}
                label="Payment Status"
                onChange={(e) =>
                  setPaymentStatus(e.target.value as PaymentStatus)
                }
              >
                {Object.values(PaymentStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
