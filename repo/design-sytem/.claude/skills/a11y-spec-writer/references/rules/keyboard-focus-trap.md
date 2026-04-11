# keyboard-focus-trap — 모달/다이얼로그 포커스 가두기

**Priority:** CRITICAL | **WCAG:** 2.1.2 No Keyboard Trap (Level A)

## Rule

모달, 다이얼로그가 열려 있을 때 포커스가 그 안에서만 순환해야 한다. 닫히면 트리거 버튼으로 포커스 복귀.

## Examples

```tsx
function Dialog({ isOpen, onClose, triggerRef, children }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    // 다이얼로그 열리면 첫 번째 포커스 가능 요소로 이동
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

  // 닫힐 때 트리거로 포커스 복귀
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

- `aria-modal="true"` 설정 시 일부 스크린리더는 포커스 트랩을 자동으로 인식
- 라이브러리 사용 권장: `@radix-ui/react-dialog`, `@headlessui/react`
- 모달 뒤 콘텐츠에 `aria-hidden="true"` 추가해서 스크린리더가 읽지 않도록
