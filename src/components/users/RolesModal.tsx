'use client';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { useState } from 'react';
import { Role } from '@/lib/api/users';
import {
  useCreateRole,
  usePermissions,
  useRoles,
  useUpdateRole,
  useDeleteRole,
} from '@/hooks/users';

interface RolesModalProps {
  open: boolean;
  onClose: () => void;
}

export function RolesModal({ open, onClose }: RolesModalProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const { data: rolesData, isLoading } = useRoles();
  const roles = rolesData?.data ?? [];
  const { data: permissionsData } = usePermissions();
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const permissions = permissionsData?.data ?? [];
  const { mutate: createRole, isPending: isCreatingRole } = useCreateRole();
  const { mutate: updateRole, isPending: isUpdatingRole } = useUpdateRole();
  const { mutate: deleteRole, isPending: isDeletingRole } = useDeleteRole();

  const handleCreateRole = () => {
    if (!newRoleName.trim()) return;

    createRole({
      name: newRoleName,
      description: newRoleDescription,
      permissions: selectedPermissions,
    });

    setNewRoleName('');
    setNewRoleDescription('');
    setIsCreating(false);
  };

  const handleCancelCreate = () => {
    setNewRoleName('');
    setNewRoleDescription('');
    setSelectedPermissions([]);
    setIsCreating(false);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setNewRoleName(role.name);
    setNewRoleDescription(role.description);
    setSelectedPermissions(role.permissions || []);
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleUpdateRole = () => {
    if (!newRoleName.trim() || !editingRole) return;

    updateRole({
      id: editingRole.id,
      data: {
        name: newRoleName,
        description: newRoleDescription,
        permissions: selectedPermissions,
      },
    });

    setNewRoleName('');
    setNewRoleDescription('');
    setSelectedPermissions([]);
    setIsEditing(false);
    setEditingRole(null);
  };

  const handleCancelEdit = () => {
    setNewRoleName('');
    setNewRoleDescription('');
    setSelectedPermissions([]);
    setIsEditing(false);
    setEditingRole(null);
  };

  const handleDeleteRole = (role: Role) => {
    if (
      window.confirm(
        `Are you sure you want to delete the role "${role.name}"? This action cannot be undone.`,
      )
    ) {
      deleteRole(role.id);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow:
            '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Manage Roles
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pb: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Roles ({roles.length})
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsCreating(true)}
              sx={{
                bgcolor: '#2FD65D',
                '&:hover': { bgcolor: '#2AC152' },
                textTransform: 'none',
              }}
            >
              Add Role
            </Button>
          </Box>

          {(isCreating || isEditing) && (
            <Paper
              sx={{
                p: 2,
                mb: 2,
                bgcolor: '#F9FAFB',
                border: '1px solid #E5E7EB',
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                {isEditing ? 'Edit Role' : 'Create New Role'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  label="Role Name"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  size="small"
                  fullWidth
                  placeholder="e.g., Moderator"
                />
                <TextField
                  label="Description"
                  value={newRoleDescription}
                  onChange={(e) => setNewRoleDescription(e.target.value)}
                  size="small"
                  fullWidth
                  placeholder="e.g., Can moderate content"
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Select Permissions
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {permissions.map((permission) => (
                    <Chip
                      key={permission}
                      label={permission}
                      onClick={() => {
                        setSelectedPermissions((prev) =>
                          prev.includes(permission)
                            ? prev.filter((p) => p !== permission)
                            : [...prev, permission],
                        );
                      }}
                      variant={
                        selectedPermissions.includes(permission)
                          ? 'filled'
                          : 'outlined'
                      }
                      sx={{
                        cursor: 'pointer',
                        bgcolor: selectedPermissions.includes(permission)
                          ? '#2FD65D'
                          : 'transparent',
                        color: selectedPermissions.includes(permission)
                          ? 'white'
                          : '#6B7280',
                        borderColor: selectedPermissions.includes(permission)
                          ? '#2FD65D'
                          : '#E5E7EB',
                        '&:hover': {
                          bgcolor: selectedPermissions.includes(permission)
                            ? '#2AC152'
                            : '#F9FAFB',
                          borderColor: selectedPermissions.includes(permission)
                            ? '#2AC152'
                            : '#D1D5DB',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  onClick={isEditing ? handleUpdateRole : handleCreateRole}
                  disabled={
                    !newRoleName.trim() || isCreatingRole || isUpdatingRole
                  }
                  sx={{
                    bgcolor: '#2FD65D',
                    '&:hover': { bgcolor: '#2AC152' },
                    textTransform: 'none',
                  }}
                >
                  {isCreatingRole
                    ? 'Creating...'
                    : isUpdatingRole
                    ? 'Updating...'
                    : isEditing
                    ? 'Update Role'
                    : 'Create Role'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={isEditing ? handleCancelEdit : handleCancelCreate}
                  sx={{
                    borderColor: '#E5E7EB',
                    color: '#6B7280',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#D1D5DB',
                      bgcolor: '#F9FAFB',
                    },
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Paper>
          )}

          <TableContainer
            component={Paper}
            sx={{ boxShadow: 'none', border: '1px solid #E5E7EB' }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Role Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Permissions</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        Loading roles...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : roles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        No roles found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  roles.map((role) => (
                    <TableRow key={role.id} hover>
                      <TableCell>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {role.name}
                          </Typography>
                          {role.name.toLowerCase() === 'admin' && (
                            <Chip
                              label="Default"
                              size="small"
                              sx={{
                                bgcolor: '#2FD65D',
                                color: 'white',
                                fontSize: '10px',
                                height: '20px',
                              }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {role.description || 'No description'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {role.permissions.map((permission) => (
                            <Chip
                              key={permission}
                              label={permission}
                              size="small"
                              sx={{
                                bgcolor: '#2FD65D',
                                color: '#000',
                                fontSize: '10px',
                                fontWeight: 600,
                                height: '20px',
                              }}
                            />
                          ))}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(role.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleEditRole(role)}
                            sx={{
                              borderColor: '#E5E7EB',
                              color: '#6B7280',
                              textTransform: 'none',
                              fontSize: '12px',
                              '&:hover': {
                                borderColor: '#D1D5DB',
                                bgcolor: '#F9FAFB',
                              },
                            }}
                          >
                            Edit
                          </Button>
                          {role.name.toLowerCase() !== 'admin' && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => handleDeleteRole(role)}
                              disabled={isDeletingRole}
                              sx={{
                                textTransform: 'none',
                                fontSize: '12px',
                              }}
                            >
                              {isDeletingRole ? 'Deleting...' : 'Delete'}
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          sx={{
            color: '#6B7280',
            textTransform: 'none',
            '&:hover': {
              bgcolor: '#F9FAFB',
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
