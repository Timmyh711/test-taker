import type { Question, QuestionGrade, QuestionStatus } from '../types/test';

const SIDEBAR_WIDTH = 160;

interface Props {
  questions: Question[];
  currentIndex: number;
  statuses: QuestionStatus[];
  onSelect: (index: number) => void;
  grades?: QuestionGrade[];
}

/**
 * Sidebar — Editorial Question Navigation Grid
 *
 * Design:
 * - Sharp square cells with 1px borders (no border-radius)
 * - Grid layout instead of vertical list
 * - Simple border highlights for current selection
 * - Color indicators:
 *   - Unflagged/unanswered: Light border
 *   - Answered: Filled cell or darker border
 *   - Flagged: Marked with ⚑ symbol (Unicode) or [F] prefix
 *   - Correct/Incorrect (if graded): Green/Red indicator
 */
export function Sidebar({ questions, currentIndex, statuses, onSelect, grades }: Props) {
  const gradeMap = new Map(grades?.map((g) => [g.q_number, g]));

  // Status color mapping — sharp indicator style
  const getStatusIndicator = (status: QuestionStatus): string => {
    switch (status) {
      case 'answered':
        return '✓'; // Unicode check
      case 'flagged':
        return '⚑'; // Unicode flag
      default:
        return '';
    }
  };

  return (
    <div
      className="flex flex-col bg-white dark:bg-gray-950 border-r border-editorial-light dark:border-editorial-dark"
      style={{
        width: `${SIDEBAR_WIDTH}px`,
        height: '100%',
        fontFamily: 'var(--font-mono)',
      }}
    >
      {/* Total question count — Utility text header */}
      <div
        className="px-3 py-2 border-b border-editorial-light dark:border-editorial-dark text-center"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}
      >
        {questions.length} Questions
      </div>

      {/* Question grid — 2 columns of square buttons */}
      <div
        className="flex-1 overflow-y-auto p-2"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.5rem',
          alignContent: 'start',
        }}
      >
        {questions.map((q, i) => {
          const status = statuses[i];
          const grade = gradeMap.get(q.q_number);
          const isSelected = i === currentIndex;

          // Determine border color based on grade/status
          let borderColor = 'var(--border-color)';
          let backgroundColor = 'transparent';
          let indicatorText = getStatusIndicator(status);

          if (grade?.correct === true) {
            borderColor = 'var(--text-primary)';
            indicatorText = '✓';
          } else if (grade?.correct === false) {
            borderColor = 'var(--text-primary)';
            indicatorText = '✗';
          } else if (status === 'answered') {
            borderColor = 'var(--border-color)';
            backgroundColor = 'rgba(28, 28, 30, 0.05)';
          } else if (status === 'flagged') {
            borderColor = 'var(--text-primary)';
          }

          if (isSelected) {
            backgroundColor = 'var(--text-primary)';
            borderColor = 'var(--text-primary)';
          }

          return (
            <button
              key={q.q_number}
              onClick={() => onSelect(i)}
              aria-label={`Question ${q.q_number}${status === 'flagged' ? ' (flagged)' : ''}`}
              aria-current={isSelected ? 'page' : undefined}
              className="flex items-center justify-center font-mono text-sm font-bold transition-colors duration-150 hover:opacity-80 active:opacity-60"
              style={{
                width: '100%',
                aspectRatio: '1',
                border: `1px solid ${borderColor}`,
                borderRadius: 0,
                backgroundColor: backgroundColor,
                color: isSelected ? backgroundColor === 'var(--text-primary)' ? 'var(--bg-primary)' : 'var(--text-primary)' : 'var(--text-primary)',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {isSelected && (
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{q.q_number}</span>
              )}
              {!isSelected && indicatorText && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{indicatorText}</span>
              )}
              {!isSelected && !indicatorText && (
                <span style={{ fontSize: '0.85rem' }}>{q.q_number}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { SIDEBAR_WIDTH as DRAWER_WIDTH };
