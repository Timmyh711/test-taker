import { Box, Chip, Typography } from '@mui/material';
import type { Answer, Question, QuestionGrade } from '../types/test';
import { ContentRenderer, QuestionHint, QuestionMedia } from './ContentRenderer';
import { MultipleChoice } from './questions/MultipleChoice';
import { MultipleSelect } from './questions/MultipleSelect';
import { TrueFalse } from './questions/TrueFalse';
import { ShortAnswer } from './questions/ShortAnswer';
import { Numeric } from './questions/Numeric';
import { RichTextEditor } from './questions/RichTextEditor';
import { Matching } from './questions/Matching';
import { Ordering } from './questions/Ordering';
import { AnswerDisplay } from './AnswerDisplay';

interface Props {
  question: Question;
  answer: Answer;
  onChange: (answer: Answer) => void;
  readOnly?: boolean;
  grade?: QuestionGrade;
}

export function QuestionPanel({ question, answer, onChange, readOnly, grade }: Props) {
  const renderAnswer = () => {
    if (readOnly) {
      return <AnswerDisplay question={question} answer={answer} grade={grade} />;
    }

    switch (question.question_type) {
      case 'multiple_choice':
        return (
          <MultipleChoice
            choices={question.choices ?? []}
            value={answer as string}
            onChange={onChange}
          />
        );
      case 'multiple_select':
        return (
          <MultipleSelect
            choices={question.choices ?? []}
            value={answer as string[]}
            onChange={onChange}
          />
        );
      case 'true_false':
        return (
          <TrueFalse
            choices={question.choices ?? ['True', 'False']}
            value={answer as string}
            onChange={onChange}
          />
        );
      case 'short_answer':
        return <ShortAnswer value={answer as string} onChange={onChange} />;
      case 'paragraph':
        return (
          <RichTextEditor value={answer as string} onChange={onChange} minHeight={150} />
        );
      case 'essay':
        return (
          <RichTextEditor
            value={answer as string}
            onChange={onChange}
            minHeight={300}
            autosaveInterval={3000}
          />
        );
      case 'numeric':
        return (
          <Numeric
            value={answer as string}
            onChange={onChange}
            integerOnly={question.integer_only}
            decimalPlaces={question.decimal_places}
          />
        );
      case 'matching':
        return (
          <Matching
            leftItems={question.left_items ?? []}
            rightItems={question.right_items ?? []}
            value={answer as Record<string, string>}
            onChange={onChange}
          />
        );
      case 'ordering':
        return (
          <Ordering
            items={question.items ?? []}
            value={answer as string[]}
            onChange={onChange}
          />
        );
      default:
        return <Typography color="error">Unsupported question type</Typography>;
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Typography variant="h6" color="primary">
          Question {question.q_number}
        </Typography>
        {question.required && (
          <Chip label="Required" size="small" color="primary" variant="outlined" />
        )}
        {question.points !== undefined && (
          <Chip label={`${question.points} pts`} size="small" variant="outlined" />
        )}
      </Box>

      <ContentRenderer
        content={question.question_text}
        latexEnabled={question.latex_enabled !== false}
      />

      <QuestionMedia
        imageUrl={question.image_url}
        audioUrl={question.audio_url}
        videoUrl={question.video_url}
      />

      {question.hint && !readOnly && <QuestionHint hint={question.hint} />}

      <Box sx={{ mt: 3 }} role="group" aria-label="Answer area">
        {!readOnly && question.question_type === 'multiple_select' && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Select all that apply
          </Typography>
        )}
        {renderAnswer()}
      </Box>
    </Box>
  );
}
