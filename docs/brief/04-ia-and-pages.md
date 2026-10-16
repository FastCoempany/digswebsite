# 04 · Site map and page templates

Mobile first: every template is designed and built at **390px** first, then 768, 1024 and 1440. Media slots are named `[SLOT ratio shot-code]`; shot codes match `07-photography.md`.

## Site map (capsule size)

```
/                              Home
/collections/all               Shop: all four products   (alias /shop)
/products/thermal-long-sleeve  Product
/products/pincord-button-down  Product
/products/needlecord-shirt     Product
/products/drawstring-pant      Product
/pages/manifesto               Dope is good: the brand page
/pages/size-guide              All four size charts, cm/in
/pages/shipping-returns        Shipping & returns
/pages/faq                     FAQ
/pages/contact                 Contact
/pages/accessibility           Accessibility statement
/policies/*                    Shopify policies (privacy, terms, refund, shipping)
/account                       Hands off to Shopify customer accounts
(cart)                         Drawer on every page; /cart page as no-JS fallback
/404                           Not found
```

Global chrome on every page: announcement bar (optional), header, full-screen menu, cart drawer ("Your Digs"), black tagline band, footer, edge-to-edge wordmark, and desktop margin rails.

## Global chrome

**Announcement bar** (optional, one line): ice text on Digs Blue. Content is set per drop, e.g. "Capsule 01. Pre-order now. Ships [date]." Dismissible. It never stacks with another bar.

**Header** (56px):
- Mobile: menu button (left) · wordmark, centered, 28px tall · "Your Digs (n)" (right, shown as "Digs (n)" under 360px).
- Desktop: Shop · Manifesto (left) · wordmark (center) · Account · Your Digs (n) (right).
- It sits transparent over the home hero (ice wordmark) and turns solid ice with a hairline border after 24px of scroll. On other pages it is solid from the start.

**Menu**: full screen, slides down at 300ms. Stacked full-width blocks, each a single huge Alexandria word: SHOP / MANIFESTO / YOUR DIGS / INSTAGRAM. Below them, two lines of small print (shipping, contact) and the DD sticker. Focus is trapped while open; Esc closes it.

**Cart drawer ("Your Digs")**: right side on desktop (420px), full screen on mobile. States: empty (one line plus the four products as mini cards), filled (line items with colorway, size, qty stepper, remove; subtotal; checkout button), updating, error. A free-shipping progress slot stays hidden until terms exist. Checkout hands off to Shopify; nothing is wired in this phase.

**Margin rails** (1024px and up): 40px rails left and right; caps micro text rotated 90°; fixed position; ink-600 on ice, ice on black sections.

**Tagline band**: black, one BOAST line in Alexandria display, one CTA. It rotates through approved lines (`08-copy.md`).

**Footer**: four short groups (Shop, Help, Brand, Legal), the "Stay dope" sign-up, `@dopeisgood`, ©. Then the **edge-to-edge wordmark** in Digs Blue on ice, full bleed.

## Home `/`

1. **Hero**: `digs` wordmark edge to edge (blue on ice), the "Actually Dope" scrawl drawn across it at −9°, and the model cut out in front of the letters `[SLOT 9:16 mobile / 16:9 desktop H-01]`. Overline: `CAPSULE 01`. CTA: **Dig in** → `/collections/all`. On mobile the wordmark spans the full width at the top and the photo sits beneath, overlapping by about 25%.
2. **Manifesto**: "Dope is good." set display-xl, with "good" as a script SVG. Then the four BOAST manifestos as numbered blocks (01–04), one per screen on mobile and a 2×2 grid on desktop; each has one line of supporting copy. Link: "Read the manifesto" → `/pages/manifesto`.
3. **The capsule**: four product tiles (2×2 on mobile, 4-up on desktop) `[SLOT 4:5 P-xx-01]`, with a DD sticker on the first tile. Status badges show.
4. **Built like this** (teaser): one product flat (a tech-pack style line drawing) with three hotspots (L3 embroidery, rib, yoke) and red leader lines to caps callouts `[SLOT 1:1 D-01]`. Link to the thermal PDP.
5. **Blue frame editorial**: one full-bleed editorial photo inside a Digs Blue frame `[SLOT 4:5 E-02]`, headline top-left ("Wear your *story*."), wordmark bottom-left, stacked footer bottom-right.
6. **Poster wall**: 3–6 poster tiles in a horizontal scroll on mobile and a grid on desktop. Each is one idea in one color: blue, black or ice tiles carrying BOAST lines, the wordmark wallpaper, or a photo `[SLOT 4:5 E-03..]`.
7. **Stay dope**: email sign-up. "Get first access to every drop." Input + "Stay dope" button. Success and error states.
8. Tagline band → footer → edge-to-edge wordmark.

