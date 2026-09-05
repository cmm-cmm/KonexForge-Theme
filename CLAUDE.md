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
  bracket color sequence, valid hex everywhere, that the theme paths
  in `package.json` exist, WCAG contrast (AA in Dark/Light, AAA in HC),
  and that README/CLAUDE.md quote no hex the themes have dropped.
  Four checks go past structure into meaning, and all four exist because
  the bug they catch had already shipped:
  - **Scope coverage** — a fixture of real-world scopes (`SCOPE_FIXTURE`),
    each pinned to the role it must resolve to, run through the same
    longest-prefix-wins lookup VSCode uses. Catches a scope silently
    falling through to the editor default, or landing in the wrong role
    family. When you add a language rule, add its scope here too.
  - **Role partition parity** — groups scopes by shared foreground in each
    file and requires all four groupings to be identical. Checks 1-3 prove
    the files share a *structure*; this proves they share a *meaning*, so a
    variant cannot merge two roles Dark keeps apart.
  - **Role budget** — counts accent-colored scopes per role and requires
    warm (orange/amber/copper/red) ≥ 40% with no single role above 25%.
    The two checks above are blind to a drift that happens in all four
    files at once, which is exactly how the palette slid from 50% warm to
    34% between 0.1.0 and 1.0.0. If this check fails, the fix is to find
    which role is hoarding concepts — not to widen the threshold.
  - **Per-language balance** — resolves a hand-weighted corpus of real token
    mixes (`LANG_CORPUS`: TS, SCSS, Python, JSON, YAML, Markdown, HTML) and
    requires each language to land between 12% and 65% warm with no hue
    family above 70%. Check 13 measures the palette as a whole and cannot
    see a single *file type* collapsing into one temperature — at 1.1.0 an
    `.scss` file was 77% warm across two families while `.json` and `.yaml`
    contained no warm token at all. Add a language here when you add rules
    for one.
- **Regenerate the previews** (after any palette change — the README images
  are rendered from the theme files, so a stale one is a visible lie):
  ```
  node scripts/render-preview.js
  npx --yes @resvg/resvg-js-cli --fit-width 980 images/preview-dark.svg images/preview-dark.png
  ```
  Repeat the rasterize step for `light`, `dark-hc`, `light-hc`. The SVG is
  the source; the PNG is what README and the Marketplace embed (the
  Marketplace blocks SVG and needs absolute `raw.githubusercontent.com`
  URLs, which is why README links there rather than using relative paths).
- **Package into a .vsix**:
  ```
  npx --yes @vscode/vsce package --no-git-tag-version --no-update-package-json
  ```
  Always inspect the "Files included in the VSIX" output — this directory
  also contains an unrelated `.claude/` runtime folder that must stay
  excluded via `.vscodeignore` (it has leaked into a package once before).
- **Check what would ship** (CI runs this on every push/PR, so the leak
  above cannot recur silently):
  ```
  npx --yes @vscode/vsce ls | node scripts/check-package.js
  ```
  It compares the packaged file list against an allowlist in the script —
  an allowlist, because a denylist silently ships whatever it forgot to
  name. If a file is added or removed on purpose, update `EXPECTED` there.
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
undertone, never pure neutral gray/black) + hot orange/amber/copper
accents, balanced by four cool counterpoint hues (steel blue, slate teal,
violet, green) so syntax categories stay visually distinct. The warm
family covers the "action" tokens — keywords, tags, storage,
functions/methods, macros — plus, in copper, the "member/slot" tokens
that name a place rather than hold a value (`this`, `.property`, object
and config keys), and in rose the operators. The **literal** tokens stay cool: **strings are
green**, **numbers and constants (true/false/null,
`variable.other.constant`, `enumMember`) are steel blue**, types/classes
are slate teal, and decorators/regex/escape-chars/template-`${}` are
violet. Don't move a *literal* back into the warm family — an earlier
iteration had strings/numbers/constants all amber, and every line of
ordinary code rendered as a wall of orange. The opposite failure is just
as real and happened later: by 1.0.0 steel blue had crept over members,
keys and CSS values until only 34% of colored scopes were warm and the
theme no longer read as a warm theme at all. Both edges are now measured
(checks 13 and 14). Key tokens (reuse these hexes, don't invent new ones for the
same role):

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
| Error + error path (ember red) | `#E5484D` |
| Operators (rose) | `#DF4E99` |
| Numbers/constants/info (steel blue) | `#5DA7D5` |
| Types/classes (slate teal) | `#53C1B3` |
| Decorators/regex/escapes (violet) | `#906FD5` |
| Strings + success/added (green) | `#67CD7C` |

