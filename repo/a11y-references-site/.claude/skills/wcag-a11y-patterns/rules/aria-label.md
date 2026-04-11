# aria-label — Provide accessible names for interactive elements

**Priority:** CRITICAL | **WCAG:** 4.1.2 Name, Role, Value (Level A)

## Rule

All interactive elements (button, input, select, a, etc.) must have an accessible name.

## How to apply

1. If visible text exists, it becomes the name — no extra attribute needed
2. Icon-only button → use `aria-label`
3. Input field → prefer `<label>` association; use `aria-label` only if not possible
4. Group name → reference visible text with `aria-labelledby`

## Examples

```tsx
// ❌ Icon button with no name
<button onClick={onClose}>
  <XIcon />
</button>

// ✅ Provide aria-label
<button aria-label="Close" onClick={onClose}>
  <XIcon aria-hidden="true" />
</button>

// ✅ Reference visible text with aria-labelledby
<section aria-labelledby="section-title">
  <h2 id="section-title">Search Results</h2>
</section>
```

## Notes

- Add `aria-hidden="true"` to icon SVGs to prevent duplicate announcements
- When both `aria-label` and `aria-labelledby` are present, `aria-labelledby` takes precedence
- `placeholder` cannot substitute a label — it disappears on input
