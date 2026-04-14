# interactive-dialog — 다이얼로그 패턴

**Priority:** HIGH | **WCAG:** 2.1.1, 2.1.2, 4.1.2

## Rule

다이얼로그는 `role="dialog"`, `aria-modal="true"`, 레이블, 포커스 트랩, Escape 닫기를 모두 구현한다.

## Checklist

- [ ] `role="dialog"` 또는 `<dialog>` 네이티브 요소
- [ ] `aria-modal="true"`
- [ ] `aria-labelledby` (제목 ID 참조) 또는 `aria-label`
- [ ] 열릴 때 첫 포커스 가능 요소로 이동
- [ ] 포커스 트랩 (keyboard-focus-trap 참조)
- [ ] Escape로 닫기 (keyboard-escape 참조)
- [ ] 닫힐 때 트리거 버튼으로 포커스 복귀
- [ ] 뒤 콘텐츠 `aria-hidden="true"`

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
        닫기
      </button>
    </div>
  ) : null
}

// 뒤 콘텐츠 숨기기
;<main aria-hidden={isDialogOpen ? 'true' : undefined}>{/* 메인 콘텐츠 */}</main>
```

## Notes

- 네이티브 `<dialog>` 요소 + `showModal()` 사용 시 포커스 트랩 자동 처리 (모던 브라우저)
- 라이브러리: `@radix-ui/react-dialog` 권장 (접근성 내장)
- Alert dialog (파괴적 액션 확인) → `role="alertdialog"` 사용
