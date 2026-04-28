---
title: "LLM Wiki Tool Ecosystem"
type: reference
domains: [tooling, knowledge-management]
tags: [search-tool, authoring-tool, integration-pattern]
confidence: medium
confidence_rationale: "Tools are real and documented; ecosystem assessment is from single source (Karpathy/Antigravity article); tool capabilities may evolve"
lifecycle: current
created: 2026-04-16
updated: 2026-04-16
evidence:
  - source: raw/deep-research/karpathy-llm-wiki-guide.md
    sections: ["The Tool Stack"]
    claim: "Specific tools recommended for markdown-based knowledge systems"
dedupe_key: "ref:llm-wiki-tool-ecosystem-2026"
contradictions: []
see_also:
  - artifact: distilled/patterns/three-layer-knowledge-architecture.md
    relationship: "Tools in this ecosystem operate within the three-layer architecture"
  - artifact: distilled/concepts/knowledge-compounding.md
    relationship: "Tool ecosystem enables the compounding loop (ingest → query → file back)"
  - artifact: distilled/patterns/idea-file-as-knowledge-seed.md
    relationship: "Idea files are the primary input format these tools process"
supersedes: []
---

# LLM Wiki Tool Ecosystem

Reference snapshot of tools relevant to markdown-based knowledge systems, as of April 2026.

## Core Tools

| Tool | Purpose | Required? | Notes |
|------|---------|-----------|-------|
| LLM Agent | Wiki maintainer | Yes | Claude Code, Codex, OpenCode, or equivalent |
| Git | Version control | Recommended | Full history, diff, revert for free |
| Markdown viewer | Browsing knowledge | Recommended | Obsidian preferred; any viewer works |

## Search

| Tool | Method | When Needed |
|------|--------|------------|
| index.md (manual) | LLM reads catalog, navigates to pages | Up to ~100 sources, hundreds of pages |
| qmd (by Tobi Lutke) | BM25 + vector + LLM re-ranking, all local | Beyond index.md scale; has CLI and MCP server |

qmd runs entirely on-device via node-llama-cpp with GGUF models. No cloud API calls.

## Ingestion

| Tool | Purpose |
|------|---------|
| Obsidian Web Clipper | Browser extension; converts web articles to clean markdown with YAML frontmatter |
| Manual copy | For papers, repos, or non-web sources |

Tip: In Obsidian, set attachment folder to `raw/assets/` and bind "Download attachments"
to a hotkey. This downloads images locally so the LLM can reference them directly.

## Presentation

| Tool | Purpose |
|------|---------|
| Marp | Markdown-based slide decks; exports to HTML, PDF, PowerPoint |
| Dataview | Obsidian plugin; SQL-like queries over page frontmatter |

## Key Constraint

Current LLMs cannot natively read markdown with inline images in one pass.
Workaround: LLM reads text first, then views referenced images separately.
This limitation is likely temporary and should be re-evaluated periodically.

## Related

- **[Three-Layer Knowledge Architecture](../patterns/three-layer-knowledge-architecture.md)** — tools in this ecosystem operate within the three-layer architecture
- **[Knowledge Compounding](../concepts/knowledge-compounding.md)** — tool ecosystem enables the compounding loop (ingest → query → file back)
- **[Idea File as Knowledge Seed](../patterns/idea-file-as-knowledge-seed.md)** — idea files are the primary input format these tools process
