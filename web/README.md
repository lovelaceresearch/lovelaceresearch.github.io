## Lovelace Research — Web (Next.js + React)

Official website built with the Next.js App Router and React. This README explains the tech stack, app architecture, and how to recreate a similar setup.

### Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19 + React DOM 19
- **Language**: TypeScript 5
- **Styling**: Global CSS (`src/app/globals.css`) + CSS Modules (e.g., `Slideshow.module.css`)
- **Images**: `next/image`
- **Fonts**: `next/font/local`
- **Analytics**: `@vercel/analytics`
- **Linting**: ESLint 9 (Flat config) with `next/core-web-vitals`

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
web/
  public/
    data/                 # Static JSON content (used by pages/components)
    fonts/                # Local font files
    images/               # Static images used by Next/Image
  src/
    app/
      (components)/      # UI components (some client-side)
      about/             # Route segments (server components by default)
      opinion-notes/
      paradigm/
      product/
      prototypes/
      publications/
      layout.tsx         # Root layout + metadata + global font + analytics
      page.tsx           # Home route
  next.config.ts         # Next.js config
  eslint.config.mjs      # ESLint flat config (extends Next presets)
  tsconfig.json          # TS config (strict, path aliases, bundler resolution)
```

### How Next.js & React work here

- **App Router**: Pages live in `src/app/*`. `layout.tsx` defines `<html>`, metadata, loads a local font, imports global CSS, and mounts `@vercel/analytics` and a `MobileNav`.
- **Server vs Client Components**: Components are server by default. Interactive ones add the `'use client'` directive and can use hooks like `useState`/`useEffect`.

```tsx
"use client";
import { useEffect, useState } from "react";
```

- **Static data**: JSON content is served from `public/data/*.json`. Client components fetch via relative paths, e.g.:

```tsx
useEffect(() => {
  fetch("/data/logos.json")
    .then((r) => r.json())
    .then((data) => { /* set state */ });
}, []);
```

- **Images**: Use `next/image` with assets under `public/images/*` for optimization.
- **Fonts**: Local fonts via `next/font/local` and exposed as CSS variables in `layout.tsx`.
- **ESLint**: Flat config extends Next.js rules; builds ignore lint errors via `next.config.ts`.

Relevant configs:

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
```

```jsonc
// tsconfig.json (highlights)
{
  "compilerOptions": {
    "strict": true,
    "moduleResolution": "bundler",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

```js
// eslint.config.mjs (highlights)
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });
export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];
```

### Commands

```bash
npm run dev    # Start dev server (http://localhost:3000)
npm run build  # Production build
npm start      # Start production server after build
npm run lint   # Lint code
```

### Recreate a similar project (same stack)

1) Create an App Router project with TypeScript and `src/` directory:

```bash
npx create-next-app@latest web \
  --ts --eslint --app --src-dir \
  --use-npm \
  --import-alias "@/*"
```

2) Pin core dependencies and add analytics:

```bash
cd web
npm i next@15.4.6 react@19.1.0 react-dom@19.1.0 @vercel/analytics@^1.5.0
```

3) Configure TypeScript (if not already): ensure `strict`, `moduleResolution: "bundler"`, and alias `@/* -> ./src/*` as above.

4) Configure ESLint flat config to extend Next presets (see snippet above).

5) Optional: Allow builds to pass with lint errors during CI by adding `eslint.ignoreDuringBuilds: true` in `next.config.ts`.

6) Create directories and assets:

```
public/fonts/           # place your .woff2 files
public/images/...       # static images
public/data/*.json      # content for data-driven pages
src/app/(components)/   # shared UI components
src/app/globals.css     # global styles, import in layout.tsx
```

7) Set up the root layout `src/app/layout.tsx` to:

- import `./globals.css`
- load local font(s) with `next/font/local`
- export `metadata`
- render `children` and mount `<Analytics />`

8) Build pages under `src/app/*` (server components by default). Add `'use client'` to interactive components that use hooks.

9) Run locally:

```bash
npm run dev
```

### Deployment

- Deploy to Vercel. Pushing to the main branch triggers a build and deploy. Preview deployments are created for PRs.

