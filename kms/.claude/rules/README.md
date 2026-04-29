# Path-Scoped Rules

Per Claude 4.x research, modular rules in `.claude/rules/` with YAML `paths`
frontmatter are lazy-loaded into context only when the agent operates on
matching files. This keeps the root CLAUDE.md kernel slim and avoids loading
ingest-paper rules when working on ingest-creative-prompt sources.

---

## Planned Rule Files

| File | Scope (`paths`) | Purpose |
|---|---|---|
| `ingest-paper.md` | `raw/papers/**` | How to extract claims/evidence/definitions from research papers |
| `ingest-article.md` | `raw/articles/**` | How to distill takeaways and patterns from articles |
| `ingest-system-prompt.md` | `raw/system-prompts/**` | Preserve verbatim, extract patterns, create exemplar |
| `ingest-creative-prompt.md` | `raw/creative-prompts/**` | Extract patterns + parameter values + create exemplar |
| `ingest-deep-research.md` | `raw/deep-research/**` | Extract claims, contradictions, synthesis seeds |
| `ingest-tool-doc.md` | `raw/tool-docs/**` | Build tool artifact + mechanism artifacts from official docs |
| `ingest-workflow.md` | `raw/workflows/**` | Extract patterns + create exemplar (preserve full JSON) |
| `ingest-field-note.md` | `raw/field-notes/**` | Extract observations, failures, lessons |
| `ingest-benchmark.md` | `raw/benchmarks/**` | Extract measurements, conditions, comparisons |
| `ingest-idea-file.md` | `raw/idea-files/**` | Extract transferable principles and seed concepts |
| `compile-profile.md` | `compiled/profiles/**` | How to compose a per-tool profile from atomics |
| `compile-synthesis.md` | `compiled/syntheses/**` | How to compose cross-cutting synthesis |
| `compile-playbook.md` | `compiled/playbooks/**` | How to compose goal-oriented playbooks |

---

## Rule File Structure

Each rule file uses YAML frontmatter to scope its loading:

```yaml
---
name: ingest-paper
description: Extraction rules for research papers
paths:
  - raw/papers/**
allowed-tools: [Read, Write, Grep, Glob]
---

# Body: imperatives, examples, anti-patterns specific to this scope.
```

---

## Authoring Order

These rules will be authored in Phase B of the migration. Authoring priority:

1. `ingest-creative-prompt.md`, `ingest-system-prompt.md` — most divergent from current ingest behavior, biggest quality win
2. `compile-playbook.md` — defines the wrapper's primary input format
3. `ingest-paper.md`, `ingest-deep-research.md` — overlap heavily, write together
4. `ingest-tool-doc.md` — sets the pattern for `tool` + `mechanism` artifact creation
5. Remaining ingest rules
6. `compile-profile.md`, `compile-synthesis.md`
