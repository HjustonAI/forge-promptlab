---
title: "Midjourney V8 — Prompting Profile"
type: model-profile
model_id: midjourney-v8
domains: [prompting, tooling]
tags: [generative-tool, prompt-structure, prompt-ordering]
confidence: medium
confidence_rationale: "Single primary source (midjourney.ctx.md); V8 is in alpha — parameters may shift; cross-model patterns validated across 4 sources"
lifecycle: current
created: 2026-04-16
updated: 2026-04-16
evidence:
  - source: raw/deep-research/midjourney.ctx.md
    sections: ["Calibration", "Operating Environment [EXTEND]", "Prompt Architecture [OVERRIDE]", "Mental Model", "Failure Modes & Repair"]
    claim: "Primary source for V8 Alpha architecture, parameters, and prompting model"
compiled_from:
  - distilled/references/midjourney-v8-calibration.md
  - distilled/patterns/prompt-as-architectural-brief.md
  - distilled/patterns/explicit-component-ordering.md
  - distilled/failures/keyword-salad-prompt-collapse.md
  - distilled/patterns/delta-only-continuation.md
dedupe_key: "model:midjourney-v8-prompting-profile"
contradictions:
  - note: "Keyword techniques effective in V5-V6 (CLIP-based) are harmful in V8 (literal execution). Prompt techniques are NOT transferable across MJ versions."
    severity: context-dependent
    related_artifact: distilled/failures/keyword-salad-prompt-collapse.md
see_also:
  - artifact: distilled/references/midjourney-v8-calibration.md
    relationship: "Atomic reference data compiled into this profile"
  - artifact: distilled/models/veo3.md
    relationship: "Companion generative model profile — shared principles, different modality"
  - artifact: distilled/synthesis/universal-prompting-principles.md
    relationship: "Cross-model principles that apply to MJ V8"
supersedes: []
---

# Midjourney V8 — Prompting Profile

This is a compiled artifact. It pre-digests knowledge from five atomic artifacts into one reader-ready page. A downstream wrapper should be able to read THIS ONE PAGE and know everything needed to compose prompts for Midjourney V8.

Snapshot as of April 2026. V8 is in alpha — expect parameter evolution.

---

## Model Identity

V8 is a **literal executor**, not an artistic interpreter. This is the single most important thing to understand about V8 and the sharpest break from V7.

V7 resolved ambiguity with automatic aesthetic polish — if you left something vague, V7 would fill in something "pretty." V8 does not do this. When elements are unspecified, V8 defaults to **neutral, clinical, flat photorealism**. It does not add artistic polish, cinematic flair, or compositional drama on its own. Every sentence you write is treated as a physics directive — a literal instruction about what exists, where it is, and what light hits it.

**Mental model**: You are writing a technical brief for a spatial rendering engine, not describing a scene to a human artist. The engine will build exactly what you specify. What you leave out stays empty. What you describe vaguely renders vaguely. There is no creative partner interpreting your intent — there is a compiler executing your specification.

This mental model converges with a broader principle observed across modern AI tools (Claude Cowork, Gemini Deep Research, Veo3): prompts to autonomous execution systems should be structured as architectural briefs — documents that define constraints, outcomes, and spatial/logical relationships — not as conversational requests or keyword wishlists.

---

## Prompt Architecture

### Component Ordering

V8 processes prompt tokens sequentially, building an internal spatial representation as it reads. Early tokens establish spatial foundations that later tokens modulate. Disordering components forces the model to retroactively rewire already-calculated representations, causing spatial incoherence, prompt dropping, and identity drift.

**Mandatory order for Midjourney V8:**

| Position | Component | Role |
|----------|-----------|------|
| 1 | **Subject** | Who or what — the spatial anchor. Everything else is positioned relative to this. |
| 2 | **Action + Environment** | What's happening and where. Establishes the scene geometry. |
| 3 | **Lighting** | Source, direction, quality, color temperature. Applied as a filter over the established geometry. |
| 4 | **Medium / Lens** | Camera type, lens, film stock, render style. Determines how the scene is captured. |
| 5 | **Atmosphere** | Mood, weather, texture, emotional register. The final modulation layer. |
| 6 | **Reference flags** | `--sref`, `--p`, style anchors. External constraints applied after scene construction. |
| 7 | **Parameters** | `--s`, `--ar`, `--style raw`, `--chaos`, etc. Post-specification controls. |

