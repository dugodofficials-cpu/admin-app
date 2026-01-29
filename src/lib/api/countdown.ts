import {
  Countdown,
  CountdownQueryParams,
  CountdownResponse,
  CreateCountdownData,
} from '@/components/countdown/types';
import { apiClient } from './client';

export const countdownApi = {
  getCountdowns: async (params?: CountdownQueryParams): Promise<CountdownResponse> => {
    const queryString = params
      ? '?' + new URLSearchParams(
        Object.entries(params)
          .filter(([, value]) => value !== undefined)
          .map(([key, value]) => [key, String(value)])
      ).toString()
      : '';

    return apiClient<CountdownResponse>(`countdown/all${queryString}`);
  },

  getCountdown: async (id: string): Promise<Countdown> => {
    return apiClient(`countdown/${id}`);
  },

  getActiveCountdown: async (): Promise<{ data: Countdown }> => {
    return apiClient(`countdown/active`);
  },

  createCountdown: async (data: CreateCountdownData): Promise<Countdown> => {
    return apiClient<Countdown>('countdown', {
      method: 'POST',
      body: data,
    });
  },

  updateCountdown: async (id: string, data: CreateCountdownData): Promise<Countdown> => {
    return apiClient<Countdown>(`countdown/${id}`, {
      method: 'PUT',
      body: data,
    });
  },

  deleteCountdown: async (id: string): Promise<void> => {
    return apiClient<void>(`countdown/${id}`, {
      method: 'DELETE',
    });
  },

};
