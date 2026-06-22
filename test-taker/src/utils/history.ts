import type { Answer, SavedSession, TestHistoryEntry, TestOutput } from '../types/test';

export function outputToReadOnlySession(output: TestOutput): SavedSession {
  const responses: Record<string, Answer> = {};
  for (const r of output.responses) {
    responses[String(r.q_number)] = r.answer;
  }
  return {
    test: output.metadata.original_test,
    responses,
    flagged: [],
    currentQuestion: 0,
    startedAt: output.metadata.started_at,
    lastSavedAt: output.completed_at,
  };
}

export function findHistoryEntry(
  history: TestHistoryEntry[],
  id: string
): TestHistoryEntry | undefined {
  return history.find((h) => h.id === id);
}
