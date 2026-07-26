#!/usr/bin/env node
// Renders a preview image per theme variant, straight from the theme files.
//
// Every colour in the output is resolved through the same longest-prefix-wins
// TextMate lookup VSCode uses (and that scripts/validate-themes.js check 11
// pins), so the previews cannot drift from the themes the way a hand-taken
// screenshot does — re-run this after any palette change.
//
//   node scripts/render-preview.js            # writes images/preview-*.svg
//   npx --yes @resvg/resvg-js-cli --fit-width 980 \
//       images/preview-dark.svg images/preview-dark.png
//
// Plain Node, no dependencies.

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

const W = 980;
const H = 560;
const TITLE_H = 30;
const TAB_H = 34;
const STATUS_H = 24;
const ACTIVITY_W = 48;
const SIDEBAR_W = 184;
const EDITOR_X = ACTIVITY_W + SIDEBAR_W;
const SPLIT_X = 636;
const LINE_H = 19;
const FONT = 'DejaVu Sans Mono, Liberation Mono, Menlo, Consolas, monospace';
const FS = 12.5;

// --- sample code: [text, scope] pairs, scope null = plain editor foreground --
const TS_SAMPLE = [
  [['/**', 'comment.block.documentation']],
  [[' * Loads a variant and checks its palette.', 'comment.block.documentation']],
  [[' */', 'comment.block.documentation']],
  [['import', 'keyword.control'], [' { ', 'punctuation'], ['readFile', 'variable'], [' } ', 'punctuation'],
   ['from', 'keyword.control'], [' ', null], ['"node:fs/promises"', 'string.quoted'], [';', 'punctuation']],
  [],
  [['@Injectable', 'meta.decorator'], ['()', 'punctuation']],
  [['export', 'storage.modifier'], [' ', null], ['class', 'storage.type'], [' ', null],
   ['ThemeLoader', 'entity.name.class'], [' {', 'punctuation']],
  [['  ', null], ['private static readonly', 'storage.modifier'], [' ', null],
   ['MAX_RETRIES', 'variable.other.constant'], [' = ', 'keyword.operator'], ['4', 'constant.numeric'], [';', 'punctuation']],
  [],
  [['  ', null], ['async', 'storage.modifier'], [' ', null], ['load', 'entity.name.function'], ['(', 'punctuation'],
   ['id', 'variable.parameter'], [': ', 'punctuation'], ['string', 'support.type.primitive'], ['): ', 'punctuation'],
   ['Promise', 'entity.name.type'], ['<', 'punctuation'], ['Theme', 'entity.name.type'], ['> {', 'punctuation']],
  [['    ', null], ['// resolve against the themes/ folder', 'comment.line']],
  [['    ', null], ['const', 'storage.type'], [' ', null], ['file', 'variable'], [' = ', 'keyword.operator'],
   ['`themes/', 'string.template'], ['${', 'punctuation.definition.template-expression'], ['id', 'variable'],
   ['}', 'punctuation.definition.template-expression'], ['.json`', 'string.template'], [';', 'punctuation']],
  [['    ', null], ['const', 'storage.type'], [' ', null], ['raw', 'variable'], [' = ', 'keyword.operator'],
   ['await', 'keyword.control'], [' ', null], ['readFile', 'entity.name.function'], ['(', 'punctuation'],
   ['file', 'variable'], [', ', 'punctuation'], ['"utf8"', 'string.quoted'], [');', 'punctuation']],
  [],
  [['    ', null], ['if', 'keyword.control'], [' (', 'punctuation'], ['!', 'keyword.operator'], ['raw', 'variable'],
   [') ', 'punctuation'], ['return', 'keyword.control'], [' ', null], ['null', 'constant.language'], [';', 'punctuation']],
  [['    ', null], ['this', 'variable.language'], ['.', 'punctuation'], ['cache', 'variable.other.property'],
   ['.', 'punctuation'], ['set', 'entity.name.function'], ['(', 'punctuation'], ['id', 'variable'], [', ', 'punctuation'],
   ['JSON', 'support.class'], ['.', 'punctuation'], ['parse', 'entity.name.function'], ['(', 'punctuation'],
   ['raw', 'variable'], ['));', 'punctuation']],
  [['    ', null], ['return', 'keyword.control'], [' ', null], ['this', 'variable.language'], ['.', 'punctuation'],
   ['cache', 'variable.other.property'], ['.', 'punctuation'], ['get', 'entity.name.function'], ['(', 'punctuation'],
   ['id', 'variable'], [') ', 'punctuation'], ['??', 'keyword.operator'], [' ', null],
   ['null', 'constant.language'], [';', 'punctuation']],
  [['  }', 'punctuation']],
  [['}', 'punctuation']],
];