**Why this order matters**: Subject is the geometric anchor — the model needs to know what exists before it can light it, film it, or mood it. Lighting depends on surfaces existing. Medium/lens depends on composition existing. Atmosphere is the final tint applied to an already-constructed scene. Parameters are dials on the output, not inputs to the scene.

**General principle** (applies across all tools, not just MJ V8):

1. **Anchor** — what exists or what should be achieved (subject, goal, role)
2. **Scope** — where to operate and what to consider (environment, context)
3. **Modulation** — how to do it (lighting, style, rules, policies)
4. **Constraints** — what not to do (negatives, limits, exclusions)
5. **Output** — what the result should look like (parameters, format)

### Prompt Length

**Target: 40-80 words** of text content (excluding the parameter block after `--`).

- **Under 30 words**: Typically underspecified. V8 will fill gaps with flat, neutral defaults — not artistic choices, just emptiness.
- **40-80 words**: Sweet spot. Enough to load subject, environment, lighting, medium, and atmosphere with one sentence each.
- **Over 120 words**: Typically redundant. Competing directives dilute attention. The model tries to satisfy everything and satisfies nothing well.

### Structure Rules

1. **Each sentence = one directive.** One sentence for subject, one for lighting, one for medium, one for atmosphere. Do not pack multiple directives into a single sentence.
2. **Connected sentences with spatial relationships, NOT keyword lists.** Sentences should relate to each other spatially and logically. "A woman stands in a neon-lit alley" connects subject to environment. "Woman, neon, alley" does not.
3. **Spatial relationships must be explicit.** V8 does not infer spatial relationships. You must state them: "from the left," "above the subject," "casting onto the floor," "reflected in the puddle." If you don't say where the light comes from, V8 places it arbitrarily.

---

## Anti-Patterns

### Keyword Salad (Critical Failure)

**What it is**: Comma-separated keyword lists used as prompts. Example: `"portrait, woman, neon, cyberpunk, 8k, highly detailed, trending on artstation"`

**Why it fails in V8**: V8 builds an internal spatial model from syntactic relationships in your prompt. Connected sentences establish which surfaces catch which light, where subjects stand relative to each other, and what texture each material has. Keyword lists provide isolated facts with zero relationships:

- "Portrait" — a genre, not a composition
- "Woman" — a subject, not positioned anywhere
- "Neon" — a light source, not placed or directed
- "8k" — a resolution tag, not a quality characteristic V8 understands
- "Highly detailed" — a vague modifier with no spatial target

The model receives six disconnected attention signals and attempts to satisfy all of them simultaneously. The result: a subject floating in a generic "vibe" with no spatial coherence, no lighting logic, and no compositional structure.

**The mechanism**: Keyword lists create disconnected attention signals with no spatial binding. V8 parses natural language syntactically — it reads sentences, not tags. When it encounters a comma-separated list, each keyword pulls the spatial model in a different direction with no connective tissue. The result is the visual equivalent of noise.

**The historical trap**: Keyword salads **were effective** in Midjourney V5-V6 and early Stable Diffusion. Those systems used CLIP-based text encoders optimized for tag-level matching — they literally matched keywords to visual features. V8 uses a fundamentally different architecture that parses natural language syntactically. Techniques that worked in V5-V6 are not just ineffective in V8 — they are actively harmful. **Prompt techniques are NOT transferable across MJ versions.**

**Before (keyword salad)**:
```
portrait, woman, neon, cyberpunk, 8k, highly detailed
```

**After (architectural brief)**:
```
A woman in a neon-lit cyberpunk district, sharp macro detail on
rain-soaked leather jacket. Single neon sign above camera-right,
casting teal light across her cheekbone.
--s 100 --ar 2:3 --style raw
```

