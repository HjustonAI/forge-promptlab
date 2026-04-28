---
title: "Claude Cowork Architecture Reference"
type: reference
domains: [tooling, agentic-systems]
tags: [agent-architecture, agent-orchestration, tool-integration]
confidence: medium
confidence_rationale: "Single source (FORGE context file); Cowork is actively evolving (v2.1.32+ for multi-agent)"
lifecycle: current
created: 2026-04-16
updated: 2026-04-16
evidence:
  - source: raw/deep-research/claude-cowork.ctx.md
    sections: ["Operating Environment [EXTEND]", "Calibration", "CRITICAL — Claude Cowork Rules"]
    claim: "Architecture, operating modes, and constraints for Claude Cowork"
dedupe_key: "ref:claude-cowork-architecture-2026"
contradictions: []
see_also:
  - artifact: distilled/patterns/goal-state-execution.md
    relationship: "Done Framework originates from Cowork's execution model"
  - artifact: distilled/patterns/file-handoff-state-machine.md
    relationship: "File handoff pattern implemented in Cowork's multi-agent mode"
  - artifact: distilled/failures/ambiguity-as-silent-execution.md
    relationship: "Cowork's autonomous execution is where this failure mode manifests"
  - artifact: distilled/synthesis/universal-prompting-principles.md
    relationship: "Universal principles that Claude Cowork implements tool-specifically"
  - artifact: distilled/synthesis/model-comparison-matrix.md
    relationship: "Comparison matrix with Claude Cowork as one of four profiled tools"
supersedes: []
---

# Claude Cowork Architecture Reference

Snapshot as of March 2026.

## Core Identity

Cowork is a **desktop workflow orchestration engine** running inside an isolated VM.
Not a chatbot. Prompts define terminal states; the agent plans and executes autonomously.
Side effects (file writes, tool calls) are permanent.

## Prompt Calibration

| Parameter | Guidance |
|-----------|---------|
| Tone | Programmatic, imperative. "Write to /path/file.md" not "Please create a file" |
| Framing | "I want X so that Y" (goal-state) dramatically outperforms step enumeration |
| Output naming | Always specify convention: `YYYY-MM-DD_ProjectName_v1.ext` |

## Operating Modes

### Solo Session (GUI)
- Agent reads `claude.md` anchor on init
- Plugin skills auto-route via semantic matching
- DCI (Dynamic Context Injection) runs at skill activation
- File Handoffs and context.md are primary state mechanisms
- No UI-level execution restrictions — all constraints come from the prompt

### Multi-Agent Orchestration
- Trigger: "Do not use standard subagents; spawn fully independent teammates"
- Requires: named roles, lateral communication assignments, Devil's Advocate designation
- Output: file targets per agent
- Introduced in Claude Code v2.1.32
- **Highly token-expensive** — budget accordingly

### Plugin / Skill Authoring
- YAML frontmatter is the control plane for semantic router
- DCI runs before LLM sees prompt; slot-filling before LLM reasoning
- Directory: `plugin.json` inside `.claude-plugin/`; all component dirs at plugin root

## SKILL.md Constraints

| Field | Constraint |
|-------|-----------|
| Name | Max 64 chars, lowercase + hyphens, no XML tags, no "claude"/"anthropic" |
| Description | **Single-line inline string only** (no block scalars > or \|) — this IS the routing signal |
| Argument-hint | Document expected input |
| Allowed-tools | Allowlist only what's required |

## DCI (Dynamic Context Injection)

Shell commands fire at skill activation, injecting output before LLM reasoning.
Use for: git status, directory scans, dependency checks.
**Always pair with fallback**: `!`command || echo 'not available'``

## Key Failure Modes

| Failure | Repair |
|---------|--------|
| Immediate execution on ambiguity | Gate clause: "DO NOT execute yet. Use AskUserQuestion first" |
| Session memory wipe on restart | Mandate context.md; read on boot, append before close |
| Subagent context bloat | File Handoff: write to disk, return path only |
| Skill auto-discovery fails | Single-line description field; no YAML block scalars |
| Plugin components not found | Component dirs at plugin root, not inside .claude-plugin/ |
| QA hallucination | Intermediate raw output file before qualitative judgment |
| Prompt injection via docs | Define directory scope; human confirm before permanent effects |
| DCI crash | Fallback: `|| echo 'not available'` |

## Multi-Agent Budget

- **Subagents**: efficient, isolated, good for extraction or routing to cheaper models (Haiku)
- **Agent Teams**: expensive (full parallel context windows), reserve for genuine debate,
  devil's advocacy, or multi-disciplinary synthesis

## Related

- **[Goal-State Execution](../patterns/goal-state-execution.md)** — Done Framework originates from Cowork's execution model
- **[File Handoff State Machine](../patterns/file-handoff-state-machine.md)** — file handoff pattern implemented in Cowork's multi-agent mode
- **[Ambiguity as Silent Execution](../failures/ambiguity-as-silent-execution.md)** — Cowork's autonomous execution is where this failure mode manifests
- **[Universal Prompting Principles](../synthesis/universal-prompting-principles.md)** — universal principles that Claude Cowork implements tool-specifically
- **[Model Comparison Matrix](../synthesis/model-comparison-matrix.md)** — comparison matrix with Claude Cowork as one of four profiled tools
