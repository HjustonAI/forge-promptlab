---
title: "Canonical vs Projection Separation"
type: concept
domains: [knowledge-management]
tags: [knowledge-architecture, knowledge-quality]
confidence: high
confidence_rationale: "Established software architecture principle (single source of truth) applied to knowledge management; validated by this system's design"
lifecycle: current
created: 2026-04-16
updated: 2026-04-16
evidence:
  - source: raw/idea-files/forge-heart-wiki-idea-v1.md
    sections: ["4) Architecture shape"]
    claim: "Canonical Brain is source of truth; Operational Views are derived projections"
  - source: raw/idea-files/forge-heart-wiki-idea-v1.md
    sections: ["2) The mindset we take"]
    claim: "Wrappers adapt to Distill, never the reverse"
dedupe_key: "concept:canonical-projection-separation"
contradictions: []
supersedes: []
---

# Canonical vs Projection Separation

## What It Is

A knowledge architecture principle that divides a system into two distinct layers:

1. **Canonical layer** — the source of truth. Contains evidence-linked, quality-gated
   knowledge artifacts. Owned by the Distill process. Never shaped by consumer needs.

2. **Projection layer** — derived views for specific consumers. Runtime cards, prompt
   overlays, search indices, dashboard widgets. Created from canonical refs, not from
   raw sources. These are compact, context-specific, and disposable.

## Why the Separation Exists

Without separation, consumer convenience pressure corrupts canonical knowledge over time:
- Articles get shortened to fit UI constraints
- Nuance gets removed because dashboards can't display it
- Confidence levels get dropped because consumers want binary yes/no
- Evidence links get stripped because they clutter the consumer view

With separation, each layer optimizes for its own purpose:
- Canonical: accuracy, traceability, completeness
- Projection: usability, speed, context-appropriateness

## Analogy

This is the same principle as database normalization vs. materialized views.
The normalized schema (canonical) is the truth. Views (projections) are optimized
for specific query patterns. You don't denormalize the source schema because
one view needs a different shape.

## Implementation in Forge Heart Wiki

- `kms/distilled/` is the canonical layer
- Projections live outside `kms/` entirely, in consumer-specific locations
- Canonical artifacts carry full metadata; projections carry refs back to canonical
