# Skills — Invocable Workflows

Per Claude 4.x research, Skills are on-demand invocable subroutines stored
under `.claude/skills/<name>/SKILL.md`. They don't consume the background
context window; they're loaded only when invoked. Use them for procedural
workflows that the agent runs on demand.

---

## Planned Skills

| Skill | Purpose | Invoked when |
|---|---|---|
| `ingest` | Full ingest workflow: envelope → atomic creation → ripple → index/log update | New file appears in `raw/` |
| `query` | Manual query path (when not going through qmd MCP) — reads index, follows graph, synthesizes | Operator asks a question manually |
| `lint` | Full health check: lifecycle, contradictions, dedupe, orphans, cross-ref completeness, INDEX.json regen | Monthly, or on request |
| `compile-playbook` | Compose a new playbook from a goal — runs qmd search, picks atomics, structures steps, validates | Operator says "build a playbook for [goal]" |
| `compile-profile` | Recompile a tool profile when its atomics changed | Hook detects compiled_from sources updated |
| `migrate-artifact` | Add new frontmatter fields to an existing v1 artifact, infer defaults, prompt for missing | Phase C migration |

---

## Skill Structure

```yaml
---
name: ingest
description: Run the full ingest workflow for a new raw source
allowed-tools: [Read, Write, Edit, Grep, Glob, Bash]
---

# Instructions

[Step-by-step procedure. Reads relevant rule file based on raw/ subdirectory.]
```

---

## Authoring Order

1. `lint` — needed to maintain hygiene during migration; also produces INDEX.json
2. `migrate-artifact` — needed to backfill existing artifacts to v2 schema
3. `ingest` — primary daily workflow
4. `compile-playbook` — proves the wrapper's input layer
5. `compile-profile`, `query` — fill in after the above are stable
