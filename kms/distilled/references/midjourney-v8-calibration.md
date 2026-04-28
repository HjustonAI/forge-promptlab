---
title: "Midjourney V8 Alpha Calibration Reference"
type: reference
domains: [tooling, prompting]
tags: [generative-tool, prompt-structure]
confidence: medium
confidence_rationale: "Single source (FORGE context file); V8 is in alpha — parameters may change; calibration values are empirical, not official"
lifecycle: current
created: 2026-04-16
updated: 2026-04-16
evidence:
  - source: raw/deep-research/midjourney.ctx.md
    sections: ["Calibration", "Operating Environment [EXTEND]", "Prompt Architecture [OVERRIDE]"]
    claim: "Empirical calibration data for V8 Alpha parameters and prompt structure"
dedupe_key: "ref:midjourney-v8-calibration-2026"
contradictions: []
see_also:
  - artifact: distilled/failures/keyword-salad-prompt-collapse.md
    relationship: "V8's literal execution makes keyword salad visibly harmful"
  - artifact: distilled/patterns/explicit-component-ordering.md
    relationship: "V8-specific ordering rules (--s, --sw, style anchors)"
  - artifact: distilled/references/veo3-production-parameters.md
    relationship: "Companion generative tool reference — shared prompting principles, different modality"
  - artifact: distilled/synthesis/universal-prompting-principles.md
    relationship: "Universal principles that MJ V8 implements tool-specifically"
  - artifact: distilled/synthesis/model-comparison-matrix.md
    relationship: "Comparison matrix with MJ V8 as one of four profiled tools"
supersedes: []
---

# Midjourney V8 Alpha Calibration Reference

Snapshot as of April 2026. V8 is in alpha — expect parameter evolution.

## Core Identity

V8 is a **literal executor**, not an artistic interpreter. V7 resolved ambiguity
with automatic aesthetic polish. V8 defaults to neutral, clinical, flat photorealism
when elements are unspecified. Every sentence is a physics directive.

## Prompt Length

40-80 words of text content (excluding parameter block). Each sentence loads
one distinct directive. Under 30 words: typically underspecified. Over 120 words:
typically redundant.

## --s (Stylize) Calibration

| Range | Use case |
|-------|---------|
| 50-100 | Documentary photography, technical product shots, text-heavy renders |
| 100-150 | Photorealistic portraits, editorial photography |
| 300-400 | Concept art, stylized illustration |
| 400-600 | 2D art, graphic design, painterly styles |
| 700+ | With --p only; high personalization, unpredictable aesthetics |

## --sw (Style Reference Weight)

Default to **50** in V8 (not 100). Default 100 is typically overpowering in V8's
literal architecture. Scale: 50 (subtle) → 100-400 (increasing override).

## --chaos

20-30 for initial ideation (compositional variance). 0 for style refinement and
final renders.

## --style raw

Default on for: photography, technical renders, text-heavy prompts.
Omit for: art, illustration workflows.

## Typography

Batch text in separate double-quote clusters, max 4 words each:
`"Welcome" "to the" "Midnight Diner"` — never `"Welcome to the Midnight Diner"`

Use `--style raw --s 50` for maximum typographic accuracy.

## Compute Tiers

| Tier | Cost | Notes |
|------|------|-------|
| Standard `--v 8` | 1x | 4-5x faster than V7. Relax mode available. Max AR 14:1 |
| `--hd` | 4x | Native 2K. Caps AR to 4:1. Non-reversible. Final render only |
| `--q 4` | 4x | Enhanced micro-detail and multi-subject coherence |
| `--hd --q 4` | 16x | Maximum fidelity. Disables Relax. Production renders only |

## Hard Constraints

- `--oref` and `--cref`: **Unsupported** in V8. Route to `--v 7`
- `--draft`: **Unsupported** in V8
- `--ar` max 4:1 with `--hd` (14:1 without)
- `--sref` and `--p mID`: **Mutually exclusive** — never in same prompt
- `--sv 6`: Legacy, 4x cost, errors with `--hd`/`--q 4`. Use default `--sv 7`
- Web Editor (Vary Region, Pan, Zoom): Runs on **V6.1** model — degrades V8 output

## Related

- **[Keyword Salad Prompt Collapse](../failures/keyword-salad-prompt-collapse.md)** — V8's literal execution makes keyword salad visibly harmful
- **[Explicit Component Ordering](../patterns/explicit-component-ordering.md)** — V8-specific ordering rules (--s, --sw, style anchors)
- **[Veo3 Production Parameters](veo3-production-parameters.md)** — companion generative tool reference: shared prompting principles, different modality
- **[Universal Prompting Principles](../synthesis/universal-prompting-principles.md)** — universal principles that MJ V8 implements tool-specifically
- **[Model Comparison Matrix](../synthesis/model-comparison-matrix.md)** — comparison matrix with MJ V8 as one of four profiled tools
