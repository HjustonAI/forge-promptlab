---
title: "Veo3 — Prompting Profile"
type: model-profile
model_id: veo3
domains: [prompting, tooling]
tags: [generative-tool, prompt-structure, prompt-ordering]
confidence: medium
confidence_rationale: "Single primary source (veo3.ctx.md); Veo3 is actively evolving; cross-model patterns validated across 4 sources"
lifecycle: current
created: 2026-04-16
updated: 2026-04-16
evidence:
  - source: raw/deep-research/veo3.ctx.md
    sections: ["Calibration", "Operating Environment [EXTEND]", "Prompt Architecture [OVERRIDE]", "Mental Model"]
    claim: "Primary source for Veo3 architecture, audio syntax, parameters, and prompting model"
compiled_from:
  - distilled/references/veo3-production-parameters.md
  - distilled/patterns/prompt-as-architectural-brief.md
  - distilled/patterns/explicit-component-ordering.md
  - distilled/failures/keyword-salad-prompt-collapse.md
  - distilled/patterns/delta-only-continuation.md
dedupe_key: "model:veo3-prompting-profile"
contradictions: []
see_also:
  - artifact: distilled/references/veo3-production-parameters.md
    relationship: "Atomic reference data compiled into this profile"
  - artifact: distilled/models/midjourney-v8.md
    relationship: "Companion generative model profile — shared principles, different modality"
  - artifact: distilled/synthesis/universal-prompting-principles.md
    relationship: "Cross-model principles that apply to Veo3"
supersedes: []
---

# Veo3 — Prompting Profile

This is a compiled artifact. It pre-digests knowledge from five atomic artifacts into
a single reader-ready page. A downstream wrapper should read THIS ONE PAGE and know
everything needed to compose prompts for Veo3.

---

## Model Identity

Veo3 is a **3D latent diffusion engine** that processes video and audio latents jointly
in a single denoising pass. This is its defining architectural feature: audio is NOT
post-processing. Dialogue, sound effects, and ambience are denoised alongside video
in the same forward pass. This means audio quality and fidelity are directly controlled
by prompt syntax, not by a separate audio pipeline.

This makes Veo3 fundamentally different from image generators (Midjourney, DALL-E,
Stable Diffusion) and from video generators that add audio as a post-processing step.
Every prompt you write is simultaneously a video brief AND a sound design brief.

**Mental model**: You are writing a production brief for a virtual production engine with
integrated sound design. The engine processes your prompt by building a 3D spatial
representation: each spatial region in the output actively searches the prompt for
geometric, textural, and temporal guidance. If a region finds no specific instruction
for itself, it collapses to the statistical mean of its training data — producing
generic, flat, "AI-looking" output. Specificity is not optional; it is how you prevent
the model from defaulting to average.

---

## Prompt Architecture

### Mandatory Component Order

```
Camera -> Subject -> Action -> Context -> Style -> Audio -> Negatives
```

This order is not a suggestion. It reflects how the latent diffusion engine parses and
allocates attention to prompt elements. Deviating from this sequence increases failure
probability. Here is why each position matters:

1. **Camera** comes first because it establishes the spatial bounding box — the
   geometric frame within which everything else exists. Focal length, angle, and
   movement define the 3D volume the engine will populate.

2. **Subject** fills the bounding box. The engine needs to know what occupies the
   space before it can resolve how that thing moves, what surrounds it, or how
   light hits it.

3. **Action** defines temporal dynamics — what happens within the established
   spatial relationship between camera and subject.

4. **Context** (location, time of day, weather, set design) modulates the
   environment around the already-positioned subject.

5. **Style** (film stock, lighting style, director references) applies aesthetic
   filtering to the fully constructed scene.

6. **Audio** occupies a separate latent pathway from video. It reads the same prompt
   but routes through dedicated audio denoising. Placing audio tokens after the
   visual description ensures they don't interfere with spatial parsing.

