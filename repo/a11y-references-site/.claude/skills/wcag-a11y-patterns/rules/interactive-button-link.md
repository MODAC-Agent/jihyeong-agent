# interactive-button-link — Choosing between button and link

**Priority:** HIGH | **WCAG:** 4.1.2 Name, Role, Value (Level A)

## Rule

- **`<button>`** — triggers actions (submit, open, toggle, delete)
- **`<a href>`** — navigates to a page/URL

Don't use wrong element for the role. Never use `<div onClick>` or `<span onClick>`.

> **Why not use div/span as buttons?**
> `<button>` gives you keyboard access (Tab), Enter/Space click, and screen reader role announcement ("button") for free. `<div>`/`<span>` with onClick only works for mouse — keyboard users can't reach it, and screen readers just read it as text. Adding `role="button"`, `tabIndex`, and keyboard events is just reinventing `<button>`.

## Examples

```tsx
// ❌ div/span pretending to be a button
// Works with mouse but Tab key can't reach it; screen reader announces "Delete" as text, not a button
<div onClick={handleDelete} className="btn">Delete</div>
<span onClick={openModal}>Open</span>

// ❌ <a> without href pretending to be a button
// No href = not reachable by Tab, Enter key doesn't work
<a onClick={handleSubmit}>Submit</a>

// ✅ Action → button
<button type="button" onClick={handleDelete}>Delete</button>
<button type="button" onClick={openModal}>Open modal</button>

// ✅ Navigation → a
<a href="/patterns">Go to patterns list</a>
<Link href="/patterns">Go to patterns list</Link>

// ✅ When forced to use another element (not recommended)
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? handleClick() : null}
>
  Click
</div>
```

## Notes

- `<button>` is keyboard-accessible and clickable with Enter/Space by default
- `<a>` without href is not reachable by Tab
- Custom components must use the correct semantic element internally
