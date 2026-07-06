import { Flag } from 'lucide-react';
import type { QuestionStatus } from '../types/test';
import { statusColors, statusColorsDark } from '../theme/theme';

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
}: Props) {
  const isDark = document.documentElement.dataset.theme === 'dark';
  const palette = isDark ? statusColorsDark : statusColors;

  return (
    <div className="nav-grid" role="navigation" aria-label="Question navigation">
      {questionNumbers.map((qNum, i) => {
        const status = statuses[i];
        const isSelected = currentIndex === i;

        return (
          <button
            key={qNum}
            type="button"
            onClick={() => onSelect(i)}
            aria-label={`Question ${qNum}${status === 'flagged' ? ', flagged' : ''}`}
            aria-current={isSelected ? 'true' : undefined}
            className={`nav-cell${isSelected ? ' nav-cell--selected' : ''}`}
          >
            {qNum}
            <span className="nav-cell__dot" style={{ background: palette[status] }} />
            {status === 'flagged' && (
              <Flag className="nav-cell__flag" size={10} strokeWidth={2} aria-hidden />
            )}
          </button>
        );
      })}
    </div>
  );
}
