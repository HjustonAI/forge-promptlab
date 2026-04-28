---
title: "Gemini Deep Research — Prompting Profile"
type: model-profile
model_id: gemini-deep-research
domains: [prompting, agentic-systems, tooling]
tags: [research-tool, agent-architecture, prompt-structure]
confidence: high
confidence_rationale: "Two independent primary sources; cross-model patterns validated across 4+ sources; mandatory prompt components well-documented"
lifecycle: current
created: 2026-04-16
updated: 2026-04-16
evidence:
  - source: raw/deep-research/gemini-deep-research.ctx.md
    sections: ["Calibration", "Operating Environment [EXTEND]", "Prompt Architecture [OVERRIDE]", "Mental Model", "Failure Modes & Repair"]
    claim: "Primary source for DR operating parameters, prompt architecture, and failure modes"
  - source: "raw/deep-research/Gemini Deep Research Context File Generation.md"
    sections: ["Product Model Map", "Core Prompting Principles", "Source Ledger"]
    claim: "Detailed environment capabilities, prompting principles, 49-source evidence ledger"
compiled_from:
  - distilled/references/gemini-deep-research-parameters.md
  - distilled/patterns/prompt-as-architectural-brief.md
  - distilled/patterns/explicit-component-ordering.md
  - distilled/patterns/uncertainty-and-conflict-protocol.md
  - distilled/patterns/explainable-reasoning-trace.md
  - distilled/patterns/evidence-tiered-source-policy.md
  - distilled/failures/hallucinated-data-on-missing-evidence.md
dedupe_key: "model:gemini-deep-research-prompting-profile"
contradictions:
  - note: "ERT increases token consumption and slows output. Known tradeoff: use ERT for high-stakes analysis, omit for routine lookups."
    severity: tradeoff
    related_artifact: distilled/patterns/explainable-reasoning-trace.md
see_also:
  - artifact: distilled/references/gemini-deep-research-parameters.md
    relationship: "Atomic reference data compiled into this profile"
  - artifact: distilled/models/claude-cowork.md
    relationship: "Companion agent platform profile — both are autonomous execution systems"
  - artifact: distilled/synthesis/universal-prompting-principles.md
    relationship: "Cross-model principles that apply to Gemini DR"
supersedes: []
---

# Gemini Deep Research — Prompting Profile

## Model Identity

Gemini Deep Research (DR) is an **autonomous research agent**, not a chatbot. It executes multi-step web research with up to **160 search iterations** per task, consuming up to **900k input tokens** ($3-5 per task on the API). It runs **asynchronously** — you submit a research brief and poll for results; there is no streaming conversation.

The underlying model is Gemini 3.1 Pro. DR wraps it in an agentic loop that builds a research plan, executes web searches, reads sources, synthesizes findings, and produces a structured report — all without human intervention after the initial prompt.

**Mental model**: You are commissioning an elite research analyst. Your prompt is not a question — it is a **research brief** with explicit scope, methodology constraints, and a deliverable format. The agent reads your brief, constructs a research plan (visible and editable in the App environment), and executes it autonomously. The quality of the output is determined almost entirely by the quality of the brief.

Think of DR the way you would think of hiring a consultant: you would never hand a consultant a vague one-liner and expect good work. You would hand them a detailed scope of work. DR operates the same way.

## Prompt Architecture

**Mandatory component order**: Role --> Task --> Research Plan Scope --> Source Policy --> Uncertainty Protocol --> Output Format

This order is not a stylistic preference. DR processes prompts sequentially, building internal planning representations as it reads. Role establishes the analytical posture that shapes the research plan. Scope defines what the plan covers. Policies and protocols govern execution behavior. Output format determines the structure of the deliverable. Disordering these components leads to misallocated search iterations and shallow reports.

### Prompt Length

| Range | Effect |
|-------|--------|
| Below 200 words | Scope too thin — agent builds a generic, shallow research plan |
| **200-500 words** | **Optimal range** — enough specificity for a targeted plan without over-constraining |
| Above 500 words | Over-constraining risk; may trigger safety filters from stacked negatives |

**Tone**: Imperative and professional. "Execute sub-searches targeting..." not "Could you please look into..."

### Six Mandatory Components

Every DR prompt must contain these six components, in this order:

