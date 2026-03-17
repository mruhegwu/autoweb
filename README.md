# autoweb

[![Deploy Website](https://github.com/mruhegwu/autoweb/actions/workflows/deploy.yml/badge.svg)](https://github.com/mruhegwu/autoweb/actions/workflows/deploy.yml)

Automated website deployment to GitHub Pages via GitHub Actions.

## How it works

Every push to the `main` branch triggers the CI/CD pipeline defined in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

1. **Build** – checks out the repository and packages the contents of `src/` as a Pages artifact.
2. **Deploy** – publishes the artifact to GitHub Pages.

```
push to main
      │
      ▼
  ┌────────┐       ┌──────────┐
  │  build │──────►│  deploy  │──► GitHub Pages
  └────────┘       └──────────┘
```

## Project structure

```
autoweb/
├── src/            # Website source files (deployed to Pages)
│   ├── index.html
│   ├── style.css
│   └── main.js
├── .github/
│   └── workflows/
│       └── deploy.yml  # CI/CD pipeline
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

## Contributing

1. Edit files in `src/`.
2. Open a pull request against `main`.
3. Once merged, the site deploys automatically.
