---
name: ingest-idea-file
description: Extraction rules for idea files (Karpathy-style portable concept documents — high-density seed material)
paths:
  - raw/idea-files/**
allowed-tools: [Read, Write, Edit, Grep, Glob, Bash]
---

# Ingest Mode — Idea File

## Trigger

A new file lands in `raw/idea-files/`. Karpathy-style "idea file" or its
variants: a structured high-density document that doesn't ship code but ships
the *idea* with enough detail that an LLM can instantiate it. Think of it as
seed material for a knowledge system or architecture.

## What to produce

Idea files are dense and architectural. Expect 4–10 atomics:

| Likely artifact types | When to use |
|---|---|
| `concept` | Each named architectural idea / mental model the file proposes |
| `pattern` | Each technique / workflow shape the file prescribes |
| `failure` | Each pitfall / anti-pattern the file warns against |
| `synthesis` | Often appropriate at top level — the idea file IS a synthesis of related concepts/patterns/failures |

Idea files rarely produce `tool` / `mechanism` / `exemplar` directly — those
are downstream of implementation, not the idea itself.

## Extraction priorities

1. **Preserve the philosophical frame.** Idea files often have a strong "why" / "mindset" section. Capture this as a `concept` artifact even if abstract — it's the load-bearing context for the patterns.
2. **The file's structure often becomes the synthesis structure.** If the idea file has clean sections (Mission, Architecture, Operations), the top-level `synthesis` artifact's body can mirror that.
3. **Extract the load-bearing decisions.** Idea files frequently contain choices like "raw is immutable" or "knowledge is autonomous from consumers." Each non-obvious decision is a `concept` or `pattern` worth its own artifact.
4. **Idea-file tier defaults to author-credibility.** Karpathy's idea file → high `confidence` even though `provenance.tier: speculative` (no peer review). The author's track record substitutes for formal review. Document the rationale in `confidence_rationale`.

## Frontmatter defaults

```yaml
provenance:
  tier: speculative | personal-field   # idea files are by nature unproven proposals
  corroboration_count: 1
modality: [<depends on idea>]
abstraction_level: architectural | universal-principle   # rarely tool-specific
language: en | pl
confidence: medium | high   # justify in confidence_rationale based on author / soundness
```

For the top-level synthesis (if appropriate):

```yaml
type: synthesis
goal: "understand <named idea> as a complete proposal"
compiled_from:
  - <atomics extracted from this idea file>
keywords: [<idea name>, <author name if notable>]
```

## Body emphasis

For synthesis bodies: structure follows the idea file's structure. Use the
file's own headings as your section names where possible.

For concept/pattern bodies: cite the idea file's specific section(s) in
`provenance.sources[].sections`. The body's `How it works` should faithfully
represent the idea even when speculative — distinguish what the idea claims
from what's been validated.

## Anti-patterns

- **Don't validate-by-extraction.** Distilling an idea into atomic artifacts does NOT make the idea proven. Track tier honestly.
- **Don't fold related ideas into one artifact.** If the idea file proposes 5 distinct concepts, that's 5 concept artifacts. The graph density matters.
- **Don't skip the philosophical frame.** Without the "why" concept, downstream patterns lose their motivation. Future readers won't understand why the patterns are shaped a certain way.
- **Don't conflate idea-file authorship with peer review.** Even a brilliant author's idea file is `speculative` until tested. Confidence comes from rationale; tier comes from review process.

## Ripple expectations

Idea files often *seed* the wiki — they're the first ingest in a new domain.
Expect heavy authoring (4–10 new atomics) and lighter ripple (0–3 existing
artifacts updated) since there may be little prior content. After several
related ingests in the same domain, the synthesis can be recompiled with more
corroboration.
