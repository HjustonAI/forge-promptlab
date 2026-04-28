---
title: "Explicit Component Ordering"
type: pattern
domains: [prompting]
tags: [prompt-structure, prompt-ordering]
confidence: high
confidence_rationale: "Documented architectural requirement in Veo3 (latent diffusion) and Midjourney V8 (spatial parser); structural evidence from Cowork and Gemini DR prompt architectures"
lifecycle: current
created: 2026-04-16
updated: 2026-04-16
evidence:
  - source: raw/deep-research/veo3.ctx.md
    sections: ["Prompt Architecture [OVERRIDE]"]
    claim: "Strict component sequence — deviating from this order increases failure probability: Camera → Subject → Action → Context → Style → Audio → Negatives"
  - source: raw/deep-research/midjourney.ctx.md
    sections: ["Prompt Architecture [OVERRIDE]"]
    claim: "V8 prompt structure in order: Subject → Action+Environment → Lighting → Medium/Lens → Atmosphere → Reference flags → Parameters"
  - source: raw/deep-research/claude-cowork.ctx.md
    sections: ["Prompt Architecture [OVERRIDE]"]
    claim: "Six-part structure: Goal State → File/Context Scope → Gate Clause → Execution Rules → Output Spec → Constraints"
  - source: raw/deep-research/gemini-deep-research.ctx.md
    sections: ["Prompt Architecture [OVERRIDE]"]
    claim: "Five mandatory parts in this order: Role → Task → Research Plan Scope → Source Policy → Uncertainty Protocol + Output Format"
dedupe_key: "pattern:explicit-component-ordering-prompts"
contradictions: []
see_also:
  - artifact: distilled/patterns/prompt-as-architectural-brief.md
    relationship: "The architectural pattern these ordering rules implement"
  - artifact: distilled/failures/keyword-salad-prompt-collapse.md
    relationship: "Failure that occurs when ordering is absent"
  - artifact: distilled/references/midjourney-v8-calibration.md
    relationship: "Tool-specific ordering rules for Midjourney V8"
  - artifact: distilled/references/veo3-production-parameters.md
    relationship: "Tool-specific ordering rules for Veo3"
  - artifact: distilled/models/veo3.md
    relationship: "Compiled model profile that applies this ordering pattern to Veo3"
  - artifact: distilled/synthesis/universal-prompting-principles.md
    relationship: "Synthesis page that compiles this ordering pattern into universal principles"
  - artifact: distilled/synthesis/model-comparison-matrix.md
    relationship: "Comparison matrix showing ordering differences across all four tools"
supersedes: []
---

# Explicit Component Ordering

## Pattern

Prompts to autonomous AI systems should follow a strict component order specific to
the tool's processing architecture. The order is not stylistic preference — it reflects
how the system parses and allocates attention to prompt elements.

## Why Order Matters

Modern AI systems process prompts sequentially, building internal representations
as they read. Early tokens establish spatial, semantic, or planning foundations that
later tokens modify. Disordering components forces the model to retroactively rewire
already-calculated representations, causing:

- **Generative models**: temporal hallucinations, prompt dropping, identity drift
- **Agent systems**: misallocated execution plans, wasted tool calls
- **Research agents**: shallow scope, poorly structured reports

## Documented Orderings

### Veo3 (Video Generation)
Camera → Subject → Action → Context → Style → Audio → Negatives
*Rationale*: Camera establishes spatial bounding box; subject fills it; everything
else modulates within those bounds. Audio is a separate latent pathway. Negatives
must be last to avoid mid-prompt parsing disruption.

### Midjourney V8 (Image Generation)
Subject → Action+Environment → Lighting → Medium/Lens → Atmosphere → References → Parameters
*Rationale*: Subject is the spatial anchor; lighting and medium are filters applied
to the established geometry; parameters are post-specification controls.

### Claude Cowork (Orchestration)
Goal State → Scope → Gate Clause → Execution Rules → Output Spec → Constraints
*Rationale*: Terminal state anchors the execution loop; scope limits the search space;
rules define the path; constraints prevent harm.

### Gemini Deep Research (Research Agent)
Role → Task → Scope → Source Policy → Uncertainty Protocol → Output Format
*Rationale*: Role sets analytical posture; scope shapes the research plan; policies
and protocols govern execution behavior.

## General Principle

Across tools, the ordering follows a consistent logic:

1. **Anchor** — what exists or what should be achieved (subject, goal, role)
2. **Scope** — where to operate and what to consider
3. **Modulation** — how to do it (style, rules, policies)
4. **Constraints** — what not to do (negatives, limits, exclusions)
5. **Output** — what the result should look like

## Tradeoff

Strict ordering adds cognitive load for prompt authors. The payoff is dramatically
better execution quality, especially for complex prompts. For simple single-purpose
prompts, ordering matters less.

## Related

- **[Veo3 Prompting Profile](../models/veo3.md)** — compiled model profile that applies this ordering pattern to Veo3
- **[Prompt as Architectural Brief](prompt-as-architectural-brief.md)** — the architectural pattern these ordering rules implement
- **[Keyword Salad Prompt Collapse](../failures/keyword-salad-prompt-collapse.md)** — failure that occurs when ordering is absent
- **[Midjourney V8 Calibration](../references/midjourney-v8-calibration.md)** — tool-specific ordering rules for Midjourney V8
- **[Veo3 Production Parameters](../references/veo3-production-parameters.md)** — tool-specific ordering rules for Veo3
- **[Universal Prompting Principles](../synthesis/universal-prompting-principles.md)** — synthesis page compiling this ordering pattern into universal principles
- **[Model Comparison Matrix](../synthesis/model-comparison-matrix.md)** — comparison matrix showing ordering differences across all four tools
