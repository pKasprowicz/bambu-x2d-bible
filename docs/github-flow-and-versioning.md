# Workflow and versioning

How changes reach the live site, and how editions of the Compendium are numbered. Decisions taken: **GitHub Flow** (short branches into `master`), numbering starts at **v1.0.0**, every release carries an **offline zip**.

## 1. Branch model

`master` is always live: Pages deploys on every push to it (`.github/workflows/pages.yml`). Everything else is a short-lived branch.

| Branch | Use | Naming |
|--------|-----|--------|
| `master` | The deployed site. Never commit to it directly. | n/a |
| topic branch | One change: a page, a fix, a tool. Lives hours to days. | `feature/<topic>`, `fix/<topic>`, `content/<topic>`, `docs/<topic>` |
| `hotfix/<topic>` | Urgent correction to something live (wrong safety advice, broken page). Same mechanics as any topic branch, just reviewed first. | `hotfix/<topic>` |

Cycle:

```bash
git switch master && git pull
git switch -c fix/picker-mobile-chips
# work, commit (Conventional Commits: feat:, fix:, content:, docs:, chore:)
git push -u origin fix/picker-mobile-chips
gh pr create --base master            # CI runs scripts/check_site.py
# squash-merge when green; master deploys automatically
git switch master && git pull && git branch -d fix/picker-mobile-chips
```

Rules:

* A pull request needs a green CI run (`.github/workflows/ci.yml`: rebuilds the search index, checks it is committed, runs `check_site.py`, which also checks version consistency).
* Squash-merge, so `master` has one commit per change and the squash title is a Conventional Commit.
* Each PR adds a line under `## [Unreleased]` in `CHANGELOG.md` (typo fixes excepted).
* Keep branches small. A new part of the handbook can land page by page as long as `nav.js` and the checker stay green.

## 2. Versioning the document

A handbook is not an API, so semantic versioning follows what readers experience.

| Part | Bump when | Examples |
|------|-----------|----------|
| **MAJOR** | Page URLs change, pages are removed, or the structure is reorganised. Old bookmarks can break. | Part 6 split in two; renaming `x2d/` |
| **MINOR** | New pages, sections, exercises, tools or hardware coverage. | Chapter for a new printer; a new calculator |
| **PATCH** | Corrections and polish without new scope. | Typo, corrected number, layout fix, new link |

* A safety or numeric correction is a PATCH, and the changelog must name it so readers can find it.
* A moved page keeps a redirect stub (one-line HTML with a meta refresh) at the old URL until the next MAJOR.
* Baseline: **v1.0.0**, the QA'd 62-page state of 2026-11-02.

### Single source of truth

`VERSION` (one line) is what a human edits. Three places must agree, and `scripts/check_site.py` fails the build if they do not:

1. `VERSION`
2. `version:` in `assets/js/nav.js` (rendered in the site footer with links to the changelog and releases)
3. the newest `## [x.y.z]` heading in `CHANGELOG.md`

## 3. Releasing

Merging to `master` already puts content live; a **release** is the numbered milestone on top of that. Do it when `[Unreleased]` holds something worth announcing, or after a batch of fixes.

```bash
git switch master && git pull
git switch -c chore/release-1.1.0
# 1. bump VERSION and nav.js version
# 2. in CHANGELOG.md rename [Unreleased] contents to "## [1.1.0] - YYYY-MM-DD",
#    leave a fresh empty "## [Unreleased]" above, update the compare links at the bottom
python scripts/check_site.py
git commit -am "chore: release 1.1.0" && git push -u origin chore/release-1.1.0
gh pr create --base master            # squash-merge when green

git switch master && git pull
git tag -a v1.1.0 -m "v1.1.0" && git push origin v1.1.0
```

Pushing the tag runs `.github/workflows/release.yml`. Where pushing a tag is not possible (for example from a restricted automation session), run the same workflow manually on `master` instead (**Actions → Release → Run workflow**, or the API): it tags `v<VERSION>` at the current `master` commit itself and refuses to run if that tag already exists. Either way the workflow:

1. checks the tag equals `VERSION`,
2. rebuilds the index and validates the site,
3. takes the matching section of `CHANGELOG.md` as the release notes (fails if there is none),
4. zips the site as `compendium-vX.Y.Z.zip` (everything except `.git`, `.github`) and
5. publishes a GitHub Release with the zip attached.

The first release, **v1.0.0**, needs no bump: merge the PR that introduced this workflow, then tag `master`.

### Freshness of vendor facts (optional follow-up)

Bambu X2D chapters age faster than the rest. Idea: a `data-verified="2026-11-02"` attribute on each Part 6 page plus a small script that lists pages not re-verified in six months. A re-verification pass is a PATCH release.

### Reading older editions

Every tag stays browsable at `/tree/vX.Y.Z` and downloadable from its release. Publishing the previous MAJOR under `/v1/` on Pages is possible later, by copying the tagged tree into the deploy artifact; it is not needed until a MAJOR release exists.

## 4. One-time GitHub settings (need admin, not in the repo)

| Setting | Value |
|---------|-------|
| About → Website | `https://pkasprowicz.github.io/bambu-x2d-bible/` |
| About → Description / Topics | short summary; `3d-printing`, `bambu-lab`, `fdm`, `additive-manufacturing`, `education` |
| About → sidebar | tick **Releases** and **Deployments** |
| Branch protection on `master` | require a pull request and the `check` status from CI; block force pushes |
| Merge button | allow squash merging only; delete branch on merge |
| Optional | `gh repo edit --homepage ... --add-topic ...` does the About fields from the command line |
