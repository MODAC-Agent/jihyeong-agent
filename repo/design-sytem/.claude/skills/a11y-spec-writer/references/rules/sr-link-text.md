# sr-link-text — 의미 있는 링크 텍스트

**Priority:** HIGH | **WCAG:** 2.4.4 Link Purpose (Level A)

## Rule

링크 텍스트만으로 목적지나 동작을 알 수 있어야 한다. "여기", "더 보기", "클릭" 같은 텍스트 금지.

## Examples

```tsx
// ❌ 컨텍스트 없이 이해 불가
<a href="/report">여기를 클릭</a>
<a href="/details">더 보기</a>

// ✅ 텍스트만으로 목적 명확
<a href="/report">접근성 분석 보고서 다운로드</a>

// ✅ 시각적으로 짧게 유지하면서 스크린리더에 추가 정보
<a href="/details">
  더 보기
  <span className="sr-only"> — 드롭다운 접근성 패턴</span>
</a>

// ✅ aria-label로 전체 텍스트 제공
<a href="/details" aria-label="드롭다운 접근성 패턴 자세히 보기">
  더 보기
</a>

// ✅ 카드 전체를 링크로 — aria-label 또는 aria-labelledby
<article>
  <h3 id="card-title">드롭다운 패턴</h3>
  <p>ARIA disclosure 패턴 가이드</p>
  <a href="/dropdown" aria-labelledby="card-title">자세히 보기</a>
</article>
```

## Notes

- 동일 페이지에 "더 보기" 링크가 여러 개면 각각 다른 텍스트 또는 `aria-label` 필수
- 새 탭으로 열리는 링크는 텍스트나 `aria-label`에 "(새 탭에서 열림)" 안내
- 외부 링크 아이콘은 `aria-hidden="true"` 추가