7. **Negatives** must be last. Negative tokens mid-prompt disrupt the forward
   parsing flow, causing the engine to misallocate attention. Placing them at the
   end keeps the positive instruction stream clean.

### Prompt Length

**50-150 words per generation block.** This is a hard operating window, not a guideline.
Below 50 words, there is insufficient specificity for spatial regions to find their
instructions — they collapse to mean. Beyond 150 words, cross-attention overloads and
trailing constraints silently drop. The model does not warn you; it simply ignores
late-prompt tokens.

For multi-shot sequences, use **timestamp brackets** to segment shots within a single
prompt. Each bracketed segment should independently respect the 50-150 word budget.

### Structure Rules

Write prompts as **connected sentences with explicit spatial relationships**, not keyword
lists. Each sentence should load exactly one directive:

- One sentence for camera position and movement
- One sentence for subject appearance and placement
- One sentence for action and timing
- One sentence for environmental context
- One sentence for style reference
- Audio tokens in their dedicated syntax (see below)

**Spatial anchors must be explicit.** The engine does not infer spatial relationships
from context. Use directional language: "camera-left," "above the subject," "from behind,"
"receding into the background," "foreground," "casting light from the upper right."
If you don't specify where something is, the engine places it arbitrarily.

---

## Audio Syntax (Critical — Hard Routing)

This is unique to Veo3 among all models in the wiki. Audio is not a freeform description
— it uses specific syntax tokens that route content to the audio latent pathway.

| Audio Type | Syntax | Example |
|-----------|--------|---------|
| Dialogue | `[Character] [action] and says: "[text]."` | `He looks at camera and says: "The city always has a story."` |
| Sound effects | `SFX: [event]` | `SFX: glass shattering` |
| Ambient sound | `Ambient: [soundscape]` | `Ambient: distant sirens and rain` |

**CRITICAL**: The colon after `says` and the quotation marks around dialogue text are
**hard routing tokens** — they are not optional formatting or stylistic preference.
These punctuation marks are what tells the engine to route the enclosed tokens to the
audio denoising pathway instead of the video pathway. Omitting them causes one of two
failures:

1. **Subtitle artifacts**: Dialogue text appears as visible text overlaid on the video
   (the tokens were routed to the visual pathway and interpreted as text-to-render)
2. **Silence**: The audio pathway receives no tokens and generates nothing

The same applies to `SFX:` and `Ambient:` — the colon is the routing signal. Always
include it.

---

## Anti-Patterns

### Keyword Salad (Critical Failure Mode)

Comma-separated keyword lists ("cinematic, epic, neon, cyberpunk, 8k, highly detailed")
are actively harmful in Veo3. The mechanism:

Veo3's spatial regions search the prompt for geometric, textural, and temporal guidance
by parsing syntactic relationships between tokens. Connected sentences establish
relationships: which surfaces catch which light, where subjects stand relative to each
other, what texture a material has. Keyword lists provide isolated, disconnected signals
with no relationships between them. Each spatial region finds fragments that could apply
to it but no coherent instruction — so it collapses to the statistical mean.

The result: generic, flat, "AI-looking" output with no spatial coherence, no lighting
logic, and no compositional structure.

**Repair**: Rewrite keywords as connected sentences with explicit spatial relationships.

**Before** (broken):
```
portrait, woman, neon, cyberpunk, 8k, highly detailed
```

**After** (functional):
```
A woman in a neon-lit cyberpunk district, sharp macro detail on rain-soaked
leather jacket. Single neon sign above camera-right, casting teal light
across her cheekbone.
```

Note: keyword salads were effective in earlier diffusion models (Midjourney V5-V6, early
Stable Diffusion) that used CLIP-based tag matching. Veo3 and MJ V8 use architectures
that parse natural language syntactically, making keyword lists not just ineffective but
actively counterproductive.

### Vocabulary to Avoid

These words push output toward the training-data average (generic, indistinguishable
from thousands of other outputs):

`cinematic`, `epic`, `beautiful`, `stunning`, `amazing`, `breathtaking`, `masterpiece`

