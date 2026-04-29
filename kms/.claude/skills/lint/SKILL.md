---
name: lint
description: Run a full health check on the wiki — schema validation, graph bidirectionality, dedupe-key uniqueness, orphan detection, v1→v2 migration progress, lifecycle decay. Regenerates INDEX.json (machine graph snapshot) for wrapper traversal.
allowed-tools: [Bash, Read, Edit]
---

# Lint Skill

Periodic health check for Forge Heart Wiki. Runs the index-builder script,
surfaces issues, optionally fixes the trivial ones in-place.

## When to invoke

- **On request** — operator says "run lint" or "health check the wiki"
- **Monthly** — scheduled maintenance per `policies.md` §Maintenance Schedule
- **After every ingest** — regenerates INDEX.json so the typed graph stays current
- **Before authoring a playbook** — playbooks need the graph to be sound before composing from atomics
- **After bulk migration work** — verifies the migration didn't break dedupe or bidirectionality

## What it does

```bash
node .claude/skills/lint/build-index.mjs
```

The script walks `distilled/**` and `compiled/**`, parses YAML frontmatter
(regex-based — no npm deps), and produces:

1. **INDEX.json** at the kms root — machine-readable graph snapshot used by
   wrapper agents for typed graph traversal that qmd doesn't expose.
2. **Console report** — counts by type, v2 schema progress, graph health,
   per-artifact lint issues (top 30).

## Exit semantics

- **Exit 0** — clean, or only warn-level issues (schema gaps, untyped edges, missing v2 fields)
- **Exit 1** — hard errors: dedupe collisions OR broken cross-references (target file doesn't exist)
- **Exit 2** — script fatal (parse error, missing input)

Phase C migration is in progress, so v2-MISSING / V1-EDGE issues are warn-only.
Hard errors block CI/hooks once strict mode lands.

## What the report tells you

### Schema progress
```
v2 complete (tldr+goal+provenance.tier): N
v1 remaining (needs migration):          M
```
The migration goal is N=total, M=0. Track this number across sessions.

### Graph health
```
Orphans:                                 — artifacts with 0 inbound links (suggest deletion or new linkage)
Dedupe collisions:                       — duplicate dedupe_key across files (HARD ERROR)
Bidirectionality issues:                 — A→B exists but B does not link back (fix in target's see_also)
Per-artifact lint issues:                — sum across all artifacts (schema gaps, untyped edges)
```

### Per-artifact issues
The report shows top 30 in stdout; INDEX.json has the full per-artifact `_issues` array.

## Issue codes (reference)

| Code | Meaning | Severity |
|---|---|---|
| `NO-FRONTMATTER` | File has no YAML frontmatter | Hard |
| `MISSING: <field>` | Required v1 field absent (title, type, dedupe_key, lifecycle) | Hard |
| `INVALID-TYPE: <t>` | Type not in canonical 9-type v2 set | Hard |
| `INVALID-LIFECYCLE: <s>` | Lifecycle value outside enum | Hard |
| `UNDER-LINKED: N` | Fewer than 2 see_also entries | Hard (Gate 7) |
| `V2-MISSING: <field>` | v2 frontmatter field absent (tldr, goal, provenance.tier) | Warn during Phase C |
| `V2-TLDR-OVERSIZE: N` | tldr exceeds 280 chars | Warn |
| `V2-EDGE-UNTYPED` | see_also has neither relation nor relationship | Hard |
| `V2-EDGE-INVALID-RELATION: <r>` | relation value outside 11-enum | Hard |
| `V1-EDGE` | see_also uses prose relationship, should migrate to typed relation | Warn during Phase C |
| `BROKEN-LINK` | see_also points to non-existent file | Hard |
| `NON-BIDIRECTIONAL` | A links to B but B has no reciprocal link | Warn |

## Fixing issues

The script is read-only. Fixes happen via the `migrate-artifact` skill (which
applies a deterministic v1→v2 transform) or manual `Edit` calls for one-offs.

For bidirectionality: when the lint reports `A → B [NON-BIDIRECTIONAL]`, edit
B's `see_also` to add an entry pointing back at A with the inverse-typed relation.
Inverse mapping (canonical):

| Forward | Inverse |
|---|---|
| `implements` | `implemented-by` (informal) or restate as concept→pattern with relation `implements` reversed semantically |
| `requires` | `required-by` |
| `enables` | `enabled-by` |
| `mitigates` | `mitigated-by` |
| `composes-with` | `composes-with` (symmetric) |
| `conflicts-with` | `conflicts-with` (symmetric) |
| `supersedes` | `superseded-by` |
| `specializes` | `generalizes` |
| `exemplifies` | `exemplified-by` |

The script accepts both forward and inverse forms in `VALID_RELATIONS` so
migration is incremental.

## Hooked invocations (planned)

- PostToolUse Write to `distilled/**` `compiled/**` → async fire `node .claude/skills/lint/build-index.mjs` to keep INDEX.json fresh
- This is documented in `.claude/hooks/README.md` as the `regenerate-index-json.sh` hook
