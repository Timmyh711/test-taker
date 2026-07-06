import { Box, Button, IconButton, Tooltip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HistoryIcon from '@mui/icons-material/History';

interface Props {
  onOpenSettings: () => void;
  onBack?: () => void;
  backLabel?: string;
  onHistory?: () => void;
}

export function AppHeader({
  onOpenSettings,
  onBack,
  backLabel = 'Back to Home',
  onHistory,
}: Props) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Box>
        {onBack && (
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            variant="outlined"
            sx={{
              color: 'text.primary',
              borderColor: 'divider',
              '&:hover': { borderColor: 'text.secondary', bgcolor: 'action.hover' },
            }}
            aria-label={backLabel}
          >
            {backLabel}
          </Button>
        )}
        {onHistory && (
          <Button
            startIcon={<HistoryIcon />}
            onClick={onHistory}
            variant="outlined"
            aria-label="Open test history"
          >
            Test History
          </Button>
        )}
      </Box>
      <Tooltip title="Settings">
        <IconButton onClick={onOpenSettings} aria-label="Open settings">
          <SettingsIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
