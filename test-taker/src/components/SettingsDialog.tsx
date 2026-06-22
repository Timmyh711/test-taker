import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { AccentColor, ThemeMode } from '../types/test';
import { ACCENT_OPTIONS } from '../theme/theme';

interface Props {
  open: boolean;
  themeMode: ThemeMode;
  accentColor: AccentColor;
  onClose: () => void;
  onThemeModeChange: (mode: ThemeMode) => void;
  onAccentChange: (accent: AccentColor) => void;
}

export function SettingsDialog({
  open,
  themeMode,
  accentColor,
  onClose,
  onThemeModeChange,
  onAccentChange,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Settings
        <IconButton onClick={onClose} aria-label="Close settings" size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mb: 3, mt: 1 }}>
          <InputLabel id="theme-mode-label">Appearance</InputLabel>
          <Select
            labelId="theme-mode-label"
            value={themeMode}
            label="Appearance"
            onChange={(e) => onThemeModeChange(e.target.value as ThemeMode)}
          >
            <MenuItem value="dark">Dark</MenuItem>
            <MenuItem value="light">Light</MenuItem>
            <MenuItem value="auto">Auto (system)</MenuItem>
          </Select>
        </FormControl>

        <Typography variant="subtitle2" gutterBottom>
          Accent color
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {ACCENT_OPTIONS.map((opt) => (
            <Button
              key={opt.id}
              variant={accentColor === opt.id ? 'contained' : 'outlined'}
              onClick={() => onAccentChange(opt.id)}
              sx={{
                minWidth: 80,
                borderColor: opt.color,
                ...(accentColor === opt.id ? { bgcolor: opt.color } : { color: opt.color }),
              }}
            >
              {opt.label}
            </Button>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Done</Button>
      </DialogActions>
    </Dialog>
  );
}
