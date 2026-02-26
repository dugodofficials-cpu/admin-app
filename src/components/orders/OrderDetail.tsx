'use client';

import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import { Carriers, Order } from './types';
import { useResendOrderConfirmation } from '@/hooks/order';

interface InfoRowProps {
  label: string;
  value: string | React.ReactNode;
}

interface OrderDetailProps {
  order: Order;
  onUpdateStatus: () => void;
  onUpdateTracking: () => void;
  onDeleteOrder: () => void;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography
        variant="body2"
        sx={{
          color: '#666',
          fontSize: '13px',
          mb: 0.75,
          fontWeight: 500,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          backgroundColor: '#fff',
          p: 2,
          borderRadius: '0.25rem',
          color: '#000',
          fontSize: '15px',
          fontWeight: 400,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export function OrderDetail({
  order,
  onUpdateStatus,
  onUpdateTracking,
  onDeleteOrder,
}: OrderDetailProps) {
  const { mutate: resendOrderConfirmation } = useResendOrderConfirmation(
    order._id,
  );
  const orderUser = typeof order.user === 'object' && order.user !== null
    ? order.user
    : null;
  const userName = orderUser
    ? `${orderUser.firstName ?? ''} ${orderUser.lastName ?? ''}`.trim() ||
      'Unnamed user'
    : 'Unknown user';
  const userEmail = orderUser?.email ?? 'Unknown email';
  const userPhone = orderUser?.phone ?? 'Unknown phone';
  const items = Array.isArray(order.items) ? order.items : [];
  const hasPhysicalItems = items.some(
    (item) => String(item.product?.type ?? '').toUpperCase() === 'PHYSICAL',
  );

  return (
    <Box sx={{ mx: 'auto', py: 3, px: 4 }}>
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ mb: 4, justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Typography
          variant="h6"
          sx={{ fontSize: '16px', fontWeight: 700, fontFamily: 'ClashDisplay' }}
        >
          Order Details
        </Typography>
        <Stack direction="row" spacing={1.5} alignItems="center">
          {hasPhysicalItems ? (
            <>
              <Button
                variant="outlined"
                onClick={onUpdateStatus}
                sx={{
                  color: '#000',
                  borderColor: '#E5E5E5',
                  textTransform: 'none',
                  fontWeight: 400,
                  py: 0.5,
                  minHeight: 0,
                  lineHeight: 1.5,
                  '&:hover': {
                    borderColor: '#000',
                    backgroundColor: 'transparent',
                  },
                }}
              >
                Update Order Status
              </Button>

              <Button
                variant="outlined"
                onClick={() => resendOrderConfirmation()}
                sx={{
                  color: '#000',
                  borderColor: '#E5E5E5',
                  textTransform: 'none',
                  fontSize: '13px',
                  fontWeight: 400,
                  py: 0.5,
                  minHeight: 0,
                  lineHeight: 1.5,
                  '&:hover': {
                    borderColor: '#000',
                    backgroundColor: 'transparent',
                  },
                }}
              >
                Resend Order Confirmation Email
              </Button>
              <Button
                variant="outlined"
                onClick={onUpdateTracking}
                sx={{
                  color: '#000',
                  borderColor: '#E5E5E5',
                  textTransform: 'none',
                  fontSize: '13px',
                  fontWeight: 400,
                  py: 0.5,
                  minHeight: 0,
                  lineHeight: 1.5,
                  '&:hover': {
                    borderColor: '#000',
                    backgroundColor: 'transparent',
                  },
                }}
              >
                Update Delivery Status
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={onDeleteOrder}
                sx={{
                  color: '#fff',
                  bgcolor: '#FF0000',
                  textTransform: 'none',
                  fontWeight: 400,
                  py: 0.5,
                  minHeight: 0,
                  lineHeight: 1.5,
                  '&:hover': {
                    backgroundColor: '#FF0000',
                  },
                }}
              >
                Delete Order
              </Button>
            </>
          ) : null}
        </Stack>
      </Stack>

      <Box sx={{ backgroundColor: '#F8F8F8', p: 4, borderRadius: '0.25rem' }}>
        <InfoRow label="Order ID" value={order.orderNumber} />
        <InfoRow
          label="User"
          value={userName}
        />
        <InfoRow label="Email" value={userEmail} />
        <InfoRow label="Phone" value={userPhone} />
        <InfoRow
          label="Date Ordered"
          value={new Date(order.orderedAt).toLocaleString()}
        />
        <InfoRow
          label="Item(s)"
          value={
            <Box>
              {items.map((item, index) => {
                const productName = item.product?.name ?? 'Unknown product';
                const unitPrice = Number(item.product?.price ?? item.price ?? 0);
                const totalPrice = Number(item.total ?? unitPrice * item.quantity);
                return (
                <Box
                  key={item._id || index}
                  sx={{
                    mb: index < items.length - 1 ? 1.5 : 0,
                    pb: index < items.length - 1 ? 1.5 : 0,
                    borderBottom:
                      index < items.length - 1
                        ? '1px solid #E5E5E5'
                        : 'none',
                  }}
                >
                  <Typography
                    sx={{
                      color: '#000',
                      fontSize: '15px',
                      fontWeight: 500,
                      mb: 0.5,
                    }}
                  >
                    {productName}
                  </Typography>
                  <Typography
                    sx={{
                      color: '#666',
                      fontSize: '13px',
                    }}
                  >
                    Quantity: {item.quantity} × ₦
                    {unitPrice.toLocaleString()} = ₦
                    {totalPrice.toLocaleString()}
                  </Typography>
                </Box>
              );
              })}
            </Box>
          }
        />
        <InfoRow
          label="Price Total"
          value={`₦${order.total.toLocaleString()}`}
        />
        <InfoRow
          label="Shipping Fee"
          value={`₦${order.shippingCost.toLocaleString()}`}
        />
        <InfoRow
          label="Order Status"
          value={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ color: '#000', fontSize: '15px' }}>
                {order.status.toUpperCase()}
              </Typography>
            </Box>
          }
        />
        <InfoRow
          label="Payment Status"
          value={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ color: '#000', fontSize: '15px' }}>
                {order.paymentStatus.toUpperCase()}
              </Typography>
            </Box>
          }
        />
        <InfoRow
          label="Notes"
          value={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ color: '#000', fontSize: '15px' }}>
                {order.notes}
              </Typography>
            </Box>
          }
        />
        <InfoRow
          label="Shipping Address"
          value={
            order.shippingDetails?.address
              ? `${order.shippingDetails.address.street}, ${order.shippingDetails.address.city}, ${order.shippingDetails.address.state}, ${order.shippingDetails.address.postalCode}`
              : 'N/A'
          }
        />
      </Box>
      {hasPhysicalItems ? (
        <>
          <Typography
            variant="h6"
            sx={{
              fontSize: '15px',
              fontWeight: 700,
              my: 2.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            🚚 Delivery & Fulfillment
          </Typography>
          <Box
            sx={{
              mt: 4,
              backgroundColor: '#F8F8F8',
              p: 4,
              borderRadius: '0.25rem',
            }}
          >
            <InfoRow
              label="Shipping Status"
              value={order.shippingDetails?.deliveryStatus
                ? order.shippingDetails.deliveryStatus.toUpperCase()
                : 'N/A'}
            />

            <InfoRow
              label="Tracking Number"
              value={order.shippingDetails?.trackingNumber ?? 'N/A'}
            />

            <Box sx={{ mb: 2.5 }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#666',
                  fontSize: '13px',
                  mb: 0.75,
                  fontWeight: 500,
                }}
              >
                Delivery Vendor
              </Typography>
              <RadioGroup
                value={order.shippingDetails?.carrier}
                name="delivery-vendor"
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  backgroundColor: '#fff',
                  p: 1,
                  borderRadius: '0.25rem',
                  gap: 1,
                  '& .MuiFormControlLabel-root': {
                    mb: 0.5,
                    '& .MuiTypography-root': {
                      fontSize: '14px',
                      color: '#000',
                    },
                  },
                }}
              >
                <FormControlLabel
                  value={Carriers.GIG}
                  control={
                    <Radio
                      size="small"
                      sx={{
                        color: '#E5E5E5',
                        '&.Mui-checked': {
                          color: '#000',
                        },
                      }}
                    />
                  }
                  label={Carriers.GIG}
                />
                <FormControlLabel
                  value={Carriers.SPEEDAF}
                  control={
                    <Radio
                      size="small"
                      sx={{
                        color: '#E5E5E5',
                        '&.Mui-checked': {
                          color: '#000',
                        },
                      }}
                    />
                  }
                  label={Carriers.SPEEDAF}
                />
                <FormControlLabel
                  value={Carriers.DHL}
                  control={
                    <Radio
                      size="small"
                      sx={{
                        color: '#E5E5E5',
                        '&.Mui-checked': {
                          color: '#000',
                        },
                      }}
                    />
                  }
                  label={Carriers.DHL}
                />
                <FormControlLabel
                  value={Carriers.CUSTOM}
                  control={
                    <Radio
                      size="small"
                      sx={{
                        color: '#E5E5E5',
                        '&.Mui-checked': {
                          color: '#000',
                        },
                      }}
                    />
                  }
                  label={Carriers.CUSTOM}
                />
              </RadioGroup>
            </Box>

            <InfoRow
              label="Expected Delivery"
              value={
                order.shippingDetails?.estimatedDeliveryDate
                  ? new Date(
                      order.shippingDetails.estimatedDeliveryDate,
                    ).toLocaleDateString()
                  : '3 - 5 Business Days'
              }
            />
          </Box>
        </>
      ) : null}
    </Box>
  );
}
