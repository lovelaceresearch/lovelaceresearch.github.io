# Lovelace Research

Official website for Lovelace Research — an independent research-led innovation lab for personal & humane AI.

## Branches

- nextjs: Active production site built with Next.js (code lives under `web/`). Deployed on Vercel. This is the default branch.
- html-css-js: Archived static site (original HTML/CSS/JS version) preserved for reference.

## Development (Next.js)

Local dev:

1. `cd web`
2. `npm install`
3. `npm run dev`

Project structure:

- `web/src/app/*`: App Router pages (`/`, `/about`, `/publications`, `/reading-list`, `/opinion-notes`, `/prototypes`)
- `web/public/data/*.json`: Content sources for data-driven pages
- `web/public/fonts/*`: Font files
- `web/src/app/globals.css`: Global styles (ported from the original site)

## Deployment (Vercel)

- Production: Push to `nextjs` → Vercel builds and deploys
- Previews: Pull Requests → preview deployments (unique URLs)

## Archived static site (html-css-js)

The `html-css-js` branch preserves the original static site (HTML/CSS/JS). It is no longer deployed.

---

© 2024 Lovelace Research. All rights reserved.