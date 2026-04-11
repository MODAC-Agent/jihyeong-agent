# form-label — 모든 입력 필드에 레이블 연결

**Priority:** HIGH | **WCAG:** 1.3.1 Info and Relationships (Level A)

## Rule

모든 폼 컨트롤(input, select, textarea)은 레이블과 프로그래매틱하게 연결되어야 한다.

## Examples

```tsx
// ✅ htmlFor + id 연결 (권장)
<label htmlFor="email">이메일</label>
<input id="email" type="email" />

// ✅ 래핑 (암시적 연결)
<label>
  이메일
  <input type="email" />
</label>

// ❌ placeholder만 사용 — 입력 후 레이블 사라짐
<input type="email" placeholder="이메일 입력" />

// ❌ 시각적으로만 연결 — 스크린리더는 연결 모름
<p>이메일</p>
<input type="email" />

// ✅ 시각적 레이블 없을 때 — aria-label 사용
<input
  type="search"
  aria-label="검색"
  placeholder="검색어 입력..."
/>
```

## Notes

- `placeholder`는 힌트 용도, 레이블 대체 불가
- 검색 필드처럼 시각적 레이블이 없는 경우만 `aria-label` 사용
- 커스텀 컴포넌트도 내부적으로 `<label>` 연결 유지
