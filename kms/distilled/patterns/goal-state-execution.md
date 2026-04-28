---
title: "Goal-State Execution (Done Framework)"
type: pattern
domains: [agentic-systems, prompting]
tags: [agent-orchestration, prompt-structure, human-agent-contract]
confidence: high
confidence_rationale: "Primary execution model of Claude Cowork; documented with specific mechanism and calibration data"
lifecycle: current
created: 2026-04-16
updated: 2026-04-16
evidence:
  - source: raw/deep-research/claude-cowork.ctx.md
    sections: ["Mental Model", "Prompt Architecture [OVERRIDE]"]
    claim: "Define terminal state → agent builds execution plan → iterative tool loop until criteria met"
  - source: raw/deep-research/claude-cowork.ctx.md
    sections: ["Leverage Points"]
    claim: "Goal-state framing ('I want X so that Y') produces dramatically more accurate execution plans than enumerating steps"
dedupe_key: "pattern:goal-state-execution-done-framework"
contradictions: []
see_also:
  - artifact: distilled/patterns/prompt-as-architectural-brief.md
    relationship: "Brief defines prompt structure, goal-state defines terminal condition"
  - artifact: distilled/patterns/file-handoff-state-machine.md
    relationship: "Inter-agent coordination pattern used alongside goal-state execution"
  - artifact: distilled/references/claude-cowork-architecture.md
    relationship: "Platform where goal-state execution (Done Framework) originates"
  - artifact: distilled/failures/ambiguity-as-silent-execution.md
    relationship: "Failure mode that clear goal-states help prevent"
supersedes: []
---

# Goal-State Execution (Done Framework)

## Pattern

Define the terminal state (what "done" looks like) rather than enumerating steps.
The agent builds its own execution plan and iterates until the terminal condition
is satisfied.

## Structure

```
"I want to [action] so that [outcome]."
```

NOT:

```
"Please do X, then Y, then Z."
```

## Why It Works

When you enumerate steps, the agent becomes a step executor — it follows your plan
whether or not your plan is optimal. When you define the terminal state, the agent
becomes a problem solver — it evaluates all actions against the terminal condition
and can adapt its approach when steps fail.

The "so that [outcome]" clause is critical — it gives the agent the business
context needed to make judgment calls when the path is unclear.

## Full Prompt Structure (Cowork)

1. **Goal state** — terminal condition + business outcome in one sentence
2. **File/context scope** — explicit directory paths the agent may read/write
3. **Gate clause** — "DO NOT start yet. Use AskUserQuestion to confirm the plan."
4. **Execution rules** — numbered steps with conditional logic
5. **Output spec** — exact file paths and naming convention
6. **Constraints** — hard limits, off-limits directories, operations requiring confirmation

## Key Behaviors

- The agent continuously evaluates whether the terminal state is met
- Failed steps trigger replanning, not failure
- Ambiguity is resolved by inference, not clarification (hence the gate clause)
- Session memory is ephemeral — state must be persisted explicitly to disk

## Transferability

This pattern applies to any agentic system where the agent has tool access and
can execute autonomously. The specific implementation (Cowork's Done Framework)
is one instance, but the principle — define outcomes, not procedures — generalizes
to all autonomous agent interactions.

## Related Pattern

Semantic Skill Auto-Routing: In Cowork, installed skills have description fields
that act as routing rules. The agent continuously matches user intent to skill
descriptions and injects matched skill instructions autonomously. The description
field IS the routing signal — write it as a precise activation condition, not
a human-readable summary.

## Related

- **[Prompt as Architectural Brief](prompt-as-architectural-brief.md)** — brief defines prompt structure, goal-state defines terminal condition
- **[File Handoff State Machine](file-handoff-state-machine.md)** — inter-agent coordination pattern used alongside goal-state execution
- **[Claude Cowork Architecture](../references/claude-cowork-architecture.md)** — platform where goal-state execution (Done Framework) originates
- **[Ambiguity as Silent Execution](../failures/ambiguity-as-silent-execution.md)** — failure mode that clear goal-states help prevent
