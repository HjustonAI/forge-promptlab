# Forge Heart Wiki — Activity Log

Append-only record. Each entry: date, action type, details.

---

## [2026-04-16] system | Initial Build

Action: Created Forge Heart Wiki knowledge management system from zero.
Agent: distill-agent (claude-opus-4-6)
Operator: Bartosz Skokun

Files created:
- kms/policies.md — Quality gates, lifecycle rules, maintenance schedule
- kms/taxonomy.md — Controlled vocabulary v1 (6 domains, 18 tags)
- kms/index.md — Content catalog
- kms/log.md — This file

Decision rationale documented in OPERATOR.md.

---

## [2026-04-16] ingest | Forge Heart Wiki Idea File v1

Source: raw/idea-files/forge-heart-wiki-idea-v1.md
Mode: idea-file
Mode confidence: high

Artifacts produced:
- distilled/patterns/idea-file-as-knowledge-seed.md (high confidence)
- distilled/patterns/distill-first-architecture.md (high confidence)
- distilled/concepts/canonical-vs-projection-separation.md (high confidence)

Notes:
- Primary concept source for the system itself
- Extracted 3 transferable principles
- Noted philosophical divergence with Karpathy on canonical/projection separation

---

## [2026-04-16] ingest | Karpathy LLM Wiki Deep Research

Source: raw/deep-research/karpathy-llm-wiki-guide.md
Mode: deep-research
Mode confidence: high

Artifacts produced:
- distilled/concepts/wiki-vs-rag.md (high confidence)
- distilled/concepts/knowledge-compounding.md (high confidence)
- distilled/patterns/three-layer-knowledge-architecture.md (high confidence)
- distilled/references/llm-wiki-tool-ecosystem.md (medium confidence)

Notes:
- Rich source with architectural claims, tool references, historical context
- Knowledge compounding concept cross-referenced with idea-file source (dedupe: merged evidence, not split artifact)
- Tool ecosystem reference marked medium confidence — tools evolve, snapshot will age
- Noted design adaptation: Forge Heart Wiki modifies three-layer to two-layer with governance decomposition

---

## [2026-04-16] ingest | RAG vs Compiled Knowledge Field Observations

Source: raw/field-notes/rag-vs-compiled-knowledge-field-observation.md
Mode: field-note
Mode confidence: medium

Artifacts produced:
- distilled/failures/rag-cross-document-insight-loss.md (medium confidence)
- distilled/failures/confidence-decay-without-lifecycle.md (medium confidence)
- distilled/patterns/llm-maintenance-cost-shift.md (high confidence — corroborated by 2 other sources)

Notes:
- Observation 4 (tag entropy) not given own artifact — reinforces taxonomy policy already in place
- Failure artifacts marked medium confidence because evidence is synthesized/observational, not primary-source experimental
- LLM maintenance cost shift elevated to high confidence because Karpathy's claims and the idea file independently support the same conclusion

---

## [2026-04-16] quality | Dedupe Check — Initial Wave

Checked all 10 artifacts for overlap.

Overlap detected:
- knowledge-compounding.md and wiki-vs-rag.md both discuss compounding
  Resolution: Kept separate. wiki-vs-rag covers the architectural comparison; knowledge-compounding covers the mechanism and enabling conditions. Different dedupe_keys, complementary scope.

- distill-first-architecture.md and canonical-vs-projection-separation.md overlap on separation principle
  Resolution: Kept separate. distill-first is a pattern (how to build); canonical-vs-projection is a concept (what the principle means). Pattern references concept.

No merges required.

---

## [2026-04-16] quality | Contradiction Check — Initial Wave

Active contradictions noted:

1. **Karpathy's wiki-as-both-truth-and-surface vs Forge Heart Wiki's canonical/projection split**
   Artifact: distilled/patterns/distill-first-architecture.md
   Severity: philosophical-divergence
   Status: Acknowledged and documented. Not a factual error — a design choice difference.
   Resolution: Both approaches are valid for different scales. Karpathy's for single-user; Forge Heart Wiki's for multi-consumer.

2. **RAG nuance in wiki-vs-rag.md**
   Artifact: distilled/concepts/wiki-vs-rag.md
   Severity: nuance
   Status: Acknowledged. The artifact presents Karpathy's argument for wiki superiority but explicitly notes RAG advantages at large scale.

No unresolved factual contradictions.
