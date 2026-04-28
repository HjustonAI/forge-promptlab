---
title: "RAG Cross-Document Insight Loss"
type: failure
domains: [knowledge-management]
tags: [knowledge-quality, ingest-pipeline]
confidence: medium
confidence_rationale: "Synthesized from operational patterns; consistent with theoretical analysis but not from a single primary experiment"
lifecycle: current
created: 2026-04-16
updated: 2026-04-16
evidence:
  - source: raw/field-notes/rag-vs-compiled-knowledge-field-observation.md
    sections: ["Observation 1: Cross-Document Insight Loss"]
    claim: "RAG-only systems consistently miss insights requiring synthesis across 3+ documents"
  - source: raw/deep-research/karpathy-llm-wiki-guide.md
    sections: ["Core Thesis: Wiki Beats RAG"]
    claim: "The LLM is rediscovering knowledge from scratch on every question — no accumulation"
dedupe_key: "fail:rag-cross-document-insight-loss"
contradictions: []
see_also:
  - artifact: distilled/concepts/wiki-vs-rag.md
    relationship: "This failure is the primary argument for wiki over RAG"
  - artifact: distilled/concepts/knowledge-compounding.md
    relationship: "RAG's chunk isolation prevents the cross-document synthesis that enables compounding"
  - artifact: distilled/patterns/distill-first-architecture.md
    relationship: "Distill-first solves this by pre-compiling cross-cutting knowledge"
supersedes: []
---

# RAG Cross-Document Insight Loss

## Failure Mode

In RAG-only knowledge systems, insights that require synthesizing information across
three or more documents are consistently missed or incomplete.

## Mechanism

RAG retrieves chunks relevant to a query, then asks the LLM to synthesize. But:

1. Retrieval finds chunks similar to the **query**, not to **each other**
2. Cross-document connections (contradictions, complementary evidence, evolving trends)
   are invisible to the retrieval step
3. The LLM sees a flat set of chunks with no pre-built relationships
4. Synthesis is limited to what can be discovered in a single pass over retrieved chunks

## Example

50+ prompt technique documents stored in RAG. Query: "which techniques conflict with
each other?" The system cannot reliably answer because contradiction detection requires
comparing every document against every other — not retrieving chunks for a single query.

## Repair

Use a compiled knowledge approach where cross-document analysis happens at **ingest
time**, not query time:

1. When a new source is ingested, compare its claims against all existing canonical artifacts
2. Flag contradictions explicitly in artifact metadata
3. Build cross-references during ingestion, not during retrieval
4. Make contradiction and relationship data queryable through the index

## Severity

High for knowledge bases where cross-document insight is the primary value. Low for
simple lookup use cases where documents are independent.

## Detection

Ask your knowledge system: "What contradictions exist in our knowledge base?"
If it can't answer or gives incomplete results, cross-document insight loss is present.

## Related

- **[Wiki vs RAG](../concepts/wiki-vs-rag.md)** — this failure is the primary argument for wiki over RAG
- **[Knowledge Compounding](../concepts/knowledge-compounding.md)** — RAG's chunk isolation prevents the cross-document synthesis that enables compounding
- **[Distill-First Architecture](../patterns/distill-first-architecture.md)** — distill-first solves this by pre-compiling cross-cutting knowledge
