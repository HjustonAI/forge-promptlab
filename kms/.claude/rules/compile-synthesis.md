---
name: compile-synthesis
description: Authoring rules for syntheses — cross-cutting analyses spanning multiple modalities, tools, or topics
paths:
  - compiled/syntheses/**
allowed-tools: [Read, Write, Edit, Grep, Glob, Bash]
---

# Compile — Synthesis

## Identity

A `synthesis` is a **cross-cutting analysis**: one phenomenon or principle
examined across multiple tools, modalities, or contexts. Topic-centric, not
tool-centric (that's `profile`) and not goal-centric (that's `playbook`).

Examples of valid synthesis topics:
- "Negative-space techniques across image, video, and audio generation"
- "Agentic loop shapes — comparison across Claude Code, AutoGen, n8n agentic"
- "How extended-thinking-style reasoning manifests in different LLM families"
- "Universal principles of specificity in AI control"

## When to author

- A pattern or concept appears across **3+ tools** or **2+ modalities** with enough variation to warrant cross-cutting analysis
- A user query (or wrapper retrieval) repeatedly returns the same set of atomics from different domains — that's a synthesis-shaped gap
- A field note observes a phenomenon and the operator wants to formalize "this happens everywhere"

## When to recompile

- New atomics in the synthesis's domain land that materially change the comparison
- A previously-included atomic becomes `stale` or is contradicted by new evidence
- The underlying tools/modalities expand (a new image generator launches; the cross-image-tool synthesis must include it or be marked partial)

## Required body skeleton

```markdown
# <Synthesis Title>

## TL;DR
One paragraph: the cross-cutting claim or comparison this synthesis makes.

## The phenomenon
Define what we're analyzing across cases. Cite the foundational concept artifact
if one exists.

## Cross-case comparison
The core of the synthesis. Typically a comparison matrix or per-case analysis:

| Case | How it manifests | Key mechanism | Notable failure | Exemplar |
|---|---|---|---|---|
| Midjourney v8 | <observation> | [link to mechanism] | [link to failure] | [link to exemplar] |
| Veo 3 | <observation> | ... | ... | ... |
| Suno v4 | <observation> | ... | ... | ... |

## What's universal
Cross-cutting findings — what's true across all cases.

## What's case-specific
Findings that don't transfer — variation worth knowing.

## Implications
What a wrapper / operator should do with this analysis. When to apply universal
principles vs. tool-specific adjustments.

## Cross-tool / cross-modality references
Link to the profiles and patterns this synthesis draws from.

## Maintenance
- Last compiled: <date>
- Compiled from: <count> atomics across <count> tools/modalities
- Recompile trigger: <which event will trigger next recompile>
```

## Frontmatter requirements

```yaml
type: synthesis
title: "<Synthesis Title>"
tldr: "The cross-cutting claim. ≤ 280 chars."
goal: "understand <phenomenon> across <tools/modalities>"
applicable_to_goals:
  - "<each operator goal this synthesis informs>"
keywords: [<phenomenon name>, <each tool/modality compared>]
modality: [<all modalities in scope>]   # often multi-modal
tools: [<all tools in scope>]
abstraction_level: technique | architectural | universal-principle   # rarely tool-specific
provenance:
  tier: <conservative aggregate from compiled_from>
confidence: <conservative — synthesis is meta-claim>
lifecycle: current
decay_triggers:
  - event: "<key tool> releases new major version"
  - time_days: 180   # syntheses age slower than profiles
compiled_from:
  - <every atomic this synthesis draws from>
see_also:
  - <related synthesis artifacts>
  - <foundational concept artifacts>
```

## Anti-patterns

- **Don't synthesize prematurely.** A synthesis from 2 cases is a pattern, not a synthesis. Wait for ≥3 cases or hold off.
- **Don't synthesize where a profile would do.** "How to control Midjourney v8" is a profile, not a synthesis. Synthesis requires multiple cases.
- **Don't bury the universal claim.** Lead with "what's universal" — that's the wrapper's primary takeaway. Case-specific variation is supporting.
- **Don't pretend universality you haven't demonstrated.** If you compared 3 image tools and found a pattern, that's a "cross-image-tool" synthesis, not a "universal across all generative AI" synthesis. Be specific about scope.
- **Don't compile from speculative-tier atomics.** Synthesis is meta-claim; building on shaky atomics produces shakier synthesis. Filter `compiled_from` to atomics with `confidence: medium` or `high`.

## Validation before publish

- Cross-case comparison covers ≥3 cases (tools or modalities)
- Every link resolves
- `compiled_from` is comprehensive
- TL;DR ≤ 280 chars and conveys the cross-cutting claim
- Frontmatter passes hooks
