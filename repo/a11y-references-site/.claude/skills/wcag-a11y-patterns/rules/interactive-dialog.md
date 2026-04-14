# interactive-dialog — Dialog pattern

**Priority:** HIGH | **WCAG:** 2.1.1, 2.1.2, 4.1.2

## Rule

A dialog must implement `role="dialog"`, `aria-modal="true"`, a label, focus trap, and Escape to close.

## Checklist

- [ ] `role="dialog"` or native `<dialog>` element
- [ ] `aria-modal="true"`
- [ ] `aria-labelledby` (referencing title ID) or `aria-label`
- [ ] Move focus to first focusable element on open
- [ ] Focus trap (see keyboard-focus-trap)
- [ ] Escape to close (see keyboard-escape)
- [ ] Return focus to trigger button on close
- [ ] `aria-hidden="true"` on background content

## Examples

```tsx
function Dialog({ isOpen, onClose, title, children }: Props) {
  const titleId = useId()

  return isOpen ? (
    <div
      role='dialog'
      aria-modal='true'
      aria-labelledby={titleId}>
      <h2 id={titleId}>{title}</h2>
      {children}
      <button
        type='button'
        onClick={onClose}>
        Close
      </button>
    </div>
  ) : null
}

// Hide background content
;<main aria-hidden={isDialogOpen ? 'true' : undefined}>{/* main content */}</main>
```

## Notes

- Native `<dialog>` + `showModal()` handles focus trap automatically (modern browsers)
- Recommended library: `@radix-ui/react-dialog` (built-in accessibility)
- Alert dialog (confirming destructive action) → use `role="alertdialog"`
