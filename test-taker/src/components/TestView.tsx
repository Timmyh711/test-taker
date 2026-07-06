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

  const isLongResponse =
    currentQuestion.question_type === 'paragraph' || currentQuestion.question_type === 'essay';

  return (
    <div className="test-shell">
      <header className="test-topbar">
        <TopBar
          session={session}
          onTimerExpire={onTimerExpire}
          onTogglePause={onTogglePause}
          onExitHome={onExitHome}
        />
      </header>

      <main
        className="test-main"
        style={{
          opacity: isPaused ? 0.45 : 1,
          pointerEvents: isPaused ? 'none' : 'auto',
          transition: 'opacity 0.2s ease',
        }}
      >
        <aside className="test-sidebar">
          <Sidebar
            questions={questions}
            currentIndex={currentIndex}
            statuses={statuses}
            onSelect={goTo}
          />
        </aside>

        <section className={`test-panel${isLongResponse ? ' test-panel--long' : ''}`}>
          <div className={isLongResponse ? 'test-panel__fill' : 'test-panel__scroll'}>
            <QuestionPanel
              question={currentQuestion}
              answer={getAnswer(currentQuestion.q_number)}
              onChange={(a) => setAnswer(currentQuestion.q_number, a)}
              showHint={hintVisible}
              fillHeight={isLongResponse}
            />
          </div>

          <footer className="test-footer">
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

      <PausedOverlay session={session} onResume={onTogglePause} />
    </div>
  );
}
