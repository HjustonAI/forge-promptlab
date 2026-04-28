---
title: "Evidence-Tiered Source Policy"
type: pattern
domains: [prompting, knowledge-management]
tags: [knowledge-quality, prompt-structure, research-tool]
confidence: high
confidence_rationale: "Demonstrated in practice by Gemini DR context file with explicit tier classification; addresses well-documented browsing drift failure; principle aligns with research methodology standards"
lifecycle: current
created: 2026-04-16
updated: 2026-04-16
evidence:
  - source: "raw/deep-research/Gemini Deep Research Context File Generation.md"
    sections: ["PR-02", "Source Policy and Typology Enforcement", "Section 8"]
    claim: "Every prompt must include a strict, explicit source policy — whitelist accepted types, blacklist known garbage. Sources should be classified by trust level."
  - source: "raw/deep-research/Gemini Deep Research Context File Generation.md"
    sections: ["Source Ledger"]
    claim: "49 sources classified into trust tiers: Tier 1 (Official), Tier 2 (Semi-official), Tier 3 (Experimental/Academic), Tier 4 (Community/Practitioner)"
  - source: raw/deep-research/gemini-deep-research.ctx.md
    sections: ["Failure Modes & Repair"]
    claim: "No source policy → agent browses whatever ranks highly, including spam and listicles (browsing drift)"
dedupe_key: "pattern:evidence-tiered-source-policy"
contradictions: []
see_also:
  - artifact: distilled/patterns/explainable-reasoning-trace.md
    relationship: "ERT applies strongest when source tiers indicate high-stakes analysis"
  - artifact: distilled/failures/hallucinated-data-on-missing-evidence.md
    relationship: "Source tier enforcement prevents the conditions that cause hallucination"
  - artifact: distilled/failures/confidence-decay-without-lifecycle.md
    relationship: "Tier classification helps determine when confidence should decay"
  - artifact: distilled/patterns/uncertainty-and-conflict-protocol.md
    relationship: "Tier differences between conflicting sources inform conflict resolution"
  - artifact: distilled/synthesis/universal-prompting-principles.md
    relationship: "Synthesis page that compiles source tiering into universal principles"
supersedes: []
---

# Evidence-Tiered Source Policy

## Pattern

When prompting research agents or building knowledge systems, explicitly classify
source types into trust tiers and include whitelist/blacklist directives that
constrain which sources the system may use.

## Why It Exists

Autonomous research agents browse the open web indiscriminately by default. Without
a source policy, they ingest SEO spam, content-farm listicles, AI-generated articles,
and outdated documentation — all of which degrade the quality of the final output.

The agent has no built-in quality judgment about sources. It treats all indexed
web content as equally valid unless instructed otherwise.

## Trust Tier Classification

| Tier | Source class | Trust level | Example |
|------|------------|-------------|---------|
| 1 | Official documentation, regulatory filings | Highest | Google API docs, SEC filings, RFC documents |
| 2 | Semi-official (product expert forums, official blogs) | High | Google Support with Product Expert responses |
| 3 | Academic/experimental research | Strong (methodology-dependent) | arXiv papers, peer-reviewed journals |
| 4 | Community/practitioner observations | Moderate (needs corroboration) | Reddit threads, dev blog posts, Stack Overflow |

## Prompt Implementation

### Minimum viable source policy:
```
Prioritize: [whitelist of accepted source types]
Exclude: [blacklist of rejected source types]
```

### Full source policy:
```
SOURCE POLICY:
- Prioritize: official regulatory filings, peer-reviewed papers, primary
  technical documentation from manufacturer domains.
- Exclude: consumer review sites, generic news aggregators, unverified forums,
  AI-generated content aggregation sites.
- Conflict resolution: If sources conflict, document both, cite methodologies,
  assess credibility based on recency and domain authority.
```

## Application to Knowledge Systems

This pattern applies beyond research agents. In Distill:
- Every canonical artifact has an `evidence` field citing specific sources
- Confidence levels (high/medium/low) implicitly reflect source quality
- The source ledger in the raw layer preserves provenance for audit

The principle is the same: make source quality visible and controllable, not
implicit and unauditable.

## Transferability

| Context | Implementation |
|---------|---------------|
| Research agent prompts | Source whitelist/blacklist in every prompt |
| Knowledge bases | Evidence field with source citations per artifact |
| RAG systems | Source metadata in vector store for filtering |
| Manual research | Citation requirements with tier classification |

## Tradeoff

Strict source policies may exclude valuable information that exists only in
community sources. The balance: use tiers to weight evidence, not to
absolutely exclude. Tier 4 community observations can be valuable when they
corroborate Tier 1/2/3 evidence — they just shouldn't stand alone as the
sole basis for high-confidence claims.

## Related

- **[Explainable Reasoning Trace](explainable-reasoning-trace.md)** — ERT applies strongest when source tiers indicate high-stakes analysis
- **[Hallucinated Data on Missing Evidence](../failures/hallucinated-data-on-missing-evidence.md)** — source tier enforcement prevents the conditions that cause hallucination
- **[Confidence Decay Without Lifecycle](../failures/confidence-decay-without-lifecycle.md)** — tier classification helps determine when confidence should decay
- **[Uncertainty and Conflict Protocol](uncertainty-and-conflict-protocol.md)** — tier differences between conflicting sources inform conflict resolution
- **[Universal Prompting Principles](../synthesis/universal-prompting-principles.md)** — synthesis page compiling source tiering into universal principles
