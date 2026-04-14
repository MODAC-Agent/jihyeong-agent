# interactive-tabs — Tab component pattern

**Priority:** HIGH | **WCAG:** 4.1.2, 2.1.1 | **ARIA:** Tabs Pattern

## Rule

Tabs must be implemented with the `role="tablist"`, `role="tab"`, `role="tabpanel"` trio, with roving tabindex for keyboard navigation.

## Checklist

- [ ] `role="tablist"` container
- [ ] Each tab: `role="tab"`, `aria-selected`, `aria-controls`
- [ ] Each panel: `role="tabpanel"`, `id`, `aria-labelledby`
- [ ] Active tab: `tabIndex={0}`, inactive: `tabIndex={-1}` (roving tabindex)
- [ ] Left/right arrow keys switch tabs
- [ ] Home/End key support

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

- `aria-selected="true/false"` — different from checkbox's `aria-checked`; use `selected` for tabs
- Automatic activation (switch on focus) vs. manual activation (switch on Enter/Space) — choose based on UX needs
- Recommended library: `@radix-ui/react-tabs`
