# keyboard-escape — Close overlays with Escape key

**Priority:** CRITICAL | **WCAG:** 2.1.1 Keyboard (Level A)

## Rule

Overlay elements — modals, dropdowns, tooltips, popovers — must be closeable with the Escape key.

## Examples

```tsx
function Modal({ isOpen, onClose }: Props) {
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // ...
}

// ✅ Nested overlays — close only the topmost one
function useEscapeKey(onClose: () => void, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation() // prevent parent overlay from closing too
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [enabled, onClose])
}
```

## Notes

- With nested overlays, use `stopPropagation` so only the topmost one closes
- After Escape closes the overlay, return focus to the trigger button (see keyboard-focus-trap)
