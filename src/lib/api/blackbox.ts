import { apiClient } from "./client";

export interface BlackboxQuestion {
  _id: string;
  question: string;
  answer: string;
  secret: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlackboxAnswer {
  _id: string;
  questionId: string;
  userId: string;
  userAnswer: string;
  isCorrect: boolean;
  answeredAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlackboxQuestionWithAnswer extends BlackboxQuestion {
  userAnswer?: BlackboxAnswer;
}

export interface UserBlackboxProgress {
  answeredQuestions: BlackboxQuestionWithAnswer[];
  nextQuestion?: BlackboxQuestion;
  totalQuestions: number;
  answeredCount: number;
  remainingCount: number;
}

export interface CreateQuestionDto {
  question: string;
  answer: string;
  secret: string;
  order: number | string;
  isActive?: boolean;
  answerType: 'exact' | 'any';
}

export interface UpdateQuestionDto {
  question?: string;
  answer?: string;
  secret?: string;
  order?: number | string;
  isActive?: boolean;
}

export interface AnswerQuestionDto {
  questionId: string;
  answer: string;
}

export interface GetQuestionsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  isActive?: boolean;
  search?: string;
}

export interface PaginatedBlackboxQuestions {
  data: BlackboxQuestion[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
}

export interface AnswerQuestionResponse {
  isCorrect: boolean;
  secret: string;
}

export async function getBlackboxQuestions(params: GetQuestionsParams = {}) {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
  if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
  if (params.search) queryParams.append('search', params.search);

  const queryString = queryParams.toString();
  const endpoint = queryString ? `blackbox/questions?${queryString}` : 'blackbox/questions';

  return apiClient<PaginatedBlackboxQuestions>(endpoint);
}

export async function getBlackboxQuestionById(id: string) {
  return apiClient<{ data: BlackboxQuestion }>(`blackbox/questions/${id}`);
}

export async function createBlackboxQuestion(data: CreateQuestionDto) {
  return apiClient<{ data: BlackboxQuestion }>('blackbox/questions', {
    method: 'POST',
    body: data,
  });
}

export async function updateBlackboxQuestion(id: string, data: UpdateQuestionDto) {
  return apiClient<{ data: BlackboxQuestion }>(`blackbox/questions/${id}`, {
    method: 'PUT',
    body: data,
  });
}

export async function deleteBlackboxQuestion(id: string) {
  return apiClient<{ message: string }>(`blackbox/questions/${id}`, {
    method: 'DELETE',
  });
}

export async function reorderBlackboxQuestions() {
  return apiClient<{ message: string }>('blackbox/questions/reorder', {
    method: 'POST',
  });
}

export async function answerBlackboxQuestion(data: AnswerQuestionDto) {
  return apiClient<{ data: AnswerQuestionResponse, message: string }>('blackbox/answer', {
    method: 'POST',
    body: data,
  });
}

export async function getUserBlackboxProgress() {
  return apiClient<{ data: UserBlackboxProgress }>('blackbox/progress');
}

export async function getAnsweredBlackboxQuestions() {
  return apiClient<{ data: BlackboxQuestion[] }>('blackbox/answered');
}

export async function getNextUnansweredQuestion() {
  return apiClient<{ data: BlackboxQuestion | null }>('blackbox/next-question');
}

export async function resetBlackboxProgress() {
  return apiClient<{ message: string }>('blackbox/reset', {
    method: 'POST',
  });
}