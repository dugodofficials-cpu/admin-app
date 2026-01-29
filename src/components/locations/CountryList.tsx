'use client';

import { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Collapse,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Country } from './types';

interface CountryListProps {
  countries: Country[];
  onEditCountry: (country: Country) => void;
  onDeleteCountry: (countryId: string) => void;
}

interface Column {
  id:
    | 'expand'
    | 'index'
    | 'name'
    | 'code'
    | 'phoneCode'
    | 'currency'
    | 'status'
    | 'actions';
  label: string;
  minWidth?: number;
  align?: 'left' | 'right' | 'center';
}

const columns: readonly Column[] = [
  { id: 'expand', label: '', minWidth: 50 },
  { id: 'index', label: '#', minWidth: 50 },
  { id: 'name', label: 'Country Name', minWidth: 150 },
  { id: 'code', label: 'Code', minWidth: 80 },
  { id: 'phoneCode', label: 'Phone Code', minWidth: 100 },
  { id: 'currency', label: 'Currency', minWidth: 100 },
  { id: 'status', label: 'Status', minWidth: 100, align: 'left' },
  { id: 'actions', label: 'Actions', minWidth: 80, align: 'left' },
];

const getStatusColor = (isActive: boolean) => ({
  bgcolor: isActive ? '#2FD65D' : '#FF0000',
  color: 'white',
  fontWeight: 600,
});

interface RowProps {
  country: Country;
  index: number;
  page: number;
  rowsPerPage: number;
  onEditCountry: (country: Country) => void;
  onDeleteCountry: (countryId: string) => void;
}

function Row({
  country,
  index,
  page,
  rowsPerPage,
  onEditCountry,
  onDeleteCountry,
}: RowProps) {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEditCountry(country);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    onDeleteCountry(country._id);
    setDeleteDialogOpen(false);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };
  return (
    <>
      <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }}>
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
        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
        <TableCell>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {country.name}
          </Typography>
        </TableCell>
        <TableCell>
          <Chip
            label={country.code}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.75rem' }}
          />
        </TableCell>
        <TableCell>
          <Typography variant="body2" color="text.secondary">
            {country.phoneCode || '-'}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2" color="text.secondary">
            {country.currency || '-'}
          </Typography>
        </TableCell>
        <TableCell>
          <Chip
            label={country.isActive ? 'Active' : 'Inactive'}
            size="small"
            sx={getStatusColor(country.isActive)}
          />
        </TableCell>
        <TableCell>
          <IconButton
            size="small"
            onClick={handleMenuClick}
            sx={{
              bgcolor: '#2FD65D',
              color: 'white',
              '&:hover': { bgcolor: '#2AC152' },
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="h6" gutterBottom component="div">
                Regions/States ({country.region?.length || 0})
              </Typography>
              {country.region && country.region.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {country.region.map((region, regionIndex) => (
                    <Chip
                      key={regionIndex}
                      label={region}
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: '#2FD65D',
                        color: '#2FD65D',
                        '&:hover': {
                          bgcolor: '#2FD65D',
                          color: 'white',
                        },
                      }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No regions/states defined for this country.
                </Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
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
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1, fontSize: 20 }} />
          Edit Country
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
          Delete Country
        </MenuItem>
      </Menu>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete &quot;{country.name}&quot;? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            sx={{
              bgcolor: '#FF0000',
              '&:hover': { bgcolor: '#D32F2F' },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export function CountryList({
  countries,
  onEditCountry,
  onDeleteCountry,
}: CountryListProps) {
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: '40rem' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sx={{ bgcolor: 'black', color: 'white', fontWeight: 600 }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {countries.map((country, index) => (
              <Row
                key={country._id}
                country={country}
                index={index}
                page={0}
                rowsPerPage={10}
                onEditCountry={onEditCountry}
                onDeleteCountry={onDeleteCountry}
              />
            ))}
            {countries.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    No countries found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
