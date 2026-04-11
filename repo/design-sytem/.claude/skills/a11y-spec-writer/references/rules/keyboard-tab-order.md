# keyboard-tab-order — 논리적 탭 순서 유지

**Priority:** CRITICAL | **WCAG:** 2.4.3 Focus Order (Level A)

## Rule

탭 순서는 시각적 레이아웃과 콘텐츠 논리 순서를 따른다. `tabIndex` 양수값 사용 금지.

## Examples

```tsx
// ❌ tabIndex 양수 — 탭 순서 예측 불가
<button tabIndex={3}>세 번째</button>
<button tabIndex={1}>첫 번째</button>
<button tabIndex={2}>두 번째</button>

// ✅ DOM 순서 = 탭 순서
<button>첫 번째</button>
<button>두 번째</button>
<button>세 번째</button>

// ✅ 모달 열릴 때 포커스 명시적 이동 (DOM 순서 우선)
useEffect(() => {
  if (isOpen) firstFocusableRef.current?.focus()
}, [isOpen])

// ❌ CSS로 시각 순서 바꾸면 탭 순서와 불일치
<div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
  <button>시각적으로 오른쪽</button> {/* 탭은 먼저 */}
  <button>시각적으로 왼쪽</button>
</div>
```

## Notes

- `tabIndex={0}` — 기본 탭 순서에 포함 (tabIndex 없는 것과 동일)
- `tabIndex={-1}` — 탭 순서 제외, JS로만 포커스 가능
- `tabIndex` 양수 — 전역 탭 순서 변경, 유지보수 악몽 → 절대 사용 금지
- CSS `order`, `flex-direction: row-reverse` 사용 시 DOM 순서와 시각 순서 일치 여부 검토
