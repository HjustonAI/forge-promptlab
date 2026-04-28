---
title: "File Handoff State Machine"
type: pattern
domains: [agentic-systems]
tags: [agent-communication, agent-orchestration, tool-integration]
confidence: high
confidence_rationale: "Documented pattern in Claude Cowork with specific mechanism; solves a known and reproducible problem (context bloat)"
lifecycle: current
created: 2026-04-16
updated: 2026-04-16
evidence:
  - source: raw/deep-research/claude-cowork.ctx.md
    sections: ["Leverage Points", "Failure Modes & Repair"]
    claim: "Agents communicate via disk files, not context-window transfers. Instruct each agent to write output to a named file and return only the file path. Zero token cost, permanent audit trail, crash-safe recovery."
dedupe_key: "pattern:file-handoff-inter-agent-communication"
contradictions: []
see_also:
  - artifact: distilled/patterns/goal-state-execution.md
    relationship: "Goal-state defines what agents pursue; file handoff coordinates between them"
  - artifact: distilled/references/claude-cowork-architecture.md
    relationship: "Platform architecture where file handoff pattern operates"
  - artifact: distilled/failures/ambiguity-as-silent-execution.md
    relationship: "File handoff creates audit trail that makes silent execution visible"
supersedes: []
---

# File Handoff State Machine

## Pattern

In multi-agent systems, agents communicate by writing output to named files on disk
and returning only the file path to the orchestrator. The orchestrator (or next agent)
reads the file when needed. No large content passes through context windows.

## Why It Exists

The alternative — subagents returning full content to the orchestrator's context
window — causes context bloat. A subagent that prints the full contents of a large
file directly into the orchestrator's context consumes tokens that could be used for
reasoning, may trigger truncation, and provides no persistence if the session crashes.

## Implementation

```
Instruction to subagent:
"Write your analysis to /path/output.md. Return only the file path to the main context."
```

The orchestrator receives: `/path/output.md` (a few tokens)
Not: the full 5000-token analysis

## Benefits

| Benefit | Mechanism |
|---------|-----------|
| Zero token cost | Only the path is in context, not the content |
| Permanent audit trail | Every agent's output is on disk, not ephemeral chat |
| Crash-safe recovery | Files survive session crashes; context does not |
| Selective reading | Orchestrator reads only what it needs, when it needs it |
| Parallel work | Multiple agents write to separate files simultaneously |

## When to Use

- Any multi-agent workflow where subagents produce substantial output
- Any workflow that needs to survive session restarts
- Any workflow where audit trail matters

## When Not to Use

- Very short outputs (a yes/no decision, a single number) where file I/O overhead
  is not worth the benefit
- Systems without filesystem access

## Related: Context Persistence via context.md

Cowork sessions are stateful during active turns but entirely ephemeral across
restarts. To persist session state: mandate creation of `context.md` at project root.
Instruct the agent to read it on boot and append operational summary before closing.
This is the File Handoff pattern applied to session state rather than inter-agent
communication.

## Related

- **[Goal-State Execution](goal-state-execution.md)** — goal-state defines what agents pursue; file handoff coordinates between them
- **[Claude Cowork Architecture](../references/claude-cowork-architecture.md)** — platform architecture where file handoff pattern operates
- **[Ambiguity as Silent Execution](../failures/ambiguity-as-silent-execution.md)** — file handoff creates audit trail that makes silent execution visible
