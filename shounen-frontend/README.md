# ShounenFrontend

A lean frontend for the shonen bot, rebuilt with **Vite + React + TypeScript** (Angular removed).

## Development

```sh
npm install
npm run dev
```

The dev server proxies `/api` to `http://localhost:8080`, so run the backend locally:

```sh
node ../shounen-backend/index.js
```

## Build

```sh
npm run build
```

Output goes to `dist/shounen-frontend/` (same path Angular used, so the existing nginx
config keeps working).

## Deploy

The GitHub Actions workflow (`.github/workflows/main.yml`) builds the frontend on the
runner and copies it to the server on every push to `master` — no need to build locally.

For a manual deploy, run:

```sh
DEPLOY_HOST=your-server-host npm run deploy
```

This builds locally, then `scp`s `dist/shounen-frontend/*` to
`/home/debian/src/shounentimejs/shounen-frontend/dist/shounen-frontend/` on the server.
`DEPLOY_USER` defaults to `debian` and can be overridden the same way.

## Routes

- `/` — home
- `/quotes` — quotes (uses hash routing: `/#/quotes`)
- `/images` — images; optionally filtered by server via `?server=<guildId>`
