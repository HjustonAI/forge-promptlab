---
title: "Delta-Only Continuation"
type: pattern
domains: [prompting]
tags: [prompt-structure, prompt-transferability]
confidence: high
confidence_rationale: "Documented as mandatory practice in Veo3 with specific architectural explanation; generalizable to iterative workflows"
lifecycle: current
created: 2026-04-16
updated: 2026-04-16
evidence:
  - source: raw/deep-research/veo3.ctx.md
    sections: ["Leverage Points", "Failure Modes & Repair"]
    claim: "Extend via delta-only prompts — describe only what changes. Redescribing the existing scene forces full audio-visual realignment and breaks lip-sync continuity."
dedupe_key: "pattern:delta-only-continuation"
contradictions: []
see_also:
  - artifact: distilled/patterns/prompt-as-architectural-brief.md
    relationship: "The initial brief that delta-only continuations extend"
  - artifact: distilled/patterns/explicit-component-ordering.md
    relationship: "Ordering discipline that applies to continuation prompts"
  - artifact: distilled/references/veo3-production-parameters.md
    relationship: "Platform where delta-only continuation was first observed"
  - artifact: distilled/models/veo3.md
    relationship: "Compiled model profile that documents this pattern as architecturally required for Veo3"
  - artifact: distilled/synthesis/universal-prompting-principles.md
    relationship: "Synthesis page that compiles delta-only continuation into universal principles"
supersedes: []
---

# Delta-Only Continuation

## Pattern

When extending or continuing an AI-generated output, describe only what changes
in the next segment. Do not redescribe elements that already exist in the
established context.

## Why It Works

AI systems maintain internal state representations of what they've already generated.
When a continuation prompt redescribes existing elements, the system is forced to
realign its internal representation with the new description — even if the description
is identical. This realignment introduces discontinuities:

- **Video generation (Veo3)**: Audio desync, visual inconsistency at the cut point
- **Text generation**: Tone shifts, contradictions with established narrative
- **Code generation**: Style drift, inconsistency with existing patterns
- **Iterative design**: Visual style reset, loss of accumulated refinements

## Implementation

**Before (full redescription):**
```
[Extension prompt] A 72-year-old man in a black hoodie stands in a dark alley
with neon lights. He turns and walks away.
```

**After (delta-only):**
```
[Extension prompt] He turns and walks away toward the far end of the alley.
```

The subject, setting, lighting, and style are already established. The delta is
only the new action.

## General Principle

1. Establish the full context in the initial prompt
2. For continuations, reference only new actions, changes, or additions
3. Silence on existing elements signals "keep as-is" — which is what you want
4. If something must change, describe only the change: "Lighting shifts to warm amber"

## Transferability

This pattern generalizes beyond video generation:
- **Iterative code editing**: describe only what needs to change, not the whole file
- **Document revision**: specify modifications, not full rewrites
- **Multi-turn agent work**: provide new instructions, not full re-briefings
- **Image variation**: describe the delta from the current version

In all cases, the principle is the same: let the system preserve its accumulated
state rather than forcing it to reconstruct from scratch.

## Related

- **[Veo3 Prompting Profile](../models/veo3.md)** — compiled model profile that documents this pattern as architecturally required for Veo3
- **[Prompt as Architectural Brief](prompt-as-architectural-brief.md)** — the initial brief that delta-only continuations extend
- **[Explicit Component Ordering](explicit-component-ordering.md)** — ordering discipline that applies to continuation prompts
- **[Veo3 Production Parameters](../references/veo3-production-parameters.md)** — platform where delta-only continuation was first observed
- **[Universal Prompting Principles](../synthesis/universal-prompting-principles.md)** — synthesis page compiling delta-only continuation into universal principles
