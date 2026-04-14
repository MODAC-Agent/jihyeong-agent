# form-fieldset — Group related fields

**Priority:** HIGH | **WCAG:** 1.3.1 Info and Relationships (Level A)

## Rule

Group related form controls (radio buttons, checkboxes) with `<fieldset>` and `<legend>`.

## Examples

```tsx
// ✅ Radio group
<fieldset>
  <legend>Notification method</legend>
  <label>
    <input type="radio" name="notify" value="email" />
    Email
  </label>
  <label>
    <input type="radio" name="notify" value="sms" />
    SMS
  </label>
</fieldset>

// ✅ Checkbox group
<fieldset>
  <legend>Areas of interest (select all that apply)</legend>
  <label>
    <input type="checkbox" name="interest" value="wcag" />
    WCAG
  </label>
  <label>
    <input type="checkbox" name="interest" value="aria" />
    ARIA
  </label>
</fieldset>

// ✅ role="group" alternative for custom components
<div role="group" aria-labelledby="group-label">
  <p id="group-label">Notification method</p>
  {/* radio buttons */}
</div>
```

## Notes

- Single input fields don't need fieldset — use only for radio/checkbox groups
- `legend` must be the first child of `fieldset`
- If styling fieldset is difficult, use `role="group"` + `aria-labelledby` as an alternative
