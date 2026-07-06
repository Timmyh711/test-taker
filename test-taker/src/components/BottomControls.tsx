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
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '0.75rem',
        flexWrap: 'wrap',
      }}
    >
      <button type="button" className="btn" onClick={onPrevious} disabled={currentIndex === 0} aria-label="Previous question">
        ← Previous
      </button>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {hasHint && onToggleHint && (
          <button
            type="button"
            className={`btn ${hintVisible ? 'btn-primary' : ''}`}
            onClick={onToggleHint}
            aria-label={hintVisible ? 'Hide hint' : 'Show hint'}
            aria-pressed={hintVisible}
          >
            {hintVisible ? 'Hide Hint' : 'Hint'}
          </button>
        )}
        <button
          type="button"
          className={`btn ${isFlagged ? 'btn-primary' : ''}`}
          onClick={onFlag}
          aria-label={isFlagged ? 'Unflag question' : 'Flag question'}
          aria-pressed={isFlagged}
        >
          {isFlagged ? '⚑ Flagged' : 'Flag'}
        </button>
        {currentIndex === totalQuestions - 1 && (
          <button type="button" className="btn btn-primary" onClick={onSubmit} aria-label="Submit test">
            Submit Test →
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
        Next →
      </button>
    </div>
  );
}