The warm accents are the heroes and the four cool accents are support:
in Dark and Light the cool four sit at ~82% of the chroma they'd otherwise
have (same hue, same lightness), so orange and amber are the loudest
colors on screen. This **reverses** the 0.4.0 decision to boost the cool
accents until they read as vividly as the heroes — with no chroma
hierarchy, every color shouted at once and the theme stopped looking like
a warm theme. When re-deriving one of these for a variant, work in OKLCH:
keep hue, scale chroma, and only move lightness if the contrast floor
needs it. **Both HC files keep full chroma** — HC exists to maximise
distinguishability for low-vision users, and washing out its hues works
against that, the same reasoning that made HC drop italics.

**Role budget.** Warm roles (orange, amber, copper, red) must cover at
least 40% of the accent-colored `tokenColors` scopes, and no single role
may exceed 25%. Validator check 13 enforces both. This exists because the
palette drifted from 50% warm at 0.1.0 to 34% at 1.0.0 with every
structural check passing the whole way: steel blue kept absorbing new
concepts (properties, object keys, CSS values, shell variables) until it
carried more scopes than orange and amber combined, and a drift that
happens in all four files at once is perfectly consistent. Before adding
a rule, ask which existing role it belongs to — if the answer is "blue,
like everything else", that's the smell.

Between the comment color and the primary text there is a **four-step
neutral ramp**, and every variant must have all four steps — Light and
both HC files once collapsed them into a single gray, which made doc
comments, punctuation, operators and function parameters indistinguishable
(validator check 12 exists to stop that recurring):

| Step | Dark | Used for |
|---|---|---|
| comment | `#7C8494` | `comment`, `meta.separator` |
| doc comment | `#8891A3` | `comment.block.documentation` |
| punctuation | `#ABB3C0` | `punctuation`, `storage.type.function.arrow` |
| parameter | `#C9CDD6` | `variable.parameter`, semantic `parameter` |
| text | `#E4E1DC` | everything unstyled |

When re-deriving the ramp for another variant, place the three middle
steps at the same *luminance fractions* along that variant's own
comment→text range (0.10 / 0.41 / 0.72) rather than picking values by eye.
Because both endpoints already clear their contrast threshold and
luminance moves monotonically between them, every intermediate step clears
it too.

