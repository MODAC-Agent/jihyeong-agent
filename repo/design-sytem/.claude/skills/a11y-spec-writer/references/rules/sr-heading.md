# sr-heading — 헤딩 계층 구조 유지

**Priority:** HIGH | **WCAG:** 1.3.1 Info and Relationships (Level A), 2.4.6 Headings and Labels (Level AA)

## Rule

헤딩(h1~h6)은 페이지 구조를 반영하는 계층으로 사용한다. 스타일 목적으로 헤딩 레벨을 건너뛰거나 남용하지 않는다.

## Examples

```tsx
// ❌ 스타일 때문에 레벨 건너뜀
<h1>페이지 제목</h1>
<h3>섹션 제목</h3>  {/* h2 건너뜀 */}

// ✅ 계층 유지
<h1>A11y Pattern Agent</h1>
  <h2>분석 결과</h2>
    <h3>체크리스트</h3>
    <h3>코드 샘플</h3>
  <h2>테스트 가이드</h2>

// ✅ 스타일은 CSS로, 의미는 올바른 레벨로
<h2 className="text-sm font-normal text-gray-500">섹션 제목</h2>

// ✅ 시각적 헤딩이 필요 없으면 aria-label로 섹션에 이름 부여
<section aria-label="검색 결과">
  {/* h2 없어도 섹션 이름 있음 */}
</section>
```

## Notes

- 페이지당 `<h1>` 하나 권장
- 레벨은 1씩만 증가 (h2 → h3, h3 → h4)
- 헤딩은 스크린리더 사용자의 주요 네비게이션 수단
- 스타일 변경은 CSS, 구조 의미는 헤딩 레벨로 분리
