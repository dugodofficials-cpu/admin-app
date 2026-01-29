import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, getUserById, updateUser, deleteUser, GetUsersParams, User, getUserRoles, getPermissions, createRole, updateRole, deleteRole, assignRole, Role, resendVerification, getUserStatistics as getUserStatisticsApi, UserStatistics } from "@/lib/api/users";
import { enqueueSnackbar } from 'notistack';

export function useUsers(params: GetUsersParams = {}) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: async () => {
      try {
        return await getUsers(params);
      } catch (error) {
        enqueueSnackbar((error as Error).message || 'Failed to fetch users', { variant: 'error' });
        throw error;
      }
    },
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      try {
        return await getUserById(id);
      } catch (error) {
        enqueueSnackbar((error as Error).message || 'Failed to fetch user', { variant: 'error' });
        throw error;
      }
    },
    enabled: !!id,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", variables.id] });
      enqueueSnackbar('User updated successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to update user', { variant: 'error' });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      enqueueSnackbar('User deleted successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to delete user', { variant: 'error' });
    },
  });
}

export function useRoles() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      try {
        return await getUserRoles();
      } catch (error) {
        enqueueSnackbar((error as Error).message || 'Failed to fetch roles', { variant: 'error' });
        throw error;
      }
    },
  });
}

export function usePermissions() {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      try {
        return await getPermissions();
      } catch (error) {
        enqueueSnackbar((error as Error).message || 'Failed to fetch permissions', { variant: 'error' });
        throw error;
      }
    },
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Role>) => createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      enqueueSnackbar('Role created successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to create role', { variant: 'error' });
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Role> }) =>
      updateRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      enqueueSnackbar('Role updated successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to update role', { variant: 'error' });
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      enqueueSnackbar('Role deleted successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to delete role', { variant: 'error' });
    },
  });
}

export function useAssignRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      assignRole(userId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      enqueueSnackbar('Role assigned successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to assign role', { variant: 'error' });
    },
  });
}

export function useResendVerification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (email: string) => resendVerification(email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      enqueueSnackbar('Verification email sent successfully!', {
        variant: 'success',
      });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to send verification email', {
        variant: 'error',
      });
    },
  });
}

export function useUserStatistics() {
  return useQuery<UserStatistics, Error>({
    queryKey: ['userStatistics'],
    queryFn: async () => {
      try {
        return await getUserStatisticsApi();
      } catch (error) {
        enqueueSnackbar((error as Error).message || 'Failed to fetch user statistics', { variant: 'error' });
        throw error;
      }
    },
  });
}
