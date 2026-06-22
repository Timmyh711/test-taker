import type { Answer, SavedSession, TestData, TestHistoryEntry, TestOutput } from '../types/test';

const STORAGE_KEY = 'test-taker-session';
const HISTORY_KEY = 'test-taker-history';
export const HOME_HISTORY_LIMIT = 5;
const MAX_HISTORY = 100;

export function loadSession(): SavedSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedSession;
    if (!parsed.test || !parsed.responses) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveSession(session: SavedSession): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Storage full or unavailable — fail silently
  }
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function createSession(test: TestData): SavedSession {
  const now = new Date().toISOString();
  return {
    test,
    responses: {},
    flagged: [],
    currentQuestion: 0,
    startedAt: now,
    lastSavedAt: now,
    ...(test.time_limit_minutes
      ? {
          timerStartedAt: now,
          timerDurationMinutes: test.time_limit_minutes,
        }
      : {}),
  };
}

export function updateResponse(
  session: SavedSession,
  qNumber: number,
  answer: Answer
): SavedSession {
  return {
    ...session,
    responses: { ...session.responses, [String(qNumber)]: answer },
    lastSavedAt: new Date().toISOString(),
  };
}

export function toggleFlag(session: SavedSession, qNumber: number): SavedSession {
  const flagged = session.flagged.includes(qNumber)
    ? session.flagged.filter((n) => n !== qNumber)
    : [...session.flagged, qNumber];
  return { ...session, flagged, lastSavedAt: new Date().toISOString() };
}

export function pauseTimer(session: SavedSession): SavedSession {
  if (!session.timerStartedAt || session.timerPausedAt) return session;
  return { ...session, timerPausedAt: new Date().toISOString(), lastSavedAt: new Date().toISOString() };
}

export function resumeTimer(session: SavedSession): SavedSession {
  if (!session.timerPausedAt) return session;
  const pauseDuration = Date.now() - new Date(session.timerPausedAt).getTime();
  return {
    ...session,
    timerAccumulatedPauseMs: (session.timerAccumulatedPauseMs ?? 0) + pauseDuration,
    timerPausedAt: undefined,
    lastSavedAt: new Date().toISOString(),
  };
}

export function toggleTimerPause(session: SavedSession): SavedSession {
  return session.timerPausedAt ? resumeTimer(session) : pauseTimer(session);
}

export function loadHistory(): TestHistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Partial<TestHistoryEntry>[];
    return parsed
      .filter((h) => h.test_title && h.completed_at && h.output)
      .map((h) => ({
        id: h.id ?? h.completed_at!,
        test_title: h.test_title!,
        completed_at: h.completed_at!,
        submission_reason: h.submission_reason ?? 'user_submitted',
        answered_count: h.answered_count ?? 0,
        total_questions: h.total_questions ?? 0,
        time_spent_seconds: h.time_spent_seconds ?? 0,
        output: h.output!,
      }));
  } catch {
    return [];
  }
}

export function addToHistory(output: TestOutput): void {
  try {
    const entry: TestHistoryEntry = {
      id: output.completed_at,
      test_title: output.test_title,
      completed_at: output.completed_at,
      submission_reason: output.submission_reason,
      answered_count: output.metadata.answered_count,
      total_questions: output.metadata.total_questions,
      time_spent_seconds: output.metadata.time_spent_seconds,
      output,
    };
    const history = loadHistory().filter((h) => h.id !== entry.id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify([entry, ...history].slice(0, MAX_HISTORY)));
  } catch {
    // fail silently
  }
}
