# keyboard-focus-visible — 포커스 표시 항상 노출

**Priority:** CRITICAL | **WCAG:** 2.4.7 Focus Visible (Level AA)

## Rule

키보드 포커스 시 시각적 인디케이터를 절대 제거하지 않는다. `outline: none` / `outline: 0` 단독 사용 금지.

## Examples

```css
/* ❌ 포커스 완전 제거 */
:focus {
  outline: none;
}
*:focus {
  outline: 0;
}

/* ✅ 커스텀 포커스 스타일로 대체 */
:focus-visible {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
  border-radius: 2px;
}

/* ✅ 마우스 클릭 시에는 숨기고, 키보드만 표시 */
:focus:not(:focus-visible) {
  outline: none;
}
:focus-visible {
  outline: 2px solid #0066cc;
}
```

```tsx
// ✅ Tailwind
<button className='focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2'>클릭</button>
```

## Notes

- `:focus-visible` — 키보드 포커스에만 적용, 마우스 클릭에는 미적용 (모던 브라우저 지원)
- 대비율 기준: 포커스 인디케이터도 배경 대비 3:1 이상 권장 (WCAG 2.2)
- `outline-offset`으로 요소와 간격 확보 — 가독성 향상
