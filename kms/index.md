# Forge Heart Wiki — Index

System designed by Bartosz Skokun.
Last updated: 2026-04-16

> **Schema**: Read [CLAUDE.md](CLAUDE.md) first at every session start.
> All artifacts are cross-referenced via `see_also` fields and `## Related` sections.

## Patterns

- [Idea File as Knowledge Seed](distilled/patterns/idea-file-as-knowledge-seed.md) — Share ideas, not implementations; agents build locally (3 sources, high confidence)
- [Distill-First Architecture](distilled/patterns/distill-first-architecture.md) — Canonical knowledge is autonomous; consumers adapt to it (2 sources, high confidence)
- [Three-Layer Knowledge Architecture](distilled/patterns/three-layer-knowledge-architecture.md) — Raw → Wiki → Schema pattern from Karpathy (3 sources, high confidence)
- [LLM Maintenance Cost Shift](distilled/patterns/llm-maintenance-cost-shift.md) — LLMs solve the maintenance burden that kills human wikis (3 sources, high confidence)
- [Prompt as Architectural Brief](distilled/patterns/prompt-as-architectural-brief.md) — Treat prompts as constraint documents for autonomous systems (4 sources, high confidence)
- [Explicit Component Ordering](distilled/patterns/explicit-component-ordering.md) — Prompt component order reflects processing architecture (4 sources, high confidence)
- [Goal-State Execution](distilled/patterns/goal-state-execution.md) — Define terminal state, not steps; agent plans autonomously (1 source, high confidence)
- [File Handoff State Machine](distilled/patterns/file-handoff-state-machine.md) — Inter-agent communication via disk files, not context windows (1 source, high confidence)
- [Uncertainty and Conflict Protocol](distilled/patterns/uncertainty-and-conflict-protocol.md) — Explicit handling of missing data and contradictory sources (3 sources, high confidence)
- [Delta-Only Continuation](distilled/patterns/delta-only-continuation.md) — Describe only changes when extending AI-generated output (1 source, high confidence)
- [Explainable Reasoning Trace (ERT)](distilled/patterns/explainable-reasoning-trace.md) — Force System 2 thinking via explicit reasoning before conclusions (2 sources, high confidence)
- [Evidence-Tiered Source Policy](distilled/patterns/evidence-tiered-source-policy.md) — Classify sources by trust tier; whitelist/blacklist in every prompt (2 sources, high confidence)

## Concepts

- [Wiki vs RAG](distilled/concepts/wiki-vs-rag.md) — Compiled wiki beats RAG for cross-document synthesis at moderate scale (4 sources, high confidence)
- [Knowledge Compounding](distilled/concepts/knowledge-compounding.md) — Systems where each new source makes all existing knowledge more valuable (3 sources, high confidence)
- [Canonical vs Projection Separation](distilled/concepts/canonical-vs-projection-separation.md) — Truth layer must not be shaped by consumer convenience (2 sources, high confidence)

## Failures

- [RAG Cross-Document Insight Loss](distilled/failures/rag-cross-document-insight-loss.md) — RAG misses insights requiring synthesis across 3+ documents (2 sources, medium confidence)
- [Confidence Decay Without Lifecycle](distilled/failures/confidence-decay-without-lifecycle.md) — Users lose trust when they can't tell current from stale knowledge (2 sources, medium confidence)
- [Ambiguity as Silent Execution](distilled/failures/ambiguity-as-silent-execution.md) — Autonomous AI systems execute on ambiguity instead of clarifying (3 sources, high confidence)
- [Keyword Salad Prompt Collapse](distilled/failures/keyword-salad-prompt-collapse.md) — Comma-separated keywords fracture spatial coherence in literal executors (2 sources, high confidence)
- [Hallucinated Data on Missing Evidence](distilled/failures/hallucinated-data-on-missing-evidence.md) — Agents fabricate statistics rather than admitting data is unavailable (1 source, high confidence)
- [Outcome-Driven Constraint Violation](distilled/failures/outcome-driven-constraint-violation.md) — Capable agents ignore safety under strong KPI pressure (2 sources, high confidence)

## References

