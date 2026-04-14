# interactive-disclosure — 열고 닫는 콘텐츠 패턴

**Priority:** HIGH | **WCAG:** 4.1.2 Name, Role, Value (Level A)

## Rule

아코디언, FAQ, 상세 펼치기 등 콘텐츠 토글 패턴은 disclosure 패턴으로 구현한다.

## Checklist

- [ ] 트리거는 `<button>`
- [ ] `aria-expanded` 상태 반영
- [ ] `aria-controls`로 패널 ID 참조
- [ ] 패널은 `id` 보유
- [ ] 숨길 때 `hidden` 속성 또는 `display:none` 사용

## Examples

```tsx
function Disclosure({ title, children }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const panelId = useId()

  return (
    <div>
      <button
        type='button'
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen(!isOpen)}>
        {title}
        <ChevronIcon
          aria-hidden='true'
          style={{ rotate: isOpen ? '180deg' : '0deg' }}
        />
      </button>
      <div
        id={panelId}
        hidden={!isOpen}>
        {children}
      </div>
    </div>
  )
}
```

## Keyboard

| 키            | 동작                    |
| ------------- | ----------------------- |
| Enter / Space | 토글                    |
| Tab           | 다음 포커스 가능 요소로 |

## Notes

- `<details>` / `<summary>` 네이티브 요소로도 구현 가능 (접근성 내장, 스타일 제한 있음)
- 아이콘 회전으로 열림/닫힘 표시 시 아이콘은 `aria-hidden="true"` 처리
- 중첩 아코디언은 각 레벨마다 별도 button + panel 구성
