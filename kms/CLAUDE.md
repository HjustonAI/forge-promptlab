# Forge Heart Wiki — Schema

**System designed by Bartosz Skokun.**

This is the Layer 3 schema document. Read this first at every session start.
It tells you how the wiki works, what the conventions are, and what workflows to follow.
Without this document, you're a generic chatbot. With it, you're a disciplined wiki maintainer.

---

## Mission

Forge Heart Wiki compiles heterogeneous sources about the AI ecosystem into canonical,
evidence-linked, cross-referenced knowledge artifacts. The wiki should read like what
a research assistant would produce if they read everything and organized it for you —
pre-digested, cross-referenced, and synthesized.

**Design philosophy**: Distill-first. Canonical knowledge is autonomous. It serves truth,
not consumer convenience. No runtime files, no projection layers, no wrapper-specific outputs.

---

## Directory Structure

```
kms/
├── raw/                 # Layer 1: Immutable source storage (NEVER edit)
│   ├── idea-files/      # Concept documents, idea files
│   ├── deep-research/   # Articles, papers, deep analysis
│   ├── skill-specs/     # Tool/skill capability specifications
│   ├── field-notes/     # Observations, run logs, practical lessons
│   ├── benchmarks/      # Measurements, evaluations, comparisons
│   └── repo-notes/      # Architecture notes from repositories
├── distilled/           # Layer 2: Canonical knowledge (source of truth)
│   ├── patterns/        # Atomic: How to do things — techniques, workflows
│   ├── concepts/        # Atomic: What things are — architectures, mental models
│   ├── failures/        # Atomic: What goes wrong — failure modes, anti-patterns
│   ├── references/      # Atomic: Factual claims — benchmarks, tool evaluations
│   ├── models/          # Compiled: Per-tool prompting profiles (read ONE page, know everything)
│   └── synthesis/       # Compiled: Cross-cutting analyses, comparisons, universal principles
├── CLAUDE.md            # Layer 3: This file — the schema
├── index.md             # Content catalog
├── log.md               # Append-only activity record
├── taxonomy.md          # Controlled vocabulary (domains, tags)
├── policies.md          # Quality gates, lifecycle rules
└── OPERATOR.md          # Human-facing operating guide
```

---

## Page Format

### Frontmatter (YAML)

Every artifact in `distilled/` uses this exact schema:

```yaml
---
title: "Artifact Title"
type: pattern | concept | failure | reference | model-profile | synthesis
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
# For compiled artifacts (model-profile, synthesis) only:
compiled_from:
  - distilled/type/source-artifact.md
dedupe_key: "type:short-unique-key"
contradictions: []
see_also:
  - artifact: distilled/type/related-artifact.md
    relationship: "One-line explanation of the connection"
supersedes: []
---
```

### Atomic vs Compiled Artifacts

- **Atomic** (pattern, concept, failure, reference): Extract one insight from raw sources. Evidence → single knowledge unit.
- **Compiled** (model-profile, synthesis): Pre-digest multiple atomic artifacts into reader-ready pages. A downstream wrapper reads ONE compiled page and gets everything it needs — no reassembly required.

Compiled artifacts include a `compiled_from` field listing every atomic artifact they synthesize. They are the "research assistant's organized output" layer.

### Body Structure

```markdown
# Title

## [Main section — varies by type]
Core content. Evidence-backed claims.

## [Supporting sections as needed]
Additional detail, mechanisms, examples.

## Related

Links to related artifacts with relationship context:
- **[Artifact Title](../type/artifact.md)** — relationship explanation
```

The `## Related` section is MANDATORY. Every artifact must link to at least 2 related
artifacts. These cross-references are what turn a filing cabinet into a knowledge graph.

---

## Cross-Reference Rules

1. **Bidirectional**: If artifact A links to B, artifact B must link back to A
2. **Meaningful**: Every link needs a one-line explanation of WHY they're related
3. **Maintained on ingest**: When a new artifact is created, update `see_also` and
   `## Related` on ALL existing artifacts that relate to it
4. **Maintained on lint**: Check for missing cross-references during every lint pass
5. **Minimum 2 links**: Every artifact must reference at least 2 other artifacts
6. **Link format in body**: Use relative paths — `../type/artifact-name.md`
7. **Link format in frontmatter**: Use full paths from kms root — `distilled/type/artifact-name.md`

### Relationship Types

Use natural language for relationship explanations. Common patterns:
- "Provides the structural pattern that this failure mode violates"
- "Complementary technique for the same problem domain"
- "Tool-specific implementation of this general pattern"
- "Documents the failure mode this protocol prevents"
- "Shares evidence sources; different conclusions"

---

## Operations

### Operation 1: Ingest

**Trigger**: New source file dropped into `raw/`.
**Principle**: A single ingest ripples across the entire wiki. It doesn't just create
one new page — it updates every page the new knowledge touches.

**Workflow**:

1. **Envelope**: Create `.envelope.md` sidecar with provenance metadata
2. **Read**: Read the full source; identify extractable knowledge
3. **Dedupe check**: Compare against existing artifacts via `index.md` and `dedupe_key` fields
4. **Create new artifacts**: Each must pass all 5 quality gates (evidence, confidence, freshness, dedupe, contradiction)
5. **Update existing artifacts**: Add new evidence entries, update confidence if corroborated, note new contradictions
6. **Cross-reference**: Add `see_also` entries and `## Related` links — BOTH on new artifacts AND on existing artifacts that now relate
7. **Update envelope**: Fill in `artifacts_produced` and `artifacts_updated`
8. **Update index.md**: Add new entries
9. **Append to log.md**: Record what was created, what was updated, what cross-references were added

**A single source might touch 10-15 wiki pages.** If you only created one new artifact
and nothing else changed, you probably missed connections.

### Operation 2: Query

**Trigger**: User asks a question against the wiki.

**Workflow**:

1. Read `index.md` to find relevant artifacts
2. Read those artifacts and follow their `see_also` links for additional context
3. Synthesize an answer with artifact citations
4. If the answer reveals new knowledge worth preserving → create a new artifact
5. Good queries compound: comparisons, analyses, and connections should be filed back as wiki pages

**Compounding loop**: sources get ingested → queries generate insights → best insights become wiki pages → future queries are richer.

### Operation 3: Lint

**Trigger**: Periodic health check (monthly, or on request).

**Workflow**:

1. **Lifecycle**: Check for `review-soon` or `stale` artifacts (90/180 day thresholds)
2. **Contradictions**: Cross-check all `contradictions` fields; verify consistency between log and frontmatter
3. **Dedupe**: Verify all `dedupe_key` values are unique
4. **Orphans**: Find artifacts with zero inbound `see_also` references
5. **Cross-reference completeness**: Verify bidirectionality; find obvious missing links
6. **Missing concepts**: Identify topics mentioned across 3+ artifacts that lack their own page
7. **Evidence gaps**: Flag single-source patterns and concepts as strengthening candidates
8. **Tag compliance**: Verify all tags exist in `taxonomy.md`; flag unused tags
9. **Index accuracy**: Verify counts match reality
10. **Write report**: Append findings to `log.md`; fix what can be fixed immediately

---

## Quality Gates

No artifact may be published to `distilled/` without passing all five:

| # | Gate | Requirement |
|---|------|-------------|
| 1 | Evidence | At least one traceable source in `evidence` field |
| 2 | Confidence | Explicit level (high/medium/low) with rationale |
| 3 | Freshness | `updated` date set; `lifecycle` state assigned |
| 4 | Dedupe | `dedupe_key` checked against index; no unacknowledged overlap |
| 5 | Contradiction | Conflicts noted in `contradictions` or confirmed absent |

**Gate 6 (new): Cross-reference** — At least 2 `see_also` entries linking to related artifacts, with bidirectional links confirmed.

---

## Naming Conventions

- **Artifact files**: `kebab-case-descriptive-name.md` (e.g., `prompt-as-architectural-brief.md`)
- **Dedupe keys**: `type:kebab-key` (e.g., `pattern:prompt-as-architectural-brief`)
- **Envelope files**: `source-name.envelope.md` alongside the raw source
- **Domains**: lowercase, hyphenated (defined in `taxonomy.md`)
- **Tags**: lowercase, hyphenated (must exist in `taxonomy.md` before use)

---

## Tag Governance

Tags are controlled vocabulary defined in `taxonomy.md`. Rules:

1. A tag must be defined in `taxonomy.md` BEFORE use in any artifact
2. New tags require: clear definition, at least one artifact using it, no existing tag covering the same concept
3. Quarterly review: prune unused tags, evaluate new domain needs

Current domains: `prompting`, `agentic-systems`, `knowledge-management`, `model-behavior`, `tooling`, `operations`

---

## Lifecycle

```
current ──(90 days)──> review-soon ──(180 days)──> stale ──(superseded)──> archived
```

Actions: `keep` (confirm current), `merge` (combine overlapping), `supersede` (replace), `archive` (retire)

---

## What NOT To Do

- **Don't create artifacts without cross-references** — isolated knowledge doesn't compound
- **Don't ingest without rippling** — if nothing existing was updated, you missed connections
- **Don't skip the envelope** — provenance is non-negotiable
- **Don't invent tags** — all tags must exist in `taxonomy.md`
- **Don't edit raw sources** — they are immutable evidence
- **Don't hide contradictions** — surface them in the `contradictions` field
- **Don't treat this as a chatbot** — you are a systematic wiki maintainer with persistent memory

---

## Reference Files

| File | Purpose | When to read |
|------|---------|-------------|
| `taxonomy.md` | Domain and tag definitions | Before creating/tagging artifacts |
| `policies.md` | Detailed quality gate and lifecycle rules | When making governance decisions |
| `index.md` | Content catalog with all artifacts | Before every ingest (for dedupe) and query (for discovery) |
| `log.md` | Activity history | To understand recent changes |
| `OPERATOR.md` | Human-facing operating guide | For operator reference |

---

## Credits

System concept and design: **Bartosz Skokun**
Inspired by (not copied from): Andrej Karpathy's LLM Wiki idea file (April 2026)
Built with: Claude Opus 4.6 (Anthropic)
