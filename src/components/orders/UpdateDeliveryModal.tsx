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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import React from 'react';
import { Carriers, DeliveryStatus } from './types';

interface UpdateDeliveryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    deliveryStatus: DeliveryStatus;
    trackingNumber?: string;
    carrier?: Carriers;
    estimatedDeliveryDate?: Date;
    deliveryNotes?: string;
  }) => void;
  currentDeliveryStatus: DeliveryStatus;
  currentTrackingNumber?: string;
  currentCarrier?: Carriers;
  currentEstimatedDeliveryDate?: Date;
  currentDeliveryNotes?: string;
  isLoading?: boolean;
}

export function UpdateDeliveryModal({
  open,
  onClose,
  onSubmit,
  currentDeliveryStatus,
  currentTrackingNumber = '',
  currentCarrier = Carriers.CUSTOM,
  currentEstimatedDeliveryDate,
  currentDeliveryNotes = '',
  isLoading,
}: UpdateDeliveryModalProps) {
  const [deliveryStatus, setDeliveryStatus] = React.useState<DeliveryStatus>(
    currentDeliveryStatus,
  );
  const [trackingNumber, setTrackingNumber] = React.useState(
    currentTrackingNumber,
  );
  const [carrier, setCarrier] = React.useState<Carriers>(currentCarrier);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = React.useState<any>(
    currentEstimatedDeliveryDate ? dayjs(currentEstimatedDeliveryDate) : null,
  );
  const [deliveryNotes, setDeliveryNotes] =
    React.useState(currentDeliveryNotes);

  React.useEffect(() => {
    if (open) {
      setDeliveryStatus(currentDeliveryStatus);
      setTrackingNumber(currentTrackingNumber);
      setCarrier(currentCarrier);
      setEstimatedDeliveryDate(
        currentEstimatedDeliveryDate
          ? dayjs(currentEstimatedDeliveryDate)
          : null,
      );
      setDeliveryNotes(currentDeliveryNotes);
    }
  }, [
    open,
    currentDeliveryStatus,
    currentTrackingNumber,
    currentCarrier,
    currentEstimatedDeliveryDate,
    currentDeliveryNotes,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      deliveryStatus,
      trackingNumber: trackingNumber || undefined,
      carrier: carrier || Carriers.CUSTOM,
      estimatedDeliveryDate: estimatedDeliveryDate?.toDate() || undefined,
      deliveryNotes: deliveryNotes || undefined,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Update Delivery Status</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Delivery Status</InputLabel>
              <Select
                value={deliveryStatus}
                label="Delivery Status"
                onChange={(e) =>
                  setDeliveryStatus(e.target.value as DeliveryStatus)
                }
              >
                {Object.values(DeliveryStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Tracking Number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />

            <FormControl fullWidth>
              <InputLabel>Carrier</InputLabel>
              <Select
                fullWidth
                label="Carrier"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value as Carriers)}
              >
                {Object.values(Carriers).map((carrier) => (
                  <MenuItem key={carrier} value={carrier}>
                    {carrier}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <DatePicker
              label="Estimated Delivery Date"
              value={estimatedDeliveryDate}
              onChange={(date) => setEstimatedDeliveryDate(date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />

            <TextField
              fullWidth
              label="Delivery Notes"
              multiline
              rows={4}
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
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
