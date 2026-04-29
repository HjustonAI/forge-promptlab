# Forge Heart Wiki — Complete Project Brief

*A knowledge management system for controlling AI behavior. Written for a project manager with technical fluency.*

System designed by **Bartosz Skokun**.

---

## 1. What This Is, In One Paragraph

Forge Heart Wiki is a **typed knowledge graph about how to control AI** — prompting techniques, agentic system designs, tool orchestration, MCP integrations, workflow patterns, and clever combinations thereof. It compiles heterogeneous sources (research papers, leaked system prompts, deep-research outputs, tool docs, idea files, n8n workflows, field notes) into atomic, evidence-linked, cross-referenced artifacts. The wiki is designed as the **long-term memory of a future "meta-prompter" agentic system** — wrappers will query the wiki to generate optimal prompts conditioned on retrieved knowledge. The wiki itself never generates prompts; it serves the typed knowledge that wrappers compose with.

---

## 2. The Problem It Solves

Today, knowledge about controlling AI is scattered across thousands of papers, articles, Reddit threads, system-prompt leaks, Discord lore, tool documentation, and field experience. Each generative AI tool (Claude, Midjourney, Veo, n8n, MCP servers) has its own surface area. When you want to do something well — "produce a cinematic shot in Veo 3," "build a research agent with Claude Code," "control character consistency in Midjourney" — you typically either:

- Re-read the same blogs (slow, no compounding)
- Trust a chatbot's training-data memory (stale, no provenance, no evidence)
- Ask a RAG system that retrieves chunks but loses cross-document insights (the "RAG cross-document insight loss" failure)

Forge Heart Wiki solves this by building a **persistent, growing, structured knowledge base** that compounds over time. Every new source ripples updates across the existing graph rather than just appending. The longer it runs, the smarter retrieval gets.

---

## 3. The Core Mental Model

Three tiers of knowledge, sharply separated:

```
┌─────────────────────────────────────────────────────────────────┐
│  RAW (immutable source material)                                │
│  ─────────────────────────────                                  │
│  Papers, articles, leaked system prompts, deep-research         │
│  outputs, tool docs, workflows, idea files, field notes.        │
│  Never edited. The audit trail.                                 │
└─────────────────────────────────────────────────────────────────┘
                            │ ingest pipeline
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  DISTILLED (atomic canonical artifacts — one source claim each) │
│  ──────────────────────────────────────────────────────────     │
│  patterns / concepts / failures / tools / mechanisms / exemplars│
│  Typed, evidence-linked, cross-referenced. The truth layer.     │
└─────────────────────────────────────────────────────────────────┘
                            │ compile
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  COMPILED (reader-ready synthesis — multiple atomics)           │
│  ──────────────────────────────────────────────────────         │
│  profiles / syntheses / playbooks                               │
│  Pre-digested, ready for wrapper consumption.                   │
└─────────────────────────────────────────────────────────────────┘
                            │ retrieve
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  WRAPPER (future meta-prompter agent — consumes the graph)      │
│  ─────────────────────────────────────────────                  │
│  Asks "How to [verb] [object] best?" → gets ranked bundle →     │
│  composes a new prompt conditioned on retrieved knowledge.      │
└─────────────────────────────────────────────────────────────────┘
```

The key design rule: **canonical knowledge is autonomous.** It doesn't shape itself for any wrapper. It serves truth, not consumer convenience.

---

## 4. The Nine Artifact Types

Every piece of knowledge fits into one of nine types. Each type captures a different *kind* of answer to the question "how do I control AI to do X?"

### Atomic types (one source claim → one file)

