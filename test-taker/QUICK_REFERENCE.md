# Editorial Design — Quick Reference Cheat Sheet

## 🎯 Core Principle
**No MUI. No rounded corners. Serif for reading, monospace for utility. Sharp 1px borders.**

---

## 🎨 CSS Variables (Always Use These)

```css
/* Colors */
var(--bg-primary)        /* Main background */
var(--bg-secondary)      /* Cards/panels */
var(--text-primary)      /* Main text */
var(--text-secondary)    /* Secondary/labels */
var(--border-color)      /* 1px borders */

/* Typography */
var(--font-serif)        /* Georgia/Baskerville → Content */
var(--font-mono)         /* SF Mono → Utility text */
var(--font-sans)         /* Inter → Fallback */

/* Spacing */
var(--space-xs)   /* 0.5rem */
var(--space-sm)   /* 0.75rem */
var(--space-md)   /* 1rem */
var(--space-lg)   /* 1.5rem */
var(--space-xl)   /* 2rem */
var(--space-2xl)  /* 3rem */
```

---

## 📝 Typography Examples

### Before (MUI) → After (Editorial)

```tsx
// Heading
<Typography variant="h5">Title</Typography>
<h5 style={{ fontFamily: 'var(--font-serif)' }}>Title</h5>

// Body text
<Typography>Paragraph</Typography>
<p style={{ fontFamily: 'var(--font-serif)' }}>Paragraph</p>

// Utility/Secondary text
<Typography variant="caption" color="text.secondary">Count</Typography>
<p className="label-text">Count</p>

// Monospace
<span style={{ fontFamily: 'var(--font-mono)' }}>12:34:56</span>
```

---

## 🔘 Button Examples

### Classes to Use

```tsx
// Text-only button
<button className="btn btn-text" onClick={...}>← Back</button>

// Border button
<button className="btn" onClick={...}>Next</button>

// Filled primary
<button className="btn btn-primary" onClick={...}>Submit</button>
```

### Styling

```tsx
// All buttons use:
border: 1px solid var(--border-color);
font-family: var(--font-serif);
border-radius: 0; /* Automatic via global rule */
transition: all 0.15s ease;

// On hover:
background: var(--bg-secondary);
```

---

## 🏪 Common Containers

### Cards (Before → After)

```tsx
// Before:
<Paper sx={{ p: 2, borderRadius: 8 }}>Content</Paper>

// After:
<div className="editorial-card">Content</div>

// OR with inline:
<div style={{
  border: '1px solid var(--border-color)',
  padding: 'var(--space-lg)',
  background: 'var(--bg-secondary)',
}}>Content</div>
```

### Dividers

```tsx
// Horizontal line
<div className="divider" />

// Vertical line
<div className="divider-v" />

// Inline:
<div style={{ borderTop: '1px solid var(--border-color)', margin: 'var(--space-lg) 0' }} />
```

---

## 📋 Forms

### Input

```tsx
<input
  type="text"
  placeholder="Enter text..."
  style={{
    width: '100%',
    padding: 'var(--space-md)',
    fontFamily: 'var(--font-serif)',
    border: '1px solid var(--border-color)',
    background: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
  }}
/>
```

### Checkbox/Radio

```tsx
<input type="checkbox" style={{ accentColor: 'var(--text-primary)' }} />

/* All styling handled by editorial.css */
```

---

## 🎯 Icons → Unicode Replacements

| Icon | Unicode | Usage |
|------|---------|-------|
| Home | `←` | Back button |
| Delete | `🗑` | Delete action |
| Flag | `⚑` | Flag/mark |
| Check | `✓` | Correct/done |
| Close | `✕` | Close/cancel |
| Play | `▶` | Play/resume |
| Pause | `⏸` | Pause |
| Left | `←` | Previous |
| Right | `→` | Next |
| Menu | `≡` | Menu icon |

---

## 🌓 Dark Mode

**Automatic!** Uses `@media (prefers-color-scheme: dark)`

```tsx
// If using Tailwind classes:
<div className="bg-white dark:bg-gray-950">
  Light mode: white
  Dark mode: dark gray
</div>

// Better: Use CSS variables (auto-switching):
<div style={{ backgroundColor: 'var(--bg-primary)' }}>
  Auto-switches based on system preference
</div>
```

