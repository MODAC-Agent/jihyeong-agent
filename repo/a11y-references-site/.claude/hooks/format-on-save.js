const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const PATTERN_FILE_RE = /packages\/frontend\/lib\/patterns(\/[^/]+)?\.ts$/

const REPO_ROOT = path.join(__dirname, '..', '..')

async function formatCodeSamplesInFile(filePath) {
  let prettier
  try {
    prettier = require(require.resolve('prettier', { paths: [REPO_ROOT] }))
  } catch {
    return
  }

  const prettierConfig = {
    arrowParens: 'always',
    bracketSameLine: true,
    bracketSpacing: true,
    endOfLine: 'lf',
    printWidth: 150,
    semi: false,
    singleAttributePerLine: true,
    singleQuote: true,
    jsxSingleQuote: true,
    tabWidth: 2,
    trailingComma: 'none',
    useTabs: false,
    quoteProps: 'as-needed'
  }

  let src = fs.readFileSync(filePath, 'utf-8')
  let changed = false

  // Collect all code block positions first, then process in reverse to preserve indices
  const codeBlockRe = /(\bcode:\s*)`([\s\S]*?[^\\])`/g
  const blocks = []
  let m
  while ((m = codeBlockRe.exec(src)) !== null) {
    blocks.push({ full: m[0], prefix: m[1], rawCode: m[2], index: m.index })
  }

  for (const { full, prefix, rawCode, index } of blocks.reverse()) {
    const code = rawCode.replace(/\\`/g, '`')
    try {
      let formatted = await prettier.format(code.trim(), { ...prettierConfig, parser: 'babel-ts' })
      // Remove semicolons Prettier inserts before bare JSX expressions (e.g. `;<Foo>` → `<Foo>`)
      formatted = formatted
        .replace(/^;(?=<)/gm, '')
        .replace(/^;[ \t]*\n/gm, '')
        .replace(/\n$/, '')
      const escaped = formatted.replace(/`/g, '\\`')
      if (escaped !== rawCode) {
        src = src.slice(0, index) + `${prefix}\`${escaped}\`` + src.slice(index + full.length)
        changed = true
      }
    } catch {
      // Leave as-is if parse fails (e.g. plain HTML snippet)
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, src, 'utf-8')
  }
}

async function main() {
  let input = ''
  for await (const chunk of process.stdin) input += chunk

  const data = JSON.parse(input)
  const filePath = data.tool_input?.file_path
  if (!filePath) return

  try {
    execSync(`pnpm prettier --write "${filePath}"`, { stdio: 'ignore' })
  } catch {}

  if (PATTERN_FILE_RE.test(filePath)) {
    await formatCodeSamplesInFile(filePath)
  }

  let dir = path.dirname(filePath)
  while (dir !== path.parse(dir).root) {
    const hasConfig =
      fs.existsSync(path.join(dir, 'eslint.config.js')) ||
      fs.existsSync(path.join(dir, 'eslint.config.mjs')) ||
      fs.existsSync(path.join(dir, 'eslint.config.cjs'))
    if (hasConfig) {
      try {
        execSync(`pnpm eslint --fix "${filePath}"`, { cwd: dir, stdio: 'ignore' })
      } catch {}
      break
    }
    dir = path.dirname(dir)
  }
}

main()
