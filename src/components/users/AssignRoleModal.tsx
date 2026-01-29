'use client';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Chip,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useState } from 'react';
import { User } from '@/lib/api/users';
import { useAssignRole, useRoles } from '@/hooks/users';

interface AssignRoleModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

export function AssignRoleModal({ open, onClose, user }: AssignRoleModalProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const { data: rolesData } = useRoles();
  const roles = rolesData?.data ?? [];
  const { mutate: assignRole, isPending: isAssigning } = useAssignRole();

  const handleAssignRole = () => {
    if (!selectedRoleId || !user) return;

    assignRole(
      {
        userId: user._id,
        roleId: selectedRoleId,
      },
      {
        onSuccess: () => {
          onClose();
          setSelectedRoleId('');
        },
      },
    );
  };

  const handleClose = () => {
    setSelectedRoleId('');
    onClose();
  };

  const currentRole = user?.userRoles?.[0]?.roleId;
  const currentRoleName = roles.find((role) => role.id === currentRole)?.name;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
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
            Assign Role
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pb: 3 }}>
        {user && (
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="subtitle1"
              sx={{ mb: 3, fontWeight: 600, color: '#374151' }}
            >
              User Information
            </Typography>
            <Box
              sx={{
                p: 3,
                bgcolor: '#F9FAFB',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                mb: 3,
              }}
            >
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: '#2FD65D',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '18px',
                  }}
                >
                  {user.firstName?.charAt(0)}
                  {user.lastName?.charAt(0)}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  Current Role:
                </Typography>
                <Chip
                  label={currentRoleName || 'No Role'}
                  size="small"
                  sx={{
                    backgroundColor:
                      currentRoleName?.toLowerCase() === 'admin'
                        ? '#2FD65D'
                        : '#6B7280',
                    color: 'white',
                    textTransform: 'capitalize',
                    fontWeight: 600,
                    fontSize: '12px',
                    height: '24px',
                  }}
                />
              </Box>
            </Box>
          </Box>
        )}

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="subtitle1"
            sx={{ mb: 3, fontWeight: 600, color: '#374151' }}
          >
            Select New Role
          </Typography>
          <FormControl component="fieldset" fullWidth>
            <FormLabel
              component="legend"
              sx={{ mb: 2, color: '#6B7280', fontWeight: 500 }}
            >
              Available Roles
            </FormLabel>
            <RadioGroup
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
            >
              {roles.map((role) => (
                <Box
                  key={role.id}
                  sx={{
                    mb: 2,
                    p: 2,
                    border:
                      selectedRoleId === role.id
                        ? '2px solid #2FD65D'
                        : '1px solid #E5E7EB',
                    borderRadius: '12px',
                    bgcolor: selectedRoleId === role.id ? '#F0FDF4' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor:
                        selectedRoleId === role.id ? '#2FD65D' : '#D1D5DB',
                      bgcolor:
                        selectedRoleId === role.id ? '#F0FDF4' : '#F9FAFB',
                    },
                  }}
                  onClick={() => setSelectedRoleId(role.id)}
                >
                  <FormControlLabel
                    value={role.id}
                    control={
                      <Radio
                        sx={{
                          color: '#2FD65D',
                          '&.Mui-checked': {
                            color: '#2FD65D',
                          },
                        }}
                      />
                    }
                    label={
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                        }}
                      >
                        <Box>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 600, mb: 0.5 }}
                          >
                            {role.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {role.description || 'No description available'}
                          </Typography>
                        </Box>
                        <Chip
                          label={
                            role.name.toLowerCase() === 'admin'
                              ? 'Admin'
                              : 'User'
                          }
                          size="small"
                          sx={{
                            backgroundColor:
                              role.name.toLowerCase() === 'admin'
                                ? '#2FD65D'
                                : '#6B7280',
                            color: 'white',
                            fontSize: '10px',
                            fontWeight: 600,
                            height: '20px',
                          }}
                        />
                      </Box>
                    }
                    sx={{
                      width: '100%',
                      margin: 0,
                      '& .MuiFormControlLabel-label': {
                        width: '100%',
                      },
                    }}
                  />
                </Box>
              ))}
            </RadioGroup>
          </FormControl>
        </Box>

        {selectedRoleId && (
          <Box
            sx={{
              p: 3,
              bgcolor: '#F0FDF4',
              borderRadius: '12px',
              border: '1px solid #2FD65D',
              mb: 3,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ mb: 2, fontWeight: 600, color: '#166534' }}
            >
              Selected Role Details
            </Typography>
            {(() => {
              const selectedRole = roles.find(
                (role) => role.id === selectedRoleId,
              );
              return selectedRole ? (
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, lineHeight: 1.5 }}
                  >
                    {selectedRole.description || 'No description available'}
                  </Typography>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, mb: 1, color: '#374151' }}
                    >
                      Permissions:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedRole.permissions?.map((permission) => (
                        <Chip
                          key={permission}
                          label={permission}
                          size="small"
                          sx={{
                            bgcolor: '#2FD65D',
                            color: 'white',
                            fontSize: '10px',
                            fontWeight: 600,
                            height: '20px',
                            '& .MuiChip-label': {
                              px: 1,
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              ) : null;
            })()}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderColor: '#E5E7EB',
            color: '#6B7280',
            textTransform: 'none',
            px: 3,
            py: 1.5,
            '&:hover': {
              borderColor: '#D1D5DB',
              bgcolor: '#F9FAFB',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleAssignRole}
          disabled={!selectedRoleId || isAssigning}
          sx={{
            bgcolor: '#2FD65D',
            '&:hover': { bgcolor: '#2AC152' },
            textTransform: 'none',
            px: 3,
            py: 1.5,
            fontWeight: 600,
            boxShadow:
              '0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)',
          }}
        >
          {isAssigning ? 'Assigning...' : 'Assign Role'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
