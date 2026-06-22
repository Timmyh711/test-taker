export type QuestionType =
  | 'multiple_choice'
  | 'multiple_select'
  | 'true_false'
  | 'short_answer'
  | 'paragraph'
  | 'essay'
  | 'numeric'
  | 'matching'
  | 'ordering';

export type GradableQuestionType = Exclude<QuestionType, 'paragraph' | 'essay'>;

export type Answer =
  | string
  | string[]
  | Record<string, string>;

export type CorrectAnswer = Answer | number;

export interface Question {
  q_number: number;
  question_type: QuestionType;
  question_text: string;
  choices?: string[];
  left_items?: string[];
  right_items?: string[];
  items?: string[];
  required?: boolean;
  points?: number;
  explanation?: string;
  hint?: string;
  image_url?: string;
  audio_url?: string;
  video_url?: string;
  latex_enabled?: boolean;
  integer_only?: boolean;
  decimal_places?: number;
  correct_answer?: CorrectAnswer;
  alternate_answers?: string[];
}

export interface TestData {
  title: string;
  description?: string;
  version?: string;
  author?: string;
  time_limit_minutes?: number;
  auto_grade?: boolean;
  questions: Question[];
}

export type QuestionStatus =
  | 'not_started'
  | 'in_progress'
  | 'answered'
  | 'flagged';

export interface SavedSession {
  test: TestData;
  responses: Record<string, Answer>;
  flagged: number[];
  currentQuestion: number;
  startedAt: string;
  lastSavedAt: string;
  timerStartedAt?: string;
  timerDurationMinutes?: number;
  timerPausedAt?: string;
  timerAccumulatedPauseMs?: number;
}

export interface QuestionGrade {
  q_number: number;
  correct: boolean | null;
  points_earned: number;
  points_possible: number;
  explanation?: string;
}

export interface GradingSummary {
  auto_graded: boolean;
  score: number;
  max_score: number;
  percentage: number;
  results: QuestionGrade[];
}

export interface TestHistoryEntry {
  id: string;
  test_title: string;
  completed_at: string;
  submission_reason: 'user_submitted' | 'timer_expired';
  answered_count: number;
  total_questions: number;
  time_spent_seconds: number;
  output: TestOutput;
}

export interface ResponseEntry {
  q_number: number;
  answer: Answer;
}

export interface TestOutput {
  test_title: string;
  completed_at: string;
  submission_reason: 'user_submitted' | 'timer_expired';
  responses: ResponseEntry[];
  metadata: {
    total_questions: number;
    answered_count: number;
    unanswered_count: number;
    flagged_count: number;
    started_at: string;
    time_spent_seconds: number;
    original_test: TestData;
    grading?: GradingSummary;
  };
}

export type AppScreen = 'import' | 'test' | 'review' | 'results' | 'history' | 'history_view';

export type ThemeMode = 'dark' | 'light' | 'auto';

export type AccentColor = 'blue' | 'purple' | 'green' | 'orange' | 'red';

export interface AppSettings {
  themeMode: ThemeMode;
  accentColor: AccentColor;
}
