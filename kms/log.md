# Forge Heart Wiki — Activity Log

Append-only record. Each entry: date, action type, details.

---

## [2026-04-16] system | Initial Build

Action: Created Forge Heart Wiki knowledge management system from zero.
Agent: distill-agent (claude-opus-4-6)
Operator: Bartosz Skokun

Files created:
- kms/policies.md — Quality gates, lifecycle rules, maintenance schedule
- kms/taxonomy.md — Controlled vocabulary v1 (6 domains, 18 tags)
- kms/index.md — Content catalog
- kms/log.md — This file

Decision rationale documented in OPERATOR.md.

---

## [2026-04-16] ingest | Forge Heart Wiki Idea File v1

Source: raw/idea-files/forge-heart-wiki-idea-v1.md
Mode: idea-file
Mode confidence: high

Artifacts produced:
- distilled/patterns/idea-file-as-knowledge-seed.md (high confidence)
- distilled/patterns/distill-first-architecture.md (high confidence)
- distilled/concepts/canonical-vs-projection-separation.md (high confidence)

Notes:
- Primary concept source for the system itself
- Extracted 3 transferable principles
- Noted philosophical divergence with Karpathy on canonical/projection separation

---

## [2026-04-16] ingest | Karpathy LLM Wiki Deep Research

Source: raw/deep-research/karpathy-llm-wiki-guide.md
Mode: deep-research
Mode confidence: high

Artifacts produced:
- distilled/concepts/wiki-vs-rag.md (high confidence)
- distilled/concepts/knowledge-compounding.md (high confidence)
- distilled/patterns/three-layer-knowledge-architecture.md (high confidence)
- distilled/references/llm-wiki-tool-ecosystem.md (medium confidence)

Notes:
- Rich source with architectural claims, tool references, historical context
- Knowledge compounding concept cross-referenced with idea-file source (dedupe: merged evidence, not split artifact)
- Tool ecosystem reference marked medium confidence — tools evolve, snapshot will age
- Noted design adaptation: Forge Heart Wiki modifies three-layer to two-layer with governance decomposition

---

## [2026-04-16] ingest | RAG vs Compiled Knowledge Field Observations

Source: raw/field-notes/rag-vs-compiled-knowledge-field-observation.md
Mode: field-note
Mode confidence: medium

Artifacts produced:
- distilled/failures/rag-cross-document-insight-loss.md (medium confidence)
- distilled/failures/confidence-decay-without-lifecycle.md (medium confidence)
- distilled/patterns/llm-maintenance-cost-shift.md (high confidence — corroborated by 2 other sources)

Notes:
- Observation 4 (tag entropy) not given own artifact — reinforces taxonomy policy already in place
- Failure artifacts marked medium confidence because evidence is synthesized/observational, not primary-source experimental
- LLM maintenance cost shift elevated to high confidence because Karpathy's claims and the idea file independently support the same conclusion

---

## [2026-04-16] quality | Dedupe Check — Initial Wave

Checked all 10 artifacts for overlap.

Overlap detected:
- knowledge-compounding.md and wiki-vs-rag.md both discuss compounding
  Resolution: Kept separate. wiki-vs-rag covers the architectural comparison; knowledge-compounding covers the mechanism and enabling conditions. Different dedupe_keys, complementary scope.

- distill-first-architecture.md and canonical-vs-projection-separation.md overlap on separation principle
  Resolution: Kept separate. distill-first is a pattern (how to build); canonical-vs-projection is a concept (what the principle means). Pattern references concept.

No merges required.

---

## [2026-04-16] quality | Contradiction Check — Initial Wave

Active contradictions noted:

1. **Karpathy's wiki-as-both-truth-and-surface vs Forge Heart Wiki's canonical/projection split**
   Artifact: distilled/patterns/distill-first-architecture.md
   Severity: philosophical-divergence
   Status: Acknowledged and documented. Not a factual error — a design choice difference.
   Resolution: Both approaches are valid for different scales. Karpathy's for single-user; Forge Heart Wiki's for multi-consumer.

2. **RAG nuance in wiki-vs-rag.md**
   Artifact: distilled/concepts/wiki-vs-rag.md
   Severity: nuance
   Status: Acknowledged. The artifact presents Karpathy's argument for wiki superiority but explicitly notes RAG advantages at large scale.

No unresolved factual contradictions.

---

## [2026-04-16] ingest | Claude Cowork Context File

Source: raw/deep-research/claude-cowork.ctx.md
Mode: skill-spec
Mode confidence: high

Artifacts produced:
- distilled/patterns/goal-state-execution.md (high confidence)
- distilled/patterns/file-handoff-state-machine.md (high confidence)
- distilled/patterns/prompt-as-architectural-brief.md (high confidence, co-sourced with 3 others)
- distilled/failures/ambiguity-as-silent-execution.md (high confidence, co-sourced with 2 others)
- distilled/references/claude-cowork-architecture.md (medium confidence)

Notes:
- Rich source with 8 documented failure modes and repair strategies
- Two patterns extracted as transferable cross-cutting artifacts (prompt-as-architectural-brief, ambiguity-as-silent-execution) with evidence from this source combined with other sources
- Goal-state execution (Done Framework) is a transferable agent orchestration pattern
- File Handoff pattern solves context bloat in multi-agent systems

---

## [2026-04-16] ingest | Gemini Deep Research Context File

Source: raw/deep-research/gemini-deep-research.ctx.md
Mode: skill-spec
Mode confidence: high

Artifacts produced:
- distilled/patterns/uncertainty-and-conflict-protocol.md (high confidence)
- distilled/patterns/prompt-as-architectural-brief.md (co-sourced)
- distilled/failures/ambiguity-as-silent-execution.md (co-sourced)
- distilled/failures/hallucinated-data-on-missing-evidence.md (high confidence)
- distilled/references/gemini-deep-research-parameters.md (medium confidence)

Notes:
- Uncertainty protocol is critical and broadly transferable — agents fabricate rather than admit absence
- Conflict resolution as analytical output is a novel prompting technique
- Up to 160 web queries and 900k tokens per task — significant resource envelope
- Source policy (whitelist/blacklist) prevents browsing drift to SEO garbage

---

## [2026-04-16] dedupe | LLM Wiki Context File

Source: raw/deep-research/llm-wiki.ctx.md
Mode: skill-spec
Mode confidence: high

Artifacts produced: NONE (dedupe resolution)

Dedupe decision:
- Heavy overlap with existing artifacts:
  - wiki-vs-rag.md — same core thesis (wiki beats RAG)
  - three-layer-knowledge-architecture.md — same architecture (raw/wiki/schema)
  - idea-file-as-knowledge-seed.md — same concept (idea file as portable seed)
