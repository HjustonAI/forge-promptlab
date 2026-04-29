---
title: "Idea File as Knowledge Seed"
type: pattern
domains: [knowledge-management, agentic-systems]
tags: [knowledge-architecture, agent-architecture, human-agent-contract]
confidence: high
confidence_rationale: "Independently described by Karpathy (2026-04) and Skokun (2026-04); demonstrated in practice by both"
lifecycle: current
created: 2026-04-16
updated: 2026-04-16
evidence:
  - source: raw/idea-files/forge-heart-wiki-idea-v1.md
    sections: ["1) Why this file exists", "2) The mindset we take"]
    claim: "In the agent era, share the idea and constraints, not the implementation"
  - source: raw/deep-research/karpathy-llm-wiki-guide.md
    sections: ["Idea Files: A New Format for the Agent Era"]
    claim: "The idea is portable; the code is specific"
  - source: raw/deep-research/llm-wiki.ctx.md
    sections: ["Mental Model"]
    claim: "The idea file already contains the full pattern. Your prompt's job is to provide binding constraints: domain, platform, sources, tooling."
dedupe_key: "pattern:idea-file-agent-era-sharing"
contradictions: []
see_also:
  - artifact: distilled/concepts/knowledge-compounding.md
    relationship: "Idea files are the seed input that starts the compounding cycle"
  - artifact: distilled/patterns/three-layer-knowledge-architecture.md
    relationship: "Idea files populate the raw layer of the three-layer architecture"
  - artifact: distilled/patterns/prompt-as-architectural-brief.md
    relationship: "Idea files function as architectural briefs for knowledge systems"
  - artifact: distilled/patterns/ingest-pipeline.md
    relation: composed-with
    note: "Idea-file mode is one of nine source-mode pipelines invoked by ingest"
supersedes: []
---

# Idea File as Knowledge Seed

## Pattern

Instead of sharing implementations (repos, packages, Docker images), share a structured
idea document that an LLM agent can interpret and instantiate for local context.

## Structure of an Effective Idea File

1. **Core thesis** — what the system does and why it matters
2. **Constraints** — what must and must not happen
3. **Quality rules** — how to judge the output
4. **Architecture shape** — structural guidance without rigid prescription
5. **Success criteria** — how to know it worked

## Why It Works

- The idea is portable across environments; code is specific to one setup
- Each agent adapts the idea to local tools, preferences, and constraints
- The document communicates *intent and boundaries*, not *implementation details*
- Keeps the human in the "what and why" role; delegates "how" to the agent

## When to Use

- Sharing reusable system designs across teams or projects
- Bootstrapping new instances of a known pattern
- Collaborating across different agent platforms (Claude Code, Codex, etc.)

## When Not to Use

- When exact reproducibility is required (use code + tests instead)
- When the domain is too novel for the agent to fill in gaps
- When the idea is simple enough to explain in a single prompt

## Key Insight

An idea file is not documentation. It is a generative seed — designed to be consumed
by an agent and grown into a working system. Its value is measured not by completeness
but by the quality of what agents build from it.

## Related

- **[Knowledge Compounding](../concepts/knowledge-compounding.md)** — idea files are the seed input that starts the compounding cycle
- **[Three-Layer Knowledge Architecture](three-layer-knowledge-architecture.md)** — idea files populate the raw layer of the three-layer architecture
- **[Prompt as Architectural Brief](prompt-as-architectural-brief.md)** — idea files function as architectural briefs for knowledge systems
