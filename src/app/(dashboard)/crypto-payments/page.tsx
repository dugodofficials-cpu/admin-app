'use client';

import { useProcessingCryptoPayments, useReviewCryptoPayment } from '@/hooks/payment';
import { PaymentStatus } from '@/components/orders/types';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Skeleton,
  Chip,
} from '@mui/material';
import dayjs from 'dayjs';

const statusColors: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: '#FFB800',
  [PaymentStatus.PROCESSING]: '#2FD65D',
  [PaymentStatus.COMPLETED]: '#2FD65D',
  [PaymentStatus.FAILED]: '#FF0000',
  [PaymentStatus.REFUNDED]: '#FF0000',
  [PaymentStatus.PARTIALLY_REFUNDED]: '#FF0000',
  [PaymentStatus.CANCELLED]: '#FF0000',
};

export default function CryptoPaymentsPage() {
  const { data, isLoading, error } = useProcessingCryptoPayments();
  const reviewMutation = useReviewCryptoPayment();

  const payments = data?.data ?? [];

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontFamily: 'ClashDisplay', fontWeight: 700 }}>
            Crypto Payments
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ m: 0 }}>
            Review and approve/reject submitted crypto TXIDs.
          </Typography>
        </Box>
      </Box>

      {isLoading ? (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {['Date', 'User', 'Order', 'Amount', 'Chain', 'Coin', 'Address', 'TXID', 'Status', 'Actions'].map((h) => (
                    <TableCell
                      key={h}
                      sx={{ bgcolor: 'black', color: 'white', '&.MuiTableCell-stickyHeader': { bgcolor: 'black' } }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {[...Array(5)].map((_, idx) => (
                  <TableRow key={idx}>
                    {[...Array(10)].map((__, c) => (
                      <TableCell key={c}>
                        <Skeleton width={c === 9 ? 120 : 80} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : error ? (
        <Box sx={{ color: 'error.main', p: 2 }}>Error loading crypto payments: {(error as Error).message}</Box>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: '40rem' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {['Date', 'User', 'Order', 'Amount', 'Chain', 'Coin', 'Address', 'TXID', 'Status', 'Actions'].map((h) => (
                    <TableCell
                      key={h}
                      sx={{ bgcolor: 'black', color: 'white', '&.MuiTableCell-stickyHeader': { bgcolor: 'black' } }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((p) => {
                  const chain = (p.metadata?.chain as string) || p.paymentDetails?.walletType || '';
                  const coin = (p.metadata?.coin as string) || p.paymentDetails?.cryptoCurrency || '';
                  const address = (p.metadata?.address as string) || p.paymentDetails?.cryptoAddress || '';
                  const txid = p.txid || p.paymentDetails?.transactionId || '';
                  const initiatedAt = p.initiatedAt || p.createdAt;
                  const userEmail = p.user?.email || 'Unknown';
                  const orderNumber = p.order?.orderNumber || p.order?._id || 'N/A';

                  return (
                    <TableRow key={p._id} hover>
                      <TableCell>{initiatedAt ? dayjs(initiatedAt).format('DD/MM/YYYY HH:mm') : '—'}</TableCell>
                      <TableCell>{userEmail}</TableCell>
                      <TableCell>{orderNumber}</TableCell>
                      <TableCell>
                        {p.currency} {Number(p.amount).toLocaleString()}
                      </TableCell>
                      <TableCell>{chain || '—'}</TableCell>
                      <TableCell>{coin || '—'}</TableCell>
                      <TableCell sx={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {address || '—'}
                      </TableCell>
                      <TableCell sx={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {txid || '—'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={p.status}
                          size="small"
                          sx={{ bgcolor: statusColors[p.status], color: 'white' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Button
                            variant="contained"
                            size="small"
                            disabled={reviewMutation.isPending}
                            onClick={() => {
                              reviewMutation.mutate({
                                paymentId: p._id,
                                dto: { status: PaymentStatus.COMPLETED },
                              });
                            }}
                            sx={{ bgcolor: '#2FD65D', '&:hover': { bgcolor: '#2AC152' } }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            disabled={reviewMutation.isPending}
                            onClick={() => {
                              reviewMutation.mutate({
                                paymentId: p._id,
                                dto: { status: PaymentStatus.FAILED },
                              });
                            }}
                            sx={{ borderColor: '#FF0000', color: '#FF0000', '&:hover': { borderColor: '#FF0000' } }}
                          >
                            Reject
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {payments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        No crypto payments awaiting review
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
}
