# WAI-ARIA 패턴별 WCAG 체크리스트

컴포넌트 유형별로 테스트해야 할 WCAG 기준과 구체적인 검증 방법을 정의한다.

---

## Button

**관련 WCAG 기준**

- 1.3.1 Info and Relationships — 버튼 역할이 의미론적으로 전달되어야 함
- 2.1.1 Keyboard — 키보드로 모든 기능 접근 가능
- 2.4.3 Focus Order — 논리적 포커스 순서
- 4.1.2 Name, Role, Value — 접근 가능한 이름과 상태 제공

**테스트 항목**

| 항목                      | 검증 방법                                                       |
| ------------------------- | --------------------------------------------------------------- |
| Tab으로 포커스 이동       | `userEvent.tab()` → `toHaveFocus()`                             |
| Enter로 활성화            | `userEvent.keyboard('{Enter}')` → onClick 카운트 확인           |
| Space로 활성화            | `userEvent.keyboard('{ }')` → onClick 카운트 확인               |
| disabled 시 Tab 순서 제외 | 이전 버튼 → Tab → disabled 건너뜀 → 다음 버튼으로 포커스        |
| 접근 가능한 이름          | `getByRole('button', { name: '...' })` 으로 조회 가능           |
| 아이콘 전용 버튼          | `aria-label` 제공 + `getByRole('button', { name: aria-label })` |

---

## Dialog / Modal

**관련 WCAG 기준**

- 2.1.2 No Keyboard Trap — 포커스 트랩은 의도적일 때만 (Dialog는 허용)
- 2.4.3 Focus Order — 열릴 때 Dialog 내부로 포커스 이동
- 3.2.2 On Input — 예측 가능한 동작

**테스트 항목**

| 항목                         | 검증 방법                                                              |
| ---------------------------- | ---------------------------------------------------------------------- |
| 트리거 클릭 시 열림          | `userEvent.click(trigger)` → `waitFor` → content `toBeInTheDocument()` |
| 열릴 때 포커스 이동          | Dialog 열림 후 내부 첫 포커스 가능 요소에 `toHaveFocus()`              |
| Escape로 닫힘                | `userEvent.keyboard('{Escape}')` → content `not.toBeInTheDocument()`   |
| 닫힐 때 트리거로 포커스 복귀 | 닫힘 후 트리거에 `toHaveFocus()`                                       |
| `aria-modal="true"`          | `toHaveAttribute('aria-modal', 'true')`                                |
| `role="dialog"`              | `getByRole('dialog')` 로 조회 가능                                     |
| `aria-labelledby`            | Dialog title 요소 id와 연결 확인                                       |

---

## Popover

**관련 WCAG 기준**

- 1.4.13 Content on Hover or Focus — 호버/포커스 콘텐츠 제어 가능
- 2.1.1 Keyboard — 키보드로 열고 닫을 수 있어야 함

**테스트 항목**

| 항목                       | 검증 방법                                                                              |
| -------------------------- | -------------------------------------------------------------------------------------- |
| 트리거 클릭/포커스 시 열림 | `userEvent.click(trigger)` → `waitFor` → Portal content 확인 (`within(document.body)`) |
| Escape로 닫힘              | `userEvent.keyboard('{Escape}')` → content 사라짐                                      |
| 외부 클릭으로 닫힘         | 외부 요소 클릭 → content 사라짐                                                        |
| `aria-expanded` 상태       | 열림/닫힘에 따라 `toHaveAttribute('aria-expanded', 'true'/'false')`                    |
| Portal 콘텐츠              | `within(document.body)` 사용 (canvasElement 밖에 렌더링됨)                             |

---

## Listbox / Select

**관련 WCAG 기준**

- 2.1.1 Keyboard — Arrow 키로 옵션 이동
- 1.3.1 Info and Relationships — 선택 상태 전달

**테스트 항목**

| 항목                              | 검증 방법                                                       |
| --------------------------------- | --------------------------------------------------------------- |
| Arrow Down/Up으로 옵션 이동       | `userEvent.keyboard('{ArrowDown}')` → 다음 옵션 `toHaveFocus()` |
| Enter로 옵션 선택                 | `userEvent.keyboard('{Enter}')` → 선택된 값 변경 확인           |
| Home/End 키                       | 첫/마지막 옵션으로 포커스 이동                                  |
| `role="listbox"` 컨테이너         | `getByRole('listbox')` 조회 가능                                |
| `role="option"` + `aria-selected` | 각 옵션에 `toHaveAttribute('aria-selected', 'true'/'false')`    |

---

## Navigation / Sidebar / Menu

**관련 WCAG 기준**

- 2.4.1 Bypass Blocks — 반복 콘텐츠 건너뛰기
- 2.4.6 Headings and Labels — 내비게이션 레이블

**테스트 항목**

| 항목                     | 검증 방법                                                    |
| ------------------------ | ------------------------------------------------------------ |
| Tab으로 아이템 순차 이동 | `userEvent.tab()` 반복 → 각 아이템 `toHaveFocus()`           |
| Enter로 아이템 활성화    | `userEvent.keyboard('{Enter}')` → onClick 확인               |
| Space로 아이템 활성화    | `userEvent.keyboard('{Space}')` → onClick 확인               |
| `aria-current="page"`    | 현재 페이지 아이템 `toHaveAttribute('aria-current', 'page')` |
| `role="navigation"`      | `getByRole('navigation')` 조회 가능                          |

