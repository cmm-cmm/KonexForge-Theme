# KonexForge Themes

**Charcoal-forged surfaces. Molten orange accents. Code that feels premium.**

A family of 4 VSCode color themes built around a "forge" aesthetic: hot
orange, amber, and copper accents — like metal cooling from an anvil —
carried consistently across a dark, a light, and two high-contrast
variants. Designed to be distinct, striking, and easy on the eyes during
long sessions.

## What it looks like

The warm accents are reserved for the "action" parts of code — keywords,
tags, storage modifiers, function and method names, macros. The
high-frequency "data" parts are cool, so an ordinary line of code doesn't
turn into a wall of orange:

| You'll see | In |
|---|---|
| Keywords, tags, storage, `this`/`self` | orange / amber / copper |
| Strings | green |
| Numbers, constants, built-ins, YAML keys | steel blue |
| Types, classes, HTML attribute values | slate teal |
| Decorators, regex, escapes, `${...}` | violet |
| Comments | muted blue-gray, italic (Dark/Light only) |

So `<div class="row">` reads orange tag → steel-blue attribute name →
slate-teal value, and `const n = 42` reads orange keyword → plain text →
steel-blue number.

## The theme family

| Variant | Best for |
|---|---|
| **KonexForge Dark** | Everyday coding, low-light environments, the flagship "forge" experience |
| **KonexForge Light** | Bright rooms/daytime use, presentations, screen-sharing on projectors |
| **KonexForge Dark High Contrast** | Low-vision users, maximum boundary/contrast clarity in a dark environment |
| **KonexForge Light High Contrast** | Low-vision users in bright environments, accessibility-mandated setups, high-glare use |

All four share the same "hot metal" hue language (orange/amber/copper/rust
accents, steel-blue/slate-teal/violet cool counterpoints) re-derived per
variant for contrast, so they read as one recognizable family everywhere
you use them.

## Features

- Four variants sharing one hue language — Dark, Light, Dark High Contrast,
  Light High Contrast — installed together from a single extension.
- A "hot metal" accent system (orange / amber / copper / rust) as the
  visual hero, balanced by cool counterpoint hues (steel blue, slate teal,
  violet) so syntax categories stay easy to tell apart.
- Full workbench theming: activity bar, status bar, tabs, terminal
  (16-color ANSI palette), git decorations, diff editor, notifications,
  and more.
- Semantic highlighting support for richer accuracy in TypeScript, Python,
  Rust, Go, C#, and other LSP-backed languages.
- Deliberate, sparing use of italics in Dark/Light — reserved for the
  "annotation layer" that describes other code: comments, keywords,
  parameters, decorators, and markup attribute names. Storage, functions,
  types, strings, and plain variables stay upright for fast scanning. Both
  High Contrast variants drop italics entirely for maximum legibility.
- Every syntax color meets WCAG AA (4.5:1) against its background in
  Dark/Light and AAA (7:1) in both High Contrast variants — enforced
  automatically on every commit, not just eyeballed.

## Installation

**From the Marketplace:**
Search for `KonexForge Themes` in the Extensions view, or run:

```
ext install konexforge.konexforge-themes
```

Installing the extension gives you all four theme variants.

**From a VSIX file:**

```
code --install-extension konexforge-themes-0.9.0.vsix
```

## Activating the theme

Open the Command Palette (`Ctrl+Shift+P`) → **Preferences: Color Theme** →
choose one of **KonexForge Dark** / **KonexForge Light** /
**KonexForge Dark High Contrast** / **KonexForge Light High Contrast**.

## Customization

Each variant is built from a small set of role colors if you want to tweak
things via `workbench.colorCustomizations`. The Dark theme's full role
palette:

| Role | Hex | Used for |
|---|---|---|
| Editor background | `#14171C` | editor surface |
| Panel/sidebar surface | `#1A1E24` | sidebar, panel, activity bar |
| Overlay surface | `#20252C` | menus, hover, suggest widget |
| Primary text | `#E4E1DC` | body text |
| Muted text | `#7C8494` | comments, CodeLens, ghost text |
| Primary accent (orange) | `#FF7A33` | keywords, tags, storage |
| Secondary accent (amber) | `#F5A623` | functions, methods, macros |
| Tertiary accent (copper) | `#C97B4A` | `this` / `self` / `$this` |
| Info accent (steel blue) | `#47A8E1` | numbers, constants, attribute names |
| Type accent (slate teal) | `#26C5B5` | types, classes, attribute values |
| Decorator accent (violet) | `#9367E6` | decorators, regex, escapes |
| Success accent (green) | `#4BD26D` | strings, git added, diff inserted |
| Error accent (ember red) | `#E5484D` | errors, git deleted |

Light and both High Contrast variants re-derive lightness per variant from
these same hue identities — deeper on the warm parchment background of
Light, brighter or deeper still in the High Contrast pair — so all four
read as one family. Don't copy Dark's hexes into Light: they won't meet
contrast there.

## Recommended settings

Since comments and keywords render in italic on Dark/Light, a monospace
font with a distinct italic style (e.g. one with ligature support) pairs
especially well with those two variants. (Both High Contrast variants
don't use italics, by design, for maximum legibility.)

## Contributing

Issues and PRs are welcome — especially feedback on contrast, language
coverage, or palette tweaks.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).

## License

[MIT](./LICENSE)
