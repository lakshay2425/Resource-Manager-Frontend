# AGENTS.md

## Cursor Cloud specific instructions

This is the **frontend** of ResourceHub — a React 19 + Vite 7 + Tailwind 4 SPA. Standard commands live in `package.json` (`dev`, `build`, `preview`, `lint`). The backend API lives in a separate repo (`resourceManager-backend`). Notes below are only the non-obvious cloud caveats.

### Required `.env` (gitignored)
Vite reads config from a `.env` file in the repo root that is **not committed** (`.env` is in `.gitignore`). It persists in the VM snapshot, but recreate it if missing:
```
VITE_BACKEND_URL=http://localhost:3000/api
VITE_AUTH_URL=http://localhost:5000/api
VITE_FRONTEND_URL=http://localhost:5173
VITE_GOOGLE_CLIENT_ID=dev-google-client-id.apps.googleusercontent.com
VITE_DEV_MODE=true
```

### Dev server
- `npm run dev` serves on port 5173. There is no Vite proxy — the app calls absolute URLs from the env vars above, so the backend must run on `http://localhost:3000` for API calls to work.

### Auth-gated vs public routes (important)
- Login uses Google OAuth against an **external auth service** (`VITE_AUTH_URL`) that is **not part of this repo or the backend repo**, so the real login flow cannot be completed locally. Routes gated by `isAuthenticated` (`/resources`, `/createResource`, `/edit/:id`, `/documents`, `/bookmarks`) redirect to `/` when not logged in.
- Public routes work without login: `/` (landing) and `/publicResources` (reads `GET /api/resources/publicResources` from the backend). To see data in the UI, seed a public resource via the backend API (the backend runs with `BYPASS_AUTH=true`), e.g. `POST http://localhost:3000/api/resources` with `status: "public"`.

### Lint / build
- `npm run build` (vite build) is clean.
- `npm run lint` currently reports pre-existing `no-unused-vars` errors in committed source; these are not environment issues.