Each sentence loads one directive. Spatial relationships are explicit ("above camera-right," "casting teal light across her cheekbone"). The model knows exactly what to build and where to put it.

---

## Parameter Reference

### --s (Stylize) Calibration

Controls how much V8 applies its own aesthetic interpretation versus literal execution of your prompt.

| Range | Use Case | Notes |
|-------|----------|-------|
| **50-100** | Documentary photography, technical product shots, text-heavy renders | Maximum fidelity to prompt. Minimal model interpretation. |
| **100-150** | Photorealistic portraits, editorial photography | Slight aesthetic enhancement. Good default for photo work. |
| **300-400** | Concept art, stylized illustration | Noticeable model influence on composition and color. |
| **400-600** | 2D art, graphic design, painterly styles | Strong aesthetic override. Model takes significant creative liberty. |
| **700+** | With `--p` only; high personalization | Unpredictable aesthetics. Only use with a trained personal style model. |

### --sw (Style Reference Weight)

Default to **50** in V8 (not 100). The default of 100 is typically overpowering in V8's literal architecture — it will override your prompt directives in favor of the reference image.

| Value | Effect |
|-------|--------|
| **50** | Subtle style influence. Prompt directives still dominate. Recommended starting point. |
| **100-200** | Moderate to strong style transfer. Reference increasingly overrides prompt. |
| **200-400** | Heavy style override. Use only when you want the reference to dominate. |

### --chaos

Controls compositional variance across the four output images in a grid.

| Value | Use Case |
|-------|----------|
| **0** | Style refinement and final renders. All four images closely match prompt. |
| **20-30** | Initial ideation. Get compositional variety to explore directions. |
| **50+** | Extreme variation. Useful for breaking creative blocks, not for production. |

### --style raw

Disables V8's default aesthetic layer. The image will be technically accurate but visually flat without your explicit style directives.

- **Default ON for**: Photography, technical renders, text-heavy prompts. Gives you maximum control over the final look.
- **Omit for**: Art, illustration workflows where you want V8's aesthetic contribution.

### Typography

V8 can render text, but only with specific formatting:

- **Batch text in separate double-quote clusters**, max 4 words per cluster: `"Welcome" "to the" "Midnight Diner"`
- **Never** put long phrases in a single quote block: ~~`"Welcome to the Midnight Diner"`~~
- For maximum typographic accuracy, use `--style raw --s 50` — this minimizes model reinterpretation of letterforms.

### Compute Tiers

| Tier | Cost | Speed | AR Limit | Notes |
|------|------|-------|----------|-------|
| **Standard** `--v 8` | 1x | 4-5x faster than V7 | 14:1 | Relax mode available. Default for exploration. |
| **`--hd`** | 4x | Slower | **4:1** | Native 2K resolution. Non-reversible once applied. Final render only. |
| **`--q 4`** | 4x | Slower | 14:1 | Enhanced micro-detail and multi-subject coherence. |
| **`--hd --q 4`** | **16x** | Slowest | 4:1 | Maximum fidelity. Disables Relax mode. Production renders only. |

**Cost strategy**: Explore with standard → refine composition with `--q 4` → final render with `--hd --q 4`. Never start with 16x compute.

---

## Hard Constraints

These are non-negotiable limitations of V8 Alpha. Violating them will produce errors or degraded output.

| Constraint | Detail |
|------------|--------|
| **`--oref` and `--cref`** | **Unsupported** in V8. Object and character reference are V7 features. Route to `--v 7` if needed. |
| **`--draft`** | **Unsupported** in V8. |
| **`--ar` with `--hd`** | Maximum aspect ratio drops to **4:1** when `--hd` is active (14:1 without). |
| **`--sref` + `--p mID`** | **Mutually exclusive.** Style reference and personal model ID cannot appear in the same prompt. Pick one. |
| **`--sv 6`** | Legacy. 4x cost. Errors with `--hd` and `--q 4`. Use default `--sv 7`. |
| **Web Editor** | Vary Region, Pan, and Zoom run on the **V6.1 model**, not V8. Using the Web Editor on V8 output will degrade it to V6.1 quality. |

---

## Iteration Pattern

