---
name: wcag-a11y-patterns
description: Use when building React/Next.js components from scratch and need rule-by-rule WCAG 2.1 AA implementation patterns — not for auditing existing code, but for writing accessible code correctly the first time. 26 rules across ARIA, keyboard, form, screen reader, interactive patterns, and visual categories, each in a dedicated file.
---

# wcag-a11y-patterns

## Rule Categories

| Prefix         | Category                       | Priority |
| -------------- | ------------------------------ | -------- |
| `aria-`        | Correct use of ARIA            | CRITICAL |
| `keyboard-`    | Keyboard navigation            | CRITICAL |
| `form-`        | Form accessibility             | HIGH     |
| `sr-`          | Screen reader compatibility    | HIGH     |
| `interactive-` | Interactive component patterns | HIGH     |
| `visual-`      | Visual accessibility           | MEDIUM   |

---

## Rules Index

### ARIA (CRITICAL)

- [`aria-label`](./rules/aria-label.md) — Provide accessible names for all interactive elements
- [`aria-live`](./rules/aria-live.md) — Announce dynamic content changes
- [`aria-expanded`](./rules/aria-expanded.md) — Communicate open/closed state
- [`aria-required`](./rules/aria-required.md) — Mark required form fields
- [`aria-invalid`](./rules/aria-invalid.md) — Communicate validation error state
- [`aria-describedby`](./rules/aria-describedby.md) — Link additional descriptions

### Keyboard (CRITICAL)

- [`keyboard-focus-trap`](./rules/keyboard-focus-trap.md) — Trap focus inside modal/dialog
- [`keyboard-focus-visible`](./rules/keyboard-focus-visible.md) — Always show focus indicator
- [`keyboard-escape`](./rules/keyboard-escape.md) — Close overlays with Escape key
- [`keyboard-roving-tabindex`](./rules/keyboard-roving-tabindex.md) — Roving tabindex for composite widgets
- [`keyboard-tab-order`](./rules/keyboard-tab-order.md) — Maintain logical tab order

### Form (HIGH)

- [`form-label`](./rules/form-label.md) — Link labels to all input fields
- [`form-error`](./rules/form-error.md) — Communicate error messages accessibly
- [`form-fieldset`](./rules/form-fieldset.md) — Group related fields

### Screen Reader (HIGH)

- [`sr-only`](./rules/sr-only.md) — Correct use of visually hidden text
- [`sr-heading`](./rules/sr-heading.md) — Maintain heading hierarchy
- [`sr-link-text`](./rules/sr-link-text.md) — Use meaningful link text
- [`sr-image-alt`](./rules/sr-image-alt.md) — Provide image alternative text

### Interactive Patterns (HIGH)

- [`interactive-button-link`](./rules/interactive-button-link.md) — Choosing between button and link
- [`interactive-dialog`](./rules/interactive-dialog.md) — Dialog pattern
- [`interactive-tooltip`](./rules/interactive-tooltip.md) — Tooltip pattern
- [`interactive-disclosure`](./rules/interactive-disclosure.md) — Expandable content pattern
- [`interactive-tabs`](./rules/interactive-tabs.md) — Tab component pattern

### Visual (MEDIUM)

- [`visual-color-contrast`](./rules/visual-color-contrast.md) — Color contrast requirements
- [`visual-not-color-only`](./rules/visual-not-color-only.md) — Don't convey information by color alone
- [`visual-motion`](./rules/visual-motion.md) — Animation accessibility
