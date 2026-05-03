---
name: ingest-tool-doc
description: Extraction rules for official tool documentation (vendor docs, API references, parameter guides)
paths:
  - raw/tool-docs/**
allowed-tools: [Read, Write, Edit, Grep, Glob, Bash]
---

# Ingest Mode — Tool Documentation

## Trigger

A new file lands in `raw/tool-docs/`. Snapshot of vendor-published documentation:
Anthropic API docs, Midjourney's official guide, Veo 3 documentation, n8n node
reference, MCP spec, qmd README. First-party authoritative — `provenance.tier:
official-doc` by default.

## What to produce

Tool docs are reference material; they map cleanly to the schema's tool model:

| Likely artifact types | When to use |
|---|---|
| `tool` | One per documented tool (lean factual surface — what it is, version, key mechanisms list, links to docs) |
| `mechanism` | One per parameter / flag / endpoint / node the doc describes |
| `pattern` | If the doc has a "best practices" section, extract those as patterns |
| `concept` | If the doc introduces a new architectural concept (e.g., "extended thinking", "tool use") |

Tool docs rarely produce `failure` or `exemplar` directly — those come from
field notes and creative prompts respectively. But cross-reference any
existing failures the doc explicitly addresses.

## Extraction priorities

1. **Tool artifact first.** Before any `mechanism` artifacts, ensure the `tool` artifact exists. Mechanisms reference their tool in `tools[]`; without the tool artifact they're orphaned.
2. **One mechanism per parameter — be granular.** `--stylize`, `--chaos`, `--weird` each get their own artifact. Don't lump them. The wrapper composes specific knobs; lumping defeats retrieval.
3. **Capture default values, ranges, types exactly.** `default: 100, range: 0–1000, type: integer` → these are the data points the wrapper conditions on. Vague "high values produce more variation" is not enough.
4. **Authoritative tier earns latitude.** `provenance.tier: official-doc` allows higher `confidence` than community sources. But still verify — vendor docs occasionally lag behind the actual product behavior.
5. **Version-bind always.** Tool docs are version-snapshots. `model_versions` field mandatory for any tool that versions (image/video/audio generators, frontier LLMs).

## Frontmatter defaults

```yaml
provenance:
  tier: official-doc
  corroboration_count: 1
modality: [<actual modality>]   # depends on tool — text for LLM docs, image for Midjourney, etc.
tools: [<tool-slug>]            # exact slug from taxonomy.md tools registry
abstraction_level: tool-specific
language: en   # most vendor docs; pl rare
decay_triggers:
  - event: "<tool> releases new major version"
  - time_days: 90
```

For the `tool` artifact specifically:

```yaml
type: tool
goal: "see what <tool> can do and what its key control surfaces are"
keywords: [<tool name variants>, <vendor name>]
```

For each `mechanism` artifact:

```yaml
type: mechanism
goal: "use <parameter> in <tool> to <observed effect>"
keywords: [<parameter syntax>, <related parameter syntaxes>]
```

## Body emphasis

For `tool` body: keep it lean. Title, vendor, current version, brief description,
links to official docs, list of mechanism artifacts. Don't duplicate what the
`profile` artifact will eventually compile.

For `mechanism` body: the `Mechanism / Parameters` section is the entire point.
Default value, range, type, observed effects across the range, common combinations
with other mechanisms, version compatibility.

## Anti-patterns

- **Don't author a profile here.** Tool docs are atomic ingest. The `profile` artifact compiles later from many sources (docs + creative prompts + field notes + failures).
- **Don't conflate tool with mechanism.** The tool is "Claude Opus 4.7"; the mechanism is "extended_thinking parameter". Two artifacts, not one.
- **Don't skip the `tools[]` registry update.** If this is a new tool slug, add it to `taxonomy.md` §Tools registry first. Hooks block on missing registry entries.
- **Don't snapshot stale docs.** If you can verify the doc is current, set `lifecycle: current`. If it's a known older snapshot, set `decay_triggers` aggressively or `lifecycle: review-soon` from the start.

## Ripple expectations

Tool docs ripple via mechanism enrichment. Each new mechanism may add a
typed `see_also` (relation: `composes-with`) on existing patterns that use
that parameter. Recompile the tool's `profile` after a substantial doc ingest
(several mechanisms added or changed).
