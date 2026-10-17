# Handoff checklist: non-negotiables, the Puff Junction test, product facts

Checked page by page at the end of the build (Oct 17 2026). Evidence is a command or a file.

## CLAUDE.md non-negotiables

| Rule | How it is held | Evidence |
|---|---|---|
| Identity is BOAST's: Digs Blue, black, ice; Alexandria; The Old Falcons; the Actually Dope lockup | Tokens generated from `design/tokens/`; marks generated from `brand/logos/` by `tools/brand_svg.py`; script words from `brand/script/` | `npm run check:brand` (no hex in `app/`); `app/assets/marks`, `app/assets/script` |
| Components use semantic tokens only; no hex in `app/` | Core reads `--color-*` roles only; brand layer may use core + tonal tokens | `python3 tools/check_brand.py` passes; CI step |
| Never black text on Digs Blue, never Digs Blue text on black | On blue surfaces text is ice (`--color-text-on-brand`); on black, blue is graphic only (scrawl, frames, stickers) | `design/tokens/contrast-report.md`; the tagline band's script word is set in ice, so no blue sits on black as text |
| The Old Falcons is never served | Script words are SVG masks; the font file is never copied, converted or declared | `tools/check_brand.py` scans `app/`, `public/`, `dist/`, `storybook-static/` and every served font's name table; `tests/visual/smoke.spec.ts` asserts no font request matches "falcon" |
| One or two script words per line, maximum | `lineWithScript` places at most one word; headlines compose `<Script>` by hand | `python3 tools/copy_audit.py` counts `.script` per heading on every rendered page |
| Wordmark always lowercase `digs`; lockup ahead of the bare wordmark; edge-to-edge wordmark closes every page | `Wordmark` renders the BOAST file; `Lockup` in the footer brand block and token page; `FooterWordmark` in `PageLayout` | every `docs/ui/*-1440.png` ends with the wordmark |
| PJ: structure and attitude only, never its colors, halftone, clouds, fonts or button style | PJ hex values fail CI; no halftone/cloud assets exist; pill/block flat buttons; square frames | `tools/check_brand.py`; see "Puff Junction test" below |
| Every product fact comes from `content/products/`; never invent a spec; prices `null` → "Price TBA" | Mock adapter builds products only from the JSON + graded specs; UI reads metafields | `python3 tools/fact_trace.py`: 261 on-screen facts traced, and every size-guide row and cell compared to the graded spec in order |
| All copy from `en.json`; `@dopeisgood`, `dopeisgood.com`; boundaries/journey; lyocell; origin line | `copy.ts` is the only text source; drafts flagged | `python3 tools/copy_audit.py` |
| Images only from `assets/photography/` or labelled `MediaSlot` placeholders | `photos.ts` reads the manifest; everything else is a labelled slot | `assets/photography/MANIFEST.csv`; `docs/wireframes/*` show the labels |
| Mobile first 390 → 768 → 1024 → 1440; WCAG 2.2 AA; reduced motion | CSS is mobile-first; Playwright at 390 and 1440; axe in every suite; every page asserted no wider than its viewport (the manifesto headline overflowed 390 until D24); `prefers-reduced-motion` cuts animations in `base.css` and per component | `npm run test:visual`; `tools/dev/overflow-bisect.mjs <url> 390` finds an overflowing block |
| `core/` never imports from `digs/` | `tools/check_brand.py` fails any `components/digs` import from `app/components/core/`, stories included (core stories use neutral stand-ins for the wordmark and script words) | `python3 tools/check_brand.py` passes; CI `checks` job |
| Story per state at 390 and 1440 in UI and wire | Storybook Mode + Viewport toolbars; story matrix test renders every story × 2 sizes × 2 modes with axe | `npm run test:visual -- --grep @stories` |
| Data through `app/lib/mock/` in Storefront shape; no live calls; no checkout | No Storefront client is created; checkout button disabled | `app/lib/context.ts`, `server.ts` |
| Tokens change through the sources | `design/tokens/build/` untouched by hand | `git log -- design/tokens/build` |

## Puff Junction test (02-puff-junction-attitude.md)

Put next to the PJ screen it borrows from: layout logic recognisable, surface unmistakably BOAST-DIGS.

| DIGS screen | Borrowed logic | What makes it DIGS, not PJ |
|---|---|---|
| Home hero | Giant name, figure colliding with the letters, overline, named CTA | Digs Blue field, ice geometric wordmark, black marker scrawl, Alexandria, a photographed model flush on the cobalt seamless; no halftone, no cloud, no outlined offset-shadow button |
| Manifesto before product | Philosophy block right after the hero | "Dope is *good*." in Alexandria display with the script payoff; numbered 01–04 blocks on hairlines; no illustration |
| Stickers | Stamps breaking the grid | The DD brandmark and trim tokens (L3, RIB) in blue/black, not badges in slime/pink |
| Margin rails | Vertical caps text at the edges | Ink micro caps on ice; flip to ice over black sections |
| Menu | Stacked bordered blocks, huge words | Blue on ice, flips to ice on blue with a scrawl underline; square hairlines; the DD sticker |
| Tagline band + footer + wordmark | Ethos band closes the page | Black band, Alexandria display with one script word in ice, pill CTA; then the edge-to-edge wordmark (BOAST "do") |
| Product tiles / PDP | Tile skeleton; image-led PDP | Keylined cloth swatches, "Price TBA", tech-pack style string, "Built like this" flats with red leader lines |

Verdict: with the logo swapped, none of these screens would pass for Puff Junction. The surface is blue/black/ice, geometric sans + marker script, square frames and pill buttons throughout.

## Product-fact trace

`python3 tools/fact_trace.py` fetches the four PDPs and checks every string in the style string, title, short line, Details / Fit / Care accordions, "Built like this" callouts and the size chart against `content/products/<handle>.json` and `specs/<handle>.json` (cm values derived ×2.54, rounded to 0.5). Result at handoff: see `docs/build-log.md` → QA.
