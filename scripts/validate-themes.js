#!/usr/bin/env node
// Structural validator for the 4 KonexForge theme files.
// Enforces the rules documented in CLAUDE.md ("Architecture: the theme
// files"). Run: node scripts/validate-themes.js — exits non-zero on any
// violation. Plain Node, no dependencies.

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const VARIANTS = {
  dark: 'themes/konexforge-dark-color-theme.json',
  light: 'themes/konexforge-light-color-theme.json',
  'dark-hc': 'themes/konexforge-dark-hc-color-theme.json',
  'light-hc': 'themes/konexforge-light-hc-color-theme.json',
};
const HC_VARIANTS = ['dark-hc', 'light-hc'];

// The only `colors` keys allowed to exist in the HC files but not in
// Dark/Light (HC differentiates via borders — see CLAUDE.md). Keep in
// sync with the doc.
const HC_ONLY_COLOR_KEYS = new Set([
  'contrastBorder',
  'contrastActiveBorder',
  'list.focusOutline',
  'button.border',
  'notifications.border',
  'menu.border',
  'menu.selectionBorder',
]);

// The exact italic sets Dark and Light must have — no more, no less
// (the "annotation layer" style choice documented in CLAUDE.md).
const ITALIC_TOKEN_SCOPES = new Set([
  'comment',
  'comment.line',
  'comment.block',
  'comment.block.documentation',
  'keyword',
  'keyword.control',
  'keyword.operator.new',
  'keyword.operator.expression',
  'keyword.operator.logical.python',
  'keyword.operator.sizeof',
  'keyword.operator.cast',
  'entity.other.inherited-class',
  'entity.other.attribute-name',
  'variable.parameter',
  'meta.decorator',
  'punctuation.decorator',
  'entity.name.function.decorator',
  'punctuation.definition.decorator',
  'markup.italic',
]);
const ITALIC_SEMANTIC_TOKENS = new Set([
  'keyword',
  'parameter',
  'namespace',
  'decorator',
  'macro',
  '*.defaultLibrary',
]);

const BRACKET_SEQUENCE = ['#FF7A33', '#F5A623', '#47A8E1', '#26C5B5', '#8F61E5', '#C97B4A'];

const HEX_RE = /^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;

const errors = [];
function fail(msg) {
  errors.push(msg);
}

function scopesOf(entry) {
  const s = entry.scope;
  return Array.isArray(s) ? s : s == null ? [] : [s];
}

