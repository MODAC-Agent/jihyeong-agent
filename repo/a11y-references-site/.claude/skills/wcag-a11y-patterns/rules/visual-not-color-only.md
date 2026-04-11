# visual-not-color-only — Never use color as the only visual cue

**Priority:** MEDIUM | **WCAG:** 1.4.1 Use of Color (Level A)

## Rule

Color must not be the sole means of conveying information. Always pair color with icons, text, or patterns as additional visual cues.

## Examples

```tsx
// ❌ Error indicated by color alone
<input style={{ borderColor: error ? 'red' : 'gray' }} />

// ✅ Color + icon + text
<input
  style={{ borderColor: error ? '#d32f2f' : '#767676' }}
  aria-invalid={!!error}
/>
{error && (
  <p style={{ color: '#d32f2f' }}>
    <span aria-hidden="true">⚠ </span>
    {error}
  </p>
)}

// ❌ Required field indicated by color alone
<label style={{ color: 'red' }}>Email</label>

// ✅ Color + text symbol
<label>
  Email
  <span aria-hidden="true" style={{ color: 'red' }}> *</span>
</label>

// ❌ Link distinguished by color only
<p>
  See <span style={{ color: 'blue' }}>here</span> for details.
</p>

// ✅ Also distinguished by underline
<p>
  See <a href="/details">here</a> for details.
</p>
```

## Notes

- Applies to: error states, required fields, status indicators, links, charts/graphs
- Approximately 8% of males have color blindness (red-green most common)
- Charts: distinguish data series with color + pattern, or use direct labels