- Unique content (setup prompt architecture: domain declaration, source inventory, tool preferences) is a specialization of the idea-file pattern, not a distinct concept
- Resolution: Added as supplementary evidence to 3 existing artifacts. No new artifact created.

Existing artifacts augmented:
- distilled/patterns/idea-file-as-knowledge-seed.md — added evidence re: binding constraints (domain, platform, sources, tooling)
- distilled/patterns/three-layer-knowledge-architecture.md — added evidence re: full paste triggering full pattern
- distilled/concepts/wiki-vs-rag.md — added evidence re: persistent schema behavior

---

## [2026-04-16] ingest | Midjourney V8 Context File

Source: raw/deep-research/midjourney.ctx.md
Mode: skill-spec
Mode confidence: high

Artifacts produced:
- distilled/patterns/explicit-component-ordering.md (high confidence, co-sourced with Veo3 + Cowork + Gemini DR)
- distilled/failures/keyword-salad-prompt-collapse.md (high confidence)
- distilled/references/midjourney-v8-calibration.md (medium confidence)

Notes:
- V8's shift to "literal executor" is a paradigm change from V7's "artistic interpreter"
- Keyword salad failure is broadly generalizable beyond image generation
- Rich calibration data (--s, --sw, --chaos ranges) — medium confidence because V8 is alpha and parameters may evolve
- Typography requires double-quote clusters of max 4 words — novel V8 capability

---

## [2026-04-16] ingest | Veo3 Context File

Source: raw/deep-research/veo3.ctx.md
Mode: skill-spec
Mode confidence: high

Artifacts produced:
- distilled/patterns/explicit-component-ordering.md (co-sourced)
- distilled/patterns/delta-only-continuation.md (high confidence)
- distilled/references/veo3-production-parameters.md (medium confidence)

Notes:
- Joint audio-video latent denoising is architecturally distinctive — audio is not post-processing
- Dialogue syntax (colon+quotes) is a hard routing token requirement, not formatting preference
- Delta-only continuation pattern is transferable to any iterative AI workflow
- Component ordering (Camera→Subject→Action→Context→Style→Audio→Negatives) is architecturally mandated

---

## [2026-04-16] quality | Dedupe Check — Wave 2

Checked all 12 new artifacts for overlap with existing 10 and with each other.

Cross-artifact overlaps managed:
- prompt-as-architectural-brief.md draws evidence from 4 sources (Cowork, Gemini DR, LLM Wiki, Veo3) — single artifact, not 4 separate ones
- explicit-component-ordering.md draws evidence from 4 sources (Veo3, MJ V8, Cowork, Gemini DR) — single artifact, not 4 separate ones
- ambiguity-as-silent-execution.md draws evidence from 3 sources (Cowork, Gemini DR, Veo3) — single artifact

Potential overlaps reviewed:
- uncertainty-and-conflict-protocol.md vs hallucinated-data-on-missing-evidence.md: Kept separate. Protocol is the pattern (repair); hallucinated data is the failure mode (problem). Pattern references failure.
- goal-state-execution.md vs prompt-as-architectural-brief.md: Kept separate. Goal-state is a specific execution model; architectural brief is a general prompting paradigm. Goal-state is one implementation of the brief pattern.

No merges required.

---

## [2026-04-16] quality | Contradiction Check — Wave 2

New contradictions noted:

1. **Interactive vs autonomous execution defaults**
   Artifact: distilled/failures/ambiguity-as-silent-execution.md
   Severity: nuance
   Status: Documented. LLM Wiki setup uses "walk me through" for interactive mode; Cowork/Gemini DR/Veo3 default to autonomous. Not a contradiction — different tool designs for different use cases.

2. **Literal vs interpretive execution paradigms**
   Artifacts: distilled/references/midjourney-v8-calibration.md, distilled/failures/keyword-salad-prompt-collapse.md
   Severity: context-dependent
   Status: Noted. V8 is literal; V7 was interpretive. This is a version shift, not a contradiction. Keyword salad worked in V5-V6 but fails in V8. Prompt techniques are not universally transferable across model versions.

No unresolved factual contradictions.

---

## [2026-04-16] taxonomy | Tag Governance — Wave 2

New tags added to taxonomy.md:
- `prompt-ordering` (prompting) — used by explicit-component-ordering.md
- `agent-communication` (agentic-systems) — used by file-handoff-state-machine.md
- `generative-tool` (tooling) — used by midjourney-v8-calibration.md, veo3-production-parameters.md
- `research-tool` (tooling) — used by gemini-deep-research-parameters.md

All new tags have definitions and at least one artifact using them.
Total tags: 22 (was 18).

---

## [2026-04-16] ingest | Gemini Deep Research Context File Generation

Source: raw/deep-research/Gemini Deep Research Context File Generation.md
Mode: deep-research
Mode confidence: high (research-generated with explicit evidence grading)

Source characteristics:
- 604 lines, Gemini Deep Research self-generated
- 49-item source ledger with trust-level classification (Tier 1-4)
- 12 parameterized prompt templates (Section 6)
- 7 core prompting principles (PR-01 through PR-07)
- Meta-instructions for downstream LLMs (Section 7)

Artifacts produced:
- distilled/failures/outcome-driven-constraint-violation.md (high confidence, NEW)
- distilled/patterns/explainable-reasoning-trace.md (high confidence, NEW)
- distilled/patterns/evidence-tiered-source-policy.md (high confidence, NEW)

Existing artifacts augmented:
- distilled/references/gemini-deep-research-parameters.md — upgraded from medium to high confidence with second source
- distilled/patterns/uncertainty-and-conflict-protocol.md — added deeper evidence (DeepSearchQA benchmark, epistemic uncertainty distinction)

Dedupe decisions:
- Core prompting principles (PR-01 through PR-06): overlap with existing gemini-deep-research-parameters.md, prompt-as-architectural-brief.md, uncertainty-and-conflict-protocol.md, ambiguity-as-silent-execution.md. Used as augmentation evidence, not new artifacts.
- 12 prompt templates (Section 6): high operational value but are specialized instances of existing patterns. Preserved in raw source for reference rather than duplicated as canonical artifacts.
- PR-07 (KPI-Driven Alignment): genuinely new failure mode → new artifact created
- PR-03 (ERT): more specific than existing uncertainty protocol → new artifact created
- Section 8 (Official vs Heuristic): novel meta-practice → new artifact created (evidence-tiered-source-policy.md)

---

## [2026-04-16] quality | Contradiction Check — Wave 3

New contradiction noted:

1. **ERT cost tradeoff**
   Artifact: distilled/patterns/explainable-reasoning-trace.md
   Severity: tradeoff
   Status: Documented. ERT increases token consumption and slows generation. This is an explicit cost/quality tradeoff — use ERT for high-stakes analysis, omit for routine tasks.

No unresolved factual contradictions.

---

