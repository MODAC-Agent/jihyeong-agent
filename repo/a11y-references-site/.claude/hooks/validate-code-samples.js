// PostToolUse hook: code samples 저장 시 미리보기 깨짐 패턴을 검사합니다.
const fs = require('fs')

// DS_DEPS와 동기화 — SandpackPreview.tsx에 등록된 패키지만 미리보기 가능
const KNOWN_DEPS = new Set([
  // MUI
  '@mui/material',
  '@emotion/react',
  '@emotion/styled',
  '@mui/icons-material',
  // MUI x-date-pickers
  '@mui/x-date-pickers',
  'date-fns',
  // Radix UI
  '@radix-ui/react-collapsible',
  '@radix-ui/react-tabs',
  '@radix-ui/react-tooltip',
  '@radix-ui/react-accordion',
  '@radix-ui/react-checkbox',
  '@radix-ui/react-radio-group',
  '@radix-ui/react-switch',
  '@radix-ui/react-dialog',
  '@radix-ui/react-popover',
  '@radix-ui/react-dropdown-menu',
  '@radix-ui/react-slider',
  '@radix-ui/react-toolbar',
  '@radix-ui/react-select',
  '@radix-ui/react-navigation-menu',
  '@radix-ui/react-icons',
  '@radix-ui/react-form',
  '@radix-ui/react-toast',
  '@radix-ui/react-visually-hidden',
  '@radix-ui/react-slot',
  '@radix-ui/react-label',
  // antd
  'antd',
  'dayjs',
  '@ant-design/icons',
  'rc-util',
  // Chakra UI
  '@chakra-ui/react',
  'framer-motion',
  // Adobe React Spectrum / React Aria
  '@adobe/react-spectrum',
  'react-aria-components',
  '@react-aria/utils',
  '@react-stately/data',
  // react-hook-form
  'react-hook-form',
  '@hookform/resolvers',
  '@hookform/resolvers/zod',
  'zod',
  // CVA / shadcn utilities
  'class-variance-authority',
  'clsx',
  'tailwind-merge',
  // Base UI
  '@base-ui/react',
  // React built-ins (always available in sandpack react-ts template)
  'react',
  'react-dom'
])

// shadcn 로컬 경로는 미리보기 불가 — 훅에서는 경고만
const SHADCN_PREFIX = '@/components/ui'