Language-coverage rules (tuned for JS/TS/JSX/TSX, C/C++, PHP, Python,
C#, and validated by simulating TextMate prefix matching):
`storage`/`storage.type`/`storage.modifier` (`const`, `let`, `class`,
`function`, `public`) share the **primary orange** with `keyword` — they
used to have their own rust hex, but two near-identical oranges read as
one muddy color rather than a hero, and italic already separates them
(`keyword` is italic, `storage` is not). Don't reintroduce a second
orange.

Copper is the **member/slot** role: `variable.language` (`this`, `self`,
`super`, `$this`) is copper **bold**, and copper regular covers object
and struct members (`variable.other.member`, `variable.other.property`),
unquoted object-literal keys (`meta.object-literal.key`, matching the
semantic `property` role), **JSON keys** (`support.type.property-name`)
and **YAML keys** (`entity.name.tag.yaml`), shell `$VAR` and Ruby `@var`,
plus the SCSS variables below. Bold is what keeps `this` apart from `.property`. These
moved off steel blue in 1.1.0: property access is the densest token in
ordinary JS/TS, so parking it on a cool hue is most of what made the
theme stop looking warm. The Pylance semantic tokens
`selfParameter`/`clsParameter` match `variable.language`.

**Rose** (`keyword.operator` plus the semantic `operator`) is the theme's
only high-frequency, low-mass role: an operator appears on nearly every
line of code but occupies one to three characters, so it adds a hue to
every file without ever being able to dominate one. It moved out of the
neutral punctuation step in 1.2.0 for exactly that reason. The word-like
operators (`new`, `in`, `instanceof`, `sizeof`, casts, Python's `not`)
stay italic orange — they read as keywords, not punctuation — and
`storage.type.function.arrow` stays punctuation gray.

**The error path** (`keyword.control.trycatch`, `keyword.control.exception`)
takes the ember red already used for errors and deletions, italic like
every other control keyword. It is deliberately narrow. A wider "control
flow jump" role covering `return`/`break`/`continue` **is not portable**
and must not be attempted through TextMate scopes: TypeScript splits
`keyword.control` into `.flow`, `.loop`, `.conditional`, `.trycatch` and
`.import`, but MagicPython folds `if`, `else`, `elif`, `for`, `break`,
`continue`, `except` and `finally` into a single
`keyword.control.flow.python`. Colouring that scope would give Python and
TypeScript visibly different keyword schemes, which is the one thing the
four-variant hue language exists to prevent. Python therefore keeps plain
orange on `try`/`except`; that gap is intentional, not an oversight.

Built-in primitive types (`storage.type.built-in` for C/C++,
`keyword.type` for C#) are slate teal like all other types — without
this rule C#'s `int`/`string` would inherit the italic-orange keyword
style. `support.constant`/`support.variable` (built-in objects and
constants: `console`, `window`, `Math.PI`, CSS property values) and the
semantic `builtinConstant` are steel blue. Python decorators
(`entity.name.function.decorator` + `punctuation.definition.decorator`)
join the violet decorator set, and C# `$"{x}"` interpolation braces +
Python f-string placeholders join the violet template-`${}` rule.
`storage.type.function.arrow` (the JS/TS `=>`) is demoted to operator
gray — arrow functions are too frequent in modern JS for the hero orange.
TypeScript's `support.type.primitive` (and the generic `support.type`)
is slate teal, completing the built-in-type rule the C/C++ and C# entries
already had. Java/Kotlin annotations
(`storage.type.annotation`) are **violet**, not `storage.type` orange:
`@Override` is the same kind of token as a Python or TypeScript
decorator and belongs in the same family. Rust lifetimes
(`storage.modifier.lifetime`, `entity.name.lifetime`) are copper with
`variable.language`; namespaces/packages/modules (`entity.name.namespace`)
are violet, matching the semantic `namespace`; `entity.name.label` is
copper, matching the semantic `label`.

**CSS/SCSS/LESS** needs its own carve-out because the generic rules land
badly there. Class, id and pseudo-class selectors
(`entity.other.attribute-name.class.css` and siblings) are **amber with
`fontStyle` explicitly cleared** — they otherwise inherit the steel-blue
italic meant for HTML attribute names, and a selector is not part of the
annotation layer. Units (`keyword.other.unit`) are copper, not the italic
orange they'd inherit from `keyword` — a unit is the warm suffix on a
steel-blue number. SCSS/LESS variables (`variable.scss`,
`variable.other.less`, `variable.css`) are copper as well, being
variables rather than literals; color literals (`constant.other.color`)
stay steel blue, being literals. Property names are **slate teal** via a
narrow `support.type.property-name.css`/`.scss`/`.less` rule — they are
names from a fixed built-in vocabulary, exactly what the teal type family
is for, and putting them on a warm hue next to amber selectors is what
made a `.scss` file 77% warm across only two hue families at 1.1.0. The
generic `support.type.property-name`, which covers **JSON keys**, is
copper instead. 1.1.0 kept those blue for fear of a copper wall; check 14
then showed `.json` and `.yaml` had no warm token at all, so the wall was
already there, merely cool. Fixture entries pin both halves so neither
drifts. The generic `support.type` teal must never win over either.

**Markdown** structure: list bullets
(`punctuation.definition.list.begin`) are amber, the fence's language tag
(`fenced_code.block.language`) is teal, `meta.separator` (the `---` rule)
is comment-muted, and `markup.list` / `markup.fenced_code` are pinned to
the primary text color so block content is never left at the editor
default.

Auxiliary-format rules (same role logic): **YAML mapping keys**
(`entity.name.tag.yaml`) are copper, overriding the orange
`entity.name.tag` — copper is the member/slot role and a key is a slot
name; the orange would still be too loud for a file that is mostly keys. Diff/patch content maps to the git colors
(`markup.inserted` green, `markup.deleted` red, `markup.changed`
amber, `meta.diff.header` steel blue, `meta.diff.range` violet).
Shell `$VAR` / Ruby `@var` are copper with the member/slot
family; `entity.name.command.shell`
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
navigation. Also themed: the debug console
(`debugConsole.*`, `debugExceptionWidget.*`, `debugView.*`), the
three-way merge editor (`mergeEditor.*` — green for incoming change, red
for the base, amber/orange borders for unhandled conflicts and green for
handled), comment threads (`commentsView.*`, `editorCommentsWidget.*`,
`editorGutter.comment*`), `multiDiffEditor.*`, and the testing surface's
peek/message/coverage keys. All of these reuse the role hexes above —
when adding a new UI key, pick the role color, don't invent a new hex.

Five **root-level fallback keys** carry the rest of the workbench:
`foreground`, `descriptionForeground`, `errorForeground`,
`disabledForeground` and `selection.background` (alongside `focusBorder`).
VSCode falls back to these for every surface a theme doesn't name, so they
cover the long tail of widgets without enumerating each one — set them
before reaching for a new specific key.

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