## [2026-04-16] quality | Confidence Upgrade

- distilled/references/gemini-deep-research-parameters.md: medium → high (second independent source with 49-item evidence ledger added)

---

## [2026-04-16] quality | First Lint Pass — Full Knowledge Base

Agent: distill-agent (claude-opus-4-6)
Scope: All 26 canonical artifacts, 9 raw sources, governance files

### Lifecycle / Freshness

- **All 26 artifacts**: lifecycle `current`, created 2026-04-16
- **No freshness issues**: System is 0 days old. First review-soon window at 90 days (2026-07-15).
- **Status: PASS**

### Dedupe Keys

- All 26 dedupe_keys verified unique. No collisions.
- **Status: PASS**

### Tag Compliance

- All 21 unique tags used across artifacts are defined in taxonomy.md.
- No undefined tags found.
- **3 unused tags** (entire `model-behavior` domain): `capability-map`, `behavioral-quirk`, `cross-model` — no artifacts use any of these.
- **Status: PASS** (unused tags are not a violation; domain was created for future use)

### Contradiction Cross-Check

5 artifacts carry non-empty contradictions fields:

| Artifact | Severity | Logged? |
|----------|----------|---------|
| distill-first-architecture.md | philosophical-divergence | Wave 1 ✓ |
| three-layer-knowledge-architecture.md | design-adaptation | Wave 1 (paired with above) ✓ |
| wiki-vs-rag.md | nuance | Wave 1 ✓ |
| ambiguity-as-silent-execution.md | nuance | Wave 2 ✓ |
| explainable-reasoning-trace.md | tradeoff | Wave 3 ✓ |

**Issue found**: Wave 2 contradiction 2 (literal vs interpretive paradigms, keyword-salad / mj-v8) was documented in the log but **missing from artifact frontmatter**. keyword-salad-prompt-collapse.md had `contradictions: []`.
**Repair**: Added contradiction entry to keyword-salad-prompt-collapse.md (severity: context-dependent, related: midjourney-v8-calibration.md). Total artifacts with contradictions: 6.

### Index Statistics Corrections

Three errors found in index.md statistics table:

| Field | Was | Corrected To | Root Cause |
|-------|-----|-------------|------------|
| High confidence | 21 | 20 | Miscounted during wave 3 update |
| Medium confidence | 5 | 6 | Same — 6 medium artifacts: confidence-decay, rag-cross-doc, claude-cowork-arch, llm-wiki-tools, mj-v8, veo3 |
| Active contradictions | 4 | 5 | Undercounted; 5 contradictions were logged across 3 waves |
| Taxonomy tags | 22 | 24 | Original taxonomy had 20 tags (logged as 18); wave 2 added 4 → 24 (logged as 22) |

**Repair**: index.md statistics updated to correct values.

### Evidence Coverage

**Single-source artifacts (1 evidence entry):**

| Artifact | Source | Risk |
|----------|--------|------|
| delta-only-continuation.md | veo3.ctx.md | Pattern could be strengthened with examples from other iterative AI tools |
| file-handoff-state-machine.md | claude-cowork.ctx.md | Pattern is transferable; could cite LangGraph, CrewAI, or AutoGen file-based patterns |
| claude-cowork-architecture.md | claude-cowork.ctx.md | Reference — single-source expected |
| llm-wiki-tool-ecosystem.md | karpathy guide | Reference — single-source expected; tools evolve fast |
| midjourney-v8-calibration.md | midjourney.ctx.md | Reference — single-source expected |
| veo3-production-parameters.md | veo3.ctx.md | Reference — single-source expected |

4 of 6 single-source artifacts are references (tool-specific snapshots), where single-source is expected. 2 patterns could benefit from corroborating evidence.

**Multi-source leaders (4 sources):**
- prompt-as-architectural-brief.md — 4 sources
- explicit-component-ordering.md — 4 sources
- wiki-vs-rag.md — 4 sources

### Orphan / Cross-Reference Analysis

- Only **6 of 26** artifacts are cross-referenced by other artifacts (via `related_artifact` or body text).
- **20 artifacts** have zero inbound cross-references.
- This is normal for a day-0 system but represents an opportunity: adding `see_also` or inline cross-references would strengthen the knowledge graph.

### Unused Domain

- `model-behavior` (3 tags) has zero artifacts. No current raw sources address model capabilities, behavioral quirks, or cross-model comparisons at the concept level.
- **Recommendation**: Not a problem yet. First artifact in this domain will likely emerge when a model comparison or capability benchmark is ingested.

### Missing Concept Candidates

Topics frequently mentioned across artifacts but lacking their own concept page:

1. **Hallucination / Fabrication mechanism** — referenced in uncertainty-and-conflict-protocol, hallucinated-data-on-missing-evidence, explainable-reasoning-trace, evidence-tiered-source-policy. The autoregressive completion drive is described but never given its own concept artifact.
2. **Token budget / context window management** — mentioned in file-handoff-state-machine, gemini-deep-research-parameters, goal-state-execution. The tradeoff between context richness and token cost is a cross-cutting concern.

**Recommendation**: Consider creating concept artifacts for these if a future raw source provides primary evidence.

### Summary

| Check | Result |
|-------|--------|
| Lifecycle / freshness | ✅ PASS |
| Dedupe keys unique | ✅ PASS |
| Tag compliance | ✅ PASS (3 unused tags noted) |
| Contradictions cross-check | ⚠️ 1 missing entry — REPAIRED |
| Index statistics | ⚠️ 3 errors — REPAIRED |
| Evidence coverage | ✅ PASS (2 strengthening candidates noted) |
| Orphan detection | ℹ️ 20/26 have no inbound refs (day-0 normal) |
| Missing concepts | ℹ️ 2 candidates identified |

**Repairs applied this pass:**
1. index.md — corrected confidence (20/6), contradictions (5→6 after repair), tags (24)
2. keyword-salad-prompt-collapse.md — added missing contradiction entry

**Next recommended actions:**
1. Seek corroborating sources for delta-only-continuation and file-handoff-state-machine patterns
2. ~~Add cross-references (`see_also` fields or inline links) to improve knowledge graph density~~ → DONE (see entry below)
3. Watch for model-behavior domain content in future ingests
4. Create hallucination/fabrication concept artifact when a primary source arrives

---

## [2026-04-16] structural | Cross-Reference & Schema Overhaul

Agent: distill-agent (claude-opus-4-6)
Trigger: Lint pass revealed star topology — all artifacts connected only through index.md, zero inter-artifact cross-references. Karpathy's design requires a pre-digested, cross-referenced, synthesized wiki layer.

### Problem

The knowledge graph was a filing cabinet: 26 isolated artifacts linked only through index.md. No artifact referenced any other artifact via structured links. This violates Karpathy's core wiki principle: "The LLM maintains cross-references and keeps everything consistent."

