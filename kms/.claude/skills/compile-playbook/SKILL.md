---
name: compile-playbook
description: Compose a goal-oriented playbook from existing atomics. Invoke when the operator says "build a playbook for <goal>" or when an unanswered "How to X best?" query exposes a content gap.
allowed-tools: [Read, Write, Edit, Grep, Glob, Bash]
---

# Compile-Playbook Skill

Operational form of [.claude/rules/compile-playbook.md](../../rules/compile-playbook.md).
The rule is the spec; this skill is the executable workflow.

## Inputs the operator supplies

- `<goal>` — verb-object goal phrasing (e.g., "control character consistency in Midjourney v8")
- `<tool>` — single tool slug the playbook is bound to

## Pre-flight

- [ ] qmd is operational
- [ ] INDEX.json is current
- [ ] The target tool's `tool` artifact exists; check `qmd query "<tool>" -c tools`
- [ ] Goal phrasing is verb-object specific, not vague ("control X" yes; "do better at X" no)

## Workflow

### Step 1 — Discover atomics for this goal

```bash
qmd query "<goal>" --json -n 15
```

Read top results. Build the candidate `compiled_from` list:

- ≥ 2 patterns that achieve aspects of the goal
- 1 tool profile (the tool the playbook is bound to) — if no profile yet, author it first via the compile-profile rule
- ≥ 1 mechanism the patterns invoke
- ≥ 1 failure to mitigate
- 0–N exemplars demonstrating the goal

If any of these classes is missing, **stop**. The atomics aren't ready. Either:
- Run ingest on a relevant raw source to produce the missing atomics, OR
- Note the gap in `log.md` and defer the playbook until atomics exist.

### Step 2 — Validate the goal is precisely scoped

A playbook is per goal × tool. Before authoring:

- The goal verb must be specific ("control", "produce", "extract", "compose")
- The goal object must be specific (the artifact / output / state to achieve)
- The tool must be a single slug from the registry

If multiple tools apply, this is a `synthesis`, not a playbook. Switch to `compile-synthesis` skill.

### Step 3 — Draft frontmatter

Apply `.claude/rules/compile-playbook.md` §Frontmatter requirements. Critical fields:

- `goal` — the parsed-out form of the operator's "How to X best?" query, exact phrasing
- `tools: [<single slug>]`
- `model_versions: { <vendor>: "<version>" }` if version-bound
- `playbook_inputs` — every variable the wrapper must supply at instantiation
- `playbook_steps` — ordered list, each step references the atomic backing it via `uses:`
- `compiled_from` — every atomic listed above (patterns + profile + mechanisms + failures + exemplars)

### Step 4 — Compose the body

Apply the body skeleton from `.claude/rules/compile-playbook.md` §Required body skeleton.

Each step in the `## Steps` section MUST link to the atomic backing it. A step
without an atomic backing is invented, not compiled. If you find yourself
writing a step you can't ground, that's a missing atomic — go back to step 1.

The `## Example execution` section is non-negotiable. Walk through one complete
instantiation with concrete filled values. This is what proves the playbook
actually produces the goal.

### Step 5 — Add typed cross-references

- Other playbooks for the same goal on different tools (relation: `specializes` or `composes-with`)
- Broader cross-tool synthesis if one exists (relation: `specializes`)
- The tool's profile (relation: `requires`)
- Foundational concepts (relation: `requires`)

Run `qmd query "<goal>"` excluding the `playbooks` collection to find related
non-playbook artifacts that should be linked.

### Step 6 — Write the file

Write to `compiled/playbooks/<goal-slug>-in-<tool-slug>.md`.

The validate-frontmatter and check-dedupe-key hooks will block on issues.
Address any blocks before declaring complete.

### Step 7 — Ripple

For every atomic in `compiled_from`, add a typed `see_also` entry pointing at
this new playbook with relation `composed-with` (or `enabled-by` if the atomic
is a mechanism the playbook depends on).

### Step 8 — Regenerate INDEX.json

```bash
node .claude/skills/lint/build-index.mjs
```

Verify exit 0 and that the new playbook appears in INDEX.json with edges.

### Step 9 — Log

Append to `log.md`:

```
## [<date>] compile | Playbook: <goal> in <tool>

Compiled from: <count> atomics
- <list>

Atomics rippled: <count>
Cross-references added: <count>

Wrapper integration: this playbook is callable by qmd query "<goal>" -c playbooks
```

## Anti-patterns

- **Don't author a playbook ungrounded.** Every step must `uses:` an atomic. If you can't ground a step, the atomic is missing — defer the playbook.
- **Don't skip the example execution.** A playbook that doesn't show one complete instantiation is unprovable.
- **Don't make playbooks generic across tools.** Per-tool granularity is the contract. Cross-tool guidance lives in synthesis.
- **Don't hardcode operator-specific values.** Variability lives in `playbook_inputs`. The body shows the template; the example shows one filled instance.

## Reference

- Spec: `.claude/rules/compile-playbook.md`
- Wrapper integration contract: `.qmd/README.md` §Wrapper Integration
- Frontmatter schema: `policies.md` §Frontmatter Schema
