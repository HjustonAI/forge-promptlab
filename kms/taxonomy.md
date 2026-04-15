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

| Type | Tag prefix | Definition |
|------|-----------|------------|
| pattern | `pat:` | Repeatable technique or workflow |
| concept | `con:` | Mental model or architectural idea |
| failure | `fail:` | Failure mode or anti-pattern with repair path |
| reference | `ref:` | Factual claim backed by specific evidence |

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

### agentic-systems
- `agent-architecture` — Structural patterns for agent systems
- `agent-orchestration` — Multi-step and multi-agent coordination
- `tool-integration` — How agents connect to external tools and APIs
- `human-agent-contract` — Division of responsibility between human and agent

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

### operations
- `lifecycle-management` — Managing knowledge freshness and retirement
- `maintenance-pattern` — Recurring operational tasks
- `failure-repair` — How to diagnose and fix operational failures
