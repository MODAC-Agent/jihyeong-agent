# keyboard-focus-visible — Always show focus indicator

**Priority:** CRITICAL | **WCAG:** 2.4.7 Focus Visible (Level AA)

## Rule

Never remove the visual focus indicator on keyboard focus. Do not use `outline: none` / `outline: 0` alone.

> **Why is `outline: none` such a problem?**
> Users who can't use a mouse rely on the Tab key to navigate, using the outline to know which element has focus. Removing it with `outline: none` makes it impossible for keyboard users to know where they are on the page. If the browser default outline doesn't match your design, replace it with a custom style — don't remove it.

## Examples

```css
/* ❌ Removes focus entirely */
/* Keyboard users have no way to determine their current location */
:focus {
  outline: none;
}
*:focus {
  outline: 0;
}

/* ✅ Replace with custom focus style */
:focus-visible {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
  border-radius: 2px;
}

/* ✅ Hide on mouse click, show on keyboard only */
:focus:not(:focus-visible) {
  outline: none;
}
:focus-visible {
  outline: 2px solid #0066cc;
}
```

```tsx
// ✅ Tailwind
<button className='focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2'>Click</button>
```

## Notes

- `:focus-visible` — applies only to keyboard focus, not mouse clicks (supported in modern browsers)
- Contrast requirement: focus indicator should have 3:1 contrast against background (WCAG 2.2)
- Use `outline-offset` for spacing between element and indicator
