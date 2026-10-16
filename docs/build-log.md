# Build log: digs storefront v1

Branch `build/v1`. One unattended run through phases 0–6 of `docs/brief/09-build-plan.md`
(Oct 16–17 2026). A new session should be able to resume from this file alone.

## How to run

```
npm install
npm run dev              # http://localhost:3000  (mock data, no Shopify login)
npm run storybook        # http://localhost:6006
npm run test:visual      # Playwright: screenshots (390×844, 1440×900; UI + wire), axe, keyboard
npm run check:brand      # CI brand check (hex in app/, PJ colors, forbidden strings, private font)
```

Add `?mode=wire` to any URL for wireframe mode (sticks for the session; `?mode=ui` resets).

## Phase status

| Phase | Status | Deliverable |
|---|---|---|
| 0 Foundation | done | Hydrogen (React Router 7, Vite 8, Tailwind v4) at the repo root; tokens wired; Alexandria WOFF2; `Wordmark`/`Lockup`/`Brandmark`/`Script`; mock adapter; Storybook; Playwright + axe; CI (`.github/workflows/ci.yml`); token page at `/dev/tokens` |
| 1 Wireframes | pending | `docs/wireframes/{page}-{390,1440}.png`, Storybook "Pages" |
| 2 Core components | pending | `app/components/core/*` + stories |
| 3 DIGS layer | pending | `app/components/digs/*` + stories, vector flats |
| 4 UI pages | pending | `docs/ui/{page}-{390,1440}.png` |
| 5 Photography | pending | `assets/photography/` + `MANIFEST.csv`, slots filled |
| 6 QA | pending | axe clean, keyboard pass, Lighthouse ≥ 90, copy audit, baselines |

Founder review gates after phases 1 and 4 are waived for this run (founder, Oct 16 2026); the
gate deliverables are produced and the run continues.

## Architecture notes (phase 0)

- **No Storefront client is created.** `app/lib/context.ts` builds a React Router
  `RouterContextProvider` carrying `{session, digs, env, waitUntil}`; `server.ts` uses React
  Router's own `createRequestHandler`. Hydrogen's `createHydrogenContext` demands a store domain in
  production and its request handler expects that context, so both wait for the live phase. The
  swap later: create the Hydrogen context and re-implement `app/lib/mock/index.ts` on
  `storefront.query`.
- **Mock adapter** (`app/lib/mock/`): `products.ts` builds Storefront-shaped products (options
  Color + Size, 20 variants, `digs.*` metafields incl. `built_like_this`, `size_chart`, `gallery`)
  from `content/products/*.json` + `specs/*.json`; `cart.ts` is a Cart-shaped mock stored in the
  session cookie; `photos.ts` maps shot codes to approved photos (empty until phase 5). Prices are
  `null` → "Price TBA" (O1). All four products are `coming-soon` (06-products.md).
- **Brand marks**: `tools/brand_svg.py` strips the Illustrator exports to `currentColor` path
  data. The wordmark is inline SVG; the brandmark, the two lockup layers and the script words are
  CSS masks over `currentColor` (`app/assets/marks`, `app/assets/script`), so the heavy marker
  paths stay cached static files and no hex lands in `app/`. Lockup color pairs per surface follow
  01-brand-system.md §2.
- **Fonts**: `tools/build_fonts.py` subsets Alexandria to Latin as WOFF2 (54 KB) in
  `public/fonts/`. The Old Falcons is never converted; `tools/check_brand.py` scans `app/`,
  `public/` and build output for any reference to it or any served font carrying its name.
- **Wire mode**: `?mode=wire` → session → `<html data-mode="wire">`. Storybook has a Mode toolbar.
- **Playwright**: four projects (`mobile-ui`, `mobile-wire`, `desktop-ui`, `desktop-wire`) against
  `npm run preview` (production build). Chromium 1194 is preinstalled here, which matches
  `@playwright/test` 1.56.1, so that version is pinned; CI installs its own browser.
- **Vite 8 / Rolldown** prints a warning from Hydrogen's bundle analyzer plugin; harmless.

## Decisions to confirm

| # | Decision taken | Why / default used |
|---|---|---|
| D1 | `.env` is optional: a fixed dev session secret is used when `SESSION_SECRET` is unset | Codespaces must start with no prompts; the secret only signs the mock cart cookie |
| D2 | `/robots.txt` disallows everything | Pre-launch; flip when the store goes live |
| D3 | UI/accessible-name microcopy added to `content/copy/en.json` under `a11y` and `errors` | 08-copy.md: nothing typed straight into a component; these are not brand lines |

## Known gaps

- CI has not run on GitHub yet (opened with the draft PR after phase 0).
