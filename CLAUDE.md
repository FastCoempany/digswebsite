# CLAUDE.md: digs storefront (dopeisgood.com)

You are building the **digs** website: a custom Shopify storefront (Hydrogen) for the DIGS clothing brand. This phase is **wireframes, UI and components**. No payments, no live store connection.

## Read first, in order

1. `docs/brief/00-decisions.md`: what's settled and what's open. It wins any conflict.
2. `docs/brief/01-brand-system.md` → `09-build-plan.md`
3. `content/products/*.json`, `content/copy/en.json`, `design/tokens/`

## Non-negotiables

**Brand**
- The identity is BOAST's: Digs Blue `#0042E5`, black, ice `#F0F5FF`; Alexandria; The Old Falcons; the "Actually Dope" lockup. Logos come only from `brand/logos/`.
- Components use **semantic tokens only** (`--color-surface-*`, `--color-text-*`, `--color-action-*`, `--space-*`…). **No hex values in `app/`.**
- **Never black text on Digs Blue, never Digs Blue text on black** (2.91:1). On blue, text is ice; on black, blue is graphic only.
- **The Old Falcons is never served as a font file.** Script words are SVGs in `brand/script/` from `tools/script_svg.py`. One or two script words per line, maximum.
- The wordmark is always lowercase `digs`. Use the lockup ahead of the bare wordmark where there's room. The edge-to-edge wordmark closes every page.

**Puff Junction**
- Take **structure and attitude** from the Puff Junction UI (manifesto before product, giant wordmark hero, stickers, rotated margin text, named CTAs). **Never its colors, halftone, cloud imagery, fonts or button style.** If a screen could pass for Puff Junction with the logo swapped, redo it. See `02-puff-junction-attitude.md`.

**Products and copy**
- Every product fact comes from `content/products/` (built from the tech packs in `reference/tech-packs/`). **Never invent a spec.** Prices are `null` → "Price TBA".
- All copy comes from `content/copy/en.json`. Handle `@dopeisgood`, domain `dopeisgood.com`. Spell **boundaries** and **journey** correctly. Say **lyocell**, never TENCEL. Origin line: "Designed in USA. Imported."

**Imagery**
- Images only from `assets/photography/` (approved) or `MediaSlot` placeholders labelled with ratio + shot code. No stock people, no BOAST placeholder photos, no third-party product photos, no photos of real people's likeness, no generated lettering.

**Build**
- Mobile first: 390px, then 768, 1024, 1440. WCAG 2.2 AA. Respect `prefers-reduced-motion`.
- `app/components/core/` is brand-agnostic and **must not import from** `app/components/digs/`.
- Every component has a Storybook story per state, at 390 and 1440, in UI and wire mode (`<html data-mode="wire">`).
- Data goes through `app/lib/mock/` in Storefront API shape. No live Shopify calls, no checkout wiring in this phase.
- Change tokens through the sources and `python3 tools/build_tokens.py`; never hand-edit `design/tokens/build/`.

## Commands

```
python3 tools/palette.py design/tokens      # regenerate color tokens + contrast report
python3 tools/build_tokens.py               # regenerate design/tokens/build/*.css
python3 tools/script_svg.py --out brand/script "word"
python3 tools/extract_specs.py              # re-pull graded specs from the tech-pack PDFs
```
App commands (`npm run dev`, `npm run storybook`, `npm run test:visual`) are added in phase 0.

## When unsure

If `00-decisions.md` doesn't answer it and it touches brand, product facts, money or legal copy, ask the founder. Otherwise make the call and note it in the PR.
