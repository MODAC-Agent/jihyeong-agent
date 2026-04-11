# aria-describedby — Link additional descriptions

**Priority:** CRITICAL | **WCAG:** 1.3.1 Info and Relationships (Level A)

## Rule

When additional context beyond the label exists (hints, errors, help text), link it with `aria-describedby`.

## Examples

```tsx
// ✅ Link hint text
<div>
  <label htmlFor="password">Password</label>
  <input
    id="password"
    type="password"
    aria-describedby="password-hint"
  />
  <p id="password-hint">At least 8 characters, including a special character</p>
</div>

// ✅ Link both error and hint (space-separated IDs)
<input
  aria-describedby="password-hint password-error"
  aria-invalid={!!error}
/>
```

## Notes

- `aria-labelledby` — names the element (acts as label)
- `aria-describedby` — describes the element (acts as description), read after the label
- Multiple IDs are space-separated and read in listed order