When extending or refining V8 output, use **delta-only continuation**: describe only what changes. Do not redescribe the full scene.

**Why**: V8 maintains an internal representation of the generated image. When you redescribe existing elements in a follow-up prompt, the model is forced to realign its internal state with the new description — even if the description is identical to what already exists. This realignment introduces visual discontinuities, style drift, and loss of accumulated refinements.

**Principle**:
1. Establish the full context in the initial prompt (use the full component ordering above)
2. For variations and refinements, describe **only** the change: "Lighting shifts to warm amber" or "Subject turns 30 degrees left"
3. Silence on existing elements signals "keep as-is" — which is exactly what you want
4. If something must change, describe only the change, not the whole scene

**Before (full redescription — causes drift)**:
```
A woman in a neon-lit cyberpunk district, sharp macro detail on
rain-soaked leather jacket. Single neon sign above camera-right,
casting teal light across her cheekbone. Change the lighting to warm.
```

**After (delta-only — preserves coherence)**:
```
Lighting shifts to warm amber from camera-left. Neon sign dimmed.
```

The subject, environment, jacket, and composition are already established. The delta describes only what moves.

---

## Prompt Template

A complete template structure that a wrapper can fill in. Each bracketed section corresponds to one sentence in the final prompt.

```
[Subject: who/what, physical description, position in frame]
[Action+Environment: what's happening, spatial context, surfaces]
[Lighting: source direction, quality (hard/soft/diffused), color temperature]
[Medium/Lens: camera system, focal length, film stock or render style]
[Atmosphere: mood, weather, ambient texture, emotional register]
--s [value] --ar [ratio] [--style raw if photo/tech] [--sref URL --sw 50 if style ref]
```

**Filled example**:
```
A weathered fisherman mending nets on a wooden dock, hands in sharp focus.
Morning fog rolls off a still harbor behind him, fishing boats blurred at distance.
Low sun from camera-left, golden hour warmth, hard shadows under the dock planks.
Shot on medium format, 80mm lens, Kodak Portra 400 grain.
Quiet, contemplative, salt air and peeling paint.
--s 100 --ar 3:2 --style raw
```

Six sentences. Six directives. Subject anchors the scene. Environment establishes geometry. Lighting is placed and directed. Medium defines the visual language. Atmosphere sets the emotional register. Parameters control output.

---

## Quick Decision Tree

```
Need character/object reference?  -->  Use --v 7 (--cref/--oref unsupported in V8)
Need Web Editor (Pan/Zoom/Vary)?  -->  Output will degrade to V6.1
Photography or technical render?  -->  --style raw ON, --s 50-150
Art or illustration?              -->  --style raw OFF, --s 300-600
Using a style reference?          -->  --sref URL --sw 50 (start at 50, not 100)
Using personal model?             -->  --p mID (cannot combine with --sref)
Exploring compositions?           -->  --chaos 20-30, standard compute
Final production render?          -->  --chaos 0, --hd --q 4
Text in image?                    -->  4 words max per quote cluster, --style raw --s 50
```

---

## Related

**Compiled from (atomic sources)**:
- **[Midjourney V8 Calibration](../references/midjourney-v8-calibration.md)** — atomic reference data for V8 parameters and calibration values
- **[Prompt as Architectural Brief](../patterns/prompt-as-architectural-brief.md)** — the cross-tool pattern that defines V8's prompting mental model
- **[Explicit Component Ordering](../patterns/explicit-component-ordering.md)** — the ordering principle and V8-specific component sequence
- **[Keyword Salad Prompt Collapse](../failures/keyword-salad-prompt-collapse.md)** — the critical anti-pattern and its V8-specific mechanism
- **[Delta-Only Continuation](../patterns/delta-only-continuation.md)** — the iteration pattern for extending V8 output without drift

**Companion profiles**:
- **[Veo3 Model Profile](veo3.md)** — companion generative model profile for video; shared prompting principles, different modality

**Synthesis**:
- **[Universal Prompting Principles](../synthesis/universal-prompting-principles.md)** — cross-model principles that apply to MJ V8 and all literal-execution systems
