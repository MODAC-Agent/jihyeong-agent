const { execSync } = require('child_process')
const path = require('path')

const ROOT = path.resolve(__dirname, '../..')

function run(cmd) {
  try {
    const output = execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })
    return { ok: true, output: output.trim() }
  } catch (e) {
    return { ok: false, output: (e.stdout || '') + (e.stderr || '') }
  }
}

async function main() {
  let input = ''
  for await (const chunk of process.stdin) input += chunk

  const checks = [
    { name: 'type-check', cmd: 'pnpm type-check' },
    { name: 'lint', cmd: 'pnpm lint' }
  ]

  const results = checks.map(({ name, cmd }) => ({ name, ...run(cmd) }))

  const failed = results.filter((r) => !r.ok)
  const passed = results.filter((r) => r.ok)

  if (failed.length === 0) {
    console.log(`\n✅ Verification passed (${passed.map((r) => r.name).join(', ')})`)
    require('child_process').execSync('node .claude/hooks/auto-commit.js', {
      cwd: ROOT,
      stdio: ['pipe', 'inherit', 'inherit'],
      input: ''
    })
    return
  }

  console.log(`\n❌ Verification failed:`)
  for (const r of failed) {
    console.log(`\n  [${r.name}]\n${r.output.slice(0, 1500)}`)
  }

  process.exit(1)
}

main()
