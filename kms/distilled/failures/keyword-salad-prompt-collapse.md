---
title: "Keyword Salad Prompt Collapse"
type: failure
domains: [prompting]
tags: [prompt-anti-pattern, prompt-structure]
confidence: high
confidence_rationale: "Documented with specific mechanism in Midjourney V8; consistent with prompt-as-architectural-brief pattern observed across tools"
lifecycle: current
created: 2026-04-16
updated: 2026-04-16
evidence:
  - source: raw/deep-research/midjourney.ctx.md
    sections: ["Mental Model", "Failure Modes & Repair"]
    claim: "Keyword salads fracture the spatial model. 'Portrait, woman, neon, cyberpunk, highly detailed' gives the model six disconnected facts with no spatial relationships."
  - source: raw/deep-research/veo3.ctx.md
    sections: ["Mental Model"]
    claim: "Each spatial region actively searches the prompt for geometric, textural, and temporal guidance. If a region finds no specific instruction, it collapses to the statistical mean."
dedupe_key: "fail:keyword-salad-prompt-collapse"
contradictions:
  - note: "Keyword salads were effective in earlier diffusion models (V5-V6, early Stable Diffusion) using CLIP-based tag matching. V8's shift to literal execution made them harmful. Prompt techniques are not universally transferable across model versions."
    severity: context-dependent
    related_artifact: distilled/references/midjourney-v8-calibration.md
see_also:
  - artifact: distilled/patterns/explicit-component-ordering.md
    relationship: "The structural ordering that replaces keyword lists"
  - artifact: distilled/patterns/prompt-as-architectural-brief.md
    relationship: "Architectural briefs are the direct remedy for keyword salad"
  - artifact: distilled/references/midjourney-v8-calibration.md
    relationship: "Platform where keyword salad is most visibly harmful"
  - artifact: distilled/references/veo3-production-parameters.md
    relationship: "Platform that parses prompts syntactically, making keywords counterproductive"
  - artifact: distilled/models/veo3.md
    relationship: "Compiled model profile that documents this failure mode in Veo3 context"
  - artifact: distilled/synthesis/universal-prompting-principles.md
    relationship: "Synthesis page that compiles this failure into the universal anti-patterns table"
  - artifact: distilled/synthesis/model-comparison-matrix.md
    relationship: "Comparison matrix showing keyword salad impact across all four tools"
supersedes: []
---

# Keyword Salad Prompt Collapse

## Failure Mode

Comma-separated keyword lists ("portrait, woman, neon, cyberpunk, 8k, highly detailed,
trending on artstation") produce generic, spatially incoherent output in literal-execution
AI systems.

## Mechanism

Literal-execution models (Midjourney V8, Veo3) build internal spatial/semantic maps
from syntactic relationships in the prompt. Connected sentences establish relationships
between elements — which surfaces catch which light, where subjects stand relative to
each other, what texture a material has.

Keyword lists provide isolated facts with no relationships:
- "Portrait" — a genre, not a composition
- "Woman" — a subject, not positioned
- "Neon" — a light source, not placed
- "8k" — a resolution, not a quality characteristic
- "Highly detailed" — a vague modifier with no spatial target

The model receives six disconnected attention signals and attempts to satisfy all of
them simultaneously. The result: subject floating in a generic "vibe" with no spatial
coherence, lighting logic, or compositional structure.

## Why It Persists

Keyword salads were effective in earlier diffusion models (Midjourney V5-V6, early
Stable Diffusion) that used CLIP-based text encoders optimized for tag-level matching.
V8 and Veo3 use architectures that parse natural language syntactically, making keyword
lists not just ineffective but actively harmful.

## Repair

Rewrite keywords as connected sentences with explicit spatial relationships:

**Before**: "portrait, woman, neon, cyberpunk, 8k, highly detailed"
**After**: "A woman in a neon-lit cyberpunk district, sharp macro detail on
rain-soaked leather jacket. Single neon sign above camera-right, casting
teal light across her cheekbone."

Each sentence should load one directive: subject, lighting, medium, atmosphere.
Spatial relationships must be explicit: "from the left," "above," "casting onto."

## Generalizability

This failure extends beyond image/video generation. Any AI system that parses
prompts for structured execution (agentic workflows, research agents, orchestration
engines) performs worse with keyword-style input than with connected, relationship-rich
natural language.

## Related

- **[Veo3 Prompting Profile](../models/veo3.md)** — compiled model profile that documents this failure mode in Veo3 context
- **[Explicit Component Ordering](../patterns/explicit-component-ordering.md)** — the structural ordering that replaces keyword lists
- **[Prompt as Architectural Brief](../patterns/prompt-as-architectural-brief.md)** — architectural briefs are the direct remedy for keyword salad
- **[Midjourney V8 Calibration](../references/midjourney-v8-calibration.md)** — platform where keyword salad is most visibly harmful
- **[Veo3 Production Parameters](../references/veo3-production-parameters.md)** — platform that parses prompts syntactically, making keywords counterproductive
- **[Universal Prompting Principles](../synthesis/universal-prompting-principles.md)** — synthesis page compiling this failure into the universal anti-patterns table
- **[Model Comparison Matrix](../synthesis/model-comparison-matrix.md)** — comparison matrix showing keyword salad impact across all four tools