These are high-frequency tokens in Veo3's training data that carry almost zero
discriminative information. They map to the statistical centroid of "things people
called cinematic" — which is everything and therefore nothing specific.

### Negative Syntax

For negatives, use **`avoid`** only. Never use `no` or `don't` mid-prompt. The words
"no" and "don't" in the middle of a prompt disrupt the forward parsing flow. The engine
may attend to the forbidden concept rather than suppressing it. Place all negatives at
the end of the prompt using `avoid`:

```
Avoid: lens flare, motion blur, text overlays
```

---

## Style System

### Style Anchors

Named directors and cinematographers parse reliably as style anchors. The engine maps
these names to consistent visual characteristics from its training data:

- **Directors**: Wes Anderson (symmetry, pastel palette), Kurosawa (high contrast,
  dynamic composition), Kubrick (one-point perspective, cold lighting)
- **Genre anchors**: Film noir (high contrast, dutch angles, shadow play),
  French New Wave, neo-realism
- **Film stocks**: `Kodak 5219` (warm, cinema-standard), `Fuji Velvia` (saturated
  landscapes), `heavy 16mm grain` (documentary texture)

These are concrete reference points the engine can resolve to specific visual
characteristics. Compare with "beautiful cinematography" which resolves to nothing
specific.

### Quality Boosters

Tokens that reliably increase output quality by providing concrete technical specifications:

- `35mm lens` — standard cinematic focal length, natural perspective
- `macro photography` — triggers extreme detail rendering
- `commercial production style` — high-budget lighting and staging
- `shallow depth of field` — subject isolation, background blur
- `natural backlight` — rim lighting, depth separation
- `chiaroscuro lighting` — dramatic light-dark contrast

These work because they are specific technical descriptors that map to narrow distributions
in the training data, not vague quality adjectives.

### Anti-Plastic Vocabulary

Veo3's default output tends toward synthetic smoothness — the "AI look." Combat this
with analog imperfection tokens that inject texture and organic qualities:

- `heavy film grain` — breaks up smooth gradients
- `fog layer` — atmospheric depth, light scattering
- `bokeh halo` — optical imperfection around light sources
- `water droplets on lens` — surface texture, foreground depth
- `lens distortion` — barrel/pincushion, optical character
- `dust particles in light beam` — volumetric atmosphere

These tokens fight the model's tendency to produce clinically perfect, plasticky output
by steering it toward the analog-imperfection region of its latent space.

---

## Technical Parameters

| Parameter | Value |
|-----------|-------|
| Resolution | 720p / 1080p / 4K native |
| Aspect ratios | 16:9 and 9:16 (no post-crop needed) |
| Base generation block | 4-8 seconds |
| Max duration (stitching) | 60 seconds |
| Max duration (API) | 148 seconds |

---

## Operating Environments

| Environment | Use for | Key constraint |
|------------|---------|---------------|
| **Vertex AI API** | Production, benchmarking, batch | $0.40/s at 1080p, $0.60/s at 4K. Full prompt fidelity. No prompt rewriting. |
| **Google Flow / VideoFX** | Creative iteration, timeline editing | ~$19.99/mo. Scene Builder for shot-by-shot work. |
| **Gemini App** | **AVOID** | Applies system-level prompt rewriting that strips precise specifications. Your carefully ordered, spatially explicit prompt gets mangled before reaching the engine. |

**Environment selection matters for prompt fidelity.** The Vertex AI API passes your
prompt to the engine without modification. Google Flow provides a middle ground with
creative tools. The Gemini App rewrites your prompt, which defeats the entire purpose
of architectural prompting — avoid it for any work requiring precise control.

---

## Known Weaknesses

### Identity Drift at Extreme Angles
Camera angles exceeding 45 degrees from the initial reference cause progressive identity
drift — the subject's appearance shifts as the angle increases. **Repair**: Create a
Character Sheet with 3-4 reference views (front, profile, three-quarter, back) and
reference it in the prompt. This gives the engine multiple angle-specific anchors.

