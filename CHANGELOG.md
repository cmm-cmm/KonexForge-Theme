# Changelog

All notable changes to the "KonexForge Dark" theme will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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
