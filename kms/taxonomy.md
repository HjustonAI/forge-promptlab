# Forge Heart Wiki — Taxonomy v2

Controlled vocabulary. Every value used in artifact frontmatter MUST appear here first.

---

## Artifact Types

| Type | Tier | Directory | Tag prefix | Definition |
|---|---|---|---|---|
| `pattern` | atomic | `distilled/patterns/` | `pat:` | Means of controlling AI behavior — prompt structure, agentic loop, tool combo, workflow shape |
| `concept` | atomic | `distilled/concepts/` | `con:` | What something IS — architecture, mental model, definition |
| `failure` | atomic | `distilled/failures/` | `fail:` | What goes wrong — anti-pattern, observed failure mode |
| `tool` | atomic | `distilled/tools/` | `tool:` | A controllable system — model, app, framework, MCP server, generator |
| `mechanism` | atomic | `distilled/mechanisms/` | `mech:` | A single knob within a tool — parameter, flag, node, control surface |
| `exemplar` | atomic | `distilled/exemplars/` | `ex:` | A concrete instantiation — real prompt, real workflow, real skill spec |
| `profile` | compiled | `compiled/profiles/` | `prof:` | Per-tool digest covering control patterns, mechanisms, failures, exemplars |
| `synthesis` | compiled | `compiled/syntheses/` | `synth:` | Cross-cutting analysis across modalities/tools — comparison, universal principle |
| `playbook` | compiled | `compiled/playbooks/` | `play:` | Goal-oriented composition: "to accomplish G, compose M1+M2+M3" |

Atomic = extract from raw, one source claim per file.
Compiled = pre-digest from atomics, must list `compiled_from`.

---

## Domains

Top-level knowledge areas. Every artifact belongs to ≥ 1.

| Domain | Scope |
|---|---|
| `prompting` | Prompt engineering — structure, technique, anti-patterns across model families |
| `agentic-systems` | Agent architectures, orchestration, multi-agent coordination, tool use |
| `knowledge-management` | Knowledge bases, RAG, wikis, compounding knowledge systems |
| `model-behavior` | Capabilities, limitations, behavioral quirks, transferability across models |
| `tooling` | Developer tools, MCP servers, IDE extensions, CLI utilities |
| `generative-media` | Image/video/audio/3D generation systems and their control surfaces |
| `automation` | Workflow tools, n8n-style flows, integration glue, scheduling |
| `operations` | Deployment, monitoring, failure handling, cost management |

---

## Modalities

Orthogonal facet. Artifacts can carry multiple modalities (e.g., a multimodal pattern).

| Modality | Scope |
|---|---|
| `text` | Text-only LLMs and prompting |
| `image` | Image generation (Midjourney, DALL-E, Flux, SD) |
| `video` | Video generation (Veo, Sora, Runway, Kling, Pika) |
| `audio` | Speech, music, sound generation (ElevenLabs, Suno, Udio) |
| `multimodal` | Genuinely cross-modal (vision-language, audio-visual) |
| `agentic` | Agentic systems independent of underlying modality |
| `code` | Code generation and software-engineering AI |
| `3d` | 3D asset, scene, animation generation |

---

## Abstraction Levels

Where an artifact sits on the generality ladder.

| Level | Meaning |
|---|---|
| `tool-specific` | Tied to one tool/version (e.g., a Midjourney v8 mechanism) |
| `technique` | Generalizable approach across tools within a modality |
| `architectural` | System-level pattern (e.g., RAG, agentic loop) |
| `universal-principle` | Holds across modalities and tools (e.g., specificity beats vagueness) |

---

## Tools (registry)

Every value used in `frontmatter.tools` must appear here. Add new tools by appending a row + creating a `distilled/tools/<slug>.md` artifact.

### Text-LLM family

| Slug | Vendor | Notes |
|---|---|---|
| `claude-opus-4-7` | Anthropic | Flagship 4.x agentic model |
| `claude-sonnet-4-6` | Anthropic | Mid-tier 4.x |
| `claude-haiku-4-5` | Anthropic | Fast 4.x |
| `gpt-5` | OpenAI | (placeholder — fill on first use) |
| `gemini-2-5-pro` | Google | Long-context |

### Image

| Slug | Vendor | Notes |
|---|---|---|
| `midjourney-v8` | Midjourney | Current flagship |
| `dalle-3` | OpenAI | |
| `flux-1` | Black Forest Labs | |
| `stable-diffusion-3-5` | Stability AI | |

### Video

| Slug | Vendor | Notes |
|---|---|---|
| `veo-3` | Google DeepMind | |
| `sora` | OpenAI | |
| `runway-gen-3` | Runway | |
| `kling` | Kuaishou | |

### Audio

| Slug | Vendor | Notes |
|---|---|---|
| `elevenlabs-v3` | ElevenLabs | |
| `suno-v4` | Suno | |
| `udio` | Udio | |

### Agentic / orchestration / tooling

| Slug | Vendor | Notes |
|---|---|---|
| `claude-code` | Anthropic | CLI agentic harness |
| `mcp` | Anthropic (open spec) | Model Context Protocol |
| `n8n` | n8n | Workflow automation |
| `qmd` | Tobi Lütke | Local hybrid-search engine for markdown |
| `claude-agent-sdk` | Anthropic | SDK for custom agents |

