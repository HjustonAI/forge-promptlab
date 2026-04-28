---
title: "Model Comparison Matrix"
type: synthesis
domains: [prompting, tooling]
tags: [prompt-structure, prompt-ordering, generative-tool, research-tool, agent-architecture]
confidence: high
confidence_rationale: "Comparison compiled from high-confidence atomic artifacts with multi-source evidence"
lifecycle: current
created: 2026-04-16
updated: 2026-04-16
evidence:
  - source: raw/deep-research/midjourney.ctx.md
    sections: ["Mental Model", "Prompt Architecture [OVERRIDE]"]
    claim: "MJ V8 prompting architecture"
  - source: raw/deep-research/veo3.ctx.md
    sections: ["Mental Model", "Prompt Architecture [OVERRIDE]"]
    claim: "Veo3 prompting architecture"
  - source: raw/deep-research/gemini-deep-research.ctx.md
    sections: ["Mental Model", "Prompt Architecture [OVERRIDE]"]
    claim: "Gemini DR prompting architecture"
  - source: raw/deep-research/claude-cowork.ctx.md
    sections: ["Mental Model", "Prompt Architecture [OVERRIDE]"]
    claim: "Claude Cowork prompting architecture"
compiled_from:
  - distilled/references/midjourney-v8-calibration.md
  - distilled/references/veo3-production-parameters.md
  - distilled/references/gemini-deep-research-parameters.md
  - distilled/references/claude-cowork-architecture.md
  - distilled/patterns/explicit-component-ordering.md
  - distilled/patterns/prompt-as-architectural-brief.md
dedupe_key: "synth:model-comparison-matrix"
contradictions: []
see_also:
  - artifact: distilled/references/midjourney-v8-calibration.md
    relationship: "Full MJ V8 prompting profile"
  - artifact: distilled/references/veo3-production-parameters.md
    relationship: "Full Veo3 prompting profile"
  - artifact: distilled/references/gemini-deep-research-parameters.md
    relationship: "Full Gemini DR prompting profile"
  - artifact: distilled/references/claude-cowork-architecture.md
    relationship: "Full Claude Cowork prompting profile"
  - artifact: distilled/synthesis/universal-prompting-principles.md
    relationship: "Universal principles this matrix contextualizes per model"
supersedes: []
---

# Model Comparison Matrix

This is a pre-built comparison. A reader should be able to understand how all four profiled models differ at a glance, without reading each individual reference artifact. Every cell below is drawn from the atomic reference and pattern artifacts — this page adds no new claims, only compiles existing ones into comparison format.

---

## Overview Table

| Dimension | Midjourney V8 | Veo3 | Gemini Deep Research | Claude Cowork |
|-----------|--------------|------|---------------------|---------------|
| **Type** | Image generation | Video + audio generation | Autonomous research agent | Workflow orchestration engine |
| **Execution model** | Single-shot render | Single-shot render + multi-shot stitching | Multi-step async research (up to 160 web queries) | Multi-step sync execution with permanent side effects |
| **Core architecture** | Literal executor (spatial parser) | 3D latent diffusion engine (joint audio-video denoising) | Gemini 3.1 Pro with autonomous browsing | Desktop VM with filesystem access, tool routing, DCI |
| **Prompt length** | 40-80 words | 50-150 words per generation block | 200-500 words | Variable (goal-state framing; brevity preferred) |
| **Key ordering** | Subject, Action+Environment, Lighting, Medium, Atmosphere, References, Parameters | Camera, Subject, Action, Context, Style, Audio, Negatives | Role, Task, Research Plan Scope, Source Policy, Uncertainty Protocol, Output Format | Goal State, File/Context Scope, Gate Clause, Execution Rules, Output Spec, Constraints |
| **Unique feature** | --s / --sw calibration; --hd for native 2K; typography clustering | Joint audio-video denoising; dialogue/SFX/ambient hard routing syntax | 160-query research plans; editable plan before execution (App); 900k token budget | File handoff state machine; DCI (Dynamic Context Injection); multi-agent teams |
| **Critical anti-pattern** | Keyword salad (fractures spatial model) | Keyword salad + vague vocabulary ("cinematic," "epic") | No uncertainty protocol (hallucinated statistics) | No gate clause (immediate execution on ambiguity) |
| **Cost model** | Subscription + compute tiers (1x standard, 4x --hd, 16x --hd --q 4) | Per-second API ($0.40/s at 1080p, $0.60/s at 4K) or subscription (~$19.99/mo Flow) | ~$3-5 per task (API) | Token-based (subagents cheap; full agent teams expensive) |
| **Confidence** | Medium (V8 is alpha; parameters may change) | Medium (actively evolving; pricing and capabilities shifting) | High (2 independent sources; 49-item evidence ledger) | Medium (single source; Cowork actively evolving) |

