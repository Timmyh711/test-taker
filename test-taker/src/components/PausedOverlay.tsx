import { Play } from 'lucide-react';
import { formatTime, getTimerState } from '../utils/timer';
import type { SavedSession } from '../types/test';

interface Props {
  session: SavedSession;
  onResume: () => void;
}

export function PausedOverlay({ session, onResume }: Props) {
  const timer = getTimerState(session);
  if (!timer.isPaused) return null;

  return (
    <div className="overlay-pause" role="dialog" aria-modal="true" aria-labelledby="paused-title">
      <div className="overlay-pause-content">
        <p className="utility-text" style={{ marginBottom: '1rem' }}>Examination Paused</p>
        <h2 id="paused-title" style={{ margin: '0 0 1rem', fontSize: '1.75rem' }}>
          Test Paused
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          The timer is paused. Resume to continue your test.
        </p>
        {timer.hasTimer && (
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.125rem',
              letterSpacing: '0.1em',
              marginBottom: '2rem',
            }}
          >
            {formatTime(timer.remainingMs)}
          </p>
        )}
        <button type="button" className="btn btn-primary btn--large" onClick={onResume} autoFocus style={{ width: '100%' }}>
          <Play size={18} strokeWidth={2} aria-hidden />
          Resume Test
        </button>
      </div>
    </div>
  );
}
