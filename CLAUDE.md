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

- **Validate JSON** (do this after any edit to `package.json` or a theme file):
  ```
  node -e "['package.json','themes/konexforge-dark-color-theme.json','themes/konexforge-light-color-theme.json','themes/konexforge-dark-hc-color-theme.json','themes/konexforge-light-hc-color-theme.json'].forEach(f=>{JSON.parse(require('fs').readFileSync(f,'utf8'));console.log(f,'OK')})"
  ```
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
accents, with three cool counterpoint hues (steel blue, slate teal, violet)
reserved for types/constants/decorators so syntax categories stay visually
distinct from the orange/amber "hero" accents. Key tokens (reuse these
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
| Info/constants (steel blue) | `#5FA8D3` |
| Types/classes (slate teal) | `#45B8AC` |
| Decorators/regex (violet) | `#9D7CD8` |

Deliberate style choice: only `comment` and `keyword`/`control-flow` scopes
are italic **in Dark and Light**. Storage, functions, types, and variables
stay upright so code remains fast to scan — don't add italics elsewhere
without a specific reason. **Both High Contrast variants drop italics
entirely** (accessibility: italicized glyphs reduce clarity for low-vision
users) — keep the same color distinctions, just set `fontStyle` to normal/
unset wherever Dark/Light use italic.

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

Bracket pair colorization (`editorBracketHighlight.foreground1-6` /
`editorBracketPairGuide.*`) cycles through
orange → amber → steel blue → slate teal → violet → copper, in that order —
keep new bracket-related colors consistent with this sequence.

## Versioning workflow

When bumping the theme version: update `version` in `package.json`, add a
new dated entry at the top of `CHANGELOG.md` (Keep a Changelog format), then
repackage the `.vsix`. Publishing to the Marketplace (`vsce publish`)
requires a personal Azure DevOps token tied to the `konexforge` publisher —
this is a manual, user-driven step, not something to run unprompted.

## Git

Active development happens on the `dev` branch; `main` is the stable branch
tracked by `origin/main`. Push new work to `dev` (`origin/dev`) unless told
otherwise.
