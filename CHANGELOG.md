# Changelog

All notable changes to the "KonexForge Themes" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.3.1] - 2026-07-07

### Added

- `editorStickyScroll.shadow` to both High Contrast variants (solid
  `contrastBorder` color, no alpha) — the one key Dark/Light had that the
  HC files were missing, restoring key parity across the family.
- A structural validator (`scripts/validate-themes.js`) and a GitHub
  Actions workflow that runs it on every push and pull request. It
  enforces key parity across the 4 variants, the italic allowlist in
  Dark/Light, the no-italics/no-alpha rules in both High Contrast
  variants, the bracket color sequence, and valid hex values. Repo
  infrastructure only — no visual change beyond the sticky-scroll shadow
  above.

## [0.3.0] - 2026-07-07

### Changed

- Renamed the extension from "KonexForge Dark" to **KonexForge Themes**
  (package name `konexforge-themes`) to reflect that it now ships a full
  theme family rather than a single dark theme.

### Added

- **KonexForge Light** theme (`uiTheme: "vs"`) — same orange/amber/copper/
  rust "hot metal" accent identity as Dark, re-derived for AA contrast
  against a warm parchment/stone background instead of a generic light gray.
- **KonexForge Dark High Contrast** theme (`uiTheme: "hc-black"`) —
  near-black base, brightened accents, `contrastBorder`/
  `contrastActiveBorder` on focus-relevant widgets, solid (non-alpha)
  fills throughout per HC accessibility conventions, no italics.
- **KonexForge Light High Contrast** theme (`uiTheme: "hc-light"`) —
  near-white base, deepened accents tuned toward AAA contrast, same
  solid-fill/contrastBorder treatment as the Dark High Contrast variant,
  no italics.
- The theme family now shares one hue language across all four variants,
  so Dark, Light, Dark High Contrast, and Light High Contrast all read as
  siblings.

## [0.2.0] - 2026-07-07

### Added

- Multi-color bracket pair colorization (`editorBracketHighlight.*` /
  `editorBracketPairGuide.*`) cycling through the orange → amber → steel
  blue → slate teal → violet → copper hue sequence.
- Sticky scroll styling (`editorStickyScroll.*`) matching the elevated
  panel surface.
- Overview ruler colors for errors, warnings, info, find matches, and git
  gutter markers, plus a subtle selection-highlight border and cursor
  glow for better at-a-glance navigation.
- Light bulb (quick fix) and folding control colors.
- Deeper `semanticTokenColors` coverage: `struct`, `enum`, `event`,
  `label`, `keyword`, `number`, `string`, `operator`, `regexp`, and the
  `*.defaultLibrary` / `*.static` / `*.deprecated` modifiers — improves
  accuracy for Rust, Go, C#, and Python in particular.

## [0.1.0] - 2026-07-07

### Added

- Initial release of KonexForge Dark.
- Full workbench theming with the "forge" palette (charcoal-slate base,
  orange/amber/copper accents, steel-blue/slate-teal/violet counterpoints).
- Syntax highlighting via `tokenColors` and `semanticTokenColors`.
