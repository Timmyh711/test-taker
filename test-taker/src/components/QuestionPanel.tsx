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
import { SplitPane } from './SplitPane';

interface Props {
  question: Question;
  answer: Answer;
  onChange: (answer: Answer) => void;
  readOnly?: boolean;
  grade?: QuestionGrade;
  showHint?: boolean;
  fillHeight?: boolean;
}

function isLongResponseType(type: Question['question_type']): boolean {
  return type === 'paragraph' || type === 'essay';
}

function QuestionMeta({ question }: { question: Question }) {
  return (
    <header className="question-meta">
      <div className="question-meta__row">
        <h2 className="question-meta__title">Question {question.q_number}</h2>
        {question.required && <span className="tag tag--accent">Required</span>}
        {question.points !== undefined && <span className="tag">{question.points} pts</span>}
      </div>
    </header>
  );
}

function QuestionPrompt({
  question,
  showHint,
  readOnly,
}: {
  question: Question;
  showHint?: boolean;
  readOnly?: boolean;
}) {
  return (
    <>
      <ContentRenderer content={question.question_text} latexEnabled={question.latex_enabled !== false} />
      <QuestionMedia imageUrl={question.image_url} audioUrl={question.audio_url} videoUrl={question.video_url} />
      {question.hint && !readOnly && showHint && (
        <QuestionHint hint={question.hint} latexEnabled={question.latex_enabled !== false} />
      )}
    </>
  );
}

export function QuestionPanel({
  question,
  answer,
  onChange,
  readOnly,
  grade,
  showHint,
  fillHeight,
}: Props) {
  const longResponse = isLongResponseType(question.question_type);

  const renderAnswer = () => {
    if (readOnly) {
      return <AnswerDisplay question={question} answer={answer} grade={grade} />;
    }

    switch (question.question_type) {
      case 'multiple_choice':
        return (
          <MultipleChoice choices={question.choices ?? []} value={answer as string} onChange={onChange} />
        );
      case 'multiple_select':
        return (
          <MultipleSelect choices={question.choices ?? []} value={answer as string[]} onChange={onChange} />
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
        return <RichTextEditor value={answer as string} onChange={onChange} minHeight={200} fillHeight />;
      case 'essay':
        return (
          <RichTextEditor
            value={answer as string}
            onChange={onChange}
            minHeight={280}
            autosaveInterval={3000}
            fillHeight
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
          <Ordering items={question.items ?? []} value={answer as string[]} onChange={onChange} />
        );
      default:
        return <p className="text-error">Unsupported question type</p>;
    }
  };

  if (longResponse && fillHeight) {
    return (
      <div className="question-panel question-panel--split">
        <SplitPane
          storageKey="test-taker-split-ratio"
          left={
            <div className="question-panel__prompt">
              <QuestionMeta question={question} />
              <QuestionPrompt question={question} showHint={showHint} readOnly={readOnly} />
            </div>
          }
          right={
            <div className="question-panel__response" role="group" aria-label="Answer area">
              <p className="utility-text question-panel__response-label">Your response</p>
              {renderAnswer()}
            </div>
          }
        />
      </div>
    );
  }

  return (
    <article className="question-panel question-panel--standard">
      <QuestionMeta question={question} />
      <QuestionPrompt question={question} showHint={showHint} readOnly={readOnly} />

      <div className="question-panel__answer" role="group" aria-label="Answer area">
        {!readOnly && question.question_type === 'multiple_select' && (
          <p className="utility-text question-panel__hint-line">Select all that apply</p>
        )}
        {renderAnswer()}
      </div>
    </article>
  );
}