- [LLM Wiki Tool Ecosystem](distilled/references/llm-wiki-tool-ecosystem.md) — Tools for markdown-based knowledge systems, April 2026 (1 source, medium confidence)
- [Midjourney V8 Calibration](distilled/references/midjourney-v8-calibration.md) — Parameter tables and constraints for MJ V8 Alpha (1 source, medium confidence)
- [Veo3 Production Parameters](distilled/references/veo3-production-parameters.md) — Technical specs, audio syntax, and operating environments (1 source, medium confidence)
- [Gemini Deep Research Parameters](distilled/references/gemini-deep-research-parameters.md) — Operating envelope, prompt calibration, failure modes (2 sources, high confidence)
- [Claude Cowork Architecture](distilled/references/claude-cowork-architecture.md) — Operating modes, skill authoring, DCI, multi-agent budget (1 source, medium confidence)

## Model Profiles (Compiled)

- [Midjourney V8](distilled/models/midjourney-v8.md) — Complete prompting profile: architecture, component ordering, parameter calibration, anti-patterns, template (5 compiled artifacts, medium confidence)
- [Veo3](distilled/models/veo3.md) — Complete prompting profile: joint audio-video architecture, audio syntax, style system, template (5 compiled artifacts, medium confidence)
- [Gemini Deep Research](distilled/models/gemini-deep-research.md) — Complete prompting profile: 6 mandatory components, protocols, failure modes, template (7 compiled artifacts, high confidence)
- [Claude Cowork](distilled/models/claude-cowork.md) — Complete prompting profile: Done Framework, gate clause, file handoff, operating modes, template (6 compiled artifacts, medium confidence)

## Synthesis (Compiled)

- [Universal Prompting Principles](distilled/synthesis/universal-prompting-principles.md) — 7 cross-cutting principles validated across 4 tools + universal anti-pattern table (10 compiled artifacts, high confidence)
- [Model Comparison Matrix](distilled/synthesis/model-comparison-matrix.md) — Pre-built comparison of all 4 models: orderings, parameters, failure modes, task routing (6 compiled artifacts, high confidence)

---

## Raw Sources

### idea-files/
- [forge-heart-wiki-idea-v1.md](raw/idea-files/forge-heart-wiki-idea-v1.md) — Bartosz Skokun's concept seed for Forge Heart Wiki

### deep-research/
- [karpathy-llm-wiki-guide.md](raw/deep-research/karpathy-llm-wiki-guide.md) — Antigravity.codes analysis of Karpathy's LLM Wiki idea file
- [claude-cowork.ctx.md](raw/deep-research/claude-cowork.ctx.md) — FORGE context: Claude Cowork orchestration engine
- [gemini-deep-research.ctx.md](raw/deep-research/gemini-deep-research.ctx.md) — FORGE context: Gemini Deep Research agent
- [llm-wiki.ctx.md](raw/deep-research/llm-wiki.ctx.md) — FORGE context: LLM Wiki setup prompting (dedupe: augments existing artifacts)
- [midjourney.ctx.md](raw/deep-research/midjourney.ctx.md) — FORGE context: Midjourney V8 Alpha image generation
- [veo3.ctx.md](raw/deep-research/veo3.ctx.md) — FORGE context: Veo3 video generation
- [Gemini Deep Research Context File Generation.md](raw/deep-research/Gemini%20Deep%20Research%20Context%20File%20Generation.md) — 604-line DR-generated context file with 49-source ledger (12 prompt templates)

### field-notes/
- [rag-vs-compiled-knowledge-field-observation.md](raw/field-notes/rag-vs-compiled-knowledge-field-observation.md) — Operational observations on RAG vs compiled knowledge

---

## Statistics

| Metric | Count |
|--------|-------|
| Raw sources | 9 |
| Canonical artifacts | 32 |
| — Patterns (atomic) | 12 |
| — Concepts (atomic) | 3 |
| — Failures (atomic) | 6 |
| — References (atomic) | 5 |
| — Model Profiles (compiled) | 4 |
| — Synthesis (compiled) | 2 |
| High confidence | 23 |
| Medium confidence | 9 |
| Active contradictions noted | 8 |
| Lifecycle: current | 32 |
| Taxonomy tags | 24 |
| Domains | 6 |
| Cross-reference links | 149 |
| Avg links per artifact | 4.7 |
