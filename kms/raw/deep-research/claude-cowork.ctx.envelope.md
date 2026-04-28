---
source_file: claude-cowork.ctx.md
source_mode: skill-spec
origin: "FORGE context file — Claude Cowork operational intelligence"
origin_date: 2026-03-29
ingested: 2026-04-16
ingested_by: distill-agent (claude-opus-4-6)
artifacts_produced:
  - distilled/patterns/goal-state-execution.md
  - distilled/patterns/file-handoff-state-machine.md
  - distilled/patterns/prompt-as-architectural-brief.md (co-sourced)
  - distilled/failures/ambiguity-as-silent-execution.md (co-sourced)
  - distilled/references/claude-cowork-architecture.md
notes: |
  Rich skill-spec covering Cowork's execution model, prompt architecture,
  and 8 documented failure modes with repair strategies. Key insight:
  Cowork is a live execution engine, not a chatbot — prompts are constraints
  on a running system. Multiple patterns are transferable to other agent systems.
  Mode confidence: high.
---