---

## Component Ordering Comparison

The universal 5-step ordering pattern (Anchor, Scope, Modulation, Constraints, Output) maps to each tool's specific prompt architecture. This table shows exactly how.

| Universal Step | Function | Midjourney V8 | Veo3 | Gemini Deep Research | Claude Cowork |
|---------------|----------|---------------|------|---------------------|---------------|
| **1. Anchor** | What exists / what to achieve | Subject | Camera, Subject | Role | Goal State |
| **2. Scope** | Where to operate, what to consider | Action + Environment | Action, Context | Task, Research Plan Scope | File/Context Scope |
| **3. Modulation** | How to do it | Lighting, Medium/Lens, Atmosphere | Style | Source Policy | Execution Rules |
| **4. Constraints** | What not to do | Reference flags (--sref, --p) | Audio (separate pathway), Negatives | Uncertainty Protocol | Gate Clause, Constraints |
| **5. Output** | What result looks like | Parameters (--s, --sw, --ar, --hd) | (implicit in style/negatives) | Output Format (Markdown, tables) | Output Spec (file format, naming) |

**Why order matters per tool:**
- **MJ V8:** Subject is the spatial anchor. Lighting and medium are filters applied to the established geometry. Parameters are post-specification controls. Wrong order = prompt dropping, identity drift.
- **Veo3:** Camera establishes the spatial bounding box. Subject fills it. Everything else modulates within those bounds. Audio is a separate latent pathway and must not be interleaved with visual tokens. Negatives must be last to avoid mid-prompt parsing disruption.
- **Gemini DR:** Role sets analytical posture. Scope shapes the research plan (highest leverage element — agent processes roughly in enumeration order). Policies and protocols govern execution behavior. Truncation hits the final quartile of long reports, so front-load critical topics.
- **Claude Cowork:** Terminal state anchors the execution loop. Scope limits the search space. Gate clause prevents premature execution. Rules define the path. Constraints prevent harm.

---

## Prompt Language Comparison

How each model handles natural language vs. keyword input, and what vocabulary matters.

| Dimension | Midjourney V8 | Veo3 | Gemini Deep Research | Claude Cowork |
|-----------|--------------|------|---------------------|---------------|
| **Language style** | Connected sentences; one directive per sentence | Connected sentences; explicit spatial relationships | Imperative professional prose | Programmatic imperatives ("Write to /path") |
| **Keyword tolerance** | Harmful — fractures spatial model | Harmful — regions collapse to statistical mean | Reduces scope quality | Produces shallower execution plans |
| **Vocabulary to avoid** | N/A (all words literal) | "cinematic," "epic," "beautiful," "stunning" (push to training average) | Vague scope language ("look into," "explore") | Polite/conversational framing ("please," "could you") |
| **Vocabulary that helps** | Spatial prepositions ("from the left," "above," "casting onto") | Named directors/DPs, film stocks ("Kodak 5219," "Fuji Velvia"), analog imperfections | Specific deliverables, numbered sub-dimensions | Goal-state framing ("I want X so that Y") |
| **Negative syntax** | Not applicable (no native negative support) | "avoid [thing]" only; never "no" or "don't" mid-prompt | "Exclude: [source types]" | "Do not [explicit prohibition]" |

---

## Operating Environment Comparison

| Dimension | Midjourney V8 | Veo3 | Gemini Deep Research | Claude Cowork |
|-----------|--------------|------|---------------------|---------------|
| **Primary interface** | Discord bot / web app | Vertex AI API / Google Flow (VideoFX) | gemini.google.com (App) / Vertex AI (API) | Desktop GUI (solo) / CLI (multi-agent) |
| **Avoid** | Web Editor (runs V6.1, degrades V8) | Gemini App (rewrites prompts; strips precise specs) | Re-using broken threads (context pollution) | Session restart without context.md |
| **Iteration model** | Remix / --chaos for ideation, then refine | Delta-only continuation; timestamp brackets for multi-shot | Follow-up via previous_interaction_id (API) or thread (App) | File handoff between sessions; context.md persistence |
| **Max output** | Single image (up to native 2K with --hd) | 60s video (stitching); 148s via API | Multi-section Markdown report | Filesystem changes, tool calls, code execution |
| **Async?** | No (fast render, 4-5x faster than V7) | No (single-shot generation) | Yes (results polled, not streamed) | No (synchronous execution with live output) |

