#!/usr/bin/env node
// Forge Heart Wiki — INDEX.json builder
//
// Walks distilled/** and compiled/** for *.md files, parses YAML frontmatter
// (regex-based, our schema shape only — no external YAML lib), builds the typed
// knowledge graph, and emits INDEX.json plus a human-readable lint report.
//
// Usage:  node .claude/skills/lint/build-index.mjs
// Output: INDEX.json (machine graph), stdout (summary), exit 0 = clean / 1 = errors

import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join, relative, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const KMS_ROOT = join(__dirname, '..', '..', '..');
const SCAN_ROOTS = ['distilled', 'compiled'];
const OUTPUT = join(KMS_ROOT, 'INDEX.json');

// ─────────────────────────────────────────────────────────────────────────
// Regex-based frontmatter extractor (handles our schema; not a full YAML parser)
// ─────────────────────────────────────────────────────────────────────────

const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---/;

function extractFrontmatter(content) {
  const m = content.match(FRONTMATTER_RE);
  return m ? m[1] : null;
}

function getScalar(fm, key) {
  // Matches `key: "value"` or `key: value` — single line.
  const re = new RegExp(`^${key}:\\s*(?:"([^"]*)"|([^\\n#]+?))\\s*(?:#.*)?$`, 'm');
  const m = fm.match(re);
  if (!m) return null;
  const v = (m[1] ?? m[2] ?? '').trim();
  return v === '' ? null : v;
}

function getInlineList(fm, key) {
  // Matches `key: [a, b, c]` (one line, square-bracket style).
  const re = new RegExp(`^${key}:\\s*\\[([^\\]\\n]*)\\]\\s*$`, 'm');
  const m = fm.match(re);
  if (!m) return null;
  return m[1].split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
}

function getNestedScalar(fm, parentKey, childKey) {
  // Matches a child key indented under `parent:` block.
  const re = new RegExp(`^${parentKey}:\\s*\\n(?:(?:\\s{2}.*\\n?)*)\\s{2}${childKey}:\\s*(?:"([^"]*)"|([^\\n#]+?))\\s*(?:#.*)?$`, 'm');
  const m = fm.match(re);
  if (!m) return null;
  return (m[1] ?? m[2] ?? '').trim();
}

function getSeeAlso(fm) {
  // Parses see_also block — list of {artifact, relation|relationship, note?}.
  const startRe = /^see_also:\s*\n/m;
  const start = fm.search(startRe);
  if (start === -1) return [];
  // Find end of the see_also block — next top-level key (line starting at col 0 with non-whitespace, non-dash)
  const after = fm.slice(start);
  const linesAfter = after.split('\n').slice(1); // skip the `see_also:` header
  const collected = [];
  for (const line of linesAfter) {
    if (line.length === 0) { collected.push(line); continue; }
    if (/^[A-Za-z_]/.test(line[0])) break; // next top-level key
    collected.push(line);
  }
  const block = collected.join('\n');
  // Split into items beginning with `  - `
  const items = block.split(/^\s{2}-\s+/m).slice(1);
  return items.map(item => {
    const artifact = (item.match(/^artifact:\s*(.+?)\s*$/m) || [])[1] || null;
    const relation = (item.match(/^\s*relation:\s*(.+?)\s*$/m) || [])[1] || null;
    const relationship = (item.match(/^\s*relationship:\s*(?:"([^"]*)"|(.+?))\s*$/m) || []);
    const note = (item.match(/^\s*note:\s*(?:"([^"]*)"|(.+?))\s*$/m) || []);
    return {
      artifact: artifact?.trim() || null,
      relation: relation?.trim() || null,
      relationship: (relationship[1] ?? relationship[2] ?? '').trim() || null,
      note: (note[1] ?? note[2] ?? '').trim() || null,
    };
  }).filter(e => e.artifact);
}

// ─────────────────────────────────────────────────────────────────────────
// Filesystem walk
// ─────────────────────────────────────────────────────────────────────────

async function walk(dir, files = []) {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); }
  catch { return files; }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, files);
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(full);
  }
  return files;
}

// ─────────────────────────────────────────────────────────────────────────
// Schema validation (warn-only; lint reports but does not block)
// ─────────────────────────────────────────────────────────────────────────

const VALID_TYPES = new Set(['pattern', 'concept', 'failure', 'tool', 'mechanism', 'exemplar', 'profile', 'synthesis', 'playbook']);
const VALID_RELATIONS = new Set([
  'implements', 'violates', 'composes-with', 'supersedes', 'exemplifies',
  'conflicts-with', 'specializes', 'generalizes', 'requires', 'enables', 'mitigates',
  // Inverse forms used during migration (treated as v1-compat aliases)
  'implemented-by', 'mitigated-by', 'enabled-by', 'required-by', 'composed-with',
]);
const VALID_LIFECYCLE = new Set(['current', 'review-soon', 'stale', 'archived']);
const ATOMIC_TYPES = new Set(['pattern', 'concept', 'failure', 'tool', 'mechanism', 'exemplar']);
const COMPILED_TYPES = new Set(['profile', 'synthesis', 'playbook']);

