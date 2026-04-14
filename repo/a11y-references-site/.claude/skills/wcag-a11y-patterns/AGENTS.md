# WCAG A11y Patterns — Compiled Reference

WCAG 2.1 AA 기준 접근성 패턴 전체 참조 문서.
React/Next.js 컴포넌트 구현 시 이 문서를 참조하여 접근성 요구사항을 충족하세요.

---

## CRITICAL — 반드시 지켜야 할 규칙

### ARIA

**[aria-label] 인터랙티브 요소에 접근 가능한 이름 제공** (WCAG 4.1.2)

- 아이콘만 있는 버튼 → `aria-label="닫기"`
- 아이콘 SVG → `aria-hidden="true"`
- 그룹 이름 → `aria-labelledby`로 visible 텍스트 참조

```tsx
<button
  aria-label='닫기'
  onClick={onClose}>
  <XIcon aria-hidden='true' />
</button>
```

**[aria-live] 동적 콘텐츠 변경 알림** (WCAG 4.1.3)

- 오류/경고 → `aria-live="assertive"` 또는 `role="alert"`
- 상태/성공 → `aria-live="polite"` 또는 `role="status"`
- live region은 페이지 로드 시부터 DOM에 존재해야 함

```tsx
<div role="alert" aria-live="assertive" aria-atomic="true">{error}</div>
<div aria-live="polite" aria-atomic="true">{isLoading ? '분석 중...' : '완료'}</div>
```

**[aria-expanded] 열림/닫힘 상태 전달** (WCAG 4.1.2)

- 드롭다운, 아코디언, 메뉴의 트리거 버튼에 적용
- `aria-controls`로 제어 대상 연결

```tsx
<button aria-expanded={isOpen} aria-controls="panel-id">제목</button>
<div id="panel-id" hidden={!isOpen}>{children}</div>
```

**[aria-required] 필수 입력 필드 표시** (WCAG 3.3.2)

```tsx
<input required aria-required="true" />
<span aria-hidden="true"> *</span>  {/* 시각적 표시 */}
```

**[aria-invalid] 유효성 오류 상태 전달** (WCAG 3.3.1)

```tsx
<input aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} />
<p id={`${id}-error`} role="alert">{error}</p>
```

**[aria-describedby] 추가 설명 연결** (WCAG 1.3.1)

- 힌트, 오류, 도움말을 입력 필드에 연결
- 여러 ID는 스페이스로 구분: `aria-describedby="hint error"`

---

### Keyboard

**[keyboard-focus-trap] 모달 포커스 가두기** (WCAG 2.1.2)

- 모달 열리면 첫 번째 포커스 가능 요소로 이동
- Tab/Shift+Tab이 모달 안에서 순환
- 닫히면 트리거 버튼으로 복귀

**[keyboard-focus-visible] 포커스 표시 항상 노출** (WCAG 2.4.7)

```css
/* ❌ 금지 */
:focus {
  outline: none;
}

/* ✅ 커스텀 스타일로 대체 */
:focus-visible {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}
```

**[keyboard-escape] Escape로 오버레이 닫기** (WCAG 2.1.1)

- 모달, 드롭다운, 툴팁 모두 Escape 지원
- 중첩 오버레이: `stopPropagation`으로 가장 위 것만 닫기

**[keyboard-roving-tabindex] 복합 위젯 키보드 네비게이션** (WCAG 2.1.1)

- 활성 항목: `tabIndex={0}`, 나머지: `tabIndex={-1}`
- 내부 이동: 화살표 키 (좌우 또는 상하)
- 적용: Tab, Radio Group, Menu, Toolbar, Listbox

**[keyboard-tab-order] 논리적 탭 순서** (WCAG 2.4.3)

- DOM 순서 = 탭 순서 유지
- `tabIndex` 양수값 절대 금지

---

## HIGH — 중요 규칙

### Form

**[form-label] 모든 입력 필드에 레이블 연결** (WCAG 1.3.1)

```tsx
<label htmlFor="email">이메일</label>
<input id="email" type="email" />
// placeholder는 레이블 대체 불가
```

**[form-error] 오류 메시지 접근 가능하게 전달** (WCAG 3.3.1, 3.3.3)

- 색상 + 아이콘 + 텍스트로 표시
- `aria-invalid` + `aria-describedby` 연결
- 제출 실패 시 첫 번째 오류 필드로 포커스 이동