### Changes Made

#### 1. Created CLAUDE.md — Layer 3 Schema Document

New file: `kms/CLAUDE.md`

Purpose: The persistent-memory document that any LLM reads at session start to become a disciplined wiki maintainer. Contains:
- Wiki mission and design philosophy
- Directory structure (Layer 1: raw, Layer 2: distilled, Layer 3: schema)
- Complete frontmatter schema (including new `see_also` field)
- Cross-reference rules (bidirectional, meaningful, minimum 2 links)
- Full ingest/query/lint operation workflows
- Ingest ripple requirement (single source must touch multiple pages)
- Query compounding loop (good answers filed back as wiki pages)
- Naming conventions, tag governance, lifecycle rules
- "What NOT to do" guardrails

#### 2. Added Cross-Reference Mechanism to All 26 Artifacts

New frontmatter field on every artifact:
```yaml
see_also:
  - artifact: distilled/type/related-artifact.md
    relationship: "One-line explanation of connection"
```

New body section on every artifact:
```markdown
## Related
- **[Title](relative-path.md)** — relationship explanation
```

**Coverage**:
- 26/26 artifacts updated
- 98 total cross-reference links
- Average 3.8 links per artifact
- All links are bidirectional (if A→B, then B→A)
- Zero orphan artifacts (every artifact has ≥2 inbound links)

**Cross-reference clusters**:
- Prompting cluster: prompt-as-architectural-brief ↔ explicit-component-ordering ↔ keyword-salad ↔ delta-only ↔ mj-v8 ↔ veo3
- Knowledge architecture cluster: distill-first ↔ three-layer ↔ canonical-vs-projection ↔ wiki-vs-rag ↔ knowledge-compounding
- Agent safety cluster: ambiguity-as-silent-execution ↔ uncertainty-protocol ↔ hallucinated-data ↔ outcome-driven ↔ ERT
- Tool reference cluster: claude-cowork ↔ goal-state ↔ file-handoff; gemini-dr ↔ ERT ↔ evidence-tiered
- Maintenance cluster: llm-maintenance-cost-shift ↔ confidence-decay ↔ knowledge-compounding

#### 3. Updated Governance Documents

**policies.md** — Added two new sections:
- "Cross-Reference Rules" (minimum 2 links, bidirectional, meaningful, maintained on ingest/lint)
- "Ingest Ripple Requirement" (new sources must update existing artifacts, not just create new ones)

**OPERATOR.md** — Updated:
- Directory tree now includes CLAUDE.md as Layer 3 schema
- Ingest workflow expanded from 7 to 8 steps; adds "update existing artifacts" and cross-reference steps
- Added `artifacts_updated` field to envelope schema
- Quality gates now include Gate 6: Cross-reference
- Lint pass checklist expanded with cross-reference completeness and bidirectionality checks
- Query workflow now includes "follow see_also links" and "file back as wiki pages"
- Frontmatter template updated with `see_also` field

**index.md** — Updated:
- Added schema pointer and cross-reference note at top
- Statistics table now includes cross-reference link count (98) and average links per artifact (3.8)

### Design Rationale

| Decision | Why |
|----------|-----|
| `see_also` in frontmatter + `## Related` in body | Machine-readable for lint + human-readable for navigation |
| Bidirectional requirement | Prevents orphans; knowledge graph stays connected |
| Minimum 2 links | Ensures every artifact participates in the graph |
| Ingest ripple policy | Matches Karpathy's "single source might touch 10-15 pages" |
| CLAUDE.md as separate file | Follows Karpathy's Layer 3 pattern (CLAUDE.md for Claude Code, AGENTS.md for Codex) |
| Query compounding loop | "Good answers filed back as wiki pages" — knowledge grows from exploration, not just ingestion |

---

## [2026-04-16] synthesis | Universal Prompting Principles + Model Comparison Matrix

Agent: distill-agent (claude-opus-4-6)
Trigger: Operator request to create compiled synthesis artifacts

### Artifacts Produced

1. **distilled/synthesis/universal-prompting-principles.md** (high confidence, synthesis)
   - Compiled from: 10 atomic artifacts (6 patterns, 4 failures)
   - Content: 7 universal principles + universal anti-patterns table + modality divergence analysis
   - This is the most important page in the wiki for downstream wrappers — pre-digested cross-cutting knowledge

2. **distilled/synthesis/model-comparison-matrix.md** (high confidence, synthesis)
   - Compiled from: 6 atomic artifacts (4 references, 2 patterns)
   - Content: Overview comparison table, component ordering side-by-side, prompt language comparison, operating environment comparison, calibration parameters, failure mode comparison, task-to-model decision matrix, knowledge gaps
   - Pre-built comparison — exactly what Karpathy says should exist in a wiki

### Cross-References Added

Bidirectional links added to 14 atomic artifacts (both `see_also` frontmatter and `## Related` body sections):

**Patterns updated (6):**
- prompt-as-architectural-brief.md → both synthesis pages
- explicit-component-ordering.md → both synthesis pages
- uncertainty-and-conflict-protocol.md → universal-prompting-principles
- explainable-reasoning-trace.md → universal-prompting-principles
- evidence-tiered-source-policy.md → universal-prompting-principles
- delta-only-continuation.md → universal-prompting-principles

**Failures updated (4):**
- keyword-salad-prompt-collapse.md → both synthesis pages
- ambiguity-as-silent-execution.md → both synthesis pages
- hallucinated-data-on-missing-evidence.md → universal-prompting-principles
- outcome-driven-constraint-violation.md → universal-prompting-principles

**References updated (4):**
- midjourney-v8-calibration.md → both synthesis pages
- veo3-production-parameters.md → both synthesis pages
- gemini-deep-research-parameters.md → both synthesis pages
- claude-cowork-architecture.md → both synthesis pages

### Index Updated

- Added Synthesis section with 2 entries
- Statistics updated: 28 canonical artifacts (was 26), 22 high confidence (was 20), 2 synthesis artifacts added, cross-reference links updated to 122 (was 98), avg links per artifact 4.4 (was 3.8)

---

## [2026-04-16] structural | Model Profiles + Wiki Reshape

Agent: distill-agent (claude-opus-4-6)
Trigger: Audit against Karpathy's wiki vision revealed critical gap — wiki was a knowledge inventory (26 atomic fragments), not a compiled wiki. Missing: model profiles, summaries, comparisons, pre-digested synthesis.

### Problem Identified

| Karpathy requires | What we had | Gap |
|-------------------|-------------|-----|
| "Pre-digested, cross-referenced, synthesized" | Atomic fragments only | No compiled layer |
| "Summaries, entity pages, concept pages, comparisons, overview, synthesis" | Only concept + pattern pages | 4 of 6 page types missing |
| "A single source might touch 10-15 pages" | Ingests created 2-4 artifacts | No ripple to compiled views |
| "Knowledge compiled once, not re-derived on every query" | To answer "how to prompt MJ V8?" required reading 5+ artifacts | Wrappers would need to reassemble |

