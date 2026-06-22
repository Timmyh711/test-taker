# Test Taker Architecture

## Overview

Test Taker is a local-first desktop application built with Tauri 2. The frontend is a React SPA; the Rust backend provides native file dialogs and filesystem access. No network or server components are required.

```
┌─────────────────────────────────────────────────────┐
│                   Tauri Shell (Rust)                │
│  ┌───────────────────────────────────────────────┐  │
│  │            React Frontend (WebView)           │  │
│  │  ┌─────────┐  ┌──────────┐  ┌──────────────┐ │  │
│  │  │ Import  │→ │ TestView │→ │ Review/Results│ │  │
│  │  └─────────┘  └──────────┘  └──────────────┘ │  │
│  │         ↕ localStorage (autosave)              │  │
│  └───────────────────────────────────────────────┘  │
│         ↕ Tauri Plugins: fs, dialog, opener         │
└─────────────────────────────────────────────────────┘
```

## Technology Stack

| Layer | Technology |
|-------|------------|
| Desktop shell | Tauri 2 (Rust) |
| UI framework | React 19 + TypeScript |
| Component library | Material UI (MUI) |
| Build tool | Vite |
| Markdown/LaTeX | react-markdown, remark-math, rehype-katex |
| Rich text | TipTap |
| Drag-and-drop | @dnd-kit |
| Validation | Ajv + JSON Schema |

## Application Flow

### 1. Launch

On startup, the app checks `localStorage` for a saved session (`test-taker-session` key).

- **No saved session** → Import screen
- **Saved session exists** → Resume dialog (Resume / Discard)

### 2. Import

User pastes or uploads JSON. The validation pipeline:

1. JSON syntax parse
2. Ajv schema validation (`test-schema.json`)
3. Semantic checks (duplicate `q_number`, required fields per type)

On success, a new `SavedSession` is created and persisted.

### 3. Test Taking

The `TestView` composes:

- **TopBar** — title, progress, optional timer
- **Sidebar** — question navigator with status colors
- **QuestionPanel** — content renderer + type-specific answer widget
- **BottomControls** — navigation, flag, submit

Question status is computed dynamically:

| Status | Condition |
|--------|-----------|
| Flagged | Question is flagged (overrides other statuses) |
| Answered | Valid non-empty answer |
| In Progress | Partial answer exists |
| Not Started | No answer |

### 4. Autosave

`useTestSession` hook saves the session to `localStorage` every 3 seconds. Essay/paragraph editors also trigger saves on content change.

Persisted fields:

- Test data, responses, flagged questions
- Current question index
- `startedAt`, `lastSavedAt`
- Timer: `timerStartedAt`, `timerDurationMinutes`

### 5. Timer

Timer is **timestamp-based**, not tick-based for persistence:

```
remaining = (duration_minutes × 60 × 1000) - (now - timerStartedAt)
```

This prevents bypassing the timer by closing and reopening the app. On expiry, the test auto-submits with `submission_reason: "timer_expired"`.

### 6. Review & Submit

Submit navigates to the review screen showing counts and jump links for unanswered/flagged questions. Confirm submission builds the output JSON and clears the saved session.

### 7. Results

Displays statistics and the generated JSON with:

- **Copy** — clipboard API
- **Download** — browser blob download
- **Save to File** — Tauri native save dialog + filesystem write

## Key Modules

### `src/types/test.ts`

TypeScript interfaces for test data, sessions, and output.

### `src/utils/validation.ts`

Ajv-based JSON validation with additional semantic rules.

### `src/utils/storage.ts`

localStorage read/write for session persistence.

### `src/utils/answers.ts`

Answer validation and question status computation.

### `src/utils/output.ts`

Builds the final response JSON with metadata.

### `src/utils/timer.ts`

Timestamp-based timer calculations and formatting.

### `src/hooks/useTestSession.ts`

Central state management for the test lifecycle.

### `src/components/questions/`

One component per question type, plus shared `RichTextEditor`.

## Packaging

Tauri bundles the compiled Vite output (`dist/`) with the Rust binary. The `tauri.conf.json` targets `.deb` for Ubuntu:

```bash
npm run tauri build
# Output: src-tauri/target/release/bundle/deb/test-taker_1.0.0_amd64.deb
```

## Security

- No network requests required for core functionality
- CSP configured in Tauri
- File system access limited to Tauri plugin permissions (save dialog only)
- All test data stays local

## Accessibility

- Keyboard navigation (arrow keys for question navigation)
- ARIA labels on interactive controls
- Screen reader-friendly status indicators
- High-contrast dark theme

## Error Handling

- JSON import errors displayed with field-level detail
- Invalid question types caught at validation
- Graceful fallback if native file save fails (browser download)
- Storage errors fail silently without crashing
