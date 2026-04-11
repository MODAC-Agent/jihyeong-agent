# interactive-button-link — button vs link 올바른 선택

**Priority:** HIGH | **WCAG:** 4.1.2 Name, Role, Value (Level A)

## Rule

- **`<button>`** — 액션 실행 (제출, 열기, 토글, 삭제)
- **`<a href>`** — 페이지/URL 이동

역할에 맞지 않는 요소 사용 금지. `<div onClick>`, `<span onClick>` 사용 금지.

## Examples

```tsx
// ❌ div/span으로 버튼 흉내
<div onClick={handleDelete} className="btn">삭제</div>
<span onClick={openModal}>열기</span>

// ❌ href 없는 a 태그로 버튼 흉내
<a onClick={handleSubmit}>제출</a>

// ✅ 액션 → button
<button type="button" onClick={handleDelete}>삭제</button>
<button type="button" onClick={openModal}>모달 열기</button>

// ✅ 이동 → a
<a href="/patterns">패턴 목록으로</a>
<Link href="/patterns">패턴 목록으로</Link>

// ✅ 불가피하게 다른 요소 써야 할 때 (권장하지 않음)
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? handleClick() : null}
>
  클릭
</div>
```

## Notes

- `<button>`은 기본으로 키보드 접근 가능, Enter/Space로 클릭 가능
- `<a>`는 href 없으면 탭으로 접근 불가
- 커스텀 컴포넌트도 내부적으로 올바른 시맨틱 요소 사용
