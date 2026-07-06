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
}: Props) {
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
            className={`nav-cell ${isSelected ? 'nav-cell--selected' : ''}`}
          >
            {qNum}
            <span className="nav-cell__dot" style={{ background: statusColors[status] }} />
            {status === 'flagged' && (
              <span style={{ position: 'absolute', top: 2, right: 3, fontSize: '0.5rem', color: statusColors.flagged }}>
                ⚑
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
