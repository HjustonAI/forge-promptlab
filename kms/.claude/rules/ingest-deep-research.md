---
name: ingest-deep-research
description: Extraction rules for deep-research outputs (Gemini Deep Research, Perplexity Pro, ChatGPT Deep Research) — long synthesized reports with source ledgers
paths:
  - raw/deep-research/**
allowed-tools: [Read, Write, Edit, Grep, Glob, Bash]
---

# Ingest Mode — Deep Research

## Trigger

A new file lands in `raw/deep-research/`. Output of an autonomous research
agent (Gemini Deep Research, Perplexity Pro, ChatGPT Deep Research, custom
deep-research workflows). Typical shape: 10–50 pages of synthesized prose with
an embedded source ledger of dozens to hundreds of citations.

## What to produce

Deep-research outputs are dense and span multiple subtopics. Expect 6–15 atomics:

| Likely artifact types | When to use |
|---|---|
| `concept` | Each named architecture / model the report discusses |
| `pattern` | Each technique / workflow the report distills |
| `failure` | Each pitfall / limitation the report documents |
| `tool` | If the report is about a specific tool, author the `tool` artifact |
| `mechanism` | Specific knobs the report analyzes |
| `synthesis` | Often appropriate as the *top-level* artifact summarizing the report's cross-cutting analysis |

## Extraction priorities

1. **Treat the report's source ledger as your provenance map.** A claim the report makes is only as strong as the underlying sources it cites. Trace at least the load-bearing claims back to their original tier.
2. **The report itself is `corroborated-community` at best.** Even if Gemini cites peer-reviewed papers, Gemini's *synthesis* is not peer-reviewed. Atomic artifacts citing the report should be `corroborated-community` unless they trace back to a `peer-reviewed` source via the ledger.
3. **Find the report's core thesis.** Most deep-research outputs have one big claim. Capture it as a `synthesis` artifact. Then decompose supporting claims into atomics.
4. **Watch for hallucinated citations.** Deep-research agents occasionally invent sources or misattribute claims. If a quoted figure can't be traced via search, mark `confidence: low` and note the unverifiable citation in `contradictions` rather than dropping it silently.

## Frontmatter defaults

```yaml
provenance:
  tier: corroborated-community   # the report's overall tier, even when citing peer-reviewed sources
  corroboration_count: 1         # raise when other sources confirm
modality: [text]                 # most reports; override for vision/multimodal subjects
abstraction_level: technique | architectural   # rare for tool-specific
language: en
```

For atomics that trace cleanly to a peer-reviewed citation in the report:

```yaml
provenance:
  tier: peer-reviewed             # use the underlying citation's tier, not the report's
  sources:
    - source: raw/deep-research/<filename>
      sections: ["Where the report quotes the paper"]
    - source: <if you can also access the original paper>
```

## Body emphasis

`How it works` section should reproduce the report's mechanism with citation
density preserved — quote the report's key claims with section anchors. Use
the report's specific language where the wording is load-bearing.

For the `synthesis` top-level artifact: structure body as the report's own
section structure (TL;DR, key findings, comparison matrix, recommendations).

## Anti-patterns

- **Don't trust uncited claims in deep-research outputs.** Some agents pad reports with plausible-sounding speculation. Untraced claims → `provenance.tier: speculative`.
- **Don't ingest the report whole.** A 30-page report should not become one 2000-line `synthesis` artifact. Decompose first; let the synthesis be the index, not the encyclopedia.
- **Don't confuse the report's date with the underlying source dates.** A 2026-04 deep-research report citing a 2024 paper grounds the *claim* in 2024 evidence. `decay_triggers` should track the underlying claim's recency, not the report's generation date.
- **Don't skip the contradictions field.** Deep-research outputs often surface tensions across sources. When the report notes "X says A, Y says B," that's exactly what `contradictions` is for.

## Ripple expectations

Heavy. Deep-research reports often touch many concepts the wiki already
partially covers. Expect 5–15 ripples (corroborations, new contradictions,
confidence raises) on existing artifacts in addition to 6–15 new atomics.
The qmd-search-neighbors step (ingest pipeline step 3) is especially
load-bearing here — without it, you'll create duplicates.
