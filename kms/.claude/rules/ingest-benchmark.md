---
name: ingest-benchmark
description: Extraction rules for benchmarks, evaluations, and quantitative comparisons
paths:
  - raw/benchmarks/**
allowed-tools: [Read, Write, Edit, Grep, Glob, Bash]
---

# Ingest Mode — Benchmark

## Trigger

A new file lands in `raw/benchmarks/`. Quantitative evaluation results: model
comparison studies, LMSYS leaderboards, task-specific benchmark runs (HumanEval,
SWE-Bench, MT-Bench), creative-tool A/B comparisons. The defining trait:
**numbers attached to specific conditions**.

## What to produce

Benchmarks rarely produce many atomics — their value is precision, not breadth.
Expect 1–3 atomics:

| Likely artifact types | When to use |
|---|---|
| `concept` | When the benchmark introduces a novel evaluation framework worth naming |
| `pattern` | When the benchmark reveals a repeatable performance shape (e.g., "reasoning models exhibit 39% degradation on multi-turn topic-mixing") |
| `failure` | When the benchmark surfaces a failure mode at scale |
| `synthesis` | Often appropriate as the top-level artifact: "Comparison of <models> on <task> as of <date>" |

## Extraction priorities

1. **Numbers must include conditions.** "Claude 4.7 scores 67%" is meaningless without the task, prompt set, sample size, decoding parameters. Preserve all conditions in the body.
2. **Compare model versions explicitly.** Benchmarks decay fast — a Claude 3.7 vs GPT-4 comparison from 2024 is interesting historically but no longer actionable. Set `decay_triggers.event` for any model in the benchmark.
3. **Reveal methodology.** Benchmark methodology determines whether the result transfers. Capture: prompt template, n-shot, temperature, judge model (if any), pass@k.
4. **Prefer synthesis over fragmentation.** A benchmark comparing 5 models on 3 tasks → one `synthesis` artifact with the full matrix, plus 1–2 atomics for any standout findings. Don't author 15 micro-failures.

## Frontmatter defaults

```yaml
provenance:
  tier: peer-reviewed | corroborated-community | official-doc
  corroboration_count: 1
modality: [<task modality>]
tools: [<all models / tools benchmarked>]
model_versions: { <each version compared> }
abstraction_level: tool-specific | technique
language: en
decay_triggers:
  - event: "any benchmarked model releases new major version"
  - time_days: 90
```

For synthesis as top-level:

```yaml
type: synthesis
goal: "compare <tools/models> on <task> for <use case>"
compiled_from:
  - <atomic artifacts that contributed>
keywords: [<task name>, <benchmark name>, <models compared>]
```

## Body emphasis

For synthesis bodies: lead with the comparison matrix. `## Methodology` section
captures conditions. `## Findings` lists ranked results. `## Caveats` notes
known limitations of the benchmark itself.

For atomic bodies extracted from benchmarks: be precise about conditions in
`How it works`. Numbers without context decay into noise; numbers with conditions
remain actionable.

## Anti-patterns

- **Don't strip uncertainty intervals.** "Claude wins" → "Claude scored 67±3% vs GPT-5 64±4% (n=200, single-prompt eval, judge: GPT-5)". Strip uncertainty, lose the result.
- **Don't generalize across tasks.** "Model X is better at code" from a benchmark of 50 Python problems is a `tool-specific` claim, not a `universal-principle`.
- **Don't ignore the judge.** When the benchmark uses LLM-as-judge, the judge model is a methodological dependency. Capture it.
- **Don't let benchmarks rot silently.** A benchmark from 6 months ago needs explicit `lifecycle: review-soon` even if no event triggered. Performance landscape moves fast.

## Ripple expectations

Benchmarks ripple by raising/lowering `corroboration_count` on existing
performance claims and triggering `lifecycle` flips on contradicted artifacts.
A benchmark showing Model X regression should flip relevant claims to
`review-soon`. Expect 3–8 ripples per benchmark ingest.
