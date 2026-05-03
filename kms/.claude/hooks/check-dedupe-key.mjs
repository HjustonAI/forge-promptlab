#!/usr/bin/env node
// Hook: check-dedupe-key
// Event: PreToolUse Write on distilled/** | compiled/**
// Action: Reject if dedupe_key collides with an existing artifact (unless `supersedes` is set).

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  extractFrontmatter, getScalar, readStdinJson, pathMatches,
} from '../lib/frontmatter.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const KMS_ROOT = join(__dirname, '..', '..');
const INDEX_PATH = join(KMS_ROOT, 'INDEX.json');

const payload = await readStdinJson();
if (!payload) process.exit(0);

const filePath = payload.tool_input?.file_path || '';
const content = payload.tool_input?.content ?? payload.tool_input?.new_string ?? '';

if (!pathMatches(filePath, '/distilled/') && !pathMatches(filePath, '/compiled/')) process.exit(0);
if (filePath.endsWith('.envelope.md')) process.exit(0);

const fm = extractFrontmatter(content);
if (!fm) process.exit(0); // validate-frontmatter handles this case

const newKey = getScalar(fm, 'dedupe_key');
if (!newKey) process.exit(0); // validate-frontmatter handles this case

// Check if `supersedes` is non-empty — operator is intentionally replacing
const supersedesRe = /^supersedes:\s*\n(\s+- .+\n)+/m;
const isSuperseding = supersedesRe.test(fm);

// Read INDEX.json
let index;
try {
  const text = await readFile(INDEX_PATH, 'utf8');
  index = JSON.parse(text);
} catch {
  // INDEX.json missing or invalid — let it pass; lint will catch downstream.
  // (This happens during fresh setup or when INDEX.json hasn't been generated yet.)
  process.exit(0);
}

// Normalize the new file's path to match INDEX.json convention
const normFilePath = filePath.replace(/\\/g, '/').replace(/^.*\/(distilled|compiled)\//, '$1/');

const collisions = (index.artifacts || []).filter(a =>
  a.dedupe_key === newKey && a.path !== normFilePath
);

if (collisions.length > 0 && !isSuperseding) {
  console.error(`\n[check-dedupe-key] BLOCKED: ${filePath}\n`);
  console.error(`  dedupe_key "${newKey}" already exists on:`);
  for (const c of collisions) console.error(`    - ${c.path}`);
  console.error(`\n  Resolution options:`);
  console.error(`    1. MERGE — don't create new; instead update the existing artifact with new evidence`);
  console.error(`    2. SUPERSEDE — set supersedes: [<existing path>] in this file's frontmatter; archive the existing`);
  console.error(`    3. DISAMBIGUATE — refine the dedupe_key to be more specific (e.g., add tool slug or year)`);
  console.error(`\n  Pick one and retry.\n`);
  process.exit(2);
}

process.exit(0);