Core insight: Atomic artifacts (patterns, concepts, failures, references) are excellent raw knowledge material. But a wiki must also compile that material into reader-ready pages. Karpathy: "What a research assistant would produce if they read everything and organized it for you."

### Artifacts Produced

**4 Model Profiles** (compiled, `distilled/models/`):

| Profile | Lines | Compiled from | Confidence |
|---------|-------|---------------|-----------|
| midjourney-v8.md | 299 | 5 atomic artifacts | medium |
| veo3.md | 386 | 5 atomic artifacts | medium |
| gemini-deep-research.md | 303 | 7 atomic artifacts | high |
| claude-cowork.md | 300 | 6 atomic artifacts | medium |

Each model profile is SELF-CONTAINED — a downstream wrapper reads ONE page and knows everything needed to compose prompts for that model. Includes: identity, prompt architecture, component ordering, parameter calibration, anti-patterns, failure modes, operating environments, and a fillable prompt template.

### Taxonomy Updated

Added 2 new artifact types to taxonomy.md:
- `model-profile` (directory: `models/`, prefix: `model:`) — compiled per-tool prompting profile
- `synthesis` (directory: `synthesis/`, prefix: `synth:`) — cross-cutting compiled analysis

Added "Atomic vs Compiled" tier distinction: atomic artifacts extract from raw sources, compiled artifacts pre-digest from atomic artifacts.

### Governance Updates

| File | Changes |
|------|---------|
| taxonomy.md | Added model-profile and synthesis types; atomic/compiled distinction |
| policies.md | Artifact types section expanded to two tiers (atomic + compiled); compiled maintenance rule added |
| OPERATOR.md | Directory tree updated with models/ and synthesis/; reflects 6-type system |
| CLAUDE.md | Directory tree, frontmatter schema (compiled_from field), atomic vs compiled explanation |
| index.md | Model Profiles section added; statistics corrected to: 32 artifacts, 23 high, 9 medium, 8 contradictions, 149 links, 4.7 avg |

### Statistics After Reshape

| Metric | Before | After |
|--------|--------|-------|
| Total artifacts | 26 | 32 |
| Atomic artifacts | 26 | 26 |
| Compiled artifacts | 0 | 6 |
| High confidence | 20 | 23 |
| Medium confidence | 6 | 9 |
| Cross-reference links | 98 | 149 |
| Avg links/artifact | 3.8 | 4.7 |
| Active contradictions | 6 | 8 |

### Design Rationale

| Decision | Why |
|----------|-----|
| Two-tier system (atomic + compiled) | Atomic for provenance and evidence; compiled for action and readability |
| Model profiles self-contained | Wrapper reads ONE file, not 5-7. Knowledge compiled once, not re-derived |
| `compiled_from` field | Audit trail: know exactly which atoms feed each compiled page; know what to update when atoms change |
| Prompt templates in profiles | Downstream wrappers can fill templates directly — maximum leverage for our prompting purpose |
| Kept atomic artifacts untouched | Compilation adds a layer ON TOP, doesn't modify the evidence base |

---

## [2026-04-28] system | Schema v2 Redesign — Spec Lock

Action: Replaced schema v1 with v2 architecture. Spec-lock commit only — no artifact migration yet.
Operator: Bartosz Skokun
Designed by: Claude Opus 4.7 (acting senior designer)

### Drivers

1. New mission scope: wiki must be the *heart* of a future meta-prompter agentic system. Wrappers will query "How to [verb] [object] best?" and the wiki must respond with a typed, ranked bundle of means-of-control.
2. Defect 2 reframed: the wiki captures *means of controlling AI* (prompts, tool combos, agentic loops, MCP integrations, n8n flows), not just prompt strings.
3. Empirical CLAUDE.md best practices (research file 2026-04): 200-line cliff, XML-walled instructions, deterministic hooks, lazy path-scoped rules, on-device retrieval.

### Breaking changes

- Artifact types: 6 → 9. New: `tool`, `mechanism`, `exemplar` (atomic); `playbook` (compiled). Renamed `model-profile` → `profile`. Renamed `synthesis` directory location: `distilled/synthesis/` → `compiled/syntheses/`.
- Frontmatter: added `tldr`, `goal`, `applicable_to_goals`, `keywords`, `modality`, `tools`, `model_versions`, `abstraction_level`, `language`, `provenance` (tiered, replaces flat confidence-only), `decay_triggers`, `playbook_steps`, `playbook_inputs`.
- Cross-references: free-text `relationship` → typed `relation` enum (11 values: implements, violates, composes-with, supersedes, exemplifies, conflicts-with, specializes, generalizes, requires, enables, mitigates).
- Quality gates: 5 → 8 (added Schema, Cross-references, Retrieval).
- Directory: introduced `compiled/` peer to `distilled/`; added `raw/{papers,articles,system-prompts,creative-prompts,tool-docs,workflows}` modes; added `.qmd/`, `.claude/{hooks,rules,skills}/`.

### Files written

- CLAUDE.md — rewritten as slim XML-walled kernel (~120 lines)
- policies.md — full v2 schema spec
- taxonomy.md — v2 with modalities, tools registry, provenance tiers, relation enum, language
- .qmd/README.md — retrieval contract for qmd MCP integration
- .claude/hooks/README.md — deterministic gate contract (5 hooks)
- .claude/rules/README.md — path-scoped lazy-loaded rule plan (13 rule files)
- .claude/skills/README.md — invocable skill plan (6 skills)

### Migration phases

- Phase A (DONE): Spec lock — files above.
- Phase B (NEXT): qmd bootstrap — install, index existing artifacts, validate retrieval pre-migration.
- Phase C: Schema migration of existing artifacts (additive frontmatter pass, then type taxonomy migration). Hooks land warn-only, then strict.
- Phase D: New surfaces — first 3 playbooks (one per modality), first profile per active tool.

### Decisions locked (made by senior designer call, not awaiting operator)

1. qmd is the primary retrieval surface; INDEX.json is the typed-graph companion.
2. Playbooks are per goal-tool, with cross-tool synthesis playbooks composing them.
3. Long exemplars (workflow JSONs, full system prompts) live in `raw/`; the distilled exemplar artifact cites them.
4. `tool` is lean factual surface; `profile` is fat compiled digest. Different roles, no duplication.
5. `language: pl|en` added now — costless insurance against multilingual ingest.
6. Hooks: strict on `validate-frontmatter` and `block-raw-edits` from day 1; warn-only on `enforce-min-crossrefs` and `enforce-tag-vocab` for 2-week backfill window.


