# sr-only — Correct use of visually hidden text

**Priority:** HIGH | **WCAG:** 1.1.1, 2.4.6

## Rule

Use the `sr-only` class to hide text that should only be read by screen readers. Never use `display:none` or `visibility:hidden`.

> **Why not `display:none`?**
> Both `display:none` and `visibility:hidden` remove the element from the accessibility tree, meaning screen readers can't read it either. `sr-only` shrinks the element to 1px and moves it off-screen, so it's visually invisible but still present in the accessibility tree for screen readers to read.

## sr-only CSS

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

## Examples

```tsx
// ✅ Hidden label for icon button
<button onClick={onDelete}>
  <TrashIcon aria-hidden="true" />
  <span className="sr-only">Delete item</span>
</button>

// ✅ Add table context
<td>
  <button>Edit</button>
  <span className="sr-only">John Doe</span>
</td>

// ✅ Skip navigation (revealed on focus)
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
>
  Skip to main content
</a>
```

## Notes

- `display:none` — hidden from screen readers too (completely hidden)
- `visibility:hidden` — hidden from screen readers too
- `sr-only` — visually hidden, still read by screen readers
- Tailwind: `className="sr-only"` built in