**[form-fieldset] 관련 필드 그룹화** (WCAG 1.3.1)

```tsx
<fieldset>
  <legend>알림 수신 방법</legend>
  {/* 라디오/체크박스 그룹 */}
</fieldset>
```

---

### Screen Reader

**[sr-only] 시각적으로 숨긴 텍스트** (WCAG 1.1.1)

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
  border: 0;
}
```

- `display:none` / `visibility:hidden` — 스크린리더도 못 읽음 → 사용 금지

**[sr-heading] 헤딩 계층 구조** (WCAG 1.3.1, 2.4.6)

- h1 ~ h6 계층 유지, 레벨 건너뜀 금지
- 페이지당 h1 하나
- 스타일은 CSS로, 구조는 시맨틱 레벨로

**[sr-link-text] 의미 있는 링크 텍스트** (WCAG 2.4.4)

- "여기", "더 보기", "클릭" 단독 사용 금지
- `aria-label` 또는 `sr-only`로 컨텍스트 추가

**[sr-image-alt] 이미지 대체 텍스트** (WCAG 1.1.1)

- 의미 있는 이미지: 내용 설명하는 `alt`
- 장식용 이미지: `alt=""` 빈 값 명시
- `alt` 속성 자체 없으면 파일명 읽힘 → 항상 명시

---

### Interactive Patterns

**[interactive-button-link] button vs link** (WCAG 4.1.2)

- 액션 → `<button>`
- 이동 → `<a href>`
- `<div onClick>`, `<span onClick>` 절대 금지

**[interactive-dialog] 다이얼로그 패턴**

```tsx
<div
  role='dialog'
  aria-modal='true'
  aria-labelledby={titleId}>
  <h2 id={titleId}>{title}</h2>
  {/* 포커스 트랩 + Escape 닫기 필수 */}
</div>
```

**[interactive-disclosure] 열고 닫는 콘텐츠**

```tsx
<button aria-expanded={isOpen} aria-controls={panelId}>제목</button>
<div id={panelId} hidden={!isOpen}>{children}</div>
```

**[interactive-tabs] 탭 컴포넌트**

```tsx
<div role="tablist">
  <button role="tab" aria-selected={active} aria-controls={panelId} tabIndex={active ? 0 : -1}>
    탭 이름
  </button>
</div>
<div role="tabpanel" id={panelId} aria-labelledby={tabId}>패널 내용</div>
```

**[interactive-tooltip] 툴팁**

- 호버 + 포커스 모두 노출
- `role="tooltip"` + `aria-describedby` 연결
- Escape로 닫기, 툴팁 위로 마우스 이동 시 유지

---

## MEDIUM — 권장 규칙

### Visual

**[visual-color-contrast] 색상 대비율** (WCAG 1.4.3 AA)

- 일반 텍스트: 4.5:1 이상
- 큰 텍스트 (18pt+): 3:1 이상
- UI 컴포넌트 경계선: 3:1 이상
- `#767676` on white = AA 통과 최소 회색

**[visual-not-color-only] 색상만으로 정보 전달 금지** (WCAG 1.4.1)

- 오류: 빨간 테두리 + ⚠ 아이콘 + 오류 텍스트
- 필수: 빨간 \* + 레이블 텍스트 + `aria-required`
- 링크: 색상 + 밑줄

**[visual-motion] 애니메이션 접근성** (WCAG 2.3.3)

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Quick Reference — 컴포넌트별 체크리스트

| 컴포넌트          | 필수 확인                                                       |
| ----------------- | --------------------------------------------------------------- |
| 아이콘 버튼       | `aria-label`, 아이콘 `aria-hidden`                              |
| 입력 필드         | `<label>` 연결, 오류 시 `aria-invalid` + `aria-describedby`     |
| 모달              | `role="dialog"`, `aria-modal`, 포커스 트랩, Escape, 복귀        |
| 드롭다운/아코디언 | `aria-expanded`, `aria-controls`, 패널 `id`                     |
| 탭                | `role="tablist/tab/tabpanel"`, `aria-selected`, roving tabindex |
| 툴팁              | `role="tooltip"`, `aria-describedby`, 호버+포커스 노출          |
| 이미지            | `alt` 항상 명시, 장식용 `alt=""`                                |
| 폼                | 레이블 연결, 필수 `aria-required`, 오류 `aria-live`             |
| 애니메이션        | `prefers-reduced-motion` 지원                                   |
