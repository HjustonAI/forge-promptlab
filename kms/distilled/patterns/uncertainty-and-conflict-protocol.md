---
title: "Uncertainty and Conflict Protocol"
type: pattern
domains: [prompting, agentic-systems]
tags: [prompt-structure, knowledge-quality, agent-architecture]
confidence: high
confidence_rationale: "Documented as mandatory prompt component in Gemini DR; addresses a well-known failure mode (hallucinated statistics) with specific repair"
lifecycle: current
created: 2026-04-16
updated: 2026-04-16
evidence:
  - source: raw/deep-research/gemini-deep-research.ctx.md
    sections: ["Prompt Architecture [OVERRIDE]", "Failure Modes & Repair"]
    claim: "Mandatory uncertainty protocol: 'If specific data cannot be found, state Data Unavailable. Do not infer or estimate.' Without this, agent fabricates plausible-sounding metrics."
  - source: raw/deep-research/gemini-deep-research.ctx.md
    sections: ["Leverage Points"]
    claim: "Conflict resolution as analytical output: 'Document both estimates, cite methodologies, assess credibility based on recency and domain authority.'"
  - source: "raw/deep-research/Gemini Deep Research Context File Generation.md"
    sections: ["PR-04", "Section 4 — Managing Evidence of Absence"]
    claim: "Agents struggle with epistemic uncertainty. Autoregressive drive compels fabrication. Must distinguish 'absence of evidence' from 'evidence of absence.' Backed by DeepSearchQA benchmark (Google DeepMind)."
dedupe_key: "pattern:uncertainty-conflict-protocol"
contradictions: []
see_also:
  - artifact: distilled/failures/hallucinated-data-on-missing-evidence.md
    relationship: "The failure mode this protocol directly prevents"
  - artifact: distilled/patterns/explainable-reasoning-trace.md
    relationship: "Complementary technique — ERT forces reasoning, this protocol handles uncertainty"
  - artifact: distilled/failures/ambiguity-as-silent-execution.md
    relationship: "Related failure where agents execute on ambiguity instead of flagging conflict"
  - artifact: distilled/patterns/evidence-tiered-source-policy.md
    relationship: "Source tiers inform how conflicts between sources should be resolved"
  - artifact: distilled/synthesis/universal-prompting-principles.md
    relationship: "Synthesis page that compiles this protocol into universal principles"
supersedes: []
---

# Uncertainty and Conflict Protocol

## Pattern

Every prompt to an autonomous research or analysis agent must include explicit
instructions for how to handle two scenarios: (1) missing data, and (2) conflicting
data. Without these protocols, agents fabricate data or arbitrarily choose one
conflicting source.

## Uncertainty Protocol

**The instruction:**
```
If specific data cannot be found, state "Data Unavailable."
Do not infer, extrapolate, or estimate to fill the void.
```

**Why it's mandatory:** Research agents have a completion drive — they are optimized
to produce comprehensive reports. When data is genuinely unavailable, the agent
fabricates plausible-sounding statistics rather than leaving gaps. These hallucinated
statistics are indistinguishable from real findings without independent verification.

**The repair is simple but must be explicit:** the agent needs permission to say
"I don't know." Without that explicit permission, it defaults to fabrication.

## Conflict Protocol

**The instruction:**
```
If sources conflict on [topic]: document both, cite methodologies,
assess credibility — do not arbitrarily choose one.
```

**Why it's mandatory:** Agents smooth over contradictions by default — they pick the
more authoritative-seeming source or average the claims. This destroys the analytical
value of the contradiction itself, which is often more informative than either
individual claim.

**Conflict as output:** Instead of resolving contradictions, the agent maps them.
The resulting analysis shows where knowledge is contested, what methodologies
produced different results, and which source has stronger credibility. This is
more useful than a false consensus.

## Applicability Beyond Research Agents

These protocols apply to any AI system that produces factual claims:
- **Knowledge systems**: confidence levels and contradiction fields serve the same purpose
- **Code generation**: "If unsure about the API, check the docs rather than guessing"
- **Analysis**: "If data is incomplete, state what's missing rather than interpolating"

## Connection to Distill Quality Gates

The uncertainty protocol is the prompt-level equivalent of Distill's confidence
and contradiction quality gates. In both cases, the principle is the same:
**make the absence or conflict of evidence visible, not hidden.**

## Related

- **[Hallucinated Data on Missing Evidence](../failures/hallucinated-data-on-missing-evidence.md)** — the failure mode this protocol directly prevents
- **[Explainable Reasoning Trace](explainable-reasoning-trace.md)** — complementary technique: ERT forces reasoning, this protocol handles uncertainty
- **[Ambiguity as Silent Execution](../failures/ambiguity-as-silent-execution.md)** — related failure where agents execute on ambiguity instead of flagging conflict
- **[Evidence-Tiered Source Policy](evidence-tiered-source-policy.md)** — source tiers inform how conflicts between sources should be resolved
- **[Universal Prompting Principles](../synthesis/universal-prompting-principles.md)** — synthesis page compiling this protocol into universal principles
