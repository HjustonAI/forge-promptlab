#!/usr/bin/env node
// Hook: block-raw-edits
// Event: PreToolUse Edit/Write on raw/**
// Action: Reject all writes to raw/ except *.envelope.md sidecars.

import { readStdinJson, pathMatches } from '../lib/frontmatter.mjs';

const payload = await readStdinJson();
if (!payload) process.exit(0);

const filePath = payload.tool_input?.file_path || '';

// Only fire for raw/
if (!pathMatches(filePath, '/raw/')) process.exit(0);

// Envelope sidecars are allowed (they're metadata, not source content)
if (filePath.endsWith('.envelope.md')) process.exit(0);

console.error(`\n[block-raw-edits] BLOCKED: ${filePath}\n`);
console.error(`  raw/ is immutable. Source material cannot be edited.`);
console.error(`  If you need to revise interpretation, edit the corresponding artifact in distilled/ or compiled/.`);
console.error(`  If the source itself is wrong, replace it with a new file (different filename) and ingest fresh.`);
console.error(`  Envelope sidecars (*.envelope.md) are the only writable metadata in raw/.\n`);
process.exit(2);
