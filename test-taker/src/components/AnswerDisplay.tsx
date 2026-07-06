import type { CSSProperties } from 'react';
import type { Answer, Question, QuestionGrade } from '../types/test';
import { ContentRenderer } from './ContentRenderer';
import { ChoiceLabel } from './ChoiceLabel';
import { isAnswered } from '../utils/answers';

interface Props {
  question: Question;
  answer: Answer;
  grade?: QuestionGrade;
}

const answerBlockStyle: CSSProperties = {
  padding: '0.75rem 0',
  borderBottom: '1px solid var(--border-color)',
};

export function AnswerDisplay({ question, answer, grade }: Props) {
  const answered = isAnswered(question, answer);

  if (!answered) {
    return <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>No answer provided</p>;
  }

  const renderValue = () => {
    switch (question.question_type) {
      case 'multiple_choice':
      case 'true_false':
        return <ChoiceLabel content={String(answer)} />;
      case 'multiple_select':
        return (
          <ul className="outline-list">
            {(answer as string[]).map((item, i) => (
              <li key={i} style={answerBlockStyle}>
                <ChoiceLabel content={item} />
              </li>
            ))}
          </ul>
        );
      case 'short_answer':
      case 'numeric':
        return <p style={{ margin: 0, fontFamily: 'var(--font-mono)' }}>{String(answer)}</p>;
      case 'paragraph':
      case 'essay':
        return (
          <div
            className="content-renderer"
            style={{ padding: '0.75rem 0' }}
            dangerouslySetInnerHTML={{ __html: String(answer) }}
          />
        );
      case 'matching':
        return (
          <ul className="outline-list">
            {Object.entries(answer as Record<string, string>).map(([left, right]) => (
              <li key={left} style={{ ...answerBlockStyle, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <ChoiceLabel content={left} />
                <ChoiceLabel content={right} />
              </li>
            ))}
          </ul>
        );
      case 'ordering':
        return (
          <ol className="outline-list" style={{ listStyle: 'decimal', paddingLeft: '1.5rem' }}>
            {(answer as string[]).map((item, i) => (
              <li key={i} style={{ padding: '0.5rem 0' }}>
                <ChoiceLabel content={item} />
              </li>
            ))}
          </ol>
        );
      default:
        return <p style={{ margin: 0 }}>{String(answer)}</p>;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <span className="utility-text">Your answer</span>
        {grade?.correct === true && <span className="tag tag--success">Correct</span>}
        {grade?.correct === false && <span className="tag tag--error">Incorrect</span>}
        {grade?.correct === null && <span className="tag">Not graded</span>}
        {grade && grade.points_possible > 0 && (
          <span className="tag">{grade.points_earned}/{grade.points_possible} pts</span>
        )}
      </div>
      {renderValue()}
      {grade?.explanation && (
        <aside
          className="hint-block"
          style={{
            marginTop: '1.5rem',
            borderLeftColor: grade.correct ? '#2d5016' : '#7a1f1f',
          }}
        >
          <div className="hint-block__title">Explanation</div>
          <ContentRenderer content={grade.explanation} />
        </aside>
      )}
    </div>
  );
}
