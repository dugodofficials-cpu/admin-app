'use client';

import { useRoles, useUsers } from '@/hooks/users';
import { User } from '@/lib/api/users';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  ButtonGroup,
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
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import { AssignRoleModal } from './AssignRoleModal';
import { RolesModal } from './RolesModal';

type SortField =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'createdAt'
  | 'totalOrdersCount';
type SortOrder = 'asc' | 'desc';
type StatusFilter = 'all' | 'active' | 'inactive';

interface Column {
  id:
    | 'index'
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'role'
    | 'status'
    | 'ordersCount'
    | 'createdAt'
    | 'actions';
  label: string;
  minWidth?: number;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  sortField?: SortField;
}

const columns: readonly Column[] = [
  { id: 'index', label: '#', minWidth: 50 },
  {
    id: 'firstName',
    label: 'First Name',
    minWidth: 60,
    sortable: true,
    sortField: 'firstName',
  },
  {
    id: 'lastName',
    label: 'Last Name',
    minWidth: 60,
    sortable: true,
    sortField: 'lastName',
  },
  {
    id: 'email',
    label: 'Email',
    minWidth: 200,
    sortable: true,
    sortField: 'email',
  },
  { id: 'role', label: 'Role', minWidth: 100 },
  { id: 'status', label: 'Status', minWidth: 100 },
  {
    id: 'ordersCount',
    label: 'Orders',
    minWidth: 80,
    align: 'center',
  },
  { id: 'actions', label: 'Actions', minWidth: 200 },
];

export function UserList() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const [rolesModalOpen, setRolesModalOpen] = useState(false);
  const [assignRoleModalOpen, setAssignRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { data: rolesData } = useRoles();
  const roles = rolesData?.data ?? [];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setPage(0);
  };

  const handleSearch = useCallback(() => {
    setPage(0);
    setSearchQuery(searchTerm);
  }, [searchTerm]);

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = (status?: StatusFilter) => {
    if (status) {
      setStatusFilter(status);
      setPage(0);
    }
    setFilterAnchorEl(null);
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

  const {
    data: usersData,
    isLoading,
    error,
  } = useUsers({
    page: page + 1,
    limit: rowsPerPage,
    search: searchQuery,
    status: statusFilter === 'all' ? undefined : statusFilter,
    sortBy: sortField,
    sortOrder: sortOrder,
  });

  const handleAction = (action: string, userId: string) => {
    switch (action) {
      case 'view':
        router.push(`/users/${userId}`);
        break;
      case 'assign role':
        const user = users.find((u) => u._id === userId);
        if (user) {
          setSelectedUser(user);
          setAssignRoleModalOpen(true);
        }
        break;
      case 'suspend':
      case 'reactivate':
        console.log(`${action} user:`, userId);
        break;
      default:
        break;
    }
  };

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
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton width={20} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={150} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={200} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={80} />
                    </TableCell>
                    <TableCell>
                      <Skeleton
                        variant="rectangular"
                        width={80}
                        height={24}
                        sx={{ borderRadius: '16px' }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton width={40} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={100} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={120} />
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
        Error loading users: {error.message}
      </Box>
    );
  }

  const users = usersData?.data ?? [];
  const total = usersData?.meta?.total ?? 0;

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
        <Box sx={{ display: 'flex', gap: 1, flex: 1 }}>
          <TextField
            fullWidth
            placeholder="Search by name or email"
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
        <Button
          variant="outlined"
          onClick={() => setRolesModalOpen(true)}
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
          Manage Roles
        </Button>
        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
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
          {['all', 'active', 'inactive'].map((status) => (
            <MenuItem
              key={status}
              onClick={() => handleFilterClose(status as StatusFilter)}
              selected={status === statusFilter}
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

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
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
                    {column.sortable && column.sortField ? (
                      <TableSortLabel
                        active={sortField === column.sortField}
                        direction={
                          sortField === column.sortField ? sortOrder : 'asc'
                        }
                        onClick={() => handleSort(column.sortField!)}
                        sx={{
                          color: '#fff',
                          '&.MuiTableSortLabel-root.Mui-active': {
                            color: '#fff',
                          },
                          '&.MuiTableSortLabel-root.Mui-active .MuiTableSortLabel-icon':
                            { color: '#fff' },
                          '&:hover': { color: '#fff' },
                        }}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user: User, index: number) => (
                <TableRow key={user._id} hover>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        roles
                          ?.find(
                            (role) => role.id === user.userRoles[0]?.roleId,
                          )
                          ?.name?.toLowerCase() || 'N/A'
                      }
                      size="small"
                      sx={{
                        backgroundColor:
                          roles
                            ?.find(
                              (role) => role.id === user.userRoles[0]?.roleId,
                            )
                            ?.name?.toLowerCase() === 'admin'
                            ? '#2FD65D'
                            : '#6B7280',
                        color: 'white',
                        textTransform: 'capitalize',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.status}
                      size="small"
                      sx={{
                        backgroundColor:
                          user.status === 'active'
                            ? '#2FD65D'
                            : user.status === 'suspended'
                            ? '#FFD700'
                            : '#FF6B6B',
                        color: '#000',
                        textTransform: 'capitalize',
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">{user.totalOrdersCount}</TableCell>
                  <TableCell>
                    <ButtonGroup size="small">
                      <Button
                        variant="contained"
                        onClick={() => handleAction('view', user._id)}
                        sx={{
                          bgcolor: '#2FD65D',
                          '&:hover': { bgcolor: '#28C054' },
                          fontSize: '12px',
                          px: 1,
                        }}
                      >
                        View
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => handleAction('assign role', user._id)}
                        sx={{
                          bgcolor: '#2FD65D',
                          '&:hover': { bgcolor: '#28C054' },
                          fontSize: '12px',
                          px: 1,
                        }}
                      >
                        Assign Role
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      No users found
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

      <RolesModal
        open={rolesModalOpen}
        onClose={() => setRolesModalOpen(false)}
      />
      <AssignRoleModal
        open={assignRoleModalOpen}
        onClose={() => setAssignRoleModalOpen(false)}
        user={selectedUser}
      />
    </Box>
  );
}
