# autoweb

[![Deploy Website](https://github.com/mruhegwu/autoweb/actions/workflows/deploy.yml/badge.svg)](https://github.com/mruhegwu/autoweb/actions/workflows/deploy.yml)

Automated website deployment to GitHub Pages via GitHub Actions.

## Project analysis

**autoweb** is a minimal, static website project that demonstrates automated continuous deployment using GitHub Actions. It serves as a reference implementation and starting template for teams that want to host a static site on GitHub Pages with zero manual deployment steps.

### What it does

- Hosts a single-page HTML/CSS/JS website describing itself
- Automatically deploys the contents of `src/` to GitHub Pages on every push to `main`
- Runs the build job on pull requests so CI status is visible before merging
- Keeps the deploy job gated to the `main` branch to avoid accidental publication from feature branches
- Dynamically sets the copyright year in the footer via a small JavaScript snippet

### Tech stack

| Layer | Choice | Notes |
|-------|--------|-------|
| HTML | Vanilla HTML5 | Semantic elements, proper `lang` attribute |
| CSS | Vanilla CSS | Flexbox layout, system font stack, GitHub color palette |
| JavaScript | Vanilla ES2015+ | Single DOMContentLoaded listener; no dependencies |
| CI/CD | GitHub Actions | `deploy.yml` – two jobs: `build` and `deploy` |
| Hosting | GitHub Pages | Served from the `github-pages` environment |

### Workflow analysis (`.github/workflows/deploy.yml`)

```
push / PR to main ──► lint + test jobs ──► build job ──► (main only) ──► deploy job ──► GitHub Pages
```

| Concern | How it is handled |
|---------|-------------------|
| Triggers | `push` to `main`, `pull_request` to `main`, `workflow_dispatch` |
| Least-privilege | Top-level `permissions: contents: read`; deploy job adds `pages: write` and `id-token: write` only where needed |
| Concurrency | `group: pages`, `cancel-in-progress: false` prevents overlapping deploys while queuing new ones |
| PR safety | `if: github.ref == 'refs/heads/main'` ensures deploys never run on PR branches |
| Pinned actions | All actions use `@v4`/`@v5` major-version pins – stable but still auto-receives patch updates |
| Quality gate | `build` job depends on `lint` and `test` jobs; broken code cannot be deployed |

### Strengths

- **Zero external dependencies** – no npm, no build tool; the site is exactly what lives in `src/`
- **Fast deployments** – no compilation step, deploys complete in seconds
- **Secure by default** – permissions follow the principle of least privilege
- **Concurrency control** – prevents race conditions on concurrent pushes
- **Readable code** – CSS, HTML and JS are all straightforward and easy to change

### Areas for improvement

| Priority | Improvement | Status |
|----------|------------|--------|
| High | Add a `package.json` and a lightweight test runner (Vitest) | ✅ Done |
| High | Add linting to CI (ESLint + Stylelint) | ✅ Done |
| Medium | Add a Lighthouse / web-vitals CI step | Open |
| Medium | Add a `LICENSE` file | ✅ Done |
| Medium | Add HTML validation (e.g. html-validate) | Open |
| Low | Add a meta description tag to `index.html` | ✅ Done |
| Low | Add `CONTRIBUTING.md` and PR / issue templates | Open |

## How it works

Every push to the `main` branch triggers the CI/CD pipeline defined in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

1. **Lint** – runs ESLint (JavaScript) and Stylelint (CSS) in parallel with the test job.
2. **Test** – runs Vitest unit tests.
3. **Build** – checks out the repository and packages the contents of `src/` as a Pages artifact (only runs after lint and test pass).
4. **Deploy** – publishes the artifact to GitHub Pages.

```
push to main
      │
      ├──► lint ──┐
      │            ├──► build ──► deploy ──► GitHub Pages
      └──► test ──┘
```

## Project structure

```
autoweb/
├── src/            # Website source files (deployed to Pages)
│   ├── index.html
│   ├── style.css
│   ├── main.js
│   └── main.test.js  # Vitest unit tests
├── .github/
│   └── workflows/
│       └── deploy.yml  # CI/CD pipeline (lint → test → build → deploy)
├── eslint.config.js    # ESLint configuration
├── vitest.config.js    # Vitest configuration
├── .stylelintrc.json   # Stylelint configuration
├── package.json
├── LICENSE
└── README.md
```

## Getting started

### Enable GitHub Pages

1. Go to **Settings → Pages** in this repository.
2. Under **Source**, select **GitHub Actions**.
3. Push a change to `main` (or trigger the workflow manually under **Actions**) — the site will be live at `https://<username>.github.io/autoweb/`.

### Local development

Open `src/index.html` directly in a browser, or use any static file server:

```bash
npx serve src
```

Install dev dependencies for linting and testing:

```bash
npm install
npm test      # run Vitest unit tests
npm run lint  # run ESLint + Stylelint
```

## Contributing

1. Edit files in `src/`.
2. Open a pull request against `main`.
3. Once merged, the site deploys automatically.
