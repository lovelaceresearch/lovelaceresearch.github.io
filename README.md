# Lovelace Research

Static HTML/CSS/JS website for Lovelace Research — an independent research-led innovation lab for personal & humane AI.

## Repository Structure
- `index.html`, `about.html`, `prototypes.html`, `paradigm.html`, `publications.html`, `opinion-notes.html`, `product.html`
- `assets/css/style.css` — shared styles
- `assets/js/` — common layout logic and page-specific scripts
- `data/` — JSON content files (prototypes, contributors, publications, reading list, etc.)
- `images/`, `fonts/`, icons — static assets referenced by the pages

## Local Preview
The pages fetch JSON data, so open them through a local web server (direct `file://` access blocks fetch calls).

```bash
python3 -m http.server 8000
# then visit http://localhost:8000/ in your browser
```

## Updating Content
- Update the JSON files under `data/` to change page content.
- Images and other media live in `images/`; reference them from JSON using paths such as `images/...`.
- Global layout/navigation behaviour is defined in `assets/js/common.js`.

## Deployment
The site is fully static. Upload the repository (or the generated files) to any static host or enable GitHub Pages on this branch.
