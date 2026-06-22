import { useEffect, useRef, useState } from 'react';
import { Box, Typography, Snackbar, Alert, IconButton, Tooltip } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import type { SavedSession } from '../types/test';
import { formatTime, getTimerState } from '../utils/timer';

interface Props {
  session: SavedSession;
  onExpire: () => void;
  onTogglePause: () => void;
}

export function Timer({ session, onExpire, onTogglePause }: Props) {
  const [state, setState] = useState(() => getTimerState(session));
  const warningsShown = useRef<Set<string>>(new Set());
  const [activeWarning, setActiveWarning] = useState<string | null>(null);
  const expiredRef = useRef(false);

  useEffect(() => {
    if (!session.timerStartedAt || !session.timerDurationMinutes) return;

    const tick = () => {
      const next = getTimerState(session);
      setState(next);

      if (next.isPaused) return;

      if (next.isExpired && !expiredRef.current) {
        expiredRef.current = true;
        onExpire();
        return;
      }

      const warnKey =
        next.warningLevel === 'ten'
          ? '10min'
          : next.warningLevel === 'five'
            ? '5min'
            : next.warningLevel === 'one'
              ? '1min'
              : null;

      if (warnKey && !warningsShown.current.has(warnKey)) {
        warningsShown.current.add(warnKey);
        const messages: Record<string, string> = {
          '10min': '10 minutes remaining',
          '5min': '5 minutes remaining',
          '1min': '1 minute remaining',
        };
        setActiveWarning(messages[warnKey]);
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [session, onExpire]);

  if (!state.hasTimer) return null;

  const isUrgent = !state.isPaused && (state.warningLevel === 'five' || state.warningLevel === 'one');

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          px: 1,
          py: 0.5,
          borderRadius: 1,
          bgcolor: state.isPaused ? 'warning.dark' : isUrgent ? 'error.dark' : 'action.hover',
          animation: isUrgent ? 'pulse 2s infinite' : 'none',
          '@keyframes pulse': {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0.7 },
          },
        }}
        role="timer"
        aria-live="polite"
        aria-label={
          state.isPaused
            ? `Timer paused. Time remaining: ${formatTime(state.remainingMs)}`
            : `Time remaining: ${formatTime(state.remainingMs)}`
        }
      >
        <AccessTimeIcon fontSize="small" />
        <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace', minWidth: 48 }}>
          {formatTime(state.remainingMs)}
        </Typography>
        {state.isPaused && (
          <Typography variant="caption" sx={{ fontWeight: 600, ml: 0.5 }}>
            PAUSED
          </Typography>
        )}
        <Tooltip title={state.isPaused ? 'Resume timer' : 'Pause timer'}>
          <IconButton
            size="small"
            onClick={onTogglePause}
            aria-label={state.isPaused ? 'Resume timer' : 'Pause timer'}
            sx={{ ml: 0.5 }}
          >
            {state.isPaused ? <PlayArrowIcon fontSize="small" /> : <PauseIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>

      <Snackbar
        open={!!activeWarning}
        autoHideDuration={5000}
        onClose={() => setActiveWarning(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="warning" onClose={() => setActiveWarning(null)}>
          {activeWarning}
        </Alert>
      </Snackbar>
    </>
  );
}
