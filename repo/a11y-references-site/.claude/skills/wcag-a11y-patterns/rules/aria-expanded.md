# aria-expanded — Communicate open/closed state

**Priority:** CRITICAL | **WCAG:** 4.1.2 Name, Role, Value (Level A)

## Rule

When a button toggles content (dropdown, accordion, menu, etc.), use `aria-expanded` to communicate the current state.

## Examples

```tsx
// ✅ Accordion
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

// ✅ Dropdown menu
;<button
  aria-expanded={isOpen}
  aria-haspopup='listbox'
  onClick={toggle}>
  Select option
</button>
```

## Notes

- Reference controlled element ID with `aria-controls` — optional but recommended
- `aria-haspopup` values: `menu`, `listbox`, `tree`, `grid`, `dialog`, `true`
- Use `display:none` or `hidden` attribute to hide content. `visibility:hidden` hides it visually but leaves it in the DOM, so screen readers will still read items inside a closed menu.
