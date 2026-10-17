# digs storefront v1: review

Every page at 390 and 1440 in UI mode, then the wireframes (the same build in `data-mode="wire"`), then the Storybook index. Images are previews made from the tech pack. Prices read "Price TBA" (decision O1). Draft copy carries a small "draft" pill.

Start the site locally with `npm install && npm run dev` (mock data, no Shopify login), or open the branch in a GitHub Codespace (`.devcontainer/`). Build notes, decisions to confirm and known gaps: `docs/build-log.md`.

## UI pages

Captured by `npm run shots:ui` from the production build on the mock adapter, with the approved round-1 photography in place.

### Home `/`

| 390 | 1440 |
|---|---|
| ![home at 390](ui/home-390.png) | ![home at 1440](ui/home-1440.png) |

### Menu (open)

| 390 | 1440 |
|---|---|
| ![menu at 390](ui/menu-390.png) | ![menu at 1440](ui/menu-1440.png) |

### Cart drawer, "Your Digs" (open, empty)

| 390 | 1440 |
|---|---|
| ![cart-drawer at 390](ui/cart-drawer-390.png) | ![cart-drawer at 1440](ui/cart-drawer-1440.png) |

### Shop `/collections/all`

| 390 | 1440 |
|---|---|
| ![shop at 390](ui/shop-390.png) | ![shop at 1440](ui/shop-1440.png) |

### Product: Thermal Long Sleeve

| 390 | 1440 |
|---|---|
| ![product-thermal-long-sleeve at 390](ui/product-thermal-long-sleeve-390.png) | ![product-thermal-long-sleeve at 1440](ui/product-thermal-long-sleeve-1440.png) |

### Product: Pincord Button-Down

| 390 | 1440 |
|---|---|
| ![product-pincord-button-down at 390](ui/product-pincord-button-down-390.png) | ![product-pincord-button-down at 1440](ui/product-pincord-button-down-1440.png) |

### Product: Needlecord Shirt

| 390 | 1440 |
|---|---|
| ![product-needlecord-shirt at 390](ui/product-needlecord-shirt-390.png) | ![product-needlecord-shirt at 1440](ui/product-needlecord-shirt-1440.png) |

### Product: Drawstring Pant

| 390 | 1440 |
|---|---|
| ![product-drawstring-pant at 390](ui/product-drawstring-pant-390.png) | ![product-drawstring-pant at 1440](ui/product-drawstring-pant-1440.png) |

### Size guide modal (on the PDP)

| 390 | 1440 |
|---|---|
| ![size-guide-modal at 390](ui/size-guide-modal-390.png) | ![size-guide-modal at 1440](ui/size-guide-modal-1440.png) |

### Manifesto `/pages/manifesto`

| 390 | 1440 |
|---|---|
| ![manifesto at 390](ui/manifesto-390.png) | ![manifesto at 1440](ui/manifesto-1440.png) |

### Size guide `/pages/size-guide`

| 390 | 1440 |
|---|---|
| ![size-guide at 390](ui/size-guide-390.png) | ![size-guide at 1440](ui/size-guide-1440.png) |

### Shipping & returns

| 390 | 1440 |
|---|---|
| ![shipping-returns at 390](ui/shipping-returns-390.png) | ![shipping-returns at 1440](ui/shipping-returns-1440.png) |

### FAQ

| 390 | 1440 |
|---|---|
| ![faq at 390](ui/faq-390.png) | ![faq at 1440](ui/faq-1440.png) |

### Contact

| 390 | 1440 |
|---|---|
| ![contact at 390](ui/contact-390.png) | ![contact at 1440](ui/contact-1440.png) |

### Accessibility statement

| 390 | 1440 |
|---|---|
| ![accessibility at 390](ui/accessibility-390.png) | ![accessibility at 1440](ui/accessibility-1440.png) |

### Policies index

| 390 | 1440 |
|---|---|
| ![policies at 390](ui/policies-390.png) | ![policies at 1440](ui/policies-1440.png) |

### Policy page (privacy)

