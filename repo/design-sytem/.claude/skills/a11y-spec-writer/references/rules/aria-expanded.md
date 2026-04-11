# aria-expanded — 열림/닫힘 상태 전달

**Priority:** CRITICAL | **WCAG:** 4.1.2 Name, Role, Value (Level A)

## Rule

버튼이 콘텐츠(드롭다운, 아코디언, 메뉴 등)를 토글할 때 `aria-expanded`로 현재 상태를 전달한다.

## Examples

```tsx
// ✅ 아코디언
function Accordion({ title, children }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        aria-expanded={open}
        aria-controls='panel-id'
        onClick={() => setOpen(!open)}>
        {title}
      </button>
      <div
        id='panel-id'
        hidden={!open}>
        {children}
      </div>
    </div>
  )
}

// ✅ 드롭다운 메뉴
;<button
  aria-expanded={isOpen}
  aria-haspopup='listbox'
  onClick={toggle}>
  옵션 선택
</button>
```

## Notes

- `aria-controls`로 제어 대상 ID 참조 — 선택이지만 권장
- `aria-haspopup` 값: `menu`, `listbox`, `tree`, `grid`, `dialog`, `true`
- 콘텐츠 숨길 때 `display:none` 또는 `hidden` 속성 사용 — `visibility:hidden`은 DOM에 남아 혼란 유발
