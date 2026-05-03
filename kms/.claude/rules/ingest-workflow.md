---
name: ingest-workflow
description: Extraction rules for workflow/automation specs (n8n flows, Claude Code skill specs, agent system definitions, MCP server configs)
paths:
  - raw/workflows/**
allowed-tools: [Read, Write, Edit, Grep, Glob, Bash]
---

# Ingest Mode — Workflow / Automation

## Trigger

A new file lands in `raw/workflows/`. Concrete, executable workflow specifications:
n8n flow JSON, Claude Code skill `.md`, agent system spec, MCP server config,
Zapier blueprint, GitHub Action YAML. The defining trait: **it could be loaded
into the target tool and run**.

## What to produce

Workflows are tools-orchestrating-tools. They typically span agentic and
tool-specific axes. Expect 3–8 atomics:

| Likely artifact types | When to use |
|---|---|
| `pattern` | The orchestration shape (how the workflow composes its steps) — the most reusable extract |
| `exemplar` | **Always** — preserve the workflow spec verbatim (JSON, YAML, markdown) |
| `mechanism` | If the workflow uses a specific tool feature in a non-obvious way (a particular MCP tool call, an n8n node configuration) |
| `tool` | If this is the first workflow for a new tool/platform, ensure the `tool` artifact exists |
| `concept` | If the workflow embodies a named architectural pattern (e.g., "RAG pipeline", "agentic loop") |

## Extraction priorities

1. **The exemplar preserves the spec; the pattern preserves the structure.** A workflow spec in raw → exemplar artifact in distilled with verbatim content + metadata. Pattern extracted separately captures the *shape* (e.g., "n8n flow that bridges webhook → LLM → action with structured intermediate state").
2. **Capture the orchestration tools.** A workflow that uses Claude API + n8n + MCP gets `tools: [claude-opus-4-7, n8n, mcp]`. Wrappers retrieving on tool combinations need this.
3. **Identify the failure modes the workflow is designed against.** Many workflows exist *because* of a specific failure (rate limiting, ambiguity, drift). The `failure` artifact may already exist; cross-link via `relation: mitigates`.
4. **Modality reflects what the workflow ultimately produces.** A workflow that outputs images is `modality: [image, agentic]`. The agentic modality is always present for workflows; the output modality varies.

## Frontmatter defaults

```yaml
provenance:
  tier: personal-field | corroborated-community | official-doc   # depends on origin
  corroboration_count: 1
modality: [agentic, <output modality>]   # at least agentic
tools: [<all tools the workflow uses>]
abstraction_level: tool-specific | architectural   # depends on whether the workflow is portable
language: en | pl
```

For exemplar artifacts preserving workflow specs:

```yaml
type: exemplar
goal: "see a working <orchestration pattern> implementation in <tools used>"
keywords: [<orchestration pattern name>, <each tool involved>]
```

Long workflow JSONs (n8n flows >200 lines): keep the verbatim JSON in the raw
file; the exemplar's body summarizes structure and links to the raw via
`provenance.sources[].claim`. Don't duplicate the JSON in distilled.

## Body emphasis

For pattern bodies: `How it works` describes the orchestration shape; `Mechanism`
lists the tool-specific glue points; `Example` cites the exemplar.

For exemplar bodies: `## Notes` section explains what the workflow does and
under what conditions it works. The verbatim spec lives in raw; the exemplar's
job is to make the spec retrievable and explainable.

## Anti-patterns

- **Don't dump JSON into distilled.** Distilled is for explanations and metadata; raw is for the spec itself. Exemplar body links to raw.
- **Don't author a generic "agentic loop" pattern from one workflow.** A pattern needs evidence across multiple instantiations to claim generality. One workflow → one tool-specific pattern at most.
- **Don't ignore the workflow's failure model.** If the workflow has retry logic, error handling, fallback paths — those reveal failure modes worth extracting.
- **Don't skip the tools registry.** Every tool the workflow uses must exist in `taxonomy.md` §Tools. Authoring tool artifacts as a side effect is normal.

## Ripple expectations

Workflows ripple into tool profiles (each tool used gets evidence) and into
existing patterns (the workflow exemplifies them). Expect 3–6 ripples on top
of 3–8 new atomics. After several workflow ingests for the same orchestration
shape, consider authoring an `architectural`-level pattern that generalizes
across them.
