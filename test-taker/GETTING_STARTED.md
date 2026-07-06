# Editorial Design Language — Getting Started Next Steps

## ✓ What We've Accomplished

1. **Setup Complete**
   - ✓ Installed Tailwind CSS (`tailwindcss`, `postcss`, `autoprefixer`)
   - ✓ Created `tailwind.config.ts` with editorial theme customization
   - ✓ Created `postcss.config.js` for Tailwind integration
   - ✓ Created `src/editorial.css` with complete design system tokens and base styles
   - ✓ Updated `src/main.tsx` to import `editorial.css`

2. **Refactored Components (4 files)**
   - ✓ **TestView.tsx** — Main layout with sharp vertical divider between sidebar and content
   - ✓ **TopBar.tsx** — Navigation header with serif title, monospace progress count, minimal progress bar
   - ✓ **Sidebar.tsx** — Question navigation grid with 2-column layout of sharp square cells
   - ✓ **Timer.tsx** — Monospace digital time display with minimal border, Unicode play/pause symbols

## 📋 Architecture Overview

### Styling System
- **Base**: `src/editorial.css` defines all CSS custom properties and base classes
- **Typography**: 
  - Serif (`var(--font-serif)`): Georgia, Baskerville → all body text, headings, content
  - Monospace (`var(--font-mono)`): SF Mono, Monaco → utility text, counts, timer
- **Colors**: Light mode `#FAF8F5`, Dark mode `#1C1C1E`
- **Borders**: Sharp 1px (`var(--border-light)` / `var(--border-dark)`)
- **Button Styles**: `.btn`, `.btn-text`, `.btn-primary`

### No More MUI Dependencies
- Removed all `@mui/material` imports
- No more `<Box>`, `<Typography>`, `<Button>`, etc.
- Using semantic HTML: `<div>`, `<button>`, `<h1>`, `<p>`, etc.
- No `@emotion/react` or `@emotion/styled` needed

---

## 🎯 Next Component to Refactor: BottomControls.tsx

This is the next logical step (after timer). It shows footer buttons with navigation.

### Current State (MUI):
```tsx
import { Box, Button } from '@mui/material';
<Button variant="outlined" onClick={...}>Previous</Button>
<Button variant="contained" color="primary" onClick={...}>Review</Button>
```

### Target State (Editorial):
```tsx
<button className="btn btn-text" onClick={...}>← Previous</button>
<button className="btn btn-primary" onClick={...}>Review</button>
```

### Refactoring Instructions:
1. Open [BottomControls.tsx](../src/components/BottomControls.tsx)
2. Replace MUI imports with semantic HTML
3. Use `.btn` and `.btn-text` classes
4. Replace icons with Unicode symbols (`←`, `→`, `⚑`, `✓`)
5. Ensure gap/spacing uses `gap-4` or inline `gap: 'var(--space-lg)'`

---

## 🔄 Refactoring Workflow (For Each Component)

### Step 1: Read Current Component
- Identify MUI imports: `@mui/material`, `@mui/icons-material`
- Note the component structure and props

### Step 2: Create Semantic HTML Skeleton
```tsx
// Before: <Box sx={{ display: 'flex', gap: 2 }}>
// After:
<div className="flex gap-4">
  {/* content */}
</div>
```

### Step 3: Replace Typography
```tsx
// Before: <Typography variant="h5">Title</Typography>
// After: <h5>Title</h5>

// Before: <Typography variant="caption" color="text.secondary">Label</Typography>
// After: <p className="label-text">Label</p>
```

### Step 4: Replace Buttons
```tsx
// Before: <Button variant="outlined" onClick={...}>Click</Button>
// After: <button className="btn btn-text" onClick={...}>Click</button>
```

### Step 5: Replace Icons with Unicode
Common replacements:
- `<HomeIcon />` → `←` or text "Home"
- `<DeleteIcon />` → `🗑` or text "Delete"
- `<FlagIcon />` → `⚑` (Unicode flag)
- `<CheckIcon />` → `✓`
- `<CloseIcon />` → `✕` or `×`
- `<PlayArrowIcon />` → `▶`
- `<PauseIcon />` → `⏸`
- `<ChevronLeftIcon />` → `←`
- `<ChevronRightIcon />` → `→`

### Step 6: Test & Verify
- Test in light mode ✓
- Test in dark mode ✓
- Check keyboard navigation ✓
- Verify accessibility (aria labels) ✓
- Visual comparison with original (spacing, alignment) ✓

---

## 📁 Component Refactoring Priority

### Tier 1: Simple, High-Impact (Do Next)
- [ ] **BottomControls.tsx** — Footer buttons (Previous/Next/Flag/Review/Submit)
- [ ] **PausedOverlay.tsx** — Semi-transparent pause screen
- [ ] **AppHeader.tsx** — Header with settings/history icons

### Tier 2: Moderate, Content-Heavy (Then)
- [ ] **QuestionPanel.tsx** — Main question display (most complex—many answer types)
- [ ] **Question Type Components**: 
  - [ ] **MultipleChoice.tsx**
  - [ ] **TrueFalse.tsx**
  - [ ] **MultipleSelect.tsx**
  - [ ] **ShortAnswer.tsx** / **RichTextEditor.tsx**
  - [ ] **Numeric.tsx**
  - [ ] **Matching.tsx**
  - [ ] **Ordering.tsx**

### Tier 3: Full-Page Screens (Later)
- [ ] **HomeScreen.tsx** — Hero + cards + import form
- [ ] **ReviewScreen.tsx** — Academic outline format
- [ ] **ResultsScreen.tsx** — Grade display + download
- [ ] **HistoryScreen.tsx** — Test history list
- [ ] **ReadOnlyTestView.tsx** — Viewing past test responses

