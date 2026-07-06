# Editorial Design Language Migration — Complete Roadmap

Welcome! This index will guide you through transforming your Test Taker app from corporate Material-UI to a sophisticated Editorial & Literary design language.

---

## 📚 Documentation Files

### 🎯 Start Here
- **[GETTING_STARTED.md](GETTING_STARTED.md)** ← Read this first!
  - What we've accomplished
  - Overview of refactoring workflow
  - Priority list for next components
  - Common pitfalls & solutions

### 📐 Design System Reference
- **[editorial.css](src/editorial.css)**
  - Complete CSS custom property system
  - Base styles for all HTML elements
  - Color tokens (light/dark mode)
  - Typography definitions
  - Reusable CSS classes (`.btn`, `.label-text`, `.editorial-card`, etc.)

- **[tailwind.config.ts](tailwind.config.ts)**
  - Theme customization for Tailwind
  - Font family configuration
  - Color palette extensions

- **[EDITORIAL_REFACTORING_GUIDE.md](EDITORIAL_REFACTORING_GUIDE.md)**
  - Detailed patterns for common components
  - 8 reusable refactoring patterns (Navigation, Typography, Containers, Forms, Lists, etc.)
  - Component checklist
  - Before/after code examples

### ✅ Completion Status
- **[BEFORE_AFTER_SUMMARY.md](BEFORE_AFTER_SUMMARY.md)**
  - Visual before/after comparison
  - All 5 completed components with detailed code reviews
  - Bundle size improvements
  - Verification checklist

---

## ✨ What's Been Refactored (5 Components)

### ✓ Core Infrastructure
1. ✓ **Tailwind CSS Setup** — Added with custom editorial theme
2. ✓ **editorial.css** — Master design system (300+ lines)
3. ✓ **src/main.tsx** — Now imports editorial.css

### ✓ Components (Completed)
1. ✓ **TestView.tsx** — Main layout with sharp dividers
2. ✓ **TopBar.tsx** — Navigation header
3. ✓ **Sidebar.tsx** — Question grid (2-column, sharp squares)
4. ✓ **Timer.tsx** — Digital time display with Unicode symbols
5. ✓ **PausedOverlay.tsx** — Pause modal with editorial styling

---

## 🎯 Recommended Refactoring Order

### Phase 1: Simple Components (Next)
- [ ] **BottomControls.tsx** — Footer navigation buttons
  - Time: ~15 min
  - Difficulty: Easy
  - Pattern: Use `.btn` and `.btn-text` classes
  
- [ ] **AppHeader.tsx** — Settings/history icons
  - Time: ~15 min
  - Difficulty: Easy
  - Pattern: Text-only buttons

- [ ] **HistoryList.tsx** — Reusable history item component
  - Time: ~20 min
  - Difficulty: Easy
  - Pattern: Use `.outline-list` for semantic list

### Phase 2: Moderate Components (Then)
- [ ] **QuestionPanel.tsx** — Main question display
  - Time: ~45 min
  - Difficulty: Moderate (must render different question types)
  - Pattern: See "Question Type Components" below

- [ ] **Question Type Components** (5 files)
  - [ ] MultipleChoice.tsx
  - [ ] TrueFalse.tsx
  - [ ] MultipleSelect.tsx
  - [ ] ShortAnswer.tsx / RichTextEditor.tsx
  - [ ] Numeric.tsx, Matching.tsx, Ordering.tsx
  - Time: ~30 min each
  - Difficulty: Moderate
  - Pattern: Sharp checkboxes/radio buttons with list styling

### Phase 3: Full-Page Screens (Later)
- [ ] **HomeScreen.tsx** — Hero + import area
  - Time: ~60 min
  - Difficulty: Moderate-High (many elements)
  - Pattern: Grid layout, `.editorial-card`, form inputs

- [ ] **ReviewScreen.tsx** — Academic outline format
  - Time: ~30 min
  - Difficulty: Moderate
  - Pattern: Use `.outline-list` for hierarchical content

