import { useEffect, useRef, useState } from 'react';
import type { SavedSession } from '../types/test';
import { formatTime, getTimerState } from '../utils/timer';

interface Props {
  session: SavedSession;
  onExpire: () => void;
  onTogglePause: () => void;
}

/**
 * Timer — Editorial Digital Time Display
 *
 * Design:
 * - Monospace font for time readout (HH:MM:SS)
 * - Sharp 1px border, no rounded corners
 * - Color shifts based on urgency:
 *   - Normal: light border
 *   - Urgent (< 5 min): darker border, possible text emphasis
 *   - Paused: amber/warning indicator
 * - Minimal icons (Unicode or removed)
 * - Warning notifications: Simple text overlay, no Material snackbars
 */
export function Timer({ session, onExpire, onTogglePause }: Props) {
  const [state, setState] = useState(() => getTimerState(session));
  const warningsShown = useRef<Set<string>>(new Set());
  const [activeWarning, setActiveWarning] = useState<string | null>(null);
  const expiredRef = useRef(false);

  useEffect(() => {
    if (!session.timerStartedAt || !session.timerDurationMinutes) return;

    const tick = () => {
      const next = getTimerState(session);
      setState(next);

      if (next.isPaused) return;

      if (next.isExpired && !expiredRef.current) {
        expiredRef.current = true;
        onExpire();
        return;
      }

      const warnKey =
        next.warningLevel === 'ten'
          ? '10min'
          : next.warningLevel === 'five'
            ? '5min'
            : next.warningLevel === 'one'
              ? '1min'
              : null;

      if (warnKey && !warningsShown.current.has(warnKey)) {
        warningsShown.current.add(warnKey);
        const messages: Record<string, string> = {
          '10min': '⏱ 10 minutes remaining',
          '5min': '⏱ 5 minutes remaining',
          '1min': '⏱ 1 minute remaining',
        };
        setActiveWarning(messages[warnKey]);
        setTimeout(() => setActiveWarning(null), 5000);
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [session, onExpire]);

  if (!state.hasTimer) return null;

  const isUrgent = !state.isPaused && (state.warningLevel === 'five' || state.warningLevel === 'one');

  // Determine border color based on state
  let borderColor = 'var(--border-color)';
  let backgroundColor = 'transparent';
  let textColor = 'var(--text-primary)';

  if (state.isPaused) {
    borderColor = 'var(--text-primary)';
    backgroundColor = 'rgba(28, 28, 30, 0.1)';
    textColor = 'var(--text-primary)';
  } else if (isUrgent) {
    borderColor = 'var(--text-primary)';
    textColor = 'var(--text-primary)';
  }

  return (
    <>
      {/* Timer display — Monospace, sharp border */}
      <div
        className="flex items-center gap-2 px-3 py-1 flex-shrink-0"
        style={{
          border: `1px solid ${borderColor}`,
          backgroundColor: backgroundColor,
          color: textColor,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.85rem',
          fontWeight: 600,
          transition: 'all 0.2s ease',
          animation: isUrgent ? 'editorial-pulse 2s infinite' : 'none',
          borderRadius: 0,
        }}
        role="timer"
        aria-live="polite"
        aria-label={
          state.isPaused
            ? `Timer paused. Time remaining: ${formatTime(state.remainingMs)}`
            : `Time remaining: ${formatTime(state.remainingMs)}`
        }
      >
        {/* Time — Large monospace digits */}
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '1rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
          }}
        >
          {formatTime(state.remainingMs)}
        </span>

        {/* Pause indicator — Text only */}
        {state.isPaused && (
          <span
            className="label-text"
            style={{
              fontSize: '0.6rem',
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            ⏸ PAUSED
          </span>
        )}

        {/* Toggle pause button — Minimal text button */}
        <button
          onClick={onTogglePause}
          aria-label={state.isPaused ? 'Resume timer' : 'Pause timer'}
          className="ml-2"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            padding: '0.25rem 0.5rem',
            transition: 'opacity 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          {state.isPaused ? '▶' : '⏸'}
        </button>
      </div>

      {/* Warning notification — Minimal overlay */}
      {activeWarning && (
        <div
          style={{
            position: 'fixed',
            top: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            padding: 'var(--space-md) var(--space-lg)',
            fontFamily: 'var(--font-serif)',
            fontSize: '0.95rem',
            borderRadius: 0,
            zIndex: 1000,
            boxShadow: 'none',
            animation: 'slideDown 0.2s ease',
          }}
          role="alert"
        >
          {activeWarning}
        </div>
      )}

      {/* Keyframe animations */}
      <style>{`
        @keyframes editorial-pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </>
  );
}
