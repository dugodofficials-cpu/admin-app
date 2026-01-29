'use client';

import FilterListIcon from '@mui/icons-material/FilterList';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { EditProductModal } from './EditProductModal';
import { EditEbookModal } from './EditEbookModal';
import { Product, ProductStatus, ProductType } from '@/lib/api/products';
import {
  useDeleteProduct,
  useProducts,
  useUpdateProduct,
} from '@/hooks/products';
import { enqueueSnackbar } from 'notistack';
import { ROUTES } from '@/utils/paths';

type OrderStatus = ProductStatus | 'all';
type SortField = 'name' | 'price' | 'createdAt';
type SortOrder = 'asc' | 'desc';

export function InventoryList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<OrderStatus>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { mutate: deleteProductMutation, isPending: isDeletingProduct } =
    useDeleteProduct(ROUTES.DASHBOARD.SHOP.HOME);
  const { mutate: updateProductMutation, isPending: isUpdatingProduct } =
    useUpdateProduct();

  const { data, refetch } = useProducts({
    page: page + 1,
    type: ProductType.PHYSICAL,
    includeBundleItems: true,
    limit: rowsPerPage,
    search: searchTerm,
    status: filterCategory === 'all' ? undefined : filterCategory,
    sortBy: sortField,
    sortOrder: sortOrder,
  });

  const products = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (id: string) => {
    const product = products.find((p) => p._id === id);
    if (product) {
      setEditingProduct(product);
    }
  };

  const handleDeleteClick = (product: Product) => {
    setDeleteProduct(product);
  };

  const handleDeleteConfirm = async () => {
    if (deleteProduct) {
      try {
        deleteProductMutation(deleteProduct._id, {
          onSuccess: () => {
            enqueueSnackbar('Product deleted successfully', {
              variant: 'success',
            });
            refetch();
          },
          onError: (error: Error) => {
            enqueueSnackbar(error.message, { variant: 'error' });
          },
        });
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
    setDeleteProduct(null);
  };

  const handleDeleteCancel = () => {
    setDeleteProduct(null);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = (status?: OrderStatus) => {
    if (status) {
      setFilterCategory(status);
      setPage(0);
    }
    setAnchorEl(null);
  };

  const handleSearch = useCallback(() => {
    setPage(0);
  }, []);

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSaveEdit = (updatedProduct: Product) => {
    const {
      _id,
      images,
      name,
      price,
      order,
      stockQuantity,
      status,
      categories,
      sizes,
      bundleItems,
      bundlePrice,
      bundleTier,
      tags,
      description,
      sku,
    } = updatedProduct;
    updateProductMutation({
      id: _id,
      data: {
        images,
        name,
        price,
        order,
        stockQuantity,
        status,
        categories,
        sizes,
        bundleItems,
        bundlePrice,
        bundleTier,
        tags,
        description,
        sku,
      },
    });
    setEditingProduct(null);
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
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
            placeholder="Search by product name"
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
          {[
            'all',
            ProductStatus.ACTIVE,
            ProductStatus.INACTIVE,
            ProductStatus.DRAFT,
          ].map((status) => (
            <MenuItem
              key={status}
              onClick={() => handleFilterClose(status as OrderStatus)}
              selected={status === filterCategory}
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
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#000' }}>
              <TableCell sx={{ color: '#fff' }}>Product ID</TableCell>
              <TableCell sx={{ color: '#fff' }}>Order</TableCell>
              <TableCell sx={{ color: '#fff' }}>Product Image</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'createdAt'}
                  direction={sortField === 'createdAt' ? sortOrder : 'asc'}
                  onClick={() => handleSort('createdAt')}
                  sx={{
                    color: '#fff',
                    '&.MuiTableSortLabel-root.Mui-active': { color: '#fff' },
                    '&.MuiTableSortLabel-root.Mui-active .MuiTableSortLabel-icon':
                      { color: '#fff' },
                    '&:hover': { color: '#fff' },
                  }}
                >
                  Item Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'price'}
                  direction={sortField === 'price' ? sortOrder : 'asc'}
                  onClick={() => handleSort('price')}
                  sx={{
                    color: '#fff',
                    '&.MuiTableSortLabel-root.Mui-active': { color: '#fff' },
                    '&.MuiTableSortLabel-root.Mui-active .MuiTableSortLabel-icon':
                      { color: '#fff' },
                    '&:hover': { color: '#fff' },
                  }}
                >
                  Price
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'createdAt'}
                  direction={sortField === 'createdAt' ? sortOrder : 'asc'}
                  onClick={() => handleSort('createdAt')}
                  sx={{
                    color: '#fff',
                    '&.MuiTableSortLabel-root.Mui-active': { color: '#fff' },
                    '&.MuiTableSortLabel-root.Mui-active .MuiTableSortLabel-icon':
                      { color: '#fff' },
                    '&:hover': { color: '#fff' },
                  }}
                >
                  Created At
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: '#fff' }}>Category</TableCell>
              <TableCell sx={{ color: '#fff' }}>Status</TableCell>
              <TableCell sx={{ color: '#fff' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product._id}</TableCell>
                <TableCell>{product.order}</TableCell>
                <TableCell>
                  <Box sx={{ width: 60, height: 60, position: 'relative' }}>
                    <Image
                      src={
                        product.type === ProductType.EBOOK
                          ? product.ebookDeliveryInfo?.bookCoverArt ||
                            '/assets/product-placeholder.svg'
                          : product.images[0] ||
                            '/assets/product-placeholder.svg'
                      }
                      alt={product.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </Box>
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>₦{product.price.toLocaleString()}</TableCell>
                <TableCell>
                  {new Date(product.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{product.categories.join(', ')}</TableCell>
                <TableCell>
                  <Chip
                    label={product.status}
                    color={
                      product.status === ProductStatus.ACTIVE
                        ? 'success'
                        : 'warning'
                    }
                    sx={{
                      backgroundColor:
                        product.status === ProductStatus.ACTIVE
                          ? '#2FD65D'
                          : '#FFD700',
                      color: '#000',
                    }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEdit(product._id)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(product)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            '.MuiTablePagination-select': {
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
            },
          }}
        />
      </TableContainer>

      {editingProduct?.type === ProductType.EBOOK ? (
        <EditEbookModal
          open={editingProduct !== null}
          onClose={() => setEditingProduct(null)}
          product={editingProduct}
          onSave={handleSaveEdit}
          isLoading={isUpdatingProduct}
        />
      ) : (
        <EditProductModal
          open={editingProduct !== null}
          onClose={() => setEditingProduct(null)}
          product={editingProduct}
          onSave={handleSaveEdit}
          isLoading={isUpdatingProduct}
        />
      )}

      <Dialog
        open={deleteProduct !== null}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the product &ldquo;
            {deleteProduct?.name}&rdquo;? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleDeleteCancel}
            variant="outlined"
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
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={isDeletingProduct}
            autoFocus
          >
            {isDeletingProduct ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
