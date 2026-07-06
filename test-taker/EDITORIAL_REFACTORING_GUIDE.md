# Editorial Design Language — Component Refactoring Guide

## Completed Refactors ✓
- **TestView.tsx** — Main layout container (split-panel with sharp dividers)
- **TopBar.tsx** — Navigation header (serif title, monospace utilities)
- **Sidebar.tsx** — Question navigation grid (sharp square cells, Unicode indicators)

---

## Key Refactoring Patterns

### Pattern 1: Navigation/Button Components

**Before (MUI):**
```tsx
import { Button } from '@mui/material';
<Button variant="outlined" onClick={...}>Home</Button>
```

**After (Editorial):**
```tsx
<button className="btn btn-text" onClick={...}>← Home</button>
```

**CSS Classes to Use:**
- `.btn` — Base button with border
- `.btn-text` — Text-only, no border
- `.btn-primary` — Filled button for primary actions

---

### Pattern 2: Typography & Headers

**Before (MUI):**
```tsx
import { Typography } from '@mui/material';
<Typography variant="h1">Test Title</Typography>
<Typography variant="body2" color="text.secondary">Question 1 of 10</Typography>
```

**After (Editorial):**
```tsx
<h1>Test Title</h1>
<p className="label-text">Question 1 of 10</p>
```

**Font Usage:**
- `<h1>` through `<h6>` — Automatically use `var(--font-serif)` (Georgia, Baskerville)
- `.label-text`, `.utility-text`, `small` — Automatically use `var(--font-mono)` (SF Mono, monospace)
- Default body text uses `var(--font-serif)` for editorial feel

---

### Pattern 3: Containers (Card → Editorial Card)

**Before (MUI):**
```tsx
import { Paper, Card } from '@mui/material';
<Card elevation={2} sx={{ borderRadius: 8, p: 2 }}>
  <CardContent>Content here</CardContent>
</Card>
```

**After (Editorial):**
```tsx
<div className="editorial-card">
  Content here
</div>
```

**CSS:**
```css
.editorial-card {
  border: 1px solid var(--border-color);
  padding: var(--space-lg);
  background: var(--bg-secondary);
  border-radius: 0 !important; /* Sharp corners */
}
```

---

### Pattern 4: Form Controls

**Before (MUI):**
```tsx
import { TextField, Select } from '@mui/material';
<TextField fullWidth label="Test JSON" multiline rows={10} />
<Select variant="outlined">
  <MenuItem value="dark">Dark</MenuItem>
</Select>
```

**After (Editorial):**
```tsx
<textarea
  className="w-full p-4 font-mono text-sm border border-editorial-light dark:border-editorial-dark"
  placeholder="Enter test JSON..."
  rows={10}
/>

<select
  className="w-full p-3 font-serif border border-editorial-light dark:border-editorial-dark"
>
  <option value="dark">Dark Mode</option>
</select>
```

**Focus States (CSS already defined in editorial.css):**
- All inputs use `border-color: var(--text-primary)` on focus
- No box-shadow, minimal visual feedback
- Smooth 0.15s transitions

---

### Pattern 5: Lists & Ordered Content

**Before (MUI):**
```tsx
import { List, ListItem, ListItemText } from '@mui/material';
<List>
  <ListItem><ListItemText primary="Question 1" secondary="Unanswered" /></ListItem>
</List>
```

**After (Editorial):**
```tsx
<ul className="outline-list">
  <li>Question 1 — <span className="label-text">Unanswered</span></li>
  <li>Question 2 — <span className="label-text">Answered</span></li>
</ul>
```

**CSS:**
```css
.outline-list {
  list-style: none;
  padding-left: 0;
}
.outline-list li {
  padding: var(--space-md) 0;
  border-bottom: var(--border-rule) var(--border-color);
  font-family: var(--font-serif);
}
```

---

### Pattern 6: Multiple Choice / Checkboxes

