# interactive-tabs — 탭 컴포넌트 패턴

**Priority:** HIGH | **WCAG:** 4.1.2, 2.1.1 | **ARIA:** Tabs Pattern

## Rule

탭은 `role="tablist"`, `role="tab"`, `role="tabpanel"` 트리오로 구현하고 roving tabindex로 키보드 네비게이션을 제공한다.

## Checklist

- [ ] `role="tablist"` 컨테이너
- [ ] 각 탭: `role="tab"`, `aria-selected`, `aria-controls`
- [ ] 각 패널: `role="tabpanel"`, `id`, `aria-labelledby`
- [ ] 활성 탭: `tabIndex={0}`, 비활성: `tabIndex={-1}` (roving tabindex)
- [ ] 화살표 키 좌/우로 탭 전환
- [ ] Home/End 키 지원

## Examples

```tsx
function Tabs({ tabs }: { tabs: { id: string; label: string; content: ReactNode }[] }) {
  const [activeId, setActiveId] = useState(tabs[0].id)
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  function handleKeyDown(e: React.KeyboardEvent, index: number) {
    const keys: Record<string, number> = {
      ArrowRight: (index + 1) % tabs.length,
      ArrowLeft: (index - 1 + tabs.length) % tabs.length,
      Home: 0,
      End: tabs.length - 1
    }
    const next = keys[e.key]
    if (next === undefined) return
    e.preventDefault()
    setActiveId(tabs[next].id)
    tabRefs.current[tabs[next].id]?.focus()
  }

  return (
    <div>
      <div role='tablist'>
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[tab.id] = el
            }}
            role='tab'
            id={`tab-${tab.id}`}
            aria-selected={tab.id === activeId}
            aria-controls={`panel-${tab.id}`}
            tabIndex={tab.id === activeId ? 0 : -1}
            onClick={() => setActiveId(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, i)}>
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role='tabpanel'
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={tab.id !== activeId}>
          {tab.content}
        </div>
      ))}
    </div>
  )
}
```

## Notes

- `aria-selected="true/false"` — 체크박스의 `aria-checked`와 다름, 탭에는 `selected` 사용
- 자동 활성화(포커스 시 즉시 전환) vs 수동 활성화(Enter/Space로 전환) — UX에 따라 선택
- 라이브러리: `@radix-ui/react-tabs` 권장
