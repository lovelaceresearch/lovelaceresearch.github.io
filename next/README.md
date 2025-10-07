## Lovelace Research — Web (Next.js + React)

Official website built with the Next.js App Router and React. This README explains the tech stack, app architecture, and how to run it locally.

### Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19 + React DOM 19
- **Language**: TypeScript 5
- **Styling**: Global CSS (`src/app/globals.css`) + existing CSS in `public/assets/css/style.css`
- **Images**: next/image ready (currently serving from `/public/images` with `images.unoptimized=true`)
- **Fonts**: next/font/local (Favorit Hangul .woff2 preloaded)
- **Analytics**: @vercel/analytics
- **Linting**: ESLint 9 (flat config) extending Next presets

Key versions pinned in `package.json`:

```json
{
  "dependencies": {
    "next": "15.4.6",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "@vercel/analytics": "^1.5.0"
  }
}
```

### Project Structure

```
next/
  public/
    data/                 # Static JSON content reused from original site
    fonts/                # Local font files
    images/               # Static images (same paths as original)
  src/
    app/
      (components)/      # Client UI helpers
      office/            # /office route
      rnd/               # /rnd route
      globals.css        # Minimal; main styles in /public/assets/css/style.css
      layout.tsx         # Root layout + metadata + fonts + analytics
      page.tsx           # Home route
    components/          # Client components
    lib/                 # Client-side logic (ported from original JS)
  next.config.ts         # Next.js config (eslint.ignoreDuringBuilds, images.unoptimized)
  eslint.config.mjs      # ESLint flat config (extends Next presets)
  tsconfig.json          # TS config (strict, bundler resolution, @/* alias)
```

### How it works

- Pages are server components by default (App Router). Interactive parts use client components under `src/components` and import logic from `src/lib`.
- Static JSON under `public/data/*.json` is fetched on the client via relative paths.
- Existing CSS and DOM class names are preserved to match the original design exactly.

### Commands

```bash
npm run dev    # Start dev server (http://localhost:3000)
npm run build  # Production build
npm start      # Start production server after build
npm run lint   # Lint code
```

### Run locally

```bash
cd next
npm install
npm run dev
```

Open http://localhost:3000.

### Deployment

- Deploy to Vercel. The repo structure is compatible with your previous branch (App Router, src/ layout, ESLint flat config). Preview deployments for PRs are supported.
