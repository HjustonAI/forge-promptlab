# Forge Heart Wiki — Operator Guide

**System designed by Bartosz Skokun.**

Forge Heart Wiki is a Distill-first knowledge system for AI ecosystem intelligence.
It compiles heterogeneous sources into canonical, evidence-linked knowledge artifacts
and maintains them with quality governance over time.

---

## System Overview

```
kms/
├── raw/                 # Immutable source storage (never edit these)
│   ├── idea-files/      # Concept documents, idea files
│   ├── deep-research/   # Articles, papers, deep analysis
│   ├── skill-specs/     # Tool/skill capability specifications
│   ├── field-notes/     # Observations, run logs, practical lessons
│   ├── benchmarks/      # Measurements, evaluations, comparisons
│   └── repo-notes/      # Architecture notes from repositories
├── distilled/           # Canonical knowledge artifacts (source of truth)
│   ├── patterns/        # Atomic: How to do things — techniques, workflows
│   ├── concepts/        # Atomic: What things are — architectures, mental models
│   ├── failures/        # Atomic: What goes wrong — failure modes, anti-patterns
│   ├── references/      # Atomic: Factual claims — benchmarks, tool evaluations
│   ├── models/          # Compiled: Per-tool prompting profiles (one page = everything)
│   └── synthesis/       # Compiled: Cross-cutting analyses and comparisons
├── CLAUDE.md            # Layer 3 schema — LLM reads this first at every session
├── index.md             # Content catalog — what exists and where
├── log.md               # Activity record — what changed, when, and why
├── taxonomy.md          # Controlled vocabulary — domains, types, tags
├── policies.md          # Quality gates, lifecycle rules, maintenance schedule
└── OPERATOR.md          # This file (human-facing guide)
```

---

## Daily Operations

### Ingest a New Source

A single ingest ripples across the entire wiki. It doesn't just create one new page —
it updates every page the new knowledge touches. If you only created one artifact and
nothing else changed, you probably missed connections.

1. **Drop the source file** into the appropriate `raw/` subdirectory
2. **Create an intake envelope** (`.envelope.md` sidecar) with provenance metadata:
   ```yaml
   ---
   source_file: <filename>
   source_mode: <idea-file|deep-research|skill-spec|field-note|benchmark|repo-note>
   origin: <where it came from>
   origin_date: <when it was created/published>
   ingested: <today's date>
   ingested_by: <who/what performed the ingest>
   artifacts_produced: []  # fill after distillation
   artifacts_updated: []   # existing artifacts touched by this ingest
   notes: <any observations>
   ---
   ```
3. **Read the source** and identify extractable knowledge
4. **Create canonical artifacts** in `distilled/` — each must pass all 6 quality gates:
   - Evidence refs (at least one source reference)
   - Confidence level with rationale
   - Freshness date and lifecycle state
   - Dedupe check against existing artifacts (check index.md)
   - Contradiction check against existing knowledge
   - Cross-references (at least 2 `see_also` entries, bidirectional)
5. **Update existing artifacts** — add new evidence, update confidence if corroborated, add `see_also` cross-references, update `## Related` sections
6. **Update the envelope** with `artifacts_produced` and `artifacts_updated` paths
7. **Update index.md** with new entries
8. **Append to log.md** with ingest details (creates AND updates)

### Query the Knowledge Base

1. Read `index.md` to find relevant artifacts
2. Read those artifacts and follow their `see_also` links for additional context
3. Synthesize an answer with artifact citations
4. If the answer reveals new knowledge worth preserving, create a new canonical artifact
5. Good queries compound — comparisons, analyses, and connections should be filed back as wiki pages

### Run a Lint Pass

Check for:
- Artifacts in `review-soon` or `stale` lifecycle state
- Contradictions between artifacts (check `contradictions` fields, cross-check with log)
- Artifacts with only 1 evidence source (candidates for strengthening)
- Tags used in artifacts but not defined in taxonomy.md
- **Cross-reference completeness**: all `see_also` links are bidirectional; no artifact has fewer than 2 links
- **Orphan artifacts**: zero inbound `see_also` references from other artifacts
- **Missing concepts**: topics mentioned in 3+ artifacts but lacking their own page
- Index statistics match reality (artifact counts, confidence counts, tag counts)

Report findings in a log entry. Fix what can be fixed immediately.

---

## Quality Gates (Summary)

Every artifact in `distilled/` must have:

| Gate | Field | Requirement |
|------|-------|-------------|
| Evidence | `evidence` | At least one traceable source reference |
| Confidence | `confidence` + `confidence_rationale` | Explicit level with reasoning |
| Freshness | `updated` + `lifecycle` | Date set, state assigned |
| Dedupe | `dedupe_key` | Checked against index; no unacknowledged overlap |
| Contradiction | `contradictions` | Conflicts noted or confirmed absent |

If a gate cannot be satisfied, the artifact stays in draft and is flagged in the log.

---

## Lifecycle Management

| State | Meaning | Auto-trigger |
|-------|---------|-------------|
| current | Active and trusted | Passes all quality gates |
| review-soon | May be outdated | 90 days since last update |
| stale | Not reliable without re-verification | 180 days without review |
| archived | Historical only | Superseded or deprecated |

### Actions
- **keep** — artifact confirmed current after review; update `updated` date
- **merge** — combine overlapping artifacts; archive originals with pointer
- **supersede** — new artifact replaces old; old archived with pointer
- **archive** — remove from active use; record reason in log

---

## Maintenance Schedule

| Frequency  | What to do                                                         |
| ---------- | ------------------------------------------------------------------ |
| Per ingest | Update index, append to log, run dedupe + contradiction check      |
| Weekly     | Review `review-soon` artifacts; address any flagged contradictions |
| Monthly    | Full lint pass; check for orphans, stale items, taxonomy drift     |
| Quarterly  | Review taxonomy.md; prune unused tags; evaluate new domain needs   |

---

## Adding New Tags

Tags are governed to prevent entropy. To add a new tag:

1. Define it clearly in `taxonomy.md` under the appropriate domain
2. Ensure no existing tag already covers the concept
3. Use it in at least one artifact
4. The tag is not valid until it appears in `taxonomy.md`

---

## Frontmatter Template

```yaml
---
title: "Artifact Title"
type: pattern | concept | failure | reference
domains: [domain1, domain2]
tags: [tag1, tag2]
confidence: high | medium | low
confidence_rationale: "Why this confidence level"
lifecycle: current | review-soon | stale | archived
created: YYYY-MM-DD
updated: YYYY-MM-DD
evidence:
  - source: raw/path/to/source.md
    sections: ["Section Name"]
    claim: "What this source supports"
dedupe_key: "type:short-unique-key"
contradictions: []
see_also:
  - artifact: distilled/type/related-artifact.md
    relationship: "Why these are connected"
supersedes: []
---
```

---

## Principles

1. **Distill is autonomous** — canonical knowledge serves truth, not consumer convenience
2. **Evidence or it didn't happen** — no artifact without traceable sources
3. **Freshness is visible** — every artifact shows when it was last verified
4. **Contradictions are surfaced** — disagreements between sources are noted, not hidden
5. **Simplicity over features** — prefer fewer files with clear governance over elaborate tooling
6. **Compounding over convenience** — design choices that help knowledge accumulate win over shortcuts

---

## Credits

System concept and design: **Bartosz Skokun**
Inspired by (not copied from): Andrej Karpathy's LLM Wiki idea file (April 2026)
Built with: Claude Opus 4.6 (Anthropic)
