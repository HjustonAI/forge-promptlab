#!/usr/bin/env node
// Hook: validate-frontmatter
// Event: PreToolUse Write/Edit on distilled/** | compiled/**
// Action: Reject (exit 2) if frontmatter doesn't match v2 schema.

import {
  extractFrontmatter, getScalar, getInlineList, getNestedScalar, getSeeAlso,
  readStdinJson, pathMatches,
  VALID_TYPES, ATOMIC_TYPES, COMPILED_TYPES, VALID_RELATIONS,
  VALID_LIFECYCLE, VALID_PROVENANCE_TIERS, VALID_CONFIDENCE, VALID_MODALITY,
} from '../lib/frontmatter.mjs';

const payload = await readStdinJson();
if (!payload) process.exit(0); // No payload — nothing to validate

const filePath = payload.tool_input?.file_path || '';
const content = payload.tool_input?.content ?? payload.tool_input?.new_string ?? '';

// Scope check — only fire on distilled/ and compiled/
if (!pathMatches(filePath, '/distilled/') && !pathMatches(filePath, '/compiled/')) {
  process.exit(0);
}

// Skip envelope sidecars
if (filePath.endsWith('.envelope.md')) process.exit(0);

const errors = [];
const fm = extractFrontmatter(content);
if (!fm) {
  errors.push('NO-FRONTMATTER: file must start with --- YAML frontmatter --- block');
} else {
  const type = getScalar(fm, 'type');
  const title = getScalar(fm, 'title');
  const dedupe_key = getScalar(fm, 'dedupe_key');
  const lifecycle = getScalar(fm, 'lifecycle');
  const tldr = getScalar(fm, 'tldr');
  const goal = getScalar(fm, 'goal');
  const confidence = getScalar(fm, 'confidence');
  const provenance_tier = getNestedScalar(fm, 'provenance', 'tier');
  const modality = getInlineList(fm, 'modality') || [];
  const see_also = getSeeAlso(fm);

  // Required fields
  if (!title) errors.push('MISSING: title');
  if (!type) errors.push('MISSING: type');
  else if (!VALID_TYPES.has(type)) errors.push(`INVALID-TYPE: "${type}" (must be one of: ${[...VALID_TYPES].join(', ')})`);
  if (!dedupe_key) errors.push('MISSING: dedupe_key');
  if (!lifecycle) errors.push('MISSING: lifecycle');
  else if (!VALID_LIFECYCLE.has(lifecycle)) errors.push(`INVALID-LIFECYCLE: "${lifecycle}" (must be one of: ${[...VALID_LIFECYCLE].join(', ')})`);

  // Provenance — required for all distilled/compiled
  if (!provenance_tier) errors.push('MISSING: provenance.tier (replaces flat confidence; required for all v2 artifacts)');
  else if (!VALID_PROVENANCE_TIERS.has(provenance_tier)) errors.push(`INVALID-PROVENANCE-TIER: "${provenance_tier}" (must be one of: ${[...VALID_PROVENANCE_TIERS].join(', ')})`);

  // Confidence — required, valid enum
  if (!confidence) errors.push('MISSING: confidence');
  else if (!VALID_CONFIDENCE.has(confidence)) errors.push(`INVALID-CONFIDENCE: "${confidence}" (must be one of: ${[...VALID_CONFIDENCE].join(', ')})`);

  // Atomic-only requirements
  if (ATOMIC_TYPES.has(type)) {
    if (!tldr) errors.push('MISSING: tldr (atomic artifacts require tldr)');
    else if (tldr.length > 280) errors.push(`TLDR-OVERSIZE: tldr is ${tldr.length} chars (max 280)`);
    if (!goal) errors.push('MISSING: goal (atomic artifacts require goal)');
  }

  // Compiled-only requirements
  if (COMPILED_TYPES.has(type)) {
    // compiled_from is required and must list at least one atomic
    const compiled_from_re = /^compiled_from:\s*\n(\s+- .+\n)+/m;
    if (!compiled_from_re.test(fm)) errors.push('MISSING: compiled_from (compiled artifacts require ≥1 atomic source)');
  }

  // Modality enum check
  for (const m of modality) {
    if (!VALID_MODALITY.has(m)) errors.push(`INVALID-MODALITY: "${m}" (must be one of: ${[...VALID_MODALITY].join(', ')})`);
  }

  // Cross-references — minimum and typed
  const minRefs = COMPILED_TYPES.has(type) ? 3 : 2;
  if (see_also.length < minRefs) {
    errors.push(`UNDER-LINKED: ${see_also.length} see_also entries (${COMPILED_TYPES.has(type) ? 'compiled' : 'atomic'} artifacts require min ${minRefs})`);
  }
  for (const edge of see_also) {
    if (!edge.relation && !edge.relationship) {
      errors.push(`EDGE-UNTYPED: see_also entry for "${edge.artifact}" has neither relation nor relationship field`);
    } else if (edge.relation && !VALID_RELATIONS.has(edge.relation)) {
      errors.push(`EDGE-INVALID-RELATION: "${edge.relation}" on see_also for "${edge.artifact}" (must be one of: ${[...VALID_RELATIONS].join(', ')})`);
    }
  }
}

if (errors.length > 0) {
  console.error(`\n[validate-frontmatter] BLOCKED: ${filePath}\n`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error(`\nFix the frontmatter to match the v2 schema in policies.md, then retry.`);
  process.exit(2);
}

process.exit(0);
