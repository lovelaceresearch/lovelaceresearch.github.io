# Lovelace Research

Official website for Lovelace Research — an independent research-led innovation lab for personal & humane AI.

## Branches

- nextjs: Active production site built with Next.js (code lives under `web/`). Deployed on Vercel. This is the default branch.
- html-css-js: Archived static site (original HTML/CSS/JS version) preserved for reference.

## Development (Next.js)

### Prerequisites
- Node.js (v18+ recommended)
- VS Code with Cursor editor (or any editor)
- Terminal access

### Local Development Setup

1. **Navigate to the web directory:**
   ```bash
   cd web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Preview the site:**
   - Open your browser and go to: `http://localhost:3000`
   - The site will automatically reload when you make changes
   - Check your terminal for any error messages

### Development Tips for VS Code/Cursor

- **No extensions required** - Next.js runs its own development server
- **Hot reload** - Changes save automatically and refresh the browser
- **Terminal integration** - Use VS Code's integrated terminal (`Ctrl+`` ` or `Cmd+`` `)
- **Port configuration** - The dev server runs on port 3000 by default (configured in `package.json`)
- **Error debugging** - Check both the terminal and browser console for errors

### Useful Commands

```bash
# Development server (with hot reload)
npm run dev

# Production build (for testing)
npm run build

# Start production server (after build)
npm start

# Lint code
npm run lint
```

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