# KonexForge Dark

**Charcoal-forged surfaces. Molten orange accents. Code that feels premium.**

A dark VSCode theme built around a "forge" aesthetic: cool charcoal-slate
backgrounds paired with hot orange, amber, and copper accents — like metal
cooling from an anvil. Designed to be distinct, high-contrast, and easy on
the eyes during long sessions.

## Preview

> _Screenshots coming soon — capture from the Extension Development Host:_
> - `images/screenshots/editor-overview.png` — a TypeScript/JSX file showing
>   functions, classes, strings, and JSX tags.
> - `images/screenshots/terminal-and-panels.png` — sidebar, integrated
>   terminal, and status bar visible together.

## Features

- High-contrast charcoal-slate base with a cool blue undertone.
- A "hot metal" accent system (orange / amber / copper / rust) as the
  visual hero, balanced by cool counterpoint hues (steel blue, slate teal,
  violet) so syntax categories stay easy to tell apart.
- Full workbench theming: activity bar, status bar, tabs, terminal
  (16-color ANSI palette), git decorations, diff editor, notifications,
  and more.
- Semantic highlighting support for richer accuracy in TypeScript, Python,
  Rust, Go, C#, and other LSP-backed languages.
- Deliberate, sparing use of italics — comments and control-flow keywords
  are italic; everything else stays upright for fast scanning.

## Installation

**From the Marketplace:**
Search for `KonexForge Dark` in the Extensions view, or run:

```
ext install konexforge.konexforge-dark
```

**From a VSIX file:**

```
code --install-extension konexforge-dark-0.1.0.vsix
```

## Activating the theme

Open the Command Palette (`Ctrl+Shift+P`) → **Preferences: Color Theme** →
select **KonexForge Dark**.

## Customization

The palette is built from a small set of core colors if you want to tweak
things via `workbench.colorCustomizations`:

| Role | Hex |
|---|---|
| Editor background | `#14171C` |
| Primary accent (orange) | `#FF7A33` |
| Secondary accent (amber) | `#F5A623` |
| Tertiary accent (copper) | `#C97B4A` |
| Type/class accent (teal) | `#45B8AC` |

## Recommended settings

Since comments and keywords render in italic, a monospace font with a
distinct italic style (e.g. one with ligature support) pairs especially
well with this theme.

## Contributing

Issues and PRs are welcome — especially feedback on contrast, language
coverage, or palette tweaks.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).

## License

[MIT](./LICENSE)
