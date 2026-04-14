# capture-pattern-preview

**Name:** `capture-pattern-preview`
**Description:** 패턴 카탈로그 프리뷰 이미지를 캡처한다. 새 패턴 추가 후 프리뷰 이미지가 필요하거나, 기존 프리뷰를 재캡처할 때 사용. "프리뷰 캡처", "미리보기 이미지", "preview image", "캡처해줘" 등의 요청에 트리거.

---

## 배경

- 프리뷰 이미지는 `packages/frontend/public/previews/{slug}.png`에 저장
- `PatternCard.tsx`가 패턴의 `slug`로 자동 참조: `/previews/${pattern.slug}.png`
- 모든 이미지는 **498x398 @2x (996x796 px)** 포맷
- 배경색 `#fafafa`, 컴포넌트를 프레임 중앙에 배치
- PatternCard 썸네일이 `object-cover`로 100px 높이에서 crop하므로 중앙 배치가 중요

## 캡처 스크립트

기존 스크립트: `packages/frontend/scripts/capture-previews.mjs`

### 실행 방법

```bash
# 전체 캡처 (스크립트에 등록된 모든 컴포넌트)
node packages/frontend/scripts/capture-previews.mjs

# 특정 패턴만 캡처
node packages/frontend/scripts/capture-previews.mjs alert table
```

### 스크립트 구조

- **Playwright + MUI v5 UMD CDN** 사용 (React 18, ReactDOM 18)
- `@mui/material@latest`는 v9+ UMD 빌드가 없으므로 반드시 `@mui/material@5` 고정
- HTML을 임시 파일로 저장 → `file://` 프로토콜로 `page.goto()` (setContent는 CDN 로드 불가)
- viewport 498x398, deviceScaleFactor 2 → 996x796 출력

---

## 새 패턴 프리뷰 추가 워크플로우

### Step 1 — 스크립트에 컴포넌트 추가

`packages/frontend/scripts/capture-previews.mjs`의 `components` 객체에 새 항목 추가:

```js
'new-pattern': {
  slug: 'new-pattern',
  script: `
    function App() {
      return e(Stack, { spacing: 1 },
        // MUI 컴포넌트 조합
      );
    }
    ReactDOM.createRoot(document.getElementById('root')).render(e(App));
  `
}
```

**규칙:**

- `React.createElement`의 별칭 `e`를 사용 (JSX 불가, UMD 환경)
- MUI 컴포넌트는 `baseHTML` 함수의 destructuring 목록에 있어야 함
- 목록에 없는 MUI 컴포넌트가 필요하면 `baseHTML` 함수의 destructuring에 추가
- 컴포넌트의 `maxWidth`를 적절히 설정 (보통 400~440px)
- 다양한 variant/state를 보여주는 것이 좋음 (예: Alert는 4가지 severity)

### Step 2 — 캡처 실행

```bash
node packages/frontend/scripts/capture-previews.mjs new-pattern
```

### Step 3 — 결과 확인

```bash
file packages/frontend/public/previews/new-pattern.png
# 996 x 796 확인
```

이미지를 직접 읽어서 컴포넌트가 중앙에 잘 배치되었는지 육안 확인.

---

## 주의사항

- MUI UMD는 **v5만 지원** (`@mui/material@5`). v9+는 `ERR_BLOCKED_BY_ORB` 발생
- `page.setContent()`는 외부 CDN 스크립트를 로드하지 못함 → 반드시 임시 파일 + `page.goto('file://...')` 사용
- 스크립트는 `packages/frontend/` 디렉토리 기준으로 `@playwright/test`를 resolve하므로, 해당 위치에서 실행하거나 절대 경로로 호출
- Roboto 폰트 로드를 위해 `waitUntil: 'networkidle'` + `waitForTimeout(1000)` 사용
