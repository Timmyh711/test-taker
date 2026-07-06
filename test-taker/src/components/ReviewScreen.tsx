import { ArrowLeft, Flag, Send } from 'lucide-react';
import type { SavedSession } from '../types/test';
import { isAnswered, getQuestionStatus } from '../utils/answers';
import type { Answer } from '../types/test';
import { formatTime, getTimerState } from '../utils/timer';
import { QuestionNavGrid } from './QuestionNavGrid';
import { getStatusColor } from '../theme/theme';
import { useSettings } from '../hooks/useSettings';

interface Props {
  session: SavedSession;
  onBack: () => void;
  onSubmit: () => void;
  onJumpTo: (index: number) => void;
}

const STATUS_LABEL: Record<string, string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  answered: 'Answered',
  flagged: 'Flagged',
};

export function ReviewScreen({ session, onBack, onSubmit, onJumpTo }: Props) {
  const { resolvedMode } = useSettings();
  const isDark = resolvedMode === 'dark';
  const questions = session.test.questions;
  const answered = questions.filter((q) =>
    isAnswered(q, session.responses[String(q.q_number)] as Answer | undefined)
  );
  const unanswered = questions.filter(
    (q) => !isAnswered(q, session.responses[String(q.q_number)] as Answer | undefined)
  );
  const flagged = questions.filter((q) => session.flagged.includes(q.q_number));
  const timer = getTimerState(session);

  const statuses = questions.map((q) =>
    getQuestionStatus(
      q,
      session.responses[String(q.q_number)] as Answer | undefined,
      session.flagged.includes(q.q_number)
    )
  );

  return (
    <div className="page-shell">
      <div className="page-flow page-flow--narrow">
        <section className="flow-hero">
          <p className="utility-text">Final Review</p>
          <h1>Review Before Submit</h1>
          <p className="flow-lead">
            Review your answers or jump back to any question before submitting.
          </p>
        </section>

        <section className="flow-block">
          <dl className="stat-strip">
            <div className="stat-strip__item">
              <dt>Total</dt>
              <dd>{questions.length}</dd>
            </div>
            <div className="stat-strip__item">
              <dt>Answered</dt>
              <dd>{answered.length}</dd>
            </div>
            <div className="stat-strip__item">
              <dt>Unanswered</dt>
              <dd>{unanswered.length}</dd>
            </div>
            <div className="stat-strip__item">
              <dt>Flagged</dt>
              <dd>{flagged.length}</dd>
            </div>
            {timer.hasTimer && (
              <div className="stat-strip__item">
                <dt>Time left</dt>
                <dd>{formatTime(timer.remainingMs)}</dd>
              </div>
            )}
          </dl>
        </section>

        <section className="flow-block">
          <h2>Examination Outline</h2>
          <ol className="outline-list">
            {questions.map((q, i) => {
              const status = statuses[i];
              return (
                <li key={q.q_number}>
                  <button type="button" className="outline-row" onClick={() => onJumpTo(i)}>
                    <span>
                      <span className="utility-text outline-row__num">
                        {String(q.q_number).padStart(2, '0')}
                      </span>
                      Question {q.q_number}
                      {session.flagged.includes(q.q_number) && (
                        <Flag size={12} strokeWidth={2} style={{ verticalAlign: '-1px', marginLeft: '0.35rem' }} aria-hidden />
                      )}
                    </span>
                    <span className="tag" style={{ color: getStatusColor(status, isDark), borderColor: getStatusColor(status, isDark) }}>
                      {STATUS_LABEL[status]}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="flow-block">
          <p className="utility-text field-label">Quick navigation</p>
          <QuestionNavGrid
            questionNumbers={questions.map((q) => q.q_number)}
            statuses={statuses}
            onSelect={onJumpTo}
          />
        </section>

        <section className="flow-block flow-block--actions">
          <button type="button" className="btn" onClick={onBack}>
            <ArrowLeft size={16} strokeWidth={2} aria-hidden />
            Back to Test
          </button>
          <button type="button" className="btn btn-primary" onClick={onSubmit}>
            Confirm Submit
            <Send size={16} strokeWidth={2} aria-hidden />
          </button>
        </section>
      </div>
    </div>
  );
}
