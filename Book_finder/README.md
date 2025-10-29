# Book Finder — for Alex

A small, fast book search built with **React + Vite** using the public **Open Library Search API** (no auth).

> User story: Alex (college student) wants to search books in many ways: by title, author, subject, ISBN, with light filters (year range, language, ebooks-only) and quick paging.

## Demo (run locally)

```bash
# 1) Install deps
npm i
# 2) Start dev server
npm run dev
# 3) Open the printed local URL
```

This is Vite, so hot-reloads are instant.

## Deploy (StackBlitz / CodeSandbox / Vercel)

- **StackBlitz/CodeSandbox:** Upload this folder (or the ZIP) and it will auto-detect Vite + React. Run with `npm run dev`.
- **Vercel/Netlify/GitHub Pages:** `npm run build` then deploy `dist/`.

## API

Open Library Search API
```
https://openlibrary.org/search.json
Params used: q | title | author | subject | isbn | first_publish_year | language | has_fulltext | page | limit
Docs: https://openlibrary.org/dev/docs/api/search
Covers: https://covers.openlibrary.org
```

## Features

- **Search modes:** smart (free-text), title, author, subject, ISBN
- **Filters:** year range, language code (en, fr, es...), ebooks-only
- **Pagination:** next/prev with total count
- **Covers & details:** cover thumbnails, edition count, first publish year, language, pages
- **A11y:** proper labels and keyboard reachable controls
- **Responsive:** works well on mobile and desktop
- **No external state lib:** just React hooks

## Why this design?

Alex is likely to try mixed searches (e.g., *"murakami kafka"*). A **smart** mode uses `q` for fuzzy matching.
When Alex wants precision, tabs switch to explicit fields. Light filters help narrow a large result set.

## Code map

```
src/
  App.jsx          # UI + fetching + pagination
  components/
    BookCard.jsx   # one book tile
  useDebounce.js   # debounce input to avoid spammy requests
  main.jsx         # React root
  styles.css       # minimal, responsive styling (no framework)
vite.config.js
index.html
package.json
README.md
```

## Notes & Edge Cases

- **Rate limiting:** We debounce input by 500ms and show loading/error states.
- **0 results:** Friendly empty state.
- **Images:** Fallback cover image if none available.
- **Accessibility:** Tabs use `aria-selected` and controls have labels; keyboard usable.

## Tests (manual)

1. Type "tolkien" → expect results with covers/editions.
2. Switch to **ISBN** and type `9780135957059` → should find "Structure and Interpretation of Computer Programs" editions (if indexed).
3. Filter to **ebooks-only** and set year range (e.g., `1900`–`2020`), verify counts change.
4. Paginate through multiple pages; numbers update correctly.
5. Try a nonsense string → "No results" appears.

## Level 1: ChatGPT link

Submit the link to this ChatGPT conversation to show the ideation and development steps.

## License

MIT
