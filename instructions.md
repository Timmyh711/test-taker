# Project: Test Taker (.deb Ubuntu Application)

Create a production-quality Ubuntu desktop application called **Test Taker** that can be packaged as a **.deb** file.

## Purpose

The application acts as a visual interface ("skin") for test JSON files.

Workflow:

1. User launches Test Taker.
2. User pastes a test JSON into an import screen.
3. App validates the JSON.
4. App presents the test in a professional testing environment.
5. User answers questions.
6. User submits the test.
7. App generates an output JSON containing:

   * Original questions
   * User responses
   * Metadata
8. App displays the generated JSON with:

   * Copy button
   * Download JSON button
   * Save to file button

No server required. Everything runs locally.

---

# Technology Requirements

Preferred stack:

* Tauri (preferred over Electron for smaller size)
* React + TypeScript
* Material UI (MUI)
* Vite
* KaTeX or MathJax for LaTeX rendering

The final project must:

* Build on Ubuntu
* Generate a .deb package
* Run completely offline
* Require no backend

---

# UI Requirements

Design inspiration:

* College Board Bluebook
* Modern testing software
* Material Design 3

Theme:

* Dark mode only
* Blue accent color
* Professional academic appearance

Layout:

Left sidebar:

* Question navigator
* Question status indicators:

  * Not Started
  * In Progress
  * Answered
  * Flagged

Main panel:

* Question content
* Answer area

Top bar:

* Test title
* Question count
* Progress indicator

Bottom controls:

* Previous Question
* Next Question
* Flag Question
* Submit Test

---

# Question Features

Support:

### Multiple Choice

Single answer

Example:

A
B
C
D

---

### Multiple Select

Select multiple choices

Example:

Select all that apply

☑ A
☐ B
☑ C
☐ D

---

### True/False

Radio buttons

---

### Short Answer

Single-line text field

---

### Paragraph Response

Multi-line text area

Supports:

* Markdown formatting
* Rich text toolbar

---

### Essay Response

Large editor

Supports:

* Bold
* Italic
* Underline
* Blockquotes
* Lists
* Code blocks
* Links
* LaTeX

Auto-save every few seconds.

---

### Numeric Response

Number input

Optional:

* Decimal restriction
* Integer-only mode

---

### Matching

Match items from two columns.

---

### Ordering

Drag-and-drop ordering.

---

# Content Rendering

Question text supports:

* Plain text
* Markdown
* Rich text formatting

Render:

* Bold
* Italic
* Underline
* Headers
* Lists
* Blockquotes
* Tables

Support inline and display LaTeX.

Examples:

Inline:

$E = mc^2$

Display:

$$
\int_0^1 x^2 dx
$$

Images supported:

* URL images
* Base64 images

Optional:

* Audio
* Video

---

# User Experience

Autosave progress.

Store unfinished tests locally.

On reopening:

"Resume previous test?"

Allow:

* Resume
* Discard

Confirmation before final submission.

After submission:

Display:

"Test Complete"

Show:

* Statistics
* Question counts
* Response summary

---

# Output JSON

Generate JSON containing:

* Original test
* User responses
* Completion metadata

Example:

{
"test_title": "Algebra Practice",
"completed_at": "2026-06-07T18:30:00Z",
"responses": [
{
"q_number": 1,
"answer": "B"
},
{
"q_number": 2,
"answer": "x = 5"
}
]
}

---

# Accessibility

Keyboard navigation.

Shortcuts:

* Arrow keys
* Enter
* Tab

High contrast support.

Screen reader friendly.

---

# Error Handling

Validate JSON before importing.

Show detailed errors:

* Missing fields
* Invalid question type
* Invalid formatting

Never crash.

---

# Deliverables

Generate:

1. Full source code
2. Folder structure
3. Build instructions
4. Tauri configuration
5. .deb packaging configuration
6. Example test JSON
7. Example response JSON
8. README.md
9. Installation instructions for Ubuntu
10. Architecture documentation

---

# JSON Specification Documentation

Create a complete developer-facing JSON schema document called json_docs.md.

Required question fields:

{
"q_number": 1,
"question_type": "multiple_choice",
"question_text": "What is 2 + 2?"
}

Supported question types:

* multiple_choice
* multiple_select
* true_false
* short_answer
* paragraph
* essay
* numeric
* matching
* ordering

Multiple choice example:

{
"q_number": 1,
"question_type": "multiple_choice",
"question_text": "What is 2 + 2?",
"choices": [
"1",
"2",
"3",
"4"
]
}

Multiple select example:

{
"q_number": 2,
"question_type": "multiple_select",
"question_text": "Select prime numbers.",
"choices": [
"2",
"3",
"4",
"5"
]
}

Short answer example:

{
"q_number": 3,
"question_type": "short_answer",
"question_text": "Name the capital of France."
}

Essay example:

{
"q_number": 4,
"question_type": "essay",
"question_text": "Discuss the causes of World War I."
}

Optional fields:

{
"required": true,
"points": 5,
"explanation": "...",
"hint": "...",
"image_url": "...",
"audio_url": "...",
"video_url": "...",
"latex_enabled": true
}

Test-level metadata:

{
"title": "Sample Test",
"description": "Practice Exam",
"version": "1.0",
"author": "Teacher",
"time_limit_minutes": 60,
"questions": []
}

Create a formal JSON Schema file and documentation for all fields.



# Additional Features

## Optional Timer Support

Timer functionality is controlled entirely by the test JSON.

If no timer field exists:

* No timer is displayed.
* Test is untimed.

If a timer field exists:

{
"title": "Practice Exam",
"time_limit_minutes": 60,
"questions": []
}

then the application must:

* Display a countdown timer in the top bar.
* Persist timer state during autosave.
* Continue counting correctly after application restart.
* Show warnings:

  * 10 minutes remaining
  * 5 minutes remaining
  * 1 minute remaining
* Visual warning state when under 5 minutes.

When time reaches zero:

* Automatically submit the test.
* Prevent further editing.
* Generate the final response JSON.
* Mark the submission reason as "timer_expired".

Example metadata:

{
"completed_at": "2026-06-07T18:30:00Z",
"submission_reason": "timer_expired"
}

or

{
"completed_at": "2026-06-07T18:12:00Z",
"submission_reason": "user_submitted"
}

The timer must be resistant to simple attempts to bypass it by closing and reopening the application. Remaining time should be calculated using stored timestamps rather than only an in-memory countdown.

---

## Review Screen

Before final submission, provide a review screen showing:

* Total questions
* Answered questions
* Unanswered questions
* Flagged questions
* Remaining time (if timed)

Allow users to jump directly to any unanswered or flagged question before submitting.

