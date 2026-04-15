# Forge Heart Wiki — Index

System designed by Bartosz Skokun.
Last updated: 2026-04-16

## Patterns

- [Idea File as Knowledge Seed](distilled/patterns/idea-file-as-knowledge-seed.md) — Share ideas, not implementations; agents build locally (2 sources, high confidence)
- [Distill-First Architecture](distilled/patterns/distill-first-architecture.md) — Canonical knowledge is autonomous; consumers adapt to it (2 sources, high confidence)
- [Three-Layer Knowledge Architecture](distilled/patterns/three-layer-knowledge-architecture.md) — Raw → Wiki → Schema pattern from Karpathy (2 sources, high confidence)
- [LLM Maintenance Cost Shift](distilled/patterns/llm-maintenance-cost-shift.md) — LLMs solve the maintenance burden that kills human wikis (3 sources, high confidence)

## Concepts

- [Wiki vs RAG](distilled/concepts/wiki-vs-rag.md) — Compiled wiki beats RAG for cross-document synthesis at moderate scale (3 sources, high confidence)
- [Knowledge Compounding](distilled/concepts/knowledge-compounding.md) — Systems where each new source makes all existing knowledge more valuable (3 sources, high confidence)
- [Canonical vs Projection Separation](distilled/concepts/canonical-vs-projection-separation.md) — Truth layer must not be shaped by consumer convenience (2 sources, high confidence)

## Failures

- [RAG Cross-Document Insight Loss](distilled/failures/rag-cross-document-insight-loss.md) — RAG misses insights requiring synthesis across 3+ documents (2 sources, medium confidence)
- [Confidence Decay Without Lifecycle](distilled/failures/confidence-decay-without-lifecycle.md) — Users lose trust when they can't tell current from stale knowledge (2 sources, medium confidence)

## References

- [LLM Wiki Tool Ecosystem](distilled/references/llm-wiki-tool-ecosystem.md) — Tools for markdown-based knowledge systems as of April 2026 (1 source, medium confidence)

---

## Raw Sources

### idea-files/
- [forge-heart-wiki-idea-v1.md](raw/idea-files/forge-heart-wiki-idea-v1.md) — Bartosz Skokun's concept seed for Forge Heart Wiki

### deep-research/
- [karpathy-llm-wiki-guide.md](raw/deep-research/karpathy-llm-wiki-guide.md) — Antigravity.codes analysis of Karpathy's LLM Wiki idea file

### field-notes/
- [rag-vs-compiled-knowledge-field-observation.md](raw/field-notes/rag-vs-compiled-knowledge-field-observation.md) — Operational observations on RAG vs compiled knowledge

---

## Statistics

| Metric | Count |
|--------|-------|
| Raw sources | 3 |
| Canonical artifacts | 10 |
| — Patterns | 4 |
| — Concepts | 3 |
| — Failures | 2 |
| — References | 1 |
| High confidence | 7 |
| Medium confidence | 3 |
| Active contradictions noted | 2 |
| Lifecycle: current | 10 |
