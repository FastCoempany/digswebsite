# 02 · Puff Junction: structure and attitude

**Greenlit source:** Figma file "Puff Junction UI-UX", page **UI** (`71:61`):
<https://www.figma.com/design/hQs2j96iPy37t2w4TV3eoi/Puff-Junction-UI-UX?node-id=71-61>

Screens saved in `reference/puff-junction/`:
`pj-home-71-62.webp` · `pj-menu-hero-75-102.webp` · `pj-shop-111-582.webp` · `pj-pdp-111-1069.webp` · `pj-about-111-293.webp` · `pj-ui-page-overview.webp`

What the file is: three pages (Wireframe, UI, Components), desktop only at 1440px, no mobile frames. It has no color variables or text styles, and 35 loose components with names like "div" and "Group 121383". The designer's component/handoff milestone was never started. **There is no PJ component system to inherit.** DIGS takes the ideas below and builds its own system.

## Take: structure and attitude

| PJ move (where) | What it does | DIGS version |
|---|---|---|
| **Manifesto before product** (home: "PHILOSOPHY" section right after the hero) | Sells the worldview before the goods | "Dope is good." manifesto block right after the hero, using BOAST manifestos 1–4. One idea per screen on mobile. |
| **Giant wordmark hero** (menu/hero frame: "PUFF JUNCTION" set huge, a figure breaking through the letters) | The name is the hero; the photo collides with the type | The `digs` wordmark edge to edge, the "Actually Dope" scrawl driven across it, and the model cut in front of or behind the letters. |
| **Stickers** (I ♥ PJ's badge, ring badge, "PUFF !" caution sign) | Playful stamps that break the grid | DD brandmark sticker, "Actually Dope" scrawl sticker, `d!gs` dot badge, and tech-pack trim tokens (L1, L3, L4 circles) as product hotspots. |
| **Rotated margin text** ("THE BEST IS YET TO COME" vertical; "SCROLL FOR MORE" up the gallery edge; "LET THE GOOD TIMES ROLL" overline) | A second voice running along the edges | Vertical rails on desktop: left `DOPE IS GOOD — DESIGNED IN USA — @DOPEISGOOD`, right `CAPSULE 01 — DOPEISGOOD.COM`. On mobile, a thin overline above section heads and one vertical rail on the PDP gallery ("SWIPE"). |
| **Named CTAs** ("Take a trip", "Add to Stash", "Explore Our Story") | The verbs carry the brand | "Dig in" (enter shop), "Add to Digs" (add to cart), "Your Digs" (cart), "Hold my size" (back in stock), "Get on the list" (drop or pre-launch list), "Stay dope" (newsletter). See `08-copy.md`. |
| **Menu as stacked blocks** (MENU card + bordered ABOUT / SHOP / CONNECT blocks) | Navigation as a graphic object | Full-screen menu: stacked full-width blocks (Shop, Manifesto, Your Digs, Instagram), each a huge Alexandria word. Blue on ice; the hovered or focused block flips to ice on blue with a scrawl underline. |
| **Tagline band + footer** ("HIGH ART, HIGH TIMES" on near-black, then footer) | Closes every page with the ethos | Black band with a BOAST line ("Built for those who chase excellence.") and one CTA, then the footer, then the **edge-to-edge wordmark** (BOAST rule). |
| **Watermark wordmark** (huge faint "PUFF JUNCTION" behind the PDP) | Brand presence on product pages | Faint `digs` wallpaper pattern behind the "Built like this" section, at most 6% opacity on ice. |
| **Product grid of tiles** with category label, short line, CTA | Simple, scannable | Same skeleton with DIGS mechanics: colorway count, swatches, price or "Price TBA", status badge, hover/second-image swap. |
| **PDP layout** (big image + thumbnail column + info panel with tags, price, Wishlist + Add to Stash, About, Specs, Related) | Image-led product page | Same order, mobile-first: gallery, title, price, colorway, size, Add to Digs (sticky on mobile), Details / Fit / Care accordions, **Built like this**, the other three products. |
| **Phone-number gag** ("1-800-CALL-PUFF") | A wink | Optional, later: a "DOPE IS GOOD" stamp. Not in v1. |

## Don't take

- **PJ colors:** Slime `#D6FD4A`, Dream `#A5E4FF`, Flamingo `#FF8FF1`, Pineapple `#FEF200`. None of these values appear anywhere in this repo's tokens.
- **Halftone**, comic pop-art illustration, cloud imagery and the cloud-headed figure, the smiley bong illustration.
- **PJ type:** Arnet (the Figma uses a trial cut) and Work Sans. DIGS uses Alexandria and The Old Falcons only.
- **PJ button style:** thick outline with a hard offset shadow. DIGS buttons are pill shapes (from BOAST's pill bar) or square-edged blocks, flat.
- **Rounded keyline panels.** DIGS frames are square-edged; the blue frame is BOAST's billboard border.
- **The placeholder copy in the PJ file** (Lorem ipsum, a furniture brand's "From a studio in London…" text). Never reuse it.

## How to test that it isn't a copy

Put any DIGS screen next to the PJ screen it borrows from. The **layout logic** should be recognisable (manifesto first, giant name, stickers, rails). The **surface** (color, type, texture, imagery, button style) should be unmistakably BOAST-DIGS. If a screenshot could pass for Puff Junction with the logo swapped, it fails.
