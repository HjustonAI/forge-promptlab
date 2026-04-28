---
title: "Wiki vs RAG for Knowledge Systems"
type: concept
domains: [knowledge-management]
tags: [knowledge-architecture, knowledge-compounding, ingest-pipeline]
confidence: high
confidence_rationale: "Core claim from Karpathy (primary source, 2026-04); supported by field observations on cross-document insight loss"
lifecycle: current
created: 2026-04-16
updated: 2026-04-16
evidence:
  - source: raw/deep-research/karpathy-llm-wiki-guide.md
    sections: ["Core Thesis: Wiki Beats RAG"]
    claim: "RAG re-derives knowledge on every query; wiki compiles once and keeps current"
  - source: raw/deep-research/karpathy-llm-wiki-guide.md
    sections: ["The Compounding Effect"]
    claim: "Cross-references are pre-built, contradictions pre-flagged, synthesis reflects everything processed"
  - source: raw/field-notes/rag-vs-compiled-knowledge-field-observation.md
    sections: ["Observation 1"]
    claim: "RAG-only systems miss insights requiring synthesis across 3+ documents"
  - source: raw/deep-research/llm-wiki.ctx.md
    sections: ["Leverage Points"]
    claim: "Full paste triggers full pattern — index.md format, operation definitions, workflow steps all become default behavior without re-explanation"
dedupe_key: "concept:wiki-vs-rag-knowledge-approach"
contradictions:
  - note: "RAG has advantages wiki lacks: handles unstructured queries over large corpora where pre-compilation is infeasible. This artifact captures Karpathy's argument for wiki superiority at moderate scale but does not claim RAG is universally inferior."
    severity: nuance
    related_artifact: null
see_also:
  - artifact: distilled/failures/rag-cross-document-insight-loss.md
    relationship: "Documents the specific failure mode that makes RAG inferior for cross-cutting synthesis"
  - artifact: distilled/concepts/knowledge-compounding.md
    relationship: "Wiki enables compounding that RAG cannot achieve"
  - artifact: distilled/patterns/distill-first-architecture.md
    relationship: "Distill-first is the architecture that implements wiki-over-RAG"
  - artifact: distilled/concepts/canonical-vs-projection-separation.md
    relationship: "Wiki maintains clean canonical layer; RAG collapses it with retrieval"
supersedes: []
---

# Wiki vs RAG for Knowledge Systems

## The Two Approaches

### RAG (Retrieval-Augmented Generation)
Upload documents. At query time, search for relevant chunks, feed them to the LLM,
generate an answer. Knowledge is re-derived on every question.

### Compiled Wiki
At ingest time, the LLM reads sources, extracts key information, and integrates it
into a persistent, interlinked wiki. At query time, the LLM reads pre-compiled
wiki pages. Knowledge is compiled once and kept current.

## Key Differences

| Dimension | RAG | Compiled Wiki |
|-----------|-----|--------------|
| When knowledge is processed | Query time (every question) | Ingest time (once per source) |
| Cross-references | Discovered ad-hoc per query | Pre-built and maintained |
| Contradictions | May not be noticed | Flagged during ingestion |
| Knowledge accumulation | None — starts fresh each query | Compounds with every source |
| Output durability | Ephemeral chat responses | Persistent markdown files |
| Maintenance | Automatic (black box) | Agent-maintained (transparent) |

## Where Wiki Wins

1. **Cross-document synthesis** — connections between sources are pre-built
2. **Contradiction detection** — conflicts are caught at ingest, not missed at query
3. **Compounding value** — every source and every query makes the system richer
4. **Transparency** — the knowledge base is human-readable and auditable

## Where RAG Wins

1. **Scale** — handles millions of documents without pre-compilation
2. **Low setup cost** — no ingest pipeline needed
3. **Unstructured queries** — works without a defined domain or taxonomy
4. **Speed to first answer** — no compilation step before querying

## Scale Boundary

Karpathy reports that index.md-based navigation works well at moderate scale
(~100 sources, ~hundreds of pages). Beyond that, search tools like qmd may be
needed. The wiki approach is best suited for curated, domain-specific knowledge
bases — not arbitrary document dumps.

## Related

- **[RAG Cross-Document Insight Loss](../failures/rag-cross-document-insight-loss.md)** — documents the specific failure mode that makes RAG inferior for cross-cutting synthesis
- **[Knowledge Compounding](knowledge-compounding.md)** — wiki enables compounding that RAG cannot achieve
- **[Distill-First Architecture](../patterns/distill-first-architecture.md)** — distill-first is the architecture that implements wiki-over-RAG
- **[Canonical vs Projection Separation](canonical-vs-projection-separation.md)** — wiki maintains clean canonical layer; RAG collapses it with retrieval
