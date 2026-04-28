# Distill Taxonomy v1

Controlled vocabulary for the Forge Heart Wiki knowledge system.

## Domains

Top-level knowledge domains. Every artifact belongs to at least one.

| Domain | Scope |
|--------|-------|
| prompting | Prompt engineering techniques, patterns, anti-patterns across model families |
| agentic-systems | Agent architectures, orchestration, multi-agent coordination, tool use |
| knowledge-management | Knowledge bases, RAG, wikis, compounding knowledge systems |
| model-behavior | Capabilities, limitations, behavioral quirks, transferability across models |
| tooling | Developer tools, integrations, MCP servers, IDE extensions |
| operations | Deployment, monitoring, failure handling, cost management |

## Artifact Types

| Type | Directory | Tag prefix | Definition |
|------|-----------|-----------|------------|
| pattern | `patterns/` | `pat:` | Repeatable technique or workflow |
| concept | `concepts/` | `con:` | Mental model or architectural idea |
| failure | `failures/` | `fail:` | Failure mode or anti-pattern with repair path |
| reference | `references/` | `ref:` | Factual claim backed by specific evidence |
| model-profile | `models/` | `model:` | Compiled per-tool prompting profile — everything needed to prompt one specific model |
| synthesis | `synthesis/` | `synth:` | Cross-cutting compiled analysis — pre-digested knowledge drawn from multiple artifacts |

### Atomic vs Compiled Artifacts

- **Atomic artifacts** (pattern, concept, failure, reference) extract knowledge from raw sources. One insight per artifact.
- **Compiled artifacts** (model-profile, synthesis) pre-digest knowledge from multiple atomic artifacts into reader-ready pages. They include a `compiled_from` field listing every atomic artifact they synthesize.

## Confidence Levels

| Level | Meaning | When to use |
|-------|---------|------------|
| high | Multiple independent sources confirm; tested in practice | Well-established knowledge |
| medium | Single strong source or multiple weak sources; plausible but not battle-tested | Emerging or partially verified knowledge |
| low | Single source, anecdotal, or extrapolated; useful but unverified | Early signals worth tracking |

## Tags (v1)

Tags refine domain classification. Each tag must appear here before use.

### prompting
- `prompt-structure` — How to structure prompts (system, user, few-shot, chain-of-thought)
- `prompt-anti-pattern` — Known ineffective or harmful prompting approaches
- `prompt-transferability` — Which techniques transfer across model families
- `prompt-ordering` — How component order in prompts affects execution quality

### agentic-systems
- `agent-architecture` — Structural patterns for agent systems
- `agent-orchestration` — Multi-step and multi-agent coordination
- `tool-integration` — How agents connect to external tools and APIs
- `human-agent-contract` — Division of responsibility between human and agent
- `agent-communication` — How agents exchange information (file handoff, context passing)

### knowledge-management
- `knowledge-compounding` — Systems where knowledge accumulates over time
- `knowledge-architecture` — Structural design of knowledge systems
- `knowledge-quality` — Confidence, freshness, contradiction management
- `ingest-pipeline` — How raw material becomes structured knowledge

### model-behavior
- `capability-map` — What models can and cannot do
- `behavioral-quirk` — Non-obvious model behaviors worth knowing
- `cross-model` — Comparisons or transferability between model families

### tooling
- `search-tool` — Tools for finding information in knowledge bases
- `authoring-tool` — Tools for creating and maintaining content
- `integration-pattern` — Patterns for connecting tools together
- `generative-tool` — Image, video, audio generation tools (Midjourney, Veo3, etc.)
- `research-tool` — Autonomous research and analysis tools (Gemini Deep Research, etc.)

### operations
- `lifecycle-management` — Managing knowledge freshness and retirement
- `maintenance-pattern` — Recurring operational tasks
- `failure-repair` — How to diagnose and fix operational failures
