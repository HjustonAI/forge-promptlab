---
title: "Claude Cowork — Prompting Profile"
type: model-profile
model_id: claude-cowork
domains: [prompting, agentic-systems, tooling]
tags: [agent-architecture, agent-orchestration, prompt-structure, agent-communication]
confidence: medium
confidence_rationale: "Single primary source (claude-cowork.ctx.md); Cowork is actively evolving; cross-model patterns validated across 4+ sources"
lifecycle: current
created: 2026-04-16
updated: 2026-04-16
evidence:
  - source: raw/deep-research/claude-cowork.ctx.md
    sections: ["Calibration", "Operating Environment [EXTEND]", "Prompt Architecture [OVERRIDE]", "Mental Model", "CRITICAL — Claude Cowork Rules"]
    claim: "Primary source for Cowork architecture, modes, prompt structure, and constraints"
compiled_from:
  - distilled/references/claude-cowork-architecture.md
  - distilled/patterns/prompt-as-architectural-brief.md
  - distilled/patterns/goal-state-execution.md
  - distilled/patterns/file-handoff-state-machine.md
  - distilled/failures/ambiguity-as-silent-execution.md
  - distilled/patterns/uncertainty-and-conflict-protocol.md
dedupe_key: "model:claude-cowork-prompting-profile"
contradictions: []
see_also:
  - artifact: distilled/references/claude-cowork-architecture.md
    relationship: "Atomic reference data compiled into this profile"
  - artifact: distilled/models/gemini-deep-research.md
    relationship: "Companion agent platform profile — both are autonomous execution systems"
  - artifact: distilled/synthesis/universal-prompting-principles.md
    relationship: "Cross-model principles that apply to Cowork"
supersedes: []
---

# Claude Cowork — Prompting Profile

## Model Identity

Claude Cowork is a **desktop workflow orchestration engine** running inside an isolated VM. It is NOT a chatbot. Prompts define terminal states; the agent plans and executes autonomously. All side effects — file writes, tool calls, directory changes — are **permanent and immediate**.

Cowork reads a `claude.md` anchor file on session init, routes tasks to installed plugin skills via semantic matching, and executes through an iterative tool loop until the terminal condition defined in your prompt is satisfied. Session memory is ephemeral — it persists during active turns but is entirely wiped on restart. State must be explicitly persisted to disk.

**Mental model**: You are commissioning a software engineer to build a deliverable. Define what "done" looks like, what files to touch, and what constraints apply. The agent plans the path. You do not enumerate steps — you describe the terminal state and the agent derives the execution plan.

This is the same fundamental shift as prompting Gemini DR: your prompt is an **architectural brief**, not a conversation. The difference is that DR's side effects are search queries and reports, while Cowork's side effects are filesystem changes and tool executions. Cowork's side effects are more dangerous because they are harder to undo.

## Prompt Architecture

**Mandatory component order**: Goal State --> File/Context Scope --> Gate Clause --> Execution Rules --> Output Spec --> Constraints

This order reflects how Cowork builds its execution plan. The goal state anchors the entire execution loop — every subsequent tool call is evaluated against it. Scope limits the search space. The gate clause prevents premature execution. Rules define the path. Constraints prevent harm.

### Prompt Calibration

| Parameter | Guidance |
|-----------|---------|
| **Tone** | Programmatic, imperative. "Write to /path/file.md" not "Please create a file" |
| **Framing** | "I want X so that Y" (goal-state) dramatically outperforms step enumeration |
| **Output naming** | Always specify convention: `YYYY-MM-DD_ProjectName_v1.ext` |

Cowork responds to imperative, specification-like language. Conversational politeness ("Could you please...") is not harmful but wastes tokens and signals a conversational mental model that may produce less structured output. Treat every prompt as a work order.

### The Done Framework (Goal-State Execution)

The core execution principle of Cowork: **define the terminal state, not the steps**.

```
"I want to [action] so that [outcome]."
```

NOT:

```
"Please do X, then Y, then Z."
```

**Why this works**: When you enumerate steps, the agent becomes a step executor — it follows your plan whether or not your plan is optimal. When you define the terminal state, the agent becomes a problem solver — it evaluates all actions against the terminal condition and adapts when steps fail.

