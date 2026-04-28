---
title: "Explainable Reasoning Trace (ERT)"
type: pattern
domains: [prompting, agentic-systems]
tags: [prompt-structure, knowledge-quality, agent-architecture]
confidence: high
confidence_rationale: "Backed by medical hallucination research (medRxiv), DeepHalluBench evaluation, and practitioner testing; addresses well-documented failure mode (premature synthesis)"
lifecycle: current
created: 2026-04-16
updated: 2026-04-16
evidence:
  - source: "raw/deep-research/Gemini Deep Research Context File Generation.md"
    sections: ["PR-03", "Section 7 point 5"]
    claim: "Explicit reasoning traces disrupt autoregressive token-likelihood generation, which is the primary cause of medical, scientific, and logical hallucinations in agentic models"
  - source: "raw/deep-research/Gemini Deep Research Context File Generation.md"
    sections: ["Source Ledger, Sources 11-12"]
    claim: "Academic evaluations (DeepHalluBench, medical hallucination research) demonstrate that ERT drastically reduces factual and causal errors"
  - source: raw/deep-research/gemini-deep-research.ctx.md
    sections: ["Failure Modes & Repair"]
    claim: "Mandate ERT: 'Before the final recommendation, generate a step-by-step reasoning trace: state assumptions, evaluate counter-arguments, quantify confidence'"
dedupe_key: "pattern:explainable-reasoning-trace-ert"
contradictions:
  - note: "ERT increases input token consumption and slows report generation. This is a known cost tradeoff — faster output without ERT risks premature synthesis, but ERT adds processing overhead. Use ERT for high-stakes analysis; omit for routine lookups."
    severity: tradeoff
    related_artifact: distilled/references/gemini-deep-research-parameters.md
see_also:
  - artifact: distilled/patterns/uncertainty-and-conflict-protocol.md
    relationship: "Complementary protocol — ERT forces reasoning, uncertainty protocol handles missing data"
  - artifact: distilled/failures/hallucinated-data-on-missing-evidence.md
    relationship: "ERT reduces hallucination by forcing explicit reasoning before conclusions"
  - artifact: distilled/references/gemini-deep-research-parameters.md
    relationship: "Platform where ERT is most impactful (high-stakes research synthesis)"
  - artifact: distilled/patterns/evidence-tiered-source-policy.md
    relationship: "Source tiers determine when ERT is worth the token cost tradeoff"
  - artifact: distilled/synthesis/universal-prompting-principles.md
    relationship: "Synthesis page that compiles ERT into universal principles"
supersedes: []
---

# Explainable Reasoning Trace (ERT)

## Pattern

Before producing final conclusions or recommendations, instruct the agent to
explicitly document its reasoning process: state assumptions, evaluate evidence
quality, consider counter-arguments, and quantify confidence levels.

## The Instruction

```
Before providing the final recommendation, generate a step-by-step reasoning
trace: state assumptions, evaluate counter-arguments, and quantify confidence
levels for each conclusion.
```

## Why It Works

### The Premature Synthesis Problem
Without ERT, agents use autoregressive token generation — each token is predicted
based on likelihood given previous tokens. This creates a "premature synthesis trap"
where the agent leaps to conclusions based on:
- Flawed intermediary logic
- Unverified causal links
- Pattern-matched training data rather than source evidence

ERT forces **System 2 thinking** — deliberate, step-by-step reasoning that disrupts
the default fast-pattern-matching mode. The agent must explicitly justify each
step before synthesizing, making logical gaps visible and auditable.

### Academic Evidence
- **Medical hallucination research** (medRxiv 2025): ERT reduces factual and causal
  errors in medical AI analysis
- **DeepHalluBench** (2026): identifies that agentic hallucination manifests in
  planning, source selection, and summarization phases — ERT addresses all three
  by making each phase explicit

## When to Use

- **Critical**: Due diligence, medical literature review, financial forecasting,
  complex strategic analysis
- **Recommended**: Any analysis where factual accuracy matters more than speed
- **Not needed**: Simple lookups, routine data extraction, creative tasks

## Tradeoff

ERT increases token consumption and slows output. For high-stakes analysis, the
cost is justified — premature synthesis in a financial or medical report can cause
real harm. For routine queries, ERT is overhead.

## Complementary Techniques

| Technique | What it adds |
|-----------|-------------|
| Uncertainty Protocol | Handles missing data ("Data Unavailable") |
| Conflict Resolution | Handles contradictory sources (document both) |
| Source Policy | Prevents garbage-in before reasoning begins |
| ERT | Forces transparent reasoning over available evidence |

Together, these form a complete quality chain: good sources → transparent
reasoning → honest uncertainty → documented conflicts.

## Related

- **[Uncertainty and Conflict Protocol](uncertainty-and-conflict-protocol.md)** — complementary protocol: ERT forces reasoning, uncertainty protocol handles missing data
- **[Hallucinated Data on Missing Evidence](../failures/hallucinated-data-on-missing-evidence.md)** — ERT reduces hallucination by forcing explicit reasoning before conclusions
- **[Gemini Deep Research Parameters](../references/gemini-deep-research-parameters.md)** — platform where ERT is most impactful (high-stakes research synthesis)
- **[Evidence-Tiered Source Policy](evidence-tiered-source-policy.md)** — source tiers determine when ERT is worth the token cost tradeoff
- **[Universal Prompting Principles](../synthesis/universal-prompting-principles.md)** — synthesis page compiling ERT into universal principles