## Shop `/collections/all`

1. Overline `CAPSULE 01`, heading "The Capsule", a one-paragraph drop note (founder voice).
2. Segmented control: All · Tops · Bottoms.
3. Grid: 2 columns on mobile, 4 on desktop. Cards: image `[4:5 P-xx-01]` with a hover/second-image swap `[P-xx-02]`, name, colorway count ("2 colors"), swatches, price or "Price TBA", badge.
4. Editorial tile in the grid (desktop only, position 3): blue frame photo + a BOAST line.
5. Tagline band → footer.

States: loading skeleton (ice-100 blocks), empty filter result ("Nothing here yet. See all."), all sold out.

## Product `/products/[handle]`

Mobile order:
1. Breadcrumb (small): Shop / Thermal Long Sleeve.
2. **Gallery**: swipe carousel with a counter `1 / 7`, a vertical "SWIPE" rail on the left edge, and tap to zoom. Order: front on-body, back on-body, side, detail macro, detail macro, flat, editorial `[4:5 P-xx-01..07]`. Desktop: two-column image grid on the left (60%), sticky info panel on the right (40%).
3. Style string (tech-pack grammar, micro caps): `AC-LST-001 | LONG SLEEVE TEE | S–XL`.
4. Title + colorway: "Thermal Long Sleeve, Off White".
5. Price or "Price TBA"; pre-order note ("Pre-order. Ships [date].") when set.
6. **Colorway** swatches with names (keylined).
7. **Size**: S M L XL buttons; a sold-out size shows struck through with "Hold my size". Link: "Size guide" opens the modal (cm/in toggle, from the graded spec).
8. **Add to Digs** (primary pill, full width). On mobile it becomes a sticky bottom bar once scrolled past, showing the price and selected size.
9. Shipping line slot (hidden until terms exist).
10. Accordions: **Details** (fabric, finish, construction bullets), **Fit & size** (fit note + key measurements for the selected size), **Care** (label copy), **Shipping & returns**.
11. **Built like this**: the product flat with hotspots from `builtLikeThis` in the product JSON. Tap a hotspot to open a callout card (code token, label, spec, where). Faint wordmark wallpaper behind it.
12. **Complete the capsule**: the other three products.
13. Tagline band → footer.

States: default, colorway switching (images cross-fade), size not selected (button reads "Select a size"), adding, added (toast + drawer opens), sold out (button becomes "Hold my size"), pre-order, coming soon (button becomes "Get on the list"), error.

## Manifesto `/pages/manifesto`

1. Giant headline: "Redefining what it means to be *dope*."
2. Brand narrative (BOAST: "More than a streetwear brand…") set large, two short paragraphs.
3. Manifestos 01–04, full-screen each on mobile, each with an editorial photo `[3:4 E-0x]`.
4. "The DIGS standard": excellence, authenticity, ambition, innovation, empowerment, as one line each.
5. "We are / We are not" (a short selection of BOAST pairs) in two columns, with the "we are not" side struck through by scrawl.
6. Quiet effectiveness: the founder's line about impact felt rather than seen.
7. CTA "Dig in" → shop. Tagline band → footer.

## Utility pages

Size guide (four tables, cm/in toggle, how-to-measure diagrams from the tech packs' "How to measure" pages, redrawn), Shipping & returns, FAQ (accordions), Contact (email + form UI, not wired), Accessibility statement, 404 ("This page isn't dope. Back to the capsule." + the four products).

## Wireframe mode

Every template also renders in **wireframe mode** (`<html data-mode="wire">`): greyscale roles, media slots shown as hatched blocks labelled with their ratio and shot code, and the scrawl in grey. The wireframe deliverable is the same build in this mode, captured at 390 and 1440.
