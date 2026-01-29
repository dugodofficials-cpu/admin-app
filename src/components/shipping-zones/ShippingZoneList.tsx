'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Country } from '../locations/types';
import { ShippingZone } from './types';

interface ShippingZoneListProps {
  zones: ShippingZone[];
  page: number;
  rowsPerPage: number;
  onEditZone: (zone: ShippingZone) => void;
  onDeleteZone: (zoneId: string) => void;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ShippingZoneList({
  zones,
  page,
  rowsPerPage,
  onEditZone,
  onDeleteZone,
}: ShippingZoneListProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    zoneId: string,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedZoneId(zoneId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedZoneId(null);
  };

  const handleEdit = () => {
    const zone = zones.find((z) => z._id === selectedZoneId);
    if (zone) {
      onEditZone(zone);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedZoneId) {
      onDeleteZone(selectedZoneId);
    }
    handleMenuClose();
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? { bgcolor: '#E8F5E9', color: '#2E7D32' }
      : { bgcolor: '#FFEBEE', color: '#C62828' };
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'auto' }}>
      <TableContainer sx={{ maxHeight: '40rem' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ bgcolor: 'black', color: 'white', fontWeight: 600 }}
              >
                Zone Name
              </TableCell>
              <TableCell
                sx={{ bgcolor: 'black', color: 'white', fontWeight: 600 }}
              >
                Countries
              </TableCell>
              <TableCell
                sx={{ bgcolor: 'black', color: 'white', fontWeight: 600 }}
              >
                Regions
              </TableCell>
              <TableCell
                sx={{ bgcolor: 'black', color: 'white', fontWeight: 600 }}
              >
                Rate
              </TableCell>
              <TableCell
                sx={{ bgcolor: 'black', color: 'white', fontWeight: 600 }}
              >
                Status
              </TableCell>
              <TableCell
                sx={{ bgcolor: 'black', color: 'white', fontWeight: 600 }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {zones
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((zone) => (
                <TableRow key={zone._id} hover>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {zone.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {zone.countries.map((country: Country, index: number) => (
                        <Chip
                          key={index}
                          label={country.name}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {zone.regions?.map((region, index) => (
                        <Chip
                          key={index}
                          label={region}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                      }}
                    >
                      {zone.rate}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={zone.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      sx={getStatusColor(zone.isActive)}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={(event) => handleMenuClick(event, zone._id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            {zones.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    No shipping zones found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
          Edit Zone
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
          Delete Zone
        </MenuItem>
      </Menu>
    </Paper>
  );
}
