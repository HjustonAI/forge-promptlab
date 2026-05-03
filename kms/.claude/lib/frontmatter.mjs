// Shared frontmatter extractor — used by lint and hooks.
// Pure Node, no deps, regex-based extraction tuned to Forge Heart Wiki schema.

export const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---/;

export function extractFrontmatter(content) {
  const m = content.match(FRONTMATTER_RE);
  return m ? m[1] : null;
}

export function getScalar(fm, key) {
  const re = new RegExp(`^${key}:\\s*(?:"([^"]*)"|([^\\n#]+?))\\s*(?:#.*)?$`, 'm');
  const m = fm.match(re);
  if (!m) return null;
  const v = (m[1] ?? m[2] ?? '').trim();
  return v === '' ? null : v;
}

export function getInlineList(fm, key) {
  const re = new RegExp(`^${key}:\\s*\\[([^\\]\\n]*)\\]\\s*$`, 'm');
  const m = fm.match(re);
  if (!m) return null;
  return m[1].split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
}

export function getNestedScalar(fm, parentKey, childKey) {
  const re = new RegExp(`^${parentKey}:\\s*\\n(?:(?:\\s{2}.*\\n?)*)\\s{2}${childKey}:\\s*(?:"([^"]*)"|([^\\n#]+?))\\s*(?:#.*)?$`, 'm');
  const m = fm.match(re);
  if (!m) return null;
  return (m[1] ?? m[2] ?? '').trim();
}

export function getSeeAlso(fm) {
  const startRe = /^see_also:\s*\n/m;
  const start = fm.search(startRe);
  if (start === -1) return [];
  const after = fm.slice(start);
  const linesAfter = after.split('\n').slice(1);
  const collected = [];
  for (const line of linesAfter) {
    if (line.length === 0) { collected.push(line); continue; }
    if (/^[A-Za-z_]/.test(line[0])) break;
    collected.push(line);
  }
  const block = collected.join('\n');
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

// Schema enums — single source of truth. Imported by lint AND hooks.

export const VALID_TYPES = new Set([
  'pattern', 'concept', 'failure', 'tool', 'mechanism', 'exemplar',
  'profile', 'synthesis', 'playbook',
]);

export const ATOMIC_TYPES = new Set(['pattern', 'concept', 'failure', 'tool', 'mechanism', 'exemplar']);
export const COMPILED_TYPES = new Set(['profile', 'synthesis', 'playbook']);

export const VALID_RELATIONS = new Set([
  'implements', 'violates', 'composes-with', 'supersedes', 'exemplifies',
  'conflicts-with', 'specializes', 'generalizes', 'requires', 'enables', 'mitigates',
  // Inverse forms accepted (graph bidirectionality)
  'implemented-by', 'mitigated-by', 'enabled-by', 'required-by', 'composed-with',
  'superseded-by', 'exemplified-by', 'violated-by',
]);

export const VALID_LIFECYCLE = new Set(['current', 'review-soon', 'stale', 'archived']);

export const VALID_PROVENANCE_TIERS = new Set([
  'official-doc', 'peer-reviewed', 'leaked-system-prompt',
  'corroborated-community', 'personal-field', 'speculative',
]);

export const VALID_CONFIDENCE = new Set(['high', 'medium', 'low']);

export const VALID_MODALITY = new Set([
  'text', 'image', 'video', 'audio', 'multimodal', 'agentic', 'code', '3d',
]);

// Read JSON payload from stdin (Claude Code hook protocol).
export async function readStdinJson() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString('utf8').trim();
  if (!text) return null;
  try { return JSON.parse(text); }
  catch (e) { return null; }
}

// Path utility — does the path match a glob-like prefix pattern?
export function pathMatches(filePath, prefix) {
  // Normalize separators for cross-platform
  const norm = filePath.replace(/\\/g, '/');
  return norm.includes(prefix);
}
