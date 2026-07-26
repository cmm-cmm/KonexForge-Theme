#!/usr/bin/env node
// Asserts exactly which files ship in the .vsix.
//
// `.vscodeignore` is the only thing keeping development-only directories out
// of a release, and it has failed before: a `.claude/` runtime folder once
// made it into a published package. An allowlist fails loudly when something
// new appears, where a denylist silently ships whatever it forgot to name.
//
// Reads the file list on stdin rather than spawning vsce itself, so this stays
// a pure text check with no process execution:
//
//   npx --yes @vscode/vsce ls | node scripts/check-package.js
//
// Plain Node, no dependencies.

'use strict';

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

// Entries arrive on stdin, so they are untrusted text: a "filename" carrying
// a newline or control character would forge extra lines in the report below.
// Only well-formed relative paths are echoed back verbatim; anything else is
// described by shape instead of quoted.
const SAFE_PATH = /^[.A-Za-z0-9][A-Za-z0-9._/-]{0,199}$/;
const describe = (name) =>
  SAFE_PATH.test(name) ? name : `<malformed entry, ${name.length} char(s)>`;

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  input += chunk;
});
process.stdin.on('end', () => {
  const actual = new Set(
    input.split('\n').map((l) => l.trim().replace(/\\/g, '/')).filter(Boolean)
  );

  if (!actual.size) {
    console.error('check-package: nothing on stdin — pipe `npx --yes @vscode/vsce ls` into this script');
    process.exit(1);
  }

  const errors = [];
  for (const f of actual) if (!EXPECTED.has(f)) errors.push(`unexpected file in the VSIX: ${describe(f)}`);
  for (const f of EXPECTED) if (!actual.has(f)) errors.push(`missing from the VSIX: ${f}`);

  if (errors.length) {
    console.error(`check-package: ${errors.length} problem(s):\n`);
    for (const e of errors) console.error(`  ✗ ${e}`);
    console.error('\nUpdate .vscodeignore, or EXPECTED in this script if the change is intended.');
    process.exit(1);
  }
  console.log(`check-package: VSIX contents match the allowlist (${actual.size} files)`);
});