---

## ✅ Refactoring Checklist (Per Component)

### Step 1: Remove Imports
```tsx
// ❌ DELETE:
import { Box, Button, Typography } from '@mui/material';
import SomeIcon from '@mui/icons-material/SomeIcon';

// ✓ KEEP:
import { useState } from 'react';
```

### Step 2: Convert HTML
```tsx
// Before: <Box sx={{ display: 'flex', gap: 2 }}>
// After:  <div className="flex gap-4">

// Before: <Typography>Text</Typography>
// After:  <p>Text</p>

// Before: <Button onClick={...}>Click</Button>
// After:  <button className="btn btn-text" onClick={...}>Click</button>
```

### Step 3: Add Styling
```tsx
// Use CSS variables for colors:
style={{
  color: 'var(--text-primary)',
  background: 'var(--bg-secondary)',
  border: '1px solid var(--border-color)',
}}

// Use Tailwind for layout:
className="flex items-center gap-4 px-6 py-4"
```

### Step 4: Replace Icons
```tsx
// <DeleteIcon /> → "🗑" or text "Delete"
// <HomeIcon /> → "←" or text "Home"
// Use Unicode or keep it simple
```

### Step 5: Test
- [ ] Light mode looks good
- [ ] Dark mode looks good
- [ ] Keyboard navigation works
- [ ] No console errors

---

## 🛑 Common Mistakes

### ❌ Don't Do This

```tsx
// Using hardcoded colors
style={{ color: 'black' }}  // Won't change in dark mode!
style={{ background: '#ffffff' }}  // Wrong!

// Rounded corners
style={{ borderRadius: '8px' }}  // NO!

// MUI components
import { Button } from '@mui/material';  // NO!

// MUI icon components
<HomeIcon />  // NO!

// Inline styled-system objects
sx={{ display: 'flex', gap: 2 }}  // NO!
```

### ✅ Do This

```tsx
// Using CSS variables
style={{ color: 'var(--text-primary)' }}  // ✓ Auto dark mode

// Sharp corners
style={{ borderRadius: '0' }}  // ✓ Global rule handles it anyway

// Semantic HTML + classes
<button className="btn btn-text">Click</button>  // ✓

// Unicode symbols
<span>🗑</span>  // ✓

// Tailwind + inline vars
<div className="flex gap-4" style={{ color: 'var(--text-primary)' }}>  // ✓
```

---

## 📊 Component Structure Template

Use this as your starting point for every refactored component:

```tsx
import { /* Required imports only */ } from 'react';

interface Props {
  // ... your props
}

/**
 * ComponentName — Editorial Design
 *
 * Design:
 * - Sharp borders with 1px dividers
 * - Serif typography for content
 * - Monospace for utility text/labels
 * - (Describe specific design choices)
 */
export function ComponentName({ ...props }: Props) {
  // Logic here

  return (
    <div className="flex flex-col gap-4 px-6 py-4">
      {/* Semantic HTML with CSS variable styling */}
      <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}>
        Section Title
      </h3>
      
      <button className="btn btn-text" onClick={...}>
        Action
      </button>
    </div>
  );
}
```

---

## 🚀 Refactoring Speed Tips

1. **Copy-paste a completed component** (e.g., Timer.tsx) as template
2. **Do one component at a time** (15-60 min each)
3. **Use Find/Replace** for common patterns:
   - `<Box` → `<div`
   - `<Button` → `<button`
   - `<Typography` → `<h5>`, `<p>`, or `<span>`
4. **Test immediately** after each component
5. **Don't try to perfect** — iterate!

---

## 📞 When Stuck

1. Check **GETTING_STARTED.md** → Workflow guide
2. Check **EDITORIAL_REFACTORING_GUIDE.md** → Pattern examples
3. Look at **completed components** (TopBar, Timer, Sidebar) → Copy structure
4. Check **editorial.css** → All available classes/variables
5. Search in codebase for similar patterns already done

---

## 💪 You Got This!

Start with **BottomControls.tsx** — it's simple, straightforward, and you'll gain confidence for the rest. Follow the checklist, test as you go, and refer back to completed components.

**The result?** A beautiful, sophisticated, literary-inspired test-taking app that stands out from every other generic web application.

**Happy refactoring! 🎨📖✨**
