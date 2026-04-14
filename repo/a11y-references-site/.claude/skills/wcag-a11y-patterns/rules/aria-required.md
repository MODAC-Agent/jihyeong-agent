# aria-required — Mark required form fields

**Priority:** CRITICAL | **WCAG:** 3.3.2 Labels or Instructions (Level A)

## Rule

Mark required fields explicitly with `aria-required`. Pair with a visual indicator (\*).

## Examples

```tsx
// ✅
<div>
  <label htmlFor="email">
    Email
    <span aria-hidden="true"> *</span>
  </label>
  <input
    id="email"
    type="email"
    aria-required="true"
    required
  />
</div>

// ✅ Use with HTML required (activates browser native validation)
<input required aria-required="true" />
```

## Notes

- Use both HTML `required` and `aria-required="true"` together
- Add `aria-hidden="true"` to visual markers like `*` — so screen readers announce "required" not "asterisk required"
- Provide explanatory text at the top of the form: "\* indicates required fields"
