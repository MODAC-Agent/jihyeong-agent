# sr-link-text — Use meaningful link text

**Priority:** HIGH | **WCAG:** 2.4.4 Link Purpose (Level A)

## Rule

Link text alone must convey the destination or action. Avoid "click here", "read more", "here" as link text.

## Examples

```tsx
// ❌ Meaningless without context
<a href="/report">Click here</a>
<a href="/details">Read more</a>

// ✅ Purpose clear from text alone
<a href="/report">Download accessibility analysis report</a>

// ✅ Keep it short visually, add context for screen readers
<a href="/details">
  Read more
  <span className="sr-only"> — Dropdown accessibility pattern</span>
</a>

// ✅ Provide full text via aria-label
<a href="/details" aria-label="Dropdown accessibility pattern — read more">
  Read more
</a>

// ✅ Card as link — use aria-label or aria-labelledby
<article>
  <h3 id="card-title">Dropdown Pattern</h3>
  <p>ARIA disclosure pattern guide</p>
  <a href="/dropdown" aria-labelledby="card-title">Read more</a>
</article>
```

## Notes

- Multiple "Read more" links on the same page each need distinct text or `aria-label`
- Links opening in a new tab: include "(opens in new tab)" in text or `aria-label`
- Add `aria-hidden="true"` to external link icons
