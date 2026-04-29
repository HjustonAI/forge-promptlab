# Forge Heart Wiki — Policies & Schema Spec

System designed by **Bartosz Skokun**.
This is the full governance and schema reference. CLAUDE.md is the kernel; this is the manual.

---

## Boundary Rule

The wiki is autonomous. It owns canonical knowledge about controlling AI behavior, and nothing else.

**MUST**:
- ingest source material and transform it into typed canonical artifacts
- enforce quality and shape gates on every artifact
- maintain lifecycle governance, provenance tiering, and audit trail
- expose retrieval via qmd MCP, not via custom code

**MUST NOT**:
- generate runtime files, consumer projections, or wrapper-specific outputs
- shape canonical knowledge around any downstream system's format needs
- allow draft artifacts to be retrieved as canonical
- couple to any specific wrapper implementation

---

## Artifact Types

Three tiers, nine types. Subdirectories of `distilled/` (atomic) and `compiled/` (compiled).

### Atomic — extract from raw sources, one source claim per file

| Type | Directory | Captures | Example title |
|---|---|---|---|
| `pattern` | `distilled/patterns/` | A means of controlling AI behavior (prompt structure, agentic loop, tool combo, workflow shape) | "Goal-state execution", "Negative prompting", "File-handoff state machine" |
| `concept` | `distilled/concepts/` | What something IS — architecture, mental model, definition | "Karpathy LLM wiki", "MCP", "Distill-first architecture" |
| `failure` | `distilled/failures/` | What goes wrong — anti-pattern, observed failure mode | "Keyword salad collapse", "Hallucinated data on missing evidence" |
| `tool` | `distilled/tools/` | A controllable system — what it is, version, key mechanisms list | "Claude Opus 4.7", "Midjourney v8", "n8n", "qmd" |
| `mechanism` | `distilled/mechanisms/` | A single knob within a tool — value range, observed effects | "Midjourney `--stylize`", "Claude `extended_thinking`", "n8n webhook trigger" |
| `exemplar` | `distilled/exemplars/` | A concrete instantiation worth preserving | "Anthropic's leaked Claude.ai system prompt", "Karpathy's idea-file prompt", an n8n flow JSON |

### Compiled — pre-digest from atomic artifacts, reader-ready

| Type | Directory | Purpose |
|---|---|---|
| `profile` | `compiled/profiles/` | Per-tool digest. Reading ONE file gives full knowledge of how to control that tool well — patterns, mechanisms, failures, exemplars |
| `synthesis` | `compiled/syntheses/` | Cross-cutting analysis — a concept across modalities or tools, comparison matrix, universal principle drawn from many atomics |
| `playbook` | `compiled/playbooks/` | Goal-oriented composition. The wrapper's primary input. "To accomplish G with tool T, compose M1+M2+M3 in order, with rationale" |

Compiled artifacts MUST list `compiled_from` with at least one atomic source and MUST be regenerated when their sources change.

---

## Frontmatter Schema (canonical)

