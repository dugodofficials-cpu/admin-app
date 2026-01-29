import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Coupon, CreateCouponInput } from './types';
import { useUpdateCoupon } from '@/hooks/coupons';
import { LoadingButton } from '@mui/lab';

interface EditCouponModalProps {
  coupon: Coupon | null;
  open: boolean;
  onClose: () => void;
}

export default function EditCouponModal({
  coupon,
  open,
  onClose,
}: EditCouponModalProps) {
  const theme = useTheme();
  const updateCouponMutation = useUpdateCoupon();
  const [formData, setFormData] = useState<CreateCouponInput>({
    code: '',
    type: 'percentage',
    value: 0,
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code,
        description: coupon.description,
        type: coupon.type,
        value: coupon.value,
        startDate: coupon.startDate.split('T')[0],
        endDate: coupon.endDate.split('T')[0],
        minimumPurchase: coupon.minimumPurchase,
        maximumDiscount: coupon.maximumDiscount,
        usageLimit: coupon.usageLimit,
      });
    }
  }, [coupon]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coupon) return;

    try {
      await updateCouponMutation.mutateAsync({
        _id: coupon._id,
        ...formData,
        value: Number(formData.value),
        minimumPurchase: Number(formData.minimumPurchase),
        maximumDiscount: Number(formData.maximumDiscount),
        usageLimit: Number(formData.usageLimit),
      });
      onClose();
    } catch {}
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" fontWeight="600">
            Edit Coupon
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Update the coupon details below
          </Typography>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ py: 3 }}>
          <Stack spacing={3}>
            {updateCouponMutation.isError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Failed to update coupon. Please try again.
              </Alert>
            )}

            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Basic Information
              </Typography>
              <Stack spacing={2}>
                <TextField
                  name="code"
                  label="Coupon Code"
                  value={formData.code}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    },
                  }}
                />
                <TextField
                  name="description"
                  label="Description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={2}
                />
              </Stack>
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Discount Details
              </Typography>
              <Stack spacing={2}>
                <FormControl>
                  <FormLabel>Discount Type</FormLabel>
                  <RadioGroup
                    row
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="percentage"
                      control={<Radio />}
                      label="Percentage"
                    />
                    <FormControlLabel
                      value="fixed"
                      control={<Radio />}
                      label="Fixed Amount"
                    />
                  </RadioGroup>
                </FormControl>
                <TextField
                  name="value"
                  label="Discount Value"
                  type="number"
                  value={formData.value}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {formData.type === 'percentage' ? '%' : '₦'}
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Validity Period
              </Typography>
              <Stack direction="row" spacing={2}>
                <TextField
                  name="startDate"
                  label="Start Date"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  name="endDate"
                  label="End Date"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Restrictions
              </Typography>
              <Stack spacing={2}>
                <TextField
                  name="minimumPurchase"
                  label="Minimum Purchase Amount"
                  type="number"
                  value={formData.minimumPurchase || ''}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₦</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  name="maximumDiscount"
                  label="Maximum Discount Amount"
                  type="number"
                  value={formData.maximumDiscount || ''}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₦</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  name="usageLimit"
                  label="Usage Limit"
                  type="number"
                  value={formData.usageLimit || ''}
                  onChange={handleChange}
                  fullWidth
                  helperText="Leave empty for unlimited usage"
                />
              </Stack>
            </Box>
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              borderRadius: 1,
              px: 3,
            }}
          >
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={updateCouponMutation.isPending}
            sx={{
              borderRadius: 1,
              px: 3,
            }}
          >
            Save Changes
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