let inputData = ''
process.stdin.on('data', (c) => (inputData += c))
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(inputData)
    if (!['Write', 'Edit'].includes(input.tool_name)) process.exit(0)

    const filePath = input.tool_input?.file_path
    if (!filePath) process.exit(0)

    const isRuleJson = filePath.match(/\/rules\/[^/]+\.json$/) && !filePath.endsWith('patterns.json')
    const isFrontendPatterns =
      filePath.endsWith('packages/frontend/lib/patterns.ts') || filePath.match(/packages\/frontend\/lib\/patterns\/[^/]+\.ts$/)

    if (!isRuleJson && !isFrontendPatterns) process.exit(0)

    const raw = fs.readFileSync(filePath, 'utf-8')
    const issues = []

    // Extract code strings
    const codeSamples = []
    if (isRuleJson) {
      const content = JSON.parse(raw)
      for (const [key, sample] of Object.entries(content.codeSamples || {})) {
        if (sample?.code) codeSamples.push({ label: `codeSamples.${key}`, code: sample.code })
      }
    } else {
      // Extract template literal code strings from patterns.ts
      const codeRe = /code:\s*`([\s\S]*?)`/g
      let m
      let idx = 0
      while ((m = codeRe.exec(raw)) !== null) {
        codeSamples.push({ label: `code[${idx++}]`, code: m[1] })
      }
    }

    for (const { label, code } of codeSamples) {
      // 0. Unknown imports — not registered in SandpackPreview.tsx DS_DEPS
      const importRe = /from\s+['"]([^'"]+)['"]/g
      let im
      while ((im = importRe.exec(code)) !== null) {
        const pkg = im[1]
        if (pkg.startsWith(SHADCN_PREFIX)) continue // shadcn은 별도 처리
        if (pkg.startsWith('.') || pkg.startsWith('/')) continue // 상대 경로
        // scoped package는 첫 두 세그먼트(@scope/name), 일반 패키지는 첫 세그먼트
        const pkgName = pkg.startsWith('@') ? pkg.split('/').slice(0, 2).join('/') : pkg.split('/')[0]
        if (!KNOWN_DEPS.has(pkgName) && !KNOWN_DEPS.has(pkg)) {
          issues.push(
            `${label}: \`${pkg}\` 는 SandpackPreview.tsx DS_DEPS에 등록되지 않은 패키지입니다. Sandpack 미리보기에서 "Could not find dependency" 오류가 발생합니다. DS_DEPS에 추가하거나 import를 제거하세요.`
          )
        }
      }

      // 1. Props-based function — props not auto-passed
      const propsMatch = code.match(/function\s+\w+\s*\(\s*\{([^}]+)\}/)
      if (propsMatch) {
        const props = propsMatch[1]
          .split(',')
          .map((p) =>
            p
              .trim()
              .replace(/\s*=.*$/, '')
              .split(':')[0]
              ?.trim()
          )
          .filter(Boolean)
        const autoPassable = [
          'label',
          'title',
          'id',
          'href',
          'legend',
          'children',
          'checked',
          'disabled',
          'selected',
          'open',
          'active',
          'enabled',
          'visible',
          'expanded',
          'loading',
          'required',
          'readOnly',
          'multiple',
          'indeterminate'
        ]
        const problematic = props.filter((p) => !autoPassable.includes(p) && !/^on[A-Z]/.test(p))
        if (problematic.length > 0) {
          issues.push(
            `${label}: 함수 prop ${problematic.map((p) => `\`${p}\``).join(', ')} 은 자동 전달되지 않아 미리보기 오류 발생. 함수 내부에서 직접 선언하세요.`
          )
        }
      }

      // 2. useRef without generic (TypeScript error in react-ts template)
      if (/useRef\(\[\]\)/.test(code) || /useRef\(null\)/.test(code)) {
        if (!/useRef</.test(code)) {
          issues.push(
            `${label}: \`useRef([])\` 또는 \`useRef(null)\`에 제네릭 타입이 없습니다. react-ts 환경에서 오류 발생 가능. \`useRef<HTMLButtonElement>(null)\` 형태로 수정하세요.`
          )
        }
      }

      // 3. Undeclared handler variables (e.g. onClick={handleSave} without const handleSave)
      const handlerRe = /(?:onClick|onChange|onSubmit|onKeyDown|onFocus|onBlur|onMouseEnter|onMouseLeave)=\{([a-zA-Z_$][a-zA-Z0-9_$]*)\}/g
      let hm
      while ((hm = handlerRe.exec(code)) !== null) {
        const varName = hm[1]
        if (/^(set[A-Z]|e$|event$)/.test(varName)) continue
        const isDeclared =
          new RegExp(`const\\s+${varName}\\b`).test(code) ||
          new RegExp(`let\\s+${varName}\\b`).test(code) ||
          new RegExp(`function\\s+${varName}\\b`).test(code) ||
          new RegExp(`\\b${varName}\\s*=\\s*\\(`).test(code)
        if (!isDeclared) {
          issues.push(`${label}: \`${varName}\` 가 선언되지 않았습니다 (onClick={${varName}})`)
        }
      }

      // 4. Duplicate useState declarations
      const stateRe = /const\s+\[(\w+),/g
      const stateNames = []
      let sm
      while ((sm = stateRe.exec(code)) !== null) {
        stateNames.push(sm[1])
      }
      const dupes = stateNames.filter((n, i) => stateNames.indexOf(n) !== i)
      if (dupes.length > 0) {
        issues.push(`${label}: 중복 state 선언: ${dupes.map((d) => `\`${d}\``).join(', ')}`)
      }

      // 5. Bare JSX with undeclared variables that buildStateDecls won't auto-detect
      const hasNamedFunc = /(?:export\s+)?(?:default\s+)?function\s+\w+/.test(code)
      if (!hasNamedFunc) {
        const STATE_VAR_RE =
          /\b(is[A-Z]\w*|has[A-Z]\w*|show[A-Z]\w*|\w+Checked|\w+Open|\w+Visible|\w+Selected|\w+Enabled|\w+Active|open|active|enabled|checked|loading|selected)\b/
        const jsxVarRe =
          /(?:value|page|currentPage|totalPages|date|keyword|email|form|anchorEl|currentKey|query|searchTerm|count|text|name|content)=\{([a-zA-Z_$]\w*)\}/g
        let jv
        while ((jv = jsxVarRe.exec(code)) !== null) {
          const v = jv[1]
          if (v === 'true' || v === 'false' || v === 'undefined' || v === 'null') continue
          if (/^set[A-Z]/.test(v)) continue
          const declaredInCode = new RegExp(`(?:const|let|var)\\s+(?:\\[\\s*)?${v}\\b`).test(code)
          if (!declaredInCode && !STATE_VAR_RE.test(v)) {
            issues.push(
              `${label}: bare JSX에서 \`${v}\` 사용하지만 선언 없음. buildStateDecls 자동 감지 대상도 아님. 함수 래퍼를 추가하고 useState로 직접 선언하세요.`
            )
          }
        }
      }

      // 6. "export default function App" uses hooks without importing them
      if (/export\s+default\s+function\s+App/.test(code)) {
        const hooks = ['useState', 'useRef', 'useEffect', 'useCallback', 'useMemo', 'useId', 'useReducer']
        for (const hook of hooks) {
          if (new RegExp(`\\b${hook}\\b`).test(code) && !new RegExp(`import\\s+.*\\b${hook}\\b.*from\\s+['"]react['"]`).test(code)) {
            issues.push(
              `${label}: \`export default function App\`에서 \`${hook}\`을 사용하지만 react에서 import하지 않았습니다. buildAppCode가 이 코드를 그대로 반환하므로 직접 import해야 합니다.`
            )
          }
        }
      }

      // 7. Inline style objects — use className + index.css instead
      const inlineStyleMatches = code.match(/style=\{\{/g)
      if (inlineStyleMatches) {
        issues.push(
          `${label}: \`style={{}}\` 인라인 스타일이 ${inlineStyleMatches.length}곳에 있습니다. \`import './index.css'\`와 className으로 교체하세요. (CLAUDE.md "Code sample style rules" 참고)`
        )
      }

      // 8. import after JSX (broken module structure)
      const lines = code.split('\n')
      let sawNonImport = false
      for (const line of lines) {
        const t = line.trim()
        if (!t || t.startsWith('//') || t.startsWith('/*') || t.startsWith('*')) continue
        if (t.startsWith('import ') && sawNonImport) {
          issues.push(
            `${label}: JSX/코드 뒤에 \`import\` 문이 있습니다. ES 모듈에서는 import가 최상단에만 올 수 있습니다. 모든 import를 코드 시작 부분으로 이동하세요.`
          )
          break
        }
        if (!t.startsWith('import ') && !t.startsWith('}') && t.length > 0) sawNonImport = true
      }
    }

    if (issues.length > 0) {
      process.stdout.write(
        `\n⚠️  코드 샘플 미리보기 검증 실패:\n` +
          issues.map((i) => `  ✗ ${i}`).join('\n') +
          `\n\n위 문제를 수정하면 Sandpack 미리보기가 올바르게 작동합니다.\n`
      )
    }
  } catch (_) {
    // silent
  }
  process.exit(0)
})