| Type | Captures | Example title |
|---|---|---|
| **`pattern`** | A means of controlling AI behavior — prompt structure, agentic loop, tool combo, workflow shape | "Goal-state execution", "Negative prompting", "File-handoff state machine" |
| **`concept`** | What something IS — architecture, mental model, definition | "Karpathy LLM wiki", "MCP protocol", "Distill-first architecture" |
| **`failure`** | What goes wrong — anti-pattern, observed failure mode | "Keyword salad collapse", "Hallucinated data on missing evidence" |
| **`tool`** | A controllable system — model, app, framework, generator | "Claude Opus 4.7", "Midjourney v8", "n8n", "qmd" |
| **`mechanism`** | A single knob within a tool | "Midjourney `--stylize`", "Claude `extended_thinking`", "n8n webhook trigger" |
| **`exemplar`** | A concrete instantiation worth preserving | A real prompt, an n8n workflow JSON, a leaked system prompt |

### Compiled types (multiple atomics → reader-ready)

| Type | Purpose |
|---|---|
| **`profile`** | Per-tool digest. Read ONE file → know everything about controlling that tool well. |
| **`synthesis`** | Cross-cutting analysis (e.g., "negative prompting across image, video, audio"). |
| **`playbook`** | Goal-oriented composition: "to accomplish G with tool T, compose M1+M2+M3 in order." **The wrapper's primary input.** |

The split is intentional: `tool` (lean factual surface) vs. `profile` (fat compiled digest with all the patterns/failures/exemplars). `pattern` (technique) vs. `exemplar` (literal instance of that technique). `synthesis` (cross-cutting analysis) vs. `playbook` (executable composition).

---

## 5. How Artifacts Are Structured

Every distilled/compiled file is markdown with **rich YAML frontmatter** and a **rigid body skeleton**.

### Frontmatter (the searchable, filterable, machine-traversable layer)

```yaml
---
title: "Controlling Character Consistency in Midjourney v8"
type: pattern

# Discovery — qmd uses these for retrieval
tldr: "≤ 280 chars. The wrapper reads this first, deep-reads only if relevant."
goal: "control character consistency across Midjourney v8 renders"
keywords: [character consistency, cref, identity lock]

# Orthogonal facets
modality: [image]
tools: [midjourney-v8]
abstraction_level: tool-specific
language: en

# Provenance — tiered (replaces flat confidence)
provenance:
  tier: official-doc | peer-reviewed | leaked-system-prompt |
        corroborated-community | personal-field | speculative
  sources: [...]
  corroboration_count: 3

# Lifecycle — both time and event-driven
decay_triggers:
  - event: "midjourney releases v9"
  - time_days: 90

# Typed graph edges — 11 enumerated relations
see_also:
  - artifact: distilled/failures/over-constraint-style-collapse.md
    relation: mitigates    # implements | violates | composes-with | supersedes |
                           # exemplifies | conflicts-with | specializes |
                           # generalizes | requires | enables | mitigates
    note: "optional nuance"
---
```

**Why every field exists:**

- `tldr` + `goal` + `keywords` make qmd's hybrid search find the right artifact fast
- `modality` + `tools` let the wrapper filter by domain ("only image", "only Midjourney")
- `provenance.tier` distinguishes official docs from leaked prompts from personal field notes — the meta-prompter weights these differently when generating high-stakes prompts
- `decay_triggers` are event-driven (Midjourney v9 release flips all v8 artifacts to "review-soon" instantly) — not just calendar-based
- `relation` enum turns cross-references from prose into a programmatically traversable graph

### Body skeleton (rigid — qmd indexes by section)

```markdown
# Title
## TL;DR             — one paragraph; expanded tldr
## When to use       — bullet list of trigger conditions
## How it works      — concise prose explanation
## Mechanism         — specific knobs/values (for tool, mechanism, pattern types)
## Failure modes     — what can go wrong, links to failure artifacts
## Example           — one concrete example
## Related           — rendered links from see_also, with relation tags
```

Body ≤ 200 lines. This aligns with qmd's 900-token chunking — most artifacts fit in a single chunk, preserving section coherence.

---

## 6. The Eight Quality Gates

No artifact lands in `distilled/` or `compiled/` without passing all eight:

