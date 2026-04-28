# Distill Policies

System designed by Bartosz Skokun.

## Boundary Rule

Distill is autonomous. It owns canonical knowledge and nothing else.

Distill MUST:
- ingest source material and transform it into canonical artifacts
- enforce quality gates on every artifact
- maintain lifecycle governance and audit trail

Distill MUST NOT:
- generate runtime files, consumer projections, or wrapper-specific outputs
- shape canonical knowledge around any downstream system's format needs
- allow unpublished artifacts to be treated as canonical

## Quality Gates

No artifact may be published to `distilled/` without passing all five gates:

| # | Gate | Requirement |
|---|------|-------------|
| 1 | Evidence | At least one traceable source reference in `evidence` field |
| 2 | Confidence | Explicit level (high/medium/low) with rationale |
| 3 | Freshness | `updated` date set; `lifecycle` state assigned |
| 4 | Dedupe | `dedupe_key` checked against index; no unacknowledged overlap |
| 5 | Contradiction | Conflicts with existing artifacts noted in `contradictions` field or confirmed absent |

If a gate cannot be satisfied, the artifact stays in draft state and is flagged in the log.

## Lifecycle States

```
current --> review-soon --> stale --> archived
```

| State | Meaning | Trigger |
|-------|---------|---------|
| current | Active, trusted knowledge | Passes all quality gates |
| review-soon | May be outdated; needs verification | 90 days since last update, or flagged |
| stale | Not reliable without re-verification | 180 days without review, or contradicted |
| archived | Preserved for history, not active use | Superseded or deprecated |

## Lifecycle Actions

| Action | What happens |
|--------|-------------|
| keep | Artifact confirmed current after review |
| merge | Two overlapping artifacts combined into one; originals archived |
| supersede | New artifact replaces old; old archived with pointer to replacement |
| archive | Artifact moved to archived state; reason recorded in log |

## Artifact Types

Six types in two tiers, corresponding to subdirectories in `distilled/`:

### Atomic Artifacts (extract from raw sources)

| Type | Directory | Purpose |
|------|-----------|---------|
| pattern | `patterns/` | How to do something — techniques, workflows, orchestration approaches |
| concept | `concepts/` | What something is — architectures, capabilities, models, mental models |
| failure | `failures/` | What goes wrong and how to repair it — failure modes, anti-patterns |
| reference | `references/` | Factual claims — benchmarks, comparisons, tool evaluations |

### Compiled Artifacts (pre-digest from atomic artifacts)

| Type | Directory | Purpose |
|------|-----------|---------|
| model-profile | `models/` | Everything needed to prompt one specific AI model — compiled from multiple atomic artifacts into one self-contained page |
| synthesis | `synthesis/` | Cross-cutting analysis — universal principles, comparison matrices, pre-built insights drawn from multiple artifacts |

Compiled artifacts include a `compiled_from` field listing every atomic artifact they synthesize. They must be updated whenever their source atoms change.

## Source Modes

Sources are classified by mode on intake. Mode determines processing expectations.

| Mode | Raw subdirectory | Processing emphasis |
|------|-----------------|-------------------|
| idea-file | `idea-files/` | Extract transferable principles and patterns |
| deep-research | `deep-research/` | Extract claims, evidence, and synthesis |
| skill-spec | `skill-specs/` | Extract capabilities, interfaces, and constraints |
| benchmark | `benchmarks/` | Extract measurements, conditions, and comparisons |
| repo-note | `repo-notes/` | Extract architecture decisions and integration patterns |
| field-note | `field-notes/` | Extract observations, failure modes, and practical lessons |

Hybrid sources: split into mode segments. Record mode confidence in the intake envelope.

## Intake Envelope

Every raw source gets an envelope (YAML frontmatter in a `.envelope.md` sidecar file):

```yaml
---
source_file: <filename>
source_mode: <mode>
origin: <where it came from>
origin_date: <when it was created/published>
ingested: <date of ingestion>
ingested_by: <agent or human>
artifacts_produced:
  - <path to canonical artifact>
notes: <any intake observations>
---
```

## Cross-Reference Rules

Every artifact must be cross-referenced. Isolated knowledge does not compound.

| Rule | Requirement |
|------|-------------|
| Minimum links | Every artifact must have at least 2 `see_also` entries |
| Bidirectional | If A links to B, B must link back to A |
| Meaningful | Every link needs a one-line explanation of the relationship |
| Body section | Every artifact must have a `## Related` section with rendered links |
| Ingest maintenance | New artifacts must add `see_also` to related existing artifacts |
| Lint maintenance | Missing cross-references are flagged during lint passes |

## Ingest Ripple Requirement

A single ingest does not just create new artifacts — it ripples across the entire wiki.

When processing a new source, the agent MUST:
1. Create new artifacts (with full quality gates)
2. Update existing artifacts with new evidence entries where the source corroborates them
3. Add `see_also` cross-references on BOTH new and existing related artifacts
4. Update `## Related` sections in the body of affected artifacts
5. Record all updates (not just creates) in the envelope and log

If a source ingest creates artifacts but touches nothing else, the agent likely missed connections.

## Index and Log

- `index.md` is the content catalog. Updated on every publish.
- `log.md` is the append-only activity record. Every ingest, review, merge, supersede, or archive gets an entry.

## Maintenance Schedule

| Frequency | Action |
|-----------|--------|
| Per ingest | Update index, append to log, run dedupe check |
| Weekly | Review artifacts in `review-soon` state |
| Monthly | Full lint pass: contradictions, orphans, stale items, taxonomy drift |
| Quarterly | Taxonomy review: prune unused tags, evaluate new domain needs |

## Tag Governance

Tags are controlled vocabulary. New tags require:
1. A clear definition added to `taxonomy.md`
2. At least one artifact that uses the tag
3. No existing tag that already covers the concept

This prevents tag entropy.
