#!/usr/bin/env bash
# Forge Heart Wiki — qmd bootstrap
# Run from kms/ root. Idempotent (safe to re-run after adding new directories).

set -euo pipefail

# 0. Prereq check
NODE_MAJOR=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_MAJOR" -lt 22 ]; then
  echo "ERROR: qmd requires Node ≥ 22. Found: $(node -v)"
  exit 1
fi

# 1. Install qmd if missing
if ! command -v qmd >/dev/null 2>&1; then
  echo "Installing @tobilu/qmd globally..."
  npm install -g @tobilu/qmd
fi

# 2. Multilingual embedding model (PL + EN)
export QMD_EMBED_MODEL="hf:Qwen/Qwen3-Embedding-0.6B-GGUF/Qwen3-Embedding-0.6B-Q8_0.gguf"
echo "Using embedding model: $QMD_EMBED_MODEL"

# 3. Add collections (per-type scoping for the retrieval contract)
declare -a COLLECTIONS=(
  "compiled/playbooks:playbooks"
  "compiled/profiles:profiles"
  "compiled/syntheses:syntheses"
  "distilled/patterns:patterns"
  "distilled/failures:failures"
  "distilled/tools:tools"
  "distilled/mechanisms:mechanisms"
  "distilled/exemplars:exemplars"
  "distilled/concepts:concepts"
  "raw:raw"
)

for entry in "${COLLECTIONS[@]}"; do
  path="${entry%%:*}"
  name="${entry##*:}"
  if [ ! -d "$path" ]; then
    echo "  skip: $path (directory does not exist yet)"
    continue
  fi
  echo "  add: $name -> $path"
  qmd collection add "./$path" --name "$name" || echo "    (already added)"
done

# 4a. Exclude raw from default queries — keeps source material out of default
#     ranking (envelopes pollute results) while remaining explicitly queryable
#     via `qmd query "..." -c raw`. Matches retrieval contract: distilled first,
#     raw as fallback.
qmd collection exclude raw 2>/dev/null || true

# 4b. Annotate collections with semantic context (improves retrieval ranking)
echo "Annotating collections..."
qmd context add qmd://playbooks/   "Goal-oriented compositions: 'to accomplish G with tool T, compose M1+M2+M3'. Wrapper's primary input." 2>/dev/null || true
qmd context add qmd://profiles/    "Per-tool digests covering control patterns, mechanisms, failures, and exemplars for one specific tool or model." 2>/dev/null || true
qmd context add qmd://syntheses/   "Cross-cutting analyses spanning multiple modalities or tools — comparison matrices, universal principles." 2>/dev/null || true
qmd context add qmd://patterns/    "Means of controlling AI behavior — prompt structures, agentic loop shapes, tool combinations, workflow patterns." 2>/dev/null || true
qmd context add qmd://failures/    "Anti-patterns and observed failure modes when controlling AI — what to avoid and why." 2>/dev/null || true
qmd context add qmd://tools/       "Lean factual surface for controllable systems — model, app, framework, MCP server, generator." 2>/dev/null || true
qmd context add qmd://mechanisms/  "Single tunable knobs within tools — parameters, flags, control surfaces (e.g. --stylize, extended_thinking)." 2>/dev/null || true
qmd context add qmd://exemplars/   "Concrete instantiations worth preserving — real prompts, real workflows, real skill specs." 2>/dev/null || true
qmd context add qmd://concepts/    "Mental models, architectures, and definitions needed to understand patterns and tools." 2>/dev/null || true
qmd context add qmd://raw/         "Immutable source material — papers, articles, system prompts, idea files. De-prioritized in default retrieval." 2>/dev/null || true

# 5. Build embeddings
echo "Building embeddings..."
qmd embed

# 6. Sanity check
echo ""
qmd status
echo ""
echo "qmd bootstrap complete."
echo ""
echo "IMPORTANT — persist the embedding-model env var in your shell:"
echo "  Add to ~/.bashrc:"
echo "    source $(pwd)/.qmd/env"
echo "  Or run before each qmd query in a new shell:"
echo "    source .qmd/env"
echo ""
echo "Otherwise interactive 'qmd query' will load the wrong model and fail with"
echo "  'Dimension mismatch for query vector ... Expected 1024, received 768'"
echo ""
echo "After sourcing, try:"
echo "  qmd query 'how to ingest a deep research source' -n 5 --explain"
