# keyboard-focus-trap — Trap focus inside modal/dialog

**Priority:** CRITICAL | **WCAG:** 2.1.2 No Keyboard Trap (Level A)

## Rule

While a modal or dialog is open, focus must cycle only within it. On close, return focus to the trigger button.

## Examples

```tsx
function Dialog({ isOpen, onClose, triggerRef, children }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    // Move focus to first focusable element when dialog opens
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    focusable?.[0]?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab' || !focusable?.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Return focus to trigger on close
  useEffect(() => {
    if (!isOpen) triggerRef.current?.focus()
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      ref={dialogRef}
      role='dialog'
      aria-modal='true'
      aria-labelledby='dialog-title'>
      {children}
    </div>
  )
}
```

## Notes

- With `aria-modal="true"`, some screen readers automatically recognize the focus trap
- Recommended libraries: `@radix-ui/react-dialog`, `@headlessui/react`
- Add `aria-hidden="true"` to background content so screen readers don't read it
