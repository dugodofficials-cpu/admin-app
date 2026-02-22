import axios, { AxiosError } from 'axios';
import { cookies } from '@/lib/utils/cookies';

const DEFAULT_API_URL = 'https://api.dugodofficial.com';
const DEV_API_URL = 'http://localhost:3001';
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0']);

const resolveApiBaseUrl = () => {
  const candidate = process.env.NEXT_PUBLIC_API_URL;
  const isProd = process.env.NODE_ENV === 'production';
  const isBrowser = typeof window !== 'undefined';

  if (!candidate) {
    if (!isBrowser) {
      return DEFAULT_API_URL;
    }

    return isProd ? '/api' : DEV_API_URL;
  }

  if (candidate.startsWith('/')) {
    return isBrowser ? candidate : DEFAULT_API_URL;
  }

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    return isBrowser && isProd ? '/api' : DEFAULT_API_URL;
  }

  const isLocal = LOCAL_HOSTS.has(parsed.hostname);
  const appCandidate = process.env.NEXT_PUBLIC_APP_URL;
  let appHost: string | null = null;

  if (appCandidate) {
    try {
      appHost = new URL(appCandidate).hostname;
    } catch {
      appHost = null;
    }
  }

  if (isProd && (isLocal || parsed.hostname === 'admin.dugodofficial.com' || (appHost && parsed.hostname === appHost))) {
    return isBrowser ? '/api' : DEFAULT_API_URL;
  }

  if (isProd && parsed.protocol !== 'https:' && !isLocal) {
    return isBrowser ? '/api' : DEFAULT_API_URL;
  }

  return parsed.origin;
};

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
  baseURL: resolveApiBaseUrl(),
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