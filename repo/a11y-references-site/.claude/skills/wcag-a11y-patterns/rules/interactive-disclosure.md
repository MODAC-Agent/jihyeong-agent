# interactive-disclosure — Expandable content pattern

**Priority:** HIGH | **WCAG:** 4.1.2 Name, Role, Value (Level A)

## Rule

Accordions, FAQs, and other toggle-content patterns should be implemented using the disclosure pattern.

## Checklist

- [ ] Trigger is a `<button>`
- [ ] `aria-expanded` reflects current state
- [ ] `aria-controls` references panel ID
- [ ] Panel has an `id`
- [ ] Use `hidden` attribute or `display:none` to hide content

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

| Key           | Action                         |
| ------------- | ------------------------------ |
| Enter / Space | Toggle                         |
| Tab           | Move to next focusable element |

## Notes

- Native `<details>` / `<summary>` also works (built-in accessibility, limited styling)
- Rotating icon for open/close state: add `aria-hidden="true"` to the icon
- Nested accordions: each level needs its own button + panel