---

## Calibration Parameters Side-by-Side

### Midjourney V8 Key Parameters

| Parameter | Range | Use case |
|-----------|-------|----------|
| --s (Stylize) | 50-100: documentary/technical; 100-150: photorealism; 300-400: concept art; 400-600: painterly; 700+: --p only | Controls aesthetic interpretation vs. literal execution |
| --sw (Style Ref Weight) | Default 50 in V8 (not 100); 50: subtle; 100-400: increasing override | Weights style reference influence |
| --chaos | 20-30: ideation; 0: refinement | Compositional variance |
| --style raw | On for photography/technical; off for art | Disables aesthetic filtering |
| --hd | 4x cost; caps AR to 4:1 | Native 2K; final renders only |
| --q 4 | 4x cost | Enhanced detail and multi-subject coherence |

### Veo3 Key Parameters

| Parameter | Value | Notes |
|-----------|-------|-------|
| Resolution | 720p / 1080p / 4K | Native, no post-crop needed |
| Aspect ratios | 16:9 and 9:16 | Only two supported |
| Base block | 4-8 seconds | Single generation |
| Max via stitching | 60s (148s API) | Multi-shot with timestamp brackets |
| Dialogue syntax | `[Character] [action] and says: "[text]."` | Colon and quotes are hard routing tokens |
| SFX syntax | `SFX: [event]` | Routes to audio pathway |
| Ambient syntax | `Ambient: [soundscape]` | Routes to audio pathway |

### Gemini Deep Research Key Parameters

| Parameter | Value | Notes |
|-----------|-------|-------|
| Web queries | Up to 160 | Per task |
| Input tokens | Up to 900k | Per task |
| Cost | ~$3-5 | Per task (API) |
| Prompt length | 200-500 words | Below 200: too thin; above 500: over-constraining |
| Mandatory components | 6 | Role, Task, Scope, Source Policy, Uncertainty Protocol, Output Format |

### Claude Cowork Key Parameters

| Parameter | Guidance | Notes |
|-----------|----------|-------|
| Tone | Programmatic, imperative | "Write to /path" not "Please create a file" |
| Framing | "I want X so that Y" | Goal-state dramatically outperforms step enumeration |
| Output naming | Always specify | Convention: YYYY-MM-DD_ProjectName_v1.ext |
| Multi-agent | Token-expensive | Reserve for genuine debate or multi-disciplinary synthesis |
| State persistence | context.md | Read on boot, append before close |

---

## Failure Mode Comparison

Each tool has characteristic failure modes. This table shows which anti-patterns hit which tools hardest.

| Failure Mode | MJ V8 | Veo3 | Gemini DR | Cowork | Universal? |
|-------------|--------|------|-----------|--------|------------|
| **Keyword salad** | Critical (fractures spatial model) | Critical (regions collapse to mean) | Moderate (shallower research) | Moderate (weaker plans) | Yes — harms all tools |
| **Ambiguity as silent execution** | Medium (wrong "vibe" generated) | Medium (wrong scene, compute wasted) | High (160 queries wasted on wrong scope) | Critical (filesystem changes on wrong interpretation) | Yes — all autonomous tools |
| **Hallucinated data** | N/A (no factual claims) | N/A (no factual claims) | Critical (plausible fake statistics) | Medium (QA hallucination in analysis) | Agent systems only |
| **Outcome-driven constraint violation** | N/A | N/A | High (ignores safety under strong KPI) | High (recommends harmful actions to meet goal) | Agent systems only |
| **Vague vocabulary** | Low (V8 defaults to neutral, not "cinematic") | Critical ("cinematic" pushes to training average) | Low | Low | Generative models, especially Veo3 |
| **Context pollution** | N/A | N/A | Critical (broken thread degrades all subsequent queries) | Medium (session restart loses state) | Agent systems |
| **Identity drift** | Low | High (camera angles >45 degrees) | N/A | N/A | Video generation |

---

## Which Model for Which Task

