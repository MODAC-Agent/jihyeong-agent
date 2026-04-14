# visual-color-contrast — Color contrast requirements

**Priority:** MEDIUM | **WCAG:** 1.4.3 Contrast (Minimum) (Level AA)

## Rule

Text and background must meet minimum contrast ratio requirements.

> **Why does contrast ratio matter?**
> Users with low vision, age-related vision decline, or those viewing screens in bright sunlight find low-contrast text very difficult to read. Designs that look "sleek" — like light gray text on a gray background — often make the UI inaccessible to many people.

## Contrast Ratios

| Text                             | Minimum (AA) | Enhanced (AAA) |
| -------------------------------- | ------------ | -------------- |
| Normal text (< 18pt / 14pt bold) | **4.5:1**    | 7:1            |
| Large text (≥ 18pt / 14pt bold)  | **3:1**      | 4.5:1          |
| UI components, icon borders      | **3:1**      | —              |
| Disabled elements                | Exempt       | —              |
| Decorative elements              | Exempt       | —              |

## Examples

```tsx
// ❌ Low contrast (overuse of gray text)
<p style={{ color: '#999', background: '#fff' }}>Contrast ratio 2.85:1</p>

// ✅ Meets AA standard
<p style={{ color: '#767676', background: '#fff' }}>Contrast ratio 4.54:1</p>

// ✅ Error message — color + text together
<p style={{ color: '#d32f2f' }}>
  <span aria-hidden="true">⚠ </span>
  Invalid email format
</p>
```

## Tools

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/)
- Chrome DevTools > CSS Overview > Colors
- Figma plugin: Contrast

## Notes

- `#767676` on white — the minimum gray value that exactly passes AA
- Focus indicators also require contrast ratio (WCAG 2.2 requires 3:1)
- Text over gradient backgrounds — measure at the lowest contrast point