- [ ] **ResultsScreen.tsx** — Grade display + download
  - Time: ~30 min
  - Difficulty: Moderate
  - Pattern: Large serif numbers, minimal buttons

- [ ] **HistoryScreen.tsx** — Test history list
  - Time: ~25 min
  - Difficulty: Easy
  - Pattern: Use `.outline-list` with test metadata

- [ ] **ReadOnlyTestView.tsx** — Past test view
  - Time: ~45 min
  - Difficulty: Moderate
  - Pattern: Reuse TestView structure with read-only styling

### Phase 4: Dialogs & Utilities (Last)
- [ ] **SettingsDialog.tsx** — Theme/color selector
  - Time: ~30 min
  - Difficulty: Moderate
  - Pattern: Form inputs, radio/checkbox groups

- [ ] **LaTeXPreview.tsx** — Math formula rendering
  - Time: ~15 min
  - Difficulty: Easy
  - Pattern: Minimal wrapper styling

- [ ] **ContentRenderer.tsx** — Markdown/rich content
  - Time: ~20 min
  - Difficulty: Easy
  - Pattern: Style existing markdown output

---

## 💡 Key Concepts

### Color Tokens (Always Use Variables)
```css
var(--bg-primary)         /* Main background */
var(--bg-secondary)       /* Cards/panels */
var(--text-primary)       /* Main text */
var(--text-secondary)     /* Secondary text */
var(--border-color)       /* 1px borders */
```

### Typography Stack
```css
var(--font-serif)         /* Georgia, Baskerville → All reading content */
var(--font-mono)          /* SF Mono → Utility labels, counts, timer */
var(--font-sans)          /* Inter → Fallback */
```

### Button Classes (Use These)
```html
<button class="btn btn-text">Text only</button>
<button class="btn">Border with background on hover</button>
<button class="btn btn-primary">Filled primary action</button>
```

### Common Patterns
- **Borders**: `border-1 border-editorial-light dark:border-editorial-dark`
- **Spacing**: `gap-4` (Tailwind), `padding: var(--space-lg)` (CSS)
- **Lists**: `<ul class="outline-list">`
- **Dividers**: `<div class="divider" />`
- **Cards**: `<div class="editorial-card">`

### No MUI!
- ❌ No `@mui/material` imports
- ❌ No `@mui/icons-material` imports
- ❌ No styled components (`sx={}` objects)
- ✅ Use semantic HTML: `<div>`, `<button>`, `<h1>`, `<p>`, etc.
- ✅ Use CSS classes and inline styles with variables

---

## 🧪 Testing Checklist (For Each Component)

Before marking done:

### Visual
- [ ] Light mode: serif type, sharp borders, good spacing
- [ ] Dark mode: colors invert, contrast OK
- [ ] Responsive: works on mobile, tablet, desktop

### Interaction
- [ ] Buttons clickable and have hover state
- [ ] Inputs focusable with visible focus ring
- [ ] Forms submit correctly
- [ ] Navigation works as expected

### Accessibility
- [ ] Keyboard navigation (Tab, Enter, Arrow keys)
- [ ] Screen reader friendly (aria-label, role, etc.)
- [ ] Color contrast ≥ 4.5:1 (test with WebAIM Contrast Checker)
- [ ] Focus indicators visible

### Code
- [ ] No MUI imports remaining
- [ ] No console errors
- [ ] Uses CSS variables for colors
- [ ] Uses semantic HTML
- [ ] Proper type definitions for props

---

## 📊 Progress Tracker

### Completed ✓
- [x] Setup (Tailwind + editorial.css)
- [x] TestView.tsx
- [x] TopBar.tsx
- [x] Sidebar.tsx
- [x] Timer.tsx
- [x] PausedOverlay.tsx

### In Progress (Recommended Next)
- [ ] BottomControls.tsx
- [ ] QuestionPanel.tsx (+ question types)
- [ ] HomeScreen.tsx