#### 1. Role — Expert Persona

Assign a specific expert identity that anchors the analytical posture for the entire research session.

```
You are an elite Due Diligence Analyst with 15 years of experience in
technology sector M&A evaluation.
```

The role is not decorative. It shapes how DR evaluates source credibility, what it considers relevant, and how it frames its synthesis. "You are a researcher" is too generic. "You are an elite Due Diligence Analyst specializing in [domain]" forces a specific analytical lens.

#### 2. Task — One Clear Research Objective

State exactly one research objective. Multiple objectives split the agent's attention across its search iterations, producing breadth at the cost of depth.

```
Produce a comprehensive due diligence report on [Company X]'s
technology stack, competitive positioning, and regulatory exposure.
```

#### 3. Research Plan Scope — Numbered Sub-Search Dimensions

**This is the highest-leverage element of the entire prompt.** The numbered list directly shapes the research plan DR builds. Each item becomes a search dimension the agent will pursue.

```
Execute sub-searches targeting:
1. Core technology architecture and IP portfolio
2. Competitive landscape — direct competitors and market share
3. Regulatory compliance history and pending actions
4. Customer concentration and contract structure
5. Technical debt indicators from public engineering blogs and job postings
```

**Critical ordering rule**: Place the most important dimensions FIRST. DR processes roughly in enumeration order, and truncation hits the final quartile of long reports. If dimension 5 is your most important question, move it to position 1.

The scope list also prevents the "boiling the ocean" failure. Without explicit dimensions, the agent interprets your task broadly and wastes search iterations on tangential topics.

#### 4. Source Policy — Whitelist and Blacklist

Without a source policy, DR browses whatever ranks highly in search results — including SEO spam, content-farm listicles, and AI-generated articles. It has no built-in quality judgment about sources.

```
SOURCE POLICY:
- Prioritize: SEC filings, patent databases, peer-reviewed papers, official
  company documentation, recognized industry analyst reports (Gartner, Forrester).
- Exclude: consumer review aggregators, generic news roundups, unverified
  forums, AI-generated content aggregation sites.
- Conflict resolution: If sources conflict, document both estimates, cite
  methodologies, and assess credibility based on recency and domain authority.
```

**Trust tier classification** (use this to decide your whitelist/blacklist):

| Tier | Source class | Trust level | Examples |
|------|------------|-------------|---------|
| 1 | Official documentation, regulatory filings | Highest | Google API docs, SEC filings, RFC documents |
| 2 | Semi-official (product expert forums, official blogs) | High | Google Support with Product Expert responses |
| 3 | Academic/experimental research | Strong (methodology-dependent) | arXiv papers, peer-reviewed journals |
| 4 | Community/practitioner observations | Moderate (needs corroboration) | Reddit threads, dev blog posts, Stack Overflow |

Tier 4 sources can be valuable when they corroborate Tier 1-3 evidence, but they should never stand alone as the sole basis for high-confidence claims. The balance is to use tiers to **weight** evidence, not to absolutely exclude.

#### 5. Uncertainty Protocol — Mandatory

```
If specific data cannot be found, state "Data Unavailable."
Do not infer, extrapolate, or estimate to fill the void.
```

**Why this is mandatory, not optional**: DR has a completion drive — it is optimized to produce comprehensive reports. When data is genuinely unavailable, the agent fabricates plausible-sounding statistics rather than leaving gaps. These hallucinated figures are formatted identically to real findings and are indistinguishable from genuine data without independent verification.

A report with 95% real data and 5% hallucinated data is more dangerous than one with 50% hallucinations, because the user trusts the whole document. The uncertainty protocol gives the agent **explicit permission to leave gaps**, which overrides the fabrication drive.

**Conflict protocol** (include alongside uncertainty):

```
If sources conflict on a data point: document both estimates, cite the
methodology behind each, and assess credibility based on recency and
domain authority. Do not arbitrarily choose one.
```

Agents smooth over contradictions by default — they pick the more authoritative-seeming source or average the claims. This destroys the analytical value of the contradiction itself, which is often more informative than either individual claim. Instruct DR to **map contradictions** rather than resolve them.

#### 6. Output Format — Markdown Structure

