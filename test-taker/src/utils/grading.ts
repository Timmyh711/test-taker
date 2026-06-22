import type {
  Answer,
  GradingSummary,
  Question,
  QuestionGrade,
  SavedSession,
} from '../types/test';
import { isAnswered } from './answers';

const GRADABLE_TYPES = new Set([
  'multiple_choice',
  'multiple_select',
  'true_false',
  'short_answer',
  'numeric',
  'matching',
  'ordering',
]);

function normalizeString(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

function arraysEqualAsSet(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sa = [...a].map(normalizeString).sort();
  const sb = [...b].map(normalizeString).sort();
  return sa.every((v, i) => v === sb[i]);
}

function recordsEqual(a: Record<string, string>, b: Record<string, string>): boolean {
  const keysA = Object.keys(a).sort();
  const keysB = Object.keys(b).sort();
  if (keysA.length !== keysB.length) return false;
  return keysA.every((k) => normalizeString(a[k] ?? '') === normalizeString(b[k] ?? ''));
}

function gradeAnswer(question: Question, userAnswer: Answer | undefined): boolean | null {
  if (!GRADABLE_TYPES.has(question.question_type)) return null;
  if (question.correct_answer === undefined) return null;
  if (!isAnswered(question, userAnswer)) return false;

  const correct = question.correct_answer;

  switch (question.question_type) {
    case 'multiple_choice':
    case 'true_false':
      return normalizeString(String(userAnswer)) === normalizeString(String(correct));

    case 'short_answer': {
      const user = normalizeString(String(userAnswer));
      if (user === normalizeString(String(correct))) return true;
      return (question.alternate_answers ?? []).some((alt) => user === normalizeString(alt));
    }

    case 'numeric': {
      const userNum = parseFloat(String(userAnswer));
      const correctNum = typeof correct === 'number' ? correct : parseFloat(String(correct));
      if (isNaN(userNum) || isNaN(correctNum)) return false;
      const tolerance = question.decimal_places !== undefined
        ? Math.pow(10, -question.decimal_places) / 2
        : 0.0001;
      return Math.abs(userNum - correctNum) <= tolerance;
    }

    case 'multiple_select':
      return arraysEqualAsSet(userAnswer as string[], correct as string[]);

    case 'ordering':
      return (userAnswer as string[]).every(
        (v, i) => normalizeString(v) === normalizeString((correct as string[])[i] ?? '')
      );

    case 'matching':
      return recordsEqual(
        userAnswer as Record<string, string>,
        correct as Record<string, string>
      );

    default:
      return null;
  }
}

export function gradeTest(session: SavedSession): GradingSummary | undefined {
  if (!session.test.auto_grade) return undefined;

  const results: QuestionGrade[] = session.test.questions.map((q) => {
    const userAnswer = session.responses[String(q.q_number)] as Answer | undefined;
    const correct = gradeAnswer(q, userAnswer);
    const pointsPossible = q.points ?? 1;
    const pointsEarned = correct === true ? pointsPossible : 0;

    return {
      q_number: q.q_number,
      correct,
      points_earned: correct === null ? 0 : pointsEarned,
      points_possible: correct === null ? 0 : pointsPossible,
      ...(session.test.auto_grade && q.explanation ? { explanation: q.explanation } : {}),
    };
  });

  const gradable = results.filter((r) => r.correct !== null);
  const score = gradable.reduce((sum, r) => sum + r.points_earned, 0);
  const maxScore = gradable.reduce((sum, r) => sum + r.points_possible, 0);

  return {
    auto_graded: true,
    score,
    max_score: maxScore,
    percentage: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0,
    results,
  };
}

export function getQuestionGrade(
  grading: GradingSummary | undefined,
  qNumber: number
): QuestionGrade | undefined {
  return grading?.results.find((r) => r.q_number === qNumber);
}
