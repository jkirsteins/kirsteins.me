# kirsteins.me

Personal website built with [Eleventy](https://www.11ty.dev/). Minimal, warm editorial design with i18n support.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Opens a local server with hot reload at `http://localhost:8080`.

## Build

```bash
npm run build
```

Output goes to `_site/`.

## Lint & Format

```bash
npm run lint          # ESLint
npm run format        # Prettier (write)
npm run format:check  # Prettier (check only)
```

## Test

```bash
npm test
```

Runs a build verification test — ensures the site builds and all expected pages exist.

## Project Structure

```
src/
  _data/
    i18n/en.json      # UI strings (English)
    site.js            # Global site data
  _includes/
    layouts/
      base.njk         # Base HTML layout
      article.njk      # Article page layout
  en/                  # English content
    articles/          # Markdown articles
    projects/          # Projects page
    index.njk          # Home page
  css/
    style.css          # All styles
eleventy.config.js     # Eleventy configuration
```

## Adding a new language

1. Create `src/{lang}/` directory with a `{lang}.json` containing `{"locale": "xx", "lang": "xx"}`
2. Add a translation file at `src/_data/i18n/{lang}.json`
3. Add the language code to `site.languages` in `src/_data/site.js`
4. Mirror the content structure from `src/en/`
