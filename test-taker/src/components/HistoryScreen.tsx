import type { TestHistoryEntry } from '../types/test';
import { AppHeader } from './AppHeader';

interface Props {
  history: TestHistoryEntry[];
  onSelect: (id: string) => void;
  onBack: () => void;
  onOpenSettings: () => void;
}

export function HistoryScreen({ history, onSelect, onBack, onOpenSettings }: Props) {
  return (
    <div className="page-shell">
      <div className="page-flow page-flow--narrow">
        <AppHeader onOpenSettings={onOpenSettings} onBack={onBack} />

        <section className="flow-hero">
          <p className="utility-text">Archive</p>
          <h1>Test History</h1>
          <p className="flow-lead">
            {history.length} completed test{history.length !== 1 ? 's' : ''}. Select any entry to view responses in
            read-only mode.
          </p>
        </section>

        <section className="flow-block">
          <table className="editorial-table editorial-table--interactive">
            <thead>
              <tr>
                <th>Test</th>
                <th>Completed</th>
                <th>Answered</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="flow-lead">
                    No completed tests yet.
                  </td>
                </tr>
              ) : (
                history.map((entry) => (
                  <tr
                    key={entry.id}
                    onClick={() => onSelect(entry.id)}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => e.key === 'Enter' && onSelect(entry.id)}
                  >
                    <td className="flow-emphasis">{entry.test_title}</td>
                    <td>
                      {new Date(entry.completed_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td>
                      {entry.answered_count}/{entry.total_questions}
                    </td>
                    <td>
                      {Math.floor(entry.time_spent_seconds / 60)}m {entry.time_spent_seconds % 60}s
                    </td>
                    <td>
                      <span className="tag">
                        {entry.submission_reason === 'timer_expired' ? 'Timer expired' : 'Submitted'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
