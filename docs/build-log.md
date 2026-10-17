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

Visual baselines are generated on the CI runner (`visual-baselines` workflow, D25); run the
`@visual` comparison there and everything else locally (`npm run test:visual -- --grep-invert @visual`).

## Phase status

| Phase | Status | Deliverable |
|---|---|---|
| 0 Foundation | done | Hydrogen (React Router 7, Vite 8, Tailwind v4) at the repo root; tokens wired; Alexandria WOFF2; `Wordmark`/`Lockup`/`Brandmark`/`Script`; mock adapter; Storybook; Playwright + axe; CI (`.github/workflows/ci.yml`); token page at `/dev/tokens` |
| 1 Wireframes | done | `docs/wireframes/{page}-{390,1440}.png` (17 templates + menu, cart drawer, size-guide modal), Storybook "Pages" section (33 stories incl. states) |
| 2 Core components | done | 26 components, 181 stories (`Core/*`), every state in the 05 table; story matrix (axe × 390/1440 × UI/wire) in `tests/visual/stories.spec.ts` |
| 3 DIGS layer | done | 20 components, 89 stories (`DIGS/*`); vector flats from the tech packs via `tools/flats_svg.py` with hotspot anchors |
| 4 UI pages | done | `docs/ui/{page}-{390,1440}.png` (placeholder set in commit "Phase 4"; the final set carries the photography) |
| 5 Photography | done | 15 approved finals in `assets/photography/` + `MANIFEST.csv` + `CREDITS.md`; optimized copies in `public/photography/`; placed by shot code (P-xx-01/02 per colorway, H-01 both crops, E-01..03); O8 recorded |
| 6 QA | done | axe: 0 serious/critical on every page × 4 projects and across the 318-story matrix; keyboard pass (menu, drawer, gallery, size selector, modal, skip link); Lighthouse mobile 97 / 93 / 91 (home / shop / PDP, `docs/qa/lighthouse.md`); copy audit and fact trace pass (`docs/qa/*.txt`); visual baselines committed (`tests/visual/__screenshots__`, 72 PNGs: 17 pages + the marks strip × 4 projects) |

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

## Phase 1 notes

- The wireframes are the real build in `data-mode="wire"` (04-ia-and-pages.md), captured by
  `npm run shots:wireframes` (Playwright, `tests/visual/shots.spec.ts`). Every page template, the
  menu, the cart drawer and the size-guide modal, at 390 and 1440.
- Core components (`app/components/core/`, 26) and the DIGS layer (`app/components/digs/`, 20)
  were written in this phase because the wireframes are composed from them; their stories and
  state coverage are phases 2–3.
- Flats: `tools/flats_svg.py` extracts the cover-page flats (pincord: page 5, its cover is a
  textured render) as currentColor line art, with hotspot anchors per product; see the script's
  header for the judgement calls (stitch brushes simplified to dashes, 10% shading dropped).
- Photography tooling (`tools/photo_sync.py`, `assets/photography/MANIFEST.csv`,
  `public/photography/`) was prepared in parallel; it is wired in phase 5. Wire mode hides images,
  so the wireframes are unaffected.

## Phases 2–5 notes

- Stories: `npm run storybook`. Toolbar **Mode** (UI / Wireframe) and **Viewport** (390 / 768 /
  1024 / 1440). Forced hover/pressed/focus states are separate stories (named "(forced)").
- The story matrix (`npm run test:visual -- --grep @stories`) loads every story from the static
  build at 390 and 1440, in UI and wire mode, and fails on any serious or critical axe violation.
- Photography: `tools/photo_sync.py` validates `MANIFEST.csv` (names, sizes, ratios against
  `content/products`), writes progressive JPEGs plus 480/720/960 (+1440 for the 16:9 hero) WebP variants and
  `app/lib/mock/photos.generated.json`; `photos.ts` keys by shot code, colorway and ratio.
- Slots still empty (labelled placeholders): P-xx-03..07 for every product, E-04+ (poster wall and
  manifesto), and the second manifesto frames. Round 2 fills them (07-photography.md).

## Phase 6 notes (QA)

