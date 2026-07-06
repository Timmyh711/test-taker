import type { SavedSession } from '../types/test';
import { isAnswered } from '../utils/answers';
import type { Answer } from '../types/test';
import { Timer } from './Timer';

interface Props {
  session: SavedSession;
  onTimerExpire: () => void;
  onTogglePause: () => void;
  onExitHome: () => void;
}

export function TopBar({ session, onTimerExpire, onTogglePause, onExitHome }: Props) {
  const total = session.test.questions.length;
  const answered = session.test.questions.filter((q) =>
    isAnswered(q, session.responses[String(q.q_number)] as Answer | undefined)
  ).length;
  const progress = total > 0 ? (answered / total) * 100 : 0;

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '0.875rem 1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <button type="button" className="btn btn-text" onClick={onExitHome} aria-label="Return to home">
          ← Home
        </button>

        <h1
          style={{
            flex: 1,
            margin: 0,
            fontSize: '1.125rem',
            fontWeight: 600,
            textAlign: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {session.test.title}
        </h1>

        <span className="utility-text" aria-label={`${answered} of ${total} questions answered`}>
          {answered}/{total}
        </span>

        <Timer session={session} onExpire={onTimerExpire} onTogglePause={onTogglePause} />
      </div>

      <div className="progress-track" aria-label="Test completion progress" role="progressbar" aria-valuenow={answered} aria-valuemin={0} aria-valuemax={total}>
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
