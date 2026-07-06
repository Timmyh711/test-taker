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
  Stack,
  Divider,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
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
  const [pasteMessage, setPasteMessage] = useState<string | null>(null);
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

  const handlePaste = async () => {
    setPasteMessage(null);
    setErrors([]);
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) {
        setPasteMessage('Clipboard is empty.');
        return;
      }
      setJsonText(text);
      setPasteMessage('Pasted from clipboard.');
    } catch {
      setPasteMessage('Could not read clipboard. Try Ctrl+V in the text field.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setJsonText(ev.target?.result as string);
      setErrors([]);
      setPasteMessage(null);
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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ maxWidth: 960, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
        <AppHeader onOpenSettings={onOpenSettings} onHistory={onViewHistory} />

        {/* Hero */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3 },
            mb: 3,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="h4" color="primary" sx={{ mb: 0.5 }}>
            {getGreeting()}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Import a test JSON below, or pick up where you left off.
          </Typography>
        </Paper>

        {/* Resume & History row */}
        {(pendingResume || recentHistory.length > 0) && (
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
            {pendingResume && (
              <Card
                variant="outlined"
                sx={{
                  flex: 1,
                  borderColor: 'primary.main',
                  bgcolor: 'background.paper',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <PauseCircleOutlinedIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Resume Test
                    </Typography>
                    {resumeTimer?.isPaused && (
                      <Chip label="Paused" size="small" color="warning" />
                    )}
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {pendingResume.test.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {resumeAnswered}/{pendingResume.test.questions.length} answered · Started {formatDate(pendingResume.startedAt)}
                  </Typography>
                  {resumeTimer?.hasTimer && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                      <AccessTimeIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {resumeTimer.isExpired
                          ? 'Time expired'
                          : formatTime(resumeTimer.remainingMs) + ' left'}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                  <Button variant="contained" startIcon={<PlayArrowIcon />} onClick={onResume}>
                    Resume
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<DeleteOutlinedIcon />}
                    onClick={onDiscard}
                    sx={{ color: 'text.primary', borderColor: 'divider' }}
                  >
                    Discard
                  </Button>
                </CardActions>
              </Card>
            )}

            {recentHistory.length > 0 && (
              <Card variant="outlined" sx={{ flex: 1, bgcolor: 'background.paper' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <HistoryIcon color="primary" fontSize="small" />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Recent Tests
                      </Typography>
                    </Box>
                    {history.length > HOME_HISTORY_LIMIT && (
                      <Button size="small" onClick={onViewHistory}>
                        View all
                      </Button>
                    )}
                  </Box>
                  <HistoryList entries={recentHistory} onSelect={onViewTest} />
                </CardContent>
              </Card>
            )}
          </Stack>
        )}

        {history.length === 0 && !pendingResume && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              textAlign: 'center',
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'divider',
            }}
          >
            <HistoryIcon sx={{ fontSize: 36, color: 'text.disabled', mb: 1 }} />
            <Typography color="text.secondary" variant="body2">
              Complete a test to see it in your history.
            </Typography>
          </Paper>
        )}

        {/* Import section */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Import New Test
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Paste JSON from your clipboard, upload a file, or type directly.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              mb: 1.5,
              p: 1,
              bgcolor: 'background.default',
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
            }}
          >
            <Button size="small" startIcon={<ContentPasteIcon />} onClick={handlePaste} variant="outlined">
              Paste
            </Button>
            <Button size="small" variant="outlined" component="label" startIcon={<UploadFileIcon />}>
              Upload File
              <input type="file" accept=".json,application/json" hidden onChange={handleFileUpload} />
            </Button>
            {jsonText && (
              <Button
                size="small"
                variant="text"
                color="inherit"
                onClick={() => {
                  setJsonText('');
                  setErrors([]);
                  setPasteMessage(null);
                }}
                sx={{ ml: 'auto', color: 'text.secondary' }}
              >
                Clear
              </Button>
            )}
          </Box>

          {pasteMessage && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              {pasteMessage}
            </Typography>
          )}

          <TextField
            fullWidth
            multiline
            minRows={10}
            maxRows={20}
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              setPasteMessage(null);
            }}
            placeholder='{"title": "My Test", "questions": [...]}'
            label="Test JSON"
            sx={{
              mb: 2,
              '& .MuiInputBase-input': { fontFamily: 'monospace', fontSize: '0.85rem' },
            }}
            slotProps={{ htmlInput: { 'aria-label': 'Test JSON input' } }}
          />

          <Divider sx={{ mb: 2 }} />

          <Button
            variant="contained"
            size="large"
            startIcon={<UploadFileIcon />}
            onClick={handleImport}
            disabled={!jsonText.trim()}
          >
            Start Test
          </Button>

          {errors.length > 0 && (
            <Alert severity="error" sx={{ mt: 2 }}>
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
