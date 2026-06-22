import { useCallback, useEffect } from 'react';
import { Box } from '@mui/material';
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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TopBar
        session={session}
        onTimerExpire={onTimerExpire}
        onTogglePause={onTogglePause}
        onExitHome={onExitHome}
      />
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', pointerEvents: isPaused ? 'none' : 'auto', opacity: isPaused ? 0.4 : 1 }}>
        <Sidebar
          questions={questions}
          currentIndex={currentIndex}
          statuses={statuses}
          onSelect={goTo}
        />
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <QuestionPanel
              question={currentQuestion}
              answer={getAnswer(currentQuestion.q_number)}
              onChange={(a) => setAnswer(currentQuestion.q_number, a)}
            />
          </Box>
          <BottomControls
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            isFlagged={session.flagged.includes(currentQuestion.q_number)}
            onPrevious={() => goTo(currentIndex - 1)}
            onNext={() => goTo(currentIndex + 1)}
            onFlag={() => flagQuestion(currentQuestion.q_number)}
            onSubmit={onReview}
          />
        </Box>
      </Box>
      <PausedOverlay session={session} onResume={onTogglePause} />
    </Box>
  );
}
