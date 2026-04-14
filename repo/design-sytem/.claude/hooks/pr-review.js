const { execSync, spawnSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const REVIEW_PROMPT = `You are a code reviewer. Review the following PR diff.

Return ONLY a valid JSON array (no markdown, no explanation) where each item has:
- "path": file path relative to repo root (string)
- "line": line number in the NEW file that the comment applies to (number, must be a line visible in the diff)
- "body": concise review comment in Korean (string), prefixed with priority label
- "summary": one short phrase in Korean (max 25 chars) describing the issue, e.g. "의도치 않은 워크플로우 중단 가능"
- "category": one English word categorizing the issue type, e.g. "Security", "Exception", "Logic", "Process", "Performance", "Null", "Type", "State"

Only include issues that fall into these categories — ignore everything else:
- [P0] 즉시 수정 필수 — 보안 취약점, 데이터 손실, 크래시 유발 버그
- [P1] 반드시 수정 — 잘못된 로직, 런타임 에러 가능성, 심각한 성능 문제
- [P2] 수정 권장 — 잠재적 버그, 엣지 케이스 누락, 유지보수성 저하

If the code looks fine, return []. Do not comment on style, naming, or minor suggestions.

Diff:
`

async function callClaude(diff) {
  const apiKey = process.env.ANTHROPIC_REVIEW_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_REVIEW_API_KEY is not set')

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 2048,
      messages: [{ role: 'user', content: REVIEW_PROMPT + diff }]
    })
  })

  const data = await res.json()
  return data.content?.[0]?.text
}

function loadIgnorePatterns() {
  const ignorePath = path.resolve(__dirname, '../pr-review-ignore')
  if (!fs.existsSync(ignorePath)) return []

  return fs
    .readFileSync(ignorePath, 'utf-8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
}

function toRegex(pattern) {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '.+')
    .replace(/\*/g, '[^/]+')
  return new RegExp(escaped)
}

function filterDiff(diff, patterns) {
  if (!patterns.length) return diff

  const regexes = patterns.map(toRegex)
  return diff
    .split(/(?=^diff --git )/m)
    .filter((chunk) => {
      const fileMatch = chunk.match(/^diff --git a\/.+ b\/(.+)/)
      // 파일 경로를 파싱할 수 없는 chunk는 안전하게 포함
      if (!fileMatch) return true
      return !regexes.some((r) => r.test(fileMatch[1]))
    })
    .join('')
}

// diff에서 새 파일 기준으로 유효한 줄 번호 추출
function getValidLines(diff) {
  const validLines = new Map() // path -> Set<lineNumber>

  for (const chunk of diff.split(/(?=^diff --git )/m)) {
    const fileMatch = chunk.match(/^\+\+\+ b\/(.+)/m)
    if (!fileMatch) continue

    const filePath = fileMatch[1]
    if (!validLines.has(filePath)) validLines.set(filePath, new Set())
    const lineSet = validLines.get(filePath)

    for (const hunk of chunk.split(/(?=^@@)/m).slice(1)) {
      const hunkHeader = hunk.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/)
      if (!hunkHeader) continue

      let newLine = parseInt(hunkHeader[1], 10)
      for (const line of hunk.split('\n').slice(1)) {
        if (line.startsWith('-')) continue
        if (line.startsWith('+') || line.startsWith(' ')) lineSet.add(newLine++)
      }
    }
  }

  return validLines
}

function getEnv() {
  const env = { ...process.env }
  if (process.env.GITHUB_REVIEW_TOKEN) env.GH_TOKEN = process.env.GITHUB_REVIEW_TOKEN
  return env
}

function postComment(repoName, prNumber, body) {
  const result = spawnSync('gh', ['api', `repos/${repoName}/issues/${prNumber}/comments`, '--method', 'POST', '--field', `body=${body}`], {
    encoding: 'utf-8',
    env: getEnv()
  })
  if (result.error) return null
  try {
    const data = JSON.parse(result.stdout)
    return data.id ? String(data.id) : null
  } catch {
    return null
  }
}

function updateComment(repoName, commentId, body) {
  spawnSync('gh', ['api', `repos/${repoName}/issues/comments/${commentId}`, '--method', 'PATCH', '--field', `body=${body}`], {
    encoding: 'utf-8',
    env: getEnv()
  })
}

