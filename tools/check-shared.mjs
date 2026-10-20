#!/usr/bin/env node
// T-108 gate: every page's <!-- shared:X --> region must be byte-identical to what
// tools/stamp-shared.mjs would produce from the CURRENT partials right now. Since the stamp
// script is idempotent (re-running it is a no-op once a page is in sync), the gate is simply:
// re-run the stamper and confirm it changes nothing. If a page's marked region has drifted
// (hand-edited, or a partial changed and the page was never re-stamped), the stamper will
// rewrite it back in sync and this check reports exactly which files moved.
import { execSync } from 'node:child_process';

const before = execSync('git status --porcelain', { encoding: 'utf8' });
execSync('node tools/stamp-shared.mjs', { stdio: 'inherit' });
const after = execSync('git status --porcelain', { encoding: 'utf8' });

if (before !== after) {
  const diff = execSync('git diff --stat', { encoding: 'utf8' });
  console.error('\n[FAIL] shared-components out of sync — these pages drifted from their partial and were just re-synced:\n' + diff);
  console.error('Run `git diff` to see exactly what changed, review it, then commit.');
  process.exit(1);
}
console.log('[PASS] every shared:* region matches its current partial.');
