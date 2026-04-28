---
title: "Veo3 Production Parameters Reference"
type: reference
domains: [tooling, prompting]
tags: [generative-tool, prompt-structure]
confidence: medium
confidence_rationale: "Single source (FORGE context file); Veo3 is actively evolving; pricing and capabilities may change"
lifecycle: current
created: 2026-04-16
updated: 2026-04-16
evidence:
  - source: raw/deep-research/veo3.ctx.md
    sections: ["Calibration", "Operating Environment [EXTEND]", "Prompt Architecture [OVERRIDE]"]
    claim: "Production parameters and operating environment for Veo3"
dedupe_key: "ref:veo3-production-parameters-2026"
contradictions: []
see_also:
  - artifact: distilled/failures/keyword-salad-prompt-collapse.md
    relationship: "Veo3's syntactic parsing makes keyword lists counterproductive"
  - artifact: distilled/patterns/explicit-component-ordering.md
    relationship: "Veo3-specific ordering: scene geography → action → audio → style"
  - artifact: distilled/references/midjourney-v8-calibration.md
    relationship: "Companion generative tool reference — shared prompting principles, different modality"
  - artifact: distilled/patterns/delta-only-continuation.md
    relationship: "Delta-only continuation pattern first observed in Veo3 workflows"
  - artifact: distilled/models/veo3.md
    relationship: "Compiled model profile that synthesizes this reference into a reader-ready page"
  - artifact: distilled/synthesis/universal-prompting-principles.md
    relationship: "Universal principles that Veo3 implements tool-specifically"
  - artifact: distilled/synthesis/model-comparison-matrix.md
    relationship: "Comparison matrix with Veo3 as one of four profiled tools"
supersedes: []
---

# Veo3 Production Parameters Reference

Snapshot as of March 2026.

## Core Architecture

Veo3 is a **3D latent diffusion engine** that processes video and audio latents
jointly in a single denoising pass. Audio is not post-processing — dialogue,
sound effects, and ambience are denoised alongside video.

## Prompt Length

50-150 words per generation block. Beyond this, cross-attention overloads and
trailing constraints drop. Multi-shot sequences use timestamp brackets per shot.

## Component Order (Mandatory)

Camera → Subject → Action → Context → Style → Audio → Negatives

## Audio Syntax (Hard Routing)

| Audio type | Syntax | Example |
|-----------|--------|---------|
| Dialogue | `[Character] [action] and says: "[text]."` | `He looks at camera and says: "The city always has a story."` |
| Sound effects | `SFX: [event]` | `SFX: glass shattering` |
| Ambient sound | `Ambient: [soundscape]` | `Ambient: distant sirens and rain` |

Colon and quotes in dialogue are **hard routing tokens** — not optional formatting.
Omitting them routes dialogue tokens to the visual pathway (subtitle artifacts or silence).

## Technical Parameters

- Resolution: 720p / 1080p / 4K native
- Aspect ratios: 16:9 and 9:16 (no post-crop needed)
- Base generation block: 4-8 seconds
- Max via stitching: 60s (148s via API)

## Style Anchors

Named directors/cinematographers parse reliably: Wes Anderson, film noir, Kurosawa.
Film stocks: `Kodak 5219`, `Fuji Velvia`, `heavy 16mm grain`.

## Quality Boosters

`35mm lens`, `macro photography`, `commercial production style`, `shallow depth of field`,
`natural backlight`, `chiaroscuro lighting`

## Anti-Plastic Vocabulary

Combat default synthetic smoothness with analog imperfections:
`heavy film grain`, `fog layer`, `bokeh halo`, `water droplets on lens`, `lens distortion`

## Operating Environments

| Environment | Use for | Key constraint |
|------------|---------|---------------|
| **Vertex AI API** | Production, benchmarking, batch | $0.40/s at 1080p, $0.60/s at 4K. Full prompt fidelity |
| **Google Flow / VideoFX** | Creative iteration, timeline editing | ~$19.99/mo. Scene Builder for shot-by-shot work |
| **Gemini App** | **Avoid** | Applies system-level prompt rewriting; strips precise specs |

## Vocabulary to Avoid

`cinematic`, `epic`, `beautiful`, `stunning`, `amazing` — push output to training average.
For negatives: use `avoid` only, never `no` or `don't` mid-prompt.

## Known Weaknesses

- Identity drift at camera angles >45° (repair: Character Sheet with 3-4 reference views)
- No physics engine — explosive physics, fluid dynamics, sequential force transfer fail
- Safety filter sensitive to specific vocabulary even in benign prompts

## Related

- **[Veo3 Prompting Profile](../models/veo3.md)** — compiled model profile that synthesizes this reference into a reader-ready page
- **[Keyword Salad Prompt Collapse](../failures/keyword-salad-prompt-collapse.md)** — Veo3's syntactic parsing makes keyword lists counterproductive
- **[Explicit Component Ordering](../patterns/explicit-component-ordering.md)** — Veo3-specific ordering: scene geography → action → audio → style
- **[Midjourney V8 Calibration](midjourney-v8-calibration.md)** — companion generative tool reference: shared prompting principles, different modality
- **[Delta-Only Continuation](../patterns/delta-only-continuation.md)** — delta-only continuation pattern first observed in Veo3 workflows
- **[Universal Prompting Principles](../synthesis/universal-prompting-principles.md)** — universal principles that Veo3 implements tool-specifically
- **[Model Comparison Matrix](../synthesis/model-comparison-matrix.md)** — comparison matrix with Veo3 as one of four profiled tools
