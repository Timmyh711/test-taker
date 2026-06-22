import type { Answer, SavedSession, TestOutput } from '../types/test';
import { isAnswered } from './answers';
import { gradeTest } from './grading';

export function buildTestOutput(
  session: SavedSession,
  submissionReason: 'user_submitted' | 'timer_expired'
): TestOutput {
  const responses = session.test.questions
    .filter((q) => {
      const answer = session.responses[String(q.q_number)] as Answer | undefined;
      return isAnswered(q, answer);
    })
    .map((q) => ({
      q_number: q.q_number,
      answer: session.responses[String(q.q_number)] as Answer,
    }));

  const answeredCount = session.test.questions.filter((q) =>
    isAnswered(q, session.responses[String(q.q_number)] as Answer | undefined)
  ).length;

  const completedAt = new Date().toISOString();
  const timeSpent = Math.floor(
    (new Date(completedAt).getTime() - new Date(session.startedAt).getTime()) / 1000
  );

  const grading = gradeTest(session);

  return {
    test_title: session.test.title,
    completed_at: completedAt,
    submission_reason: submissionReason,
    responses,
    metadata: {
      total_questions: session.test.questions.length,
      answered_count: answeredCount,
      unanswered_count: session.test.questions.length - answeredCount,
      flagged_count: session.flagged.length,
      started_at: session.startedAt,
      time_spent_seconds: timeSpent,
      original_test: session.test,
      ...(grading ? { grading } : {}),
    },
  };
}