### Tier 4: Dialogs & Popovers (Last)
- [ ] **SettingsDialog.tsx** — Theme/color selector
- [ ] **HistoryList.tsx** — Reusable history item list
- [ ] **LaTeXPreview.tsx** — Math formula rendering
- [ ] **ContentRenderer.tsx** — Markdown/rich content display

---

## 💡 Common Pitfalls & Solutions

### Problem 1: "I removed MUI but the app won't compile"
**Solution**: Check for remaining MUI imports:
```bash
grep -r "@mui" src/
grep -r "from '@emotion" src/
```
Delete or replace all occurrences. If a component still imports MUI, you'll get errors.

### Problem 2: "Button looks weird/misaligned"
**Solution**: Check if you used correct CSS classes:
```tsx
// ✓ Correct
<button className="btn btn-text">Click</button>

// ✗ Wrong
<button className="btn">Click</button>  <!-- Missing state modifier -->
```

### Problem 3: "Dark mode isn't working"
**Solution**: Ensure you're using CSS variables, not hardcoded colors:
```tsx
// ✓ Correct
style={{ color: 'var(--text-primary)' }}

// ✗ Wrong
style={{ color: 'black' }}  <!-- Won't change in dark mode -->
```

### Problem 4: "Borders are rounded despite our rules"
**Solution**: Global `border-radius: 0 !important` is set in `editorial.css`, but inline styles override it. Always use CSS variables for consistency.

### Problem 5: "Icons look broken/ugly"
**Solution**: Unicode symbols work great, but if you need custom SVGs:
1. Create SVG in `src/assets/icons/`
2. Import and render as `<img>` or `<svg>` element
3. Size with inline `width: 18px; height: 18px;`

---

## 🧪 Testing Checklist for Each Component

Before marking a component done:

- [ ] **Light Mode Visual**: Matches editorial aesthetic (serif type, sharp borders)
- [ ] **Dark Mode Visual**: Colors invert correctly, contrast OK
- [ ] **Responsive**: Mobile/tablet/desktop sizes work
- [ ] **Accessibility**:
  - [ ] Keyboard navigation (Tab, Enter, Arrow keys)
  - [ ] Screen reader labels (`aria-label`, `role`, `aria-live`)
  - [ ] Color contrast ratio ≥ 4.5:1
- [ ] **Interactions**:
  - [ ] Hover states visible
  - [ ] Click/tap responses feel snappy
  - [ ] Focus indicators clear
- [ ] **No Console Errors**: Check browser DevTools

---

## 🚀 Quick Dev Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check for MUI remnants
grep -r "@mui" src/
grep -r "@emotion" src/

# Open browser DevTools
F12 or Cmd+Option+I
```

---

## 📐 CSS Custom Properties Reference

Use these in any component for consistent styling:

```css
/* Colors */
var(--bg-primary)         /* Main background */
var(--bg-secondary)       /* Secondary surface */
var(--text-primary)       /* Main text */
var(--text-secondary)     /* Secondary text/labels */
var(--border-color)       /* Borders/dividers */

/* Typography */
var(--font-serif)         /* Body/headings */
var(--font-mono)          /* Utility text/counts */
var(--font-sans)          /* Fallback sans-serif */

/* Spacing (8px base) */
var(--space-xs)   /* 0.5rem */
var(--space-sm)   /* 0.75rem */
var(--space-md)   /* 1rem */
var(--space-lg)   /* 1.5rem */
var(--space-xl)   /* 2rem */
var(--space-2xl)  /* 3rem */

/* Rules/Borders */
var(--border-light)       /* 1px solid light */
var(--border-dark)        /* 1px solid dark */
```

---

## 📚 Files Reference

- **Theme System**: `src/editorial.css` ← Master design system
- **Refactoring Guide**: `EDITORIAL_REFACTORING_GUIDE.md` ← Patterns & examples
- **Tailwind Config**: `tailwind.config.ts` ← Color tokens + fonts
- **PostCSS Config**: `postcss.config.js` ← Build configuration
- **This Guide**: `GETTING_STARTED.md` ← You are here

---

## ✅ When You're Done With All Components

1. **Delete old MUI theme file**:
   ```bash
   rm src/theme/theme.ts
   ```

2. **Remove MUI from package.json**:
   ```bash
   npm uninstall @mui/material @mui/icons-material @emotion/react @emotion/styled
   ```

3. **Test full app build**:
   ```bash
   npm run build
   ```

4. **Deploy with confidence!** 🎉

---

## 🎓 Learning Resources

- **Tailwind CSS**: https://tailwindcss.com/docs
- **CSS Custom Properties (CSS Variables)**: https://developer.mozilla.org/en-US/docs/Web/CSS/--*
- **Semantic HTML**: https://html.spec.whatwg.org/multipage/semantics.html
- **Accessible Components**: https://www.a11y-project.com/

---

## 💬 Quick Questions?

**Q: Can I use Tailwind classes alongside CSS variables?**
A: Yes! Tailwind for layout (`flex`, `gap-4`, `p-6`), CSS vars for colors/fonts (`var(--text-primary)`).

**Q: Do I need to update the Tauri Rust backend?**
A: No. All changes are frontend-only. Tauri backend remains unchanged.

**Q: What about LaTeX/rich text components?**
A: Keep `react-markdown`, `katex`, `@tiptap` packages. They're not styling—just functionality. Wrap their output with editorial styling.

**Q: Should I use dark mode auto-detection?**
A: Yes! `editorial.css` uses `@media (prefers-color-scheme: dark)`. Users' OS preference is respected automatically.

---

Happy refactoring! The editorial aesthetic will truly set your app apart. Start with **BottomControls.tsx** next—it's straightforward and will build your confidence for more complex components.
