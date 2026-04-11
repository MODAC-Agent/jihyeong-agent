# form-label — Link labels to all input fields

**Priority:** HIGH | **WCAG:** 1.3.1 Info and Relationships (Level A)

## Rule

All form controls (input, select, textarea) must be programmatically associated with a label.

## Examples

```tsx
// ✅ htmlFor + id (preferred)
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// ✅ Wrapping (implicit association)
<label>
  Email
  <input type="email" />
</label>

// ❌ placeholder only
// Placeholder disappears on input — users must clear the field to check what it asks for.
// Screen readers often don't recognize placeholder as a label either.
<input type="email" placeholder="Enter email" />

// ❌ Visually associated only
// Looks connected visually, but there's no HTML association —
// screen readers won't announce "Email" when the input receives focus.
<p>Email</p>
<input type="email" />

// ✅ No visible label — use aria-label
<input
  type="search"
  aria-label="Search"
  placeholder="Search..."
/>
```

## Notes

- `placeholder` is for hints only — cannot substitute a label
- Use `aria-label` only when there is no visible label (e.g., search field)
- Custom components must maintain an internal `<label>` association
