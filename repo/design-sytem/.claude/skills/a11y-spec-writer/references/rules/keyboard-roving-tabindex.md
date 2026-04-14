# keyboard-roving-tabindex — 복합 위젯의 roving tabindex

**Priority:** CRITICAL | **WCAG:** 2.1.1 Keyboard (Level A)

## Rule

탭, 라디오 그룹, 메뉴, 툴바 같은 복합 위젯은 그룹 자체는 탭 한 번으로 진입하고, 내부는 화살표 키로 이동한다. (roving tabindex 패턴)

## Examples

```tsx
function TabList({ tabs }: { tabs: Tab[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  function handleKeyDown(e: React.KeyboardEvent, index: number) {
    let next = index
    if (e.key === 'ArrowRight') next = (index + 1) % tabs.length
    else if (e.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = tabs.length - 1
    else return

    e.preventDefault()
    setActiveIndex(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <div role='tablist'>
      {tabs.map((tab, i) => (
        <button
          key={tab.id}
          ref={(el) => {
            tabRefs.current[i] = el
          }}
          role='tab'
          aria-selected={i === activeIndex}
          aria-controls={`panel-${tab.id}`}
          tabIndex={i === activeIndex ? 0 : -1}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onClick={() => setActiveIndex(i)}>
          {tab.label}
        </button>
      ))}
    </div>
  )
}
```

## Notes

- 활성 항목만 `tabIndex={0}`, 나머지는 `tabIndex={-1}`
- 화살표 키: 좌우(탭/메뉴) 또는 상하(트리/리스트박스)
- Home/End 키 지원 권장
- 적용 대상: Tab, Radio Group, Menu, Toolbar, Listbox, Tree