The "so that [outcome]" clause is critical. It gives the agent the **business context** needed to make judgment calls when the path is unclear. Without it, the agent has a target but no understanding of why the target matters, which leads to technically correct but contextually wrong execution.

**Key behaviors of goal-state execution**:
- The agent continuously evaluates whether the terminal state is met
- Failed steps trigger **replanning**, not failure — the agent tries alternative approaches
- Ambiguity is resolved by inference, not clarification (this is why the gate clause is critical)
- Session memory is ephemeral — state must be persisted explicitly to disk via `context.md` or file handoffs

**Semantic Skill Auto-Routing**: Cowork continuously matches user intent to installed skill descriptions. The description field in a SKILL.md IS the routing signal — it must be written as a precise activation condition, not a human-readable summary. When a match triggers, the skill's instructions are injected into context before LLM reasoning via Dynamic Context Injection (DCI).

### Six-Part Prompt Structure

1. **Goal state** — terminal condition + business outcome in one sentence
2. **File/context scope** — explicit directory paths the agent may read/write
3. **Gate clause** — "DO NOT start yet. Use AskUserQuestion to confirm the plan."
4. **Execution rules** — numbered steps with conditional logic
5. **Output spec** — exact file paths and naming convention
6. **Constraints** — hard limits, off-limits directories, operations requiring confirmation

## Critical Safety Pattern: Gate Clause

The gate clause is **the most important safety pattern for Cowork**. It overrides the agent's default behavior of immediate autonomous execution.

### The Problem: Ambiguity as Silent Execution

When Cowork receives an ambiguous prompt, it does not ask for clarification. It guesses the most plausible interpretation and **executes immediately**. The user discovers the misinterpretation only after side effects have occurred — files have been written, directories have been modified, tool calls have been made. These side effects are permanent.

**The mechanism**:
1. Prompt contains an underspecified element (vague scope, missing constraint, ambiguous goal)
2. Cowork has no clarification loop — it is designed for autonomous execution
3. The agent resolves ambiguity using training-data priors (most common interpretation)
4. Execution proceeds with high confidence
5. Results appear professional and correct but may be fundamentally misaligned with intent
6. Side effects (files written, tools invoked) are permanent

The output *looks* right. Cowork produces confident, well-structured results even when operating on a wrong interpretation. Unlike a human collaborator who might say "I'm not sure what you mean," Cowork never signals uncertainty about the prompt itself.

### The Repair: Gate Clause

Open every prompt that has exploratory elements, ambiguity, or where you want to review the plan before execution:

```
DO NOT start executing yet. Use AskUserQuestion to ask clarifying
questions. Only begin once we have aligned on the plan.
```

Or for a phased approach:

```
Phase 1: Show me your execution plan. Do not execute anything.
Phase 2: Execute after my explicit approval.
```

### When to Use the Gate Clause

- **Always use** when the prompt has exploratory elements or multiple valid interpretations
- **Always use** when filesystem side effects could be destructive (deleting, overwriting, restructuring)
- **Always use** on first interaction in a new project where the agent has no prior context
- **Can omit** when the prompt is fully specified with no ambiguity and the side effects are well-scoped (e.g., "Write 'hello world' to /tmp/test.txt")

## Inter-Agent Communication

### File Handoff State Machine

In multi-agent workflows, Cowork agents communicate by writing output to **named files on disk** and returning only the file path to the orchestrator. No large content passes through context windows.

**The instruction**:
```
Write your analysis to /path/output.md. Return only the file path
to the main context.
```

The orchestrator receives: `/path/output.md` (a few tokens)
Not: the full 5000-token analysis dumped into context.

**Why this exists**: The alternative — subagents returning full content to the orchestrator's context window — causes context bloat. A subagent that prints a large file directly into the orchestrator's context consumes tokens that could be used for reasoning, may trigger truncation, and provides no persistence if the session crashes.

