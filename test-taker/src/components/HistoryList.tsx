import type { TestHistoryEntry } from '../types/test';

interface Props {
  entries: TestHistoryEntry[];
  onSelect: (id: string) => void;
}

export function formatHistoryDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export function HistoryList({ entries, onSelect }: Props) {
  if (entries.length === 0) {
    return <p style={{ color: 'var(--text-secondary)', margin: 0 }}>No completed tests yet.</p>;
  }

  return (
    <ul className="outline-list">
      {entries.map((entry) => (
        <li key={entry.id}>
          <button
            type="button"
            onClick={() => onSelect(entry.id)}
            className="outline-row outline-row--history"
          >
            <p style={{ margin: 0, fontWeight: 600, fontSize: '1.0625rem' }}>{entry.test_title}</p>
            <p className="utility-text" style={{ margin: 0, textTransform: 'none', letterSpacing: 'normal' }}>
              {formatHistoryDate(entry.completed_at)} · {entry.answered_count}/{entry.total_questions} answered ·{' '}
              {formatDuration(entry.time_spent_seconds)}
            </p>
            <span className="tag">
              {entry.submission_reason === 'timer_expired' ? 'Timer expired' : 'Submitted'}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
