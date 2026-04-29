# qmd — Retrieval Contract

**qmd** by Tobi Lütke — local hybrid-search engine for markdown.
Repo: <https://github.com/tobi/qmd>
Package: `@tobilu/qmd` (Node ≥ 22)

Three search modes:
- `qmd search` — BM25 full-text (fast, exact-keyword)
- `qmd vsearch` — vector semantic search
- `qmd query` — **hybrid + query expansion + LLM rerank** (the wrapper's primary path)

Everything runs locally. Models auto-download to `~/.cache/qmd/models/`.

This wiki uses qmd as its **primary retrieval surface**. Future wrapper agents
do not read files manually — they call qmd's MCP server.

---

## The Retrieval Contract

The wrapper's primary query is:

> **"How to [verb] [object] best?"**

Examples:
- "How to control character consistency in Midjourney v8 best?"
- "How to build a research agent with Claude Code best?"
- "How to design an agentic ingest pipeline best?"

The wiki responds with a **ranked bundle**:

1. **Most relevant playbook** (collection: `playbooks`)
2. **Supporting patterns** + **tool profiles** + **mechanisms**
3. **Relevant failures** (what to avoid)
4. **Concrete exemplars** (real instantiations)
5. **Background concepts** (only if needed)

The wrapper composes a new prompt **conditioned on this bundle**.
The wiki itself never generates prompts. It is the heart, not the hand.

---

## Collections Strategy

qmd's filter primitive is the **collection** (`-c <name>`). We split by
artifact type (not modality) because retrieval almost always starts with
"what kind of artifact answers this question?" — playbook first, atomics next.

| Collection | Path | Wrapper use |
|---|---|---|
| `playbooks` | `compiled/playbooks/` | First query — does an existing playbook cover this goal? |
| `profiles` | `compiled/profiles/` | Tool deep-dive: "everything about Midjourney v8" |
| `syntheses` | `compiled/syntheses/` | Cross-cutting analysis lookup |
| `patterns` | `distilled/patterns/` | Means-of-control techniques |
| `failures` | `distilled/failures/` | Anti-patterns / what to avoid |
| `tools` | `distilled/tools/` | Lean factual surface for a tool |
| `mechanisms` | `distilled/mechanisms/` | Specific knobs (--stylize, temperature, …) |
| `exemplars` | `distilled/exemplars/` | Real prompts, real workflow JSON |
| `concepts` | `distilled/concepts/` | Background mental models |
| `raw` | `raw/` | Source material — **excluded from default queries**; explicit `-c raw` only |

**Modality filtering** (image vs. video vs. text) is achieved by the wrapper
phrasing the query well — "Midjourney character consistency" — letting BM25
hit the `tools` field and rerank pull the right results. We do *not* split
collections by modality because that would force the wrapper to pre-decide
modality before searching, which often it can't.

**Why raw is excluded from default queries.** Envelope sidecars (`*.envelope.md`)
in `raw/` are metadata, not content, and pollute result sets. qmd's CLI does
not support per-collection glob exclusion, so the cleanest fix is excluding
the entire `raw` collection from default ranking via `qmd collection exclude
raw`. Source material stays explicitly queryable (`qmd query "..." -c raw`)
when the wrapper genuinely wants source-level retrieval, but distilled
canonical knowledge ranks first in the default path. This matches the
retrieval contract.

---

## Embedding Model — Multilingual (PL + EN)

Default is `embeddinggemma-300M` (English-optimized, 768-dim). This wiki may
ingest Polish sources, so we override with **Qwen3-Embedding-0.6B** (1024-dim,
119 languages incl. PL):

```bash
export QMD_EMBED_MODEL="hf:Qwen/Qwen3-Embedding-0.6B-GGUF/Qwen3-Embedding-0.6B-Q8_0.gguf"
```

### CRITICAL: Persist this env var in your shell

`qmd embed` uses the env var at write time; `qmd query` and `qmd vsearch` use
it at read time. **They must match** or you get:

```
SqliteError: Dimension mismatch for query vector ... Expected 1024, received 768
```

The setup script (`setup.sh`) sets the var only inside its own process. For
interactive use, do ONE of these:

1. **Add to your shell profile** (`~/.bashrc` or `~/.bash_profile`):
   ```bash
   source /c/AI/0_Ainything/00_AgentHjuston/forge_ultimate/kms/.qmd/env
   ```
2. **Per-shell**:
   ```bash
   source .qmd/env    # from kms/ root
   ```

The MCP server config in `.claude/settings.json` already carries the env var,
so wrapper agents using qmd via MCP work correctly without shell setup.

Reranker stays default (`qwen3-reranker-0.6b-q8_0`) — multilingual already.
Query expansion model stays default.

---

## Setup Steps (Phase B)

```bash
# 0. Prereqs
node --version          # must be ≥ 22
brew install sqlite     # macOS only — Linux/Windows use system sqlite

# 1. Install qmd
npm install -g @tobilu/qmd

# 2. Set multilingual embedding model (operator has PL sources)
export QMD_EMBED_MODEL="hf:Qwen/Qwen3-Embedding-0.6B-GGUF/Qwen3-Embedding-0.6B-Q8_0.gguf"

# 3. Add collections (run from kms/ root)
qmd collection add ./compiled/playbooks      --name playbooks
qmd collection add ./compiled/profiles       --name profiles
qmd collection add ./compiled/syntheses      --name syntheses
qmd collection add ./distilled/patterns      --name patterns
qmd collection add ./distilled/failures      --name failures
qmd collection add ./distilled/tools         --name tools
qmd collection add ./distilled/mechanisms    --name mechanisms
qmd collection add ./distilled/exemplars     --name exemplars
qmd collection add ./distilled/concepts      --name concepts
qmd collection add ./raw                     --name raw

# 4. Build embeddings
qmd embed

# 5. Sanity check
qmd status
qmd query "how to ingest a deep research source" -n 5 --explain
```

(Some directories — `compiled/`, `distilled/{tools,mechanisms,exemplars}` —
will be empty until Phase C migration; add the collections anyway so qmd
picks up new artifacts as they land.)

---

## MCP Server Registration

Already configured in `../.claude/settings.json`. Two transport choices:

**stdio (default — per-session, no daemon)**
```json
"qmd": { "command": "qmd", "args": ["mcp"] }
```

**HTTP (shared, long-lived)**
```bash
qmd mcp --http --daemon       # starts on localhost:8181
qmd mcp stop                  # stop via PID file
```

Choose stdio for now (simpler, no daemon to babysit). Switch to HTTP if you
want multiple Claude Code sessions sharing one warm index.

### Exposed MCP Tools

| Tool | Purpose |
|---|---|
| `query` | Hybrid search (BM25 + vector + LLM rerank). The wrapper's primary call. |
| `get` | Retrieve a document by path or docid (e.g. `#abc123`). |
| `multi_get` | Retrieve multiple by glob. |
| `status` | Index health + collection list. |

The wrapper's typical sequence:
1. `query` (filtered to `playbooks` collection) → ranked filenames + tldrs
2. If hit: `get` the top playbook's full body
3. Else: re-`query` across `patterns,profiles,failures,exemplars`
4. `multi_get` the top-2-3 bodies
5. Optional: read `INDEX.json` for typed graph traversal (qmd doesn't expose typed edges natively)

---

## Why qmd (and not Grep + custom code)

| Need | Grep / glob | qmd |
|---|---|---|
| Find "stylize" exact-keyword | ✅ | ✅ (BM25) |
| Find "control output diversity" by meaning | ❌ | ✅ (vector) |
| Rank results by relevance | ❌ | ✅ (LLM rerank) |
| Scope by artifact type | ❌ | ✅ (`-c <collection>`) |
| Multilingual (PL+EN) | ✅ | ✅ (Qwen3 embedder) |
| Local + free per query | ✅ | ✅ |
| MCP-native for wrapper agents | ❌ | ✅ |

---

## How Frontmatter Serves qmd

qmd indexes the whole markdown file (frontmatter + body) and chunks it at
~900 tokens with 15% overlap. Design implications:

- **High-signal facets in frontmatter** boost BM25 hits — `tools`, `keywords`,
  `goal`, `tldr`, `tags`. The wrapper's typical query mentions a tool slug
  (`midjourney-v8`) which exact-matches the `tools:` field.
- **Body skeleton ≤ 200 lines** keeps each artifact within one or two chunks,
  preserving section coherence after chunking. Section H2 headings are
  keyword-rich (`When to use`, `How it works`, `Failure modes`) so BM25 can
  locate them.
- **`tldr` ≤ 280 chars** — wrapper triages on tldrs first via `--files` or
  `--json` output, deep-reads only the top 2-3.
- **`keywords` field** carries BM25-precision terms a user might type that
  don't appear naturally in prose ("cref", "stylize", "extended_thinking").

---

## Token Economy

| Layer | Tokens | When |
|---|---|---|
| qmd hybrid search | ~0 (local CPU/GPU) | Every retrieval |
| Read top-N tldrs (`--json`) | ~50 / artifact × N | Triage |
| Read top 2-3 bodies | ≤ 200 lines each | Deep read |
| INDEX.json read | bounded | Typed graph traversal |
| CLAUDE.md kernel | ~120 lines | Each session start |

**Reads are cheap. Writes (ingest, compile-playbook) are allowed to be
expensive** — that cost amortizes across thousands of cheap retrievals.

---

## Maintenance

| When | Action |
|---|---|
| After every artifact write | `qmd update` (incremental — picks up changes) |
| After taxonomy/policy changes that shift indexing | `qmd embed -f` (force re-embed) |
| Monthly | `qmd cleanup` (drop orphans/cache) |
| On embedding-model change | `qmd embed -f` |

Hooks plan: `regenerate-index-json.sh` (PostToolUse) will also fire `qmd update`
asynchronously after each artifact write so the index stays warm.

---

## Wrapper Integration (future)

When the meta-prompter wrapper ships, its primary tool is qmd's MCP `query`.
The wrapper:

1. Receives user goal: "How to [verb] [object] best?"
2. `query` with collection hint inferred from the goal (start with `playbooks`)
3. Reads top-N tldrs from `--json` output, deep-reads top 2-3 via `get`
4. Optionally reads `INDEX.json` for typed graph traversal (e.g., follow
   `composes-with` edges from a chosen playbook to its component patterns)
5. Synthesizes a new prompt conditioned on the bundle
6. (Ripple loop) If the synthesis reveals new knowledge, files it back as a
   new artifact via the ingest skill

The wiki's responsibility ends at "served the right typed knowledge."
The wrapper's responsibility begins at "compose a great prompt."
