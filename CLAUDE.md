# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A VSCode color theme extension called **KonexForge Themes** — a family of
4 theme variants, no compiled code, no `src/`. It is a pure declarative
JSON theme extension: `package.json` lists 4 entries in `contributes.themes`,
each pointing to its own file under `themes/`:

| Label | `uiTheme` | File |
|---|---|---|
| KonexForge Dark | `vs-dark` | `konexforge-dark-color-theme.json` |
| KonexForge Light | `vs` | `konexforge-light-color-theme.json` |
| KonexForge Dark High Contrast | `hc-black` | `konexforge-dark-hc-color-theme.json` |
| KonexForge Light High Contrast | `hc-light` | `konexforge-light-hc-color-theme.json` |

There is no build step and no `main` entry point.

## Commands

There is no npm/build toolchain in this repo — all commands below are run
via `npx` (no local `node_modules`, no `package-lock.json`).

- **Validate the themes** (do this after any edit to `package.json` or a
  theme file — CI runs the same script on every push/PR):
  ```
  node scripts/validate-themes.js
  ```
  Beyond JSON parsing it enforces the structural rules described below:
  key parity across the 4 files (with the documented HC-only allowlist),
  identical `tokenColors`/`semanticTokenColors` structure, the italic
  allowlist in Dark/Light, no italics and no alpha channels in HC, the
  bracket color sequence, valid hex everywhere, and that the theme paths
  in `package.json` exist.
- **Package into a .vsix**:
  ```
  npx --yes @vscode/vsce package --no-git-tag-version --no-update-package-json
  ```
  Always inspect the "Files included in the VSIX" output — this directory
  also contains an unrelated `.claude/` runtime folder that must stay
  excluded via `.vscodeignore` (it has leaked into a package once before).
- **Install/reinstall locally for a live check**:
  ```
  code --install-extension konexforge-themes-<version>.vsix --force
  ```
  After installing over an existing version, the user must run
  **Developer: Reload Window** in VSCode (via Command Palette) — VSCode does
  not always hot-reload a re-packaged theme otherwise. Note the extension
  was renamed from `konexforge-dark` to `konexforge-themes` in 0.3.0 — this
  changes the extension id (`konexforge.konexforge-dark` →
  `konexforge.konexforge-themes`), so VSCode treats it as a new install, not
  an upgrade; uninstall the old id if it's still present.
- **Rasterize the icon** (only needed if `images/icon.svg` changes):
  ```
  npx --yes @resvg/resvg-js-cli --fit-width 128 --fit-height 128 images/icon.svg images/icon.png
  ```
  Note the CLI's syntax: positional `<input> <output>` args, not `--output`/`-o` flags.
- **Manual visual test**: F5 in VSCode (uses `.vscode/launch.json`) opens an
  Extension Development Host with the theme loaded; select it via
  Command Palette → "Preferences: Color Theme" → "KonexForge Dark".

## Architecture: the theme files

All 4 theme files mirror the exact same key structure (same `colors` keys,
same `tokenColors` scopes, same `semanticTokenColors` token set) — only the
hex values differ per variant. `themes/konexforge-dark-color-theme.json` is
the source of truth for that structure; when adding a new color key, add it
to all 4 files, re-deriving the hex per variant's palette rather than
copy-pasting the Dark value. Each file has three sections:

1. **`colors`** — workbench UI (editor, sidebar, activity bar, status bar,
   tabs, terminal ANSI 16-color set, git decorations, diff editor, bracket
   pair guides, sticky scroll, overview ruler, etc.)
2. **`tokenColors`** — TextMate scope-based syntax highlighting (comments,
   strings, keywords, storage, functions, types, tags, punctuation...)