| Benefit | Mechanism |
|---------|-----------|
| **Zero token cost** | Only the path is in context, not the content |
| **Permanent audit trail** | Every agent's output is on disk, not ephemeral chat |
| **Crash-safe recovery** | Files survive session crashes; context does not |
| **Selective reading** | Orchestrator reads only what it needs, when it needs it |
| **Parallel work** | Multiple agents write to separate files simultaneously |

**Context persistence via context.md**: Because Cowork sessions are stateful during active turns but entirely ephemeral across restarts, mandate creation of `context.md` at project root. Instruct the agent to read it on boot and append an operational summary before closing. This is the file handoff pattern applied to session state rather than inter-agent communication.

## Operating Modes

### Solo Session (GUI)

The default mode. A single agent executes tasks in the Cowork desktop environment.

- Agent reads `claude.md` anchor file on init — this provides project context, conventions, and constraints
- Plugin skills auto-route via semantic matching against skill description fields
- DCI (Dynamic Context Injection) runs at skill activation — shell commands fire before the LLM sees the prompt, injecting fresh state (git status, directory scans, dependency checks)
- File handoffs and `context.md` are primary state mechanisms
- No UI-level execution restrictions — **all constraints come from the prompt**. If you do not constrain the agent in the prompt, it is unconstrained

**DCI best practice**: Always pair DCI commands with a fallback — `` `command || echo 'not available'` `` — to prevent a DCI crash from blocking the entire skill.

### Multi-Agent Orchestration

Full parallel agent teams with lateral communication. Dramatically more powerful and dramatically more expensive than solo sessions.

**Trigger phrase**: "Do not use standard subagents; spawn fully independent teammates"

**Requirements for multi-agent prompts**:
- **Named roles**: Each agent has a distinct named role (e.g., "Researcher", "Architect", "Devil's Advocate")
- **Lateral communication**: Assign which agents communicate with which via file handoff paths
- **Devil's Advocate**: Designate at least one agent to challenge conclusions — genuine debate, not rubber-stamping
- **File targets per agent**: Each agent writes to a specific file; the orchestrator reads and synthesizes

**Budget warning**: Multi-agent orchestration runs full parallel context windows. It is **highly token-expensive**. Reserve for genuine multi-disciplinary synthesis, red-team exercises, and architectural debates where the diversity of perspective justifies the cost. For simple task decomposition, use subagents instead.

**Subagents vs. Agent Teams**:

| Mode | Cost | Use case |
|------|------|----------|
| **Subagents** | Efficient — isolated, can route to cheaper models (Haiku) | Extraction, data transformation, single-perspective analysis |
| **Agent Teams** | Expensive — full parallel context windows | Genuine debate, devil's advocacy, multi-disciplinary synthesis |

Introduced in Claude Code v2.1.32.

### Plugin / Skill Authoring

Cowork's extensibility model. Skills are plugin components that extend the agent's capabilities.

- **YAML frontmatter is the control plane** for the semantic router — the skill's frontmatter determines when and how it activates
- DCI runs before the LLM sees the prompt — slot-filling happens before LLM reasoning
- Plugin directory structure: `plugin.json` inside `.claude-plugin/`; all component directories at plugin root (NOT inside `.claude-plugin/`)

**SKILL.md constraints**:

| Field | Constraint |
|-------|-----------|
| **Name** | Max 64 chars, lowercase + hyphens, no XML tags, no "claude"/"anthropic" |
| **Description** | **Single-line inline string only** (no YAML block scalars `>` or `\|`) — this IS the routing signal |
| **Argument-hint** | Document expected input so the LLM knows what to pass |
| **Allowed-tools** | Allowlist only what the skill requires — principle of least privilege |

The description field is the most important line in the entire SKILL.md. It is not documentation — it is the **activation condition** for semantic routing. If the description does not precisely describe when the skill should fire, auto-discovery fails silently.

## Failure Modes and Repairs

