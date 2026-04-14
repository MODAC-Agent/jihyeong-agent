# keyboard-escape — Escape로 오버레이 닫기

**Priority:** CRITICAL | **WCAG:** 2.1.1 Keyboard (Level A)

## Rule

모달, 드롭다운, 툴팁, 팝오버 등 오버레이 요소는 Escape 키로 닫을 수 있어야 한다.

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

// ✅ 중첩된 오버레이 — 가장 위의 것만 닫기
function useEscapeKey(onClose: () => void, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation() // 부모 오버레이까지 닫히지 않도록
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [enabled, onClose])
}
```

## Notes

- 중첩 오버레이 시 `stopPropagation`으로 가장 위의 것만 닫히도록 처리
- Escape 닫기 후 트리거 버튼으로 포커스 복귀 필수 (keyboard-focus-trap 참조)
