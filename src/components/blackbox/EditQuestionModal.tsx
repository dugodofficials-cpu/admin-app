'use client';

import { useUpdateBlackboxQuestion } from '@/hooks/blackbox';
import { BlackboxQuestion, UpdateQuestionDto } from '@/lib/api/blackbox';
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
import React, { useState, useCallback, useEffect } from 'react';

interface EditQuestionModalProps {
  open: boolean;
  onClose: () => void;
  question: BlackboxQuestion;
}

export function EditQuestionModal({
  open,
  onClose,
  question,
}: EditQuestionModalProps) {
  const [formData, setFormData] = useState<UpdateQuestionDto>({});
  const [errors, setErrors] = useState<Partial<UpdateQuestionDto>>({});

  const updateQuestion = useUpdateBlackboxQuestion();

  useEffect(() => {
    setFormData({
      question: question.question,
      answer: question.answer,
      secret: question.secret,
      order: question.order,
      isActive: question.isActive,
    });
    setErrors({});
  }, [question]);

  const handleInputChange = useCallback(
    (field: keyof UpdateQuestionDto, value: string | number | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors],
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<UpdateQuestionDto> = {};

    if (formData.question !== undefined) {
      if (!formData.question.trim()) {
        newErrors.question = 'Question is required';
      } else if (formData.question.length > 1000) {
        newErrors.question = 'Question must be less than 1000 characters';
      }
    }

    if (formData.answer !== undefined) {
      if (!formData.answer.trim()) {
        newErrors.answer = 'Answer is required';
      } else if (formData.answer.length > 500) {
        newErrors.answer = 'Answer must be less than 500 characters';
      }
    }

    if (formData.secret !== undefined) {
      if (!formData.secret.trim()) {
        newErrors.secret = 'Secret is required';
      } else if (formData.secret.length > 1000) {
        newErrors.secret = 'Secret must be less than 1000 characters';
      }
    }

    if (formData.order !== undefined && Number(formData.order) < 1) {
      newErrors.order = 'Order must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    updateQuestion.mutate({ id: question._id, data: formData });
    onClose();
  };

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Blackbox Question</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Question"
            multiline
            rows={3}
            value={formData.question || ''}
            onChange={(e) => handleInputChange('question', e.target.value)}
            error={!!errors.question}
            helperText={
              errors.question || 'Enter the question text (max 1000 characters)'
            }
            fullWidth
          />

          <TextField
            label="Answer"
            value={formData.answer || ''}
            onChange={(e) => handleInputChange('answer', e.target.value)}
            error={!!errors.answer}
            helperText={
              errors.answer || 'Enter the correct answer (max 500 characters)'
            }
            fullWidth
          />

          <TextField
            label="Secret"
            multiline
            rows={3}
            value={formData.secret || ''}
            onChange={(e) => handleInputChange('secret', e.target.value)}
            error={!!errors.secret}
            helperText={
              errors.secret ||
              'Enter the secret that will be revealed when answered correctly (max 1000 characters)'
            }
            fullWidth
          />

          <TextField
            label="Order"
            type="number"
            value={formData.order || ''}
            onChange={(e) =>
              handleInputChange('order', parseInt(e.target.value) || 1)
            }
            error={!!errors.order}
            helperText={
              errors.order || 'Enter the sequence order for this question'
            }
            fullWidth
            inputProps={{ min: 1 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive ?? false}
                onChange={(e) =>
                  handleInputChange('isActive', e.target.checked)
                }
              />
            }
            label="Active"
          />

          <Alert severity="info">
            <strong>Note:</strong> Changing the order may affect the sequence of
            questions. Users must answer questions in order to progress.
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
          disabled={updateQuestion.isPending}
          sx={{ bgcolor: '#2FD65D', '&:hover': { bgcolor: '#2AC152' } }}
        >
          {updateQuestion.isPending ? 'Updating...' : 'Update Question'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