(This registry grows. Keep slug pattern: `vendor-name-version`.)

---

## Provenance Tiers

| Tier | Trust | Examples |
|---|---|---|
| `official-doc` | First-party authoritative | Anthropic docs, Midjourney guide |
| `peer-reviewed` | External validation | arXiv, formally reviewed |
| `leaked-system-prompt` | First-party but unofficial | Leaked Claude.ai system prompt |
| `corroborated-community` | ≥ 3 independent confirmations | Reddit + Discord + blog |
| `personal-field` | Direct field observation | Operator's run notes |
| `speculative` | Single-source, untested | Idea file, hypothesis |

---

## Confidence Levels

| Level | Meaning |
|---|---|
| `high` | Multiple independent sources confirm; tested in practice |
| `medium` | Single strong source or multiple weak sources; plausible but not battle-tested |
| `low` | Single source, anecdotal, or extrapolated; useful but unverified |

Confidence and provenance tier are independent: a `personal-field` observation can be `high` confidence (you ran it 50 times); a `peer-reviewed` paper can be `low` confidence (hasn't been replicated).

---

## Lifecycle States

| State | Meaning | Trigger |
|---|---|---|
| `current` | Active, trusted | Passes all gates |
| `review-soon` | Verify still accurate | 90 days OR `decay_triggers.event` fires |
| `stale` | Re-verify before retrieval | 180 days unreviewed OR contradicted |
| `archived` | Preserved, excluded from default retrieval | Superseded or deprecated |

---

## Relation Enum (cross-references)

| Relation | Meaning |
|---|---|
| `implements` | A is a concrete realization of B |
| `violates` | A is a failure that breaks B |
| `composes-with` | A and B combine into a larger technique |
| `supersedes` | A replaces B (B should be archived) |
| `exemplifies` | A is a concrete instance of B |
| `conflicts-with` | A and B make incompatible claims |
| `specializes` | A is a tool/modality-specific case of B |
| `generalizes` | A is the general principle behind B |
| `requires` | A cannot work without B |
| `enables` | A makes B possible |
| `mitigates` | A reduces or prevents B |

---

## Languages

| Code | Language |
|---|---|
| `en` | English |
| `pl` | Polish |

Wrapper retrieval can filter by language. Bilingual artifacts list both.

---

## Tags (v2)

Tags refine domain classification. Each tag must appear here before use.

### prompting
- `prompt-structure` — How to structure prompts (system, user, few-shot, CoT)
- `prompt-anti-pattern` — Known ineffective or harmful prompting approaches
- `prompt-transferability` — Which techniques transfer across model families
- `prompt-ordering` — How component order in prompts affects execution quality
- `negative-prompting` — Specifying what NOT to produce
- `delta-prompting` — Continuing/refining prior output
- `goal-state` — Specifying outcome rather than steps

### agentic-systems
- `agent-architecture` — Structural patterns for agent systems
- `agent-orchestration` — Multi-step and multi-agent coordination
- `tool-integration` — How agents connect to external tools and APIs
- `human-agent-contract` — Division of responsibility between human and agent
- `agent-communication` — How agents exchange information
- `subagent-spawn` — Patterns for delegating to sub-agents
- `skill-invocation` — Skill-based capability injection

### knowledge-management
- `knowledge-compounding` — Systems where knowledge accumulates over time
- `knowledge-architecture` — Structural design of knowledge systems
- `knowledge-quality` — Confidence, freshness, contradiction management
- `ingest-pipeline` — How raw material becomes structured knowledge
- `hybrid-search` — BM25 + vector + rerank retrieval
- `wiki-architecture` — Karpathy-style and similar wiki patterns

### model-behavior
- `capability-map` — What models can and cannot do
- `behavioral-quirk` — Non-obvious model behaviors worth knowing
- `cross-model` — Comparisons or transferability between model families
- `extended-thinking` — Native reasoning behavior
- `context-rot` — Multi-turn degradation patterns

### tooling
- `mcp-server` — MCP server patterns and integrations
- `cli-tool` — Command-line tools relevant to AI control
- `ide-integration` — Editor/IDE integration patterns
- `hook` — Lifecycle hook patterns (Claude Code hooks etc.)
- `local-llm` — Local model deployment and tooling

### generative-media
- `composition-control` — Controlling layout, framing, structure
- `style-control` — Controlling aesthetic, mood, rendering
- `consistency-control` — Character/scene/style consistency across renders
- `parameter-tuning` — Working with weight/strength/scale knobs
- `reference-conditioning` — Image/audio/video as reference input

### automation
- `workflow-pattern` — Reusable automation flow shapes
- `webhook-pattern` — Event-driven trigger patterns
- `glue-integration` — Connecting heterogeneous systems

### operations
- `lifecycle-management` — Managing knowledge freshness and retirement
- `maintenance-pattern` — Recurring operational tasks
- `failure-repair` — How to diagnose and fix operational failures
- `cost-management` — Token/inference cost control

(Tags grow. Add via taxonomy update + first-use artifact.)
