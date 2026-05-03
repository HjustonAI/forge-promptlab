#!/usr/bin/env node
// Hook: enforce-tag-vocab
// Event: PreToolUse Write on distilled/** | compiled/**
// Action: Reject if tags/domains/modality/tools values aren't in taxonomy.md.

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  extractFrontmatter, getInlineList, readStdinJson, pathMatches,
} from '../lib/frontmatter.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const KMS_ROOT = join(__dirname, '..', '..');
const TAXONOMY_PATH = join(KMS_ROOT, 'taxonomy.md');

const payload = await readStdinJson();
if (!payload) process.exit(0);

const filePath = payload.tool_input?.file_path || '';
const content = payload.tool_input?.content ?? payload.tool_input?.new_string ?? '';

if (!pathMatches(filePath, '/distilled/') && !pathMatches(filePath, '/compiled/')) process.exit(0);
if (filePath.endsWith('.envelope.md')) process.exit(0);

const fm = extractFrontmatter(content);
if (!fm) process.exit(0);

// Load taxonomy and extract registered values
let taxonomy;
try { taxonomy = await readFile(TAXONOMY_PATH, 'utf8'); }
catch { process.exit(0); /* taxonomy missing — fall through, validate-frontmatter handles core */ }

// Extract domains from the Domains table
const registeredDomains = new Set();
const domainsSection = taxonomy.match(/## Domains\n([\s\S]*?)(?:\n##\s|\n---)/);
if (domainsSection) {
  for (const line of domainsSection[1].split('\n')) {
    const m = line.match(/^\|\s*`([a-z][a-z-]*)`\s*\|/);
    if (m) registeredDomains.add(m[1]);
  }
}

// Extract tags — appear under sub-headings as backtick-wrapped slugs
const registeredTags = new Set();
const tagsSection = taxonomy.match(/## Tags[^\n]*\n([\s\S]*?)$/);
if (tagsSection) {
  for (const line of tagsSection[1].split('\n')) {
    const m = line.match(/^-\s*`([a-z][a-z-]*)`/);
    if (m) registeredTags.add(m[1]);
  }
}

// Extract tool slugs from Tools registry
const registeredTools = new Set();
const toolsSection = taxonomy.match(/## Tools[^\n]*\n([\s\S]*?)(?:\n---|\n## )/);
if (toolsSection) {
  for (const line of toolsSection[1].split('\n')) {
    const m = line.match(/^\|\s*`([a-z][a-z0-9-]*)`\s*\|/);
    if (m) registeredTools.add(m[1]);
  }
}

const errors = [];

const domains = getInlineList(fm, 'domains') || [];
for (const d of domains) {
  if (!registeredDomains.has(d)) errors.push(`UNKNOWN-DOMAIN: "${d}" not in taxonomy.md §Domains`);
}

const tags = getInlineList(fm, 'tags') || [];
for (const t of tags) {
  if (!registeredTags.has(t)) errors.push(`UNKNOWN-TAG: "${t}" not in taxonomy.md §Tags`);
}

const tools = getInlineList(fm, 'tools') || [];
for (const t of tools) {
  if (!registeredTools.has(t)) errors.push(`UNKNOWN-TOOL: "${t}" not in taxonomy.md §Tools registry`);
}

if (errors.length > 0) {
  console.error(`\n[enforce-tag-vocab] BLOCKED: ${filePath}\n`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error(`\n  Resolution: either use an existing taxonomy value or add a new one to taxonomy.md first.`);
  console.error(`  New tags/domains/tools require a clear definition + at least one artifact using them.`);
  console.error(`  See policies.md §Tag Governance.\n`);
  process.exit(2);
}

process.exit(0);
