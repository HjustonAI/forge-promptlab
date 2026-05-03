---
name: ingest
description: Run the full 9-step ingest workflow on a raw source. Produces atomic + compiled artifacts under v2 schema, ripples updates across the existing graph, regenerates INDEX.json. Invoke when a new file lands in raw/<mode>/.
allowed-tools: [Read, Write, Edit, Grep, Glob, Bash]
---

# Ingest Skill

Operational form of the canonical [ingest-pipeline](../../../distilled/patterns/ingest-pipeline.md)
pattern. This skill is the executable harness; the pattern is the why.

## Inputs the operator supplies

- `<source-path>` — path to the file in `raw/<mode>/`. The mode determines which `.claude/rules/ingest-<mode>.md` rule loads.

## Pre-flight

Before step 1, verify:
- [ ] `<source-path>` exists and is under `raw/`
- [ ] The corresponding `.claude/rules/ingest-<mode>.md` rule exists for the source's mode
- [ ] qmd is operational: `qmd status` runs cleanly
- [ ] `INDEX.json` exists and is current: `node .claude/skills/lint/build-index.mjs` exits 0

If any pre-flight check fails, fix before proceeding. **Do not proceed with broken qmd or stale INDEX.json — duplicate creation is the cost.**

## The 9 Steps

### Step 1 — Envelope

Create `<source-path>.envelope.md` sidecar with:

```yaml
---
source_file: <filename>
source_mode: <mode>             # one of: paper, article, system-prompt, creative-prompt, deep-research, tool-doc, workflow, field-note, benchmark, idea-file
origin: <where it came from — URL, person, system>
origin_date: <YYYY-MM-DD>
ingested: <today YYYY-MM-DD>
ingested_by: <agent or human identifier>
language: en | pl
mode_confidence: high | medium | low
artifacts_produced: []           # fill at end
artifacts_updated: []            # fill at end
notes: <intake observations>
---
```

**Verification**: envelope file exists; YAML parses.

### Step 2 — Read

Full read of `<source-path>`. Identify candidate extractable knowledge units.
List them in scratch (mental or comment): "this paper claims X (→ candidate
concept), describes Y technique (→ candidate pattern), warns about Z (→
candidate failure)."

**Verification**: you can articulate at least 1 candidate atomic.

### Step 3 — qmd search neighbors

For each candidate atomic, run a focused qmd query:

```bash
qmd query "<topic of candidate>" -c patterns,concepts,failures,tools,mechanisms,exemplars --json -n 8
```

Read the top 3 results' `tldr` fields. For any that look related, read the
full body via `qmd get <path>`. Build a mental neighbor-set (graph radius 1
of where the new atomic will land).

**Verification**: for every candidate, you have either (a) confirmed no near-neighbor exists, or (b) identified ≥1 neighbor for cross-linking.

### Step 4 — Dedupe check

For each candidate atomic, propose a `dedupe_key`. Check `INDEX.json`:

```bash
grep -i '"dedupe_key": "<proposed key>"' INDEX.json
```

If a collision is found, decide:
- **Merge**: existing artifact already covers this — raise its corroboration_count and add evidence entry, do NOT create new
- **Supersede**: this source supersedes the existing — set `supersedes: [<existing path>]` on new artifact and `lifecycle: archived` on old
- **Disambiguate**: same general topic, different specific claim — refine the dedupe_key to be more specific

**Verification**: every candidate has a unique dedupe_key OR an explicit merge/supersede decision recorded in envelope notes.

### Step 5 — Create atomic artifacts

For each candidate, write the atomic file under `distilled/<type>/`. Apply
the rule file for the source mode (`.claude/rules/ingest-<mode>.md`) to shape
extraction priorities, frontmatter defaults, body emphasis.

Each artifact MUST satisfy all 8 quality gates (see `policies.md`):
1. Schema (frontmatter parses) — validate-frontmatter hook will block on failure
2. Provenance (tier set, ≥1 source)
3. Confidence (level + rationale)
4. Freshness (updated, lifecycle, decay_triggers)
5. Dedupe (key unique — checked in step 4)
6. Contradiction (conflicts noted or absent)
7. Cross-references (≥2 typed see_also)
8. Retrieval (tldr ≤ 280 chars, goal set)

