import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBlackboxQuestions,
  getBlackboxQuestionById,
  createBlackboxQuestion,
  updateBlackboxQuestion,
  deleteBlackboxQuestion,
  reorderBlackboxQuestions,
  answerBlackboxQuestion,
  getUserBlackboxProgress,
  getAnsweredBlackboxQuestions,
  getNextUnansweredQuestion,
  GetQuestionsParams,
  CreateQuestionDto,
  UpdateQuestionDto,
  AnswerQuestionDto,
  resetBlackboxProgress,
} from "@/lib/api/blackbox";
import { enqueueSnackbar } from 'notistack';

export function useBlackboxQuestions(params: GetQuestionsParams = {}) {
  return useQuery({
    queryKey: ["blackbox-questions", params],
    queryFn: async () => {
      try {
        return await getBlackboxQuestions(params);
      } catch (error) {
        enqueueSnackbar((error as Error).message || 'Failed to fetch blackbox questions', { variant: 'error' });
        throw error;
      }
    },
  });
}

export function useBlackboxQuestion(id: string) {
  return useQuery({
    queryKey: ["blackbox-questions", id],
    queryFn: async () => {
      try {
        return await getBlackboxQuestionById(id);
      } catch (error) {
        enqueueSnackbar((error as Error).message || 'Failed to fetch blackbox question', { variant: 'error' });
        throw error;
      }
    },
    enabled: !!id,
  });
}

export function useCreateBlackboxQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQuestionDto) => createBlackboxQuestion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blackbox-questions"] });
      enqueueSnackbar('Question created successfully', {
        variant: 'success',
      });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Failed to create question', {
        variant: 'error',
      });
    },
  });
}

export function useUpdateBlackboxQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateQuestionDto }) =>
      updateBlackboxQuestion(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["blackbox-questions"] });
      queryClient.invalidateQueries({ queryKey: ["blackbox-questions", variables.id] });
      enqueueSnackbar('Question updated successfully', {
        variant: 'success',
      });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Failed to update question', {
        variant: 'error',
      });
    },
  });
}

export function useDeleteBlackboxQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBlackboxQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blackbox-questions"] });
      enqueueSnackbar('Question deleted successfully', {
        variant: 'success',
      });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Failed to delete question', {
        variant: 'error',
      });
    },
  });
}

export function useReorderBlackboxQuestions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reorderBlackboxQuestions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blackbox-questions"] });
      enqueueSnackbar('Questions reordered successfully', {
        variant: 'success',
      });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Failed to reorder questions', {
        variant: 'error',
      });
    },
  });
}

export function useAnswerBlackboxQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AnswerQuestionDto) => answerBlackboxQuestion(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["blackbox-progress"] });
      queryClient.invalidateQueries({ queryKey: ["blackbox-answered"] });
      queryClient.invalidateQueries({ queryKey: ["blackbox-next-question"] });
      enqueueSnackbar(data.message || 'Answer submitted successfully', { variant: data.data.isCorrect ? 'success' : 'error' });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Failed to submit answer', {
        variant: 'error',
      });
    },
  });
}

export function useUserBlackboxProgress() {
  return useQuery({
    queryKey: ["blackbox-progress"],
    queryFn: async () => {
      try {
        return await getUserBlackboxProgress();
      } catch (error) {
        enqueueSnackbar((error as Error).message || 'Failed to fetch blackbox progress', { variant: 'error' });
        throw error;
      }
    },
  });
}

export function useAnsweredBlackboxQuestions() {
  return useQuery({
    queryKey: ["blackbox-answered"],
    queryFn: async () => {
      try {
        return await getAnsweredBlackboxQuestions();
      } catch (error) {
        enqueueSnackbar((error as Error).message || 'Failed to fetch answered questions', { variant: 'error' });
        throw error;
      }
    },
  });
}

export function useNextUnansweredQuestion() {
  return useQuery({
    queryKey: ["blackbox-next-question"],
    queryFn: async () => {
      try {
        return await getNextUnansweredQuestion();
      } catch (error) {
        enqueueSnackbar((error as Error).message || 'Failed to fetch next question', { variant: 'error' });
        throw error;
      }
    },
  });
}

export function useResetBlackboxProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resetBlackboxProgress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blackbox-progress"] });
      queryClient.invalidateQueries({ queryKey: ["blackbox-answered"] });
      queryClient.invalidateQueries({ queryKey: ["blackbox-next-question"] });
      enqueueSnackbar('Game reset successfully', { variant: 'success' });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Failed to reset game', {
        variant: 'error',
      });
    },
  });
}
