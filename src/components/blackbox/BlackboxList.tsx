'use client';

import {
  useBlackboxQuestions,
  useDeleteBlackboxQuestion,
  useReorderBlackboxQuestions,
} from '@/hooks/blackbox';
import { BlackboxQuestion } from '@/lib/api/blackbox';
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
  IconButton,
  Tooltip,
  Switch,
  Link,
} from '@mui/material';
import React, { useCallback, useState } from 'react';
import { CreateQuestionModal } from './CreateQuestionModal';
import { EditQuestionModal } from './EditQuestionModal';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReorderIcon from '@mui/icons-material/Reorder';
import { ROUTES } from '@/utils/paths';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

type SortField = 'question' | 'order' | 'isActive' | 'createdAt';
type SortOrder = 'asc' | 'desc';
type StatusFilter = 'all' | 'active' | 'inactive';

interface Column {
  id:
    | 'index'
    | 'order'
    | 'question'
    | 'answer'
    | 'isActive'
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
    id: 'order',
    label: 'Order',
    minWidth: 80,
    align: 'center',
    sortable: true,
    sortField: 'order',
  },
  {
    id: 'question',
    label: 'Question',
    minWidth: 300,
    sortable: true,
    sortField: 'question',
  },
  {
    id: 'answer',
    label: 'Answer',
    minWidth: 200,
  },
  {
    id: 'isActive',
    label: 'Status',
    minWidth: 100,
    align: 'center',
    sortable: true,
    sortField: 'isActive',
  },
  {
    id: 'createdAt',
    label: 'Created',
    minWidth: 120,
    sortable: true,
    sortField: 'createdAt',
  },
  { id: 'actions', label: 'Actions', minWidth: 150, align: 'center' },
];

export function BlackboxList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<SortField>('order');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] =
    useState<BlackboxQuestion | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const {
    data: questionsData,
    isLoading,
    error,
  } = useBlackboxQuestions({
    page: page + 1,
    limit: rowsPerPage,
    sortBy,
    sortOrder,
    isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
    search: searchQuery,
  });

  const deleteQuestion = useDeleteBlackboxQuestion();
  const reorderQuestions = useReorderBlackboxQuestions();

  const handleSearch = useCallback(() => {
    setSearchQuery(searchTerm);
    setPage(0);
  }, [searchTerm]);

  const handleStatusFilterChange = useCallback((status: StatusFilter) => {
    setStatusFilter(status);
    setPage(0);
  }, []);

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortBy === field) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      } else {
        setSortBy(field);
        setSortOrder('asc');
      }
      setPage(0);
    },
    [sortBy, sortOrder],
  );

  const handlePageChange = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    [],
  );

  const handleCreateQuestion = useCallback(() => {
    setCreateModalOpen(true);
  }, []);

  const handleEditQuestion = useCallback((question: BlackboxQuestion) => {
    setSelectedQuestion(question);
    setEditModalOpen(true);
  }, []);

  const handleDeleteQuestion = (question: BlackboxQuestion) => {
    deleteQuestion.mutate(question._id);
  };

  const handleReorderQuestions = () => {
    reorderQuestions.mutate();
  };

  const handleCloseCreateModal = useCallback(() => {
    setCreateModalOpen(false);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setEditModalOpen(false);
    setSelectedQuestion(null);
  }, []);

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          Error loading questions: {error.message}
        </Typography>
      </Box>
    );
  }

  const questions = questionsData?.data || [];
  const total = questionsData?.meta.total || 0;

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontFamily: 'ClashDisplay', fontWeight: 700 }}
        >
          Blackbox Game
        </Typography>
        <ButtonGroup>
          <Button
            variant="outlined"
            startIcon={<SportsEsportsIcon />}
            component={Link}
            href={ROUTES.DASHBOARD.BLACKBOX.GAME}
          >
            Play Game
          </Button>
          <Button
            variant="outlined"
            startIcon={<ReorderIcon />}
            onClick={handleReorderQuestions}
            disabled={reorderQuestions.isPending}
          >
            Reorder
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateQuestion}
            sx={{ bgcolor: '#2FD65D', '&:hover': { bgcolor: '#2AC152' } }}
          >
            Add Question
          </Button>
        </ButtonGroup>
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
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
          onClick={(e) => setAnchorEl(e.currentTarget)}
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
          Status:{' '}
          {statusFilter === 'all'
            ? 'All'
            : statusFilter === 'active'
            ? 'Active'
            : 'Inactive'}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
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
          <MenuItem
            onClick={() => {
              handleStatusFilterChange('all');
              setAnchorEl(null);
            }}
          >
            All
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleStatusFilterChange('active');
              setAnchorEl(null);
            }}
          >
            Active
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleStatusFilterChange('inactive');
              setAnchorEl(null);
            }}
          >
            Inactive
          </MenuItem>
        </Menu>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
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
                    {column.sortable ? (
                      <TableSortLabel
                        sx={{
                          color: 'white',
                          '&:hover': {
                            color: 'white',
                          },
                          '&.MuiTableSortLabel-root.Mui-active': {
                            color: 'white',
                          },
                          '&.MuiTableSortLabel-root.Mui-active .MuiTableSortLabel-icon':
                            {
                              color: 'white',
                            },
                        }}
                        active={sortBy === column.sortField}
                        direction={
                          sortBy === column.sortField ? sortOrder : 'asc'
                        }
                        onClick={() =>
                          column.sortField && handleSort(column.sortField)
                        }
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
              {isLoading
                ? Array.from(new Array(rowsPerPage)).map((_, index) => (
                    <TableRow key={index}>
                      {columns.map((column) => (
                        <TableCell key={column.id}>
                          <Skeleton animation="wave" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : questions.map((question, index) => (
                    <TableRow key={question._id} hover>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={question.order}
                          size="small"
                          sx={{
                            fontSize: '12px',
                            fontWeight: 500,
                            color: '#fff',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {question.question}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {question.answer}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Switch
                          checked={question.isActive}
                          disabled
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(question.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 1,
                            justifyContent: 'center',
                          }}
                        >
                          <Tooltip title="Edit Question">
                            <IconButton
                              size="small"
                              onClick={() => handleEditQuestion(question)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Question">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteQuestion(question)}
                              disabled={deleteQuestion.isPending}
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
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Paper>

      <CreateQuestionModal
        open={createModalOpen}
        onClose={handleCloseCreateModal}
      />

      {selectedQuestion && (
        <EditQuestionModal
          open={editModalOpen}
          onClose={handleCloseEditModal}
          question={selectedQuestion}
        />
      )}
    </Box>
  );
}
