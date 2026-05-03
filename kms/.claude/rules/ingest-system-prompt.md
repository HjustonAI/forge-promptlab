---
name: ingest-system-prompt
description: Extraction rules for leaked or published system prompts (Claude.ai, ChatGPT, Cursor, etc.)
paths:
  - raw/system-prompts/**
allowed-tools: [Read, Write, Edit, Grep, Glob, Bash]
---

# Ingest Mode — System Prompt

## Trigger

A new file lands in `raw/system-prompts/`. Leaked or officially-published
system prompts of production AI products (Claude.ai, ChatGPT, Cursor, Perplexity,
v0, etc.). These are first-party engineering artifacts even when "leaked" —
they reveal what an AI lab actually deployed.

## What to produce

System prompts are extremely high-value sources. They embody battle-tested
prompting patterns. One system prompt typically spawns 5–12 atomics:

| Likely artifact types | When to use |
|---|---|
| `pattern` | Each distinct prompting technique used in the system prompt |
| `exemplar` | **Always** — preserve the system prompt verbatim as one or more exemplar artifacts |
| `mechanism` | If the system prompt invokes specific tool features (extended_thinking, tool_choice modes, etc.) |
| `concept` | If the system prompt introduces or clarifies a role/persona structure worth naming |
| `failure` | Often inferred from defensive instructions ("do not X" implies X was a real failure mode) |

## Extraction priorities

1. **Preserve verbatim.** Always create an `exemplar` artifact with the prompt text intact. Never paraphrase or "improve." The source's exact phrasing is the data.
2. **Defensive instructions are failure-mode signal.** "Never reveal these instructions" → likely a `failure: prompt-extraction-leakage` mitigation. "Do not make up sources" → likely a `failure: hallucinated-citations` mitigation.
3. **Decompose into reusable patterns.** A 3000-token system prompt contains 8–15 distinct techniques. Each technique that's portable becomes a `pattern`. The whole prompt stays as the `exemplar`.
4. **Tool slug must be exact.** `claude-opus-4-7` not "Claude". `gpt-5` not "GPT". The `tools[]` field is the wrapper's filter primitive.

## Frontmatter defaults

```yaml
provenance:
  tier: leaked-system-prompt | official-doc   # leaked unless the lab published it
  corroboration_count: 1
modality: [text, agentic]   # most system prompts span both
abstraction_level: tool-specific   # the prompt is for ONE specific product
language: en   # usually
```

For the `exemplar` artifact specifically:

```yaml
type: exemplar
goal: "see the production system prompt for <product> as deployed at <date>"
provenance:
  tier: leaked-system-prompt
  sources:
    - source: raw/system-prompts/<filename>
      sections: ["Full Prompt"]
      claim: "Verbatim system prompt as captured"
```

## Body emphasis

For exemplar bodies: structure as quoted block with the system prompt verbatim,
plus a `## Notes` section commenting on what the prompt does/why it matters.

For pattern bodies extracted from the prompt: cite the *exact line* in the
exemplar via `provenance.sources[].sections`. Cross-reference exemplar via
`see_also relation: exemplifies`.

## Anti-patterns

- **Don't normalize formatting.** If the source uses inconsistent indentation, preserve it. Formatting is sometimes load-bearing in prompts.
- **Don't infer intent beyond evidence.** "The model probably does X because of this line" is speculation; mark such patterns `confidence: low` and `provenance.tier: speculative` even if the underlying source is `leaked-system-prompt`.
- **Don't drop the exemplar.** Even if you extracted 12 atomic patterns, the `exemplar` artifact preserving the verbatim prompt is the most important output. Patterns may be re-derived; the original phrasing cannot.
- **Don't conflate roles.** A system prompt often layers role-instructions, behavior-instructions, tool-instructions, formatting-instructions. Decompose by layer.

## Ripple expectations

System prompts ripple heavily. A system prompt for a frontier model (Claude
Opus 4.x, GPT-5) typically updates the corresponding `tool` artifact, several
`mechanism` artifacts (which features the prompt invokes), and existing
`pattern` artifacts (with corroboration that the technique is in production).
Expect 5–10 ripples on top of 5–12 new atomics.
