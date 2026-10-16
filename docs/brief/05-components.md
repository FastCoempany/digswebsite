# 05 · Components

Two layers, enforced by folder:

- **`app/components/core/`**: store mechanics that work the same for any brand. They read **semantic tokens only** (`--color-surface-*`, `--color-text-*`, `--color-action-*`, `--space-*`, `--radius-*`…) and **never import from `digs/`**. This is the part Puff Junction and Darkest Shades can reuse later, re-skinned by swapping tokens.
- **`app/components/digs/`**: the DIGS brand layer: wordmark hero, scrawl, stickers, rails, manifesto, Built like this, blue frame, poster wall. These may use core components and brand tokens.

Every component ships with a story for **every state listed** (Storybook), at 390px and 1440px, in UI mode and wireframe mode.

## Core

| Component | Variants | States | Notes |
|---|---|---|---|
| `Button` | primary (blue), secondary (black), ghost (ink outline), on-dark (ice) · sizes sm/md/lg · pill or block | default, hover, pressed, focus-visible, disabled, loading | 44px minimum touch target. Label in Alexandria Medium, caps tracking optional. |
| `IconButton` | menu, close, plus/minus, chevron | same as Button | Needs an accessible name. |
| `Link` | inline, nav, footer | default, hover, visited (inline only), focus | Underlined inline. |
| `Badge` | new, coming-soon, pre-order, low-stock, sold-out | — | Signal colors only for low-stock and sold-out. Text plus color, never color alone. |
| `Price` | regular, sale (strike-through + sale color), TBA, from | — | Reads `price: null` as "Price TBA". |
| `SwatchGroup` | sm (cards), md (PDP) | default, selected (2px ink ring with gap), unavailable (diagonal strike), focus | Every swatch has an `ink-300` keyline. Name shown on PDP; tooltip on cards. |
| `SizeSelector` | buttons | available, selected, sold-out (strike-through + "Hold my size"), disabled, error ("Select a size") | Radio group semantics. |
| `QuantityStepper` | — | default, min, max, disabled, updating | |
| `ProductCard` | grid, mini (cart, cross-sell) | default, hover (second image), loading skeleton, sold out | Media slot 4:5. |
| `ProductGallery` | mobile carousel with counter, desktop grid | default, zoomed, loading, single image | Swipe, arrow keys, pinch-zoom; counter "1 / 7". |
| `Accordion` | — | collapsed, expanded, focus | One open at a time is optional per use. |
| `Modal` | size-guide, generic | open, closing | Focus trap, Esc closes. |
| `Drawer` | right (desktop), full (mobile) | open, closing | Used by cart and menu. |
| `CartLine` | — | default, updating, removing, error | |
| `CartSummary` | — | default, free-shipping progress (hidden until terms exist) | |
| `EmptyState` | cart, filter, 404 | — | Slot for a script word. |
| `SegmentedControl` | — | default, selected, focus | Shop filter. |
| `SizeChart` | tops, bottoms | in / cm | Data from `content/products/specs/*.json`, filtered to customer POMs. |
| `Field` (input, email) | — | default, focus, filled, error, success, disabled | `ink-500` borders (3:1). |
| `NewsletterForm` | inline, footer | idle, submitting, success, error | UI only; not wired. |
| `Toast` | added-to-cart, generic | enter, exit | `aria-live` polite. |
| `Skeleton` | text, media, card | — | Ice-100 blocks, no shimmer under reduced motion. |
| `MediaSlot` | image, video | loaded, loading, error, wire | Renders `data-media-slot="4:5 · P-TLS-01"` so wireframe mode labels it. |
| `Breadcrumb` | — | — | |
| `AnnouncementBar` | — | default, dismissed | |
| `Header` | transparent (home hero), solid | scrolled, menu-open | |

## DIGS layer

| Component | What it is | States / variants | Source |
|---|---|---|---|
| `Wordmark` | Inline SVG from `brand/logos/wordmark` | blue, black, ice · sizes · `edge-to-edge` (fills container width) | BOAST |
| `Lockup` | Wordmark + "Actually Dope" scrawl | inline, stacked · picks the right color pair for its surface | BOAST p8–10 |
| `Brandmark` | DD mark | blue, black, ice | BOAST p11–13 |
| `Script` | Renders a pre-built script SVG word (`brand/script/`) inline with sans text, sized to the line | color from `currentColor`; optional draw-on (stroke reveal 600ms; none under reduced motion) | The Old Falcons via `tools/script_svg.py` |
| `ScrawlOver` | Marker scrawl laid over a headline (e.g. "fashion" repeated), decorative, `aria-hidden` | blue, black · density 1–3 | BOAST social posts |
| `StrikeRewrite` | Strike a word and rewrite it in script ("~~ordinary~~ *dope*") | — | BOAST stories |
| `Sticker` | Angled stamp: DD, "Actually Dope", `d!gs` dot, trim token | rotation −12° to +12°, sizes, `drop-on` entrance | PJ attitude, DIGS marks |
| `MarginRails` | Rotated caps text on the left and right edges (desktop) | on-light, on-dark | PJ attitude |
| `Overline` | Micro caps label above a section ("CAPSULE 01") | — | |
| `HeroWordmark` | Home hero: edge-to-edge wordmark, scrawl, model cut-out, CTA | mobile stack, desktop collision · wire | PJ menu/hero frame + BOAST |
| `Manifesto` | Numbered manifesto blocks 01–04 | stacked (mobile), grid (desktop), full-screen (manifesto page) | BOAST strategy |
| `BuiltLikeThis` | Tech-pack line drawing + hotspots + callout cards with leader lines | collapsed, hotspot-active, all-open (print) | Tech packs (flats, trim tokens, POM language) |
| `TrimToken` | Small coded circle (L1, L3, L4, T1…) used in Built like this and as stickers | — | Tech packs |
| `StyleString` | `AC-LST-001 \| LONG SLEEVE TEE \| S–XL` micro caps line | — | Tech-pack header |
| `BlueFrame` | Photo inside a Digs Blue border with headline, wordmark and stacked footer | portrait, landscape | BOAST billboard |
| `PosterWall` | Grid or scroller of single-idea posters | blue, black, ice, photo tiles | BOAST poster mockups |
| `Wallpaper` | Wordmark or scrawl pattern background (CSS/SVG, not the raster files) | stacked, offset, scrawl · opacity | BOAST patterns |
| `TaglineBand` | Black band with one BOAST line + CTA | rotates through approved lines | PJ attitude |
| `FooterWordmark` | Edge-to-edge wordmark at the very bottom | blue on ice, ice on black | BOAST "do" |
| `Menu` | Full-screen stacked block menu | open, closed, item hover/focus (flips to ice on blue + scrawl underline) | PJ attitude |

## Behavior rules

- **Motion:** hover/press 150ms; drawers and menus 300ms; hero reveal and scrawl draw-on 600ms. All of it is cut back under `prefers-reduced-motion`.
- **Accessibility:** WCAG 2.2 AA. Visible focus on everything; 44px targets; decorative scrawl, stickers and patterns are `aria-hidden`; script words carry `aria-label` with the word; cart and toasts announce changes; the carousel has buttons as well as swipe.
- **No hard-coded color.** A component with a hex value in it fails review. Brand-layer components may use core and tonal tokens; core components use roles only.
- **Images** always go through `MediaSlot` with an explicit ratio, so the layout never jumps and wireframe mode works.
