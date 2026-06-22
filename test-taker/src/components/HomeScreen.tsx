import { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  CardActions,
  Chip,
  Grid,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import HistoryIcon from '@mui/icons-material/History';
import PauseCircleOutlinedIcon from '@mui/icons-material/PauseCircleOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import type { SavedSession, TestData, TestHistoryEntry } from '../types/test';
import { validateTestJson } from '../utils/validation';
import { getGreeting } from '../utils/greeting';
import { formatTime, getTimerState } from '../utils/timer';
import { isAnswered } from '../utils/answers';
import type { Answer } from '../types/test';
import { HOME_HISTORY_LIMIT } from '../utils/storage';
import { AppHeader } from './AppHeader';
import { HistoryList } from './HistoryList';

interface Props {
  pendingResume: SavedSession | null;
  history: TestHistoryEntry[];
  onImport: (test: TestData) => void;
  onResume: () => void;
  onDiscard: () => void;
  onViewHistory: () => void;
  onViewTest: (id: string) => void;
  onOpenSettings: () => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function HomeScreen({
  pendingResume,
  history,
  onImport,
  onResume,
  onDiscard,
  onViewHistory,
  onViewTest,
  onOpenSettings,
}: Props) {
  const [jsonText, setJsonText] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const recentHistory = history.slice(0, HOME_HISTORY_LIMIT);

  const handleImport = () => {
    setErrors([]);
    try {
      const parsed = JSON.parse(jsonText);
      const result = validateTestJson(parsed);
      if (!result.valid) {
        setErrors(result.errors);
        return;
      }
      onImport(parsed as TestData);
    } catch (e) {
      setErrors([`Invalid JSON syntax: ${(e as Error).message}`]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setJsonText(ev.target?.result as string);
      setErrors([]);
    };
    reader.readAsText(file);
  };

  const resumeAnswered = pendingResume
    ? pendingResume.test.questions.filter((q) =>
        isAnswered(q, pendingResume.responses[String(q.q_number)] as Answer | undefined)
      ).length
    : 0;
  const resumeTimer = pendingResume ? getTimerState(pendingResume) : null;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4, px: 3 }}>
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        <AppHeader onOpenSettings={onOpenSettings} onHistory={onViewHistory} />

        <Typography variant="h4" color="primary" sx={{ mb: 0.5 }}>
          {getGreeting()}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Welcome to Test Taker — import a test or pick up where you left off.
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {pendingResume && (
            <Grid size={{ xs: 12, md: recentHistory.length > 0 ? 6 : 12 }}>
              <Card
                sx={{
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'primary.main',
                  bgcolor: 'background.paper',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <PauseCircleOutlinedIcon color="primary" />
                    <Typography variant="h6">Resume Test</Typography>
                    {resumeTimer?.isPaused && (
                      <Chip label="Timer Paused" size="small" color="warning" />
                    )}
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    {pendingResume.test.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Started {formatDate(pendingResume.startedAt)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Progress: {resumeAnswered} / {pendingResume.test.questions.length} answered
                  </Typography>
                  {resumeTimer?.hasTimer && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                      <AccessTimeIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {resumeTimer.isExpired
                          ? 'Time expired'
                          : `Time remaining: ${formatTime(resumeTimer.remainingMs)}`}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button variant="contained" startIcon={<PlayArrowIcon />} onClick={onResume}>
                    Resume
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<DeleteOutlinedIcon />}
                    onClick={onDiscard}
                  >
                    Discard
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )}

          {recentHistory.length > 0 && (
            <Grid size={{ xs: 12, md: pendingResume ? 6 : 12 }}>
              <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <HistoryIcon color="primary" />
                      <Typography variant="h6">Recently Completed</Typography>
                    </Box>
                  </Box>
                  <HistoryList entries={recentHistory} onSelect={onViewTest} />
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>

        {history.length === 0 && !pendingResume && (
          <Paper sx={{ p: 3, mb: 4, textAlign: 'center' }}>
            <HistoryIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
            <Typography color="text.secondary">
              Complete a test to see it in your history.
            </Typography>
          </Paper>
        )}

        <Paper sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom>
            Import New Test
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Paste or upload a test JSON file to begin.
          </Typography>

          <TextField
            fullWidth
            multiline
            minRows={10}
            maxRows={18}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder='{"title": "My Test", "questions": [...]}'
            label="Test JSON"
            sx={{ mb: 2, fontFamily: 'monospace' }}
            slotProps={{ htmlInput: { 'aria-label': 'Test JSON input' } }}
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<UploadFileIcon />}
              onClick={handleImport}
              disabled={!jsonText.trim()}
            >
              Import Test
            </Button>
            <Button variant="outlined" component="label">
              Upload File
              <input type="file" accept=".json,application/json" hidden onChange={handleFileUpload} />
            </Button>
          </Box>

          {errors.length > 0 && (
            <Alert severity="error">
              <AlertTitle>Validation Errors</AlertTitle>
              <List dense disablePadding>
                {errors.map((err, i) => (
                  <ListItem key={i} disablePadding>
                    <ListItemText primary={err} />
                  </ListItem>
                ))}
              </List>
            </Alert>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