3. **`semanticTokenColors`** — LSP-based semantic highlighting overrides
   (`semanticHighlighting: true`), which improves accuracy for languages
   with strong language-server support (TS/JS, Python, Rust, Go, C#).

### The "Forge" palette

The design language is: cool charcoal-slate backgrounds (blue-gray
undertone, never pure neutral gray/black) + hot orange/amber/copper/rust
accents, balanced by four cool counterpoint hues (steel blue, slate teal,
violet, green) so syntax categories stay visually distinct. The warm
family is deliberately limited to the "action" tokens — keywords, tags,
storage, functions/methods, and macros — while the "data" tokens are
cool: **strings are green**, **numbers and constants (true/false/null,
`variable.other.constant`, `enumMember`) are steel blue**, types/classes
are slate teal, and decorators/regex/escape-chars/template-`${}` are
violet. Don't move a data token back into the warm family — an earlier
iteration had strings/numbers/constants all amber, and every line of
ordinary code rendered as a wall of orange. Key tokens (reuse these
hexes, don't invent new ones for the same role):

| Role | Hex |
|---|---|
| Editor background | `#14171C` |
| Sidebar/panel/activity bar surface | `#1A1E24` |
| Overlay (menus/hover/suggest) | `#20252C` |
| Primary text | `#E4E1DC` |
| Comment/muted text | `#7C8494` |
| Primary accent (orange) | `#FF7A33` |
| Secondary accent (amber) | `#F5A623` |
| Tertiary accent (copper) | `#C97B4A` |
| Error (ember red) | `#E5484D` |
| Numbers/constants/info (steel blue) | `#47A8E1` |
| Types/classes (slate teal) | `#26C5B5` |
| Decorators/regex/escapes (violet) | `#9367E6` |
| Strings + success/added (green) | `#4BD26D` |

Steel blue, slate teal, violet, and green are deliberately saturated to
read as vividly as the orange/amber heroes (not washed-out pastels) —
when re-deriving a variant's hex for one of these roles, boost saturation
to match, don't just lighten/darken the existing value.

Language-coverage rules (tuned for JS/TS/JSX/TSX, C/C++, PHP, Python,
C#, and validated by simulating TextMate prefix matching):
`variable.language` (`this`, `self`, `super`, `$this`) is **copper
bold** — copper's dedicated token role now that constants moved to
steel blue; the Pylance semantic tokens `selfParameter`/`clsParameter`
match it. Built-in primitive types (`storage.type.built-in` for C/C++,
`keyword.type` for C#) are slate teal like all other types — without
this rule C#'s `int`/`string` would inherit the italic-orange keyword
style. `support.constant`/`support.variable` (built-in objects and
constants: `console`, `window`, `Math.PI`, CSS property values) and the
semantic `builtinConstant` are steel blue. Python decorators
(`entity.name.function.decorator` + `punctuation.definition.decorator`)
join the violet decorator set, and C# `$"{x}"` interpolation braces +
Python f-string placeholders join the violet template-`${}` rule.
`storage.type.function.arrow` (the JS/TS `=>`) is demoted to operator
gray — arrow functions are too frequent in modern JS for rust-orange.

Auxiliary-format rules (same role logic): **YAML mapping keys**
(`entity.name.tag.yaml`) are steel blue, overriding the orange
`entity.name.tag` — a config file full of keys must not become an
orange wall. Diff/patch content maps to the git colors
(`markup.inserted` green, `markup.deleted` red, `markup.changed`
amber, `meta.diff.header` steel blue, `meta.diff.range` violet).
Shell `$VAR` / Ruby `@var` are steel blue; `entity.name.command.shell`
is amber like other callables. Regex internals (char classes,
quantifiers) stay in the violet family with the rest of the regex.
SQL table/database names are teal; `constant.other.enum` is steel
blue. Markdown: `markup.quote` is comment-muted,
`punctuation.definition.heading` matches the orange heading, and
`markup.strikethrough` gets `fontStyle: strikethrough` (no color).

The `colors` section also covers the full workbench surface beyond the
basics: error/warning/info squiggles and problem icons, `textLink.*`,
inlay hints, CodeLens/ghost text, `symbolIcon.*` (mapped to the token
roles: classes teal, functions amber, constants/properties steel blue,
keywords orange, strings green), debug (icons, stack-frame highlights,
`debugTokenExpression.*`), `testing.icon*`, `charts.*`,
`inputValidation.*` (solid pre-blended backgrounds in every variant),
keybinding labels, merge headers, minimap error/warning, notebooks
(`notebook.*` cell borders/backgrounds and `notebookStatus*Icon`
green/red/amber), terminal shell-integration decorations
(`terminalCommandDecoration.*`) and sticky scroll, the diff editor's
collapsed unchanged regions, chat/inline-chat surfaces, `scmGraph.*`
ref colors, `profileBadge.*`, `menubar.selection*`, and marker
navigation. All of these reuse the role hexes above — when adding a
new UI key, pick the role color, don't invent a new hex.

**Markup/template files (HTML, JSX, Blade, Vue, etc.)** get their own
break from the orange/amber family, since a typical line there (a tag,
an attribute name, an attribute-value string) would otherwise be almost
entirely warm-hued with nothing to tell the parts apart:
`entity.other.attribute-name` (attribute/prop names, e.g. `class` in
`<div class="...">`) uses the **info/constants steel blue** accent
instead of amber, and `string.quoted.double.html`/`string.quoted.single.html`
(attribute-*value* strings specifically) use the **types/classes slate
teal** accent instead of the green generic string color — this is a
narrower TextMate scope than the generic `string`/`string.quoted` rule
above, so it wins by specificity without touching how regular code
strings (JS/PHP/Python literals, including ones inside embedded
`{{ ... }}` expressions in Blade) are colored. Net effect: `<div
class="row">` reads as orange (tag) → steel blue (attribute name) → slate
teal (attribute value), and an embedded `{{ __('key') }}` expression
reads as amber function + green string, standing out as code against
the surrounding markup.

`terminal.ansiCyan`/`ansiBrightCyan` and `terminal.ansiMagenta`/
`ansiBrightMagenta` are **standalone true hues** (cyan ~188°, magenta
~310°) — they do not reuse the slate-teal or violet hex. Every other ANSI
slot maps 1:1 onto an existing role color (e.g. `ansiBlue` = the steel
blue accent, `ansiGreen` = the success/added green).

Deliberate style choice: **in Dark and Light**, italics mark the
"annotation layer" of code — things that describe or qualify other code
rather than being the code itself. The exact italic set (identical in both
files; the validate script enforces it):

- `tokenColors` scopes: `comment`/`comment.line`/`comment.block`,
  `comment.block.documentation`, `keyword`/`keyword.control`, the
  word-like operators (`keyword.operator.new`/`.expression`/
  `.logical.python`/`.sizeof`/`.cast` — they read as keywords, not
  punctuation), `entity.other.inherited-class`,
  `entity.other.attribute-name`, `variable.parameter`,
  `meta.decorator`/`punctuation.decorator`/
  `entity.name.function.decorator`/`punctuation.definition.decorator`,
  and `markup.italic` (semantic — it renders Markdown emphasis).
- `semanticTokenColors`: `keyword`, `parameter`, `namespace`, `decorator`,
  `macro`, `*.defaultLibrary`.

Storage, functions, types, strings, and plain variables stay upright so
code remains fast to scan — don't add italics beyond this set without a
specific reason. **Both High Contrast variants drop italics entirely**
(accessibility: italicized glyphs reduce clarity for low-vision users) —
keep the same color distinctions, just set `fontStyle` to normal/unset
wherever Dark/Light use italic.

### Light and High Contrast variants

- **Light** keeps the exact same hue identities as Dark (orange/amber/
  copper accent family), re-derived darker/deeper to hit WCAG AA as text
  on a warm parchment background (`#FAF6ED`) rather than a generic light
  gray — don't lighten the accents back toward the Dark hex values, they'll
  fail contrast.
- **HC-Dark** (`hc-black`) and **HC-Light** (`hc-light`) use flat
  `#000000`/`#FFFFFF` surfaces for every elevation tier (no tonal elevation
  — HC differentiates via borders, not lightness steps) plus a
  `contrastBorder`/`contrastActiveBorder` pair set at the top of `colors`.
  Any alpha-blended fill in Dark/Light (selection, word-highlight, find-match,
  bracket-pair-guide backgrounds, diff fills) becomes a **solid
  pre-blended hex** in both HC files — no translucency, per HC accessibility
  convention that low-vision users need firm boundaries, not subtle tints.
- Deliberate exception to the structure-mirror rule: exactly 7 `colors`
  keys exist **only** in the two HC files, because HC boundaries come from
  borders that Dark/Light intentionally leave unset — `contrastBorder`,
  `contrastActiveBorder`, `list.focusOutline`, `button.border`,
  `notifications.border`, `menu.border`, `menu.selectionBorder`. Don't add
  these to Dark/Light, and don't grow this list without updating both this
  doc and the allowlist in `scripts/validate-themes.js`.

Bracket pair colorization (`editorBracketHighlight.foreground1-6` /
`editorBracketPairGuide.*`) cycles through
orange → amber → steel blue → slate teal → violet → copper, in that order —
keep new bracket-related colors consistent with this sequence.

## Versioning workflow

When bumping the theme version: update `version` in `package.json`, add a
new dated entry at the top of `CHANGELOG.md` (Keep a Changelog format), then
repackage the `.vsix`. Publishing to the Marketplace (`vsce publish`)
requires a personal Azure DevOps token tied to the `konexforge` publisher —
this is a manual, user-driven step, not something to run unprompted. See
`PUBLISHING.md` for the full one-time setup and per-release publish steps.

## Git

Active development happens on the `dev` branch; `main` is the stable branch
tracked by `origin/main`. Push new work to `dev` (`origin/dev`) unless told
otherwise.
