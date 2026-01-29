'use client';

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Typography,
  TablePagination,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Countdown, CountdownStatus } from './types';

interface CountdownListProps {
  countdowns: Countdown[];
  page: number;
  rowsPerPage: number;
  onEditCountdown: (countdown: Countdown) => void;
  onDeleteCountdown: (id: string) => void;
  onViewCountdown: (countdown: Countdown) => void;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CountdownList = ({
  countdowns,
  page,
  rowsPerPage,
  onEditCountdown,
  onDeleteCountdown,
  onViewCountdown,
  onPageChange,
  onRowsPerPageChange,
}: CountdownListProps) => {
  const getStatusColor = (status: CountdownStatus) => {
    switch (status) {
      case CountdownStatus.ACTIVE:
        return 'success';
      case CountdownStatus.INACTIVE:
        return 'warning';
      case CountdownStatus.EXPIRED:
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getTimeRemaining = (launchDate: string) => {
    const now = new Date();
    const launch = new Date(launchDate);
    const diff = launch.getTime() - now.getTime();

    if (diff <= 0) {
      return 'Expired';
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Launch Date</TableCell>
            <TableCell>Time Remaining</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Display Options</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {countdowns
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((countdown) => (
              <TableRow key={countdown.id} hover>
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="medium">
                      {countdown.title}
                    </Typography>
                    {countdown.description && (
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {countdown.description}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(countdown.launchDate)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    color={
                      new Date(countdown.launchDate) <= new Date()
                        ? 'error'
                        : 'text.primary'
                    }
                  >
                    {getTimeRemaining(countdown.launchDate)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={countdown.status}
                    color={
                      getStatusColor(countdown.status) as
                        | 'success'
                        | 'warning'
                        | 'error'
                        | 'default'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {countdown.showDays && (
                      <Chip label="D" size="small" variant="outlined" />
                    )}
                    {countdown.showHours && (
                      <Chip label="H" size="small" variant="outlined" />
                    )}
                    {countdown.showMinutes && (
                      <Chip label="M" size="small" variant="outlined" />
                    )}
                    {countdown.showSeconds && (
                      <Chip label="S" size="small" variant="outlined" />
                    )}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box
                    sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}
                  >
                    <Tooltip title="View">
                      <IconButton
                        size="small"
                        onClick={() => onViewCountdown(countdown)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => onEditCountdown(countdown)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => onDeleteCountdown(countdown.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={countdowns.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </TableContainer>
  );
};
