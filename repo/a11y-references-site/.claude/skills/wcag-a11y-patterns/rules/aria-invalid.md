# aria-invalid — Communicate validation error state

**Priority:** CRITICAL | **WCAG:** 3.3.1 Error Identification (Level A)

## Rule

On form validation failure, use `aria-invalid` to signal the error state and link the error message with `aria-describedby`.

## Examples

```tsx
function FormField({ id, label, error, ...props }: Props) {
  const errorId = `${id}-error`

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <p
          id={errorId}
          role='alert'>
          {error}
        </p>
      )}
    </div>
  )
}
```

## Notes

- `aria-invalid="true"` — has error / `aria-invalid="false"` or omit attribute — valid
- Error messages must also be visually displayed (never convey errors by color alone)
- On submit failure, move focus to the first error field
