# sr-heading — Maintain heading hierarchy

**Priority:** HIGH | **WCAG:** 1.3.1 Info and Relationships (Level A), 2.4.6 Headings and Labels (Level AA)

## Rule

Use headings (h1–h6) in a hierarchy that reflects page structure. Don't skip levels or misuse headings for styling purposes.

## Examples

```tsx
// ❌ Skip level for styling reasons
<h1>Page Title</h1>
<h3>Section Title</h3>  {/* h2 skipped */}

// ✅ Maintain hierarchy
<h1>A11y Pattern Agent</h1>
  <h2>Analysis Results</h2>
    <h3>Checklist</h3>
    <h3>Code Sample</h3>
  <h2>Test Guide</h2>

// ✅ Style via CSS, use correct heading level for semantics
<h2 className="text-sm font-normal text-gray-500">Section Title</h2>

// ✅ Section name without visible heading — use aria-label
<section aria-label="Search Results">
  {/* no h2 needed, section still has a name */}
</section>
```

## Notes

- One `<h1>` per page recommended
- Levels increase by one at a time (h2 → h3, h3 → h4). Skipping levels breaks the perceived hierarchy for screen reader users.
- Screen reader users often scan the heading list first to jump directly to a section — headings are the page's table of contents for keyboard users.
- Separate style from structure: to make an `<h3>` look like an `<h2>`, adjust font size via CSS — don't change the heading level.
