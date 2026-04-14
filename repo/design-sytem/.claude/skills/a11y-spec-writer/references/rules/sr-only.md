# sr-only — 시각적으로 숨긴 텍스트 올바른 사용

**Priority:** HIGH | **WCAG:** 1.1.1, 2.4.6

## Rule

스크린리더에만 전달하는 텍스트는 `sr-only` 클래스로 숨긴다. `display:none` / `visibility:hidden` 사용 금지 (스크린리더도 읽지 못함).

## sr-only CSS

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

## Examples

```tsx
// ✅ 아이콘 버튼의 숨긴 레이블
<button onClick={onDelete}>
  <TrashIcon aria-hidden="true" />
  <span className="sr-only">항목 삭제</span>
</button>

// ✅ 테이블 컨텍스트 추가
<td>
  <button>편집</button>
  <span className="sr-only">홍길동 편집</span>
</td>

// ✅ 스킵 네비게이션 (포커스 시 노출)
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
>
  본문으로 바로가기
</a>
```

## Notes

- `display:none` — 스크린리더도 읽지 못함 (완전 숨김)
- `visibility:hidden` — 스크린리더도 읽지 못함
- `sr-only` — 시각적으로만 숨김, 스크린리더는 읽음
- Tailwind: `className="sr-only"` 기본 제공
