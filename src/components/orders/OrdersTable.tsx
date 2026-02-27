'use client';

import { useBulkDeleteOrders, useGetOrder } from '@/hooks/order';
import {
  Box,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Button,
  Typography,
  Skeleton,
  TablePagination,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { Order, OrderItem, OrderStatus } from './types';
import dayjs from 'dayjs';

interface Column {
  id:
    | 'select'
    | 'expand'
    | 'index'
    | 'orderNumber'
    | 'user'
    | 'items'
    | 'status'
    | 'actions'
    | 'orderedAt';
  label: string;
  minWidth?: number;
  align?: 'left' | 'right' | 'center';
}

const columns: readonly Column[] = [
  { id: 'select', label: '', minWidth: 40 },
  { id: 'expand', label: '', minWidth: 50 },
  { id: 'index', label: '#', minWidth: 50 },
  { id: 'orderNumber', label: 'Order ID', minWidth: 100 },
  { id: 'user', label: 'User', minWidth: 150 },
  { id: 'items', label: 'Item', minWidth: 70 },
  { id: 'orderedAt', label: 'Ordered At', minWidth: 150 },
  { id: 'status', label: 'Status', minWidth: 100, align: 'left' },
  { id: 'actions', label: 'Action', minWidth: 80, align: 'left' },
];

const statusColors: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: '#FFB800',
  [OrderStatus.CONFIRMED]: '#2FD65D',
  [OrderStatus.PROCESSING]: '#2FD65D',
  [OrderStatus.SHIPPED]: '#2FD65D',
  [OrderStatus.DELIVERED]: '#2FD65D',
  [OrderStatus.CANCELLED]: '#FF0000',
  [OrderStatus.REFUNDED]: '#FF0000',
};

interface RowProps {
  order: Order;
  index: number;
  page: number;
  rowsPerPage: number;
  onViewOrder: (orderId: string) => void;
  selected: boolean;
  onToggleSelected: (orderId: string) => void;
}

