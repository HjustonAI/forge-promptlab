---
name: compile-playbook
description: Authoring rules for playbooks — goal-oriented compositions; the wrapper's primary input format
paths:
  - compiled/playbooks/**
allowed-tools: [Read, Write, Edit, Grep, Glob, Bash]
---

# Compile — Playbook

## Identity

A `playbook` is a **goal-oriented composition**: "to accomplish goal G with
tool T under conditions C, compose mechanism M1 + pattern P1 + mechanism M2,
in that order, with these inputs and these failure mitigations."

**This is the wrapper's primary input format.** When a future meta-prompter
agent receives "How to [verb] [object] best?", the ranked-bundle response is
anchored on a playbook (if one exists). Everything else in this rule serves
that contract.

## Identity contrasts

- `profile` = "everything about Midjourney v8" (tool-centric, comprehensive)
- `synthesis` = "negative-space techniques across image/video/audio" (topic-centric, comparative)
- **`playbook`** = "how to render a cinematic dolly-zoom shot in Veo 3 best" (goal-centric, executable)

## When to author

- A common operator goal (or wrapper-anticipated query) has crystallized
- The goal can be achieved by composing existing atomics — minimum **2 patterns + 1 tool profile + 1 failure to mitigate**. If the atomics don't exist yet, author them first via ingest; then return to the playbook.
- A previously-asked query "How to X best?" exposed a content gap; that gap defines the playbook to author.

**Granularity rule**: playbooks are **per goal × tool**, not per goal across
all tools. "Control character consistency in Midjourney v8" and "Control
character consistency in Veo 3" are two separate playbooks, possibly linked
via `composes-with` to a cross-tool synthesis.

## When to recompile

- A `compiled_from` atomic changes materially (mechanism behavior changes, pattern is superseded)
- A new mechanism / pattern lands that should be in this playbook's composition
- The target tool's version changes (and the playbook is version-bound)
- A wrapper run reports the playbook didn't produce the goal effectively (feedback loop — operator updates and recompiles)

## Required body skeleton

```markdown
# Playbook: <Verb-Object Goal> in <Tool>

## TL;DR
One paragraph: what this playbook accomplishes, when to use it, expected
outcome.

## Goal
Precise, single-sentence goal statement. This is the parsed-out form of the
wrapper's "How to X best?" query.

## Inputs the wrapper must supply
Bulleted list of variables the playbook needs from the wrapper to instantiate:

- `subject_description` (noun-phrase, required) — what the operator wants
- `style_modifier` (enum: cinematic | documentary | …, optional, default: cinematic)
- `aspect_ratio` (enum, default: 16:9)

These map to `playbook_inputs` in frontmatter.

## Steps
Numbered, ordered steps. Each step references the atomics that ground it:

1. **<Step name>** — what to do, why, and which atomic backs this step.
   Uses: [pattern-name](../../distilled/patterns/pattern-name.md)
2. **<Step name>** — ...
   Uses: [mechanism-name](../../distilled/mechanisms/mechanism-name.md)
3. **<Step name>** — ...
   Uses: [pattern-name](../../distilled/patterns/pattern-name.md)

## Failure modes to mitigate
What can go wrong, with mitigation strategy. Each failure links to its
artifact via `relation: mitigates`:

- **<Failure name>** — symptom, mitigation step within the playbook.
  See: [failure-name](../../distilled/failures/failure-name.md)

## Example execution
Walk through one complete instantiation: actual filled values for each input,
the resulting prompt/workflow, the expected output description.

## When NOT to use
Conditions under which a different playbook applies. Link to alternatives
via `relation: specializes` or `relation: generalizes`.

## Provenance summary
- Compiled from: <count> atomics
- Strongest evidence tier in compiled_from: <tier>
- Confidence in playbook outcome: <high | medium | low>

## Maintenance
- Last compiled: <date>
- Recompile trigger: <which event/atomic-change will trigger next recompile>
- Wrapper feedback log: <link to log entries reporting this playbook's effectiveness>
```

## Frontmatter requirements

```yaml
type: playbook
title: "Playbook: <Goal> in <Tool>"
tldr: "What this playbook accomplishes and when to use it. ≤ 280 chars."
goal: "<exact verb-object goal — matches the wrapper's parsed query>"
applicable_to_goals:
  - "<related goal phrasings the wrapper might use>"
keywords: [<goal terms>, <tool>, <key mechanisms invoked>]
modality: [<modalities in scope>]
tools: [<single tool slug — playbooks are per-tool>]
model_versions: { <vendor>: "<version>" }   # when version-bound
abstraction_level: tool-specific
provenance:
  tier: <highest tier in compiled_from>
confidence: <playbook's overall confidence in producing the goal>
lifecycle: current
decay_triggers:
  - event: "<tool> releases new major version"
  - time_days: 90
compiled_from:
  - <every atomic this playbook composes — patterns, mechanisms, failures, exemplars, the tool profile>
playbook_inputs:
  - name: <input variable>
    type: noun-phrase | enum | string | number
    required: true | false
    default: <value if any>
    values_from: <distilled/mechanisms/... if enum sourced from a mechanism>
playbook_steps:
  - step: "<step description>"
    uses: <distilled/.../atomic.md>
  - step: "<step description>"
    uses: <distilled/.../atomic.md>
see_also:
  - <related playbooks (other tools for same goal, more general goals, more specific goals)>
  - <the tool's profile, with relation: requires>
```

## Anti-patterns

- **Don't author a playbook ungrounded in atomics.** Every step must reference an atomic via `uses`. A playbook step with no atomic backing is invented, not compiled.
- **Don't generalize across tools in one playbook.** "How to control consistency" across all image tools is a `synthesis`, not a playbook. Playbooks are per-tool.
- **Don't skip the failure-modes section.** A playbook that doesn't mitigate failures will fail in production. Even if no specific failures apply, document why ("no significant failure modes for this goal-tool combo at current model maturity").
- **Don't write playbooks before atomics exist.** If the patterns and mechanisms aren't in `distilled/`, author them first via ingest. Playbooks are compiled, not created from thin air.
- **Don't bake in operator-specific values.** The playbook is template; specific values are `playbook_inputs` the wrapper supplies. Don't hardcode "shot of a woman" — let the wrapper supply the subject.

## Validation before publish

- Every step's `uses` field points to an existing atomic
- `playbook_inputs` covers everything that varies across instantiations
- TL;DR ≤ 280 chars
- Goal field exactly matches the wrapper's expected query phrasing
- All `see_also` use the typed relation enum
- Frontmatter passes the validate-frontmatter hook
- Example execution actually produces a working prompt/workflow when filled in

## Wrapper integration notes

The wrapper:

1. Receives "How to [verb] [object] best?" → parses goal
2. `qmd query "<goal>" -c playbooks --json` → finds matching playbook by `goal` field
3. Reads playbook's `playbook_inputs` to know what to gather from user
4. Reads playbook's `playbook_steps` to know what to compose
5. Reads `compiled_from` atomics for the supporting context
6. Composes the final prompt by filling the playbook template

Therefore: playbook fields the wrapper depends on are **non-negotiable**:
`goal`, `playbook_inputs`, `playbook_steps`, `compiled_from`. Every playbook
must populate them.
