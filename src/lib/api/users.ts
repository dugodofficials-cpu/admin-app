import { apiClient } from "./client";

export interface UserRole {
  userId: string;
  roleId: string;
  assignedBy: string;
  assignedAt: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  email: string;
  status: string;
  userRoles: UserRole[];
  firstName: string;
  lastName: string;
  picture: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  totalOrdersCount: number;
  isEmailVerified: boolean;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  role?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedUsers {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function getUsers(params: GetUsersParams = {}) {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.status) queryParams.append('status', params.status);
  if (params.role) queryParams.append('role', params.role);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  const queryString = queryParams.toString();
  const endpoint = queryString ? `users?${queryString}` : 'users';

  return apiClient<PaginatedUsers>(endpoint);
}

export async function getUserById(id: string) {
  return apiClient<{ data: User }>(`users/${id}`);
}

export async function updateUser(id: string, data: Partial<User>) {
  return apiClient<User>(`users/${id}`, {
    method: 'PATCH',
    body: data,
  });
}

export async function deleteUser(id: string) {
  return apiClient<void>(`users/${id}`, {
    method: 'DELETE',
  });
}

export async function getUserRoles() {
  return apiClient<{ data: Role[] }>('roles');
}

export async function createRole(data: Partial<Role>) {
  return apiClient<Role>('roles', {
    method: 'POST',
    body: data,
  });
}

export async function updateRole(id: string, data: Partial<Role>) {
  return apiClient<Role>(`roles/${id}`, {
    method: 'PUT',
    body: data,
  });
}

export async function deleteRole(id: string) {
  return apiClient<void>(`roles/${id}`, {
    method: 'DELETE',
  });
}

export async function getPermissions() {
  return apiClient<{ data: string[] }>('roles/permissions');
}

export async function assignRole(userId: string, roleId: string) {
  return apiClient<void>(`roles/assign`, {
    method: 'POST',
    body: { userId, roleId },
  });
}

export async function resendVerification(email: string) {
  return apiClient<{ success: boolean; message: string }>(
    `auth/resend-verification`,
    {
      method: 'POST',
      body: { email },
    }
  );
}

export interface UserStatistics {
  data: { totalUsers: number; }
}

export const getUserStatistics = async (): Promise<UserStatistics> => {
  return apiClient<UserStatistics>('users/statistics');
};