**Before (MUI):**
```tsx
import { FormControlLabel, Checkbox } from '@mui/material';
<FormControlLabel
  control={<Checkbox checked={selected} onChange={...} />}
  label="Option A"
/>
```

**After (Editorial):**
```tsx
<div className="flex gap-3 py-3 border-b border-editorial-light dark:border-editorial-dark">
  <input
    type="checkbox"
    id="opt-1"
    checked={selected}
    onChange={(e) => handleChange(e.target.checked)}
  />
  <label htmlFor="opt-1" style={{ fontFamily: 'var(--font-serif)', cursor: 'pointer' }}>
    Option A
  </label>
</div>
```

**For crossed-out options:**
```tsx
<div className={`flex gap-3 py-3 ${isDisabled ? 'struck' : ''}`}>
  {/* Checkbox + Label */}
</div>
```

---

### Pattern 7: Dividers & Separators

**Before (MUI):**
```tsx
import { Divider } from '@mui/material';
<Divider sx={{ my: 2 }} />
```

**After (Editorial):**
```tsx
<div className="divider" />  <!-- Horizontal -->
<div className="divider-v" /> <!-- Vertical -->
```

**CSS:**
```css
.divider {
  border-top: var(--border-rule) var(--border-color);
  margin: var(--space-lg) 0;
}
.divider-v {
  border-left: var(--border-rule) var(--border-color);
  margin: 0 var(--space-lg);
}
```

---

### Pattern 8: Modals/Overlays

**Before (MUI):**
```tsx
import { Dialog, Modal } from '@mui/material';
<Dialog open={open} onClose={...}>
  <DialogContent>Content</DialogContent>
</Dialog>
```

**After (Editorial — Pause Overlay Example):**
```tsx
<div className="overlay-pause">
  <div className="overlay-pause-content">
    <h2>Test Paused</h2>
    <p>Press Resume to continue.</p>
    <button className="btn btn-primary" onClick={...}>Resume</button>
  </div>
</div>
```

**CSS:**
```css
.overlay-pause {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(28, 28, 30, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  border-radius: 0 !important;
}
.overlay-pause-content {
  background: var(--bg-secondary);
  border: var(--border-rule) var(--border-color);
  padding: var(--space-2xl);
  text-align: center;
  font-family: var(--font-serif);
}
```

---

## Components Still Needing Refactoring

### Priority Order:

1. **BottomControls.tsx** — Footer navigation buttons
   - Text-only buttons with subtle borders
   - Monospace labels for "Previous," "Next," "Flag"

2. **QuestionPanel.tsx** — Main question content area
   - Serif typography for question text
   - Clean formatting for answer options
   - See Pattern 6 (Multiple Choice) for answer styles

3. **Timer.tsx** — Digital time display
   - Monospace font for time readout (HH:MM:SS)
   - Optional: subtle blinking indicator for active timer

4. **PausedOverlay.tsx** — Semi-transparent pause state
   - See Pattern 8 (Overlays)
   - Minimal text + resume button

5. **HomeScreen.tsx** — Hero + card sections
   - Replace Paper/Card with editorial-card class
   - Hero section: Serif header + clean text
   - Import section: Text-only buttons with file upload
   - See Pattern 1 (Buttons) + Pattern 3 (Cards)

6. **ReviewScreen.tsx** → Academic outline format
   - Use `.outline-list` for question summary
   - Level indentation for sub-items
   - See Pattern 5 (Lists)

7. **ResultsScreen.tsx** → Serif typography + table
   - Grade display in large serif font
   - Download button (text-only or bordered)
   - See Pattern 1 + minimal icon/text style

8. **HistoryScreen.tsx** → Simple list view
   - Use `.outline-list` for test history
   - Each item: title + date + score
   - See Pattern 5 (Lists)

9. **Supporting Components:**
   - AppHeader.tsx
   - HistoryList.tsx
   - SettingsDialog.tsx
   - ContentRenderer.tsx (LaTeX, rich text)
   - Question type components (MultipleChoice, ShortAnswer, etc.)

---

## Theme Color Usage