---

## Form / Input (Textfield, Textarea)

**관련 WCAG 기준**

- 1.3.1 Info and Relationships — label과 input 연결
- 1.3.5 Identify Input Purpose — input의 목적 식별
- 3.3.1 Error Identification — 오류 텍스트로 설명
- 3.3.2 Labels or Instructions — 레이블 또는 설명 제공
- 4.1.2 Name, Role, Value — 입력 필드 이름, 역할, 값

**테스트 항목**

| 항목                                 | 검증 방법                                                              |
| ------------------------------------ | ---------------------------------------------------------------------- |
| label-input 연결                     | `label.tagName === 'LABEL'` + `label.htmlFor === input.id`             |
| 레이블 클릭 시 포커스                | `userEvent.click(label)` → input `toHaveFocus()`                       |
| Tab 포커스                           | `userEvent.tab()` → input `toHaveFocus()`                              |
| 키보드 입력                          | `userEvent.type(input, 'text')` → `toHaveValue('text')`                |
| required 속성                        | `toHaveAttribute('required')` + 레이블의 `*` 표시                      |
| error 상태                           | `aria-invalid="true"` 검증 (`toHaveAttribute('aria-invalid', 'true')`) |
| aria-describedby 연결                | error/help 텍스트 id와 input의 `aria-describedby` 일치                 |
| disabled 포커스 불가                 | `toBeDisabled()` + `userEvent.tab()` 후 `not.toHaveFocus()`            |
| readOnly 포커스는 가능, 값 변경 불가 | `toHaveFocus()` + `userEvent.type()` 후 값 그대로                      |

---

## Chip / Tag (non-interactive 기반)

**관련 WCAG 기준**

- 2.1.1 Keyboard — interactive Chip은 키보드 접근 가능해야 함
- 4.1.2 Name, Role, Value — 선택 상태 전달

**주의**: Chip은 기본적으로 `<div>` + `<span>` 기반으로 natively non-interactive이다.
interactive하게 만들려면 소비자가 `role="button"` + `tabIndex={0}` + `onKeyDown` 을 직접 제공해야 한다.

**테스트 항목**

| 항목                           | 검증 방법                                                 |
| ------------------------------ | --------------------------------------------------------- |
| 텍스트 접근성                  | `toHaveTextContent()` — 스크린 리더가 읽을 수 있는 텍스트 |
| aria-label 전달                | `toHaveAttribute('aria-label', '...')`                    |
| 선택 상태 (listbox 패턴)       | `role="option"` + `aria-selected` 검증                    |
| 선택 상태 (toggle 패턴)        | `role="button"` + `aria-pressed` 검증                     |
| 포커스 가능 (tabIndex={0})     | `userEvent.tab()` → `toHaveFocus()`                       |
| 키보드 활성화 (onKeyDown 필요) | Enter/Space 후 상태 변화 카운트 확인                      |
| 장식 아이콘                    | `Chip.Icon`에 `aria-hidden={true}` 적용                   |
| 제거 버튼                      | `rightAddon`의 아이콘에 `aria-label` + `role="button"`    |

---

## Tooltip

**관련 WCAG 기준**

- 1.4.13 Content on Hover or Focus — 호버/포커스 콘텐츠 제어

**테스트 항목**

| 항목                  | 검증 방법                                       |
| --------------------- | ----------------------------------------------- |
| 포커스 시 표시        | `userEvent.tab()` → tooltip `toBeVisible()`     |
| 포커스 해제 시 사라짐 | `userEvent.tab()` 다시 → tooltip 사라짐         |
| `role="tooltip"`      | `getByRole('tooltip')` 조회                     |
| `aria-describedby`    | 트리거의 `aria-describedby`가 tooltip id와 연결 |

---

## Tabs

**관련 WCAG 기준**

- 2.1.1 Keyboard — Arrow 키로 탭 이동

**테스트 항목**

| 항목                                              | 검증 방법                                             |
| ------------------------------------------------- | ----------------------------------------------------- |
| Arrow Left/Right로 탭 이동                        | `userEvent.keyboard('{ArrowRight}')` → 다음 탭 포커스 |
| Enter/Space로 탭 활성화                           | 활성화 후 해당 패널 표시                              |
| `role="tablist"`, `role="tab"`, `role="tabpanel"` | 각 역할 검증                                          |
| `aria-selected="true"`                            | 활성 탭 확인                                          |
| `aria-controls`                                   | 탭과 패널 연결 확인                                   |

---

## Checkbox / Radio

**관련 WCAG 기준**

- 1.3.1 Info and Relationships — label 연결
- 4.1.2 Name, Role, Value — 체크 상태 전달

**테스트 항목**

| 항목                | 검증 방법                                                               |
| ------------------- | ----------------------------------------------------------------------- |
| Space로 체크/언체크 | `userEvent.keyboard('{Space}')` → `toBeChecked()` / `not.toBeChecked()` |
| label 클릭으로 체크 | `userEvent.click(label)` → `toBeChecked()`                              |
| `aria-checked` 상태 | custom checkbox면 `toHaveAttribute('aria-checked', 'true')`             |
| disabled 상태       | `toBeDisabled()` + 변경 불가 확인                                       |
