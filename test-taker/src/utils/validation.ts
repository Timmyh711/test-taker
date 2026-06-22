import Ajv, { ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
import testSchema from '../schemas/test-schema.json';
import type { TestData } from '../types/test';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const validateTest = ajv.compile(testSchema);

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function formatAjvErrors(errors: ErrorObject[] | null | undefined): string[] {
  if (!errors) return [];
  return errors.map((err) => {
    const path = err.instancePath || 'root';
    const msg = err.message ?? 'invalid value';
    if (err.params?.allowedValues) {
      return `${path}: ${msg} (allowed: ${err.params.allowedValues.join(', ')})`;
    }
    return `${path}: ${msg}`;
  });
}

export function validateTestJson(data: unknown): ValidationResult {
  if (data === null || typeof data !== 'object') {
    return { valid: false, errors: ['Root value must be a JSON object'] };
  }

  const valid = validateTest(data);
  if (!valid) {
    return { valid: false, errors: formatAjvErrors(validateTest.errors) };
  }

  const test = data as unknown as TestData;
  const extraErrors: string[] = [];
  const seenNumbers = new Set<number>();

  const gradableTypes = new Set([
    'multiple_choice',
    'multiple_select',
    'true_false',
    'short_answer',
    'numeric',
    'matching',
    'ordering',
  ]);

  for (const q of test.questions) {
    if (seenNumbers.has(q.q_number)) {
      extraErrors.push(`Duplicate q_number: ${q.q_number}`);
    }
    seenNumbers.add(q.q_number);

    switch (q.question_type) {
      case 'multiple_choice':
      case 'multiple_select':
      case 'true_false':
        if (!q.choices || q.choices.length < 2) {
          extraErrors.push(
            `Question ${q.q_number}: "${q.question_type}" requires at least 2 choices`
          );
        }
        break;
      case 'matching':
        if (!q.left_items?.length || !q.right_items?.length) {
          extraErrors.push(
            `Question ${q.q_number}: "matching" requires left_items and right_items`
          );
        }
        break;
      case 'ordering':
        if (!q.items || q.items.length < 2) {
          extraErrors.push(
            `Question ${q.q_number}: "ordering" requires at least 2 items`
          );
        }
        break;
      default:
        break;
    }

    if (test.auto_grade && gradableTypes.has(q.question_type) && q.correct_answer === undefined) {
      extraErrors.push(
        `Question ${q.q_number}: correct_answer is required when auto_grade is enabled`
      );
    }
  }

  return { valid: extraErrors.length === 0, errors: extraErrors };
}
