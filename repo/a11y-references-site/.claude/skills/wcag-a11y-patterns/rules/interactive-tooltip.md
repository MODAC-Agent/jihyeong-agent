# interactive-tooltip — Tooltip pattern

**Priority:** HIGH | **WCAG:** 1.4.13 Content on Hover or Focus (Level AA)

## Rule

Tooltips must appear on both hover and keyboard focus, and must be dismissible with Escape.

## Checklist

- [ ] Show on hover + focus
- [ ] `role="tooltip"` + `id`
- [ ] Trigger has `aria-describedby` pointing to tooltip
- [ ] Dismissible with Escape
- [ ] Tooltip stays visible when mouse moves over it
- [ ] Content is selectable/copyable

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

- Tooltips are supplemental — required information must always be visible on screen
- If interactive content (links, buttons) is needed inside, use `role="dialog"` popover instead
- Mobile: no hover events, so ensure focus/tab access works
- Recommended library: `@radix-ui/react-tooltip`
