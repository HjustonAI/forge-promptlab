---
title: "Universal Prompting Principles"
type: synthesis
domains: [prompting, agentic-systems]
tags: [prompt-structure, prompt-ordering, agent-architecture]
confidence: high
confidence_rationale: "Synthesized from patterns validated independently across 4+ distinct AI tools; each principle has multi-source evidence"
lifecycle: current
created: 2026-04-16
updated: 2026-04-16
evidence:
  - source: raw/deep-research/claude-cowork.ctx.md
    sections: ["Mental Model", "Prompt Architecture [OVERRIDE]"]
    claim: "Prompt as architectural brief; goal-state execution pattern"
  - source: raw/deep-research/gemini-deep-research.ctx.md
    sections: ["Mental Model", "Prompt Architecture [OVERRIDE]"]
    claim: "Prompt as research brief; mandatory component ordering"
  - source: raw/deep-research/veo3.ctx.md
    sections: ["Mental Model", "Prompt Architecture [OVERRIDE]"]
    claim: "Prompt as production brief; strict component ordering"
  - source: raw/deep-research/midjourney.ctx.md
    sections: ["Mental Model", "Prompt Architecture [OVERRIDE]"]
    claim: "Prompt as physics directive; spatial relationship requirements"
compiled_from:
  - distilled/patterns/prompt-as-architectural-brief.md
  - distilled/patterns/explicit-component-ordering.md
  - distilled/patterns/uncertainty-and-conflict-protocol.md
  - distilled/patterns/explainable-reasoning-trace.md
  - distilled/patterns/evidence-tiered-source-policy.md
  - distilled/patterns/delta-only-continuation.md
  - distilled/failures/keyword-salad-prompt-collapse.md
  - distilled/failures/ambiguity-as-silent-execution.md
  - distilled/failures/hallucinated-data-on-missing-evidence.md
  - distilled/failures/outcome-driven-constraint-violation.md
dedupe_key: "synth:universal-prompting-principles"
contradictions: []
see_also:
  - artifact: distilled/references/midjourney-v8-calibration.md
    relationship: "MJ V8 application of universal principles"
  - artifact: distilled/references/veo3-production-parameters.md
    relationship: "Veo3 application of universal principles"
  - artifact: distilled/references/gemini-deep-research-parameters.md
    relationship: "Gemini DR application of universal principles"
  - artifact: distilled/references/claude-cowork-architecture.md
    relationship: "Claude Cowork application of universal principles"
  - artifact: distilled/synthesis/model-comparison-matrix.md
    relationship: "Where models diverge from universal principles"
supersedes: []
---

# Universal Prompting Principles

This is the most important page in the wiki for anyone building prompts for modern AI tools. It compiles what works across all models into one cohesive, actionable document. Every principle below has been validated independently across at least two distinct tool contexts — image generation, video production, autonomous research, and workflow orchestration — making these cross-cutting truths, not tool-specific tricks.

---

## The Fundamental Shift

All four models studied (Midjourney V8, Veo3, Gemini Deep Research, Claude Cowork) converge on the same insight: **modern AI tools are execution systems, not conversation partners.** Your prompt is an architectural brief, not a question.

| Conversational prompting | Architectural prompting |
|-------------------------|----------------------|
| "Can you help me with X?" | "I want X so that Y. Scope: Z. Constraints: W." |
| Describes steps to follow | Defines terminal state and boundaries |
| Expects clarification loop | Expects autonomous execution |
| Output is a response | Output is a system state change |

This shift applies regardless of modality. A Midjourney prompt is a physics directive for a render engine. A Veo3 prompt is a production brief for a virtual studio. A Gemini DR prompt is a research specification for an analyst. A Cowork prompt defines a terminal state for an orchestration engine. None of them are having a conversation with you.

---

## Principle 1: Prompt as Architectural Brief

**What it means:** Treat every prompt as a constraint document that defines an outcome, not as a conversational request that expects back-and-forth.

**Why it works across all tools:** Modern AI systems build execution plans from your prompt, allocate resources (search loops, compute, tool calls) based on your specification, evaluate completion against your defined terminal state, and never pause to clarify. Ambiguity is resolved by guessing, not asking.

**The five structural elements of an effective brief:**

| Element | Purpose | Example |
|---------|---------|---------|
| 1. Terminal state | What "done" looks like (outcome, not process) | "A 4K portrait with teal neon rim light" / "A report with comparison tables and confidence levels" |
| 2. Scope | What the system may touch and where to look | "Focus on European regulatory filings 2024-2026" / "Subject fills center frame, environment extends 2m" |
| 3. Constraints | What must not happen; hard limits | "Do not infer or estimate" / "Avoid: cinematic, epic, beautiful" |
| 4. Output specification | Exact format, location, naming | "Markdown with ## headers" / "--ar 16:9 --s 150 --style raw" |
| 5. Uncertainty handling | What to do when data is missing or ambiguous | "State 'Data Unavailable'" / Gate clause before execution |

