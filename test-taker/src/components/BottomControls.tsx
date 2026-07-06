import {
  ChevronLeft,
  ChevronRight,
  Flag,
  Lightbulb,
  Send,
} from 'lucide-react';

interface Props {
  currentIndex: number;
  totalQuestions: number;
  isFlagged: boolean;
  hasHint?: boolean;
  hintVisible?: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onFlag: () => void;
  onToggleHint?: () => void;
  onSubmit: () => void;
}

export function BottomControls({
  currentIndex,
  totalQuestions,
  isFlagged,
  hasHint,
  hintVisible,
  onPrevious,
  onNext,
  onFlag,
  onToggleHint,
  onSubmit,
}: Props) {
  return (
    <div className="bottom-controls">
      <button
        type="button"
        className="btn"
        onClick={onPrevious}
        disabled={currentIndex === 0}
        aria-label="Previous question"
      >
        <ChevronLeft size={16} strokeWidth={2} aria-hidden />
        Previous
      </button>

      <div className="bottom-controls__center">
        {hasHint && onToggleHint && (
          <button
            type="button"
            className={`btn${hintVisible ? ' btn-primary' : ''}`}
            onClick={onToggleHint}
            aria-label={hintVisible ? 'Hide hint' : 'Show hint'}
            aria-pressed={hintVisible}
          >
            <Lightbulb size={16} strokeWidth={2} aria-hidden />
            {hintVisible ? 'Hide Hint' : 'Hint'}
          </button>
        )}
        <button
          type="button"
          className={`btn${isFlagged ? ' btn-primary' : ''}`}
          onClick={onFlag}
          aria-label={isFlagged ? 'Unflag question' : 'Flag question'}
          aria-pressed={isFlagged}
        >
          <Flag size={16} strokeWidth={2} aria-hidden />
          {isFlagged ? 'Flagged' : 'Flag'}
        </button>
        {currentIndex === totalQuestions - 1 && (
          <button type="button" className="btn btn-primary" onClick={onSubmit} aria-label="Submit test">
            <Send size={16} strokeWidth={2} aria-hidden />
            Submit
          </button>
        )}
      </div>

      <button
        type="button"
        className="btn"
        onClick={onNext}
        disabled={currentIndex >= totalQuestions - 1}
        aria-label="Next question"
      >
        Next
        <ChevronRight size={16} strokeWidth={2} aria-hidden />
      </button>
    </div>
  );
}