### No Physics Engine
Veo3 has no physics simulation. It generates motion by pattern-matching against training
data, not by computing physical interactions. This means:
- Explosive physics (debris trajectories, shockwaves) are visually incoherent
- Fluid dynamics (realistic water, smoke) are approximate at best
- Sequential force transfer (billiard balls, domino chains) fails because the engine
  cannot compute causality chains

**Workaround**: For physics-dependent shots, describe the visual result rather than the
physical process. Instead of "the ball bounces off the wall," describe "the ball
approaches the wall, then moves away at a sharp angle."

### Safety Filter Sensitivity
The safety filter is sensitive to specific vocabulary combinations even in benign prompts.
This can result in unexplained generation failures. There is no published vocabulary list;
mitigation is trial-and-error rephrasing.

---

## Iteration Pattern: Delta-Only Continuation

When refining or extending an existing generation, describe **ONLY what changes**. Do not
repeat the full prompt. This is not a convenience shortcut — it is architecturally required.

**Why**: Veo3 maintains internal state representations of what it has already generated.
When a continuation prompt redescribes existing elements, the engine is forced to realign
its internal representation with the new description — even if the description is
identical to the original. This forced realignment introduces:

- Audio desynchronization (lip-sync breaks)
- Visual discontinuity at the cut point
- Style drift from accumulated refinements

**Before** (full redescription — broken):
```
A 72-year-old man in a black hoodie stands in a dark alley with neon lights.
He turns and walks away.
```

**After** (delta-only — correct):
```
He turns and walks away toward the far end of the alley.
```

The subject, setting, lighting, and style are already established in the engine's
internal state. The delta prompt specifies only the new action. Silence on existing
elements signals "keep as-is" — which is exactly what you want.

**General rule**: Establish the full context in the initial prompt. For every continuation,
describe only new actions, changes, or additions. If something must change, describe
only the change: "Lighting shifts to warm amber."

---

## Prompt Template

Use this as a structural scaffold. Fill each bracketed section with connected sentences,
not keywords. Omit sections that don't apply to a given shot, but preserve the order
of sections you do use.

```
[Camera: angle, movement, lens — e.g., "Low-angle tracking shot, 35mm lens,
 pushing slowly toward the subject"]
[Subject: who/what, position, appearance — e.g., "A woman in her 30s, center
 frame, wearing a rain-soaked leather jacket"]
[Action: what's happening, movement, timing — e.g., "She turns to look over
 her shoulder, pausing mid-step"]
[Context: location, time of day, weather, set design — e.g., "Narrow alley
 in a rain-soaked city, late evening, wet cobblestones reflecting neon"]
[Style: film stock, lighting style, director reference — e.g., "Kodak 5219,
 chiaroscuro lighting, Ridley Scott"]
[Audio — Dialogue: She pauses and says: "I told you not to follow me."]
[Audio — SFX: rain hitting metal awning, distant thunder]
[Audio — Ambient: city hum, passing car on wet road]
[Avoid: lens flare, motion blur, text overlays, synthetic smoothness]
```

---

## Related

- **[Veo3 Production Parameters](../references/veo3-production-parameters.md)** — atomic reference data compiled into this profile
- **[Prompt as Architectural Brief](../patterns/prompt-as-architectural-brief.md)** — the paradigm underlying Veo3 prompting: prompts are production briefs, not descriptions
- **[Explicit Component Ordering](../patterns/explicit-component-ordering.md)** — cross-model ordering pattern; Veo3's Camera-to-Negatives sequence is one implementation
- **[Keyword Salad Prompt Collapse](../failures/keyword-salad-prompt-collapse.md)** — the failure mode that structured prompting prevents; especially harmful in Veo3
- **[Delta-Only Continuation](../patterns/delta-only-continuation.md)** — iteration pattern first documented in Veo3 workflows; architecturally required, not optional
