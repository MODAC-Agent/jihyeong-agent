---
name: hook-creator
description: Claude Code 훅 생성, 설정, 디버깅 스킬. 파일 저장 후 자동 포맷팅, 위험 명령 차단, 작업 완료 시 알림, 자동 커밋 등 Claude Code 라이프사이클 이벤트에 연동한 자동화가 필요할 때 사용. 훅 이벤트 종류, 매처 문법, JSON 출력 형식, 기존 훅 트러블슈팅 질문에도 트리거됨.
---

# Hook Creator

A skill for creating and configuring Claude Code hooks.

## What are hooks?

Hooks are shell commands (or prompts/agents/HTTP calls) that run automatically at specific points in Claude Code's lifecycle. They give you deterministic control over Claude's behavior.

## Hook Event Reference

| Event               | When it fires                   | Common use                                |
| ------------------- | ------------------------------- | ----------------------------------------- |
| `PreToolUse`        | Before a tool runs              | Block dangerous commands, validate inputs |
| `PostToolUse`       | After a tool succeeds           | Auto-format, audit log, auto-commit       |
| `Stop`              | When Claude finishes responding | Verify completion, run tests              |
| `Notification`      | When Claude needs attention     | Desktop notification                      |
| `SessionStart`      | Session begins/resumes          | Inject context, setup env                 |
| `PermissionRequest` | Before permission dialog        | Auto-approve known-safe actions           |
| `UserPromptSubmit`  | When user submits prompt        | Inject context, modify prompt             |
| `ConfigChange`      | Settings file changed           | Audit log                                 |
| `SessionEnd`        | Session terminates              | Cleanup                                   |

## Matchers

Matchers filter which occurrences trigger the hook (regex against the relevant field):

- `PreToolUse` / `PostToolUse`: matches **tool name** — e.g. `Bash`, `Edit\|Write`, `mcp__.*`
- `SessionStart`: matches **source** — `startup`, `resume`, `clear`, `compact`
- `Notification`: matches **type** — `permission_prompt`, `idle_prompt`
- Empty string `""`: matches everything

## Hook Types

### `command` (most common)

Runs a shell command. Communicates via stdin/stdout/stderr/exit codes:

- **stdin**: JSON with event data
- **exit 0**: allow / proceed
- **exit 2**: block + send stderr to Claude as feedback
- **exit 0 + JSON stdout**: structured decision output

### `prompt`

Single Claude call (Haiku by default) for judgment-based decisions. Returns `{"ok": true}` or `{"ok": false, "reason": "..."}`.

### `agent`

Spawns a subagent with tool access for complex verification.

### `http`

POSTs event JSON to a URL.

## Settings File Locations

| File                          | Scope                 |
| ----------------------------- | --------------------- |
| `~/.claude/settings.json`     | Global (all projects) |
| `.claude/settings.json`       | Project (committable) |
| `.claude/settings.local.json` | Project (gitignored)  |

## Process for Creating a Hook

1. **Understand the goal**: What should happen, and when?
2. **Choose the event**: Which lifecycle point triggers it?
3. **Choose the scope**: Global (`~/.claude/settings.json`) or project-local?
4. **Write the hook**: Command string or script file?
5. **Set the matcher**: Should it fire on every occurrence, or only some?
6. **Read the current settings**: Always read the existing file before editing to merge correctly.
7. **Inject the hook**: Add to the `hooks` object in the correct settings file.
8. **Verify**: Run `/hooks` in Claude Code to confirm it appears.

## Hook JSON Structure

```json
{
  "hooks": {
    "<EventName>": [
      {
        "matcher": "<regex or empty string>",
        "hooks": [
          {
            "type": "command",
            "command": "<shell command>"
          }
        ]
      }
    ]
  }
}
```

## Common Patterns

### Auto-format after file edits

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{ "type": "command", "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write 2>/dev/null || true" }]
      }
    ]
  }
}
```

### Block dangerous Bash commands

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{ "type": "command", "command": "node ~/.claude/hooks/block-dangerous.js" }]
      }
    ]
  }
}
```

### Desktop notification (macOS)

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [{ "type": "command", "command": "osascript -e 'display notification \"Claude needs attention\" with title \"Claude Code\"'" }]
      }
    ]
  }
}
```

### Auto-commit after Stop

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [{ "type": "command", "command": "node ~/.claude/hooks/auto-commit.js" }]
      }
    ]
  }
}
```

### Inject context after compaction

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "compact",
        "hooks": [{ "type": "command", "command": "cat .claude/context-reminder.md" }]
      }
    ]
  }
}
```

### Auto-approve ExitPlanMode

```json
{
  "hooks": {
    "PermissionRequest": [
      {
        "matcher": "ExitPlanMode",
        "hooks": [
          {
            "type": "command",
            "command": "echo '{\"hookSpecificOutput\": {\"hookEventName\": \"PermissionRequest\", \"decision\": {\"behavior\": \"allow\"}}}'"
          }
        ]
      }
    ]
  }
}
```

## Reading Hook Input (in scripts)

Every hook receives JSON on stdin. Common fields:

```bash
INPUT=$(cat)
# For PreToolUse/PostToolUse:
TOOL=$(echo "$INPUT" | jq -r '.tool_name')
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
CMD=$(echo "$INPUT" | jq -r '.tool_input.command // empty')
# For Stop hooks — prevent infinite loop:
ACTIVE=$(echo "$INPUT" | jq -r '.stop_hook_active')
if [ "$ACTIVE" = "true" ]; then exit 0; fi
```

## Structured JSON Output (exit 0 + stdout)

For `PreToolUse` — deny with reason:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Use rg instead of grep"
  }
}
```

For `Stop` — block Claude from stopping:

```json
{ "decision": "block", "reason": "Tests are still failing" }
```

## Troubleshooting

- **Hook not firing**: Run `/hooks` to confirm it appears; check matcher case sensitivity
- **Hook error**: Test manually: `echo '{"tool_name":"Bash","tool_input":{"command":"ls"}}' | ./hook.sh`
- **JSON parse error**: Your shell profile may echo output — wrap in `if [[ $- == *i* ]]; then` guard
- **Stop hook infinite loop**: Check `stop_hook_active` field in stdin and `exit 0` if `true`
- **Script not found**: Use absolute paths or `$CLAUDE_PROJECT_DIR`

## Instructions

When a user asks to create a hook:

1. Ask clarifying questions if the goal is ambiguous (what triggers it? what should happen?)
2. Read the target settings file first (always, to avoid clobbering existing config)
3. Determine the correct event, matcher, and hook type
4. If the hook needs a script file (complex logic), create the script in `.claude/hooks/` and make it executable
5. Merge the new hook into the existing `hooks` object — never replace existing hooks
6. Confirm with the user which settings file to target (global vs project)
7. After writing, remind the user to run `/hooks` to verify