| 390 | 1440 |
|---|---|
| ![policy-privacy at 390](ui/policy-privacy-390.png) | ![policy-privacy at 1440](ui/policy-privacy-1440.png) |

### Account hand-off

| 390 | 1440 |
|---|---|
| ![account at 390](ui/account-390.png) | ![account at 1440](ui/account-1440.png) |

### Cart page (no-JS fallback)

| 390 | 1440 |
|---|---|
| ![cart at 390](ui/cart-390.png) | ![cart at 1440](ui/cart-1440.png) |

### 404

| 390 | 1440 |
|---|---|
| ![404 at 390](ui/404-390.png) | ![404 at 1440](ui/404-1440.png) |

## Wireframes

Captured by `npm run shots:wireframes`. Greyscale roles, media slots labelled with ratio and shot code, the scrawl in grey.

### Home `/`

| 390 | 1440 |
|---|---|
| ![home at 390](wireframes/home-390.png) | ![home at 1440](wireframes/home-1440.png) |

### Menu (open)

| 390 | 1440 |
|---|---|
| ![menu at 390](wireframes/menu-390.png) | ![menu at 1440](wireframes/menu-1440.png) |

### Cart drawer, "Your Digs" (open, empty)

| 390 | 1440 |
|---|---|
| ![cart-drawer at 390](wireframes/cart-drawer-390.png) | ![cart-drawer at 1440](wireframes/cart-drawer-1440.png) |

### Shop `/collections/all`

| 390 | 1440 |
|---|---|
| ![shop at 390](wireframes/shop-390.png) | ![shop at 1440](wireframes/shop-1440.png) |

### Product: Thermal Long Sleeve

| 390 | 1440 |
|---|---|
| ![product-thermal-long-sleeve at 390](wireframes/product-thermal-long-sleeve-390.png) | ![product-thermal-long-sleeve at 1440](wireframes/product-thermal-long-sleeve-1440.png) |

### Product: Pincord Button-Down

| 390 | 1440 |
|---|---|
| ![product-pincord-button-down at 390](wireframes/product-pincord-button-down-390.png) | ![product-pincord-button-down at 1440](wireframes/product-pincord-button-down-1440.png) |

### Product: Needlecord Shirt

| 390 | 1440 |
|---|---|
| ![product-needlecord-shirt at 390](wireframes/product-needlecord-shirt-390.png) | ![product-needlecord-shirt at 1440](wireframes/product-needlecord-shirt-1440.png) |

### Product: Drawstring Pant

| 390 | 1440 |
|---|---|
| ![product-drawstring-pant at 390](wireframes/product-drawstring-pant-390.png) | ![product-drawstring-pant at 1440](wireframes/product-drawstring-pant-1440.png) |

### Size guide modal (on the PDP)

| 390 | 1440 |
|---|---|
| ![size-guide-modal at 390](wireframes/size-guide-modal-390.png) | ![size-guide-modal at 1440](wireframes/size-guide-modal-1440.png) |

### Manifesto `/pages/manifesto`

| 390 | 1440 |
|---|---|
| ![manifesto at 390](wireframes/manifesto-390.png) | ![manifesto at 1440](wireframes/manifesto-1440.png) |

### Size guide `/pages/size-guide`

| 390 | 1440 |
|---|---|
| ![size-guide at 390](wireframes/size-guide-390.png) | ![size-guide at 1440](wireframes/size-guide-1440.png) |

### Shipping & returns

| 390 | 1440 |
|---|---|
| ![shipping-returns at 390](wireframes/shipping-returns-390.png) | ![shipping-returns at 1440](wireframes/shipping-returns-1440.png) |

### FAQ

| 390 | 1440 |
|---|---|
| ![faq at 390](wireframes/faq-390.png) | ![faq at 1440](wireframes/faq-1440.png) |

### Contact

| 390 | 1440 |
|---|---|
| ![contact at 390](wireframes/contact-390.png) | ![contact at 1440](wireframes/contact-1440.png) |

### Accessibility statement

| 390 | 1440 |
|---|---|
| ![accessibility at 390](wireframes/accessibility-390.png) | ![accessibility at 1440](wireframes/accessibility-1440.png) |