```
OUTPUT FORMAT:
- Markdown with ## section headers matching the scope dimensions above.
- Comparison tables for competitive landscape data.
- Each factual claim must cite its source.
- Executive summary of no more than 300 words at the top.
```

Specifying format prevents DR from choosing its own structure, which tends to be generic and inconsistent across tasks.

## Critical Protocols

### Uncertainty Protocol (Mandatory)

The "Data Unavailable" instruction is the single most important safety measure for DR prompts. Without it, the autoregressive completion drive causes the agent to fabricate data rather than admit gaps.

**The mechanism**:
1. Agent builds a research plan that includes specific data points
2. During execution, some data points cannot be found from available sources
3. Without explicit permission to say "unavailable," the agent fills gaps with plausible fabrications
4. Fabricated data is consistent with nearby real data, making detection extremely difficult
5. The user trusts the entire report because most of it is accurate

**The repair**: Include the uncertainty protocol in every prompt, without exception. The agent needs a sanctioned output format ("Data Unavailable") for missing data. Without it, the completion drive overrides honesty.

**Complementary measure**: Require source citations for every factual claim. Fabricated data has no source to cite, making it detectable when citations are mandatory.

### Explainable Reasoning Trace (ERT) — Recommended

```
Before providing the final recommendation, generate a step-by-step
reasoning trace: state assumptions, evaluate counter-arguments, and
quantify confidence levels for each conclusion.
```

**How it works**: ERT forces System 2 thinking — deliberate, step-by-step reasoning that disrupts the default fast-pattern-matching mode (autoregressive token generation). Without ERT, the agent leaps to conclusions based on flawed intermediary logic, unverified causal links, or pattern-matched training data rather than source evidence.

**What ERT prevents**:
- **Premature synthesis**: conclusions formed before all evidence is evaluated
- **Hidden assumptions**: reasoning gaps that are invisible without explicit trace
- **Causal hallucinations**: false cause-effect claims that sound plausible

**Academic backing**: Medical hallucination research (medRxiv 2025) shows ERT reduces factual and causal errors. DeepHalluBench (2026) identifies that agentic hallucination manifests in planning, source selection, and summarization — ERT addresses all three by making each phase explicit.

**Tradeoff**: ERT increases token consumption and slows report generation. Use ERT for high-stakes analysis (due diligence, medical review, financial forecasting). Omit for routine lookups where speed matters more than reasoning depth.

### Evidence-Tiered Source Policy

Every DR prompt must include an explicit source policy. The agent browses the open web indiscriminately by default — without a policy, it ingests whatever ranks highly in search results, including SEO-optimized garbage.

**Minimum viable source policy**:
```
Prioritize: [whitelist of accepted source types]
Exclude: [blacklist of rejected source types]
```

**Full implementation**: Include the trust tier classification in your prompt. Whitelist Tier 1-2 sources as primary evidence. Accept Tier 3 for methodology-dependent claims. Require corroboration for Tier 4 sources.

The source policy prevents **SEO content drift** — the failure mode where DR's output quality degrades because it built conclusions on low-quality sources that happened to rank well.

## Anti-Patterns / Failure Modes

| Failure | Trigger | Mitigation |
|---------|---------|-----------|
| **Boiling the ocean** | Vague scope with no sub-search dimensions | Narrow to specific deliverables; enumerate sub-search dimensions explicitly |
| **SEO content drift** | No source policy in prompt | Explicit whitelist + blacklist of source types in every prompt |
| **Context pollution** | Re-using a broken or divergent thread | Start a new session; never try to "fix" a contaminated thread |
| **Premature synthesis** | No reasoning trace requested | Mandate ERT: "Before the final recommendation, generate a step-by-step reasoning trace" |
| **File suppresses web search** | Uploading 300+ page document | Explicit phased instruction: Phase 1 file analysis --> Phase 2 web research --> Phase 3 merge findings |
| **Token degradation** | Long reports exceeding context capacity | Front-load critical topics in scope ordering; accept that the final quartile may be shallow |
| **Hallucinated statistics** | No uncertainty protocol | "If data unavailable, state 'Data Unavailable.' Do not infer or estimate." |
| **Safety filter lock** | Stacked negatives ("Don't do X, don't do Y") | Pair every "Don't X" with "Instead do Y"; reduce negative instruction density |