| # | Gate | What it checks |
|---|---|---|
| 1 | Schema | Frontmatter parses against the canonical spec |
| 2 | Provenance | Tier set, ≥1 traceable source |
| 3 | Confidence | Explicit level + rationale |
| 4 | Freshness | `updated` set, lifecycle assigned, decay triggers present |
| 5 | Dedupe | `dedupe_key` is unique across the wiki |
| 6 | Contradiction | Conflicts noted explicitly |
| 7 | Cross-references | ≥ 2 typed `see_also` entries, bidirectional |
| 8 | Retrieval | `tldr ≤ 280 chars`, `goal` set on atomic + playbook |

Gates 1, 2, 5, 7, 8 are enforced **deterministically by hooks** — not "please remember." A hook is a shell script that intercepts file writes and returns exit code 2 (block) if the artifact violates the schema. This is per Claude 4.x best-practice research: prose rules in CLAUDE.md are advisory and probabilistic; hooks are absolute.

---

## 7. The Three Operations

### Operation 1: Ingest (the write path)

A new file lands in `raw/<mode>/` (paper, system-prompt, deep-research, idea-file, tool-doc, workflow, field-note, benchmark, creative-prompt, article — 10 modes). The 9-step ingest pipeline runs:

1. **Envelope** — create `.envelope.md` sidecar with provenance metadata
2. **Read** — full read; identify extractable knowledge units
3. **qmd search neighbors** — discover existing artifacts in graph radius 1
4. **Dedupe check** — verify `dedupe_key` is unique
5. **Create atomic artifacts** — each passes all 8 gates
6. **Ripple existing artifacts** — add typed `see_also`, raise corroboration counts, note contradictions on EVERY related existing artifact
7. **Recompile** — any `profile` whose tool gained new mechanisms, any `playbook` whose `compiled_from` changed
8. **Update envelope, index, log** — full audit trail
9. **Regenerate INDEX.json** — machine graph snapshot

**Critical rule**: a single ingest typically touches 5–15 wiki pages. If only one new artifact was created and nothing else changed, you missed connections. The "ripple" is what produces compounding — the property that makes the wiki worth more than the sum of its sources.

### Operation 2: Query (the read path)

The future wrapper asks: **"How to [verb] [object] best?"**

The wiki responds with a ranked bundle:

1. Most relevant `playbook` (if one exists for this goal)
2. Supporting `pattern` + `tool` profile + `mechanism` artifacts
3. Relevant `failure` artifacts (what to avoid)
4. Concrete `exemplar` artifacts (real instantiations)
5. Background `concept` artifacts (only if needed)

The wrapper composes a new prompt conditioned on the bundle. The wiki itself never generates prompts.

### Operation 3: Lint (the maintenance path)

Monthly health check:

- Lifecycle (artifacts hitting decay triggers)
- Contradictions (consistency between log and frontmatter)
- Dedupe (key uniqueness)
- Orphans (artifacts with zero inbound links)
- Cross-reference completeness (bidirectionality)
- Missing concepts (topics referenced 3+ times without their own page)
- Tag compliance (all tags exist in taxonomy)
- INDEX.json regeneration

---

## 8. The Stack — What Tools Run This

### qmd (the retrieval engine)

**qmd** is a local hybrid-search engine for markdown by Tobi Lütke (Shopify CEO). It combines three search strategies:

| Strategy | What it does | Strength |
|---|---|---|
| **BM25** | Keyword full-text search | Exact terms ("--stylize", "cref") |
| **Vector** | Semantic embedding search | Meaning-based ("control output diversity") |
| **LLM rerank** | A small local model scores top candidates | Final relevance ranking |

Everything runs **on-device** via `node-llama-cpp` with GGUF models. No cloud calls. No tokens spent on retrieval. Your GPU does the work.

**Three models auto-download** to `~/.cache/qmd/models/`:

- Embedding: **Qwen3-Embedding-0.6B** (1024-dim, 119 languages — chosen for PL+EN multilingual support)
- Reranker: Qwen3-Reranker-0.6B
- Query expansion: a fine-tuned 1.7B model that turns "how to ingest a deep research source" into multiple BM25 + vector + hyde queries

**qmd exposes 4 MCP tools** to any Claude Code session: `query`, `get`, `multi_get`, `status`. The wrapper agent calls these natively — no glue code.

**Why qmd specifically:** Karpathy explicitly recommended qmd for this use case in his LLM wiki idea file. It hits the sweet spot: better than naive grep (semantic search), better than cloud RAG (private, free per query), and natively integrated with Claude Code via MCP.

### Claude Code (the authoring agent)

The agent that maintains the wiki. Configured via:

- **`CLAUDE.md`** — the slim ~120-line kernel. Loaded at every session start. XML-walled directives per Claude 4.x best practice. Tells the agent the retrieval contract, authority hierarchy, artifact types, hard constraints, and where to find everything else.
- **`policies.md`** — the full schema spec. Loaded on demand.
- **`taxonomy.md`** — controlled vocabulary (domains, modalities, tools registry, tags, provenance tiers, relation enum).
- **`.claude/rules/`** — path-scoped rules per ingest mode (`ingest-paper.md`, `ingest-system-prompt.md`, `ingest-creative-prompt.md`, etc.). Lazy-loaded only when working in a matching `raw/<mode>/` directory.
- **`.claude/skills/`** — invocable workflows (`ingest`, `lint`, `compile-playbook`, `query`, `compile-profile`, `migrate-artifact`). Don't consume background context.
- **`.claude/hooks/`** — deterministic gates that intercept file writes. Five planned: `validate-frontmatter`, `block-raw-edits`, `check-dedupe-key`, `enforce-tag-vocab`, `enforce-min-crossrefs`.
- **`.claude/settings.json`** — registers qmd MCP server with the multilingual embedding env var; allowlists qmd Bash commands.

This split reflects empirical Claude 4.x research: monolithic CLAUDE.md files >200 lines suffer "context rot" with measurable instruction adherence drops. The kernel-plus-satellites architecture keeps token cost bounded and per-mode rules sharp.

### Index files

- **`index.md`** — human-readable catalog
- **`INDEX.json`** — machine-readable graph snapshot regenerated by lint. Wrapper agents read this for typed graph traversal (e.g., follow `composes-with` edges from a chosen playbook to its component patterns) — something qmd doesn't expose natively.
- **`log.md`** — append-only audit trail. Every ingest, lint pass, schema change, decision lock.

---

## 9. The Schema as a Knowledge Graph

The 11 typed relation values turn the wiki from a "filing cabinet" into a "graph." Each cross-reference carries semantic meaning a program can act on:

| Relation | Meaning |
|---|---|
| `implements` | A is a concrete realization of B |
| `violates` | A is a failure that breaks B |
| `composes-with` | A and B combine into a larger technique |
| `supersedes` | A replaces B |
| `exemplifies` | A is a concrete instance of B |
| `conflicts-with` | A and B make incompatible claims |
| `specializes` | A is a tool/modality-specific case of B |
| `generalizes` | A is the general principle behind B |
| `requires` | A cannot work without B |
| `enables` | A makes B possible |
| `mitigates` | A reduces or prevents B |

A wrapper traversing the graph can do mechanical reasoning: "find all patterns that `mitigate` failure F and `compose-with` tool T's profile." That's impossible with free-text relationships.

---

## 10. Where We Are Today (Project Status, 2026-04-29)

### What's done — Phase A (Spec Lock) ✅

- New v2 schema authored: 9 artifact types, structured provenance, typed relation enum, qmd-aware frontmatter
- Slim XML-walled CLAUDE.md kernel (~120 lines, hits empirical Claude 4.x adherence target)
- Full schema spec in `policies.md`
- Extended taxonomy: modalities, tool registry, provenance tiers, language axis
- README contracts for `.qmd/`, `.claude/hooks/`, `.claude/rules/`, `.claude/skills/`
- Setup script and gitignore

