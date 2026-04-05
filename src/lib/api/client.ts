import axios, { AxiosError } from 'axios';
import { cookies } from '@/lib/utils/cookies';

type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
};

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.dugodofficial.com',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = cookies.getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      cookies.removeAuthToken();

      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', headers = {}, body } = options;

  try {
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const response = await axiosInstance.request<T>({
      url: normalizedEndpoint,
      method,
      headers,
      data: body,
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new ApiError(
        error.response?.status || 500,
        error.response?.data?.message || error.message || 'An error occurred'
      );
    }
    throw error;
  }
} 