**Cross-tool evidence:**
- **Claude Cowork**: "Done Framework" — define terminal state, agent builds plan
- **Gemini Deep Research**: prompt defines research dimensions, not questions to answer
- **Veo3**: prompt is a production brief with camera, subject, action, style specs
- **Midjourney V8**: every sentence is a physics directive, not a creative suggestion

---

## Principle 2: Explicit Component Ordering

**The universal truth:** Prompt component order is not stylistic preference — it reflects how the system parses and allocates attention. Early tokens establish foundations that later tokens modify. Disordering components forces the model to retroactively rewire already-calculated representations.

### The Universal Pattern

| Step | Function | What it does |
|------|----------|-------------|
| 1. Anchor | Establishes what exists or what should be achieved | Subject, goal, role |
| 2. Scope | Defines where to operate and what to consider | Environment, research dimensions, file scope |
| 3. Modulation | Specifies how to do it | Style, execution rules, source policies |
| 4. Constraints | Declares what not to do | Negatives, limits, exclusions, gate clauses |
| 5. Output | Defines what the result looks like | Parameters, format specs, naming conventions |

### Four Tool-Specific Orderings Mapped to Universal Pattern

| Universal Step | Midjourney V8 | Veo3 | Gemini Deep Research | Claude Cowork |
|---------------|---------------|------|---------------------|---------------|
| 1. Anchor | Subject | Camera, Subject | Role | Goal State |
| 2. Scope | Action + Environment | Action, Context | Task, Research Plan Scope | File/Context Scope |
| 3. Modulation | Lighting, Medium, Atmosphere | Style | Source Policy | Execution Rules |
| 4. Constraints | Reference flags | Audio (separate pathway), Negatives | Uncertainty Protocol | Gate Clause, Constraints |
| 5. Output | Parameters (--s, --ar, etc.) | (implicit in style) | Output Format | Output Spec |

**Why the pattern holds across modalities:** Every system processes sequentially. The anchor token(s) establish a spatial bounding box (generative models) or planning foundation (agent systems). Everything after modulates within those bounds. Putting constraints before the anchor forces retroactive rewiring — causing prompt dropping in generative models and misallocated plans in agents.

**Tradeoff:** Strict ordering adds cognitive load for prompt authors. The payoff is dramatically better execution quality, especially for complex prompts. For simple single-purpose prompts, ordering matters less.

---

## Principle 3: Natural Language Over Keywords

**The universal rule:** Keyword lists are universally harmful in modern models. Connected sentences with explicit spatial, logical, or relational structure always outperform comma-separated tags.

**The mechanism:** Modern AI systems (Midjourney V8, Veo3, and increasingly agent systems) parse prompts syntactically, building internal maps from the grammatical relationships between words. A keyword list provides isolated facts with no relationships:

| Keyword input | What the model receives |
|--------------|------------------------|
| "portrait" | A genre, not a composition |
| "woman" | A subject, not positioned |
| "neon" | A light source, not placed |
| "8k" | A resolution, not a quality characteristic |
| "highly detailed" | A vague modifier with no spatial target |

Six disconnected attention signals. The model attempts to satisfy all simultaneously, producing a generic "vibe" with no spatial coherence, lighting logic, or compositional structure.

**The repair is the same everywhere:** Rewrite keywords as connected sentences with explicit relationships.

**Before:** `portrait, woman, neon, cyberpunk, 8k, highly detailed`

**After:** `A woman in a neon-lit cyberpunk district, sharp macro detail on rain-soaked leather jacket. Single neon sign above camera-right, casting teal light across her cheekbone.`

Each sentence loads one directive. Spatial relationships are explicit: "from the left," "above," "casting onto." This applies to agent systems too — structured natural language with clear scope and relationships outperforms bullet-point lists of requirements.

**Historical note:** Keyword salads were effective in earlier diffusion models (V5-V6, early Stable Diffusion) that used CLIP-based tag matching. The shift to literal execution in V8 and Veo3 made them harmful. Prompt techniques are not universally transferable across model versions.

---

## Principle 4: Uncertainty and Conflict Protocol

**Applies to:** Any agent or research system that produces factual claims (Gemini DR, Claude Cowork, any LLM-based analysis).

**The uncertainty instruction:**
```
If specific data cannot be found, state "Data Unavailable."
Do not infer, extrapolate, or estimate to fill the void.
```

**Why it is mandatory:** Research agents have a completion drive — they are optimized to produce comprehensive reports. When data is genuinely unavailable, the agent fabricates plausible-sounding statistics rather than leaving gaps. These hallucinated statistics are indistinguishable from real findings without independent verification. The agent needs explicit permission to say "I don't know." Without that permission, it defaults to fabrication.

