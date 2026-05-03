---
name: ingest-field-note
description: Extraction rules for personal field notes (operator's run logs, observations, lessons learned)
paths:
  - raw/field-notes/**
allowed-tools: [Read, Write, Edit, Grep, Glob, Bash]
---

# Ingest Mode — Field Note

## Trigger

A new file lands in `raw/field-notes/`. The operator's own observations: run
logs, "what I tried and what happened" notes, debugging traces, postmortems,
session retrospectives. First-party lived experience.

## What to produce

Field notes are uniquely valuable for `failure` artifacts — operators see
failures vendors don't document. Expect 1–4 atomics:

| Likely artifact types | When to use |
|---|---|
| `failure` | The richest type from field notes — failure modes the operator actually encountered |
| `pattern` | A workaround / technique the operator confirmed empirically |
| `mechanism` | If the operator characterized a parameter's behavior empirically (often more accurate than vendor docs) |
| `exemplar` | If the field note includes a concrete prompt/workflow that worked |

## Extraction priorities

1. **Failure first.** Field notes are *the* primary source for `failure` artifacts because operators witness failures vendors hide. Lead with the failure mode; supporting patterns/mechanisms follow.
2. **Specificity is the asset.** "Sometimes the model returns wrong JSON" is not useful. "Claude Opus 4.7 with `extended_thinking: 'high'` returns nested-object JSON keys with backticks ~5% of the time when the system prompt mentions code formatting" is the gold. Preserve specificity.
3. **Empirical mechanism characterizations beat vendor docs.** If the operator measured `--stylize 1000` actually clamps at ~750, that contradicts the doc and is `personal-field` evidence worth recording in `contradictions`.
4. **Provenance is honest.** `personal-field` tier. `corroboration_count: 1` until others confirm. Don't inflate.

## Frontmatter defaults

```yaml
provenance:
  tier: personal-field
  corroboration_count: 1
  sources:
    - source: raw/field-notes/<filename>
      sections: ["..."]
      claim: "Operator observed <specific behavior> on <date>"
modality: [<actual modality based on context>]
tools: [<exact tool slug + version operator was using>]
model_versions: { <vendor>: "<version>" }   # critical — field notes age
abstraction_level: tool-specific
confidence: medium   # personal observation, may not generalize
language: en | pl
```

For `failure` artifacts especially:

```yaml
type: failure
goal: "avoid <specific bad outcome> when <conditions>"
keywords: [<failure mode name>, <symptoms operator observed>]
```

## Body emphasis

For failure bodies: `When to use` becomes "When this failure mode triggers"
(specific conditions). `Mechanism` explains why it happens (operator's hypothesis
or known cause). `Example` cites the operator's specific session/output that
demonstrated it. `Failure modes` section becomes "Repair strategies" — what the
operator did to mitigate.

## Anti-patterns

- **Don't generalize from N=1.** A single observation is `confidence: low` to `medium`. Promote to `high` only when corroborated by other field notes or external sources.
- **Don't lose specificity.** "It worked better when I added more detail" is unactionable. "Adding 3-shot examples reduced hallucination from ~30% to ~5% in 50-trial run on 2026-04-15" is a real claim.
- **Don't skip cross-linking against vendor docs.** If the operator's observation contradicts an existing `tool-doc`-tier mechanism artifact, add a `relation: conflicts-with` and note in `contradictions`.
- **Don't auto-promote to `corroborated-community`.** Other operators' Reddit posts and Discord lore are `corroborated-community` only when they actually corroborate the same specific claim — not loosely related anecdotes.

## Ripple expectations

Field notes ripple into existing pattern/mechanism artifacts as evidence and
contradictions. Expect 2–5 ripples (often raising `corroboration_count`,
sometimes flagging `contradictions`) on top of 1–4 new atomics. Field notes
are also the primary trigger for lifecycle changes — an observation that a
documented mechanism has changed behavior should flip the relevant artifact's
`lifecycle: review-soon`.