The editorial system uses **CSS custom properties** for theme management. In any component, reference:

```css
/* Colors */
var(--bg-primary)       /* Archival paper background */
var(--bg-secondary)     /* Secondary surface (white/dark gray) */
var(--text-primary)     /* Main text color */
var(--text-secondary)   /* Secondary text (labels, hints) */
var(--border-color)     /* Border/divider color */

/* Typography */
var(--font-serif)       /* Georgia, Baskerville, serif */
var(--font-mono)        /* SF Mono, monospace */
var(--font-sans)        /* Inter, system sans-serif */

/* Spacing (8px base scale) */
var(--space-xs)  /* 0.5rem */
var(--space-sm)  /* 0.75rem */
var(--space-md)  /* 1rem */
var(--space-lg)  /* 1.5rem */
var(--space-xl)  /* 2rem */
var(--space-2xl) /* 3rem */

/* Rules */
var(--border-light)     /* 1px solid #E5E5E5 */
var(--border-dark)      /* 1px solid #2D2D2D */
```

---

## Dark Mode Handling

The system uses `prefers-color-scheme` media query. All components automatically respect the user's system preference:

```css
@media (prefers-color-scheme: dark) {
  /* Dark mode colors automatically applied */
}
```

In HTML, use Tailwind dark mode classes as examples:
```tsx
<div className="bg-white dark:bg-gray-950">
  <!-- Light: white background, Dark: #1c1c1e background -->
</div>
```

---

## Removing MUI Dependencies

Once you've refactored all components:

1. Remove from `package.json`:
   ```json
   "@mui/material": "^9.0.1",
   "@mui/icons-material": "^9.0.1",
   "@emotion/react": "^11.14.0",
   "@emotion/styled": "^11.14.1"
   ```

2. Delete `src/theme/theme.ts` (replace with editorial.css)

3. Delete MUI imports from all files

4. Run: `npm install`

---

## Quick Checklist for Each Component

- [ ] Remove all MUI imports (`@mui/material`, `@mui/icons-material`)
- [ ] Replace with semantic HTML (`<button>`, `<div>`, `<h1>`, etc.)
- [ ] Use `className` for Tailwind utilities or CSS custom properties
- [ ] Use `.btn`, `.btn-text`, `.btn-primary` for buttons
- [ ] Use `var(--font-serif)` for content, `var(--font-mono)` for labels
- [ ] Replace `<Paper>` / `<Card>` with `<div className="editorial-card">`
- [ ] Use `border-editorial-light` / `dark:border-editorial-dark` for dividers
- [ ] Set `border-radius: 0` implicitly (handled globally)
- [ ] Test in both light and dark modes
- [ ] Verify keyboard navigation still works
- [ ] Check accessibility attributes (aria-label, aria-current, etc.)

---

## Example: Full Component Refactor

### Before (MUI):
```tsx
import { Card, CardContent, Button, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export function TestCard({ title, onDelete }) {
  return (
    <Card sx={{ p: 2, mb: 2, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Button startIcon={<DeleteIcon />} onClick={onDelete}>
          Delete
        </Button>
      </CardContent>
    </Card>
  );
}
```

### After (Editorial):
```tsx
export function TestCard({ title, onDelete }) {
  return (
    <div className="editorial-card mb-4">
      <h5 style={{ fontFamily: 'var(--font-serif)', marginBottom: 'var(--space-md)' }}>
        {title}
      </h5>
      <button className="btn btn-text" onClick={onDelete}>
        🗑 Delete
      </button>
    </div>
  );
}
```

---

## Next Steps

1. **Install dependencies**: Already done (Tailwind + postcss)
2. **Start with simple components** (Timer, buttons, labels)
3. **Move to complex layouts** (QuestionPanel, HomeScreen)
4. **Test thoroughly** in both light and dark modes
5. **Remove MUI** once all components are refactored

Good luck! The editorial aesthetic will give your app a sophisticated, print-like quality that stands apart from corporate UI libraries.
