---
title: "Ingest Pipeline — Raw Source to Typed Canonical Artifact"
type: pattern

# Discovery (qmd-critical)
tldr: "Transform a heterogeneous raw source (paper, system prompt, deep research, idea file, tool doc, workflow JSON) into atomic + compiled wiki artifacts via a 9-step ripple workflow: envelope → read → qmd-search neighbors → dedupe → atomic creation → ripple existing artifacts → recompile profiles/playbooks → index/log update → INDEX.json regen."
goal: "ingest a raw source into a typed canonical knowledge graph"
applicable_to_goals:
  - "ingest a deep research source"
  - "ingest a system prompt"
  - "ingest an idea file"
  - "ingest a tool documentation page"
  - "convert heterogeneous prompting research into queryable knowledge"
  - "build the meta-prompter's long-term memory"
keywords: [ingest, ingestion, pipeline, ripple, intake, distill, envelope, harvest, knowledge-graph]

# Orthogonal facets
modality: [agentic]
tools: [qmd, claude-code]
abstraction_level: architectural
language: en
domains: [knowledge-management, agentic-systems]
tags: [ingest-pipeline, knowledge-architecture, knowledge-compounding, knowledge-quality, ingestion-ripple]

# Provenance — tiered
provenance:
  tier: personal-field
  sources:
    - source: raw/idea-files/forge-heart-wiki-idea-v1.md
      sections: ["4) Architecture shape", "5) Operations"]
      claim: "Ingest is the core write path that turns raw heterogeneous sources into typed canonical artifacts"
    - source: raw/deep-research/karpathy-llm-wiki-guide.md
      sections: ["The Compounding Effect", "Three-Layer Architecture"]
      claim: "Compounding only happens if every source mutates the existing graph, not just appends to it"
  corroboration_count: 2
confidence: high
confidence_rationale: "Pattern is the operational backbone of this wiki; documented in CLAUDE.md and policies.md, observed empirically through Phase A-B implementation"

# Lifecycle
lifecycle: current
decay_triggers:
  - event: "qmd schema or MCP tool surface changes materially"
  - time_days: 180
created: 2026-04-29
updated: 2026-04-29

# Typed graph (v2 — both relation enum AND legacy relationship for v1 compatibility)
see_also:
  - artifact: distilled/patterns/distill-first-architecture.md
    relation: implements
    note: "Ingest is the write path that enforces the distill-first principle"
  - artifact: distilled/patterns/three-layer-knowledge-architecture.md
    relation: requires
    note: "Pipeline depends on the raw → distilled → compiled separation"
  - artifact: distilled/concepts/knowledge-compounding.md
    relation: enables
    note: "Compounding is the OUTCOME of disciplined ingest with ripple updates"
  - artifact: distilled/failures/rag-cross-document-insight-loss.md
    relation: mitigates
    note: "Ripple step prevents cross-document insights from being lost across silos"
  - artifact: distilled/patterns/idea-file-as-knowledge-seed.md
    relation: composes-with
    note: "Idea-file mode is one of nine source-mode pipelines"

dedupe_key: "pattern:ingest-pipeline-raw-to-canonical"
contradictions: []
supersedes: []
---

# Ingest Pipeline — Raw Source to Typed Canonical Artifact

## TL;DR

Ingest is the wiki's primary write path. A raw source — paper, system prompt,
deep-research output, tool doc, idea file, workflow JSON, field note — is
transformed into one or more typed canonical artifacts through a 9-step
workflow that rippes across the existing graph rather than just appending.
A correct ingest typically touches 5–15 existing pages; a single isolated
artifact created in vacuum is the failure mode this pattern explicitly
prevents.

## When to use

- A new file lands in `raw/<mode>/`
- A previously ingested source has been updated (re-ingest with delta)
- An external observation or field note needs to be canonicalized
- A leaked/published system prompt or workflow needs to be preserved as exemplar

## How it works

The pipeline runs as a structured 9-step skill (`.claude/skills/ingest/SKILL.md`)
loading the appropriate path-scoped rule file (`.claude/rules/ingest-<mode>.md`)
based on which `raw/<mode>/` subdirectory the source landed in.

Each ingest is **expensive on tokens by design** — qmd searches, multi-artifact
reads, ripple updates across the graph. This cost is amortized across thousands
of cheap reads later. The economic profile of the wiki is *expensive write,
cheap read*.

## Mechanism

The 9 steps, in order:

1. **Envelope** — create `<source>.envelope.md` sidecar capturing provenance: origin, origin_date, source_mode, language, ingested-by, mode-confidence.
2. **Read** — full read of the raw source. Identify extractable knowledge units (one source claim → one atomic artifact).
3. **qmd search neighbors** — run `qmd query "<topic>" --json` against distilled collections to discover existing artifacts in graph radius 1. Without this step, you create duplicates and orphans.
4. **Dedupe check** — for each proposed atomic, verify `dedupe_key` is unique against `INDEX.json`. Collision → either merge into existing or use `supersedes`.
5. **Create atomic artifacts** — each must pass all 8 quality gates (schema, provenance, confidence, freshness, dedupe, contradiction, cross-references, retrieval).
6. **Ripple existing artifacts** — for every existing artifact related to the new source: add a typed `see_also` entry, raise `corroboration_count` if the source confirms an existing claim, raise `confidence` where merited, note `contradictions` where the source disagrees.
7. **Recompile compiled artifacts** — any `profile` whose tool gained new mechanisms/patterns/failures/exemplars, any `playbook` whose `compiled_from` changed.
8. **Update envelope, index.md, log.md** — fill `artifacts_produced` and `artifacts_updated` in the envelope; add new entries to `index.md`; append the ingest event to `log.md`.
9. **Regenerate INDEX.json** — trigger lint skill (or async hook) to rebuild the machine-readable graph snapshot. qmd's `update` command runs alongside to refresh embeddings.

The ripple in step 6 is what distinguishes this pattern from naive append-only
ingestion. Skipping it produces the failure documented in
`distilled/failures/rag-cross-document-insight-loss.md` — knowledge accumulates
in silos, never compounds.

## Failure modes

- **Isolated-artifact ingest** — created the new atomic but touched nothing existing. Re-run step 3 with broader queries. If genuinely no neighbors exist, the source is in a new domain — note in log and proceed; otherwise the dedupe/ripple was incomplete.
- **Duplicate creation** — `dedupe_key` collision missed because step 3 was skipped or qmd was stale. Mitigated by hook `check-dedupe-key.sh`.
- **Schema mismatch** — frontmatter doesn't parse against `policies.md` schema. Mitigated by hook `validate-frontmatter.sh`.
- **Edited raw source** — raw layer must stay immutable. Mitigated by hook `block-raw-edits.sh`.
- **Stale compiled artifacts** — atomic changed but `profile`/`playbook` not recompiled. Caught by lint pass; ideally triggered automatically when `compiled_from` sources update.
- **Cross-reference rot** — new artifact has 2 typed `see_also` but existing artifacts weren't updated to link back. Mitigated by hook `enforce-min-crossrefs.sh` plus monthly lint pass for bidirectional verification.

## Example

A user drops `raw/deep-research/midjourney-v8-cref-deep-dive.md` (a Gemini deep-research output about Midjourney v8 character reference).

The pipeline runs:

1. Envelope: `source_mode: deep-research`, `language: en`, `origin: gemini-deep-research-2026-04-29`.
2. Read: identifies 4 extractable units — the `--cref` mechanism, a character-consistency pattern, a style-collapse failure, an example prompt.
3. `qmd query "midjourney character consistency" -c patterns,mechanisms,failures` — discovers `distilled/patterns/explicit-component-ordering.md` and `distilled/failures/keyword-salad-prompt-collapse.md`.
4. Dedupe: no `mech:midjourney-cref` exists. Clear.
5. Creates: `distilled/mechanisms/midjourney-cref.md`, `distilled/patterns/character-consistency-via-cref.md`, `distilled/failures/over-constraint-style-collapse.md`, `distilled/exemplars/midjourney-narrative-character.md`.
6. Ripple: adds `see_also` from the new pattern to `explicit-component-ordering` (relation: `composes-with`); raises corroboration on `keyword-salad-prompt-collapse` since the deep-research confirms it; updates `compiled/profiles/midjourney-v8.md` to register the new mechanism.
7. Recompile: regenerates the Midjourney v8 profile (was previously a stub).
8. Updates envelope `artifacts_produced` (4) and `artifacts_updated` (3); appends to `index.md` and `log.md`.
9. INDEX.json regenerated; `qmd update` refreshes the patterns/mechanisms/failures/exemplars collections.

Total touched: 7 artifacts (4 created, 3 updated). One source produced compounding ripples across the graph — that's the pattern working as designed.

## Related

- **[Distill-First Architecture](distill-first-architecture.md)** (implements) — Ingest is the write path that enforces the distill-first principle.
- **[Three-Layer Knowledge Architecture](three-layer-knowledge-architecture.md)** (requires) — Pipeline depends on the raw → distilled → compiled separation.
- **[Knowledge Compounding](../concepts/knowledge-compounding.md)** (enables) — Compounding is the OUTCOME of disciplined ingest with ripple updates.
- **[RAG Cross-Document Insight Loss](../failures/rag-cross-document-insight-loss.md)** (mitigates) — The ripple step prevents the silo failure that vanilla RAG suffers.
- **[Idea-File as Knowledge Seed](idea-file-as-knowledge-seed.md)** (composes-with) — Idea-file mode is one of nine source-mode pipelines.