### Policies index

| 390 | 1440 |
|---|---|
| ![policies at 390](wireframes/policies-390.png) | ![policies at 1440](wireframes/policies-1440.png) |

### Policy page (privacy)

| 390 | 1440 |
|---|---|
| ![policy-privacy at 390](wireframes/policy-privacy-390.png) | ![policy-privacy at 1440](wireframes/policy-privacy-1440.png) |

### Account hand-off

| 390 | 1440 |
|---|---|
| ![account at 390](wireframes/account-390.png) | ![account at 1440](wireframes/account-1440.png) |

### Cart page (no-JS fallback)

| 390 | 1440 |
|---|---|
| ![cart at 390](wireframes/cart-390.png) | ![cart at 1440](wireframes/cart-1440.png) |

### 404

| 390 | 1440 |
|---|---|
| ![404 at 390](wireframes/404-390.png) | ![404 at 1440](wireframes/404-1440.png) |

## Storybook components

Run `npm run storybook` and open http://localhost:6006. Toolbar: **Mode** (UI / Wireframe) and **Viewport** (390 / 768 / 1024 / 1440). Every story is checked by the a11y addon and by `npm run test:visual -- --grep @stories` (axe at both sizes in both modes).

### Foundation

| Component | Stories |
|---|---|
| `Marks` | 14: Wordmark · blue on ice, Wordmark · ice on blue, Wordmark · ice on black, Wordmark · edge to edge, Lockup · inline on ice, Lockup · inline on blue, Lockup · stacked on blue, Lockup · inline on black, Lockup · stacked on ice, Brandmark · blue, black, ice, Script · inline in a headline, Script · draw-on (600ms, off under reduced motion), Script · every word, Script · on black (currentColor) |
| `Tokens` | 1: All tokens |

### Core

