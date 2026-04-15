# Forge Heart Wiki - Idea File

Status: v1 concept seed
Purpose: Give an agentic LLM system a clear idea to build and evolve Forge Heart Wiki from zero.

## 1) Why this file exists

In the agent era, we do not need to share one fixed implementation.
We share a strong idea, clear constraints, and quality rules.
Then each agent builds a local version adapted to project context.

This file is that idea for Forge Heart Wiki.

## 2) The mindset we take (inspired, not copied)

What we take from Karpathy-style thinking:
1. Knowledge should compound, not reset on every query.
2. Raw sources should stay traceable and mostly immutable.
3. A maintained markdown knowledge base can beat ad-hoc retrieval.
4. Index and log are enough for control at practical scale.
5. The agent should do maintenance work humans avoid.

What we change for Forge Heart Wiki:
1. Distill is the core platform, not a side utility.
2. Focus is AI ecosystem intelligence (prompts, agentic patterns, tooling, integrations).
3. We require explicit quality governance (confidence, freshness, dedupe, contradiction).
4. We separate canonical knowledge from consumer projections.
5. Wrappers adapt to Distill, never the reverse.

## 3) Core thesis

Forge Heart Wiki is a living Distill brain for AI ecosystem operations.

It must:
1. absorb heterogeneous sources (idea files, deep research, skill specs, run logs, repos, tool docs),
2. convert them into canonical, evidence-linked knowledge,
3. project compact operational views for downstream systems,
4. remain searchable, maintainable, and trustworthy over time.

## 4) Architecture shape

### A. Raw World (input memory)

Raw sources organized by source class.
No silent semantic rewriting.
Every source has provenance metadata.

### B. Canonical Brain (distilled truth)

Canonical artifacts that capture:
1. prompt patterns and anti-patterns,
2. failure and repair intelligence,
3. workflow and orchestration patterns,
4. capability and limitation maps,
5. transferability notes across model families.

Canonical is source of truth.

### C. Operational Views (derived projections)

Runtime cards, overlays, bundles generated from canonical refs.
These are consumer-facing and compact.
They are not the truth layer.

### D. Control Ledger

index.md:
- what exists and where.

log.md:
- what changed, when, and why.

## 5) Human-agent contract

Human responsibilities:
1. choose domains and priorities,
2. provide sources,
3. approve high-impact changes,
4. resolve unresolved contradictions.

Agent responsibilities:
1. ingest and classify sources,
2. distill into canonical contracts,
3. enforce quality gates,
4. maintain index/log,
5. propose merges, supersessions, and archives.

## 6) Distill pipeline model

The pipeline must be adaptive by source mode, with static quality gates.

Static gates always on:
1. intake envelope,
2. evidence capture,
3. canonical schema mapping,
4. validation gate,
5. publication gate,
6. lifecycle governance.

Adaptive mode packs:
1. idea-file mode,
2. skill/tool spec mode,
3. deep-research mode,
4. benchmark/eval mode,
5. repo/workflow mode,
6. run-log/field-note mode.

Hybrid sources:
- split into mode segments,
- keep mode confidence trace in log.

## 7) Quality constitution

No canonical publish without:
1. evidence refs,
2. confidence level,
3. freshness state/date,
4. dedupe check,
5. contradiction check.

Lifecycle states:
- current -> review-soon -> stale -> archived

Lifecycle actions:
- keep, merge, supersede, archive

## 8) Searchability and maintenance doctrine

1. Taxonomy v1 is explicit and controlled.
2. Tag growth is governed to prevent entropy.
3. Contradictions are surfaced, not hidden.
4. Stale knowledge is managed continuously.
5. Maintenance loops are scheduled (weekly, biweekly, monthly).

## 9) Build mandate for the agent

When this idea file is given to an agent, it must:
1. create project structure for kms/raw, kms/distilled, kms/runtime,
2. install taxonomy, policies, and templates,
3. set agent schema for current platform,
4. run first ingestion wave and produce canonical artifacts,
5. generate first projection artifacts,
6. output quality report and open risks.

## 10) First success criteria

Within first iteration, system should demonstrate:
1. successful ingest of at least 3 different source modes,
2. canonical artifacts with full metadata coverage,
3. projection artifacts linked to canonical refs,
4. consistent index/log updates,
5. visible contradiction and dedupe behavior,
6. operator can find and audit key knowledge quickly.

## 11) Non-goals

This system is not:
1. a generic note-taking app,
2. a wrapper-coupled prompt helper,
3. a black-box vector-only retrieval stack,
4. a one-time static documentation dump.

## 12) Final directive

Build Forge Heart Wiki as a durable knowledge engine.
Optimize for compounding intelligence, not short-term convenience.

If a design choice improves quick output but harms traceability, trust, or maintenance, reject it.