const CSS_SAMPLE = [
  [['/* forge card */', 'comment.block']],
  [['.forge-card', 'entity.other.attribute-name.class.css'], [':hover', 'entity.other.attribute-name.pseudo-class.css'],
   [' {', 'punctuation']],
  [['  ', null], ['color', 'support.type.property-name.css'], [': ', 'punctuation'],
   ['#ff7a33', 'constant.other.color.rgb-value.hex.css'], [';', 'punctuation']],
  [['  ', null], ['padding', 'support.type.property-name.css'], [': ', 'punctuation'], ['12', 'constant.numeric'],
   ['px', 'keyword.other.unit.px.css'], [' ', null], ['16', 'constant.numeric'], ['px', 'keyword.other.unit.px.css'],
   [';', 'punctuation']],
  [['  ', null], ['border', 'support.type.property-name.css'], [': ', 'punctuation'], ['1', 'constant.numeric'],
   ['px', 'keyword.other.unit.px.css'], [' ', null], ['solid', 'support.constant'], [' ', null],
   ['#26c5b5', 'constant.other.color.rgb-value.hex.css'], [';', 'punctuation']],
  [['}', 'punctuation']],
  [],
  [['#sidebar', 'entity.other.attribute-name.id.css'], [' ', null], ['.item', 'entity.other.attribute-name.class.css'],
   [' {', 'punctuation']],
  [['  ', null], ['$gap', 'variable.scss'], [': ', 'punctuation'], ['8', 'constant.numeric'],
   ['px', 'keyword.other.unit.px.css'], [';', 'punctuation']],
  [['  ', null], ['font-weight', 'support.type.property-name.css'], [': ', 'punctuation'],
   ['600', 'constant.numeric'], [';', 'punctuation']],
  [['}', 'punctuation']],
  [],
  [['@media', 'keyword.control.at-rule'], [' (', 'punctuation'], ['min-width', 'support.type.property-name.css'],
   [': ', 'punctuation'], ['48', 'constant.numeric'], ['rem', 'keyword.other.unit.px.css'], [') {', 'punctuation']],
  [['  ', null], ['.forge-card', 'entity.other.attribute-name.class.css'], [' { ', 'punctuation'],
   ['gap', 'support.type.property-name.css'], [': ', 'punctuation'], ['var', 'support.function'], ['(', 'punctuation'],
   ['--gap', 'variable.css'], ['); }', 'punctuation']],
  [['}', 'punctuation']],
];

const SIDEBAR_TREE = [
  ['themes', 'folder'],
  ['  konexforge-dark…', 'active'],
  ['  konexforge-light…', 'file'],
  ['scripts', 'folder'],
  ['  validate-themes.js', 'file'],
  ['  render-preview.js', 'file'],
  ['README.md', 'file'],
  ['package.json', 'file'],
];

// --- resolution -------------------------------------------------------------

const scopesOf = (entry) => (Array.isArray(entry.scope) ? entry.scope : entry.scope == null ? [] : [entry.scope]);

function makeResolver(theme) {
  return (scope) => {
    if (!scope) return { fill: theme.colors['editor.foreground'] };
    let best = null;
    theme.tokenColors.forEach((entry, i) => {
      for (const s of scopesOf(entry)) {
        if (scope !== s && !scope.startsWith(s + '.')) continue;
        if (!best || s.length > best.len || (s.length === best.len && i >= best.i)) {
          best = { len: s.length, i, settings: entry.settings || {} };
        }
      }
    });
    const settings = (best && best.settings) || {};
    return {
      fill: settings.foreground || theme.colors['editor.foreground'],
      italic: /\bitalic\b/.test(settings.fontStyle || ''),
      bold: /\bbold\b/.test(settings.fontStyle || ''),
    };
  };
}