---

## [2026-04-29] system | Phase B Bootstrap — qmd Configuration Locked

Action: Grounded qmd setup in actual repo specs (https://github.com/tobi/qmd). No installation yet — config files only.

### qmd specifics that drove decisions

- Package: `@tobilu/qmd`, requires Node ≥ 22.
- Three search modes: `search` (BM25), `vsearch` (vector), `query` (hybrid + expansion + LLM rerank — the wrapper's primary call).
- MCP exposes 4 tools: `query`, `get`, `multi_get`, `status`.
- Filter primitive is the **collection** (`-c <name>`); no native frontmatter filter. Decision: split collections by artifact TYPE (10 collections), not modality. Modality filtering happens via query phrasing + BM25 hits on `tools:` field.
- Default embedding model is English-only (`embeddinggemma-300M`). Operator has Polish sources → switch to `Qwen3-Embedding-0.6B` (119 langs) via `QMD_EMBED_MODEL` env var.
- Chunking: 900 tokens with 15% overlap → confirms our ≤200-line body skeleton aligns with single-chunk artifacts.

### Files written

- .qmd/README.md — rewritten with real install steps, collections strategy, MCP tool surface, multilingual embedding override, wrapper integration sequence
- .qmd/setup.sh — idempotent bootstrap script (Node check, install, collections, embed, status)
- .qmd/env.example — template for QMD_EMBED_MODEL override (real .qmd/env is gitignored)
- .claude/settings.json — registers qmd MCP server (stdio transport) + qmd Bash permissions
- .gitignore — excludes qmd index DB, cache, local Claude settings

### Collections (registered in setup.sh)

| Collection | Path | Wrapper use |
|---|---|---|
| playbooks | compiled/playbooks/ | First query — does an existing playbook cover this goal? |
| profiles | compiled/profiles/ | Tool deep-dive |
| syntheses | compiled/syntheses/ | Cross-cutting analysis |
| patterns | distilled/patterns/ | Means of control |
| failures | distilled/failures/ | What to avoid |
| tools | distilled/tools/ | Lean factual surface |
| mechanisms | distilled/mechanisms/ | Specific knobs |
| exemplars | distilled/exemplars/ | Real prompts/workflows |
| concepts | distilled/concepts/ | Background mental models |
| raw | raw/ | Source material (de-prioritized) |

### Wrapper retrieval sequence (locked)

1. `qmd query "<goal>" -c playbooks --json` — does an existing playbook fit?
2. If hit: `qmd get <playbook>` for full body
3. Else: `qmd query "<goal>" -c patterns,profiles,failures,exemplars --json`
4. `qmd multi-get` top 2-3 bodies
5. Optional: read INDEX.json for typed graph traversal (qmd doesn't expose typed edges natively)

### Next concrete steps (not yet executed)

- [ ] Operator runs `bash .qmd/setup.sh` once (one-time install + initial embed)
- [ ] Validate retrieval against current artifacts BEFORE Phase C migration
- [ ] If retrieval quality is poor on existing v1 bodies, that informs the body-skeleton enforcement priority in Phase C
- [ ] Author lint skill (writes INDEX.json) so wrapper has typed-graph fallback ready


---

## [2026-04-29] system | Phase B — qmd Bootstrap First-Run Diagnostics

Bootstrap ran successfully:
- 39 documents, 128 chunks indexed across 4 active collections (patterns 12, failures 6, concepts 3, raw 18). Six collections empty pending Phase C (playbooks, profiles, syntheses, tools, mechanisms, exemplars).
- Embeddings built with Qwen3-Embedding-0.6B (1024-dim) — multilingual model live.
- GPU offloading active (RTX 2080 Super Max-Q, Vulkan).

### Bug observed and fixed

`qmd query` failed with `SqliteError: Dimension mismatch for query vector ... Expected 1024, received 768`.

**Root cause:** `qmd embed` used Qwen3 (1024-dim) because setup.sh exported `QMD_EMBED_MODEL` in its own process. The follow-up interactive `qmd query` ran in the operator's shell where the env var was never set, so it loaded the default `embeddinggemma-300M` (768-dim). Stored vectors and query vector mismatched.

**Fix landed:**
- Created real `.qmd/env` (gitignored) — sourceable by interactive shells.
- Added explicit "CRITICAL: Persist this env var" section to `.qmd/README.md`.
- Updated `setup.sh` to print the source-instruction at end of run.
- MCP server in `.claude/settings.json` already had the env var, so wrapper-via-MCP path was never affected (only the human CLI path).

**Operator action required:**
```bash
# One-time, add to ~/.bashrc:
source /c/AI/0_Ainything/00_AgentHjuston/forge_ultimate/kms/.qmd/env

# Then:
qmd query 'how to ingest a deep research source' -n 5 --explain
```

### Enhancement landed in same pass

Added `qmd context add qmd://<collection>/ "<one-line semantic hint>"` calls to setup.sh for all 10 collections. qmd's status output explicitly recommends this — context strings improve retrieval ranking by giving the reranker a per-collection prior. Re-running setup.sh is idempotent; existing collections get annotated.


---

## [2026-04-29] system | Phase B Validation — Retrieval Contract Holds

After fixing the env-var persistence and excluding raw from default queries, re-ran the original test query.

### Test query
`qmd query 'how to ingest a deep research source' -n 5`

### Result — distilled-first ranking confirmed

| Rank | Artifact | Score | Type |
|---|---|---|---|
| 1 | distilled/patterns/three-layer-knowledge-architecture.md | 55% | pattern |
| 2 | distilled/failures/rag-cross-document-insight-loss.md | 46% | failure |
| 3 | distilled/concepts/knowledge-compounding.md | 45% | concept |

No envelope pollution. No raw sources at top. Top hit is a relevant pattern — exactly what the retrieval contract predicts.

### Bug fixed in this pass

`qmd collection add` CLI does not support `--pattern` or `--ignore` flags (confirmed via `qmd collection`). Envelope sidecars (`*.envelope.md`) cannot be filtered at the collection level. Workaround landed: `qmd collection exclude raw` removes `raw` from default queries while keeping it explicitly addressable via `-c raw`. Matches retrieval contract: distilled is canonical, raw is source material the wrapper can opt into.

Also: cleaned up an accidental kms-root collection (created when `qmd collection add` was run with no path arg during exploration).

### Files touched

- `.qmd/setup.sh` — added `qmd collection exclude raw` step (4a) before context annotations (4b)
- `.qmd/README.md` — documented the raw-exclusion rationale; updated collections table

### Performance notes (non-blocking)

- First-run query expansion took ~100s (1.7B query-expansion model warming up). Subsequent warm-process queries should run in 5-15s.
- Vulkan OOM during rerank on a 325MB allocation despite 22GB free VRAM. qmd's fallback path handled it; query completed cleanly. Likely contention with another GPU process. Worth monitoring; not blocking.

### Phase B complete

qmd is installed, embeddings are built (Qwen3-Embedding 1024-dim, multilingual), 4 collections are active (patterns, failures, concepts, raw — last excluded from default), MCP server is registered for wrapper use, and the retrieval contract is empirically validated against the existing v1 corpus. Distilled artifacts surface ahead of raw on natural-language queries.

### Phase C unblocked — gap revealed by retrieval

The test query "how to ingest a deep research source" exposed a real content gap: there is no distilled pattern about the ingest workflow itself. Authoring `distilled/patterns/ingest-pipeline.md` (or similar) is now Phase C priority — it would have been the rank-1 answer, but doesn't exist yet. This is the wiki working as designed: retrieval surfaces gaps as opportunities.


---

## [2026-04-29] ingest | First v2-schema artifact: ingest-pipeline pattern

Action: Authored the missing pattern that the Phase B test query exposed. First end-to-end validation of the v2 frontmatter schema against qmd retrieval.

### Source

This pattern is self-documenting from CLAUDE.md, policies.md, and personal field observation during Phase A-B implementation. No external raw source — provenance tier: `personal-field`. Cites raw/idea-files/forge-heart-wiki-idea-v1.md and raw/deep-research/karpathy-llm-wiki-guide.md as supporting.

### Artifacts produced

- distilled/patterns/ingest-pipeline.md — full v2 schema (tldr, goal, applicable_to_goals, keywords, modality, tools, abstraction_level, language, structured provenance, decay_triggers, typed see_also). 9-step workflow with mechanism, failure modes, concrete example.

### Artifacts updated (ripple)

- distilled/patterns/distill-first-architecture.md — added back-link (relation: implemented-by)
- distilled/patterns/three-layer-knowledge-architecture.md — added back-link (relation: required-by)
- distilled/concepts/knowledge-compounding.md — added back-link (relation: enabled-by)
- distilled/failures/rag-cross-document-insight-loss.md — added back-link (relation: mitigated-by)
- distilled/patterns/idea-file-as-knowledge-seed.md — added back-link (relation: composed-with)

Five reciprocal links — within the 5-15 ripple band predicted by the pattern itself. Pattern documents its own behavior accurately.

### Schema-mixing note

The reciprocal entries on existing v1 artifacts use a hybrid syntax: legacy `relationship: "..."` entries preserved alongside new `relation: <enum>` + `note:` entries. Phase C migration will harmonize all artifacts to v2-only. Hooks in warn-only mode tolerate this transient state.

### Retrieval validation

Re-ran `qmd query "how to ingest a deep research source" -n 5`:

| Rank | Artifact | Score |
|---|---|---|
| 1 | distilled/patterns/ingest-pipeline.md | 56% |
| 2 | distilled/concepts/knowledge-compounding.md | 46% |
| 3 | distilled/failures/rag-cross-document-insight-loss.md | 45% |

The new v2 artifact is rank 1 — displaces the previous top hit (three-layer-knowledge-architecture, 55%) because ingest-pipeline is a more direct answer to the literal query. The `tldr` field surfaces as the result chunk title in qmd output, confirming v2 frontmatter design serves retrieval as intended.

### Schema confidence — UP

This was the first artifact authored under the v2 schema. It passed all 8 conceptual quality gates without friction. The frontmatter is verbose but every field earned its place during retrieval ranking. No fields felt redundant or missing.

### Next steps unblocked

- Phase C backfill: with v2 proven on one artifact, the migration script can be written confidently. The mixed-syntax see_also pattern visible in this commit is what the migration must clean up.
- Lint skill: now has a real INDEX.json target — graph radius 1 from ingest-pipeline already touches 5 artifacts.
- Authoring more v2 patterns: each one tests retrieval and exposes more gaps.

### Performance note

Vulkan OOM during rerank repeated (same 325MB allocation failure). Non-blocking — fallback path completes the query. Worth a separate investigation but not blocking; possibly Vulkan driver fragmentation. Try restarting GPU drivers or switching to CPU rerank if it persists.

### Embed banner misleading

`qmd embed` printed `Model: hf:ggml-org/embeddinggemma-300M-GGUF` despite QMD_EMBED_MODEL being set to Qwen3 in the same shell. Querying succeeded with no dimension mismatch, confirming Qwen3 was actually used. The banner is a printed default, not a dynamic readout. Cosmetic only.


---

## [2026-04-29] system | Lint Skill Operational + Coverage Gap Closed

Action: Built and ran the lint skill. Generated first INDEX.json. Closed the qmd coverage gap by adding 3 legacy collections.

### Files written

- `.claude/skills/lint/build-index.mjs` — pure-Node ESM (no npm deps), regex-based YAML frontmatter extractor scoped to our schema. Walks `distilled/**` + `compiled/**`, builds graph, validates against v2 schema, emits INDEX.json + console report. Exit 0 = warn-only; Exit 1 = hard errors (dedupe collision, broken link).
- `.claude/skills/lint/SKILL.md` — operator/agent-facing documentation. When to invoke, what it produces, issue-code reference, fix patterns.
- `INDEX.json` — first machine-readable graph snapshot. 33 artifacts, edges, full per-artifact `_issues` array. This is the wrapper's typed-graph fallback to qmd hybrid retrieval.

### Lint findings — corpus reality check

| Metric | Value | Notes |
|---|---|---|
| Total artifacts | 33 | Was 21 in qmd; 12 were uncovered (models/, references/, synthesis/) |
| By type | pattern 13, failure 6, reference 5, model-profile 4, concept 3, synthesis 2 | `reference` and `model-profile` are v1 types — must be re-typed in Phase C |
| Dedupe collisions | 0 | ✅ |
| Orphans | 0 | ✅ — graph fully connected |
| Broken links | 0 | ✅ |
| Bidirectionality issues | 41 | Real fix list — every reciprocal needs adding |
| v2 complete | 1/33 | Only `ingest-pipeline.md` |
| v1 remaining | 32 | All need tldr/goal/provenance.tier + typed relations |
| Per-artifact lint issues | 225 | Sum of v2-MISSING + V1-EDGE + similar warns |

### Phase C migration scope is now precisely measured

The lint output gives the full migration backlog as numbers, not vibes:

- 32 artifacts need v2 frontmatter migration (add: tldr, goal, keywords, modality, tools, structured provenance, language, decay_triggers)
- 41 bidirectionality fixes (each see_also that goes one way needs the reciprocal added)
- 9 artifacts on retired v1 types — must be re-typed AND moved:
  - 4 `distilled/models/*.md` (`model-profile`) → `compiled/profiles/*.md` (`profile`)
  - 5 `distilled/references/*.md` (`reference`) — type retired in v2; each must be re-classified as `concept`, `tool`, or `mechanism` based on content
  - 2 `distilled/synthesis/*.md` (`synthesis`) → `compiled/syntheses/*.md` (no type rename, just directory move)
- ~150 V1-EDGE upgrades (prose `relationship` → typed `relation` enum)

Single migration script can handle the bulk; manual judgment needed for the 5 `reference` re-classifications.

### qmd coverage gap closed

Added 3 legacy collections (`models`, `references`, `synthesis-legacy`) to qmd. All 33 artifacts now indexed (was 21). Setup.sh updated to register these on re-run. `synthesis-legacy` excluded from default queries since its content will be physically relocated; `models` and `references` kept default-included because their content is retrieval-relevant during the transition.

Embedded 68 new chunks from 11 documents (18s on the warm Vulkan path).

### Decisions locked

1. Lint is mechanical and deterministic. No judgment calls inside the script. Exit codes drive CI/hooks; severity is fixed.
2. v1-compat inverse relations (`implemented-by`, `mitigated-by`, etc.) are accepted by the lint validator during migration. They'll be considered first-class in v2 since bidirectional graphs need either symmetric edges or paired forward+inverse forms.
3. Phase C migration will be a dedicated session with a deterministic migration script — not piecemeal manual edits across this corpus. The script will use the lint output as its work-list.

### Sanity check on schema

The lint surfaced one hidden truth: `reference` was a v1 type that the v2 redesign **removed** without explicitly retyping its 5 instances. This is technical debt the schema doc itself should acknowledge. Phase C must classify each `reference` artifact as one of: `concept` (factual claim about a model/system), `tool` (lean factual surface for a controllable tool), or split into `tool` + `mechanism` pair. Manual judgment unavoidable for these.

### Next-session priorities

1. **Migration script** (`.claude/skills/migrate-artifact/SKILL.md` + executable): walks INDEX.json's `_issues` array, applies deterministic v1→v2 transforms per artifact, writes back, re-runs lint.
2. **Reference re-classification** (5 artifacts): manual judgment session.
3. **Bidirectionality backfill**: 41 reciprocal links — likely fold into the migration script as it processes each artifact.
4. **First playbook**: candidate goal "How to ingest a deep research source best?" — composes from ingest-pipeline + three-layer-knowledge-architecture + rag-cross-document-insight-loss.


---

## [2026-04-30] system | Greenfield Pivot — V1 Corpus is Scaffolding, Not Knowledge

Operator decision: do not migrate the v1 corpus. Treat it as design scaffolding that informed the v2 schema; discard it at Phase D before re-ingesting source material under v2 rules.

### What this cancels

- ~150 prose `relationship` → typed `relation` rewrites
- 41 bidirectionality reciprocal-link fixes
- 5 manual `reference` artifact re-classifications (concept | tool | mechanism judgment calls)
- 9 directory moves (4 model-profile→profile, 5 reference deletion, 2 synthesis→syntheses)
- Migration script + skill (`migrate-artifact`)
- The whole 2-week warn-only backfill window for hooks

### What this unlocks

- All hooks ship strict from day one
- Every artifact post-purification is v2-pure (no mixed schema, no v1-compat inverse relations, no transitional debt)
- Schema can still break freely during Phase C if authoring real artifacts reveals a gap — no migration burden disincentivizing changes
- First playbook composes only from v2-pure atomics
- The empty-corpus exit gate is concrete and binary: lint shows 0 issues → Phase D ready

### Reshaped 6-phase plan

| Phase | Status | Goal |
|---|---|---|
| A — Spec lock | ✅ done | v2 schema, kernel, taxonomy, policies, README brief |
| B — Retrieval bootstrap | ✅ done | qmd installed, MCP registered, retrieval contract validated |
| B+ — Lint tooling | ✅ done | build-index.mjs operational, INDEX.json shipping |
| C — System hardening | 🚧 in progress | Rule files (10 ingest + 3 compile), executable hooks (Node ESM, strict), ingest skill, compile-playbook skill. Exit gate: empty wiki passes lint with 0 issues. |
| D — Purification | planned | Delete v1 corpus from distilled/; keep raw/; reset INDEX.json + index.md; v2 epoch begins |
| E — Re-ingest | planned | Re-distill from raw/ in disciplined order. After ~5 sources, author first playbook. After ~10-15, density unlocks Phase F. |
| F — The wrapper | planned | Meta-prompter agent. Reads qmd MCP + INDEX.json. Generates prompts conditioned on retrieved bundles. |

### Files updated in this pivot

- CLAUDE.md kernel — `<hard_constraints>` removed "warn-only during backfill" qualifier; added "All hooks strict from day one — there is no backfill window (greenfield approach)"
- policies.md §Quality Gates — Gate 7 enforcement column simplified to "Hook"
- policies.md §Hook Contract — all 6 hooks listed as Strict; added explicit greenfield rationale paragraph
- policies.md §Migration Note → §Greenfield Note — replaced migration narrative with discard-and-re-ingest narrative
- .claude/hooks/README.md — all hooks Strict; renamed planned scripts from `.sh` to `.mjs` (Node ESM, leveraging the lint script's pattern of pure-Node + regex extraction with no npm deps)
- README.md §10 — full status section rewritten with the 6-phase plan and the pivot rationale at the bottom

### Schema spec was already clean

Grepped policies.md and taxonomy.md for v1 type leakage (`model-profile`, `reference`, etc.) — only found incidental uses of the words "reference" in non-type contexts (cross-references, reference image). The spec is correct as written. The misalignment was 100% in the v1 corpus, which Phase D deletes.

### Implementation note — hooks as Node ESM

Pivoting hook implementation from shell scripts to Node ESM scripts. Reasons:
1. We already require Node 22 for qmd
2. The lint script (`.claude/skills/lint/build-index.mjs`) proved that pure-Node + regex frontmatter extraction works without npm deps
3. Sharing one extraction module between lint and hooks reduces drift — the hook validates the same way lint does
4. Cross-platform (Windows + macOS + Linux) — shell scripts have edge cases on Git Bash for Windows that ESM avoids

### Decision locked

V1 corpus is not migrated. Phase D will delete it. Phase E re-ingests from raw/ under v2 rules. This is the path forward.

### Next session

Pick up Phase C. Order:
1. Author 10 ingest mode rules (`.claude/rules/ingest-*.md`) — defines per-mode extraction behavior
2. Author 3 compile rules (`.claude/rules/compile-*.md`) — defines body skeletons for compiled types
3. Author the ingest skill (`.claude/skills/ingest/SKILL.md`) — operator-invocable executable workflow
4. Implement the 5 hooks as Node ESM (sharing extraction module with lint)
5. Wire hooks into .claude/settings.json
6. Verify: empty corpus + lint = 0 issues → Phase D green light

