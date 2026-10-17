# digs: dopeisgood.com

The DIGS storefront: a custom Shopify site (Hydrogen) for Capsule 01. Four pieces, built from their tech packs.

**Phase now:** wireframes, UI and components (phases 0–6 of `docs/brief/09-build-plan.md`) on the branch `build/v1`. The app runs on a local mock of the Storefront API; no payments or live store connection yet.

```
npm install
npm run dev          # http://localhost:3000  (mock data, no Shopify login; add ?mode=wire for wireframes)
npm run storybook    # http://localhost:6006
npm run test:visual  # Playwright: visual baselines, axe, keyboard pass, story matrix
```

Or open the branch in a GitHub Codespace: `.devcontainer/` installs everything and starts the site. Review pack: `docs/REVIEW.md`. Build log and decisions to confirm: `docs/build-log.md`.

## Start here

| Read | For |
|---|---|
| `CLAUDE.md` | Rules for anyone (or any agent) building this |
| `docs/brief/00-decisions.md` | What's decided and what's open |
| `docs/brief/01-brand-system.md` | BOAST identity + the extended palette |
| `docs/brief/02-puff-junction-attitude.md` | What to take from Puff Junction (and what not to) |
| `docs/brief/03-represent-mechanics.md` | Retail mechanics, sized for a capsule |
| `docs/brief/04-ia-and-pages.md` | Site map and page templates |
| `docs/brief/05-components.md` | Component inventory and states |
| `docs/brief/06-products.md` | The four products and the Shopify data model |
| `docs/brief/07-photography.md` | Casting, scenes, shot list, accuracy checklists |
| `docs/brief/08-copy.md` | Voice, CTAs, copy rules |
| `docs/brief/09-build-plan.md` | Stack, layout, phases, done-criteria |

## The capsule

| | Product | Colorway | Pack |
|---|---|---|---|
| 1 | Thermal Long Sleeve | Off White, Sand Blue | AC-LST-001 · 6-15-25 |
| 2 | Pincord Button-Down | Mustard | AC-LSS-001 pincord · Rev 1 |
| 3 | Needlecord Shirt | Light Grey | AC-LSS-001 needlecord · Rev 1 |
| 4 | Drawstring Pant | Salmon | AC-PNT-001 · Rev 0 |

## Sources

- Brand: BOAST files in `FastCoempany/dopeisgood`, release `dopeisgood` → `BRANDING.FILES.zip`
- Tech packs: `FastCoempany/dopeisgood`, release `techpacks` (and the thermal pack in that repo's `vendors/`)
- Structure and attitude: Figma "Puff Junction UI-UX", UI page
- Retail muse: representclo.com
