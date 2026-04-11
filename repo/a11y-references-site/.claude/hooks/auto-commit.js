#!/usr/bin/env node

const { execSync } = require('child_process')
const path = require('path')

const ROOT = path.resolve(__dirname, '../..')

function run(cmd) {
  try {
    return execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim()
  } catch {
    return ''
  }
}

function hasChanges(scopePath) {
  const staged = run(`git diff --cached --name-only -- "${scopePath}"`)
  const unstaged = run(`git diff --name-only -- "${scopePath}"`)
  const untracked = run(`git ls-files --others --exclude-standard -- "${scopePath}"`)
  return !!(staged || unstaged || untracked)
}

function getChangedDirs(scopePath, srcRelative) {
  const allFiles = [
    ...run(`git diff --cached --name-only -- "${scopePath}"`).split('\n'),
    ...run(`git diff --name-only -- "${scopePath}"`).split('\n'),
    ...run(`git ls-files --others --exclude-standard -- "${scopePath}"`).split('\n')
  ].filter(Boolean)

  const dirs = new Set()
  for (const f of allFiles) {
    const rel = f.replace(`${srcRelative}/`, '')
    const dir = rel.split('/')[0]
    if (dir && !dir.includes('.')) dirs.add(dir)
  }
  return [...dirs].slice(0, 3)
}

function commitScope(scope, scopePath, srcRelative) {
  if (!hasChanges(scopePath)) return false

  const dirs = getChangedDirs(scopePath, srcRelative)
  const desc = dirs.length > 0 ? dirs.join(', ') : 'misc'
  const message = `chore(${scope}): update ${desc}`

  run(`git add -- "${scopePath}"`)

  const result = run(`git commit -m "${message}"`)
  if (result) {
    console.log(`  ✅ [${scope}] ${message}`)
    return true
  }
  return false
}

function commitOther() {
  const excludes = [':(exclude)packages/backend', ':(exclude)packages/frontend']
  const staged = run(`git diff --cached --name-only -- ${excludes.join(' ')}`)
  const unstaged = run(`git diff --name-only -- ${excludes.join(' ')}`)
  const untracked = run(`git ls-files --others --exclude-standard -- ${excludes.join(' ')}`)

  if (!staged && !unstaged && !untracked) return false

  run(`git add -- . ':!packages/backend' ':!packages/frontend'`)

  const result = run(`git commit -m "chore: update config and tooling"`)
  if (result) {
    console.log(`  ✅ [root] chore: update config and tooling`)
    return true
  }
  return false
}

async function main() {
  let input = ''
  for await (const chunk of process.stdin) input += chunk

  const status = run('git status --porcelain')
  if (!status) {
    console.log('\n📭 No changes to commit')
    return
  }

  console.log('\n📦 Auto-committing by scope...')

  const backendCommitted = commitScope('backend', 'packages/backend', 'packages/backend/src')
  const frontendCommitted = commitScope('frontend', 'packages/frontend', 'packages/frontend/src')
  const otherCommitted = commitOther()

  if (!backendCommitted && !frontendCommitted && !otherCommitted) {
    console.log('  📭 Nothing new to commit')
  }
}

main()