// --- svg helpers ------------------------------------------------------------

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const rect = (x, y, w, h, fill, extra = '') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"${extra}/>`;
const text = (x, y, fill, body, opts = {}) =>
  `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${opts.size || FS}" fill="${fill}"` +
  `${opts.italic ? ' font-style="italic"' : ''}${opts.bold ? ' font-weight="bold"' : ''}` +
  ` xml:space="preserve">${body}</text>`;

function codeBlock(lines, resolve, x, y, gutterFg, activeGutterFg, activeLine) {
  const out = [];
  lines.forEach((line, i) => {
    const ly = y + i * LINE_H;
    const num = String(i + 1).padStart(2, ' ');
    out.push(text(x, ly, i === activeLine ? activeGutterFg : gutterFg, esc(num)));
    if (!line || !line.length) return;
    const spans = line.map(([t, scope]) => {
      const r = resolve(scope);
      const style = `${r.italic ? ' font-style="italic"' : ''}${r.bold ? ' font-weight="bold"' : ''}`;
      return `<tspan fill="${r.fill}"${style}>${esc(t)}</tspan>`;
    }).join('');
    out.push(
      `<text x="${x + 26}" y="${ly}" font-family="${FONT}" font-size="${FS}" xml:space="preserve">${spans}</text>`
    );
  });
  return out.join('\n  ');
}

