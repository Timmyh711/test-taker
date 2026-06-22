import { Box } from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import type { QuestionStatus } from '../types/test';
import { statusColors } from '../theme/theme';

interface Props {
  questionNumbers: number[];
  currentIndex?: number;
  statuses: QuestionStatus[];
  onSelect: (index: number) => void;
  compact?: boolean;
}

export function QuestionNavGrid({
  questionNumbers,
  currentIndex,
  statuses,
  onSelect,
  compact,
}: Props) {
  const btnSize = compact ? 40 : 44;

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {questionNumbers.map((qNum, i) => {
        const status = statuses[i];
        const isSelected = currentIndex === i;

        return (
          <Box
            key={qNum}
            component="button"
            onClick={() => onSelect(i)}
            aria-label={`Question ${qNum}`}
            sx={{
              position: 'relative',
              width: btnSize,
              height: btnSize,
              border: 'none',
              borderRadius: 3,
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '0.875rem',
              fontWeight: isSelected ? 700 : 500,
              bgcolor: isSelected ? 'primary.main' : 'action.hover',
              color: isSelected ? 'primary.contrastText' : 'text.primary',
              boxShadow: isSelected ? 1 : 0,
              transition: 'all 0.15s ease',
              '&:hover': { bgcolor: isSelected ? 'primary.dark' : 'action.selected' },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 4,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: statusColors[status],
              },
            }}
          >
            {qNum}
            {status === 'flagged' && (
              <FlagIcon
                sx={{ position: 'absolute', top: -3, right: -3, fontSize: 12, color: 'error.main' }}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
}