```yaml
---
title: "..."
type: pattern | concept | failure | tool | mechanism | exemplar | profile | synthesis | playbook

# Discovery (qmd-critical — see .qmd/README.md)
tldr: "≤ 280 chars. Wrapper reads this first to decide whether to deep-read."
goal: "verb + object — e.g., 'control character consistency in Midjourney v8'"   # required on atomic + playbook
applicable_to_goals:                                                              # optional, atomic
  - "...other goals this artifact supports..."
keywords: [high-precision-search-terms, BM25-targets]

# Orthogonal facets (qmd filters on these)
modality: [text, image, video, audio, multimodal, agentic, code, 3d]
tools: [claude-opus-4-7, midjourney-v8, veo-3, n8n, ...]                         # tool slugs from taxonomy.md
model_versions:                                                                   # optional, only when version-bound
  midjourney: "v8"
  veo: "3"
abstraction_level: tool-specific | technique | architectural | universal-principle
language: en | pl
domains: [prompting, agentic-systems, knowledge-management, model-behavior, tooling, operations, generative-media, automation]
tags: [tag1, tag2]                                                                # must exist in taxonomy.md

# Provenance — tiered (replaces flat confidence)
provenance:
  tier: official-doc | peer-reviewed | leaked-system-prompt | corroborated-community | personal-field | speculative
  sources:
    - source: raw/path/to/source.md
      sections: ["Section Name"]
      claim: "What this source supports"
  corroboration_count: 1
confidence: high | medium | low
confidence_rationale: "Why this confidence level"

# Lifecycle — both time and event-driven
lifecycle: current | review-soon | stale | archived
decay_triggers:
  - event: "midjourney releases v9"
  - time_days: 90
created: YYYY-MM-DD
updated: YYYY-MM-DD

# Typed graph edges (mandatory min 2 for atomic; compiled may have more)
see_also:
  - artifact: distilled/type/related-artifact.md
    relation: implements | violates | composes-with | supersedes | exemplifies | conflicts-with | specializes | generalizes | requires | enables | mitigates
    note: "optional free-text nuance"

# Compiled artifacts only
compiled_from:
  - distilled/type/source-atomic.md

# Playbook artifacts only
playbook_steps:
  - step: "Pick a clean reference image"
    uses: distilled/patterns/reference-image-selection.md
  - step: "Set --cref with weight 0.6"
    uses: distilled/mechanisms/midjourney-cref.md
playbook_inputs:                                                                  # what the wrapper must supply
  - name: subject_description
    type: noun-phrase
    required: true

dedupe_key: "type:kebab-key"
contradictions: []
supersedes: []
---
```

---

## Body Skeleton (rigid)

Every artifact body uses this skeleton. qmd indexes by section, so the wrapper can selectively read just the section it needs. Total body ≤ 200 lines.

```markdown
# Title

## TL;DR
One paragraph. Duplicates frontmatter.tldr expanded. qmd-indexed for retrieval.

## When to use
Bullet list of trigger conditions — "use this when…"

## How it works
Mechanism explained in prose. Concise.

## Mechanism / Parameters     (for tool, mechanism, pattern types)
Specific knobs, values, ranges.

## Failure modes               (for pattern, tool — link to failure artifacts)
What can go wrong. Link via see_also relation: violates / mitigates.

## Example
One concrete example. For long examples (system prompts, JSON workflows),
extract to an exemplar artifact and link via relation: exemplifies.

## Related
Rendered links from see_also. Each line: **[Title](../type/file.md)** (relation) — note.
```

For compiled types (profile, synthesis, playbook), see the per-type templates in `.claude/rules/`.

---

## Quality Gates

No artifact may be published without passing all eight gates:

| # | Gate | Requirement | Enforcement |
|---|------|-------------|-------------|
| 1 | Schema | Frontmatter parses against canonical schema | Hook `validate-frontmatter` |
| 2 | Provenance | `provenance.tier` set, ≥1 source in `provenance.sources` | Hook |
| 3 | Confidence | Explicit level + rationale | Hook |
| 4 | Freshness | `updated` set, `lifecycle` assigned, `decay_triggers` present where applicable | Hook |
| 5 | Dedupe | `dedupe_key` unique across wiki | Hook |
| 6 | Contradiction | Conflicts noted in `contradictions` or confirmed absent | Lint |
| 7 | Cross-references | ≥ 2 typed `see_also` entries, bidirectional | Hook |
| 8 | Retrieval | `tldr` ≤ 280 chars, `goal` set on atomic + playbook | Hook |

Failing any gate → artifact stays draft, flagged in log.

---

## Provenance Tiers (replaces flat confidence)

Confidence remains as a coarse label, but **tier** is the structural truth:

| Tier | Trust characteristic | Example sources |
|---|---|---|
| `official-doc` | First-party authoritative | Anthropic docs, Midjourney official guide |
| `peer-reviewed` | External validation | arXiv paper, formally reviewed publication |
| `leaked-system-prompt` | First-party but unofficial | Leaked Claude.ai system prompt |
| `corroborated-community` | ≥ 3 independent community confirmations | Reddit threads, Discord lore with corroboration |
| `personal-field` | Direct field observation by operator | Bartek's run notes |
| `speculative` | Single-source, untested, worth tracking | Idea file, hypothesis |

A meta-prompter generating high-stakes prompts weights tiers differently. Don't collapse them.

---

## Lifecycle

```
current ──(decay trigger)──> review-soon ──(180 days OR event)──> stale ──(superseded)──> archived
```

| State | Trigger | Action |
|---|---|---|
| `current` | Passes all gates | Active retrieval |
| `review-soon` | 90 days OR `decay_triggers.event` fires | Verify still accurate |
| `stale` | 180 days without review OR contradicted | Re-verification required before retrieval |
| `archived` | Superseded or deprecated | Preserved with pointer; excluded from default qmd retrieval |

Decay triggers are event-driven, not just time-driven — a Midjourney v9 release flips all `model_versions.midjourney: "v8"` artifacts to `review-soon` immediately, not in 90 days.

Actions: `keep` | `merge` | `supersede` | `archive`.

---

## Source Modes (raw intake)

Raw sources are classified by mode on intake. Mode determines which `.claude/rules/ingest-*.md` rules load.

| Mode | Raw subdirectory | Processing emphasis |
|---|---|---|
| `paper` | `raw/papers/` | Extract claims, evidence, formal definitions |
| `article` | `raw/articles/` | Extract patterns, distill takeaways |
| `system-prompt` | `raw/system-prompts/` | Extract patterns + create exemplar; preserve verbatim |
| `creative-prompt` | `raw/creative-prompts/` | Extract patterns + parameter values + create exemplar |
| `deep-research` | `raw/deep-research/` | Extract claims, contradictions, synthesis seeds |
| `tool-doc` | `raw/tool-docs/` | Extract capabilities → tool + mechanisms |
| `workflow` | `raw/workflows/` | Extract patterns + create exemplar (preserve full JSON/spec) |
| `field-note` | `raw/field-notes/` | Extract observations, failure modes, lessons |
| `benchmark` | `raw/benchmarks/` | Extract measurements, conditions, comparisons |
| `idea-file` | `raw/idea-files/` | Extract transferable principles and seed concepts |

Hybrid sources: split into mode segments. Record mode confidence in the envelope.

---

## Intake Envelope

Every raw source gets a `.envelope.md` sidecar:

```yaml
---
source_file: <filename>
source_mode: <mode>
origin: <where it came from — URL, person, system>
origin_date: <when it was created/published>
ingested: <date>
ingested_by: <agent or human>
language: en | pl
artifacts_produced:
  - <path to canonical artifact created>
artifacts_updated:
  - <path to existing artifact this ingest updated>
mode_confidence: high | medium | low
notes: <intake observations>
---
```

---

## Cross-Reference Rules

The graph is the value. Rules:

| Rule | Requirement |
|---|---|
| Minimum links | Atomic ≥ 2, compiled ≥ 3 typed `see_also` entries |
| Bidirectional | If A links to B, B must link back to A |
| Typed | Every link uses one of the 11 relation enum values |
| Body section | Every artifact has `## Related` rendering the links |
| Ingest maintenance | New artifacts add `see_also` to ALL related existing artifacts |
| Lint maintenance | Missing/broken cross-references flagged monthly |

### Relation Enum

| Relation | Meaning |
|---|---|
| `implements` | A is a concrete realization of B |
| `violates` | A is a failure that breaks B |
| `composes-with` | A and B combine into a larger technique |
| `supersedes` | A replaces B (B should be archived) |
| `exemplifies` | A is a concrete instance of B |
| `conflicts-with` | A and B make incompatible claims |
| `specializes` | A is a tool/modality-specific case of B |
| `generalizes` | A is the general principle behind B |
| `requires` | A cannot work without B |
| `enables` | A makes B possible |
| `mitigates` | A reduces or prevents B (typically B is a failure) |

