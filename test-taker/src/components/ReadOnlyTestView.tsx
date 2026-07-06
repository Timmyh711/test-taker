import { ArrowLeft } from 'lucide-react';
import { useCallback, useState } from 'react';
import type { Answer, TestHistoryEntry } from '../types/test';
import { outputToReadOnlySession } from '../utils/history';
import { getDefaultAnswer, getQuestionStatus } from '../utils/answers';
import { getQuestionGrade } from '../utils/grading';
import { Sidebar } from './Sidebar';
import { QuestionPanel } from './QuestionPanel';
import { formatHistoryDate, formatDuration } from './HistoryList';

interface Props {
  entry: TestHistoryEntry;
  onBack: () => void;
}

export function ReadOnlyTestView({ entry, onBack }: Props) {
  const session = outputToReadOnlySession(entry.output);
  const grading = entry.output.metadata.grading;
  const [currentIndex, setCurrentIndex] = useState(0);
  const questions = session.test.questions;
  const currentQuestion = questions[currentIndex];

  const getAnswer = useCallback(
    (qNumber: number): Answer => {
      const stored = session.responses[String(qNumber)];
      if (stored !== undefined) return stored;
      const question = questions.find((q) => q.q_number === qNumber);
      return question ? getDefaultAnswer(question) : '';
    },
    [session.responses, questions]
  );

  const statuses = questions.map((q) =>
    getQuestionStatus(q, session.responses[String(q.q_number)] as Answer | undefined, false)
  );

  if (!currentQuestion) return null;

  const isLongResponse =
    currentQuestion.question_type === 'paragraph' || currentQuestion.question_type === 'essay';

  return (
    <div className="test-shell">
      <header className="test-topbar">
        <div className="topbar-row">
          <div className="topbar-row__start">
            <button type="button" className="btn btn-text" onClick={onBack}>
              <ArrowLeft size={16} strokeWidth={2} aria-hidden />
              Back
            </button>
          </div>
          <h1 className="topbar-title" title={entry.test_title}>
            {entry.test_title}
          </h1>
          <div className="topbar-row__end">
            {grading && (
              <span className="tag tag--accent">
                {grading.score}/{grading.max_score} ({grading.percentage}%)
              </span>
            )}
            <span className="tag">Read-only</span>
          </div>
        </div>
        <p className="topbar-meta utility-text">
          Completed {formatHistoryDate(entry.completed_at)} · {entry.answered_count}/{entry.total_questions} answered ·{' '}
          {formatDuration(entry.time_spent_seconds)}
        </p>
      </header>

      <main className="test-main">
        <aside className="test-sidebar">
          <Sidebar
            questions={questions}
            currentIndex={currentIndex}
            statuses={statuses}
            onSelect={setCurrentIndex}
            grades={grading?.results}
          />
        </aside>
        <section className={`test-panel${isLongResponse ? ' test-panel--long' : ''}`}>
          <div className={isLongResponse ? 'test-panel__fill' : 'test-panel__scroll'}>
            <QuestionPanel
              question={currentQuestion}
              answer={getAnswer(currentQuestion.q_number)}
              onChange={() => {}}
              readOnly
              grade={getQuestionGrade(grading, currentQuestion.q_number)}
              fillHeight={isLongResponse}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
