---
title: "Three-Layer Knowledge Architecture"
type: pattern
domains: [knowledge-management]
tags: [knowledge-architecture, ingest-pipeline]
confidence: high
confidence_rationale: "Karpathy's primary architectural contribution; implemented and validated in LLM Wiki"
lifecycle: current
created: 2026-04-16
updated: 2026-04-16
evidence:
  - source: raw/deep-research/karpathy-llm-wiki-guide.md
    sections: ["The Three-Layer Architecture"]
    claim: "Three distinct layers: raw sources (immutable), wiki (LLM-maintained), schema (configuration)"
  - source: raw/deep-research/karpathy-llm-wiki-guide.md
    sections: ["Indexing and Logging"]
    claim: "Index and log provide sufficient navigation and audit at moderate scale"
  - source: raw/deep-research/llm-wiki.ctx.md
    sections: ["Mental Model", "Leverage Points"]
    claim: "Full paste of idea file triggers full pattern — agent receives complete spec for all three layers and operations"
dedupe_key: "pattern:three-layer-raw-wiki-schema"
contradictions:
  - note: "Forge Heart Wiki modifies this to a two-layer model (raw + distilled) with governance files instead of a separate schema layer. The schema is absorbed into policies and taxonomy rather than being a standalone configuration document."
    severity: design-adaptation
    related_artifact: distilled/patterns/distill-first-architecture.md
see_also:
  - artifact: distilled/patterns/distill-first-architecture.md
    relationship: "Forge Heart's adaptation that modifies the three-layer model"
  - artifact: distilled/concepts/canonical-vs-projection-separation.md
    relationship: "Separation principle that the three-layer design enables"
  - artifact: distilled/concepts/knowledge-compounding.md
    relationship: "Architecture that enables systematic knowledge compounding"
  - artifact: distilled/references/llm-wiki-tool-ecosystem.md
    relationship: "Tools that operate within the three-layer architecture"
supersedes: []
---

# Three-Layer Knowledge Architecture

## Pattern (Karpathy's Original)

A knowledge system structured as three distinct layers, each with a clear owner:

### Layer 1: Raw Sources
- Immutable source documents (articles, papers, repos, data files)
- The LLM reads from them but never modifies them
- Source of truth for verification

### Layer 2: The Wiki
- LLM-generated markdown files (summaries, entity pages, concept pages, comparisons)
- The LLM owns this entirely — creates, updates, maintains cross-references
- Humans read it; the LLM writes it

### Layer 3: The Schema
- Configuration document telling the LLM how the wiki is structured
- Page conventions, frontmatter fields, workflows (ingest, query, lint)
- Co-evolved by human and LLM over time

## Why Three Layers

Each layer has a single responsibility:
- Raw: preserve original evidence
- Wiki: compile and maintain synthesized knowledge
- Schema: enforce consistency across sessions

Without the schema, every session starts from zero. Without raw sources, claims
can't be verified. Without the wiki, knowledge doesn't compound.

## Operations

Three operations map to the architecture:
1. **Ingest** — raw source → wiki updates (may touch 10-15 pages per source)
2. **Query** — read wiki → synthesize answer (good answers filed back as pages)
3. **Lint** — health check (contradictions, orphans, stale pages, missing concepts)

## Control Files

- **index.md** — content catalog; the LLM reads this first to navigate
- **log.md** — append-only chronological record of all activity

Karpathy claims index.md-based navigation works well up to ~100 sources and
hundreds of pages without needing embedding-based RAG infrastructure.

## Forge Heart Wiki Adaptation

This system adapts the three-layer pattern:
- Layer 1 (raw) → `kms/raw/` (unchanged)
- Layer 2 (wiki) → `kms/distilled/` (renamed, quality-gated, no consumer projection)
- Layer 3 (schema) → `kms/policies.md` + `kms/taxonomy.md` (decomposed into governance files)

The schema layer is decomposed because governance (quality gates, lifecycle rules)
and vocabulary (taxonomy, tags) serve different purposes and change at different rates.

## Related

- **[Distill-First Architecture](distill-first-architecture.md)** — Forge Heart's adaptation that modifies the three-layer model
- **[Canonical vs Projection Separation](../concepts/canonical-vs-projection-separation.md)** — separation principle that the three-layer design enables
- **[Knowledge Compounding](../concepts/knowledge-compounding.md)** — architecture that enables systematic knowledge compounding
- **[LLM Wiki Tool Ecosystem](../references/llm-wiki-tool-ecosystem.md)** — tools that operate within the three-layer architecture
