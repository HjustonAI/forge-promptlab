---
name: ingest-creative-prompt
description: Extraction rules for creative-domain prompts (Midjourney, Veo, Suno, etc.) — image, video, audio prompts with specific parameters
paths:
  - raw/creative-prompts/**
allowed-tools: [Read, Write, Edit, Grep, Glob, Bash]
---

# Ingest Mode — Creative Prompt

## Trigger

A new file lands in `raw/creative-prompts/`. Image, video, audio, or 3D
generation prompts — typically with explicit parameters/flags
(`--stylize`, `--cref`, aspect ratios, seeds, negative prompts, etc.).
Often gallery-style: many prompts in one file, each with its rendered output noted.

## What to produce

Creative prompts are parameter-dense. One file with 10 prompts typically spawns:

| Likely artifact types | When to use |
|---|---|
| `mechanism` | One artifact per distinct parameter the prompts use (`midjourney-stylize`, `midjourney-cref`, `veo3-camera-movement`, `suno-genre-tag`) |
| `pattern` | Each reusable technique observed across multiple prompts (e.g., "Anchor camera-movement adjective at sentence start in Veo 3") |
| `exemplar` | **Always** — preserve the actual prompt strings verbatim, ideally with their rendered outputs noted |
| `tool` | If this is the first creative-prompt artifact for a tool, author the `tool` artifact (lean factual surface) before the mechanisms |

## Extraction priorities

1. **Parameters are first-class.** Every flag/knob → `mechanism` artifact with value range, observed effects, default. Don't fold parameters into pattern bodies.
2. **Preserve renderings.** A creative prompt without its rendered output is half data. If the source includes renders/links, capture them in the `exemplar` body.
3. **Patterns generalize across exemplars.** If 5 exemplars all start with a strong subject noun, that's the pattern. Don't author the same pattern twice from two exemplars.
4. **Modality matters.** `modality: [image]`, `[video]`, `[audio]`, or `[3d]` — never `[text]` for creative prompts. Wrappers filter on this.
5. **Tool version-bind.** Creative tools change behavior between versions. Set `model_versions: { midjourney: "v8" }` whenever the source specifies a version.

## Frontmatter defaults

```yaml
modality: [image] | [video] | [audio] | [3d]   # pick the actual modality
tools: [<vendor-name-version>]                  # exact slug from taxonomy.md
model_versions: { <vendor>: "<version>" }       # when source is version-specific
abstraction_level: tool-specific                # almost always for creative-prompts
provenance:
  tier: corroborated-community | personal-field | official-doc | speculative
  corroboration_count: 1
language: en | pl
```

For mechanism artifacts:

```yaml
type: mechanism
goal: "use <parameter> in <tool> to achieve <effect>"
keywords: [<parameter-name>, <flag-syntax-variants>]
```

## Body emphasis

For mechanism bodies: `Mechanism / Parameters` section is the load-bearing part.
Include value range, default, observed effects at low/mid/high values, common
combinations with other parameters.

For pattern bodies in creative domain: `Example` section cites 2–3 exemplars
that demonstrate the pattern. `Failure modes` link to creative-domain failures
like over-stylization, style-collapse, prompt-collision.

## Anti-patterns

- **Don't fold parameters into patterns.** `--stylize` deserves its own `mechanism` artifact. Patterns *use* mechanisms; they don't replace them.
- **Don't drop versions.** Midjourney v7 advice is silently wrong by v9. `model_versions` and `decay_triggers.event: "midjourney releases v9"` are mandatory.
- **Don't generalize prematurely.** "This pattern works in image generation" needs evidence across at least Midjourney + one other image tool. Otherwise it's `tool-specific`, not `technique`.
- **Don't lose the prompt strings.** Creative prompts are exemplary by nature. The `exemplar` artifact is non-negotiable.

## Ripple expectations

First creative-prompt ingest for a new tool: heavy — author the `tool` artifact
+ 3–6 `mechanism` artifacts + 1–3 `pattern` artifacts + 1–N `exemplar` artifacts.
Subsequent ingests: lighter, mostly corroboration on existing mechanisms,
occasional new pattern discovery.

After enough creative-prompt ingests for a tool, recompile its `profile`
(see `.claude/rules/compile-profile.md`).
