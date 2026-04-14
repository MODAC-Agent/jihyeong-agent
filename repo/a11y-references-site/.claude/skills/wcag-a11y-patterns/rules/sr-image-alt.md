# sr-image-alt — Provide image alternative text

**Priority:** HIGH | **WCAG:** 1.1.1 Non-text Content (Level A)

## Rule

All `<img>` elements must have an `alt` attribute. Decorative images must have an explicit empty `alt=""`.

## Examples

```tsx
// ✅ Meaningful image — describe the content
<img src="/chart.png" alt="Bar chart showing monthly accessibility violations in 2024" />

// ✅ Decorative image — empty alt (screen reader skips)
<img src="/decorative-wave.svg" alt="" />

// ✅ Icon image serving as button text — descriptive alt
<button>
  <img src="/search-icon.svg" alt="Search" />
</button>

// ✅ Image inside a link — describe the destination
<a href="/home">
  <img src="/logo.svg" alt="A11y Pattern Agent — go to home" />
</a>

// ✅ Next.js Image
<Image src="/hero.jpg" alt="Screenshot of accessibility checklist screen" width={800} height={400} />

// ❌ Missing alt attribute
<img src="/important-chart.png" />

// ❌ Filename or meaningless alt
<img src="/img123.png" alt="image" />
```

## Notes

- Without `alt`, screen readers announce the filename ("img123.png")
- `alt=""` and missing `alt` are different — always specify explicitly
- Complex charts/graphs: use `alt` + in-page text or `aria-describedby` for detailed explanation
- CSS `background-image` has no `alt` — use only for decorative images
