# form-error — Communicate error messages accessibly

**Priority:** HIGH | **WCAG:** 3.3.1 Error Identification (Level A), 3.3.3 Error Suggestion (Level AA)

## Rule

Form errors must be stated in text, programmatically linked to the field, and distinguished by more than color alone.

## Examples

```tsx
function FormField({ id, label, error, value, onChange }: Props) {
  const errorId = `${id}-error`

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <p
          id={errorId}
          role='alert'
          aria-live='assertive'>
          {/* Icon + text to distinguish beyond color */}
          <span aria-hidden='true'>⚠ </span>
          {error}
        </p>
      )}
    </div>
  )
}

// ✅ Move focus to first error on submit failure
function handleSubmit() {
  const errors = validate(values)
  if (Object.keys(errors).length > 0) {
    const firstErrorId = Object.keys(errors)[0]
    document.getElementById(firstErrorId)?.focus()
  }
}
```

## Notes

- Place error messages near (directly below) the input field
- Never use color-only expressions like "shown in red" — use descriptive text like "Invalid email format"
- Consider providing an error summary at the top of the form on submit failure
