#!/usr/bin/env node
// Asserts exactly which files ship in the .vsix.
//
// `.vscodeignore` is the only thing keeping development-only directories out
// of a release, and it has failed before: a `.claude/` runtime folder once
// made it into a published package. An allowlist fails loudly when something
// new appears, where a denylist silently ships whatever it forgot to name.
//
// Run: node scripts/check-package.js   (CI runs this on every push/PR)

'use strict';

const { execFileSync } = require('child_process');
const path = require('path');

const EXPECTED = new Set([
  'package.json',
  'README.md',
  'LICENSE',
  'CHANGELOG.md',
  'images/icon.png',
  'themes/konexforge-dark-color-theme.json',
  'themes/konexforge-light-color-theme.json',
  'themes/konexforge-dark-hc-color-theme.json',
  'themes/konexforge-light-hc-color-theme.json',
]);

let out;
try {
  out = execFileSync('npx', ['--yes', '@vscode/vsce', 'ls'], {
    cwd: path.join(__dirname, '..'),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  });
} catch (e) {
  console.error(`FATAL: could not list packaged files: ${e.message}`);
  process.exit(1);
}

const actual = new Set(
  out.split('\n').map((l) => l.trim().replace(/\\/g, '/')).filter(Boolean)
);

const errors = [];
for (const f of actual) if (!EXPECTED.has(f)) errors.push(`unexpected file in the VSIX: ${f}`);
for (const f of EXPECTED) if (!actual.has(f)) errors.push(`missing from the VSIX: ${f}`);

if (errors.length) {
  console.error(`check-package: ${errors.length} problem(s):\n`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error('\nUpdate .vscodeignore, or EXPECTED in this script if the change is intended.');
  process.exit(1);
}
console.log(`check-package: VSIX contents match the allowlist (${actual.size} files)`);
