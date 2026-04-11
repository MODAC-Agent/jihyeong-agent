# CLAUDE.local.md

> 이 파일은 Claude Code가 세션 컨텍스트 한계에 도달했을 때 자동으로 기록합니다.
> 직접 메모나 설정을 추가할 때는 `=` 구분선 위에 작성하세요.

====

- SandpackPreview.tsx 리팩토링 완료 (2026-04-02): 인라인 스타일 → indexCss CSS 클래스 방식으로 전환.
  모든 패턴 코드 샘플(alert, button, drawer, form-validation, pagination, popover, radio-group, select, tabs, text-input, toggle, tooltip)도 동일하게 업데이트됨.
  `./index.css` 모듈 에러는 해결된 상태. 신규 클래스가 필요하면 SandpackPreview.tsx의 `indexCss`에 추가 후 패턴 파일에서 사용.