### Detailed Failure Analysis

**Hallucinated statistics** is the most dangerous failure because it is invisible. The agent produces a report that looks complete and authoritative, but 5-10% of the data points are fabricated. The fabrications are plausible — consistent with nearby real data — and formatted identically to genuine findings. The only reliable defense is the uncertainty protocol plus mandatory source citations.

**Context pollution** is the most frustrating failure because it is irreversible within a session. Once DR's research plan goes off-track in a thread, attempting to redirect it pollutes the context further. The only reliable repair is starting a fresh session.

**File suppresses web search** is counterintuitive — uploading a large file to "ground" DR's research can actually suppress the web search phase entirely. The agent treats the file as sufficient context and skips external research. The repair is explicit phasing: instruct DR to analyze the file first, then conduct web research, then merge findings.

## Operating Environments

| Environment | Platform | Key Features | Key Constraints |
|------------|----------|-------------|-----------------|
| **App** | gemini.google.com | Research plan editable before execution; `@File` grounding for uploaded documents; Canvas output with rich formatting | Session context pollution on thread re-use; research plan editing is the key affordance — use it |
| **API** | Vertex AI / AI Studio | `background=true` async execution; JSON schema for structured output; `previous_interaction_id` for follow-up queries | No UI affordances; must strip `@File`, "edit plan", "export" from prompts; no plan editing |

**App-specific guidance**: Always review and edit the research plan before approving execution. This is DR's most powerful App-only affordance. If the plan looks wrong, edit it — do not try to fix it with follow-up prompts after execution.

**API-specific guidance**: Use `background=true` for long-running tasks. Structure output with JSON schema when you need machine-readable results. Use `previous_interaction_id` for follow-up analysis on the same research session.

## Prompt Template

```markdown
ROLE:
You are an elite [Expert Type] with [N] years of experience in [Domain].

TASK:
Produce a comprehensive [Deliverable Type] on [Subject], focusing on
[Primary Angle].

RESEARCH PLAN SCOPE:
Execute sub-searches targeting:
1. [Most critical dimension]
2. [Second most critical dimension]
3. [Third dimension]
4. [Fourth dimension]
5. [Fifth dimension — accept this may be truncated in long reports]

SOURCE POLICY:
- Prioritize: [Tier 1-2 source types relevant to your domain].
- Exclude: [Known low-quality source types].
- Conflict resolution: If sources conflict, document both estimates,
  cite methodologies, assess credibility based on recency and domain
  authority.

UNCERTAINTY PROTOCOL:
- If specific data cannot be found, state "Data Unavailable."
  Do not infer, extrapolate, or estimate to fill the void.
- Every factual claim must cite its source.

[OPTIONAL — for high-stakes analysis:]
REASONING TRACE:
Before providing final recommendations, generate a step-by-step
reasoning trace: state assumptions, evaluate counter-arguments,
and quantify confidence levels for each conclusion.

OUTPUT FORMAT:
- Markdown with ## section headers matching the scope dimensions.
- Comparison tables where appropriate.
- Executive summary (max 300 words) at the top.
- [Additional format requirements specific to your deliverable.]
```

## Related

- **[Gemini Deep Research Operating Parameters](../references/gemini-deep-research-parameters.md)** — atomic reference data compiled into this profile
- **[Claude Cowork — Prompting Profile](claude-cowork.md)** — companion agent platform profile; both are autonomous execution systems requiring architectural briefs
- **[Prompt as Architectural Brief](../patterns/prompt-as-architectural-brief.md)** — the foundational pattern: prompts are briefs, not questions
- **[Explicit Component Ordering](../patterns/explicit-component-ordering.md)** — why the six components must follow this specific order
- **[Uncertainty and Conflict Protocol](../patterns/uncertainty-and-conflict-protocol.md)** — detailed protocol for missing and conflicting data
- **[Explainable Reasoning Trace](../patterns/explainable-reasoning-trace.md)** — ERT mechanism, evidence, and tradeoffs
- **[Evidence-Tiered Source Policy](../patterns/evidence-tiered-source-policy.md)** — trust tier classification and prompt implementation
- **[Hallucinated Data on Missing Evidence](../failures/hallucinated-data-on-missing-evidence.md)** — the failure mode the uncertainty protocol prevents