| Check | Command | Result |
|---|---|---|
| axe + no horizontal overflow, every page, 390/1440 × UI/wire | `npm run test:a11y` | 0 serious or critical; `document.scrollWidth` ≤ viewport on every page (72 tests, 2 desktop menu checks skipped by design) |
| Keyboard pass | `npm run test:keyboard` | menu, cart drawer, gallery (arrows, zoom, Esc), size selector, size-guide modal (unit toggle, trap, Esc), skip link |
| Story matrix | `npm run test:visual -- --grep @stories` | 318 stories × 4 projects render and pass axe (one forced mid-transition story is tagged `no-axe`) |
| Lighthouse mobile | `node tools/lighthouse.mjs` | home 97, shop 93, PDP 91 on the final build (`docs/qa/lighthouse.md`; earlier runs 92–97). Scores dip under CPU load (PDP read 89 while a test run shared the machine); the SEO column is 63–66 only because `/robots.txt` disallows crawling pre-launch (D2) |
| Copy audit | `python3 tools/copy_audit.py` | passes; 35 draft lines listed in `docs/qa/copy-audit.txt` |
| Product-fact trace | `python3 tools/fact_trace.py` | 261 on-screen facts traced to `content/products/`, plus every size-guide row and cell compared to the graded spec in order |
| Visual baselines | `npm run test:visual -- --grep @visual` | 17 pages × 4 projects, full page; `maxDiffPixelRatio` 0.01 until the GitHub runners prove stable, then tighten (0.002) |

Performance notes: loaders serialize card data rather than whole products; one stylesheet; the
wordmark is a CSS mask (one cached SVG); photos ship as 480/720/960 WebP; the font is preloaded.

## Decisions to confirm

| # | Decision taken | Why / default used |
|---|---|---|
| D1 | `.env` is optional: a fixed dev session secret is used when `SESSION_SECRET` is unset | Codespaces must start with no prompts; the secret only signs the mock cart cookie |
| D2 | `/robots.txt` disallows everything | Pre-launch; flip when the store goes live |
| D3 | UI/accessible-name microcopy added to `content/copy/en.json` under `a11y` and `errors` | 08-copy.md: nothing typed straight into a component; these are not brand lines |
| D4 | Home hero surface is Digs Blue with the wordmark in ice (not blue on ice) | 04 says "blue on ice" for the hero wordmark but also a transparent header with an ice wordmark, and 07 pulled the H-01 backdrop to Digs Blue "so the hero sits flush on a Digs Blue page". Blue surface + ice letters is the only reading that satisfies all three and the contrast rule |
| D5 | Desktop hero wordmark is capped at 60svh and left-aligned; edge to edge on mobile and at the foot of every page | An edge-to-edge wordmark at 1440 is 875px tall: the CTA would sit below the fold |
| D6 | "Built like this" leader lines use `--color-text-sale` (the signal red) | 01-brand-system §5.7 asks for the tech packs' red leader lines; no other red exists in the palette |
| D7 | Utility-page copy (shipping, FAQ, contact, accessibility, policies, account) added to `en.json` as drafts; no terms, windows, prices or legal text invented | Pages need structure now; the `draft` flag renders a small "draft" pill until the founder approves |
| D8 | Contact page has no email address (shows the Instagram handle and a disabled form) | No address exists in the brief |
| D9 | Announcement bar reads "Capsule 01. Coming soon. Get on the list." (draft) and is hidden on the home hero | 04 example mentions a ship date, which is not set |
| D10 | Checkout button is present but disabled, with a note | Nothing is wired to Shopify in this phase (decision 2) |
| D11 | Size-guide "How to measure" shows the flats with the POM legend, without drawn measurement lines | Redrawing the tech-pack diagrams by hand risks a wrong line; the letters match the pack |
| D12 | Two semantic color roles added through the sources: `text/sale-on-inverse`, `text/success-on-inverse` (the signal tints) | Field errors/successes on black or blue measured 3.6–3.9:1 with the base signal colors; the tints clear 17:1 (`contrast-report.md`) |
| D13 | Flats simplify the thermal's stitch brushes to dashes and drop its 10% shading | 300 KB → 15 KB per flat with the same construction lines; see `tools/flats_svg.py` |
| D14 | Hotspot pins are 40px and two anchors were moved off the garment feature by a few percent (thermal neck label, pincord box pleat) | Overlapping 44px targets failed axe target-size; the callout text names the exact placement |
| D15 | The tagline band's script word is set in ice, not Digs Blue | A script word is text: "never Digs Blue text on black" (CLAUDE.md). Blue on black stays in graphics only (scrawl, frames, stickers) |
| D16 | Manifesto heading reads "The digs standard." with a lowercase wordmark | The wordmark is always lowercase `digs`; the heading sits in `en.json` (`manifestoPage.standardHead`) |
| D17 | Every `draft` line in `en.json` shows the small "draft" pill wherever it renders (home, shop, PDP short lines and shipping note, cart notes, announcement bar, manifesto), not only on utility pages | One rule for review screens: what is final reads clean, what waits for the founder is marked. The pill inherits the surrounding text colour (D7 extended) |
| D18 | Shirt body-length labels read "Body length (back, shoulder to hem)"; the needlecord style code drops "Rev 1" | The packs measure A / A2 from the high point shoulder level at centre back, not the collar seam; the pack header carries no revision in the style code. Labels only, numbers untouched |
| D19 | "Low stock" shows only with a real variant count, never from a status alone | No stock numbers exist in this phase; a badge without a count would be an invented fact |
| D20 | The cart action rejects non-integer quantities and unknown variants with 400 | Mock or not, the action is the shape the live cart will keep |
| D21 | Overlays close on navigation; opening the cart from the menu closes the menu first, then opens the cart | Two stacked dialogs left focus in the wrong layer; the sequence returns focus correctly |
| D22 | Core stories use neutral stand-ins (a "brand" label, an "art slot" pill) instead of the wordmark and script words; `tools/check_brand.py` fails any import of `components/digs` from `components/core`, stories included | "core must not import from digs" applied to everything in the folder |
| D23 | CI runs one `checks` job and four Playwright jobs (one per project) with the built site served once; pushes to `build/**` no longer run CI twice (the pull request run covers them) | Every earlier CI run hit the 30-minute job timeout inside the Playwright step (1,500 tests on one runner). Each matrix job now takes about 12 minutes |
| D24 | `display-xl` is `clamp(3.5rem, 1.5rem + 11vw, 10.5rem)` (was `2.1rem + 11.5vw`), changed in `design/tokens/tokens.base.json` | At 390px the manifesto headline's "Redefining" was 413px wide, so the page was 429px wide and phones zoomed out. 67px keeps a ten-letter word inside the margins; 768+ changes by a few px, 1440 not at all. The page a11y suite now fails any page wider than its viewport |
| D25 | Visual baselines (`tests/visual/__screenshots__`) are produced on the GitHub runner by the `visual-baselines` workflow (Actions → visual-baselines → Run on the branch), which commits them back; `ci` compares against those | The same Chromium build rasterises text about 2% differently between this container and `ubuntu-latest` (and wrapped one PDP line differently), so baselines made here fail there. Locally, run `npm run test:visual -- --grep-invert @visual`, or refresh local baselines with `npm run test:visual:update` without committing them |

