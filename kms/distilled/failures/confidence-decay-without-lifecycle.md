---
title: "Confidence Decay Without Lifecycle Management"
type: failure
domains: [knowledge-management, operations]
tags: [knowledge-quality, lifecycle-management]
confidence: medium
confidence_rationale: "Synthesized from operational patterns; mechanism is well-understood but specific evidence is observational"
lifecycle: current
created: 2026-04-16
updated: 2026-04-16
evidence:
  - source: raw/field-notes/rag-vs-compiled-knowledge-field-observation.md
    sections: ["Observation 2: Confidence Decay Without Lifecycle Management"]
    claim: "Users gradually lose trust when they cannot distinguish current from stale knowledge"
  - source: raw/idea-files/forge-heart-wiki-idea-v1.md
    sections: ["7) Quality constitution"]
    claim: "Lifecycle states required: current -> review-soon -> stale -> archived"
dedupe_key: "fail:confidence-decay-no-lifecycle"
contradictions: []
supersedes: []
---

# Confidence Decay Without Lifecycle Management

## Failure Mode

Knowledge systems without explicit freshness tracking cause users to gradually lose
trust in the system, regardless of whether the underlying knowledge is actually good.

## Mechanism

1. User receives a correct answer based on a stale source
2. Later, receives a contradictory answer from a current source
3. Without visible freshness metadata, user cannot resolve the conflict
4. User stops trusting either answer
5. System usage declines; knowledge investment is wasted

The decay is insidious because it's not caused by bad knowledge — it's caused by
the **inability to distinguish current knowledge from stale knowledge**.

## Repair

Implement explicit lifecycle states as visible, queryable metadata:

| State | Meaning | Signal to user |
|-------|---------|---------------|
| current | Recently verified, trustworthy | Use with confidence |
| review-soon | May be outdated, needs check | Use with caution |
| stale | Not verified recently | Do not rely on without verification |
| archived | Superseded or deprecated | Historical reference only |

### Implementation requirements:
1. Every artifact carries a `lifecycle` field and `updated` date
2. Automatic transition: `current` → `review-soon` after 90 days without update
3. Automatic transition: `review-soon` → `stale` after 180 days without review
4. Stale artifacts surfaced in lint/maintenance reports
5. Users can see lifecycle state when reading any artifact

## Severity

High for long-lived knowledge bases. Low for short-lived project documentation.

## Detection

Check: can a user of your knowledge system immediately see when a piece of knowledge
was last verified? If not, confidence decay is likely already happening.