| Component | Stories |
|---|---|
| `Accordion` | 6: Collapsed, Expanded · Details open (PDP default), Single · one open at a time, All expanded, Focus (forced on the first trigger), Hover (forced on the first trigger) |
| `AnnouncementBar` | 4: Default, Dismissed (renders nothing), Not dismissible, Interactive · dismiss, then bring it back |
| `Badge` | 7: All five statuses, new, coming-soon, pre-order, low-stock (signal color), sold-out (signal color, struck), On a media slot (card position) |
| `Breadcrumb` | 4: Shop / product (PDP), Home / Shop / product, Single item (current page only), Wraps at 390 |
| `Button` | 15: All variants × sizes × shapes, Primary · sizes × shapes, Secondary · sizes × shapes, Ghost · sizes × shapes, On-dark · sizes × shapes, State · default, State · hover (forced), State · pressed (forced), State · focus-visible (forced), State · disabled, State · loading, All states × variants, Full width · block (PDP buy button), Caps tracking (short labels), As a link (to) · internal and external |
| `CartLine` | 6: Default, Updating · quantity change in flight, Removing · line fading out, Error · "That didn't update. Try again.", All states, Interactive · two lines, stepper and remove |
| `CartSummary` | 4: Default · subtotal TBA, checkout disabled with note, Free-shipping progress · UI slot (example threshold), Zero subtotal (empty cart shape), Checkout enabled (later phase) |
| `Drawer` | 6: Right · open (cart, two lines), Right · open, empty cart, Full · open (menu, page tone), Closed · opens from a trigger, Right · closing (forced mid-transition), Full · closing (forced mid-transition) |
| `EmptyState` | 5: Cart · "Your Digs are empty.", Filter · "Nothing here yet.", Filter · everything spoken for, 404 · "This page doesn't exist.", 404 · without the script word |
| `Field` | 10: Default · empty, Focus (forced), Filled, Error · announced (role=alert, aria-invalid), Success · check icon and status line, Disabled, Text input · hint, required marker, Hidden label (inline newsletter), On black · default / filled / disabled, All states |
| `Header` | 6: Solid · Shop is the current route, Solid · 3 in the cart, Transparent · over the home hero (ice on blue), Scrolled · transparent turned solid after 24px, Menu open · full drawer over the header, Minimal · brand slot only |
| `IconButton` | 11: All icons (plain · md), Variants · plain / outline / filled / on-dark, Sizes · sm / md / lg (44px minimum target), On-dark · on the inverse surface, State · default, State · hover (forced), State · pressed (forced), State · focus-visible (forced), State · disabled, State · loading (aria-busy), All states × variants |
| `Link` | 8: Inline · in running text, Inline · default / hover / visited / focus (forced), Nav · with the current route (aria-current), Nav · default / hover / focus (forced) / current, Footer · the four groups, Footer · on black, Footer · default / hover / focus (forced), External · opens in a new tab |
| `MediaSlot` | 8: Loaded · P-TLS-01 Off White (approved photo), Loading (state="loading"), Error (state="error") · falls back to the labelled placeholder, Placeholder · no image yet (P-TLS-03, side), Ratios · 9:16 and 16:9 hero crops, 3:4 and 4:5 placeholders, All states · loaded / loading / error / placeholder, With overlay content (badge in the slot), fit="contain" (zoom view) |
| `Modal` | 5: Generic · open (md), Size guide · open (lg, SizeChart inside), Full · image zoom (title hidden), Closed · opens from a trigger, Closing (forced mid-transition) |
| `NewsletterForm` | 10: Inline · idle, Inline · submitting, Inline · success, Inline · error, Footer · idle, Footer · submitting, Footer · success, Footer · error, On black · idle / submitting / success, Interactive · idle → submitting → success / error |
| `Price` | 6: TBA (price: null, the real state), Regular · example amounts, Sale · example amounts, From · example amounts, Sizes · sm / md / lg, All states |
| `ProductCard` | 9: Grid · default (coming-soon badge, two colorways, Price TBA), Grid · the capsule (2 up at 390, 4 up at 1440), Grid · hover (forced: second image shown), Loading skeleton, Sold out · dimmed media, struck badge, Grid · before photos are approved, Mini · cart and cross-sell, Mini · the capsule in the empty cart, Mini · loading skeleton |
| `ProductGallery` | 7: Default · 7 slots, Off White, Default · 7 slots, Sand Blue, Zoomed · full-screen modal on the first slot, Zoomed · on a placeholder slot, Loading, Single image · no controls, no counter, Active index · starts on slot 3 |
| `QuantityStepper` | 6: Default · 2, Min · 1 (decrease disabled), Max · 5 of 5 (increase disabled), Disabled, Updating (aria-busy, dimmed), All states |
| `SegmentedControl` | 5: Default · All selected, with counts, Selected · Tops, Focus (forced on the selected segment), Without counts, Units · in / cm (size chart toggle) |
| `SizeChart` | 7: Tops · Thermal Long Sleeve · in, Tops · Thermal Long Sleeve · cm, Bottoms · Drawstring Pant · in, Bottoms · Drawstring Pant · cm, Selected size column · M, Interactive · one unit toggle for both tables, Without a title (inside the size-guide modal) |
| `SizeSelector` | 7: Available · nothing selected, Selected · M, Sold out · M selected → "Hold my size", Sold out · struck sizes, nothing selected, Disabled, Error · "Select a size", Without the size-guide aside |
| `Skeleton` | 6: Text · 3 lines, Text · 1 / 2 / 5 lines, Media · 4:5, labelled "Loading", Media · 4:5 / 1:1 / 16:9 (decorative), Card · media + two lines, Card · shop grid while loading |
| `SwatchGroup` | 7: md (PDP) · name shown, sm (cards) · interactive, Selected · 2px ring with gap, Unavailable · diagonal strike, Focus (forced on the first swatch), Read-only (cards: shown, not interactive; tooltip names), All five capsule colorways (density check) |
| `Toast` | 6: Added to cart · enter, Generic · enter, Added to cart · exit (forced), Generic · exit (forced), Stacked · three in the queue, Interactive · through OverlayProvider |

### DIGS

