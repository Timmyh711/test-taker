import {
  Box,
  Chip,
  Divider,
  ListItemButton,
  Typography,
} from '@mui/material';
import type { TestHistoryEntry } from '../types/test';

interface Props {
  entries: TestHistoryEntry[];
  onSelect: (id: string) => void;
}

export function formatHistoryDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export function HistoryList({ entries, onSelect }: Props) {
  if (entries.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No completed tests yet.
      </Typography>
    );
  }

  return (
    <Box>
      {entries.map((entry, i) => (
        <Box key={entry.id}>
          {i > 0 && <Divider sx={{ my: 0.5 }} />}
          <ListItemButton
            onClick={() => onSelect(entry.id)}
            sx={{ py: 1.5, px: 0, flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {entry.test_title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatHistoryDate(entry.completed_at)} · {entry.answered_count}/{entry.total_questions} answered · {formatDuration(entry.time_spent_seconds)}
            </Typography>
            <Chip
              label={entry.submission_reason === 'timer_expired' ? 'Timer expired' : 'Submitted'}
              size="small"
              variant="outlined"
              sx={{ mt: 0.5 }}
            />
          </ListItemButton>
        </Box>
      ))}
    </Box>
  );
}