function parseReviewComments(text) {
  const stripped = text
    .replace(/^```(?:json)?\n?/, '')
    .replace(/\n?```$/, '')
    .trim()
  if (!stripped) return []
  return JSON.parse(stripped)
}

function countByPriority(comments) {
  const counts = { P0: 0, P1: 0, P2: 0 }
  for (const c of comments) {
    const match = c.body.match(/^\[(P0|P1|P2)\]/)
    if (match) counts[match[1]]++
  }
  return counts
}

async function main() {
  if (!process.env.ANTHROPIC_REVIEW_API_KEY) return

  let input = ''
  for await (const chunk of process.stdin) input += chunk

  const data = JSON.parse(input)
  const command = data.tool_input?.command || ''

  if (!/\bgh pr create\b/.test(command) || !command.includes('# ai-review')) return

  const output = data.tool_response?.stdout || ''
  const match = output.match(/https:\/\/github\.com\/[^/\s]+\/[^/\s]+\/pull\/(\d+)/)
  if (!match) return

  const prNumber = match[1]

  let repoName
  try {
    repoName = execSync('gh repo view --json nameWithOwner -q .nameWithOwner', { encoding: 'utf-8' }).trim()
  } catch {
    return
  }

  const commentId = postComment(repoName, prNumber, '🔍 리뷰 진행중...')
  const finish = (body) => {
    if (commentId) updateComment(repoName, commentId, body)
    else postComment(repoName, prNumber, body)
    console.log(body)
  }

  const rawDiff = execSync(`gh pr diff ${prNumber}`, { encoding: 'utf-8' })
  if (!rawDiff.trim()) {
    finish('👍 LGTM! 이슈 없음')
    return
  }

  const diff = filterDiff(rawDiff, loadIgnorePatterns())
  if (!diff.trim()) {
    finish('👍 LGTM! 이슈 없음')
    return
  }

  let reviewText
  try {
    reviewText = await callClaude(diff)
  } catch {
    finish('⚠️ 리뷰 실패: Claude API 호출 오류')
    return
  }
  if (!reviewText) return

  let comments
  try {
    comments = parseReviewComments(reviewText)
  } catch {
    finish('⚠️ 리뷰 실패: 응답 파싱 오류')
    return
  }
  if (!Array.isArray(comments) || comments.length === 0) {
    finish('👍 LGTM! 이슈 없음')
    return
  }

  const validLines = getValidLines(rawDiff)
  const filteredComments = comments.filter((c) => validLines.get(c.path)?.has(c.line))
  if (filteredComments.length === 0) {
    finish('👍 LGTM! 이슈 없음')
    return
  }

  let commitId
  try {
    commitId = execSync(`gh pr view ${prNumber} --json headRefOid -q .headRefOid`, { encoding: 'utf-8' }).trim()
  } catch {
    finish('⚠️ 리뷰 실패: commit ID 조회 오류')
    return
  }

  const payload = JSON.stringify({
    commit_id: commitId,
    event: 'COMMENT',
    comments: filteredComments.map((c) => ({ path: c.path, line: c.line, side: 'RIGHT', body: c.body }))
  })

  spawnSync('gh', ['api', `repos/${repoName}/pulls/${prNumber}/reviews`, '--method', 'POST', '--input', '-'], {
    input: payload,
    encoding: 'utf-8',
    env: getEnv()
  })

  const PRIORITY_EMOJI = { P0: '🔴', P1: '🟠', P2: '🟡' }
  const lines = [`## ✅ 리뷰 완료`, ``, `| Priority | Category | Issue Details |`, `|----------|----------|---------------|`]
  for (const priority of ['P0', 'P1', 'P2']) {
    for (const c of filteredComments.filter((c) => c.body.startsWith(`[${priority}]`))) {
      const emoji = PRIORITY_EMOJI[priority]
      const category = c.category ? `\`${c.category}\`` : ''
      const summary = c.summary || c.body.replace(/^\[P\d\]\s*/, '').slice(0, 40)
      lines.push(`| ${emoji} **${priority}** | ${category} | ${summary} |`)
    }
  }
  lines.push(``)
  fs.writeFileSync('/tmp/pr-review-pending.json', JSON.stringify({ prNumber, repoName, comments: filteredComments }, null, 2))
  finish(lines.join('\n'))
}

main().catch(console.error)
