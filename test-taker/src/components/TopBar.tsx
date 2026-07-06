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

/**
 * TopBar — Editorial Navigation Header
 *
 * Design:
 * - Sharp 1px border bottom (no shadows)
 * - Clean serif typography for title
 * - Monospace font for utility counts (answered/total)
 * - Text-only or minimal border buttons
 * - Progress bar replaced with visual feedback (border color shift or minimal indicator)
 */
export function TopBar({ session, onTimerExpire, onTogglePause, onExitHome }: Props) {
  const total = session.test.questions.length;
  const answered = session.test.questions.filter((q) =>
    isAnswered(q, session.responses[String(q.q_number)] as Answer | undefined)
  ).length;
  const progress = total > 0 ? (answered / total) * 100 : 0;

  return (
    <div className="w-full flex flex-col bg-white dark:bg-gray-950">
      {/* Top navigation bar */}
      <div className="flex items-center justify-between gap-4 px-6 py-4">
        {/* Home button — Text with subtle border */}
        <button
          onClick={onExitHome}
          className="btn btn-text flex items-center gap-1"
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.95rem',
          }}
          aria-label="Return to home"
        >
          ← Home
        </button>

        {/* Test title — Clean serif, no truncation */}
        <h1
          className="flex-1 text-xl text-center"
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: 'var(--text-primary)',
          }}
        >
          {session.test.title}
        </h1>

        {/* Progress count — Monospace utility text */}
        <div
          className="utility-text flex-shrink-0 hidden sm:block"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
          }}
          aria-label={`${answered} of ${total} questions answered`}
        >
          {answered}/{total}
        </div>

        {/* Timer component */}
        <div className="flex-shrink-0">
          <Timer session={session} onExpire={onTimerExpire} onTogglePause={onTogglePause} />
        </div>
      </div>

      {/* Progress indicator — Minimal 2px horizontal bar */}
      <div
        className="h-0.5 bg-gray-300 dark:bg-gray-700"
        style={{
          width: `${progress}%`,
          transition: 'width 0.2s ease',
          backgroundColor: 'var(--text-primary)',
        }}
        aria-label="Test completion progress"
      />
    </div>
  );
}
