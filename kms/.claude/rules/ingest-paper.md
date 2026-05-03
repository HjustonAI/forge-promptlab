---
name: ingest-paper
description: Extraction rules for academic and research papers
paths:
  - raw/papers/**
allowed-tools: [Read, Write, Edit, Grep, Glob, Bash]
---

# Ingest Mode — Research Paper

## Trigger

A new file lands in `raw/papers/`. Typically PDF-derived markdown, arXiv export,
formal publication. Source language usually English; check `language` in envelope.

## What to produce

Papers are dense; one paper typically spawns 4–10 atomic artifacts.

| Likely artifact types | When to use |
|---|---|
| `concept` | Formal definitions, mental models, named architectures the paper introduces |
| `pattern` | Specific techniques the paper proposes/measures |
| `failure` | Failure modes the paper documents (often the motivation section) |
| `mechanism` | If the paper analyzes a specific tool/parameter, extract that mechanism |
| `exemplar` | Verbatim prompts/snippets if the paper publishes them |
| `synthesis` | Only if the paper itself is a survey/meta-analysis — then a compiled `synthesis` may be the right top-level artifact |

## Extraction priorities

1. **Quantitative claims first** — papers earn high `provenance.tier: peer-reviewed`. Numbers are their distinguishing value. Capture exact figures, not paraphrases. ("39% performance drop", not "significant performance degradation".)
2. **Method over results** — the paper's *technique* is more transferable than its specific result. Extract the pattern; cite the result as evidence.
3. **Failure modes from motivation** — the "Limitations" / "Why current approaches fail" section is gold for `failure` artifacts.
4. **Definitions before claims** — if the paper introduces a term, that's a `concept` artifact dependency for everything else.

## Frontmatter defaults

```yaml
provenance:
  tier: peer-reviewed
  corroboration_count: 1   # raise if multiple papers cite the same finding
modality: [text]           # most papers; override if vision/multimodal/agentic paper
abstraction_level: technique | architectural | universal-principle  # rare for tool-specific
language: en               # almost always
```

## Body emphasis

`How it works` section should reproduce the paper's mechanism faithfully — this
is where peer-reviewed papers earn their tier. `Example` should cite the paper's
own example, not paraphrase. Always include exact quantitative claims with
section reference in `provenance.sources[].sections`.

## Anti-patterns

- **Don't paraphrase quantitative claims.** "Around 40% drop" loses information vs. "39%".
- **Don't extract everything.** A 30-page paper does not become 30 atomics. Aim for the load-bearing 4–10.
- **Don't skip cross-paper corroboration.** Run `qmd query "<concept>" -c concepts,patterns` — if another paper supports the claim, raise `corroboration_count` and add typed `see_also`.
- **Don't conflate the paper's technique with the paper's specific implementation.** The pattern is the technique; the implementation is an `exemplar` if worth preserving.

## Ripple expectations

Typically updates 2–5 existing artifacts (concepts the paper extends, failures
the paper now corroborates, patterns the paper specializes). If a paper produced
8 atomics and rippled nothing, you missed connections — re-run `qmd query` with
broader terms.
