---
title: "Hallucinated Data on Missing Evidence"
type: failure
domains: [agentic-systems, prompting]
tags: [knowledge-quality, prompt-anti-pattern, agent-architecture]
confidence: high
confidence_rationale: "Documented as specific failure mode in Gemini Deep Research with named repair; well-known problem across AI systems"
lifecycle: current
created: 2026-04-16
updated: 2026-04-16
evidence:
  - source: raw/deep-research/gemini-deep-research.ctx.md
    sections: ["Failure Modes & Repair"]
    claim: "Agent can't find specific data but is driven to complete the plan; fabricates plausible-sounding metrics rather than admitting absence."
  - source: raw/deep-research/gemini-deep-research.ctx.md
    sections: ["Prompt Architecture [OVERRIDE]"]
    claim: "Mandatory: 'If specific data cannot be found, state Data Unavailable. Do not infer or estimate.'"
dedupe_key: "fail:hallucinated-data-missing-evidence"
contradictions: []
see_also:
  - artifact: distilled/patterns/uncertainty-and-conflict-protocol.md
    relationship: "Protocol that prevents hallucination by requiring 'Data Unavailable' declarations"
  - artifact: distilled/patterns/explainable-reasoning-trace.md
    relationship: "ERT forces explicit reasoning that exposes gaps before hallucination occurs"
  - artifact: distilled/failures/ambiguity-as-silent-execution.md
    relationship: "Silent execution on ambiguity is a trigger for hallucinated outputs"
  - artifact: distilled/patterns/evidence-tiered-source-policy.md
    relationship: "Tier enforcement prevents low-quality sources from masking evidence gaps"
  - artifact: distilled/synthesis/universal-prompting-principles.md
    relationship: "Synthesis page that compiles this failure into the universal anti-patterns table"
supersedes: []
---

# Hallucinated Data on Missing Evidence

## Failure Mode

When an AI agent cannot find specific data to complete a research plan or analysis,
it fabricates plausible-sounding statistics, dates, or figures rather than admitting
the data is unavailable.

## Mechanism

1. Agent builds a research/analysis plan that includes specific data points
2. During execution, some data points cannot be found from available sources
3. Agent has a completion drive — it is optimized to produce comprehensive output
4. Without explicit permission to say "unavailable," the agent fills gaps with
   plausible fabrications
5. Fabricated data is formatted identically to real findings
6. User cannot distinguish fabricated from genuine data without independent verification

## Why It's Dangerous

The hallucinated statistics are not random — they are *plausible*. The agent
generates figures that are consistent with nearby real data, making them
extremely difficult to detect. A report with 95% real data and 5% hallucinated
data is more dangerous than one with 50% hallucinations, because the user is
more likely to trust the whole document.

## Repair

### Explicit Uncertainty Protocol
Add to every research/analysis prompt:
```
If specific data cannot be found, state "Data Unavailable."
Do not infer, extrapolate, or estimate to fill the void.
```

### Why This Works
The agent needs **explicit permission to leave gaps**. Without it, the
completion drive overrides honesty. The protocol gives the agent a sanctioned
output format ("Data Unavailable") for missing data, removing the pressure
to fabricate.

### Complementary Measures
- **Explainable Reasoning Trace (ERT)**: "Before final recommendations, generate
  a step-by-step reasoning trace: state assumptions, evaluate counter-arguments,
  quantify confidence." Makes the agent's reasoning auditable.
- **Source citation requirement**: "Every factual claim must cite its source."
  Fabricated data has no source to cite, making it detectable.

## Severity

Critical for financial, medical, scientific, and strategic analysis. The
fabricated data looks correct, is formatted correctly, and sits alongside
real data — making it a trust-destroying failure when discovered.

## Related

- **[Uncertainty and Conflict Protocol](../patterns/uncertainty-and-conflict-protocol.md)** — protocol that prevents hallucination by requiring "Data Unavailable" declarations
- **[Explainable Reasoning Trace](../patterns/explainable-reasoning-trace.md)** — ERT forces explicit reasoning that exposes gaps before hallucination occurs
- **[Ambiguity as Silent Execution](ambiguity-as-silent-execution.md)** — silent execution on ambiguity is a trigger for hallucinated outputs
- **[Evidence-Tiered Source Policy](../patterns/evidence-tiered-source-policy.md)** — tier enforcement prevents low-quality sources from masking evidence gaps
- **[Universal Prompting Principles](../synthesis/universal-prompting-principles.md)** — synthesis page compiling this failure into the universal anti-patterns table
