---
title: "Karpathy's LLM Wiki: The Complete Guide to His Idea File"
source: "https://antigravity.codes/blog/karpathy-llm-wiki-idea-file"
author: "Antigravity.codes"
published: 2026-04-04
clipped: 2026-04-16
---

# Karpathy's LLM Wiki: The Complete Guide

On April 3, 2026, Andrej Karpathy posted a tweet titled "LLM Knowledge Bases" describing
how he now uses LLMs to build personal knowledge wikis instead of just generating code.
The next day, he followed up with an "idea file" — a GitHub gist that lays out the complete
architecture, philosophy, and tooling behind the concept.

## Core Thesis: Wiki Beats RAG

Karpathy identifies the fundamental problem with RAG: "The LLM is rediscovering knowledge
from scratch on every question. There's no accumulation."

His alternative: "Instead of just retrieving from raw documents at query time, the LLM
incrementally builds and maintains a persistent wiki — a structured, interlinked collection
of markdown files that sits between you and the raw sources."

Key claim: "The knowledge is compiled once and then kept current, not re-derived on every query."

## Three-Layer Architecture

### Layer 1: Raw Sources
Immutable source documents. The LLM reads from them but never modifies them.
Source of truth for verification.

### Layer 2: The Wiki
LLM-generated markdown files — summaries, entity pages, concept pages, comparisons.
The LLM owns this layer entirely. Creates pages, updates them, maintains cross-references.

### Layer 3: The Schema
A configuration document (CLAUDE.md, AGENTS.md) that tells the LLM how the wiki is
structured, what conventions to follow, and what workflows to execute.

## Three Operations

### Ingest
Drop a source into raw/, tell the LLM to process it. A single source might touch 10-15
wiki pages. The LLM creates summary pages, updates concept pages, flags contradictions,
maintains index and log.

### Query
Ask questions against the wiki. The LLM reads index.md to find relevant pages, reads
those pages, synthesizes an answer with citations. Good answers can be filed back as
new wiki pages — this is the compounding loop.

### Lint
Periodic health check: contradictions between pages, stale claims, orphan pages,
missing concept pages, suggested investigations.

## Index and Log

index.md: Content catalog. Organized by category. The LLM reads this first to navigate.
"Works surprisingly well at moderate scale (~100 sources, ~hundreds of pages) and avoids
the need for embedding-based RAG infrastructure."

log.md: Append-only chronological record of all activity.

## Tool Ecosystem

- qmd: Local markdown search (BM25 + vector + LLM re-ranking) by Tobi Lutke
- Obsidian: Markdown viewer/IDE with graph view
- Obsidian Web Clipper: Browser extension for clipping articles to markdown
- Marp: Markdown slide decks
- Dataview: Obsidian plugin for querying frontmatter
- Git: Version control for the wiki

## The Idea File Concept

Karpathy's definition: "In this era of LLM agents, there is less of a point/need of
sharing the specific code/app, you just share the idea, then the other person's agent
customizes & builds it for your specific needs."

This is a new form of open source — not open code, but open ideas designed to be
interpreted and instantiated by AI agents.

## Knowledge Compounding

"The wiki is a persistent, compounding artifact." Cross-references are pre-built.
Contradictions are pre-flagged. Synthesis reflects everything already processed.
Every source added and every question asked makes the wiki richer.

## Human-LLM Division of Labor

"You never (or rarely) write the wiki yourself — the LLM writes and maintains all of it.
You're in charge of sourcing, exploration, and asking the right questions."

The analogy: "Obsidian is the IDE; the LLM is the programmer; the wiki is the codebase."

## Historical Connection: Memex (1945)

Karpathy connects the pattern to Vannevar Bush's Memex — a personal, curated knowledge
store with associative trails. Bush's vision was private, actively curated, with
connections between documents as valuable as the documents themselves.

The missing piece Bush couldn't solve: who does the maintenance?
"LLMs don't get bored, don't forget to update a cross-reference, and can touch 15 files
in one pass. The wiki stays maintained because the cost of maintenance is near zero."