function Row({ order, index, page, rowsPerPage, onViewOrder, selected, onToggleSelected }: RowProps) {
  const [open, setOpen] = useState(false);
  const orderUser = typeof order.user === 'object' && order.user !== null
    ? order.user
    : null;
  const userName = orderUser
    ? `${orderUser.firstName ?? ''} ${orderUser.lastName ?? ''}`.trim() || 'Unnamed user'
    : 'Unknown user';

  return (
    <>
      <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onClick={(e) => e.stopPropagation()}
            onChange={() => onToggleSelected(order._id)}
            size="small"
            sx={{ color: '#111' }}
          />
        </TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell onClick={() => onViewOrder(order._id)}>
          {page * rowsPerPage + index + 1}
        </TableCell>
        <TableCell onClick={() => onViewOrder(order._id)}>
          {order.orderNumber}
        </TableCell>
        <TableCell onClick={() => onViewOrder(order._id)}>
          {userName}
        </TableCell>
        <TableCell onClick={() => onViewOrder(order._id)}>
          {order.items.length} item{order.items.length > 1 ? 's' : ''}
        </TableCell>
        <TableCell onClick={() => onViewOrder(order._id)}>
          {dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}
        </TableCell>
        <TableCell onClick={() => onViewOrder(order._id)}>
          <Chip
            label={order.status}
            size="small"
            sx={{
              bgcolor: statusColors[order.status as OrderStatus],
              color: 'white',
            }}
          />
        </TableCell>
        <TableCell>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onViewOrder(order._id);
            }}
            sx={{
              bgcolor: '#2FD65D',
              color: 'white',
              '&:hover': { bgcolor: '#2AC152' },
            }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="h6" gutterBottom component="div">
                Order Items
              </Typography>
              <Table size="small" aria-label="order items">
                <TableHead>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Size/Color</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Total Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item: OrderItem) => {
                    return (
                      <TableRow key={item._id}>
                        <TableCell component="th" scope="row">
                          {item.product?.name}
                        </TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">
                          {item.selectedOptions?.length
                            ? item.selectedOptions.join(' / ')
                            : 'N/A'}
                        </TableCell>
                        <TableCell align="right">
                          ₦
                          {item.price.toLocaleString('en-NG', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell align="right">
                          ₦
                          {(item.quantity * item.price).toLocaleString(
                            'en-NG',
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            },
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      align="right"
                      sx={{ fontWeight: 'bold' }}
                    >
                      Shipping
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      ₦
                      {order.shippingCost.toLocaleString('en-NG', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      align="right"
                      sx={{ fontWeight: 'bold' }}
                    >
                      Discount
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      ₦
                      {order.discount.toLocaleString('en-NG', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      align="right"
                      sx={{ fontWeight: 'bold' }}
                    >
                      Total
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      ₦
                      {order.total.toLocaleString('en-NG', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export function OrdersTable({
  hideSearch = false,
  userId,
}: {
  hideSearch?: boolean;
  userId?: string;
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | undefined>(
    undefined,
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = (status?: OrderStatus) => {
    if (status) {
      setSelectedStatus(status === selectedStatus ? undefined : status);
      setPage(0);
    }
    setAnchorEl(null);
  };

  const handleViewOrder = (orderId: string) => {
    router.push(`/orders/${orderId}`);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearch = useCallback(() => {
    setSearchQuery(searchTerm);
    setPage(0);
  }, [searchTerm]);

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const {
    data: ordersData,
    isLoading,
    error,
  } = useGetOrder({
    page: page + 1,
    limit: rowsPerPage,
    search: searchQuery,
    status: selectedStatus,
    userId: userId,
  });

  if (isLoading) {
    return (
      <Box>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mb: 3,
            p: 2,
            bgcolor: 'white',
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
          }}
        >
          <Skeleton
            variant="rectangular"
            width="100%"
            height={44}
            sx={{ borderRadius: '8px' }}
          />
          <Skeleton
            variant="rectangular"
            width={120}
            height={44}
            sx={{ borderRadius: '8px' }}
          />
        </Box>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      sx={{
                        minWidth: column.minWidth,
                        bgcolor: 'black',
                        color: 'white',
                        '&.MuiTableCell-stickyHeader': {
                          bgcolor: 'black',
                        },
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton width={20} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={100} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={100} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={150} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={200} />
                    </TableCell>
                    <TableCell>
                      <Skeleton
                        variant="rectangular"
                        width={80}
                        height={24}
                        sx={{ borderRadius: '16px' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="circular" width={32} height={32} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ p: 2 }}>
            <Skeleton width={250} height={32} />
          </Box>
        </Paper>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ color: 'error.main', p: 2 }}>
        Error loading orders: {error.message}
      </Box>
    );
  }

  const orders = ordersData?.data ?? [];
  const total = ordersData?.meta.total ?? 0;
  const pageOrderIds = orders.map(o => o._id);

  const allSelectedOnPage = pageOrderIds.length > 0 && pageOrderIds.every(id => selectedOrderIds.has(id));
  const someSelectedOnPage = pageOrderIds.some(id => selectedOrderIds.has(id));

  const toggleSelected = (orderId: string) => {
    setSelectedOrderIds(prev => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  };

  const toggleSelectAllOnPage = () => {
    setSelectedOrderIds(prev => {
      const next = new Set(prev);
      if (allSelectedOnPage) {
        pageOrderIds.forEach(id => next.delete(id));
      } else {
        pageOrderIds.forEach(id => next.add(id));
      }
      return next;
    });
  };

  const selectedCount = selectedOrderIds.size;
  const { mutateAsync: bulkDelete, isPending: isBulkDeleting } = useBulkDeleteOrders();

  const openConfirm = () => {
    setConfirmText('');
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
    setConfirmText('');
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedOrderIds);
    await bulkDelete({
      orderIds: ids,
      notes: `Bulk deleted from admin UI`,
    });
    setSelectedOrderIds(new Set());
    closeConfirm();
  };

  return (
    <Box>
      {hideSearch ? null : (
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mb: 3,
            p: 2,
            bgcolor: 'white',
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
          }}
        >
          <Box sx={{ display: 'flex', gap: 1, flex: 1 }}>
            <TextField
              fullWidth
              placeholder="Search by Order ID / User / Item"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#6B7280' }} />
                  </InputAdornment>
                ),
                sx: {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E5E7EB',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E5E7EB',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E5E7EB',
                  },
                  borderRadius: '8px',
                  height: '44px',
                },
              }}
              sx={{
                maxWidth: '100%',
                flex: 1,
                '& .MuiInputBase-root': {
                  fontSize: '14px',
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{
                height: '44px',
                bgcolor: '#2FD65D',
                '&:hover': {
                  bgcolor: '#2AC152',
                },
                minWidth: '100px',
              }}
            >
              Search
            </Button>
          </Box>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon sx={{ color: '#6B7280' }} />}
            onClick={handleFilterClick}
            sx={{
              minWidth: 120,
              height: '44px',
              borderColor: '#E5E7EB',
              color: '#6B7280',
              textTransform: 'none',
              '&:hover': {
                borderColor: '#E5E7EB',
                bgcolor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            Filter by
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => handleFilterClose()}
            PaperProps={{
              sx: {
                mt: 1,
                boxShadow:
                  '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
                '& .MuiMenuItem-root': {
                  fontSize: '14px',
                  py: 1,
                },
              },
            }}
          >
            {Object.values(OrderStatus).map((status) => (
              <MenuItem
                key={status}
                onClick={() => handleFilterClose(status)}
                selected={status === selectedStatus}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: 'rgba(47, 214, 93, 0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(47, 214, 93, 0.2)',
                    },
                  },
                }}
              >
                {status}
              </MenuItem>
            ))}
          </Menu>

          <Button
            variant="outlined"
            disabled={selectedCount === 0 || isBulkDeleting}
            onClick={openConfirm}
            sx={{
              minWidth: 160,
              height: '44px',
              borderColor: '#E5E7EB',
              color: selectedCount === 0 ? '#9CA3AF' : '#EF4444',
              textTransform: 'none',
              '&:hover': {
                borderColor: '#E5E7EB',
                bgcolor: 'rgba(239, 68, 68, 0.08)',
              },
            }}
          >
            Delete selected ({selectedCount})
          </Button>
        </Box>
      )}

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: '40rem' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => {
                  if (column.id === 'select') {
                    return (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        padding="checkbox"
                        sx={{
                          minWidth: column.minWidth,
                          bgcolor: 'black',
                          color: 'white',
                          '&.MuiTableCell-stickyHeader': {
                            bgcolor: 'black',
                          },
                        }}
                      >
                        <Checkbox
                          checked={allSelectedOnPage}
                          indeterminate={!allSelectedOnPage && someSelectedOnPage}
                          onChange={toggleSelectAllOnPage}
                          size="small"
                          sx={{ color: 'white' }}
                        />
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      sx={{
                        minWidth: column.minWidth,
                        bgcolor: 'black',
                        color: 'white',
                        '&.MuiTableCell-stickyHeader': {
                          bgcolor: 'black',
                        },
                      }}
                    >
                      {column.label}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order: Order, index: number) => (
                <Row
                  key={order._id}
                  order={order}
                  index={index}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  onViewOrder={handleViewOrder}
                  selected={selectedOrderIds.has(order._id)}
                  onToggleSelected={toggleSelected}
                />
              ))}
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      No orders found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: '1px solid #E5E7EB',
            '& .MuiTablePagination-select': {
              fontSize: '14px',
            },
            '& .MuiTablePagination-displayedRows': {
              fontSize: '14px',
            },
          }}
        />
      </Paper>

      <Dialog open={confirmOpen} onClose={closeConfirm} maxWidth="sm" fullWidth>
        <DialogTitle>Delete selected orders</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            This will soft-delete {selectedCount} order(s). Type DELETE to confirm.
          </Typography>
          <TextField
            fullWidth
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirm} disabled={isBulkDeleting}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleBulkDelete}
            disabled={confirmText !== 'DELETE' || isBulkDeleting || selectedCount === 0}
            sx={{ bgcolor: '#EF4444', '&:hover': { bgcolor: '#DC2626' } }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
