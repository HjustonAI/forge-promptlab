---
title: "Distill-First Architecture"
type: pattern
domains: [knowledge-management]
tags: [knowledge-architecture, knowledge-quality, ingest-pipeline]
confidence: high
confidence_rationale: "Core architectural principle of Forge Heart Wiki; logically derived from separation-of-concerns and tested in this implementation"
lifecycle: current
created: 2026-04-16
updated: 2026-04-16
evidence:
  - source: raw/idea-files/forge-heart-wiki-idea-v1.md
    sections: ["3) Core thesis", "4) Architecture shape"]
    claim: "Distill is the core platform; canonical knowledge is source of truth"
  - source: raw/idea-files/forge-heart-wiki-idea-v1.md
    sections: ["4) Architecture shape — C. Operational Views"]
    claim: "Projections are consumer-facing and compact; they are not the truth layer"
dedupe_key: "pattern:distill-first-over-projection-first"
contradictions:
  - note: "Karpathy's design treats the wiki layer as both truth and consumer surface. Forge Heart Wiki explicitly separates these concerns — canonical knowledge must not be shaped by consumer convenience."
    severity: philosophical-divergence
    related_artifact: distilled/patterns/three-layer-knowledge-architecture.md
see_also:
  - artifact: distilled/patterns/three-layer-knowledge-architecture.md
    relationship: "Distill-first adapts the three-layer model by separating canonical from projection"
  - artifact: distilled/concepts/canonical-vs-projection-separation.md
    relationship: "The core concept that distill-first architecture enforces"
  - artifact: distilled/concepts/wiki-vs-rag.md
    relationship: "Compiled knowledge approach that distill-first serves"
  - artifact: distilled/patterns/evidence-tiered-source-policy.md
    relationship: "Source trust policy that feeds into distill-first quality gates"
supersedes: []
---

# Distill-First Architecture

## Pattern

Build the canonical knowledge layer first and independently. All downstream consumers
(runtime cards, prompt overlays, dashboards, search interfaces) derive from canonical
artifacts — they never modify or constrain them.

## Core Rules

1. **Canonical is autonomous** — Distill does not know or care what consumers exist
2. **Consumers adapt to Distill** — never the reverse
3. **No runtime files inside Distill scope** — projections live outside the canonical layer
4. **Quality gates apply to canonical, not projections** — consumers bear their own quality burden

## Why This Matters

When a knowledge system optimizes for consumer convenience (e.g., structuring articles
to fit a specific UI widget), the canonical truth gets corrupted. Over time, the
"real" knowledge drifts toward what's easy to display rather than what's accurate.

Distill-first prevents this by enforcing a hard boundary: canonical artifacts have
one job (be correct, traceable, and maintained), and consumers have another
(present knowledge in context-appropriate formats).

## Tradeoff

Consumer teams must do their own transformation work. This adds friction compared to
a system where canonical artifacts are pre-shaped for consumption. The tradeoff is
worth it because canonical integrity compounds — a corrupted truth layer degrades
everything downstream, while a clean truth layer makes every consumer more reliable.

## Relationship to Karpathy's Design

Karpathy's wiki layer serves as both truth store and consumption surface. This works
for a single-user personal wiki. For multi-consumer systems (like Forge Heart Wiki,
which may feed into prompt systems, dashboards, and agent tools), explicit separation
is necessary to prevent canonical drift.

## Related

- **[Three-Layer Knowledge Architecture](three-layer-knowledge-architecture.md)** — distill-first adapts the three-layer model by separating canonical from projection
- **[Canonical vs Projection Separation](../concepts/canonical-vs-projection-separation.md)** — the core concept that distill-first architecture enforces
- **[Wiki vs RAG](../concepts/wiki-vs-rag.md)** — compiled knowledge approach that distill-first serves
- **[Evidence-Tiered Source Policy](evidence-tiered-source-policy.md)** — source trust policy that feeds into distill-first quality gates
