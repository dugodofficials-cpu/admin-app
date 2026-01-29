import { useCoupons } from '@/hooks/coupons';
import { Edit as EditIcon } from '@mui/icons-material';
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { useState } from 'react';
import EditCouponModal from './EditCouponModal';
import { Coupon } from './types';

export default function CouponList() {
  const { data: coupons, isLoading } = useCoupons();
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Usage</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coupons?.data?.map((coupon) => (
              <TableRow key={coupon._id}>
                <TableCell>{coupon.code}</TableCell>
                <TableCell>{coupon.type}</TableCell>
                <TableCell>
                  {coupon.type === 'percentage'
                    ? `${coupon.value}%`
                    : `₦${coupon.value}`}
                </TableCell>
                <TableCell>
                  {format(new Date(coupon.startDate), 'PP')}
                </TableCell>
                <TableCell>{format(new Date(coupon.endDate), 'PP')}</TableCell>
                <TableCell>
                  {coupon.usageCount}
                  {coupon.usageLimit ? `/${coupon.usageLimit}` : ''}
                </TableCell>
                <TableCell>{coupon.status}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => setSelectedCoupon(coupon)}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <EditCouponModal
        coupon={selectedCoupon}
        open={!!selectedCoupon}
        onClose={() => setSelectedCoupon(null)}
      />
    </Box>
  );
}
