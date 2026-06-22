import { Box, Typography } from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import type { Question, QuestionGrade, QuestionStatus } from '../types/test';
import { statusColors } from '../theme/theme';

const DRAWER_WIDTH = 88;

interface Props {
  questions: Question[];
  currentIndex: number;
  statuses: QuestionStatus[];
  onSelect: (index: number) => void;
  grades?: QuestionGrade[];
}

export function Sidebar({ questions, currentIndex, statuses, onSelect, grades }: Props) {
  const gradeMap = new Map(grades?.map((g) => [g.q_number, g]));

  return (
    <Box
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        borderRight: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
          {questions.length} Qs
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.75,
          alignItems: 'center',
        }}
      >
        {questions.map((q, i) => {
          const status = statuses[i];
          const grade = gradeMap.get(q.q_number);
          const isSelected = i === currentIndex;

          let borderColor = statusColors[status];
          if (grade?.correct === true) borderColor = statusColors.answered;
          if (grade?.correct === false) borderColor = statusColors.flagged;

          return (
            <Box
              key={q.q_number}
              component="button"
              onClick={() => onSelect(i)}
              aria-label={`Question ${q.q_number}`}
              aria-current={isSelected ? 'true' : undefined}
              sx={{
                position: 'relative',
                width: 44,
                height: 44,
                border: 'none',
                borderRadius: 3,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'inherit',
                fontSize: '0.875rem',
                fontWeight: isSelected ? 700 : 500,
                bgcolor: isSelected ? 'primary.main' : 'action.hover',
                color: isSelected ? 'primary.contrastText' : 'text.primary',
                boxShadow: isSelected ? 2 : 0,
                outline: '2px solid',
                outlineColor: isSelected ? 'primary.main' : 'transparent',
                outlineOffset: 2,
                transition: 'all 0.15s ease',
                '&:hover': {
                  bgcolor: isSelected ? 'primary.dark' : 'action.selected',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 6,
                  bottom: 6,
                  width: 3,
                  borderRadius: 2,
                  bgcolor: borderColor,
                },
              }}
            >
              {q.q_number}
              {status === 'flagged' && (
                <FlagIcon
                  sx={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    fontSize: 14,
                    color: 'error.main',
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export { DRAWER_WIDTH };