// SVG `fill` has no 8-digit hex, so any translucent theme value has to be
// composited onto the surface it sits on before it can be drawn.
function flatten(value, base) {
  if (!/^#[0-9A-Fa-f]{8}$/.test(value)) return value;
  const alpha = parseInt(value.slice(7, 9), 16) / 255;
  const ch = (h, i) => parseInt(h.slice(1 + i * 2, 3 + i * 2), 16);
  return '#' + [0, 1, 2]
    .map((i) => Math.round(ch(value, i) * alpha + ch(base, i) * (1 - alpha)))
    .map((v) => v.toString(16).padStart(2, '0').toUpperCase())
    .join('');
}

function render(theme) {
  const c = theme.colors;
  const resolve = makeResolver(theme);
  // `over` is the surface a translucent value composites against.
  const pick = (...keys) => {
    let over = c['editor.background'];
    if (typeof keys[keys.length - 1] === 'object') over = keys.pop().over;
    for (const k of keys) {
      const v = c[k];
      if (/^#[0-9A-Fa-f]{6}$/.test(v || '')) return v;
      if (/^#[0-9A-Fa-f]{8}$/.test(v || '')) return flatten(v, over);
    }
    return c['editor.foreground'];
  };
  const border = pick('contrastBorder', 'editorWidget.border', 'panel.border');
  const bodyY = TITLE_H;
  const bodyH = H - TITLE_H - STATUS_H;
  const parts = [];

  // chrome
  parts.push(rect(0, 0, W, H, c['editor.background']));
  parts.push(rect(0, 0, W, TITLE_H, pick('titleBar.activeBackground')));
  parts.push(text(EDITOR_X, 20, pick('titleBar.activeForeground'), esc('KonexForge-Theme'), { size: 11.5 }));
  parts.push(rect(0, bodyY, ACTIVITY_W, bodyH, pick('activityBar.background')));
  parts.push(rect(ACTIVITY_W, bodyY, SIDEBAR_W, bodyH, pick('sideBar.background')));

  // activity bar glyphs: first one active, rest dimmed
  const actFg = pick('activityBar.foreground');
  const actDim = pick('activityBar.inactiveForeground');
  ['☰', '⌕', '⎇', '⚑'].forEach((glyph, i) => {
    parts.push(text(17, bodyY + 30 + i * 38, i === 0 ? actFg : actDim, glyph, { size: 15 }));
  });
  parts.push(rect(0, bodyY + 14, 2, 26, pick('activityBar.activeBorder', 'activityBar.foreground')));

  // sidebar tree
  parts.push(text(ACTIVITY_W + 14, bodyY + 22, pick('sideBarTitle.foreground', 'sideBar.foreground'),
    esc('EXPLORER'), { size: 10.5 }));
  SIDEBAR_TREE.forEach(([label, kind], i) => {
    const ty = bodyY + 48 + i * 21;
    if (kind === 'active') {
      parts.push(rect(ACTIVITY_W, ty - 13, SIDEBAR_W, 19,
        pick('list.activeSelectionBackground', { over: c['sideBar.background'] })));
    }
    const fill = kind === 'active'
      ? pick('list.activeSelectionForeground', 'sideBar.foreground')
      : pick('sideBar.foreground');
    parts.push(text(ACTIVITY_W + 14, ty, fill, esc(label), { size: 11.5, bold: kind === 'folder' }));
  });

  // tab bar
  parts.push(rect(EDITOR_X, bodyY, W - EDITOR_X, TAB_H, pick('editorGroupHeader.tabsBackground')));
  const tabs = [['loader.ts', true], ['card.css', false], ['README.md', false]];
  let tx = EDITOR_X;
  tabs.forEach(([label, active]) => {
    const tw = label.length * 7.4 + 34;
    parts.push(rect(tx, bodyY, tw, TAB_H, pick(active ? 'tab.activeBackground' : 'tab.inactiveBackground')));
    if (active) parts.push(rect(tx, bodyY, tw, 2, pick('tab.activeBorderTop', 'editorCursor.foreground')));
    parts.push(text(tx + 17, bodyY + 22,
      pick(active ? 'tab.activeForeground' : 'tab.inactiveForeground'), esc(label), { size: 11.5 }));
    tx += tw;
  });

  // code panes
  // Each pane clips its own code so a long line can never bleed into its
  // neighbour.
  const codeY = bodyY + TAB_H + 20;
  const gutter = pick('editorLineNumber.foreground');
  const gutterActive = pick('editorLineNumber.activeForeground');
  parts.push(
    '<defs>' +
    `<clipPath id="pane1"><rect x="${EDITOR_X}" y="${bodyY + TAB_H}" width="${SPLIT_X - EDITOR_X}" height="${bodyH - TAB_H}"/></clipPath>` +
    `<clipPath id="pane2"><rect x="${SPLIT_X + 1}" y="${bodyY + TAB_H}" width="${W - SPLIT_X - 1}" height="${bodyH - TAB_H}"/></clipPath>` +
    '</defs>'
  );
  parts.push(rect(EDITOR_X, codeY - 14 + 11 * LINE_H, SPLIT_X - EDITOR_X, LINE_H,
    pick('editor.lineHighlightBackground', 'editor.background')));
  parts.push('<g clip-path="url(#pane1)">' +
    codeBlock(TS_SAMPLE, resolve, EDITOR_X + 14, codeY, gutter, gutterActive, 11) + '</g>');
  parts.push(rect(SPLIT_X, bodyY + TAB_H, 1, bodyH - TAB_H, border));
  parts.push('<g clip-path="url(#pane2)">' +
    codeBlock(CSS_SAMPLE, resolve, SPLIT_X + 16, codeY, gutter, gutterActive, -1) + '</g>');

  // status bar
  parts.push(rect(0, H - STATUS_H, W, STATUS_H, pick('statusBar.background')));
  const sbFg = pick('statusBar.foreground');
  parts.push(text(14, H - 8, sbFg, esc('⎇ main*'), { size: 11 }));
  parts.push(text(110, H - 8, pick('statusBarItem.errorForeground', 'editorError.foreground'), esc('⊗ 0'), { size: 11 }));
  parts.push(text(146, H - 8, pick('statusBarItem.warningForeground', 'editorWarning.foreground'), esc('⚠ 0'), { size: 11 }));
  parts.push(text(W - 290, H - 8, sbFg, esc('Ln 12, Col 28    Spaces: 2    TypeScript'), { size: 11 }));

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <title>${esc(theme.name)}</title>
  ${parts.join('\n  ')}
</svg>
`;
}

let count = 0;
for (const [name, rel] of Object.entries(VARIANTS)) {
  const theme = JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
  const out = path.join(ROOT, 'images', `preview-${name}.svg`);
  fs.writeFileSync(out, render(theme));
  console.log(`wrote images/preview-${name}.svg  (${theme.name})`);
  count++;
}
console.log(`\n${count} previews written. Rasterize with:`);
for (const name of Object.keys(VARIANTS)) {
  console.log(`  npx --yes @resvg/resvg-js-cli --fit-width ${W} images/preview-${name}.svg images/preview-${name}.png`);
}
