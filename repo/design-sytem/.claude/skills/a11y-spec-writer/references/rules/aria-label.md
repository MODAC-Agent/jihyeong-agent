# aria-label — 인터랙티브 요소에 접근 가능한 이름 제공

**Priority:** CRITICAL | **WCAG:** 4.1.2 Name, Role, Value (Level A)

## Rule

모든 인터랙티브 요소(button, input, select, a 등)에는 반드시 접근 가능한 이름이 있어야 한다.

## How to apply

1. 보이는 텍스트가 있으면 그것이 이름이 됨 — 추가 속성 불필요
2. 아이콘만 있는 버튼 → `aria-label` 사용
3. 입력 필드 → `<label>` 연결 우선, 불가하면 `aria-label`
4. 그룹의 이름 → `aria-labelledby`로 visible 텍스트 참조

## Examples

```tsx
// ❌ 아이콘 버튼에 이름 없음
<button onClick={onClose}>
  <XIcon />
</button>

// ✅ aria-label 제공
<button aria-label="닫기" onClick={onClose}>
  <XIcon aria-hidden="true" />
</button>

// ✅ aria-labelledby로 visible 텍스트 참조
<section aria-labelledby="section-title">
  <h2 id="section-title">검색 결과</h2>
</section>
```

## Notes

- 아이콘 SVG에는 `aria-hidden="true"` 추가해서 중복 읽기 방지
- `aria-label`과 `aria-labelledby`가 동시에 있으면 `aria-labelledby` 우선
- placeholder는 레이블 대체 불가 — 입력 후 사라지기 때문