## Review round (after phase 6)

A six-dimension skeptical review (brand and wire leaks; copy and content; data and loaders;
interaction accessibility; tests and tooling; docs) with adversarial verification produced 43
confirmed findings and 4 refuted ones. All 43 are fixed in the three "Review fixes" commits:

- **Brand**: tagline script in ice (D15); wire mode strips the blue trims, wallpaper and the blue
  frame's well; blue frame crops landscape photos at the top and no longer tints the rails; menu
  links use the link colour at 14.5vw; dead hero CSS removed; manifesto pairs stack under 768px;
  a print stylesheet.
- **Content**: style code and body-length labels (D18); FAQ care answer matches the care lines;
  home posters and manifesto headings come from `en.json`; drafts flagged everywhere (D17);
  `robots.txt` without a sitemap line.
- **Data**: low-stock badge (D19); cart action validation (D20); cart drawer shot codes from the
  gallery; PDP forced states (sold out / pre-order) render from real variant availability;
  gallery effect dependencies; CartSummary ids from `useId`.
- **Interaction a11y**: one roving-tabindex helper (arrows, Home, End) for swatches, sizes and
  the unit toggle; focused controls never disable mid-update (stepper, remove, gallery arrows
  use `aria-disabled`); the newsletter form stays mounted and moves focus to its status line;
  toasts render inside the open cart dialog (top layer); menu → cart sequencing and overlays
  closing on navigation (D21); heading levels on cart lines and the size chart.
- **Tests and tooling**: `fact_trace.py` compares every size-guide row and cell to the graded
  spec in order; core stories isolated and checked (D22); the size-selector keyboard test is named
  for what it checks and covers arrow keys; CI restructured (D23); `tools/requirements.txt`; the
  devcontainer installs Playwright's Chromium and the Python requirements.

## Known gaps

- Visual baselines come from the runner (D25). After any change that moves pixels, run the
  `visual-baselines` workflow on the branch and then re-run `ci`; the committed baselines in this
  branch are the runner's as of the last such run (see the PR checks for the current state).
- `maxDiffPixelRatio` stays at 0.01 until a few CI runs prove the runner stable, then tighten
  (0.002) so a missing pill or badge cannot hide inside the tolerance.
- Pincord back flat shows the pack's dashed placeholder for the back-yoke embroidery (O5).
