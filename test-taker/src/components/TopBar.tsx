import { Home } from 'lucide-react';
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
    <div className="topbar">
      <div className="topbar-row">
        <div className="topbar-row__start">
          <button type="button" className="btn btn-text" onClick={onExitHome} aria-label="Return to home">
            <Home size={16} strokeWidth={2} aria-hidden />
            Home
          </button>
        </div>

        <h1 className="topbar-title" title={session.test.title}>
          {session.test.title}
        </h1>

        <div className="topbar-row__end">
          <span className="topbar-stat" aria-label={`${answered} of ${total} questions answered`}>
            {answered}/{total}
          </span>
          <Timer session={session} onExpire={onTimerExpire} onTogglePause={onTogglePause} />
        </div>
      </div>

      <div
        className="progress-track"
        aria-label="Test completion progress"
        role="progressbar"
        aria-valuenow={answered}
        aria-valuemin={0}
        aria-valuemax={total}
      >
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
