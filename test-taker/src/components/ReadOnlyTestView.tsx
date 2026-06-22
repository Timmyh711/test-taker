import { useCallback, useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Chip, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import type { Answer, TestHistoryEntry } from '../types/test';
import { outputToReadOnlySession } from '../utils/history';
import { getDefaultAnswer, getQuestionStatus } from '../utils/answers';
import { getQuestionGrade } from '../utils/grading';
import { Sidebar } from './Sidebar';
import { QuestionPanel } from './QuestionPanel';
import { formatHistoryDate, formatDuration } from './HistoryList';

interface Props {
  entry: TestHistoryEntry;
  onBack: () => void;
}

export function ReadOnlyTestView({ entry, onBack }: Props) {
  const session = outputToReadOnlySession(entry.output);
  const grading = entry.output.metadata.grading;
  const [currentIndex, setCurrentIndex] = useState(0);
  const questions = session.test.questions;
  const currentQuestion = questions[currentIndex];

  const getAnswer = useCallback(
    (qNumber: number): Answer => {
      const stored = session.responses[String(qNumber)];
      if (stored !== undefined) return stored;
      const question = questions.find((q) => q.q_number === qNumber);
      return question ? getDefaultAnswer(question) : '';
    },
    [session.responses, questions]
  );

  const statuses = questions.map((q) =>
    getQuestionStatus(q, session.responses[String(q.q_number)] as Answer | undefined, false)
  );

  if (!currentQuestion) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={onBack} color="inherit">
            Back
          </Button>
          <Typography variant="h6" sx={{ flexGrow: 1 }} noWrap>
            {entry.test_title}
          </Typography>
          {grading && (
            <Chip
              label={`${grading.score}/${grading.max_score} (${grading.percentage}%)`}
              size="small"
              color="primary"
            />
          )}
          <Chip icon={<VisibilityIcon />} label="Read-only" size="small" variant="outlined" />
        </Toolbar>
      </AppBar>

      <Box sx={{ px: 3, py: 1.5, bgcolor: 'action.hover', borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary">
          Completed {formatHistoryDate(entry.completed_at)} · {entry.answered_count}/{entry.total_questions} answered · {formatDuration(entry.time_spent_seconds)}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar
          questions={questions}
          currentIndex={currentIndex}
          statuses={statuses}
          onSelect={setCurrentIndex}
          grades={grading?.results}
        />
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <QuestionPanel
            question={currentQuestion}
            answer={getAnswer(currentQuestion.q_number)}
            onChange={() => {}}
            readOnly
            grade={getQuestionGrade(grading, currentQuestion.q_number)}
          />
        </Box>
      </Box>
    </Box>
  );
}