| Failure | Trigger | Repair |
|---------|---------|--------|
| **Immediate execution on ambiguity** | Underspecified prompt with no gate clause | Gate clause: "DO NOT execute yet. Use AskUserQuestion first" |
| **Session memory wipe on restart** | Cowork session crash or restart | Mandate `context.md`; read on boot, append before close |
| **Subagent context bloat** | Subagent returns full content to orchestrator | File Handoff: write to disk, return path only |
| **Skill auto-discovery fails** | YAML block scalar in description field | Single-line description field; no YAML `>` or `\|` block scalars |
| **Plugin components not found** | Component dirs placed inside `.claude-plugin/` | Component dirs at plugin root, not inside `.claude-plugin/` |
| **QA hallucination** | Agent makes qualitative judgment without evidence | Intermediate raw output file before qualitative judgment |
| **Prompt injection via docs** | Malicious content in files the agent reads | Define directory scope explicitly; human confirm before permanent effects |
| **DCI crash blocks skill** | DCI command fails without fallback | Always pair with fallback: `command \|\| echo 'not available'` |

### The Most Dangerous Failure: Ambiguity as Silent Execution

This failure is dangerous because it is invisible until the damage is done. The agent executes confidently on a wrong interpretation, producing professional-looking output with permanent side effects. The key insight: **the failure is not in the AI system — it is working as designed.** The failure is in prompts that assume a clarification loop exists when it does not.

**Cost of failure by scenario**:

| Scenario | Cost |
|----------|------|
| Files written to disk based on wrong interpretation | Filesystem changes, wasted session, potential data loss |
| Multi-agent orchestration on wrong scope | Full parallel context windows burned, all output misaligned |
| Plugin skill executing wrong tool chain | Tool side effects (API calls, file modifications) may be irreversible |

The repair is always the same: **reduce ambiguity in the prompt, or force a human checkpoint before execution.**

## Prompt Template

```markdown
GOAL STATE:
I want to [action] so that [outcome]. The task is done when [terminal
condition].

FILE / CONTEXT SCOPE:
- Read from: [/path/to/input/directory]
- Write to: [/path/to/output/directory]
- Off-limits: [/paths/the/agent/must/not/touch]
- Context file: Read /path/context.md on start; append summary before close.

GATE CLAUSE:
DO NOT start executing yet. Use AskUserQuestion to confirm the plan.
Only begin once we have aligned.

EXECUTION RULES:
1. [First step with conditional logic]
2. [Second step]
3. [Third step]
4. If [condition], then [alternative path]. Otherwise [default path].

OUTPUT SPEC:
- Primary deliverable: /path/to/output/YYYY-MM-DD_ProjectName_v1.md
- File naming convention: [convention]
- Format: [Markdown / JSON / etc.]

CONSTRAINTS:
- Do not modify any files outside the write scope.
- Do not execute [specific dangerous operations] without explicit approval.
- Budget: [token/time/iteration limits if applicable].
- [Any domain-specific constraints.]
```

### Template Usage Notes

- The **gate clause** can be removed for fully-specified, low-risk prompts
- The **execution rules** section can be replaced with "Derive your own execution plan from the goal state" when you trust the agent to plan optimally
- The **constraints** section is your safety net — anything you do not constrain, the agent may do
- For multi-agent orchestration, duplicate the template per agent with role-specific goals and add lateral communication file paths

## Related

- **[Claude Cowork Architecture Reference](../references/claude-cowork-architecture.md)** — atomic reference data compiled into this profile
- **[Gemini Deep Research — Prompting Profile](gemini-deep-research.md)** — companion agent platform profile; both are autonomous execution systems requiring architectural briefs
- **[Prompt as Architectural Brief](../patterns/prompt-as-architectural-brief.md)** — the foundational pattern: prompts are briefs, not conversations
- **[Goal-State Execution (Done Framework)](../patterns/goal-state-execution.md)** — the core execution model: define terminal state, not steps
- **[File Handoff State Machine](../patterns/file-handoff-state-machine.md)** — inter-agent communication via disk files
- **[Explicit Component Ordering](../patterns/explicit-component-ordering.md)** — why the six components must follow this specific order
- **[Ambiguity as Silent Execution](../failures/ambiguity-as-silent-execution.md)** — the primary failure mode the gate clause prevents
- **[Uncertainty and Conflict Protocol](../patterns/uncertainty-and-conflict-protocol.md)** — handling missing and conflicting data in agent outputs
