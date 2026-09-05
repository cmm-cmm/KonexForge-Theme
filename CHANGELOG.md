# Changelog

All notable changes to the "KonexForge Themes" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.2.0] - 2026-09-05

1.1.0 fixed the palette's overall warm/cool balance but measured it only in
aggregate. Measuring it *per file type* showed the balance had simply moved:
an `.scss` file was 77% warm across two hue families, while `.json` and
`.yaml` files contained no warm token at all. Individual files still read as
one temperature, hot or cold.

### Added

- **Rose (`#DF4E99` on Dark) for operators** — `keyword.operator` and the
  semantic `operator` leave the neutral punctuation step. An operator appears
  on nearly every line but occupies one to three characters, so it adds a hue
  to every file without being able to dominate one. The word-like operators
  (`new`, `in`, `instanceof`, `sizeof`, casts, Python's `not`) stay italic
  orange, and the JS/TS `=>` stays punctuation gray.
- **Ember red on the error path** — `keyword.control.trycatch` and
  `keyword.control.exception`, italic like every other control keyword.
  Deliberately narrow: a wider "control-flow jump" role covering
  `return`/`break`/`continue` is not portable, because TypeScript splits
  `keyword.control` into `.flow`/`.loop`/`.conditional`/`.trycatch` while
  MagicPython folds `if`, `else`, `for`, `break`, `except` and `finally` into
  a single `keyword.control.flow.python`. Python keeps plain orange on
  `try`/`except`; that gap is intentional and documented.
- **Validator check 14 — per-language balance.** Resolves a hand-weighted
  corpus of real token mixes for TypeScript, SCSS, Python, JSON, YAML,
  Markdown and HTML, and requires each to land between 12% and 65% warm with
  no hue family above 70%. Check 13 measures the palette as a whole and is
  blind to a single file type collapsing. Verified to fail on the 1.1.0
  palette for SCSS, JSON and YAML.

### Changed

- **CSS/SCSS property names move from copper to slate teal.** They are names
  from a fixed built-in vocabulary — what the teal type family is for — and
  sitting them on a warm hue beside amber selectors is what made an `.scss`
  file 77% warm. SCSS is now 45% warm across three families.
- **JSON and YAML keys move from steel blue to copper**, joining the
  member/slot role that already held JS object-literal keys. This reverses a
  1.1.0 note that warned such a move would make every `.json` file a wall of
  copper; the measurement showed the wall already existed and was merely
  cool. JSON goes 0% → 54% warm, YAML 0% → 42%.

### Result

Every targeted language now lands between 17% and 59% warm with at least
three hue families present, against a 0–77% spread before:

| | 1.1.0 | 1.2.0 |
|---|---|---|
| SCSS | 77% warm, 2 families | 45% warm, 3 families |
| JSON | 0% warm, 2 families | 54% warm, 3 families |
| YAML | 0% warm, 2 families | 42% warm, 3 families |
| TypeScript | 60% warm, 5 families | 58% warm, 6 families |
| Python | 47% warm, 5 families | 47% warm, 5 families |

## [1.1.0] - 2026-08-02

The palette had been drifting cool for several releases without anything
catching it. Measured on the Dark theme, warm roles covered 50% of the
colored syntax scopes at 0.1.0 and only 34% at 1.0.0, while steel blue grew
to carry more scopes than orange and amber combined. Every structural check
passed the whole way, because all four variants drifted together. This
release reverses the drift and adds the measurement that would have caught
it.

### Changed

- **`storage` (`const`, `let`, `class`, `function`, `public`) now shares the
  primary orange with `keyword`**, instead of having its own near-identical
  rust hex. Two slightly different oranges read as one muddy color rather
  than a hero; italic already distinguishes them (`keyword` is italic,
  `storage` is not). In a typical TypeScript file this consolidates ~20% of
  all glyphs onto a single accent.
- **Steel blue is back to carrying literals only.** Properties and members,
  object-literal keys, CSS property names, units (`px`/`rem`), SCSS/LESS
  variables, and shell/Ruby variables moved to copper, which is now the
  "member/slot" role alongside `this`/`self` (kept distinct by its bold
  weight). Numbers, booleans, `null`, constants, enum members, color
  literals, JSON/YAML keys and HTML attribute names stay steel blue.
  Property access is the densest token in ordinary JS/TS, so parking it on a
  cool hue was most of what made the theme stop looking warm.
- **The four cool accents sit ~18% lower in chroma in Dark and Light**, at
  the same hue and lightness, establishing a hero/support hierarchy instead
  of every color shouting at once. This reverses the 0.4.0 decision to boost
  them until they read as vividly as orange and amber. **Both High Contrast
  variants keep full chroma** — HC exists to maximise distinguishability for
  low-vision users, the same reasoning that made HC drop italics.
- Net effect: warm roles now cover 48.4% of colored syntax scopes in all four
  variants, and no single role exceeds 21%. In the rendered CSS preview,
  steel blue fell from 51% of glyphs to 17%.

### Added

- **Validator check 13 — role budget.** Counts accent-colored scopes per role
  and requires warm (orange/amber/copper/red) ≥ 40% with no single role above
  25%. Checks 11 and 12 pin individual scopes and prove the variants agree
  with each other; neither can see the palette as a whole sliding, which is
  what happened here. Verified to fail on the 1.0.0 palette.
- A narrow `support.type.property-name.css`/`.scss`/`.less` rule, so CSS
  property names can be copper while the generic scope — which also covers
  JSON keys — stays steel blue. Both halves are pinned by fixture entries.

## [1.0.0] - 2026-07-26

### Fixed

- **Light and both High Contrast variants had collapsed Dark's neutral ramp
  into a single gray.** Doc comments, punctuation, operators, the JS/TS `=>`
  and function parameters all rendered in one identical color, flattening
  distinctions Dark makes. All three variants now carry the same four steps
  as Dark, placed at matching luminance fractions along each variant's own
  comment→text range.
- CSS/SCSS syntax, which the generic rules had been mis-coloring:
  - `.class` / `#id` / pseudo-class selectors inherited the steel-blue
    *italic* meant for HTML attribute names — a selector is not part of the
    annotation layer. Now amber, upright.
  - `px` / `rem` / `%` units inherited the italic orange of `keyword`. Now
    steel blue, with the number they follow.
  - Hex and `rgb()` color literals fell through to the editor default. Now
    steel blue.
  - SCSS `$vars` and CSS custom properties rendered as plain text. Now steel
    blue.
- Java/Kotlin annotations (`@Override`) sat with `storage.type` in rust
  orange instead of the violet decorator family used for Python and
  TypeScript decorators.
- TypeScript's `support.type.primitive` was left at the editor default,
  though the equivalent C/C++ and C# built-in-type rules already existed.
  Now slate teal like every other type.

### Added

- Syntax coverage for scopes that were still falling through to the editor
  default: Markdown list bullets, fenced-code blocks and their language tag,
  and `---` separators; Rust lifetimes; namespaces/packages/modules; labels;
  object and struct members and unquoted object-literal keys.
- The five root-level fallback keys — `foreground`, `descriptionForeground`,
  `errorForeground`, `disabledForeground`, `selection.background` — which
  VSCode uses for every surface a theme doesn't name explicitly. Only
  `focusBorder` had been set before, leaving the long tail of widgets on
  VSCode's own gray palette.
- Workbench surfaces still on defaults (+87 `colors` keys per variant, 474
  total, 481 in the HC files): the debug console and exception widget, the
  three-way merge editor, comment threads and their gutter glyphs, the
  multi-file diff editor, testing peek/message/coverage, notebook
  scrollbars, extension-view icons, the terminal overview ruler, and
  assorted tree/table/chat keys.
- Two validator checks, each closing the gap that let the bugs above ship:
  - **Scope coverage** — 39 real-world scopes pinned to the role they must
    resolve to, run through the same longest-prefix-wins lookup VSCode
    uses. Fails if a scope reaches the editor default or lands in the wrong
    role family.
  - **Role partition parity** — groups scopes by shared foreground per file
    and requires all four groupings to match. The previous checks compared
    structure only, so a variant merging two roles was invisible.
- `scripts/render-preview.js`, which renders a preview image per variant
  from the theme files themselves, resolving every token through that same
  scope lookup. README now shows all four; they cannot drift from the
  themes the way a hand-taken screenshot does.
- A CI job that packages the extension and asserts the VSIX file list, so
  development-only directories can't leak into a release again.

## [0.9.0] - 2026-07-26

### Added

- Coverage pass over the workbench surfaces that were still falling back
  to VSCode's defaults (+78 `colors` keys per variant, identical key set
  across all 4, every translucent value pre-blended to a solid hex in the
  two High Contrast files):
  - **Notebooks** (`notebook.*`, `notebookStatus*Icon.foreground`) — the
    whole Jupyter surface was unthemed, so cell borders, the output
    container, selected/hovered cells and the run-status icons used
    default colors against a forge background. Focused cell and editor
    borders are the orange focus accent; success/error/running icons are
    the green/red/amber role colors.
  - **Terminal** — shell-integration command decorations
    (`terminalCommandDecoration.*`, the pass/fail dots in the gutter) now
    use the green/red/muted roles instead of VSCode's stock blue-red;
    plus `terminal.border`, find-match highlighting and sticky scroll.
  - **Diff editor** — the collapsed unchanged regions introduced with the
    new diff view (`diffEditor.unchangedRegion*`, `unchangedCodeBackground`,
    `diagonalFill`).
  - **Chat / inline chat** (`chat.*`, `inlineChat*`) and **Source Control
    Graph** (`scmGraph.*` ref colors, `scm.historyItem*`).
  - Assorted gaps: `list.filterMatch*`/`deemphasizedForeground`/
    `dropBackground`, `menubar.selection*`, `peekViewResult.file`/
    `lineForeground`, `window.active`/`inactiveBorder`,
    `statusBarItem.hoverForeground`/`focusBorder`/`prominent*`,
    `tab.dragAndDropBorder`/`lastPinnedBorder`/`unfocusedActiveForeground`,
    `editor.hoverHighlightBackground`/`symbolHighlightBackground`,
    `search.resultsInfoForeground`, `editorSuggestWidget.focusHighlightForeground`,
    `gitDecoration.stage*`, `profileBadge.*`, `ports.iconRunningProcessForeground`,
    `editorWatermark.foreground`.

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
