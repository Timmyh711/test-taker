import { Box, Button } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FlagIcon from '@mui/icons-material/Flag';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import SendIcon from '@mui/icons-material/Send';

interface Props {
  currentIndex: number;
  totalQuestions: number;
  isFlagged: boolean;
  hasHint?: boolean;
  hintVisible?: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onFlag: () => void;
  onToggleHint?: () => void;
  onSubmit: () => void;
}

export function BottomControls({
  currentIndex,
  totalQuestions,
  isFlagged,
  hasHint,
  hintVisible,
  onPrevious,
  onNext,
  onFlag,
  onToggleHint,
  onSubmit,
}: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        gap: 1,
        flexWrap: 'wrap',
      }}
    >
      <Button
        startIcon={<NavigateBeforeIcon />}
        onClick={onPrevious}
        disabled={currentIndex === 0}
        aria-label="Previous question"
      >
        Previous
      </Button>

      <Box sx={{ display: 'flex', gap: 1 }}>
        {hasHint && onToggleHint && (
          <Button
            startIcon={<LightbulbOutlinedIcon />}
            onClick={onToggleHint}
            color={hintVisible ? 'info' : 'inherit'}
            variant={hintVisible ? 'contained' : 'outlined'}
            aria-label={hintVisible ? 'Hide hint' : 'Show hint'}
            aria-pressed={hintVisible}
          >
            {hintVisible ? 'Hide Hint' : 'Hint'}
          </Button>
        )}
        <Button
          startIcon={<FlagIcon />}
          onClick={onFlag}
          color={isFlagged ? 'error' : 'inherit'}
          variant={isFlagged ? 'contained' : 'outlined'}
          aria-label={isFlagged ? 'Unflag question' : 'Flag question'}
          aria-pressed={isFlagged}
        >
          {isFlagged ? 'Flagged' : 'Flag'}
        </Button>
        {currentIndex === totalQuestions - 1 && (
          <Button
            startIcon={<SendIcon />}
            onClick={onSubmit}
            variant="contained"
            color="primary"
            aria-label="Submit test"
          >
            Submit Test
          </Button>
        )}
      </Box>

      <Button
        endIcon={<NavigateNextIcon />}
        onClick={onNext}
        disabled={currentIndex >= totalQuestions - 1}
        aria-label="Next question"
      >
        Next
      </Button>
    </Box>
  );
}
