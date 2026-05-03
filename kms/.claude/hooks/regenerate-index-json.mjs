#!/usr/bin/env node
// Hook: regenerate-index-json
// Event: PostToolUse Write/Edit on distilled/** | compiled/**
// Action: Async fire the lint script to keep INDEX.json fresh. Always exits 0.

import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readStdinJson, pathMatches } from '../lib/frontmatter.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const KMS_ROOT = join(__dirname, '..', '..');
const LINT_SCRIPT = join(KMS_ROOT, '.claude', 'skills', 'lint', 'build-index.mjs');

const payload = await readStdinJson();
if (!payload) process.exit(0);

const filePath = payload.tool_input?.file_path || '';

if (!pathMatches(filePath, '/distilled/') && !pathMatches(filePath, '/compiled/')) process.exit(0);
if (filePath.endsWith('.envelope.md')) process.exit(0);

// Spawn lint detached so PostToolUse doesn't block the agent
const child = spawn(process.execPath, [LINT_SCRIPT], {
  cwd: KMS_ROOT,
  detached: true,
  stdio: 'ignore',
});
child.unref();

// Always exit 0 — PostToolUse hooks shouldn't block
process.exit(0);
