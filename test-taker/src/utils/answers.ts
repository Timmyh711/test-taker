import type { Answer, Question, QuestionStatus } from '../types/test';

export function isAnswered(question: Question, answer: Answer | undefined): boolean {
  if (answer === undefined || answer === null) return false;

  switch (question.question_type) {
    case 'multiple_choice':
    case 'true_false':
    case 'short_answer':
    case 'paragraph':
    case 'essay':
      return typeof answer === 'string' && answer.trim().length > 0;
    case 'numeric':
      return typeof answer === 'string' && answer.trim().length > 0 && !isNaN(Number(answer));
    case 'multiple_select':
      return Array.isArray(answer) && answer.length > 0;
    case 'ordering':
      return Array.isArray(answer) && answer.length === (question.items?.length ?? 0);
    case 'matching': {
      if (typeof answer !== 'object' || Array.isArray(answer)) return false;
      const leftCount = question.left_items?.length ?? 0;
      const entries = Object.entries(answer as Record<string, string>);
      return entries.length === leftCount && entries.every(([, v]) => v.trim().length > 0);
    }
    default:
      return false;
  }
}

export function getQuestionStatus(
  question: Question,
  answer: Answer | undefined,
  flagged: boolean
): QuestionStatus {
  if (flagged) return 'flagged';
  if (isAnswered(question, answer)) return 'answered';
  if (answer !== undefined) return 'in_progress';
  return 'not_started';
}

export function getDefaultAnswer(question: Question): Answer {
  switch (question.question_type) {
    case 'multiple_select':
      return [];
    case 'ordering':
      return [...(question.items ?? [])];
    case 'matching': {
      const map: Record<string, string> = {};
      for (const item of question.left_items ?? []) {
        map[item] = '';
      }
      return map;
    }
    default:
      return '';
  }
}
