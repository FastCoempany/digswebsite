# 00 · Decisions

What is settled, who settled it, and what is still open. If a later doc disagrees with this page, this page wins until the founder changes it.

## Settled

| # | Decision | Source |
|---|---|---|
| 1 | **Shopify is the platform.** The site is a custom storefront on Shopify (Hydrogen, hosted on Oxygen); Shopify runs products, cart and checkout. | Founder, Oct 16 2026 ("Shopify will be the platform… build in whatever language we need to") |
| 2 | **This phase is wireframes, UI and components only.** No payments, no live store connection. Data comes from local mock files shaped like Shopify's Storefront API. | Founder, Oct 16 2026 |
| 3 | **Puff Junction's Figma (UI page) is the greenlit direction** for structure and attitude. The 2024 request to make PJ subtler is void. | Founder, Oct 16 2026 |
| 4 | **From PJ, take structure and attitude only:** manifesto before product, giant wordmark hero, stickers, rotated text in the margins, named CTAs. **PJ's colors and halftone do not carry over. Do not copy PJ literally.** | Founder, Oct 16 2026 |
| 5 | **DIGS's own loud BOAST system is in focus**: Digs Blue `#0042E5`, black, ice `#F0F5FF`, Alexandria, The Old Falcons, the "Actually Dope" lockup. | Founder, Oct 16 2026 |
| 6 | **Representclo.com is the retail muse** (tabs, retail mechanics, photography feel), with menus sized for a 4-product capsule. | Founder, Oct 16 2026 |
| 7 | **Four products, built from the exact tech-pack specs**: Thermal Long Sleeve (AC-LST-001), Pincord Button-Down (AC-LSS-001 pincord), Needlecord Shirt (AC-LSS-001 needlecord), Drawstring Pant (AC-PNT-001). | Founder, Oct 16 2026; packs in `reference/tech-packs/` |
| 8 | **The palette is extended from BOAST by Claude acting as brand strategist** (tonal blue, ink neutrals, signal states, cloth swatches). The BOAST triad itself is untouched. | Founder gave liberty and agency, Oct 16 2026; see `01-brand-system.md` |
| 9 | **Fonts: strictly the BOAST fonts.** Alexandria for everything set in type; The Old Falcons for script payoff words. | Founder, Oct 16 2026 |
| 10 | **Script delivery: The Old Falcons ships as SVG artwork, never as a web font file.** Words are drawn with `tools/script_svg.py`. | Build decision |
| 11 | **Photography: real-looking photography, no illustration, no lorem ipsum, no paper-craft.** Generated or sourced. One model across all four products, several angles, simple striking scenes; Represent is the muse. | Founder, Oct 16 2026 |
| 12 | **The cast is E**, an original generated person: slim, copper-red curls, freckles (`reference/casting/casting-e.webp`). The founder says the man in the cord-shirt reference photo is his own AI creation; that file in the dopeisgood release carries a retail-style name (`camicia-modello-c-in-velluto-…`), so it stays a garment reference only. | Founder pick, Oct 16 2026; see `07-photography.md` |
| 13 | **Typos are fixed everywhere:** "boundaries", "journey". | Founder, Oct 16 2026 |
| 14 | **Instagram is `@dopeisgood`. The site is `dopeisgood.com`.** (BOAST's `@streetdigs`, `@digs` and `www.digs.com` are retired.) | Founder, Oct 16 2026 |
| 15 | **This repo is the DIGS site only.** No NRDI storefront repo. Brand-agnostic store components live in `app/components/core` so they can be lifted into a shared package when Puff Junction or Darkest Shades gets a site. | Founder + Claude, Oct 16 2026 |
| 16 | **Button names approved:** Dig in · Add to Digs · Your Digs · Hold my size · Get on the list · Stay dope. | Founder, Oct 16 2026 |
| 17 | **No paid tools, no purchases.** Photography and everything else runs on free routes only (`07-photography.md`). | Founder, Oct 16 2026 |
| 18 | **Photo generator: Figma's ChatGPT Images model on the Starter plan's included AI credits** (500 a month, 150 a day). It costs 2 credits per image at Figma's Oct 15 2026 rates; the Nano Banana models cost 6–16 and aren't used. | Founder (credits), Figma help center |

## Open (site work proceeds on the default)

| # | Item | Default the site uses | Who decides |
|---|---|---|---|
| O1 | Prices | `null` → UI shows "Price TBA" | Founder |
| O2 | Both shirts carry style code AC-LSS-001 | Handles `pincord-button-down` and `needlecord-shirt`; SKUs wait for new numbers | Founder |
| O3 | Country of origin | "Designed in USA. Imported." in PDP copy | Founder, once the factory is chosen |
| O4 | TENCEL™ naming on the pant | Say "lyocell" only | Founder (needs a Lenzing licence) |
| O5 | Pincord open items (cuff cut, pocket closure, wash, back pleat, back embroidery, buttons) | The pack's defaults | Founder |
| O6 | Pant fly (faux vs working zip) | Faux fly, per the pack | Founder |
| O7 | Season label | "Capsule 01" on the site (packs say FW25 / FW27 TBC) | Founder |
| O8 | Round 1 sign-off | 15 finals in `reference/photo-tests/round-1/out/` (the founder OK'd the 1a test and said "run it"; 1b followed). On sign-off they move to `assets/photography/` with `MANIFEST.csv`; until then the UI uses `MediaSlot` placeholders. Round 2 runs after a check of the AI balance (should read 44 credits used) | Founder |
| O9 | A second model to reflect "primarily men, inclusive of women" | Not in v1 | Founder |
| O10 | Hangtag artwork | Still TBC in every pack; not shown on the site | Founder |
