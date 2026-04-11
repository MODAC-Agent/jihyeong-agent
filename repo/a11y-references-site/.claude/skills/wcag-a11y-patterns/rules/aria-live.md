# aria-live — Announce dynamic content changes

**Priority:** CRITICAL | **WCAG:** 4.1.3 Status Messages (Level AA)

## Rule

When the DOM changes without a user action (loading complete, error, notification), use an aria-live region to notify screen readers.

## Values

| Value       | When to use                                               |
| ----------- | --------------------------------------------------------- |
| `assertive` | Errors or warnings that must interrupt immediately        |
| `polite`    | Status or success messages that can wait for current task |
| `off`       | Default — no announcement                                 |

## Examples

```tsx
// ✅ Form error announcement (assertive)
<div role="alert" aria-live="assertive" aria-atomic="true">
  {error && <p>{error}</p>}
</div>

// ✅ Loading status announcement (polite)
<div aria-live="polite" aria-atomic="true">
  {isLoading ? 'Analyzing...' : 'Analysis complete'}
</div>

// ✅ Visually hidden live region in React
function LiveRegion({ message }: { message: string }) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  )
}
```

## Notes

- The live region must exist in the DOM at page load — adding it later may not be recognized
- `aria-atomic="true"` — reads the entire region, not just the changed part
- `role="alert"` is shorthand for `aria-live="assertive" aria-atomic="true"`
- `role="status"` is shorthand for `aria-live="polite" aria-atomic="true"`