### Not Started
- [ ] Other components (see full list above)

---

## 🚀 Quick Start Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Check for MUI remnants
grep -r "@mui" src/

# Format code (if prettier installed)
npm run format
```

---

## 📖 Example Refactoring (Copy-Paste Template)

Use this template for each new component:

### Step 1: Read Current Code
```bash
# See what you're working with
```

### Step 2: Replace MUI with Semantic HTML
```tsx
// Before:
import { Box, Typography, Button } from '@mui/material';

// After:
// (no imports needed!)
```

### Step 3: Convert JSX Structure
```tsx
// Before:
<Box sx={{ display: 'flex', gap: 2, p: 3 }}>
  <Typography>Title</Typography>
  <Button onClick={...}>Click</Button>
</Box>

// After:
<div className="flex gap-4 p-6">
  <h5>Title</h5>
  <button className="btn btn-text" onClick={...}>Click</button>
</div>
```

### Step 4: Add Typography Styles
```tsx
// Before:
<Typography variant="h5" sx={{ fontWeight: 600 }}>Title</Typography>

// After:
<h5 style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}>Title</h5>
```

### Step 5: Replace Icons
```tsx
// Before:
import DeleteIcon from '@mui/icons-material/Delete';
<DeleteIcon />

// After:
<span style={{ fontSize: '1rem' }}>🗑</span>
// Or just: "🗑 Delete"
```

### Step 6: Test
- Light mode ✓
- Dark mode ✓
- Keyboard nav ✓
- No console errors ✓

---

## ❓ FAQ

**Q: Do I need to refactor all components at once?**
A: No! Refactor incrementally. Components work with both old (MUI) and new (editorial) styling during transition.

**Q: Can I use Tailwind classes and CSS variables together?**
A: Yes! This is the recommended approach. Tailwind for layout, CSS vars for theme colors.

**Q: What about third-party components (react-markdown, katex)?**
A: Keep them. They're not styling—just functionality. Wrap their output with editorial styling classes.

**Q: How do I handle complex animations?**
A: Use CSS `@keyframes` in `editorial.css` or inline `<style>` blocks. See Timer.tsx for examples.

**Q: Should I convert the Tauri backend too?**
A: No. These changes are frontend-only. Tauri Rust code unchanged.

**Q: How do I test dark mode?**
A: Use browser DevTools: Settings → Rendering → Emulate CSS media feature `prefers-color-scheme`. Or go to System Settings on your OS.

**Q: Can I use this design system in other projects?**
A: Absolutely! `editorial.css` and `tailwind.config.ts` are portable. Copy them to any project.

---

## 🎓 Learning Resources

- **Tailwind CSS**: https://tailwindcss.com/docs
- **CSS Custom Properties**: https://developer.mozilla.org/en-US/docs/Web/CSS/--*
- **Semantic HTML**: https://html.spec.whatwg.org/
- **Web Accessibility**: https://www.a11y-project.com/
- **Design Inspiration**: Oxford/Cambridge exam papers, NYT, Wired Magazine

---

## 🌟 Final Thoughts

You're transforming your app from a generic corporate UI to a **distinctive, editorial-focused design**. Every decision emphasizes:

- **Readability** (serif typography)
- **Simplicity** (sharp borders, no frills)
- **Functionality** (clear hierarchy, minimal decoration)
- **Sophistication** (premium materials aesthetic)

Your application will stand out as a **thoughtfully designed study tool** rather than another cookie-cutter web app.

---

## 📞 Need Help?

Refer to:
1. **GETTING_STARTED.md** — Workflow & common pitfalls
2. **EDITORIAL_REFACTORING_GUIDE.md** — Specific patterns & examples
3. **editorial.css** — All available CSS classes & variables
4. **BEFORE_AFTER_SUMMARY.md** — Completed component examples

---

**Happy refactoring! Build something beautiful. 🎨📖✨**
