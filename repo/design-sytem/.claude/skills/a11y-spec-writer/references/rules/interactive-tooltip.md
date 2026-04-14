# interactive-tooltip — 툴팁 패턴

**Priority:** HIGH | **WCAG:** 1.4.13 Content on Hover or Focus (Level AA)

## Rule

툴팁은 호버와 키보드 포커스 모두에서 표시되어야 하며, Escape로 닫을 수 있어야 한다.

## Checklist

- [ ] 호버 + 포커스 시 노출
- [ ] `role="tooltip"` + `id`
- [ ] 트리거에 `aria-describedby` 연결
- [ ] Escape로 닫기 가능
- [ ] 툴팁 위로 마우스 이동 가능 (사라지지 않아야 함)
- [ ] 내용 선택/복사 가능

## Examples

```tsx
function Tooltip({ content, children }: Props) {
  const [visible, setVisible] = useState(false)
  const tooltipId = useId()

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {cloneElement(children, {
        'aria-describedby': visible ? tooltipId : undefined,
        onMouseEnter: () => setVisible(true),
        onMouseLeave: () => setVisible(false),
        onFocus: () => setVisible(true),
        onBlur: () => setVisible(false),
        onKeyDown: (e: KeyboardEvent) => {
          if (e.key === 'Escape') setVisible(false)
        }
      })}
      {visible && (
        <div
          role='tooltip'
          id={tooltipId}
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}>
          {content}
        </div>
      )}
    </div>
  )
}
```

## Notes

- 툴팁은 보조 정보 — 필수 정보는 항상 화면에 표시
- 인터랙티브 콘텐츠(링크, 버튼)가 필요하면 툴팁 대신 `role="dialog"` 팝오버 사용
- 모바일: 호버 없으므로 포커스/탭으로 접근 가능해야 함
- 라이브러리: `@radix-ui/react-tooltip` 권장
