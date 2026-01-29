import { useMutation, useQueryClient } from '@tanstack/react-query';
import { User, updateUser } from '@/lib/api/user';
import { enqueueSnackbar } from 'notistack';

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: Partial<User>) => updateUser(params._id || '', params),
    onSuccess: (response) => {
      queryClient.setQueryData(['auth'], (oldData: { data: User } | undefined) => ({
        ...oldData,
        data: {
          ...oldData?.data,
          ...response.data,
        },
      }));
      enqueueSnackbar('User updated successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to update user', { variant: 'error' });
    },
  });
}

export function useUser() {
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData<{ data: User }>(['auth'])?.data;

  const updateUserMutation = useUpdateUser();

  return {
    user: currentUser,
    updateUser: {
      mutate: updateUserMutation.mutate,
      mutateAsync: updateUserMutation.mutateAsync,
      isLoading: updateUserMutation.isPending,
      error: updateUserMutation.error,
      isSuccess: updateUserMutation.isSuccess,
    },
  };
}
