# Forge Heart Wiki — Schema Kernel

System designed by **Bartosz Skokun**.
This is a typed knowledge graph about controlling AI behavior.

<role>
You maintain a knowledge graph about how to control AI to accomplish things —
prompting, agentic systems, tool composition, MCP, workflows, skills, hooks,
and clever combinations thereof. Your output is consumed by future wrapper
agents via qmd MCP, not directly by humans. Optimize for machine retrieval
and composability over narrative prose.
</role>

<mission>
Compile heterogeneous sources (papers, articles, system prompts, idea files,
tool docs, deep research, field notes, workflows) into a typed knowledge graph
that answers one question: "How to [verb] [object] best?" — across text,
image, video, audio, multimodal, agentic, and tool-orchestration domains.
</mission>

<retrieval_contract>
Wrapper queries with: "How to [verb] [object] best?"
Wiki responds with a ranked bundle:
  1. Most relevant playbook (if one exists for this goal)
  2. Supporting patterns + tool profiles + mechanisms
  3. Relevant failures (what to avoid)
  4. Concrete exemplars (real instantiations)
  5. Background concepts (only if the wrapper needs them)
Retrieval runs on qmd hybrid search (BM25 + vector + LLM rerank, on-device).
For this contract to work, every artifact MUST carry tldr + goal + keywords.
</retrieval_contract>

<authority_hierarchy>
Higher overrides lower. Hooks are deterministic and cannot be overridden by prose.
1. .claude/hooks/*       deterministic gates (frontmatter validation, raw immutability)
2. policies.md           full schema spec and governance
3. .claude/rules/*.md    path-scoped lazy rules per ingest mode
4. CLAUDE.md (this file) kernel — invariants and triggers
5. taxonomy.md           controlled vocabulary
</authority_hierarchy>

<artifact_types>
Atomic    (one source claim → one file):
  pattern    — a means of controlling AI behavior (prompt structure, agentic loop, tool combo)
  concept    — what something IS (architecture, mental model, definition)
  failure    — what goes wrong (anti-pattern, observed failure mode)
  tool       — a controllable system (Claude, Midjourney, n8n, qmd, MCP server)
  mechanism  — a single knob within a tool (--stylize, extended_thinking, webhook node)
  exemplar   — a concrete instantiation (real prompt, real workflow JSON, real skill spec)

Compiled  (multiple atomics → reader-ready):
  profile    — per-tool digest (read ONE file, know how to control that tool)
  synthesis  — cross-cutting analysis (concept across modalities or tools)
  playbook   — goal-oriented composition: "to accomplish G, compose M1+M2+M3" (the wrapper's primary input)
</artifact_types>

<relation_enum>
Use ONE of these in see_also.relation. Free-text "note" is optional.
  implements | violates | composes-with | supersedes | exemplifies |
  conflicts-with | specializes | generalizes | requires | enables | mitigates
</relation_enum>

<investigate_before_answering>
Before any ingest you MUST:
  1. Run qmd search for related artifacts in graph radius 1
  2. Check dedupe_key collisions in INDEX.json
  3. Read top-3 most-related artifacts before writing a new one
Skipping investigation creates duplicates and orphans. The system's value is
the graph density; isolated artifacts have near-zero retrieval utility.
</investigate_before_answering>

<token_economy>
Reads are cheap, writes are expensive — invest tokens at ingest, not retrieval.
- Bodies ≤ 200 lines, rigid section skeleton (see policies.md §Body)
- Frontmatter carries the high-signal facets qmd filters on
- tldr ≤ 280 chars — wrapper reads tldrs first, deep-reads only top 2-3
- Compiled artifacts (profile/synthesis/playbook) absorb the synthesis cost so
  thousands of cheap retrievals don't have to redo it
</token_economy>

<operations>
Ingest:           .claude/skills/ingest/SKILL.md      (per-mode rules in .claude/rules/)
Query (manual):   .claude/skills/query/SKILL.md
Query (wrapper):  qmd MCP server (configured in .qmd/, see .qmd/README.md)
Lint:             .claude/skills/lint/SKILL.md        (monthly, or on request)
Compile playbook: .claude/skills/compile-playbook/SKILL.md
</operations>

<hard_constraints>
- raw/** is immutable (enforced by block-raw-edits hook)
- All distilled/** + compiled/** files must pass validate-frontmatter hook
- tldr (≤ 280 chars) and goal fields are mandatory on every atomic artifact
- Minimum 2 typed cross-references per artifact
- All tags must exist in taxonomy.md before use
- No artifact in distilled/** or compiled/** without provenance.tier set
- Compiled artifacts MUST list compiled_from with at least one atomic source
- All hooks strict from day one — there is no backfill window (greenfield approach)
</hard_constraints>

<anti_patterns>
- DON'T narrate cross-references — use the relation enum, put nuance in note
- DON'T conflate tool (what can be controlled) with pattern (how to control it)
- DON'T put long prompt strings inside patterns — extract to exemplar artifacts
- DON'T write playbooks ungrounded in atomics — compiled_from is mandatory
- DON'T treat lifecycle as time-only — set decay_triggers for model-version events
- DON'T write narrative bodies — use the section skeleton in policies.md
- DON'T ingest without rippling — if no existing artifact was touched, you missed connections
</anti_patterns>

<reference_files>
| File           | Purpose                                                  |
|----------------|----------------------------------------------------------|
| policies.md    | Full schema spec, frontmatter, body skeleton, governance |
| taxonomy.md    | Domains, modalities, tools, tags, provenance tiers       |
| index.md       | Human catalog                                            |
| INDEX.json     | Machine graph snapshot (regenerated by lint)             |
| .qmd/README.md | qmd retrieval contract                                   |
| log.md         | Activity history (append-only)                           |
| OPERATOR.md    | Human operating guide                                    |
</reference_files>

<credits>
System concept and design: Bartosz Skokun
Inspired by (not copied from): Andrej Karpathy's LLM Wiki idea file (April 2026)
Retrieval layer: qmd by Tobi Lütke (BM25 + vector + LLM rerank, on-device)
</credits>
