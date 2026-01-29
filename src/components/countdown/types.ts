export enum CountdownStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
}

export interface Countdown {
  id: string;
  title: string;
  description?: string;
  launchDate: string;
  status: CountdownStatus;
  isActive: boolean;
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  buttonText?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  showDays: boolean;
  showHours: boolean;
  showMinutes: boolean;
  showSeconds: boolean;
  timezone?: string;
  customMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCountdownData {
  title: string;
  description?: string;
  launchDate: string;
  status?: CountdownStatus;
  isActive?: boolean;
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  buttonText?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
  timezone?: string;
  customMessage?: string;
}


export interface CountdownQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
  isActive?: boolean;
  search?: string;
}

export interface CountdownResponse {
  data: Countdown[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CountdownTimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
  isExpired: boolean;
}