---

## Ingest Ripple Requirement

A single ingest creates ripples across the graph. The agent MUST:

1. Run qmd search → discover related artifacts in graph radius 1
2. Create new atomic artifacts (each passes all 8 gates)
3. Update existing artifacts where the new source corroborates them (raise `corroboration_count`, possibly `confidence`)
4. Add typed `see_also` cross-references on BOTH new and existing artifacts
5. Recompile any `profile` whose tool gained new mechanisms/patterns/exemplars
6. Re-evaluate any `playbook` whose `compiled_from` artifacts changed
7. Update envelope (`artifacts_produced`, `artifacts_updated`)
8. Update `index.md` and append to `log.md`
9. Trigger INDEX.json regeneration (lint skill)

**A single source typically touches 5–15 wiki pages.** If you only created one new artifact and nothing else changed, you missed connections. Run another qmd search.

---

## Naming Conventions

- Artifact files: `kebab-case-descriptive-name.md`
- Dedupe keys: `type:kebab-key` (e.g., `pattern:goal-state-execution`)
- Tool slugs: `vendor-name-version` (e.g., `claude-opus-4-7`, `midjourney-v8`, `veo-3`)
- Envelope files: `<source-name>.envelope.md` next to the raw source
- Domains, tags, modalities: lowercase, hyphenated, defined in `taxonomy.md`

---

## Tag Governance

Tags are controlled vocabulary. New tags require:

1. Definition added to `taxonomy.md`
2. ≥ 1 artifact using the tag
3. No existing tag covering the same concept
4. Quarterly review prunes unused tags

Tag entropy = retrieval entropy.

---

## Index, INDEX.json, Log

- `index.md` — human-readable catalog. Updated on every publish.
- `INDEX.json` — machine-readable graph snapshot (artifacts × edges × facets). Regenerated by lint skill. Wrapper agents read this for typed graph traversal that qmd doesn't do natively.
- `log.md` — append-only activity record. Every ingest, review, merge, supersede, archive, or lint pass gets an entry.

---

## Maintenance Schedule

| Frequency | Action |
|---|---|
| Per ingest | Update index, append to log, regenerate INDEX.json, run dedupe check |
| Weekly | Review artifacts in `review-soon` |
| Monthly | Full lint pass: contradictions, orphans, stale items, taxonomy drift, INDEX.json validity |
| Quarterly | Taxonomy review: prune tags, evaluate new domains, audit tool/mechanism coverage |
| Event-driven | Model version release → flip all artifacts with matching `model_versions` to `review-soon` |

---

## Hook Contract

Hooks (`.claude/hooks/*.sh`) enforce what prose cannot. See `.claude/hooks/README.md` for details.

| Hook | Event | Action | Status |
|---|---|---|---|
| `validate-frontmatter` | PreToolUse Write to `distilled/**` `compiled/**` | Reject on schema mismatch | Strict |
| `block-raw-edits` | PreToolUse Edit/Write to `raw/**` | Reject all writes | Strict |
| `check-dedupe-key` | PreToolUse Write | Reject on collision | Strict |
| `enforce-tag-vocab` | PreToolUse Write | Reject tags not in taxonomy.md | Strict |
| `enforce-min-crossrefs` | PreToolUse Write | Reject on < 2 typed see_also | Strict |

All hooks strict from day one. The greenfield approach (Phase D purification clears the v1 corpus before re-ingest) means no backfill window is needed — every artifact is authored under v2 from creation.

---

## Greenfield Note

This spec replaces the previous v1 schema (six types, flat confidence, prose relations). The v1 corpus is treated as design scaffolding — it informed the v2 schema design but is not migrated. Phase D purification deletes the v1 corpus; Phase E re-ingests source material under v2 rules from raw/. All hooks ship strict from day one. See `log.md` for the pivot entry (2026-04-30).
