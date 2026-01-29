'use client';

import { useCreateBlackboxQuestion } from '@/hooks/blackbox';
import { CreateQuestionDto } from '@/lib/api/blackbox';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControlLabel,
  Switch,
  Alert,
} from '@mui/material';
import React, { useState, useCallback } from 'react';

interface CreateQuestionModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateQuestionModal({
  open,
  onClose,
}: CreateQuestionModalProps) {
  const [formData, setFormData] = useState<CreateQuestionDto>({
    question: '',
    answer: '',
    secret: '',
    order: 1,
    isActive: true,
    answerType: 'exact',
  });
  const [errors, setErrors] = useState<Partial<CreateQuestionDto>>({});

  const createQuestion = useCreateBlackboxQuestion();

  const handleInputChange = useCallback(
    (field: keyof CreateQuestionDto, value: string | number | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors],
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<CreateQuestionDto> = {};

    if (!formData.question.trim()) {
      newErrors.question = 'Question is required';
    } else if (formData.question.length > 1000) {
      newErrors.question = 'Question must be less than 1000 characters';
    }

    if (!formData.answer.trim() && formData.answerType === 'exact') {
      newErrors.answer = 'Answer is required';
    } else if (
      formData.answer.length > 500 &&
      formData.answerType === 'exact'
    ) {
      newErrors.answer = 'Answer must be less than 500 characters';
    }

    if (!formData.secret.trim()) {
      newErrors.secret = 'Secret is required';
    } else if (formData.secret.length > 1000) {
      newErrors.secret = 'Secret must be less than 1000 characters';
    }

    if (Number(formData.order) < 1) {
      newErrors.order = 'Order must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    if (formData.answerType === 'any') {
      formData.answer = '';
    }
    createQuestion.mutate(formData);
    setFormData({
      question: '',
      answer: '',
      secret: '',
      order: 1,
      isActive: true,
      answerType: 'exact',
    });
    setErrors({});
    onClose();
  };

  const handleClose = useCallback(() => {
    setFormData({
      question: '',
      answer: '',
      secret: '',
      order: 1,
      isActive: true,
      answerType: 'exact',
    });
    setErrors({});
    onClose();
  }, [onClose]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Blackbox Question</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Question"
            multiline
            rows={3}
            value={formData.question}
            onChange={(e) => handleInputChange('question', e.target.value)}
            error={!!errors.question}
            helperText={
              errors.question || 'Enter the question text (max 1000 characters)'
            }
            fullWidth
            required
          />

          <TextField
            label="Answer"
            value={formData.answer}
            onChange={(e) => handleInputChange('answer', e.target.value)}
            error={!!errors.answer}
            helperText={
              errors.answer || 'Enter the correct answer (max 500 characters)'
            }
            fullWidth
            required={formData.answerType === 'exact'}
          />

          <TextField
            label="Secret"
            multiline
            rows={3}
            value={formData.secret}
            onChange={(e) => handleInputChange('secret', e.target.value)}
            error={!!errors.secret}
            helperText={
              errors.secret ||
              'Enter the secret that will be revealed when answered correctly (max 1000 characters)'
            }
            fullWidth
            required
          />

          <TextField
            label="Order"
            type="number"
            value={formData.order}
            onChange={(e) =>
              handleInputChange('order', parseInt(e.target.value) || 1)
            }
            error={!!errors.order}
            helperText={
              errors.order || 'Enter the sequence order for this question'
            }
            fullWidth
            required
            inputProps={{ min: 1 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={(e) =>
                  handleInputChange('isActive', e.target.checked)
                }
              />
            }
            label="Active"
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.answerType === 'any'}
                onChange={(e) =>
                  handleInputChange(
                    'answerType',
                    e.target.checked ? 'any' : 'exact',
                  )
                }
              />
            }
            label={'Open Ended Question'}
          />

          <Alert severity="info">
            <strong>Tip:</strong> The order determines the sequence in which
            users will see questions. Users must answer questions in order to
            progress.
          </Alert>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={createQuestion.isPending}
          sx={{ bgcolor: '#2FD65D', '&:hover': { bgcolor: '#2AC152' } }}
        >
          {createQuestion.isPending ? 'Creating...' : 'Create Question'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
