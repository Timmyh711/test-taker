import { Clock, Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { SavedSession } from '../types/test';
import { formatTime, getTimerState } from '../utils/timer';

interface Props {
  session: SavedSession;
  onExpire: () => void;
  onTogglePause: () => void;
}

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
          '10min': '10 minutes remaining',
          '5min': '5 minutes remaining',
          '1min': '1 minute remaining',
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
  const className = [
    'timer-readout',
    state.isPaused ? 'timer-readout--paused' : '',
    isUrgent ? 'timer-readout--urgent' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <div
        className={className}
        role="timer"
        aria-live="polite"
        aria-label={
          state.isPaused
            ? `Timer paused. Time remaining: ${formatTime(state.remainingMs)}`
            : `Time remaining: ${formatTime(state.remainingMs)}`
        }
      >
        <Clock size={14} strokeWidth={2} aria-hidden />
        <span>{formatTime(state.remainingMs)}</span>
        {state.isPaused && <span className="utility-text">Paused</span>}
        <button
          type="button"
          onClick={onTogglePause}
          aria-label={state.isPaused ? 'Resume timer' : 'Pause timer'}
          className="timer-readout__toggle"
        >
          {state.isPaused ? <Play size={14} strokeWidth={2} /> : <Pause size={14} strokeWidth={2} />}
        </button>
      </div>

      {activeWarning && (
        <div className="notice notice--fixed" role="alert">
          {activeWarning}
        </div>
      )}
    </>
  );
}
