import {
  Box,
  Button,
  Paper,
  Typography,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import type { SavedSession } from '../types/test';
import { isAnswered, getQuestionStatus } from '../utils/answers';
import type { Answer } from '../types/test';
import { formatTime, getTimerState } from '../utils/timer';
import { QuestionNavGrid } from './QuestionNavGrid';

interface Props {
  session: SavedSession;
  onBack: () => void;
  onSubmit: () => void;
  onJumpTo: (index: number) => void;
}

export function ReviewScreen({ session, onBack, onSubmit, onJumpTo }: Props) {
  const questions = session.test.questions;
  const answered = questions.filter((q) =>
    isAnswered(q, session.responses[String(q.q_number)] as Answer | undefined)
  );
  const unanswered = questions.filter(
    (q) => !isAnswered(q, session.responses[String(q.q_number)] as Answer | undefined)
  );
  const flagged = questions.filter((q) => session.flagged.includes(q.q_number));
  const timer = getTimerState(session);

  const statuses = questions.map((q) =>
    getQuestionStatus(
      q,
      session.responses[String(q.q_number)] as Answer | undefined,
      session.flagged.includes(q.q_number)
    )
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 3 }}>
      <Paper sx={{ maxWidth: 720, mx: 'auto', p: { xs: 2, md: 4 } }}>
        <Typography variant="h5" gutterBottom>
          Review Before Submit
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Review your answers or jump back to any question before submitting.
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
          <Stat label="Total" value={questions.length} />
          <Stat label="Answered" value={answered.length} color="success.main" />
          <Stat label="Unanswered" value={unanswered.length} color="warning.main" />
          <Stat label="Flagged" value={flagged.length} color="error.main" />
          {timer.hasTimer && (
            <Stat label="Time left" value={formatTime(timer.remainingMs)} color="primary.main" />
          )}
        </Box>

        <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
          All questions — tap to review
        </Typography>
        <QuestionNavGrid
          questionNumbers={questions.map((q) => q.q_number)}
          statuses={statuses}
          onSelect={onJumpTo}
        />

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
          <Button startIcon={<ArrowBackIcon />} onClick={onBack} variant="outlined">
            Back to Test
          </Button>
          <Button variant="contained" startIcon={<SendIcon />} onClick={onSubmit} color="primary">
            Confirm Submit
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

function Stat({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 3 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h6" color={color ?? 'text.primary'}>
        {value}
      </Typography>
    </Box>
  );
}
