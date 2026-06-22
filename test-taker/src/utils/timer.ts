import type { SavedSession } from '../types/test';

export interface TimerState {
  hasTimer: boolean;
  remainingMs: number;
  isExpired: boolean;
  isPaused: boolean;
  warningLevel: 'none' | 'ten' | 'five' | 'one';
}

export function getTimerState(session: SavedSession): TimerState {
  if (!session.timerStartedAt || !session.timerDurationMinutes) {
    return { hasTimer: false, remainingMs: 0, isExpired: false, isPaused: false, warningLevel: 'none' };
  }

  const totalMs = session.timerDurationMinutes * 60 * 1000;
  const started = new Date(session.timerStartedAt).getTime();
  const pauseMs = session.timerAccumulatedPauseMs ?? 0;
  const isPaused = !!session.timerPausedAt;
  const now = isPaused ? new Date(session.timerPausedAt!).getTime() : Date.now();
  const elapsed = now - started - pauseMs;
  const remainingMs = Math.max(0, totalMs - elapsed);
  const remainingMinutes = remainingMs / 60000;

  let warningLevel: TimerState['warningLevel'] = 'none';
  if (!isPaused) {
    if (remainingMs === 0) warningLevel = 'one';
    else if (remainingMinutes <= 1) warningLevel = 'one';
    else if (remainingMinutes <= 5) warningLevel = 'five';
    else if (remainingMinutes <= 10) warningLevel = 'ten';
  }

  return {
    hasTimer: true,
    remainingMs,
    isExpired: !isPaused && remainingMs === 0,
    isPaused,
    warningLevel,
  };
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