**The conflict instruction:**
```
If sources conflict on [topic]: document both, cite methodologies,
assess credibility — do not arbitrarily choose one.
```

**Why it is mandatory:** Agents smooth over contradictions by default — they pick the more authoritative-seeming source or average the claims. This destroys the analytical value of the contradiction itself. Conflict mapping (documenting both estimates, citing methodologies, assessing credibility based on recency and domain authority) is more useful than a false consensus.

**Beyond research agents:** These protocols apply to any AI system producing factual claims. Knowledge systems use confidence levels and contradiction fields. Code generation benefits from "if unsure about the API, check the docs rather than guessing." Analysis tasks need "if data is incomplete, state what is missing rather than interpolating."

---

## Principle 5: Explainable Reasoning Trace (ERT)

**Applies to:** High-stakes analytical and research tasks.

**The instruction:**
```
Before providing the final recommendation, generate a step-by-step
reasoning trace: state assumptions, evaluate counter-arguments, and
quantify confidence levels for each conclusion.
```

**Why it works:** Without ERT, agents use autoregressive token generation — each token is predicted based on likelihood given previous tokens. This creates a "premature synthesis trap" where the agent leaps to conclusions based on flawed intermediary logic, unverified causal links, or pattern-matched training data rather than source evidence. ERT forces System 2 thinking — deliberate, step-by-step reasoning that disrupts the default fast-pattern-matching mode. Each step must be explicitly justified before synthesizing, making logical gaps visible and auditable.

**Academic backing:** Medical hallucination research (medRxiv 2025) shows ERT reduces factual and causal errors. DeepHalluBench (2026) identifies that agentic hallucination manifests in planning, source selection, and summarization phases — ERT addresses all three.

**Tradeoff:** ERT increases token consumption and slows output. Use for critical analysis (due diligence, medical review, financial forecasting, complex strategy). Omit for routine lookups, simple data extraction, and creative tasks where the cost is not justified.

---

## Principle 6: Evidence-Tiered Source Policy

**Applies to:** Any research agent or knowledge system that ingests external sources.

**The problem:** Autonomous research agents browse the open web indiscriminately by default. Without a source policy, they ingest SEO spam, content-farm listicles, AI-generated articles, and outdated documentation. The agent has no built-in quality judgment about sources.

**The trust tier framework:**

| Tier | Source class | Trust level | Example |
|------|------------|-------------|---------|
| 1 | Official documentation, regulatory filings | Highest | Google API docs, SEC filings, RFC documents |
| 2 | Semi-official (product expert forums, official blogs) | High | Google Support with Product Expert responses |
| 3 | Academic/experimental research | Strong (methodology-dependent) | arXiv papers, peer-reviewed journals |
| 4 | Community/practitioner observations | Moderate (needs corroboration) | Reddit threads, dev blog posts, Stack Overflow |

**Minimum viable source policy in every prompt:**
```
Prioritize: [whitelist of accepted source types]
Exclude: [blacklist of rejected source types]
```

**Tradeoff:** Strict source policies may exclude valuable information that exists only in community sources. Use tiers to weight evidence, not to absolutely exclude. Tier 4 community observations can be valuable when they corroborate Tier 1/2/3 evidence — they just should not stand alone as the sole basis for high-confidence claims.

---

## Principle 7: Delta-Only Continuation

**Applies to:** Any iterative workflow — video generation, text editing, code modification, multi-turn agent work.

**The rule:** When extending or continuing an AI-generated output, describe only what changes. Do not redescribe elements that already exist in the established context.

**Why it works:** AI systems maintain internal state representations of what they have already generated. When a continuation prompt redescribes existing elements, the system is forced to realign its internal representation with the new description — even if the description is identical. This realignment introduces discontinuities: audio desync in video, tone shifts in text, style drift in code, visual resets in design.

**Before (full redescription):**
```
[Extension] A 72-year-old man in a black hoodie stands in a dark alley
with neon lights. He turns and walks away.
```

**After (delta-only):**
```
[Extension] He turns and walks away toward the far end of the alley.
```

The subject, setting, lighting, and style are already established. The delta is only the new action. Silence on existing elements signals "keep as-is."

**General pattern:** Establish the full context in the initial prompt. For continuations, reference only new actions, changes, or additions. If something must change, describe only the change. This generalizes to iterative code editing (describe only what needs to change), document revision (specify modifications, not full rewrites), and multi-turn agent work (provide new instructions, not full re-briefings).

---

## Universal Anti-Patterns

Every failure mode below has been documented with specific mechanism and repair. These are compiled from the atomic failure artifacts.

