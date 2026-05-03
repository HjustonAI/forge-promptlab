---
name: compile-profile
description: Authoring rules for tool profiles — per-tool digest covering control patterns, mechanisms, failures, exemplars
paths:
  - compiled/profiles/**
allowed-tools: [Read, Write, Edit, Grep, Glob, Bash]
---

# Compile — Tool Profile

## Identity

A `profile` is a **per-tool digest**: read ONE file, know how to control that
tool well. Tool-centric, not goal-centric. The reader has chosen the tool
("I'm using Midjourney v8") and wants the full control surface.

## When to author

- A new tool has accumulated enough atomics to warrant compilation: minimum **1 `tool` artifact + 3 `mechanism` artifacts + 2 `pattern` artifacts**. Below that threshold, the atomics are too thin to compile.
- An existing tool has gained substantial new atomics since last compilation (≥5 new atomics or a major version bump).

## When to recompile

- A new mechanism / pattern / failure / exemplar lands for this tool
- The tool's underlying `tool` artifact's version changes (v7 → v8)
- A `decay_triggers.event` fires for the tool ("midjourney releases v9")
- An existing atomic in the profile's `compiled_from` flips to `lifecycle: stale` or is contradicted

## Required body skeleton

```markdown
# <Tool Slug — Version> Profile

## TL;DR
One paragraph: what this tool is, what it controls, why you'd use it.

## Quick facts
- Vendor: <vendor>
- Current version: <version>
- Modality: <modality>
- License/access model: <free / paid / API-only / etc.>
- Official docs: <link>

## Control surface
Bulleted list of the tool's primary control surfaces, each linking to its
mechanism artifact. Group by category if many (e.g., Composition / Style /
Iteration / Output).

- **--cref** — character reference. See [midjourney-cref](../../distilled/mechanisms/midjourney-cref.md)
- **--stylize** — aesthetic intensity. See [midjourney-stylize](../../distilled/mechanisms/midjourney-stylize.md)

## Patterns that work
List of validated control patterns for this tool, each linking to its pattern
artifact. Include a one-line summary per pattern.

## Failure modes
List of known failures specific to this tool, each linking to its failure
artifact.

## Exemplars
Curated list of 3–7 high-quality example prompts/workflows demonstrating the
tool's range. Link to exemplar artifacts.

## Cross-tool relationships
Notes on how this tool composes with / supersedes / specializes other tools.
Link via typed `see_also` (relation: composes-with, supersedes, specializes,
generalizes).

## Maintenance
- Last compiled: <date>
- Compiled from: <count> atomics
- Recompile trigger: <which event/threshold will trigger next recompile>
```

## Frontmatter requirements

```yaml
type: profile
title: "<Tool Slug> Profile"
tldr: "What this tool is, what it controls, primary use cases. ≤ 280 chars."
goal: "see what <tool> can do and how to control it well"
applicable_to_goals:
  - "<list of operator goals this tool addresses>"
keywords: [<tool name variants>, <vendor>, <key mechanisms>]
modality: [<tool's primary modalities>]
tools: [<this single tool's slug>]
model_versions: { <vendor>: "<version>" }   # this profile is version-bound
abstraction_level: tool-specific
provenance:
  tier: <highest tier present in compiled_from atomics>
  sources: <aggregate from atomics>
confidence: <conservative aggregate>
lifecycle: current
decay_triggers:
  - event: "<vendor> releases new major version"
  - time_days: 90
compiled_from:
  - <every atomic this profile draws from — tool, mechanisms, patterns, failures, exemplars>
see_also:
  - <profiles of related tools, with relation: composes-with | supersedes | specializes>
  - <synthesis artifacts comparing this tool to others>
```

## Anti-patterns

- **Don't restate atomic content verbatim.** The profile is an index + summary, not a copy. Link to atomics; summarize their TL;DRs in 1–2 sentences each.
- **Don't make the profile longer than 250 lines.** If it's exceeding, you're duplicating atomic content. Trim summaries; let links do the work.
- **Don't profile across versions.** A `midjourney-v8` profile is distinct from `midjourney-v9`. Profiles supersede each other; old profiles get archived, not edited.
- **Don't include speculative atomics.** A profile is operational reference. Atomics with `lifecycle: stale` or `provenance.tier: speculative` are filtered out unless explicitly noted as "experimental".
- **Don't forget cross-tool links.** A profile in isolation is half useful. Wrappers traverse from a profile to related tools' profiles via typed relations.

## Validation before publish

- Every link in the body resolves to a real artifact (run lint to verify)
- `compiled_from` lists every atomic referenced
- TL;DR ≤ 280 chars
- All cross-references in `see_also` use the typed relation enum
- Frontmatter passes the validate-frontmatter hook
