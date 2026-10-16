# 09 · Build plan

## Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Shopify Hydrogen** (React, TypeScript, Vite) | Shopify's framework for custom storefronts. Scaffold with `npm create @shopify/hydrogen@latest` and choose TypeScript and Tailwind. |
| Hosting | **Oxygen** (Shopify), later | Needs a Shopify store with the Hydrogen channel. Until then, review happens through Storybook and screenshot sets. |
| Data | **Local mock adapter** shaped like Storefront API responses | `app/lib/mock/`, built from `content/products/*.json`. Swap for the live Storefront API in one file later. (Hydrogen's default mock.shop data isn't DIGS product, so it isn't used.) |
| Styling | **Tailwind v4** + generated token CSS | `@import "tailwindcss"` → `design/tokens/build/tailwind-theme.css` → `tokens.css` → `wire.css`. |
| Fonts | Alexandria variable, self-hosted (convert TTF → WOFF2 in `tools/`) | The Old Falcons is never served; script words are SVG. |
| Components | Storybook (`@storybook/react-vite`) | Every state of every component. |
| Tests | Playwright screenshots at **390×844** and **1440×900**, UI and wire modes; `@axe-core/playwright` | Visual regression + accessibility. |
| Tooling | Python 3 scripts in `tools/` | Palette, tokens, script SVGs, spec extraction. |

## Repository layout

```
CLAUDE.md                 agent rules (read first)
README.md
docs/brief/00-09          the brief
design/tokens/            token sources (json) + build/ (generated css) + palette.png + contrast-report.md
brand/                    logos, script SVGs, patterns, fonts (Alexandria OFL; The Old Falcons private)
content/                  products/*.json, products/specs/*.json, copy/en.json
reference/                tech packs (+ renders), Puff Junction screens, BOAST pages
tools/                    palette.py, build_tokens.py, script_svg.py, extract_specs.py
assets/photography/       approved photos + MANIFEST.csv + CREDITS.md   (created when photos land)
app/                      Hydrogen app            (created in phase 0)
  components/core/        brand-agnostic store components (semantic tokens only)
  components/digs/        DIGS brand layer
  lib/mock/               Storefront-shaped mock data
  routes/                 pages
  styles/
tests/visual/             Playwright specs + baselines
```

## Phases and done-criteria

**Phase 0: Foundation**
- Scaffold Hydrogen (TS + Tailwind v4) in `app/`. Wire in the token CSS, Alexandria WOFF2, `<Wordmark/>`, `<Lockup/>`, `<Brandmark/>` and `<Script word="…"/>` (from `brand/`), the mock adapter, Storybook, Playwright and axe.
- Add a CI check that fails on any hex color, PJ color value (`D6FD4A`, `A5E4FF`, `FF8FF1`, `FEF200`), the strings `boudaries`, `jorney`, `@streetdigs`, `digs.com`, or `TENCEL` in `app/`.
- Done when `npm run dev` shows a token test page, Storybook runs, and one screenshot test passes at both sizes.

**Phase 1: Wireframes** (wire mode)
- Every template in `04-ia-and-pages.md` at 390 and 1440, media slots labelled with ratio and shot code.
- Deliverable: `docs/wireframes/{page}-{390|1440}.png` + a Storybook "Pages" section. **Founder review gate.**

**Phase 2: Core components**
- Everything in the core table of `05-components.md`, every state, in Storybook, at both sizes, with axe passing.

**Phase 3: DIGS brand layer**
- Everything in the DIGS table: hero, scrawl, stickers, rails, manifesto, Built like this (flats extracted from the tech-pack PDFs as vector: `pdftocairo -svg -f 5 -l 5 <pack>.pdf`, cropped, strokes restyled to `--color-text-primary`), blue frame, poster wall, tagline band, footer wordmark, menu.

**Phase 4: UI pages** (UI mode)
- Pages composed from phases 2–3 with real copy from `en.json` and product data from the mock adapter. Photos are placeholders until phase 5.
- Deliverable: `docs/ui/{page}-{390|1440}.png`. **Founder review gate.**

**Phase 5: Photography**
- Drop approved images from `assets/photography/` into their slots by shot code (`07-photography.md`).

**Phase 6: QA and handoff**
- axe: zero serious or critical issues. Keyboard pass on menu, drawer, gallery, size selector, modal.
- Lighthouse mobile: performance ≥ 90 on Home, Shop and PDP with real images.
- Copy audit against `08-copy.md`. Visual baselines committed.
- Optional: push key screens into a DIGS Figma file for collaborators (Figma MCP).

## Working rules for the build

- Branch per phase, PR into `main`; screenshots attached to every PR that changes UI.
- Token changes go through the sources (`tools/palette.py`, `design/tokens/tokens.base.json`), then `python3 tools/build_tokens.py`. Never hand-edit `design/tokens/build/`.
- New script word: add it to `content/copy/en.json` → `scriptWords`, then run `python3 tools/script_svg.py --out brand/script "<word>"`. Run the output through `svgo` before shipping.
- When a question isn't answered by `00-decisions.md`, ask the founder; don't guess on brand, product or money.
