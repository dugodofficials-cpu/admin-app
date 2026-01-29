import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { useCreateCoupon } from '@/hooks/coupons';
import { CreateCouponInput } from './types';

export default function AddCouponForm() {
  const createCouponMutation = useCreateCoupon();
  const [formData, setFormData] = useState<CreateCouponInput>({
    code: '',
    type: 'percentage',
    value: 0,
    startDate: '',
    endDate: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCouponMutation.mutateAsync({
      ...formData,
      value: Number(formData.value),
      minimumPurchase: Number(formData.minimumPurchase),
      maximumDiscount: Number(formData.maximumDiscount),
      usageLimit: Number(formData.usageLimit),
    });
    setFormData({
      code: '',
      type: 'percentage',
      value: 0,
      startDate: '',
      endDate: '',
    });
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
    <Box component="form" onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          name="code"
          label="Coupon Code"
          value={formData.code}
          onChange={handleChange}
          fullWidth
          required
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
              value="fixed_amount"
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
        <Box sx={{ display: 'flex', gap: 2 }}>
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
        </Box>
        <TextField
          name="minimumPurchase"
          label="Minimum Purchase Amount"
          type="number"
          value={formData.minimumPurchase || ''}
          onChange={handleChange}
          fullWidth
          InputProps={{
            startAdornment: <InputAdornment position="start">₦</InputAdornment>,
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
            startAdornment: <InputAdornment position="start">₦</InputAdornment>,
          }}
        />
        <TextField
          name="usageLimit"
          label="Usage Limit"
          type="number"
          value={formData.usageLimit || ''}
          onChange={handleChange}
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={createCouponMutation.isPending}
        >
          {createCouponMutation.isPending ? 'Creating...' : 'Create Coupon'}
        </Button>
      </Box>
    </Box>
  );
}