function validateArtifact(a) {
  const issues = [];
  if (!a.frontmatter) { issues.push('NO-FRONTMATTER: file has no YAML frontmatter'); return issues; }
  if (!a.title) issues.push('MISSING: title');
  if (!a.type) issues.push('MISSING: type');
  else if (!VALID_TYPES.has(a.type)) issues.push(`INVALID-TYPE: ${a.type} (not in canonical 9-type set)`);
  if (!a.dedupe_key) issues.push('MISSING: dedupe_key');
  if (!a.lifecycle) issues.push('MISSING: lifecycle');
  else if (!VALID_LIFECYCLE.has(a.lifecycle)) issues.push(`INVALID-LIFECYCLE: ${a.lifecycle}`);
  if (a.see_also.length < 2) issues.push(`UNDER-LINKED: ${a.see_also.length} see_also entries (min 2)`);

  // v2 schema gates (warn only — Phase C migration in progress)
  if (ATOMIC_TYPES.has(a.type) && !a.tldr) issues.push('V2-MISSING: tldr (atomic artifacts require tldr ≤ 280 chars)');
  if (a.tldr && a.tldr.length > 280) issues.push(`V2-TLDR-OVERSIZE: ${a.tldr.length} chars (max 280)`);
  if (ATOMIC_TYPES.has(a.type) && !a.goal) issues.push('V2-MISSING: goal (atomic artifacts require goal field)');
  if (!a.provenance_tier) issues.push('V2-MISSING: provenance.tier (replaces flat confidence)');

  // Edge typing — warn if any see_also lacks both `relation` and `relationship` (must have one)
  for (const edge of a.see_also) {
    if (!edge.relation && !edge.relationship) issues.push(`V2-EDGE-UNTYPED: ${edge.artifact} has neither relation nor relationship`);
    else if (edge.relation && !VALID_RELATIONS.has(edge.relation)) issues.push(`V2-EDGE-INVALID-RELATION: ${edge.artifact} → ${edge.relation}`);
    else if (!edge.relation && edge.relationship) issues.push(`V1-EDGE: ${edge.artifact} uses prose relationship; should migrate to typed relation`);
  }

  return issues;
}

// ─────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────

