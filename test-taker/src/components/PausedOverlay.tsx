import { formatTime, getTimerState } from '../utils/timer';
import type { SavedSession } from '../types/test';

interface Props {
  session: SavedSession;
  onResume: () => void;
}

/**
 * PausedOverlay — Editorial Pause Modal
 *
 * Design:
 * - Semi-transparent dark overlay (50% opacity)
 * - Sharp border card in center
 * - Serif typography for message
 * - Monospace for time remaining
 * - Minimal primary button to resume
 */
export function PausedOverlay({ session, onResume }: Props) {
  const timer = getTimerState(session);
  if (!timer.isPaused) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="paused-title"
    >
      {/* Card — Editorial style with sharp border */}
      <div
        className="editorial-card max-w-96 w-full text-center"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 0,
          padding: 'var(--space-2xl)',
        }}
      >
        {/* Pause symbol */}
        <div
          style={{
            fontSize: '3rem',
            marginBottom: 'var(--space-lg)',
            color: 'var(--text-primary)',
          }}
        >
          ⏸
        </div>

        {/* Title */}
        <h2
          id="paused-title"
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.5rem',
            fontWeight: 600,
            marginBottom: 'var(--space-md)',
            color: 'var(--text-primary)',
          }}
        >
          Test Paused
        </h2>

        {/* Message */}
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1rem',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-md)',
          }}
        >
          The timer is paused. Resume to continue your test.
        </p>

        {/* Time remaining — Monospace */}
        {timer.hasTimer && (
          <div
            className="label-text mb-6"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '0.1em',
            }}
          >
            {formatTime(timer.remainingMs)} REMAINING
          </div>
        )}

        {/* Resume button — Primary action */}
        <button
          className="btn btn-primary w-full"
          onClick={onResume}
          autoFocus
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1rem',
            fontWeight: 600,
            padding: 'var(--space-md) var(--space-lg)',
            border: '1px solid var(--text-primary)',
            background: 'var(--text-primary)',
            color: 'var(--bg-primary)',
            cursor: 'pointer',
            transition: 'opacity 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          ▶ Resume Test
        </button>
      </div>
    </div>
  );
}
