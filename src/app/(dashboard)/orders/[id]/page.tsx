'use client';

import React from 'react';
import { Box, Button, Skeleton, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { OrderDetail } from '@/components/orders/OrderDetail';
import { useParams, useRouter } from 'next/navigation';
import {
  useGetOrderDetail,
  useUpdateOrder,
  useUpdateDeliveryStatus,
  useDeleteOrder,
} from '@/hooks/order';
import {
  OrderStatus,
  PaymentStatus,
  DeliveryStatus,
} from '@/components/orders/types';
import { UpdateOrderModal } from '@/components/orders/UpdateOrderModal';
import { UpdateDeliveryModal } from '@/components/orders/UpdateDeliveryModal';
import { DeleteOrderConfirmationModal } from '@/components/orders/DeleteOrderConfirmationModal';

function OrderDetailSkeleton() {
  return (
    <Box sx={{ mx: 'auto', py: 3, px: 4 }}>
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ mb: 4, justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Skeleton width={120} height={32} />
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Skeleton width={140} height={32} />
          <Skeleton width={200} height={32} />
          <Skeleton width={160} height={32} />
          <Skeleton width={120} height={32} />
        </Stack>
      </Stack>

      <Box sx={{ backgroundColor: '#F8F8F8', p: 4, borderRadius: '0.25rem' }}>
        {[...Array(9)].map((_, index) => (
          <Box key={index} sx={{ mb: 2.5 }}>
            <Skeleton width={100} height={20} sx={{ mb: 1 }} />
            <Skeleton
              variant="rectangular"
              height={56}
              sx={{
                backgroundColor: '#fff',
                borderRadius: '0.25rem',
              }}
            />
          </Box>
        ))}

        <Box sx={{ mt: 4 }}>
          <Skeleton width={180} height={24} sx={{ mb: 2.5 }} />

          <Box sx={{ mb: 2.5 }}>
            <Skeleton width={120} height={20} sx={{ mb: 1 }} />
            <Skeleton width={200} height={40} />
          </Box>

          {[...Array(2)].map((_, index) => (
            <Box key={index} sx={{ mb: 2.5 }}>
              <Skeleton width={100} height={20} sx={{ mb: 1 }} />
              <Skeleton
                variant="rectangular"
                height={56}
                sx={{
                  backgroundColor: '#fff',
                  borderRadius: '0.25rem',
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default function OrderDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: orderDetail, isLoading } = useGetOrderDetail(id as string);
  const updateOrder = useUpdateOrder(id as string);
  const updateDeliveryStatus = useUpdateDeliveryStatus(id as string);
  const deleteOrder = useDeleteOrder(id as string);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = React.useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  if (isLoading || !orderDetail?.data) {
    return (
      <Box sx={{ p: 4 }}>
        <Skeleton width={120} height={40} sx={{ mb: 4 }} />
        <OrderDetailSkeleton />
      </Box>
    );
  }

  const handleUpdateStatus = () => {
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSubmit = async (data: {
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    notes?: string;
  }) => {
    await updateOrder.mutateAsync(data);
    setIsUpdateModalOpen(false);
  };

  const handleUpdateTracking = () => {
    setIsDeliveryModalOpen(true);
  };

  const handleDeliverySubmit = async (data: {
    deliveryStatus: DeliveryStatus;
    trackingNumber?: string;
    carrier?: string;
    estimatedDeliveryDate?: Date;
    deliveryNotes?: string;
  }) => {
    await updateDeliveryStatus.mutateAsync(data);
    setIsDeliveryModalOpen(false);
  };

  const handleDeleteOrder = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    await deleteOrder.mutateAsync();
    setIsDeleteModalOpen(false);
    router.push('/orders');
  };

  return (
    <Box sx={{ p: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => router.back()}
        sx={{ mb: 4 }}
      >
        Back to Orders
      </Button>

      <OrderDetail
        order={orderDetail.data}
        onUpdateStatus={handleUpdateStatus}
        onUpdateTracking={handleUpdateTracking}
        onDeleteOrder={handleDeleteOrder}
      />

      <UpdateOrderModal
        open={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSubmit={handleUpdateSubmit}
        isLoading={updateOrder.isPending}
        currentStatus={orderDetail.data.status}
        currentPaymentStatus={orderDetail.data.paymentStatus as PaymentStatus}
        currentNotes={orderDetail.data.notes}
      />

      <UpdateDeliveryModal
        open={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
        onSubmit={handleDeliverySubmit}
        isLoading={updateDeliveryStatus.isPending}
        currentDeliveryStatus={orderDetail.data.shippingDetails.deliveryStatus}
        currentTrackingNumber={orderDetail.data.shippingDetails.trackingNumber}
        currentCarrier={orderDetail.data.shippingDetails.carrier}
        currentEstimatedDeliveryDate={
          orderDetail.data.shippingDetails.estimatedDeliveryDate
        }
        currentDeliveryNotes={orderDetail.data.shippingDetails.deliveryNotes}
      />

      <DeleteOrderConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        orderNumber={orderDetail.data.orderNumber}
        isLoading={deleteOrder.isPending}
      />
    </Box>
  );
}
