# UI/UX Pro Max — Landing Page

A standalone marketing landing page for **UI/UX Pro Max**, the AI design-intelligence skill.

It's a single, dependency-free `index.html` (HTML + CSS + a little vanilla JS), so it can be opened directly or hosted on any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages, S3, etc.).

## Design

Generated using the `ui-ux-pro-max` skill's design-system recommendation:

- **Style:** Dark Mode (OLED) — WCAG AAA contrast
- **Layout:** Hero-centric, single primary CTA
- **Type:** Inter (headings + body), JetBrains Mono for code
- **Accent:** `#22C55E` on a `#0F172A` background

## Sections

Header (sticky) · Hero with terminal demo · Stats strip · Features grid · How it works · Tech stacks · Supported platforms · Final CTA · Footer.

## Preview locally

```bash
# from the repo root
python3 -m http.server 8000 --directory site
# then open http://localhost:8000
```

Or just open `site/index.html` in a browser.

## Notes

- Fully responsive (375 / 768 / 1024 / 1440 breakpoints).
- Respects `prefers-reduced-motion`.
- No build step, no external JS dependencies (fonts load from Google Fonts).