### What's done — Phase B (Retrieval Bootstrap) ✅

- qmd installed (`@tobilu/qmd`) with multilingual Qwen3-Embedding model (1024-dim)
- 10 collections defined; 4 currently populated (patterns, failures, concepts, raw)
- 39 documents, 128 chunks indexed
- `raw` collection excluded from default queries (envelope-pollution fix; raw is opt-in via `-c raw`)
- Per-collection semantic context strings registered (improves rerank ranking)
- qmd MCP server registered in `.claude/settings.json`
- GPU offloading verified (RTX 2080 Super, Vulkan)
- **Retrieval contract empirically validated**: a natural-language query returns distilled artifacts ahead of raw, with no envelope pollution

### What's done — first v2 artifact ✅

- `distilled/patterns/ingest-pipeline.md` authored under full v2 schema
- 5 reciprocal ripple updates to existing artifacts (lands inside the 5–15 band the pattern itself predicts — the pattern documents its own behavior accurately)
- Re-tested retrieval: new artifact lands at **rank 1** for the original test query (56% score), displacing the previous top hit

### What's open — Phase C (Migration & Authoring)

The skeleton works. The next phases broaden coverage and harden enforcement:

| Priority | Item | Why it matters |
|---|---|---|
| P0 | Author 2-3 more v2 patterns | Each new artifact stress-tests the schema, exposes gaps, builds graph density |
| P0 | First `playbook` artifact | Proves the wrapper-input format end-to-end. Goal candidate: "How to ingest a deep research source best?" |
| P1 | Backfill v1 artifacts to v2 | The mixed-syntax `see_also` pattern visible in current commit shows exactly what the migration script must handle. Big retrieval-quality lift |
| P1 | Build the lint skill | Regenerates INDEX.json. Unblocks typed-graph traversal for wrapper |
| P2 | Land hooks (warn-only → strict) | Currently README-only. Strict on `validate-frontmatter` + `block-raw-edits` from day one once shipped; warn-only on others through 2-week backfill |
| P2 | Author rule files | The 13 path-scoped `.claude/rules/ingest-*.md` files for per-mode ingest behavior |

### What's much further out — Phase D (The Wrapper)

The meta-prompter wrapper itself. It will:

1. Receive user goal: "How to [verb] [object] best?"
2. Call qmd MCP `query` with collection hint inferred from the goal
3. Read top-N tldrs, deep-read top 2-3 via `get`
4. Optionally read `INDEX.json` for typed graph traversal
5. Synthesize a new prompt conditioned on the bundle
6. (Ripple loop) File new insights back as wiki artifacts via the ingest skill

The wiki's responsibility ends at "served the right typed knowledge." The wrapper's responsibility begins at "compose a great prompt." This separation is non-negotiable — it's what keeps canonical knowledge clean.

---

## 11. Why This Architecture Will Scale

Five design properties make this system economical to grow:

1. **Expensive write, cheap read.** Ingest spends tokens lavishly (qmd searches, multi-artifact reads, ripple updates). Retrieval is essentially free (local qmd). Cost amortizes across thousands of cheap reads per ingest.

2. **Bounded session cost.** CLAUDE.md kernel ~120 lines, satellite rules lazy-loaded by path scope, skills loaded only on invocation. The agent never burns context on irrelevant material.

3. **Deterministic where it matters.** Hooks enforce schema and immutability — these are the cheap-to-enforce, expensive-to-violate invariants. Probabilistic prose is reserved for judgment calls.

4. **Compounding returns.** Each ingest ripples 5-15 updates. After 100 ingests, the graph has thousands of typed edges. Retrieval quality grows superlinearly with corpus size, not linearly.