**Verification**: every new file passes the validate-frontmatter hook on write.

### Step 6 — Ripple existing artifacts

**This is the step most often skipped.** For every existing artifact in the
neighbor-set from step 3:

- Add a typed `see_also` entry pointing at the new atomic, with the inverse relation of the new atomic's link
- If the new source corroborates an existing claim, raise `corroboration_count`
- If the new source contradicts an existing claim, add to `contradictions`
- Update `updated:` date

Bidirectional links are mandatory. The `enforce-min-crossrefs` hook will warn
on unilateral edges; lint will catch missing reciprocals.

**Verification**: for every typed `see_also` you added on a new artifact, the target artifact has a reciprocal `see_also` pointing back.

### Step 7 — Recompile compiled artifacts

Check whether any `compiled/` artifact's `compiled_from` includes an atomic
you just touched (created or updated). If so:

- For affected `profile` artifacts: regenerate per `.claude/rules/compile-profile.md` recompile triggers
- For affected `synthesis` artifacts: regenerate per `.claude/rules/compile-synthesis.md`
- For affected `playbook` artifacts: regenerate per `.claude/rules/compile-playbook.md`

If no compiled artifacts are affected, note "no recompile needed" in envelope.

**Verification**: any compiled artifact whose `compiled_from` you touched has a fresh `updated:` date OR an explicit "no material change" note.

### Step 8 — Update envelope, index, log

- Fill `artifacts_produced` and `artifacts_updated` in the envelope (created in step 1)
- Append to `index.md` for any new artifacts (alphabetical within section)
- Append a single ingest entry to `log.md`:

```
## [<date>] ingest | <Source title>

Source: <source-path>
Mode: <mode>
Mode confidence: <high|medium|low>

Artifacts produced:
- <path> (<confidence>)
- ...

Artifacts updated (ripple):
- <path> (raised corroboration | added contradiction | added typed see_also)
- ...

Notes: <any non-trivial observations from the ingest>
```

**Verification**: envelope is complete; index has all new artifacts; log entry exists.

### Step 9 — Regenerate INDEX.json

```bash
node .claude/skills/lint/build-index.mjs
```

Expected output: 0 dedupe collisions, 0 broken links, 0 hard errors. If lint
reports issues, fix them before declaring the ingest complete.

**Verification**: lint exits 0.

## Post-flight summary

Output to operator:

```
Ingest complete: <source-path> [<mode>]

Created: N artifacts
- <list with type and title>

Updated (ripple): M artifacts
- <list with what changed>

Compiled artifacts touched: K
- <list>

INDEX.json: regenerated (Q artifacts, R edges)
Lint: clean
```

## Failure recovery

If any step fails or is skipped, **stop and surface to operator**. Do not
silently proceed. Common recovery actions:

- **Hook rejected an artifact**: read the hook's stderr, fix the violation, retry
- **qmd returned no results when neighbors should exist**: try broader query terms; if still no results, add a note in envelope and proceed (genuinely new domain)
- **Dedupe collision on intended new atomic**: see step 4 decision tree
- **Lint reports issues at step 9**: fix issues, re-run lint, only declare complete on exit 0

## Anti-patterns

- **Don't skip step 3.** qmd-search-neighbors is the operation that prevents duplicates and enables ripple. Skipping it is the single most common ingest failure.
- **Don't batch across modes.** One ingest run = one source = one mode. Mixing modes in one session conflates rule-file guidance.
- **Don't author compiled artifacts during ingest.** Ingest produces atomics and ripples; compilation (profile/synthesis/playbook) is a separate operation triggered by step 7's recompile detection.
- **Don't suppress hook errors.** If `validate-frontmatter` blocks, the schema is wrong — fix it. Bypassing the hook with manual writes defeats the deterministic-gate guarantee.

## Reference artifacts

- Pattern (the why): `distilled/patterns/ingest-pipeline.md` (re-authored under v2 in Phase E)
- Rules per mode: `.claude/rules/ingest-<mode>.md` (10 files)
- Hooks (deterministic gates): `.claude/hooks/`
- Lint (verification): `.claude/skills/lint/build-index.mjs`
