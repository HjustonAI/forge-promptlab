---
source_file: veo3.ctx.md
source_mode: skill-spec
origin: "FORGE context file — Veo3 video generation operational intelligence"
origin_date: 2026-03-28
ingested: 2026-04-16
ingested_by: distill-agent (claude-opus-4-6)
artifacts_produced:
  - distilled/patterns/explicit-component-ordering.md (co-sourced)
  - distilled/patterns/delta-only-continuation.md
  - distilled/references/veo3-production-parameters.md
notes: |
  Detailed skill-spec for Google Veo3 video generation. Architecturally
  distinctive: joint audio-video latent denoising in single pass. Strict
  component ordering (Camera→Subject→Action→Context→Style→Audio→Negatives).
  Dialogue requires hard routing syntax (colon+quotes). 6 failure modes.
  Mode confidence: high.
---