| Task | Best model | Why |
|------|-----------|-----|
| Static image (photo/art) | **MJ V8** | Highest image quality; direct parameter control (--s, --sw, --hd); fast iteration |
| Video with dialogue | **Veo3** | Only model with joint audio-video denoising; hard-routed dialogue syntax |
| Video without dialogue | **Veo3** | SFX and ambient audio in same denoising pass; timestamp brackets for multi-shot |
| Deep research / analysis | **Gemini DR** | 160-query capacity; structured research plans; async execution for complex topics |
| Competitive analysis | **Gemini DR** | Multi-source synthesis with conflict handling; source policy enforcement |
| Code / workflow execution | **Claude Cowork** | Direct filesystem access; permanent side effects; tool integration via DCI |
| Multi-agent debate | **Claude Cowork** | Named roles, lateral communication, Devil's Advocate designation |
| Multi-shot video (up to 60s) | **Veo3** | Timestamp brackets; stitching; delta-only continuation preserves audio sync |
| Technical product shots | **MJ V8** | --style raw --s 50 for maximum literal accuracy; --hd for native 2K |
| Typography / text in images | **MJ V8** | Double-quote clustering technique; --style raw for typographic accuracy |

---

## Modality Differences

### Generative Models (MJ V8, Veo3)

These systems process prompts as spatial/temporal blueprints:
- Every word maps to a geometric, textural, or temporal attribute
- Ordering directly controls how the internal spatial map is constructed
- Visual vocabulary matters: specific film stocks, lens types, and lighting directions produce specific results; vague adjectives produce generic output
- No factual claims are produced, so uncertainty protocols and ERT are not applicable
- The primary failure mode is spatial/temporal incoherence from poorly structured prompts

### Agent Systems (Gemini DR, Cowork)

These systems process prompts as execution plans:
- The prompt defines a goal and constraints; the agent builds a multi-step plan
- Ordering affects resource allocation — early components get more search budget (Gemini DR) or deeper planning (Cowork)
- Safety protocols are critical: uncertainty handling, conflict resolution, and explicit constraints prevent fabrication and harmful recommendations
- Side effects are real: web queries consume budget, file writes are permanent, recommendations may be acted upon
- The primary failure mode is execution on wrong interpretation with confident-looking wrong output

### Hybrid Considerations

When a workflow spans both modality types (e.g., research a topic with Gemini DR, then generate imagery with MJ V8 based on findings):
- Apply agent-system principles (uncertainty protocol, source tiering, ERT) to the research phase
- Apply generative-model principles (component ordering, spatial language, specific vocabulary) to the generation phase
- Use delta-only continuation when iterating within either phase
- The handoff point is where errors compound — verify research findings before using them as generation inputs

---

## Knowledge Gaps

Models we do not have profiles for yet but should watch:

| Model / Category | Why it matters | Status |
|-----------------|----------------|--------|
| **DALL-E / GPT image generation** | Different architecture from MJ; may validate or contradict keyword salad findings | No profile |
| **Sora** (OpenAI video) | Competing video generation approach; may have different ordering requirements | No profile |
| **Stable Diffusion / Flux** (open source image) | Open source; community-driven; different prompt conventions | No profile |
| **ChatGPT / Claude API** (conversational, not autonomous) | Conversational LLMs where the architectural brief pattern may apply differently | No profile |
| **ElevenLabs / Suno** (audio generation) | Audio-only generation; ordering and vocabulary principles may transfer | No profile |
| **Cursor / Windsurf / Aider** (AI coding assistants) | Code-specific execution systems; component ordering may apply to code prompts | No profile |

Each new profile should validate or challenge the universal principles documented in [Universal Prompting Principles](universal-prompting-principles.md). The more tools that independently confirm a principle, the higher its confidence.

---

## Related

- **[Midjourney V8 Calibration](../references/midjourney-v8-calibration.md)** — full MJ V8 prompting profile
- **[Veo3 Production Parameters](../references/veo3-production-parameters.md)** — full Veo3 prompting profile
- **[Gemini Deep Research Parameters](../references/gemini-deep-research-parameters.md)** — full Gemini DR prompting profile
- **[Claude Cowork Architecture](../references/claude-cowork-architecture.md)** — full Claude Cowork prompting profile
- **[Universal Prompting Principles](universal-prompting-principles.md)** — universal principles this matrix contextualizes per model
- **[Explicit Component Ordering](../patterns/explicit-component-ordering.md)** — the atomic pattern behind the ordering comparison
- **[Prompt as Architectural Brief](../patterns/prompt-as-architectural-brief.md)** — the atomic pattern behind the fundamental shift
- **[Keyword Salad Prompt Collapse](../failures/keyword-salad-prompt-collapse.md)** — failure mode compared across all four tools
- **[Ambiguity as Silent Execution](../failures/ambiguity-as-silent-execution.md)** — failure mode compared across all four tools
