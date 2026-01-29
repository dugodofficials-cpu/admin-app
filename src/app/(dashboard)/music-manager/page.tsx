'use client';

import { useProducts } from '@/hooks/products';
import { Product, ProductStatus, ProductType } from '@/lib/api/products';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Chip,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import Image from 'next/image';

interface Column {
  id:
    | 'name'
    | 'order'
    | 'album'
    | 'description'
    | 'duration'
    | 'categories'
    | 'price'
    | 'status'
    | 'albumCover';
  label: string;
  minWidth?: number;
  align?: 'left' | 'right' | 'center';
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Title', minWidth: 170 },
  { id: 'order', label: 'Order', minWidth: 100 },
  { id: 'album', label: 'Album', minWidth: 30 },
  { id: 'albumCover', label: 'Album Cover', minWidth: 100 },
  { id: 'description', label: 'Description', minWidth: 130 },
  { id: 'duration', label: 'Duration', minWidth: 100 },
  { id: 'categories', label: 'Genre', minWidth: 100 },
  { id: 'price', label: 'Price', minWidth: 100 },
  { id: 'status', label: 'Status', minWidth: 100 },
];

const getStatusColor = (status: ProductStatus) => {
  switch (status) {
    case ProductStatus.ACTIVE:
      return { bgcolor: '#E8F5E9', color: '#2E7D32' };
    case ProductStatus.DRAFT:
      return { bgcolor: '#E3F2FD', color: '#1565C0' };
    case ProductStatus.INACTIVE:
      return { bgcolor: '#FFEBEE', color: '#C62828' };
    default:
      return { bgcolor: 'transparent', color: 'text.primary' };
  }
};

export default function MusicManagerPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedStatus, setSelectedStatus] = useState<
    ProductStatus | undefined
  >(undefined);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = (status?: ProductStatus) => {
    if (status) {
      setSelectedStatus(status === selectedStatus ? undefined : status);
      setPage(0);
    }
    setAnchorEl(null);
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

  const handleRowClick = (productId: string) => {
    router.push(`/music-manager/${productId}`);
  };

  const {
    data: productsData,
    isLoading,
    isError,
  } = useProducts({
    page: page + 1,
    limit: rowsPerPage,
    search: searchQuery,
    status: selectedStatus,
    type: ProductType.DIGITAL,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  if (isLoading) {
    return (
      <Box sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Skeleton variant="circular" width={32} height={32} sx={{ mr: 2 }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width={200} height={32} />
            <Skeleton variant="text" width={300} height={24} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
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
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    <Skeleton variant="text" width={100} />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      <Skeleton variant="text" width={100} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }

  if (isError) {
    return <Box sx={{ p: 4, color: 'error.main' }}>Error loading products</Box>;
  }

  return (
    <Box sx={{ p: 4, overflow: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontFamily: 'ClashDisplay', fontWeight: 700 }}
            >
              Music Manager
            </Typography>
            <Typography color="text.secondary">
              Manage albums, singles, and track-level metadata for DuGod
              releases.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{ display: 'flex', justifyContent: 'flex-start', mb: 4, gap: 2 }}
      >
        <Button
          component={Link}
          href="/music-manager/add-single"
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            bgcolor: '#2FD65D',
            '&:hover': { bgcolor: '#2AC152' },
          }}
        >
          Add Single
        </Button>
        <Button
          component={Link}
          href="/music-manager/album-covers"
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            bgcolor: '#2FD65D',
            '&:hover': { bgcolor: '#2AC152' },
          }}
        >
          Manage Album Covers
        </Button>
      </Box>

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
            placeholder="Search by title, album, or description"
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
          {Object.values(ProductStatus).map((status) => (
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
      </Box>

      <Paper sx={{ width: '100%', overflow: 'auto' }}>
        <TableContainer sx={{ maxHeight: '40rem' }}>
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
              {productsData?.data?.map((product: Product) => (
                <TableRow
                  key={product._id}
                  hover
                  onClick={() => handleRowClick(product._id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.order}</TableCell>
                  <TableCell>{product.album}</TableCell>
                  <TableCell>
                    <Image
                      src={
                        product.albumId?.imageUrl ||
                        '/assets/product-placeholder.svg'
                      }
                      alt={product.albumId?.title || ''}
                      width={40}
                      height={40}
                      style={{ borderRadius: '50%' }}
                    />
                  </TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.duration}</TableCell>
                  <TableCell>{product.categories?.join(', ')}</TableCell>
                  <TableCell>₦{product.price?.toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={product.status}
                      size="small"
                      sx={getStatusColor(product.status)}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {(!productsData?.data || productsData.data.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      No products found
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
          count={productsData?.meta?.total || 0}
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
    </Box>
  );
}
