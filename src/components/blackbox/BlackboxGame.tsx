'use client';

import {
  useAnswerBlackboxQuestion,
  useResetBlackboxProgress,
  useUserBlackboxProgress,
} from '@/hooks/blackbox';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LockIcon from '@mui/icons-material/Lock';
import ReplayIcon from '@mui/icons-material/Replay';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

export function BlackboxGame() {
  const [currentAnswer, setCurrentAnswer] = useState('');

  const { data: progress, isLoading, error } = useUserBlackboxProgress();
  const answerQuestion = useAnswerBlackboxQuestion();
  const resetGame = useResetBlackboxProgress();
  const handleSubmitAnswer = () => {
    if (!progress?.data?.nextQuestion || !currentAnswer.trim()) {
      return;
    }

    answerQuestion.mutate({
      questionId: progress.data.nextQuestion._id,
      answer: currentAnswer.trim(),
    });
    setCurrentAnswer('');
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Error loading progress: {error.message}</Alert>
      </Box>
    );
  }

  if (!progress?.data) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">No progress data available.</Alert>
      </Box>
    );
  }

  const {
    answeredQuestions,
    nextQuestion,
    totalQuestions,
    answeredCount,
    remainingCount,
  } = progress.data;

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontFamily: 'ClashDisplay', fontWeight: 700 }}
          gutterBottom
        >
          Blackbox Challenge
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Answer questions to reveal hidden clues!
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
          <Chip
            icon={<CheckCircleIcon />}
            label={`${answeredCount} Answered`}
            color="success"
            variant="outlined"
          />
          <Chip
            icon={<LockIcon />}
            label={`${remainingCount} Remaining`}
            color="primary"
            variant="outlined"
          />
          <Chip
            icon={<EmojiEventsIcon />}
            label={`${totalQuestions} Total`}
            color="secondary"
            variant="outlined"
          />
        </Box>
        <LinearProgress
          variant="determinate"
          value={(answeredCount / totalQuestions) * 100}
          sx={{ mt: 2, height: 8, borderRadius: 4 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ReplayIcon />}
            onClick={() => resetGame.mutate()}
            disabled={resetGame.isPending}
          >
            Reset Game
          </Button>
        </Box>
      </Paper>

      {nextQuestion ? (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Chip
                label={`Question ${nextQuestion.order}`}
                color="primary"
                size="small"
              />
              <Typography variant="body2" color="text.secondary">
                {answeredCount + 1} of {totalQuestions}
              </Typography>
            </Box>

            <Typography variant="h6" gutterBottom>
              {nextQuestion.question}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <TextField
              fullWidth
              label="Your Answer"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer here..."
              disabled={answerQuestion.isPending}
              sx={{ mb: 2 }}
            />

            <Alert severity="info">
              <strong>Tip:</strong> Answers are case-insensitive. Make sure to
              check your spelling!
            </Alert>
          </CardContent>
          <CardActions>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmitAnswer}
              disabled={!currentAnswer.trim() || answerQuestion.isPending}
              sx={{ bgcolor: '#2FD65D', '&:hover': { bgcolor: '#2AC152' } }}
            >
              {answerQuestion.isPending ? 'Submitting...' : 'Submit Answer'}
            </Button>
          </CardActions>
        </Card>
      ) : (
        <Card sx={{ mb: 3, textAlign: 'center' }}>
          <CardContent>
            <EmojiEventsIcon sx={{ fontSize: 64, color: '#FFD700', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              🎉 Congratulations!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              You have answered all the questions and revealed all the clues!
            </Typography>
          </CardContent>
        </Card>
      )}

      {answeredQuestions.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Clues Revealed
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {answeredQuestions.map((item) => (
              <Box
                key={item._id}
                sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
                >
                  <Chip label={`Q${item.order}`} size="small" color="success" />
                  <Typography variant="body2" color="text.secondary">
                    {new Date(
                      item.userAnswer?.answeredAt || '',
                    ).toLocaleDateString()}
                  </Typography>
                </Box>

                <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                  {item.question}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  <strong>Your Answer:</strong> {item.userAnswer?.userAnswer}
                </Typography>

                <Alert severity="success" sx={{ mt: 1 }}>
                  <strong>Clue Revealed:</strong> {item.secret}
                </Alert>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