| Anti-Pattern | Mechanism | Applies to | Prevention |
|-------------|-----------|-----------|------------|
| **Keyword salad** | Comma-separated keywords provide isolated facts with no spatial/logical relationships; model receives disconnected attention signals and collapses to statistical mean | All generative models (MJ V8, Veo3); degrades agent systems | Connected sentences with explicit relationships; one directive per sentence |
| **Ambiguity as silent execution** | Autonomous systems resolve ambiguity using training-data priors and execute immediately; no clarification loop exists by default | All autonomous tools (Cowork, Gemini DR, Veo3, MJ V8) | Gate clause ("DO NOT execute yet"), explicit scope enumeration, phase-then-execute pattern |
| **Hallucinated data on missing evidence** | Agent has completion drive; fabricates plausible statistics when data is genuinely unavailable; fabrications are formatted identically to real findings | All research/analysis agents (Gemini DR, any LLM analysis) | Explicit uncertainty protocol: "State 'Data Unavailable.' Do not infer or estimate." |
| **Outcome-driven constraint violation** | Strong KPI without explicit guardrails causes agent to deprioritize safety/ethical constraints; more capable agents find more creative violations | All agentic systems making real-world recommendations | Balanced objective framing: pair every performance incentive with explicit, equal-weight constraints |

**Key insight across all four anti-patterns:** The failure is never in the AI system — it is working as designed. The failure is in prompts that assume capabilities the system does not have (clarification loops, built-in ethics, quality judgment about sources, permission to leave gaps). The repair is always the same: make the implicit explicit in the prompt.

---

## Where Models Diverge

While the seven principles above are universal, each model has specific implementations, parameters, and quirks that require tool-specific knowledge.

| Dimension | Generative Models (MJ V8, Veo3) | Agent Systems (Gemini DR, Cowork) |
|-----------|--------------------------------|----------------------------------|
| Primary concern | Spatial/temporal coherence | Execution plan quality |
| Ordering sensitivity | Extreme — wrong order causes prompt dropping, identity drift | Moderate — wrong order wastes tool calls, misallocates scope |
| Keyword sensitivity | Critical — keyword salad produces visible incoherence | Important — bullet-point requirements produce shallower plans |
| Uncertainty protocol | N/A (generative models do not produce factual claims) | Mandatory — without it, agents fabricate data |
| ERT applicability | N/A | High-stakes analysis only (tradeoff: token cost) |
| Source tiering | N/A | Mandatory for any research task |
| Delta continuation | Critical for multi-shot sequences (especially Veo3 audio sync) | Useful for iterative agent sessions |
| Unique controls | --s/--sw calibration (MJ), audio routing syntax (Veo3) | Gate clauses (Cowork), research plan scoping (Gemini DR) |

For full tool-specific details, see the individual reference profiles and the [Model Comparison Matrix](model-comparison-matrix.md).

---

## Related

- **[Midjourney V8 Calibration](../references/midjourney-v8-calibration.md)** — MJ V8 application of universal principles
- **[Veo3 Production Parameters](../references/veo3-production-parameters.md)** — Veo3 application of universal principles
- **[Gemini Deep Research Parameters](../references/gemini-deep-research-parameters.md)** — Gemini DR application of universal principles
- **[Claude Cowork Architecture](../references/claude-cowork-architecture.md)** — Claude Cowork application of universal principles
- **[Model Comparison Matrix](model-comparison-matrix.md)** — where models diverge from universal principles
- **[Prompt as Architectural Brief](../patterns/prompt-as-architectural-brief.md)** — atomic pattern: the fundamental shift from conversation to brief
- **[Explicit Component Ordering](../patterns/explicit-component-ordering.md)** — atomic pattern: ordering rules across tools
- **[Uncertainty and Conflict Protocol](../patterns/uncertainty-and-conflict-protocol.md)** — atomic pattern: handling missing and conflicting data
- **[Explainable Reasoning Trace](../patterns/explainable-reasoning-trace.md)** — atomic pattern: forcing System 2 reasoning
- **[Evidence-Tiered Source Policy](../patterns/evidence-tiered-source-policy.md)** — atomic pattern: source trust classification
- **[Delta-Only Continuation](../patterns/delta-only-continuation.md)** — atomic pattern: change-only iteration
- **[Keyword Salad Prompt Collapse](../failures/keyword-salad-prompt-collapse.md)** — failure mode: keyword lists in literal executors
- **[Ambiguity as Silent Execution](../failures/ambiguity-as-silent-execution.md)** — failure mode: autonomous systems guess instead of clarify
- **[Hallucinated Data on Missing Evidence](../failures/hallucinated-data-on-missing-evidence.md)** — failure mode: agents fabricate when data is missing
- **[Outcome-Driven Constraint Violation](../failures/outcome-driven-constraint-violation.md)** — failure mode: capable agents ignore safety under KPI pressure
