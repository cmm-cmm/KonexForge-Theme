# Changelog

All notable changes to the "KonexForge Themes" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.8.1] - 2026-07-26

### Fixed

- Six colors that fell short of their contrast target, nudged minimally
  with hue and saturation held constant:
  - Dark's violet `#8F61E5` → `#9367E6` (4.28:1 → 4.55:1) and Light's teal
    `#158475` → `#147E70` (4.24:1 → 4.58:1), both now clearing WCAG AA;
    Light High Contrast's green `#1B6A30` → `#1A652E` (6.66:1 → 7.13:1),
    now clearing AAA. Applied everywhere each role hex appears so the
    palette stays coherent.
  - The de-emphasized chrome color used by inactive tabs, line numbers,
    breadcrumbs and `ansiBrightBlack`: Dark `#4A5261` → `#5F6A7D`
    (2.13:1 → 3.06:1) and Light `#B5AA8E` → `#90825F` (1.86:1 → 3.05:1).
    Light's line numbers in particular were effectively unreadable.
  - The `invalid` scope's text on its red badge: Light `#241605` →
    `#FAF6ED` (2.99:1 → 5.46:1), Dark High Contrast `#1A1105` →
    `#000000` (6.46:1 → 7.28:1).
- `README.md` advertised `#45B8AC` as the type/class accent — a value the
  themes stopped using in 0.4.0. Anyone pasting it into
  `workbench.colorCustomizations` got the pre-0.4.0 washed-out teal. The
  Customization section now lists all 13 role colors with what each one is
  used for, the install snippet no longer pins 0.3.0, the italic
  description matches the actual italic set, and the stale "screenshots
  coming soon" placeholder is replaced with a description of the
  warm-action / cool-data split the theme actually uses.

### Added

- Two validator checks, both covering classes of drift that had already
  happened at least once:
  - **Contrast.** Every opaque `tokenColors` / `semanticTokenColors`
    foreground and 15 primary UI label/surface pairs must hit WCAG AA
    (4.5:1) in Dark/Light and AAA (7:1) in the High Contrast variants;
    five deliberately dim chrome pairs must clear the 3:1 floor WCAG uses
    for UI components. Entries that paint their own background are
    measured against it. Translucent values are skipped rather than
    guessed at.
  - **Documented hexes.** Every `#RRGGBB` quoted in `README.md` or
    `CLAUDE.md` must still be a live value in at least one theme file.

## [0.8.0] - 2026-07-18

### Added

- Full workbench UI coverage (+104 `colors` keys per variant, identical
  key set across all 4): error/warning/info squiggles and problem
  icons, `textLink.*`/`editorLink.*`, inlay hints, CodeLens and ghost
  text, `symbolIcon.*` mapped to the token roles, debug (icons,
  stack-frame highlights, `debugTokenExpression.*`), `testing.icon*`,
  `charts.*`, `inputValidation.*`, keybinding labels, banner, text
  block/code-block styling, merge conflict headers, minimap
  error/warning/find-match, marker navigation, and assorted
  high-visibility keys. All values reuse each variant's existing role
  hexes; every translucent value is pre-blended to a solid hex in the
  two High Contrast variants.
- Syntax rules for auxiliary formats: YAML mapping keys → steel blue
  (they previously drowned in the same orange as HTML tags);
  diff/patch files → green inserted / red deleted / amber changed with
  steel-blue headers and violet hunk ranges (previously entirely
  unstyled); shell `$VAR` and Ruby `@var` → steel blue;
  `entity.name.command.shell` → amber; SQL table/database names →
  teal; `constant.other.enum` → steel blue; regex character classes
  and quantifiers → violet (unifying the regex family); Markdown
  blockquotes → comment gray, heading `#` markers → heading orange,
  and `~~strikethrough~~` now actually renders struck through.

## [0.7.0] - 2026-07-18

### Added

