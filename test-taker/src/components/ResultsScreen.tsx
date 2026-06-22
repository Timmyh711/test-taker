import { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Alert,
  Snackbar,
  Chip,
  Divider,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { save } from '@tauri-apps/plugin-dialog';
import { writeTextFile } from '@tauri-apps/plugin-fs';
import type { TestOutput } from '../types/test';
import { ContentRenderer } from './ContentRenderer';

interface Props {
  output: TestOutput;
  onNewTest: () => void;
}

export function ResultsScreen({ output, onNewTest }: Props) {
  const [copied, setCopied] = useState(false);
  const jsonString = JSON.stringify(output, null, 2);
  const grading = output.metadata.grading;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${output.test_title.replace(/\s+/g, '_')}_response.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = async () => {
    try {
      const path = await save({
        defaultPath: `${output.test_title.replace(/\s+/g, '_')}_response.json`,
        filters: [{ name: 'JSON', extensions: ['json'] }],
      });
      if (path) await writeTextFile(path, jsonString);
    } catch {
      handleDownload();
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 3 }}>
      <Paper sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
          <Typography variant="h4">Test Complete</Typography>
        </Box>

        <Typography variant="h6" gutterBottom>
          {output.test_title}
        </Typography>

        {grading && (
          <Box
            sx={{
              my: 3,
              p: 3,
              borderRadius: 3,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              textAlign: 'center',
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {grading.percentage}%
            </Typography>
            <Typography variant="body1">
              {grading.score} / {grading.max_score} points
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, my: 3 }}>
          <Stat label="Total Questions" value={output.metadata.total_questions} />
          <Stat label="Answered" value={output.metadata.answered_count} />
          <Stat label="Unanswered" value={output.metadata.unanswered_count} />
          <Stat label="Flagged" value={output.metadata.flagged_count} />
          <Stat
            label="Time Spent"
            value={`${Math.floor(output.metadata.time_spent_seconds / 60)}m ${output.metadata.time_spent_seconds % 60}s`}
          />
          <Stat
            label="Submission"
            value={output.submission_reason === 'timer_expired' ? 'Timer Expired' : 'User Submitted'}
          />
        </Box>

        {grading && grading.results.some((r) => r.explanation) && (
          <>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Question Review
            </Typography>
            {grading.results
              .filter((r) => r.explanation)
              .map((r) => (
                <Box
                  key={r.q_number}
                  sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: 3,
                    bgcolor: 'action.hover',
                    borderLeft: 4,
                    borderColor: r.correct ? 'success.main' : 'error.main',
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                    <Typography variant="subtitle2">Question {r.q_number}</Typography>
                    {r.correct === true && <Chip label="Correct" size="small" color="success" />}
                    {r.correct === false && <Chip label="Incorrect" size="small" color="error" />}
                    <Chip label={`${r.points_earned}/${r.points_possible} pts`} size="small" variant="outlined" />
                  </Box>
                  <ContentRenderer content={r.explanation!} />
                </Box>
              ))}
            <Divider sx={{ my: 3 }} />
          </>
        )}

        <Typography variant="subtitle2" gutterBottom>
          Response JSON
        </Typography>
        <Box
          component="pre"
          sx={{
            bgcolor: 'action.hover',
            p: 2,
            borderRadius: 3,
            overflow: 'auto',
            maxHeight: 300,
            fontSize: '0.8rem',
            fontFamily: 'monospace',
            mb: 2,
          }}
        >
          {jsonString}
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button startIcon={<ContentCopyIcon />} onClick={handleCopy} variant="outlined">
            Copy JSON
          </Button>
          <Button startIcon={<DownloadIcon />} onClick={handleDownload} variant="outlined">
            Download JSON
          </Button>
          <Button startIcon={<SaveIcon />} onClick={handleSave} variant="outlined">
            Save to File
          </Button>
          <Button startIcon={<RestartAltIcon />} onClick={onNewTest} variant="contained" sx={{ ml: 'auto' }}>
            New Test
          </Button>
        </Box>
      </Paper>

      <Snackbar open={copied} autoHideDuration={3000} onClose={() => setCopied(false)}>
        <Alert severity="success">JSON copied to clipboard</Alert>
      </Snackbar>
    </Box>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 3 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
    </Box>
  );
}
