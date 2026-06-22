import { Box, Paper, Typography } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import type { TestHistoryEntry } from '../types/test';
import { AppHeader } from './AppHeader';
import { HistoryList } from './HistoryList';

interface Props {
  history: TestHistoryEntry[];
  onSelect: (id: string) => void;
  onBack: () => void;
  onOpenSettings: () => void;
}

export function HistoryScreen({ history, onSelect, onBack, onOpenSettings }: Props) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4, px: 3 }}>
      <Box sx={{ maxWidth: 700, mx: 'auto' }}>
        <AppHeader onOpenSettings={onOpenSettings} onBack={onBack} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <HistoryIcon color="primary" />
          <Typography variant="h5">
            Test History
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {history.length} completed test{history.length !== 1 ? 's' : ''}. Click any test to view responses (read-only).
        </Typography>
        <Paper sx={{ p: 3 }}>
          <HistoryList entries={history} onSelect={onSelect} />
        </Paper>
      </Box>
    </Box>
  );
}
