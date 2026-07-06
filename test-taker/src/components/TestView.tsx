import { useCallback, useEffect, useState } from 'react';
import type { SavedSession } from '../types/test';
import type { Answer } from '../types/test';
import { getQuestionStatus } from '../utils/answers';
import { getTimerState } from '../utils/timer';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { BottomControls } from './BottomControls';
import { QuestionPanel } from './QuestionPanel';
import { PausedOverlay } from './PausedOverlay';

interface Props {
  session: SavedSession;
  setAnswer: (qNumber: number, answer: Answer) => void;
  getAnswer: (qNumber: number) => Answer;
  flagQuestion: (qNumber: number) => void;
  setCurrentQuestion: (index: number) => void;
  onReview: () => void;
  onTimerExpire: () => void;
  onTogglePause: () => void;
  onExitHome: () => void;
}

/**
 * TestView — Editorial Design Implementation
 *
 * Layout Architecture:
 * - Top bar: Sharp 1px border, navigation + timer
 * - Main content: Vertical divider separates left sidebar (nav grid) from right panel (question)
 * - Sidebar: Small square question cells with sharp borders (no rounded navigation)
 * - Question panel: Clean serif typography, minimal styling
 * - Bottom controls: Text-only or border-only buttons
 * - Pause overlay: Semi-transparent, minimal text
 */
export function TestView({
  session,
  setAnswer,
  getAnswer,
  flagQuestion,
  setCurrentQuestion,
  onReview,
  onTimerExpire,
  onTogglePause,
  onExitHome,
}: Props) {
  const questions = session.test.questions;
  const currentIndex = session.currentQuestion;
  const currentQuestion = questions[currentIndex];
  const isPaused = getTimerState(session).isPaused;
  const [hintVisible, setHintVisible] = useState(false);

  useEffect(() => {
    setHintVisible(false);
  }, [currentIndex]);

  const statuses = questions.map((q) =>
    getQuestionStatus(
      q,
      session.responses[String(q.q_number)] as Answer | undefined,
      session.flagged.includes(q.q_number)
    )
  );

  const goTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < questions.length) setCurrentQuestion(index);
    },
    [questions.length, setCurrentQuestion]
  );

  useEffect(() => {
    const timer = getTimerState(session);
    if (timer.hasTimer && timer.isExpired && !timer.isPaused) onTimerExpire();
  }, [session, onTimerExpire]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if ((e.target as HTMLElement)?.contentEditable === 'true') return;

      switch (e.key) {
        case 'ArrowLeft':
          goTo(currentIndex - 1);
          break;
        case 'ArrowRight':
          goTo(currentIndex + 1);
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, goTo, isPaused]);

  if (!currentQuestion) return null;

  return (
    <div className="flex flex-col w-full h-screen bg-editorial-50 dark:bg-editorial-900">
      {/* Top Bar — Sharp border, navigation + title + timer */}
      <header
        className="flex-shrink-0 border-b border-editorial-light dark:border-editorial-dark bg-white dark:bg-gray-950 px-6 py-4"
        style={{
          borderBottom: 'var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontFamily: 'var(--font-serif)',
        }}
      >
        <TopBar
          session={session}
          onTimerExpire={onTimerExpire}
          onTogglePause={onTogglePause}
          onExitHome={onExitHome}
        />
      </header>

      {/* Main content: Split layout with vertical divider */}
      <main
        className="flex flex-1 overflow-hidden"
        style={{
          opacity: isPaused ? 0.4 : 1,
          pointerEvents: isPaused ? 'none' : 'auto',
          transition: 'opacity 0.2s ease',
        }}
      >
        {/* Left Sidebar — Question Navigation Grid */}
        <aside className="flex-shrink-0 border-r border-editorial-light dark:border-editorial-dark w-40 overflow-y-auto bg-white dark:bg-gray-950">
          <Sidebar
            questions={questions}
            currentIndex={currentIndex}
            statuses={statuses}
            onSelect={goTo}
          />
        </aside>

        {/* Right Panel — Question Content */}
        <section className="flex-1 flex flex-col overflow-hidden bg-editorial-50 dark:bg-editorial-900">
          {/* Question content area */}
          <div className="flex-1 overflow-y-auto">
            <QuestionPanel
              question={currentQuestion}
              answer={getAnswer(currentQuestion.q_number)}
              onChange={(a) => setAnswer(currentQuestion.q_number, a)}
              showHint={hintVisible}
            />
          </div>

          {/* Bottom Controls — Footer with navigation */}
          <footer className="flex-shrink-0 border-t border-editorial-light dark:border-editorial-dark bg-white dark:bg-gray-950 px-6 py-4">
            <BottomControls
              currentIndex={currentIndex}
              totalQuestions={questions.length}
              isFlagged={session.flagged.includes(currentQuestion.q_number)}
              hasHint={!!currentQuestion.hint}
              hintVisible={hintVisible}
              onPrevious={() => goTo(currentIndex - 1)}
              onNext={() => goTo(currentIndex + 1)}
              onFlag={() => flagQuestion(currentQuestion.q_number)}
              onToggleHint={() => setHintVisible((v) => !v)}
              onSubmit={onReview}
            />
          </footer>
        </section>
      </main>

      {/* Pause Overlay — Semi-transparent, minimal */}
      <PausedOverlay session={session} onResume={onTogglePause} />
    </div>
  );
}
