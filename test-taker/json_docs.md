# Test Taker JSON Format Reference

Version **1.2.0** — This document describes the JSON format for importing tests into Test Taker and the output format for completed responses.

## Test JSON (Input)

### Root Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Display name of the test |
| `description` | string | No | Subtitle or description shown in metadata |
| `version` | string | No | Test version identifier |
| `author` | string | No | Author or institution name |
| `time_limit_minutes` | number | No | If set, enables a countdown timer |
| `auto_grade` | boolean | No | If `true`, enables automatic grading using `correct_answer` fields |
| `questions` | array | Yes | Array of question objects (min 1) |

### Question Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `q_number` | integer | Yes | Unique question number (≥ 1) |
| `question_type` | string | Yes | One of the supported types (see below) |
| `question_text` | string | Yes | Question content (Markdown + LaTeX supported) |
| `choices` | string[] | Conditional | Required for `multiple_choice`, `multiple_select`, `true_false` |
| `left_items` | string[] | Conditional | Required for `matching` |
| `right_items` | string[] | Conditional | Required for `matching` |
| `items` | string[] | Conditional | Required for `ordering` (min 2) |
| `required` | boolean | No | Whether the question must be answered |
| `points` | number | No | Point value (default: 1 when auto-grading) |
| `explanation` | string | No | Shown after submission when `auto_grade` is enabled. Optional for non-graded tests. |
| `hint` | string | No | Hint shown below the question during the test |
| `correct_answer` | varies | Conditional | Required per question when `auto_grade` is `true` (except `paragraph` and `essay`) |
| `alternate_answers` | string[] | No | Accepted alternate answers for `short_answer` |
| `image_url` | string | No | URL or base64 data URI for an image |
| `audio_url` | string | No | URL for optional audio |
| `video_url` | string | No | URL for optional video |
| `latex_enabled` | boolean | No | Enable LaTeX rendering (default: true) |
| `integer_only` | boolean | No | For `numeric`: restrict to integers |
| `decimal_places` | integer | No | For `numeric`: max decimal places |

### Supported Question Types

| Type | Answer Format | Auto-gradable |
|------|---------------|---------------|
| `multiple_choice` | string | Yes |
| `multiple_select` | string[] | Yes |
| `true_false` | string | Yes |
| `short_answer` | string | Yes |
| `paragraph` | string (HTML) | No |
| `essay` | string (HTML) | No |
| `numeric` | string | Yes |
| `matching` | object | Yes |
| `ordering` | string[] | Yes |

### Correct Answer Format by Type

| Question Type | `correct_answer` Format | Example |
|---------------|------------------------|---------|
| `multiple_choice` | string (must match a choice value) | `"B"` or `"$4$"` |
| `multiple_select` | string[] | `["2", "3", "5"]` |
| `true_false` | string | `"True"` |
| `short_answer` | string | `"Paris"` or `"x = 3"` |
| `numeric` | number or string | `78.54` or `"6"` |
| `matching` | object | `{"Hydrogen": "H", "Oxygen": "O"}` |
| `ordering` | string[] (correct order) | `["Mercury", "Venus", "Earth"]` |

### Auto-Grading

When `auto_grade` is `true` on the test:

1. Each gradable question **must** include a `correct_answer`.
2. On submission, the app scores responses automatically.
3. `explanation` fields are shown after submission for questions that have them.
4. `paragraph` and `essay` questions are collected but not auto-scored (`correct: null`).
5. Results include total score, percentage, and per-question feedback.

When `auto_grade` is `false` or omitted:

- No automatic scoring is performed.
- `correct_answer` and `explanation` are ignored.
- `explanation` is optional and never shown to the student.

#### Grading Rules

- **multiple_choice / true_false**: Exact match (case-insensitive, trimmed).
- **multiple_select**: Set equality (order does not matter).
- **short_answer**: Matches `correct_answer` or any `alternate_answers` (case-insensitive).
- **numeric**: Numeric comparison with tolerance based on `decimal_places`.
- **matching**: All key-value pairs must match.
- **ordering**: Exact sequence match.

### Content Formatting

Question text supports:

- **Markdown**: bold, italic, headers, lists, blockquotes, tables
- **LaTeX**: inline `$...$` and display `$$...$$`
- **Images**: via `image_url` field (URL or base64)
- **Media**: optional `audio_url` and `video_url`

### Timer Behavior

When `time_limit_minutes` is set:

- A countdown timer appears in the top bar
- Warnings at 10, 5, and 1 minutes remaining
- Visual urgency state under 5 minutes
- Auto-submit when time reaches zero
- Timer state persists across app restarts using stored timestamps
- Submission reason set to `timer_expired`

When omitted, no timer is shown and the test is untimed.

---

## Response JSON (Output)

Generated upon test submission.

### Root Object

| Field | Type | Description |
|-------|------|-------------|
| `test_title` | string | Title from the original test |
| `completed_at` | string (ISO 8601) | Submission timestamp |
| `submission_reason` | string | `user_submitted` or `timer_expired` |
| `responses` | array | User answers |
| `metadata` | object | Completion statistics, original test, and optional grading |

### Response Entry

| Field | Type | Description |
|-------|------|-------------|
| `q_number` | integer | Question number |
| `answer` | varies | Answer in the format matching the question type |

### Metadata Object

| Field | Type | Description |
|-------|------|-------------|
| `total_questions` | integer | Total question count |
| `answered_count` | integer | Number of answered questions |
| `unanswered_count` | integer | Number of unanswered questions |
| `flagged_count` | integer | Number of flagged questions |
| `started_at` | string (ISO 8601) | When the test session began |
| `time_spent_seconds` | integer | Total elapsed time |
| `original_test` | object | Complete original test JSON |
| `grading` | object | Present when `auto_grade` was enabled |

### Grading Object

| Field | Type | Description |
|-------|------|-------------|
| `auto_graded` | boolean | Always `true` when present |
| `score` | number | Total points earned |
| `max_score` | number | Total possible points (gradable questions only) |
| `percentage` | number | Score as a percentage (0–100) |
| `results` | array | Per-question grading results |

### Grading Result Entry

| Field | Type | Description |
|-------|------|-------------|
| `q_number` | integer | Question number |
| `correct` | boolean \| null | `true`, `false`, or `null` if not auto-graded |
| `points_earned` | number | Points awarded |
| `points_possible` | number | Maximum points for this question |
| `explanation` | string | Included when the question has an `explanation` field |

---

## Examples

See `examples/sample-test.json` and `examples/sample-response.json`.

Formal JSON Schema: `test-schema.json`
