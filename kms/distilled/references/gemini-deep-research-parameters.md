---
title: "Gemini Deep Research Operating Parameters"
type: reference
domains: [tooling, agentic-systems]
tags: [research-tool, agent-architecture]
confidence: high
confidence_rationale: "Two independent sources now confirm parameters; deeper source includes 49-item evidence ledger with official Google documentation"
lifecycle: current
created: 2026-04-16
updated: 2026-04-16
evidence:
  - source: raw/deep-research/gemini-deep-research.ctx.md
    sections: ["Calibration", "Operating Environment [EXTEND]"]
    claim: "Operating parameters and environment details for Gemini Deep Research"
  - source: "raw/deep-research/Gemini Deep Research Context File Generation.md"
    sections: ["Product Model Map", "Core Prompting Principles", "Source Ledger"]
    claim: "Detailed App vs API environment capabilities; 49 cited sources with trust-level classification; Gemini 3.1 Pro as underlying model confirmed"
dedupe_key: "ref:gemini-deep-research-parameters-2026"
contradictions: []
see_also:
  - artifact: distilled/patterns/explainable-reasoning-trace.md
    relationship: "ERT is most impactful inside Gemini DR's high-stakes research synthesis"
  - artifact: distilled/patterns/evidence-tiered-source-policy.md
    relationship: "Gemini DR's browsing patterns create the source tier challenges this policy addresses"
  - artifact: distilled/patterns/uncertainty-and-conflict-protocol.md
    relationship: "DR's multi-source synthesis requires explicit conflict handling"
  - artifact: distilled/synthesis/universal-prompting-principles.md
    relationship: "Universal principles that Gemini DR implements tool-specifically"
  - artifact: distilled/synthesis/model-comparison-matrix.md
    relationship: "Comparison matrix with Gemini DR as one of four profiled tools"
supersedes: []
---

# Gemini Deep Research Operating Parameters

Snapshot as of March 2026.

## Resource Envelope

- Up to **160 web search iterations** per task
- Up to **900k input tokens** consumed per task
- Estimated cost: **$3-5 per task** (API)
- Runs **asynchronously** — results are polled, not streamed

## Prompt Calibration

| Parameter | Guidance |
|-----------|---------|
| Length | 200-500 words for primary research prompt |
| Below 200 | Scope too thin for meaningful research plan |
| Above 500 | Over-constraining risk; may trigger safety filters |
| Tone | Imperative and professional ("Execute sub-searches targeting...") |
| Role | Specific expert persona ("You are an elite Due Diligence Analyst") |

## Mandatory Prompt Components

1. **Role** — specific expert persona
2. **Task** — one clear research objective
3. **Research Plan Scope** — numbered sub-search dimensions (highest leverage element)
4. **Source Policy** — whitelist + blacklist of source types + conflict protocol
5. **Uncertainty Protocol** — "If unavailable, state 'Data Unavailable'"
6. **Output Format** — Markdown with ## headers, comparison tables

## Scope Ordering

Most critical sub-topics first. Agent processes roughly in enumeration order.
**Truncation hits the final quartile** of long reports.

## Operating Environments

| Environment | Key features | Key constraints |
|------------|-------------|-----------------|
| **App** (gemini.google.com) | Research plan editable before execution; `@File` grounding; Canvas output | Session context pollution on thread re-use |
| **API** (Vertex AI / AI Studio) | `background=true` async; JSON schema output; `previous_interaction_id` for follow-ups | No UI affordances; strip @, "edit plan", "export" |

## Key Failure Modes

| Failure | Trigger | Mitigation |
|---------|---------|-----------|
| Boiling the ocean | Vague scope | Narrow to specific deliverables |
| SEO content drift | No source policy | Explicit whitelist + blacklist |
| Context pollution | Re-using broken thread | Start new session |
| Premature synthesis | No reasoning trace | Mandate ERT before conclusions |
| File suppresses web search | 300+ page upload | Explicit Phase 1 file → Phase 2 web → Phase 3 merge |
| Token degradation | Long reports | Front-load critical topics |
| Hallucinated statistics | No uncertainty protocol | "State 'Data Unavailable'" |
| Safety filter lock | Stacked negatives | Pair "Don't X" with "Instead do Y" |

## Related

- **[Explainable Reasoning Trace](../patterns/explainable-reasoning-trace.md)** — ERT is most impactful inside Gemini DR's high-stakes research synthesis
- **[Evidence-Tiered Source Policy](../patterns/evidence-tiered-source-policy.md)** — Gemini DR's browsing patterns create the source tier challenges this policy addresses
- **[Uncertainty and Conflict Protocol](../patterns/uncertainty-and-conflict-protocol.md)** — DR's multi-source synthesis requires explicit conflict handling
- **[Universal Prompting Principles](../synthesis/universal-prompting-principles.md)** — universal principles that Gemini DR implements tool-specifically
- **[Model Comparison Matrix](../synthesis/model-comparison-matrix.md)** — comparison matrix with Gemini DR as one of four profiled tools
