import type { Question, QuestionGrade, QuestionStatus } from '../types/test';
import { statusColors } from '../theme/theme';

export const SIDEBAR_WIDTH = 88;

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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        className="utility-text"
        style={{ padding: '0.75rem 0.5rem', textAlign: 'center', borderBottom: '1px solid var(--border-color)' }}
      >
        {questions.length} Q
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.375rem',
          alignContent: 'start',
        }}
      >
        {questions.map((q, i) => {
          const status = statuses[i];
          const grade = gradeMap.get(q.q_number);
          const isSelected = i === currentIndex;

          let dotColor = statusColors[status];
          if (grade?.correct === true) dotColor = statusColors.answered;
          if (grade?.correct === false) dotColor = statusColors.flagged;

          return (
            <button
              key={q.q_number}
              type="button"
              onClick={() => onSelect(i)}
              aria-label={`Question ${q.q_number}${status === 'flagged' ? ', flagged' : ''}`}
              aria-current={isSelected ? 'true' : undefined}
              className={`nav-cell ${isSelected ? 'nav-cell--selected' : ''}`}
              style={{ width: '100%', aspectRatio: '1', position: 'relative' }}
            >
              {q.q_number}
              <span
                className="nav-cell__dot"
                style={{ background: isSelected ? 'var(--bg-primary)' : dotColor }}
              />
              {status === 'flagged' && (
                <span
                  style={{
                    position: 'absolute',
                    top: 2,
                    right: 3,
                    fontSize: '0.5rem',
                    color: statusColors.flagged,
                  }}
                >
                  ⚑
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { SIDEBAR_WIDTH as DRAWER_WIDTH };
