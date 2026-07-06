import { Flag } from 'lucide-react';
import type { Question, QuestionGrade, QuestionStatus } from '../types/test';
import { useSettings } from '../hooks/useSettings';
import { getStatusColor } from '../theme/theme';

export const SIDEBAR_WIDTH = 52;

interface Props {
  questions: Question[];
  currentIndex: number;
  statuses: QuestionStatus[];
  onSelect: (index: number) => void;
  grades?: QuestionGrade[];
}

export function Sidebar({ questions, currentIndex, statuses, onSelect, grades }: Props) {
  const { resolvedMode } = useSettings();
  const isDark = resolvedMode === 'dark';
  const gradeMap = new Map(grades?.map((g) => [g.q_number, g]));

  return (
    <div className="sidebar-nav">
      <div className="utility-text sidebar-nav__label">{questions.length}</div>
      <div className="sidebar-nav__list">
        {questions.map((q, i) => {
          const status = statuses[i];
          const grade = gradeMap.get(q.q_number);
          const isSelected = i === currentIndex;

          let dotColor = getStatusColor(status, isDark);
          if (grade?.correct === true) dotColor = getStatusColor('answered', isDark);
          if (grade?.correct === false) dotColor = getStatusColor('flagged', isDark);

          return (
            <button
              key={q.q_number}
              type="button"
              onClick={() => onSelect(i)}
              aria-label={`Question ${q.q_number}${status === 'flagged' ? ', flagged' : ''}`}
              aria-current={isSelected ? 'true' : undefined}
              className={`nav-cell nav-cell--sidebar${isSelected ? ' nav-cell--selected' : ''}`}
            >
              {q.q_number}
              <span className="nav-cell__dot" style={{ background: isSelected ? 'var(--bg-primary)' : dotColor }} />
              {status === 'flagged' && (
                <Flag className="nav-cell__flag" size={10} strokeWidth={2} aria-hidden />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { SIDEBAR_WIDTH as DRAWER_WIDTH };