function hasAlpha(hex) {
  if (typeof hex !== 'string') return false;
  if (/^#[0-9A-Fa-f]{8}$/.test(hex)) return hex.slice(7).toUpperCase() !== 'FF';
  if (/^#[0-9A-Fa-f]{4}$/.test(hex)) return hex.slice(4).toUpperCase() !== 'F';
  return false;
}

function isItalic(settings) {
  return typeof settings === 'object' && settings !== null &&
    /\bitalic\b/.test(settings.fontStyle || '');
}

// --- Load everything ------------------------------------------------------

const themes = {};
for (const [name, rel] of Object.entries(VARIANTS)) {
  try {
    themes[name] = JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
  } catch (e) {
    console.error(`FATAL: ${rel}: ${e.message}`);
    process.exit(1);
  }
}
let pkg;
try {
  pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
} catch (e) {
  console.error(`FATAL: package.json: ${e.message}`);
  process.exit(1);
}

const dark = themes.dark;

// --- 1. `colors` key parity (Dark is the source of truth) -----------------

const darkKeys = new Set(Object.keys(dark.colors));
for (const [name, theme] of Object.entries(themes)) {
  if (name === 'dark') continue;
  const keys = new Set(Object.keys(theme.colors));
  const isHC = HC_VARIANTS.includes(name);
  for (const k of darkKeys) {
    if (!keys.has(k)) fail(`${name}: colors missing key "${k}" (present in dark)`);
  }
  for (const k of keys) {
    if (darkKeys.has(k)) continue;
    if (isHC && HC_ONLY_COLOR_KEYS.has(k)) continue;
    fail(`${name}: colors has extra key "${k}" not in dark${isHC ? ' (and not in the HC-only allowlist)' : ''}`);
  }
  if (isHC) {
    for (const k of HC_ONLY_COLOR_KEYS) {
      if (!keys.has(k)) fail(`${name}: missing required HC-only key "${k}"`);
    }
  }
}

// --- 2. `tokenColors` structure identical across all 4 --------------------

const darkTC = dark.tokenColors.map((e) => JSON.stringify(scopesOf(e)));
for (const [name, theme] of Object.entries(themes)) {
  if (name === 'dark') continue;
  const tc = theme.tokenColors.map((e) => JSON.stringify(scopesOf(e)));
  if (tc.length !== darkTC.length) {
    fail(`${name}: tokenColors has ${tc.length} entries, dark has ${darkTC.length}`);
    continue;
  }
  tc.forEach((s, i) => {
    if (s !== darkTC[i]) fail(`${name}: tokenColors[${i}] scopes ${s} != dark's ${darkTC[i]}`);
  });
}

// --- 3. `semanticTokenColors` key set identical ----------------------------

const darkSem = new Set(Object.keys(dark.semanticTokenColors));
for (const [name, theme] of Object.entries(themes)) {
  if (name === 'dark') continue;
  const keys = new Set(Object.keys(theme.semanticTokenColors));
  for (const k of darkSem) if (!keys.has(k)) fail(`${name}: semanticTokenColors missing "${k}"`);
  for (const k of keys) if (!darkSem.has(k)) fail(`${name}: semanticTokenColors has extra "${k}"`);
}

// --- 4. HC: no italics, no alpha -------------------------------------------

for (const name of HC_VARIANTS) {
  const theme = themes[name];
  for (const entry of theme.tokenColors) {
    if (isItalic(entry.settings)) {
      fail(`${name}: tokenColors scope ${JSON.stringify(entry.scope)} uses italic (HC must not)`);
    }
  }
  for (const [token, settings] of Object.entries(theme.semanticTokenColors)) {
    if (isItalic(settings)) fail(`${name}: semanticTokenColors "${token}" uses italic (HC must not)`);
  }
  for (const [k, v] of Object.entries(theme.colors)) {
    if (hasAlpha(v)) fail(`${name}: colors "${k}" = "${v}" has an alpha channel (HC must be solid)`);
  }
}

// --- 5. Dark/Light: italic sets must match the documented allowlist --------

for (const name of ['dark', 'light']) {
  const theme = themes[name];
  const found = new Set();
  for (const entry of theme.tokenColors) {
    if (isItalic(entry.settings)) scopesOf(entry).forEach((s) => found.add(s));
  }
  for (const s of found) {
    if (!ITALIC_TOKEN_SCOPES.has(s)) fail(`${name}: tokenColors scope "${s}" is italic but not in the allowlist`);
  }
  for (const s of ITALIC_TOKEN_SCOPES) {
    if (!found.has(s)) fail(`${name}: tokenColors scope "${s}" should be italic per the allowlist but isn't`);
  }
  const foundSem = new Set(
    Object.entries(theme.semanticTokenColors)
      .filter(([, settings]) => isItalic(settings))
      .map(([token]) => token)
  );
  for (const t of foundSem) {
    if (!ITALIC_SEMANTIC_TOKENS.has(t)) fail(`${name}: semantic token "${t}" is italic but not in the allowlist`);
  }
  for (const t of ITALIC_SEMANTIC_TOKENS) {
    if (!foundSem.has(t)) fail(`${name}: semantic token "${t}" should be italic per the allowlist but isn't`);
  }
}

// --- 6. Dark bracket color sequence ----------------------------------------

BRACKET_SEQUENCE.forEach((hex, i) => {
  const key = `editorBracketHighlight.foreground${i + 1}`;
  const actual = dark.colors[key];
  if ((actual || '').toUpperCase() !== hex) {
    fail(`dark: ${key} = "${actual}", expected "${hex}" (forge bracket sequence)`);
  }
});

// --- 7. Every color value is a valid, non-empty hex -------------------------

for (const [name, theme] of Object.entries(themes)) {
  for (const [k, v] of Object.entries(theme.colors)) {
    if (!HEX_RE.test(v)) fail(`${name}: colors "${k}" = ${JSON.stringify(v)} is not a valid hex color`);
  }
  theme.tokenColors.forEach((entry, i) => {
    for (const prop of ['foreground', 'background']) {
      const v = entry.settings && entry.settings[prop];
      if (v !== undefined && !HEX_RE.test(v)) {
        fail(`${name}: tokenColors[${i}].settings.${prop} = ${JSON.stringify(v)} is not a valid hex color`);
      }
    }
  });
  for (const [token, settings] of Object.entries(theme.semanticTokenColors)) {
    const v = typeof settings === 'string' ? settings : settings && settings.foreground;
    if (v !== undefined && !HEX_RE.test(v)) {
      fail(`${name}: semanticTokenColors "${token}" foreground ${JSON.stringify(v)} is not a valid hex color`);
    }
  }
}

// --- 8. package.json theme paths exist --------------------------------------

const contributed = (pkg.contributes && pkg.contributes.themes) || [];
if (contributed.length !== 4) fail(`package.json: expected 4 contributed themes, found ${contributed.length}`);
for (const t of contributed) {
  if (!fs.existsSync(path.join(ROOT, t.path))) {
    fail(`package.json: theme path "${t.path}" does not exist`);
  }
}
const declaredPaths = new Set(contributed.map((t) => path.normalize(t.path)));
for (const rel of Object.values(VARIANTS)) {
  if (!declaredPaths.has(path.normalize('./' + rel))) {
    fail(`package.json: "${rel}" is not listed in contributes.themes`);
  }
}

// --- Report -----------------------------------------------------------------

if (errors.length) {
  console.error(`validate-themes: ${errors.length} violation(s):\n`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log('validate-themes: all checks passed for', Object.keys(VARIANTS).join(', '));