async function main() {
  const allFiles = [];
  for (const root of SCAN_ROOTS) allFiles.push(...await walk(join(KMS_ROOT, root)));

  const artifacts = [];
  for (const file of allFiles) {
    const content = await readFile(file, 'utf8');
    const fm = extractFrontmatter(content);
    const relPath = relative(KMS_ROOT, file).split(/[\\/]/).join('/');
    if (!fm) {
      artifacts.push({ path: relPath, frontmatter: null, see_also: [], _issues: ['NO-FRONTMATTER'] });
      continue;
    }
    const a = {
      path: relPath,
      frontmatter: true,
      title: getScalar(fm, 'title'),
      type: getScalar(fm, 'type'),
      tldr: getScalar(fm, 'tldr'),
      goal: getScalar(fm, 'goal'),
      dedupe_key: getScalar(fm, 'dedupe_key'),
      confidence: getScalar(fm, 'confidence'),
      provenance_tier: getNestedScalar(fm, 'provenance', 'tier'),
      lifecycle: getScalar(fm, 'lifecycle'),
      language: getScalar(fm, 'language'),
      domains: getInlineList(fm, 'domains') || [],
      tags: getInlineList(fm, 'tags') || [],
      modality: getInlineList(fm, 'modality') || [],
      tools: getInlineList(fm, 'tools') || [],
      see_also: getSeeAlso(fm),
    };
    a._issues = validateArtifact(a);
    artifacts.push(a);
  }

  // ── Build graph
  const byPath = new Map(artifacts.map(a => [a.path, a]));
  const inboundCount = new Map();
  for (const a of artifacts) for (const e of a.see_also)
    inboundCount.set(e.artifact, (inboundCount.get(e.artifact) || 0) + 1);

  // ── Detect global issues
  const dedupeKeys = new Map();
  for (const a of artifacts) {
    if (!a.dedupe_key) continue;
    if (!dedupeKeys.has(a.dedupe_key)) dedupeKeys.set(a.dedupe_key, []);
    dedupeKeys.get(a.dedupe_key).push(a.path);
  }
  const dedupeCollisions = [...dedupeKeys.entries()].filter(([_, ps]) => ps.length > 1);

  const orphans = artifacts.filter(a => (inboundCount.get(a.path) || 0) === 0).map(a => a.path);

  // Bidirectionality check — for every edge A→B, B should have an edge to A
  const bidirIssues = [];
  for (const a of artifacts) for (const e of a.see_also) {
    const target = byPath.get(e.artifact);
    if (!target) {
      bidirIssues.push({ from: a.path, to: e.artifact, kind: 'BROKEN-LINK', detail: 'target does not exist' });
      continue;
    }
    const hasBack = target.see_also.some(eb => eb.artifact === a.path);
    if (!hasBack) bidirIssues.push({ from: a.path, to: e.artifact, kind: 'NON-BIDIRECTIONAL', detail: 'target does not link back' });
  }

  // ── Emit INDEX.json
  const index = {
    generated: new Date().toISOString().slice(0, 10),
    counts: {
      total: artifacts.length,
      by_type: {},
      v2_complete: 0,
      v1_remaining: 0,
      orphans: orphans.length,
      dedupe_collisions: dedupeCollisions.length,
    },
    artifacts: artifacts.map(a => ({
      path: a.path,
      type: a.type,
      title: a.title,
      tldr: a.tldr,
      goal: a.goal,
      dedupe_key: a.dedupe_key,
      lifecycle: a.lifecycle,
      provenance_tier: a.provenance_tier,
      confidence: a.confidence,
      modality: a.modality,
      tools: a.tools,
      domains: a.domains,
      tags: a.tags,
      language: a.language,
      inbound_count: inboundCount.get(a.path) || 0,
      edges: a.see_also.map(e => ({
        to: e.artifact,
        relation: e.relation,
        relationship: e.relationship,
        note: e.note,
      })),
      _issues: a._issues,
    })),
  };

  for (const a of artifacts) {
    index.counts.by_type[a.type || 'unknown'] = (index.counts.by_type[a.type || 'unknown'] || 0) + 1;
    const isV2 = a.tldr && a.goal && a.provenance_tier;
    if (isV2) index.counts.v2_complete++;
    else index.counts.v1_remaining++;
  }

  await writeFile(OUTPUT, JSON.stringify(index, null, 2) + '\n', 'utf8');

  // ── Console report
  const totalIssues = artifacts.reduce((n, a) => n + a._issues.length, 0);
  console.log(`\n=== Forge Heart Wiki — Lint Report ===\n`);
  console.log(`Artifacts scanned: ${artifacts.length}`);
  console.log(`  by type:`);
  for (const [t, n] of Object.entries(index.counts.by_type).sort()) console.log(`    ${t.padEnd(12)} ${n}`);
  console.log(`\nSchema progress:`);
  console.log(`  v2 complete (tldr+goal+provenance.tier): ${index.counts.v2_complete}`);
  console.log(`  v1 remaining (needs migration):          ${index.counts.v1_remaining}`);
  console.log(`\nGraph health:`);
  console.log(`  Orphans (no inbound links):              ${orphans.length}`);
  console.log(`  Dedupe collisions:                       ${dedupeCollisions.length}`);
  console.log(`  Bidirectionality issues:                 ${bidirIssues.length}`);
  console.log(`  Per-artifact lint issues:                ${totalIssues}`);

  if (dedupeCollisions.length > 0) {
    console.log(`\nDedupe collisions:`);
    for (const [k, ps] of dedupeCollisions) console.log(`  ${k}\n    ${ps.join('\n    ')}`);
  }
  if (bidirIssues.length > 0) {
    console.log(`\nBidirectionality / broken-link issues (top 20):`);
    for (const b of bidirIssues.slice(0, 20)) console.log(`  [${b.kind}] ${b.from} -> ${b.to}`);
    if (bidirIssues.length > 20) console.log(`  ... and ${bidirIssues.length - 20} more`);
  }
  if (orphans.length > 0) {
    console.log(`\nOrphans (no inbound see_also):`);
    for (const o of orphans) console.log(`  ${o}`);
  }
  if (totalIssues > 0) {
    console.log(`\nPer-artifact issues (top 30):`);
    let shown = 0;
    for (const a of artifacts) {
      if (a._issues.length === 0) continue;
      console.log(`  ${a.path}`);
      for (const i of a._issues) console.log(`    - ${i}`);
      shown += a._issues.length;
      if (shown >= 30) { console.log(`  ... (more issues truncated; see INDEX.json for full)`); break; }
    }
  }

  console.log(`\nWrote: ${relative(KMS_ROOT, OUTPUT)}`);
  console.log(`\nSummary: ${index.counts.v2_complete}/${artifacts.length} artifacts on v2 schema, ${totalIssues} lint issues, ${orphans.length} orphans, ${dedupeCollisions.length} dedupe collisions.`);

  // Exit non-zero only on hard errors (dedupe collisions, broken links). Schema gaps are warn-only during Phase C.
  const hardErrors = dedupeCollisions.length + bidirIssues.filter(b => b.kind === 'BROKEN-LINK').length;
  process.exit(hardErrors > 0 ? 1 : 0);
}

main().catch(err => { console.error('FATAL:', err); process.exit(2); });
