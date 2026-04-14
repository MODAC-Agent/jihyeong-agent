# keyboard-roving-tabindex — Roving tabindex for composite widgets

**Priority:** CRITICAL | **WCAG:** 2.1.1 Keyboard (Level A)

## Rule

Composite widgets like tabs, radio groups, menus, and toolbars should be entered with a single Tab press, with arrow keys handling internal navigation. (roving tabindex pattern)

> **Why do this?**
> If all 5 tabs have `tabIndex={0}`, a keyboard user must press Tab 5 times to move past the component. With multiple such widgets, the tab stops multiply and navigation becomes tedious. Roving tabindex makes the entire group occupy only one tab stop, with arrow keys handling movement inside — creating an efficient keyboard UX.

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

- Only the active item has `tabIndex={0}`, others get `tabIndex={-1}` — one tab stop per group
- Items with `tabIndex={-1}` can't be reached with Tab, but can receive focus via `focus()` directly — used in arrow key handlers
- Arrow direction: left/right (tabs/menus) or up/down (trees/listboxes)
- Home/End key support recommended
- Applies to: Tab, Radio Group, Menu, Toolbar, Listbox, Tree