| Component | Stories |
|---|---|
| `BlueFrame` | 5: Portrait · E-02 photo, Portrait · placeholder (4:5 · E-02), Landscape · E-02 photo (16:9 crop), Landscape · placeholder (16:9 · E-02), Adaptive · portrait on mobile, 16:9 crop from 1024px (home) |
| `BuiltLikeThis` | 7: Thermal Collapsed, Thermal Hotspot Active, Thermal All Open, Thermal Teaser, Pant Collapsed, Pant Hotspot Active, Pant All Open |
| `CartDrawer` | 2: Open · empty (shows the capsule), Filled |
| `FooterWordmark` | 2: Light · blue on ice, Dark · ice on black |
| `HeroWordmark` | 2: Placeholder slots · H-01 9:16 (mobile) and 16:9 (desktop), Approved photos · H-01 9:16 and 16:9 |
| `Manifesto` | 4: Stacked (mobile default), Stacked · with the home heading, Grid (2×2 on desktop), Fullscreen · E-01, E-02, E-03 approved, E-04 placeholder |
| `MarginRails` | 3: On light · desktop only (hidden under 1024px by design), On dark · desktop only (hidden under 1024px by design), Auto tone · flips over data-rail-tone="dark" sections on scroll (desktop only) |
| `Menu` | 6: Open, Active Shop, Active Manifesto, Active Cart, Active Instagram, Closed · trigger button |
| `Overline` | 4: Default, On dark, On brand, In context · above a section head |
| `PosterWall` | 6: Mixed · blue, photo, black, ice, wordmark (home set), Blue tiles, Black tiles, Ice tiles, Wordmark tiles · blue, black, ice, Photo tiles · E-01, E-02, E-03 approved, E-04 placeholder |
| `ScrawlOver` | 6: Blue · density 1, Blue · density 2, Blue · density 3, Black · density 1, Black · density 2, Black · density 3 |
| `SiteFooter` | 3: Idle, Newsletter · success, Newsletter · error |
| `SiteHeader` | 5: Solid · cart 0, Solid · cart 3, Solid · scrolled, Transparent · over a brand block (home hero), Transparent · scrolled (turns solid) |
| `Sticker` | 7: DD · sizes × tones, Actually Dope · sizes × tones, d!gs dot · sizes × tones, Trim L3 · sizes × tones, Trim · every code in the tech packs, Rotation · −12°, 0°, +12°, Drop-on entrance (300ms; none under reduced motion) |
| `StrikeRewrite` | 4: Blue · ordinary → dope, Black · ordinary → dope, On black · blue stroke, script in ice, Struck only · the "We are not" list (manifesto page) |
| `StyleString` | 5: Thermal, Pincord, Needlecord, Pant, All four |
| `TaglineBand` | 5: Line 0, Line 1, Line 2, Line 3, Line 4 |
| `TrimToken` | 7: Ink · sm, md, lg, Ink · active, Blue · sm, md, lg, Blue · active, Ice on black · sm, md, lg, Ice on black · active, Ice on blue · sm, md, lg |
| `Wallpaper` | 6: Stacked · 6% (the ceiling behind content) · blue, black, ice, Stacked · 100% · blue, black, ice, Offset · 6% · blue, black, ice, Offset · 100% · blue, black, ice, Scrawl · 6% · blue, black, ice, Scrawl · 100% · blue, black, ice |

### Pages

| Component | Stories |
|---|---|
| `Pages` | 33: Home, Home · menu open, Home · cart drawer, empty, Home · cart drawer, filled, Shop, Shop · Tops filter, Shop · loading skeleton, Shop · empty filter result, Shop · all sold out, Product · Thermal Long Sleeve, Product · Thermal, Sand Blue, Product · Pincord Button-Down, Product · Needlecord Shirt, Product · Drawstring Pant, Product · size not selected (error), Product · available, size M, Product · adding, Product · pre-order, Product · sold out (Hold my size), Product · size guide modal, Manifesto, Size guide, Shipping & returns, FAQ, Contact, Accessibility, Policies, Policy · privacy, Account, Cart page · empty, Cart page · filled, 404, Dev · tokens |

**318 stories across 48 components/pages.**
