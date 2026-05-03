---
name: ingest-article
description: Extraction rules for blog articles, magazine pieces, news commentary
paths:
  - raw/articles/**
allowed-tools: [Read, Write, Edit, Grep, Glob, Bash]
---

# Ingest Mode — Article

## Trigger

A new file lands in `raw/articles/`. Blog posts, Medium articles, magazine
pieces, opinion essays, news commentary about AI tools or techniques.

## What to produce

Articles are usually thinner than papers. 1–4 atomics is typical. Many articles
are corroboration material for existing artifacts rather than primary sources.

| Likely artifact types | When to use |
|---|---|
| `pattern` | A technique the article describes/recommends |
| `failure` | A pitfall the article warns about |
| `concept` | Only if the article introduces / clarifies a definition that's not yet captured |
| `exemplar` | If the article includes a real prompt or workflow worth preserving |

## Extraction priorities

1. **Corroborate before create.** Run `qmd query "<topic>" -c patterns,failures,concepts`. If a near-match exists, raise its `corroboration_count` and add an evidence entry pointing at this article. Don't create a duplicate.
2. **Distinguish opinion from observation.** Author-asserted "best practice" without evidence → `provenance.tier: speculative` or `corroborated-community` if it's a recurring claim. Author-observed phenomenon with examples → `personal-field` or `corroborated-community`.
3. **Extract the smallest defensible claim.** Articles often overgeneralize. "X always fails" → narrow to the specific conditions the article actually demonstrates.

## Frontmatter defaults

```yaml
provenance:
  tier: corroborated-community | speculative   # rarely official-doc; never peer-reviewed
  corroboration_count: 1
modality: [text]   # default; override based on article subject
abstraction_level: technique  # most common
language: en | pl
```

## Body emphasis

Articles often have a strong `When to use` story — preserve that. Be terse on
`How it works` if the article is hand-wavy; better to be honest about
speculative tier than fabricate mechanism detail.

## Anti-patterns

- **Don't inflate confidence.** A blog post is not a paper. `confidence: low` or `medium` unless multiple articles corroborate.
- **Don't extract authorial opinion as fact.** "Pretty much everyone agrees" is not evidence; capture the source's actual demonstrated examples.
- **Don't create from a thin article.** If it's a 500-word think-piece without examples or specifics, just file the source under `raw/articles/` for future reference and skip atomic creation. Note in envelope: `mode_confidence: low, no atomics produced`.

## Ripple expectations

Most ingests are corroboration-shaped: 0–2 new atomics, 1–4 existing artifacts
updated with new evidence entries. That's healthy. An article that adds many
new atomics is rare and worth scrutinizing — is the article actually that
information-dense, or are you over-distilling?
