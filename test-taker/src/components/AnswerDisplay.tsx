import { Box, Chip, Typography } from '@mui/material';
import type { Answer, Question, QuestionGrade } from '../types/test';
import { ContentRenderer } from './ContentRenderer';
import { ChoiceLabel } from './ChoiceLabel';
import { isAnswered } from '../utils/answers';

interface Props {
  question: Question;
  answer: Answer;
  grade?: QuestionGrade;
}

export function AnswerDisplay({ question, answer, grade }: Props) {
  const answered = isAnswered(question, answer);

  if (!answered) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
        No answer provided
      </Typography>
    );
  }

  const renderValue = () => {
    switch (question.question_type) {
      case 'multiple_choice':
      case 'true_false':
        return <ChoiceLabel content={String(answer)} />;
      case 'multiple_select':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {(answer as string[]).map((item, i) => (
              <Box key={i} sx={{ px: 2, py: 1, borderRadius: 2, bgcolor: 'action.hover' }}>
                <ChoiceLabel content={item} />
              </Box>
            ))}
          </Box>
        );
      case 'short_answer':
      case 'numeric':
        return (
          <Typography variant="body1" sx={{ px: 2, py: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}>
            {String(answer)}
          </Typography>
        );
      case 'paragraph':
      case 'essay':
        return (
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderRadius: 2,
              bgcolor: 'action.hover',
              '& p': { mb: 1 },
            }}
            dangerouslySetInnerHTML={{ __html: String(answer) }}
          />
        );
      case 'matching':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {Object.entries(answer as Record<string, string>).map(([left, right]) => (
              <Box
                key={left}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 1,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  bgcolor: 'action.hover',
                }}
              >
                <ChoiceLabel content={left} />
                <ChoiceLabel content={right} />
              </Box>
            ))}
          </Box>
        );
      case 'ordering':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {(answer as string[]).map((item, i) => (
              <Box
                key={i}
                sx={{ display: 'flex', gap: 1, px: 2, py: 1, borderRadius: 2, bgcolor: 'action.hover' }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 20 }}>
                  {i + 1}.
                </Typography>
                <ChoiceLabel content={item} />
              </Box>
            ))}
          </Box>
        );
      default:
        return <Typography>{String(answer)}</Typography>;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Your answer
        </Typography>
        {grade?.correct === true && <Chip label="Correct" size="small" color="success" />}
        {grade?.correct === false && <Chip label="Incorrect" size="small" color="error" />}
        {grade?.correct === null && <Chip label="Not graded" size="small" variant="outlined" />}
        {grade && grade.points_possible > 0 && (
          <Chip
            label={`${grade.points_earned}/${grade.points_possible} pts`}
            size="small"
            variant="outlined"
          />
        )}
      </Box>
      {renderValue()}
      {grade?.explanation && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 3,
            bgcolor: 'action.hover',
            borderLeft: 4,
            borderColor: grade.correct ? 'success.main' : 'error.main',
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600 }}>
            Explanation
          </Typography>
          <ContentRenderer content={grade.explanation} />
        </Box>
      )}
    </Box>
  );
}
