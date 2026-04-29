# Hooks — Deterministic Gates

Hooks (Claude Code lifecycle scripts) enforce what prose cannot. They run as
PreToolUse/PostToolUse gates on Write/Edit operations. Exit code 0 = allow,
exit code 2 = block + return stderr to the agent for correction.

This directory will hold the actual scripts. This README defines the contract.

---

## Required Hooks

| Hook | Event | Match | Action | Status |
|---|---|---|---|---|
| `validate-frontmatter.mjs` | PreToolUse Write | `distilled/**` `compiled/**` | Parse YAML, validate against schema in `policies.md`. Reject on missing required fields, type mismatch, unknown enum values | Strict |
| `block-raw-edits.mjs` | PreToolUse Edit/Write | `raw/**` (excluding `*.envelope.md`) | Reject all writes. Raw is immutable. | Strict |
| `check-dedupe-key.mjs` | PreToolUse Write | `distilled/**` `compiled/**` | Read INDEX.json for dedupe keys. Reject on collision unless `supersedes` is set. | Strict |
| `enforce-tag-vocab.mjs` | PreToolUse Write | `distilled/**` `compiled/**` | All `tags`, `domains`, `modality`, `tools` values must exist in `taxonomy.md`. | Strict |
| `enforce-min-crossrefs.mjs` | PreToolUse Write | `distilled/**` `compiled/**` | Atomic ≥ 2 typed `see_also`, compiled ≥ 3. | Strict |
| `regenerate-index-json.mjs` | PostToolUse Write | `distilled/**` `compiled/**` | Trigger `node .claude/skills/lint/build-index.mjs` to rebuild `INDEX.json`. Async. | Strict |

**All hooks strict from day one.** The greenfield approach (Phase D purification clears v1 corpus before re-ingest) means no backfill window is needed.

**Implementation note:** hooks are Node ESM scripts, not shell scripts. We already have Node 22 installed for qmd, and the lint script proved that pure-Node + regex frontmatter parsing works without npm dependencies. Sharing one extraction module between lint and hooks reduces drift.

---

## Why Hooks (vs. Trusting the Model)

Per Claude 4.x research: instructions in CLAUDE.md are **advisory**, subject to probabilistic interpretation. Hooks are **deterministic** — the model cannot hallucinate around them. Critical invariants (raw immutability, dedupe uniqueness, frontmatter schema) belong in hooks, not prose.

---

## Hook Execution Contract

Each hook script:
1. Receives JSON on stdin: `{ tool_name, tool_input, ... }`
2. Reads `tool_input.file_path` and `tool_input.content` (or staged Edit)
3. Runs validation
4. **Exit 0** = allow operation
5. **Exit 2** = block; write human-readable error to stderr (gets piped back to agent context)
6. Hooks should be ≤ 100ms per invocation (else block UX)

---

## Status Tracking

Hooks marked "warn-only" log violations to `log.md` but exit 0. Flip to strict by changing the exit code logic after 2 weeks of clean ingest.

---

## Configuration

Hooks register in `.claude/settings.json` under `hooks.PreToolUse` / `hooks.PostToolUse`. Sample (TODO at install time):

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "match": { "tool": "Write", "path": "distilled/**" },
        "command": ".claude/hooks/validate-frontmatter.sh"
      },
      {
        "match": { "tool": "Edit|Write", "path": "raw/**" },
        "command": ".claude/hooks/block-raw-edits.sh"
      }
    ]
  }
}
```

(Final config syntax follows current Claude Code hook spec at install time.)