5. **Modality-orthogonal.** Adding a new tool (Sora, ElevenLabs, a new MCP server) doesn't require schema changes — just new entries in the `tools` registry and the first `tool` artifact. The schema was designed up-front to handle text, image, video, audio, agentic, and code without retrofitting.

---

## 12. What You're Building, Strategically

This is a **strategic asset, not a database.** Three things to internalize:

1. **The wiki is the moat.** Anyone can prompt Claude. Few have a curated, evidence-tiered, cross-referenced knowledge graph about how to control AI across modalities. The longer this runs, the harder it is to replicate.

2. **The wrapper is the product.** When the meta-prompter ships, it'll be the visible interface — but its quality is bounded by the wiki's quality. The wiki investment pays off through the wrapper.

3. **The discipline is the multiplier.** Anyone can dump notes into a folder. The 8 quality gates, the typed relations, the ripple discipline, the provenance tiering — those are what turn notes into a knowledge graph that compounds. Every shortcut taken now is technical debt that compounds against you later.

---

## 13. Operating Vocabulary (for ongoing conversations)

| Term | Meaning |
|---|---|
| **Atomic artifact** | One source claim, one file. Six types. |
| **Compiled artifact** | Multi-source synthesis, reader-ready. Three types. |
| **Ripple** | The property that one ingest updates 5-15 existing artifacts, not just creates new ones. |
| **Distill-first** | Canonical knowledge is autonomous; consumers (wrappers) derive from it, never shape it. |
| **Decay trigger** | Event or time signal that flips an artifact to `review-soon` (e.g., "Midjourney v9 releases"). |
| **Provenance tier** | Structural trust level: official-doc / peer-reviewed / leaked-system-prompt / corroborated-community / personal-field / speculative. |
| **Retrieval contract** | The wrapper asks "How to [verb] [object] best?" and gets a ranked bundle of playbook + atomics + failures + exemplars. |
| **Hard constraint** | Rule enforced by a hook (deterministic), not by prose (probabilistic). |
| **Goal-tool playbook** | A playbook scoped to one goal × one tool combination. The wrapper's primary input. |
| **Graph radius 1** | All artifacts directly linked from a starting artifact. Used during ingest to find existing neighbors. |

---

## 14. Where to Read Next

| File | Purpose |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) | The agent kernel — XML-walled directives loaded each session |
| [`policies.md`](policies.md) | Full schema spec — frontmatter, body, gates, governance |
| [`taxonomy.md`](taxonomy.md) | Controlled vocabulary — domains, modalities, tools, tags, relations |
| [`OPERATOR.md`](OPERATOR.md) | Human operator's runbook |
| [`.qmd/README.md`](.qmd/README.md) | Retrieval contract and qmd integration |
| [`.claude/hooks/README.md`](.claude/hooks/README.md) | Deterministic gate contract |
| [`.claude/rules/README.md`](.claude/rules/README.md) | Path-scoped lazy rule plan |
| [`.claude/skills/README.md`](.claude/skills/README.md) | Invocable skill plan |
| [`log.md`](log.md) | Append-only activity history — every ingest, lint, decision lock |
| [`index.md`](index.md) | Human-readable catalog of artifacts |

---

After reading this, you should be able to talk about Forge Heart Wiki at any altitude: the strategic frame ("compounding knowledge moat for AI control"), the architectural frame ("typed graph with deterministic gates, hybrid local retrieval, kernel+satellites configuration"), or the operational frame ("9-step ingest pipeline with mandatory ripple, 8 quality gates, qmd MCP serving the wrapper"). The next sessions will be about authoring more artifacts and standing up the lint/migration skills — but the conceptual foundation is in place.

---

*System concept and design: Bartosz Skokun*
*Inspired by (not copied from): Andrej Karpathy's LLM Wiki idea file (April 2026)*
*Retrieval layer: qmd by Tobi Lütke (BM25 + vector + LLM rerank, on-device)*
*Built with: Claude Opus 4.7 (Anthropic)*