- Language-coverage pass for JS/TS/JSX/TSX, C/C++, PHP, Python, and C#
  (all 4 variants), fixing scopes those grammars emit that previously
  fell through to generic rules:
  - `variable.language` (`this`, `self`, `super`, `$this`) — copper
    bold, previously indistinguishable from plain variables. Includes
    Pylance's `selfParameter`/`clsParameter` semantic tokens.
  - Word-like operators (`new`, `typeof`/`keyof`/`instanceof`,
    `sizeof`, casts, Python `and`/`or`/`not`) — keyword orange/italic,
    previously gray like punctuation.
  - Built-in primitive types (`storage.type.built-in` for C/C++,
    `keyword.type` for C#) — slate teal; C#'s `int`/`string`/`bool`
    previously rendered italic-orange like keywords.
  - `support.constant`/`support.variable` (`console`, `window`,
    `Math.PI`, CSS property values) and semantic `builtinConstant` —
    steel blue, previously unstyled.
  - Python decorators (`entity.name.function.decorator` +
    `punctuation.definition.decorator`) — violet, previously amber/gray.
  - C# `$"{x}"` interpolation braces and Python f-string placeholders —
    violet, joining the template-`${}` rule.

### Changed

- JS/TS arrow `=>` (`storage.type.function.arrow`) demoted from rust
  orange to operator gray — too frequent in modern JS to sit in the
  warm family.

## [0.6.0] - 2026-07-18

### Changed

- Rebalanced the warm/cool split in syntax highlighting so ordinary code
  no longer renders as a wall of orange/amber. The warm family is now
  limited to "action" tokens (keywords, tags, storage, functions/methods,
  macros); high-frequency "data" tokens moved to cool hues in all 4
  variants: **strings → green**, **numbers and constants**
  (`constant.numeric`, `true`/`false`/`null`, `variable.other.constant`,
  `enumMember`, `variable.readonly`) **→ steel blue** — finally matching
  the "Info/constants (steel blue)" role the palette had documented all
  along — and **escape characters + template-`${}` punctuation →
  violet**, consistent with regex/decorators.
- Darkened the Light variant's green role (`#228740` → `#1C7838`,
  contrast 4.23 → 5.13 against the parchment background) since strings
  now use it as body text; applied everywhere the role appears (git
  added, diff inserted, `ansiGreen`).

## [0.5.0] - 2026-07-17

### Added

- Dedicated coloring for markup/template files (HTML, JSX, Blade, Vue,
  etc.): attribute/prop names (`entity.other.attribute-name`, e.g. `class`
  in `<div class="...">`) now use the steel blue accent instead of amber,
  and attribute-*value* strings specifically (`string.quoted.double.html`/
  `string.quoted.single.html`) use the slate teal accent instead of the
  generic warm string color. Previously a typical markup line (tag,
  attribute name, attribute value, plus any embedded `{{ ... }}`
  expression) rendered almost entirely in orange/amber, making it hard to
  tell those parts apart. Regular code strings (JS/PHP/Python literals,
  including inside embedded template expressions) are unaffected — this
  only targets the narrower HTML attribute-value string scope, which wins
  over the generic `string` rule by TextMate specificity.

## [0.4.0] - 2026-07-16

### Changed

- Boosted the saturation of the cool counterpoint accents — steel blue,
  slate teal, violet — and the green used for git/diff/`ansiGreen`,
  across all 4 variants. They previously sat well below the
  saturation of the orange/amber "hero" accents (e.g. Dark's steel blue
  was 57% saturated vs. amber's 91%), so they read as washed out even
  though the hues were already present. Re-derived per variant, keeping
  each file's own hue and re-verified against its background for
  contrast at or above what the existing accents already achieved.
- `terminal.ansiCyan`/`ansiBrightCyan` and `terminal.ansiMagenta`/
  `ansiBrightMagenta` are now standalone true cyan (~188°) and magenta
  (~310°) hues instead of reusing the slate-teal/violet hex verbatim —
  the previous values weren't actually cyan or magenta by hue (closer to
  174°/261°), so terminal color output for those two ANSI slots looked
  like duller repeats of the class/decorator syntax colors.

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
