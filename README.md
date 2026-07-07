# KonexForge Themes

**Charcoal-forged surfaces. Molten orange accents. Code that feels premium.**

A family of 4 VSCode color themes built around a "forge" aesthetic: hot
orange, amber, and copper accents — like metal cooling from an anvil —
carried consistently across a dark, a light, and two high-contrast
variants. Designed to be distinct, striking, and easy on the eyes during
long sessions.

## Preview

> _Screenshots coming soon — capture from the Extension Development Host:_
> - `images/screenshots/editor-overview.png` — a TypeScript/JSX file showing
>   functions, classes, strings, and JSX tags.
> - `images/screenshots/terminal-and-panels.png` — sidebar, integrated
>   terminal, and status bar visible together.

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
- Deliberate, sparing use of italics in Dark/Light — comments and
  control-flow keywords are italic; everything else stays upright for fast
  scanning. Both High Contrast variants drop italics entirely for maximum
  legibility.

## Installation

**From the Marketplace:**
Search for `KonexForge Themes` in the Extensions view, or run:

```
ext install konexforge.konexforge-themes
```

Installing the extension gives you all four theme variants.

**From a VSIX file:**

```
code --install-extension konexforge-themes-0.3.0.vsix
```

## Activating the theme

Open the Command Palette (`Ctrl+Shift+P`) → **Preferences: Color Theme** →
choose one of **KonexForge Dark** / **KonexForge Light** /
**KonexForge Dark High Contrast** / **KonexForge Light High Contrast**.

## Customization

Each variant is built from a small set of core colors if you want to tweak
things via `workbench.colorCustomizations`. The Dark theme's core colors:

| Role | Hex |
|---|---|
| Editor background | `#14171C` |
| Primary accent (orange) | `#FF7A33` |
| Secondary accent (amber) | `#F5A623` |
| Tertiary accent (copper) | `#C97B4A` |
| Type/class accent (teal) | `#45B8AC` |

Light and both High Contrast variants re-derive lightness/contrast per
variant from these same hue identities — see `CHANGELOG.md` for the 0.3.0
palette additions.

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
