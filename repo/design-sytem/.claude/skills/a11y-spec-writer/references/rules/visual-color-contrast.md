# visual-color-contrast — 색상 대비율 기준

**Priority:** MEDIUM | **WCAG:** 1.4.3 Contrast (Minimum) (Level AA)

## Rule

텍스트와 배경 간 대비율 기준을 충족해야 한다.

## Contrast Ratios

| 텍스트                           | 최소 (AA) | 강화 (AAA) |
| -------------------------------- | --------- | ---------- |
| 일반 텍스트 (< 18pt / 14pt bold) | **4.5:1** | 7:1        |
| 큰 텍스트 (≥ 18pt / 14pt bold)   | **3:1**   | 4.5:1      |
| UI 컴포넌트, 아이콘 경계선       | **3:1**   | —          |
| 비활성(disabled) 요소            | 제외      | —          |
| 장식용 요소                      | 제외      | —          |

## Examples

```tsx
// ❌ 낮은 대비 (회색 텍스트 남용)
<p style={{ color: '#999', background: '#fff' }}>대비율 2.85:1</p>

// ✅ AA 기준 충족
<p style={{ color: '#767676', background: '#fff' }}>대비율 4.54:1</p>

// ✅ 오류 메시지 — 색상 + 텍스트 함께
<p style={{ color: '#d32f2f' }}>
  <span aria-hidden="true">⚠ </span>
  이메일 형식이 올바르지 않습니다
</p>
```

## Tools

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/)
- Chrome DevTools > CSS Overview > Colors
- Figma 플러그인: Contrast

## Notes

- `#767676` on white — 정확히 AA 통과하는 최소 회색값
- 포커스 인디케이터도 대비율 적용 (WCAG 2.2 기준 3:1)
- 그라디언트 배경 위 텍스트 — 가장 낮은 대비 지점 기준으로 측정
