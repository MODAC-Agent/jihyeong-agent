# keyboard-tab-order — Maintain logical tab order

**Priority:** CRITICAL | **WCAG:** 2.4.3 Focus Order (Level A)

## Rule

Tab order must follow the visual layout and logical content sequence. Never use positive `tabIndex` values.

## Examples

```tsx
// ❌ Positive tabIndex — unpredictable tab order
// Positive tabIndex values bring those elements before all tabIndex=0 elements.
// Mixed positive values scramble the entire page tab flow,
// leaving keyboard users with focus jumping unpredictably.
<button tabIndex={3}>Third</button>
<button tabIndex={1}>First</button>
<button tabIndex={2}>Second</button>

// ✅ DOM order = tab order
// HTML source order is tab order. No extra handling needed.
<button>First</button>
<button>Second</button>
<button>Third</button>

// ✅ Move focus explicitly when modal opens (DOM order takes priority)
useEffect(() => {
  if (isOpen) firstFocusableRef.current?.focus()
}, [isOpen])

// ❌ CSS visual order differs from DOM order
// The right button appears first visually, but tabs first per DOM order.
// Mismatch between visible and tab order confuses keyboard users.
<div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
  <button>Visually on the right</button> {/* tabs first */}
  <button>Visually on the left</button>
</div>
```

## Notes

- `tabIndex={0}` — included in default tab order (same as omitting tabIndex)
- `tabIndex={-1}` — excluded from tab order. Not reachable via Tab, but focusable via JS (`element.focus()`) — useful for moving focus programmatically on modal open
- Positive `tabIndex` — reorders the entire page tab sequence by number, causing unintended reversals. Nearly impossible to maintain as components are added/removed → never use
- Review DOM vs. visual order when using CSS `order` or `flex-direction: row-reverse`
