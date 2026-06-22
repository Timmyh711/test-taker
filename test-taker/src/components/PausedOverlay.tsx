import { Box, Button, Paper, Typography } from '@mui/material';
import PauseCircleOutlinedIcon from '@mui/icons-material/PauseCircleOutlined';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { formatTime, getTimerState } from '../utils/timer';
import type { SavedSession } from '../types/test';

interface Props {
  session: SavedSession;
  onResume: () => void;
}

export function PausedOverlay({ session, onResume }: Props) {
  const timer = getTimerState(session);
  if (!timer.isPaused) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 1400,
        bgcolor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="paused-title"
    >
      <Paper sx={{ p: 4, maxWidth: 420, width: '100%', textAlign: 'center' }}>
        <PauseCircleOutlinedIcon sx={{ fontSize: 56, color: 'warning.main', mb: 2 }} />
        <Typography id="paused-title" variant="h5" gutterBottom>
          Test Paused
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          The timer is paused. Resume to continue your test.
        </Typography>
        {timer.hasTimer && (
          <Typography variant="h6" sx={{ fontFamily: 'monospace', mb: 3 }}>
            {formatTime(timer.remainingMs)} remaining
          </Typography>
        )}
        <Button
          variant="contained"
          size="large"
          startIcon={<PlayArrowIcon />}
          onClick={onResume}
          autoFocus
        >
          Resume Test
        </Button>
      </Paper>
    </Box>
  );
}
