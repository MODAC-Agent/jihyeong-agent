# sr-image-alt — 이미지 대체 텍스트

**Priority:** HIGH | **WCAG:** 1.1.1 Non-text Content (Level A)

## Rule

모든 `<img>`에는 `alt` 속성이 있어야 한다. 장식용 이미지는 `alt=""`로 빈 값을 명시한다.

## Examples

```tsx
// ✅ 의미 있는 이미지 — 내용 설명
<img src="/chart.png" alt="2024년 월별 접근성 위반 건수 막대 그래프" />

// ✅ 장식용 이미지 — 빈 alt (스크린리더 스킵)
<img src="/decorative-wave.svg" alt="" />

// ✅ 아이콘 이미지가 버튼 텍스트 역할 — 설명적 alt
<button>
  <img src="/search-icon.svg" alt="검색" />
</button>

// ✅ 링크 안 이미지 — 링크 목적지 설명
<a href="/home">
  <img src="/logo.svg" alt="A11y Pattern Agent 홈으로" />
</a>

// ✅ Next.js Image
<Image src="/hero.jpg" alt="접근성 체크리스트 화면 스크린샷" width={800} height={400} />

// ❌ alt 속성 없음
<img src="/important-chart.png" />

// ❌ 파일명이나 의미 없는 alt
<img src="/img123.png" alt="이미지" />
```

## Notes

- `alt` 미제공 시 스크린리더가 파일명을 읽음 ("img123.png")
- `alt=""`와 `alt` 속성 자체 없음은 다름 — 항상 명시
- 복잡한 차트/그래프는 `alt` + 페이지 내 텍스트 설명 또는 `aria-describedby`로 상세 설명 연결
- CSS background-image는 `alt` 불가 → 장식용에만 사용
