# Publishing to the VS Code Marketplace

This is a manual, user-driven process — it needs a Microsoft account and a
personal access token, so it is never run automatically by an agent. Follow
these steps once to get `konexforge.konexforge-themes` live, then repeat the
"Ship a new version" section for every release after that.

## One-time setup

1. **Create an Azure DevOps organization** (if you don't already have one):
   https://dev.azure.com — sign in with the Microsoft account you want tied
   to the `konexforge` publisher.

2. **Create a Personal Access Token (PAT)**:
   - Azure DevOps → User settings (top right) → **Personal access tokens** →
     **+ New Token**
   - Organization: **All accessible organizations**
   - Scopes: **Custom defined** → **Marketplace** → check **Manage**
   - Expiration: pick something you'll remember to renew (PATs expire; the
     Marketplace itself does not require renewal, only future `vsce publish`
     runs do)
   - Copy the token now — Azure DevOps only shows it once.

3. **Create the `konexforge` publisher** (skip if it already exists at
   https://marketplace.visualstudio.com/manage/publishers/konexforge):
   ```
   npx --yes @vscode/vsce create-publisher konexforge
   ```
   This prompts for the PAT from step 2. Alternatively create it directly on
   the web at https://marketplace.visualstudio.com/manage/createpublisher.

4. **Log in with vsce** (stores the PAT locally so you don't re-enter it
   every publish):
   ```
   npx --yes @vscode/vsce login konexforge
   ```

## Ship a new version

1. Bump `version` in `package.json` and add a dated entry at the top of
   `CHANGELOG.md` (see `CLAUDE.md` → Versioning workflow).
2. Validate every theme file still parses (the Node one-liner in
   `CLAUDE.md` → Commands).
3. Package and sanity-check the VSIX contents:
   ```
   npx --yes @vscode/vsce package --no-git-tag-version --no-update-package-json
   ```
   Confirm the "Files included in the VSIX" list has exactly: `package.json`,
   `README.md`, `CHANGELOG.md`, `LICENSE`, `images/icon.png`, and the 4 files
   under `themes/` — nothing from `.claude/`, `.vscode/`, `CLAUDE.md`, or
   `PUBLISHING.md`.
4. Install it locally and cycle through all 4 themes as a final check (see
   `CLAUDE.md` → Commands → Install/reinstall).
5. Publish:
   ```
   npx --yes @vscode/vsce publish
   ```
   This reads `version` from `package.json`, uploads the package, and tags
   the release on the Marketplace. Use `vsce publish patch`/`minor`/`major`
   instead if you want vsce to bump `package.json` for you (not used so far
   in this project — versions have been bumped by hand).
6. Push the corresponding commit/tag to git (`main`, once `dev` has been
   merged) so the published version matches what's in source control.

## Marketplace listing checklist

- `package.json`: `publisher`, `repository`, `bugs`, `homepage`, `icon`,
  `categories`, `keywords`, `galleryBanner` are all already set — review
  them whenever the repo moves or the description changes.
- `README.md` is used verbatim as the Marketplace listing body. It currently
  has a placeholder under "Preview" ("Screenshots coming soon") — capture
  real screenshots from the Extension Development Host (`F5`) before the
  first public publish, save them under `images/screenshots/`, and swap the
  placeholder for actual `![...]()` image links.
- `LICENSE` (MIT) is present and referenced from `README.md`.
- First-time publish only: double check no other extension already owns the
  `konexforge.konexforge-themes` id (rename history: this project was
  previously `konexforge.konexforge-dark`, retired in 0.3.0).
