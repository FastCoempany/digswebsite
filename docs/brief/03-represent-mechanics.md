# 03 · Represent: retail mechanics, sized for a capsule

Represent (representclo.com) is the retail muse: how the store works, how products are presented, how photography feels. BOAST's own competitor page names Represent "the quality-driven brand". DIGS's stated edge over it is multifunctional pieces and a closer connection to its audience's background.

Observed Oct 16 2026 on the homepage, the New Arrivals listing and a product page (the Owners Club T-Shirt). Represent runs on Shopify.

## What Represent does (observed)

- **Navigation:** two sub-brands (Represent and 247) with their own mega-menus; New Arrivals, Bestsellers, the season drop, Restocked; Shop with clothing categories, collections, collaborations, footwear, accessories, gift card, "Outfits" (curated looks) and Womens; Recently Viewed; Explore (loyalty programme, behind the brand, lookbooks, articles, stores, café). Utility: wishlist, account, cart, region and currency.
- **Homepage:** split hero banners per sub-brand (video or still, two CTAs each), loyalty sign-up blocks, footer. The cart drawer is pre-rendered with an empty state and popular items.
- **Listing page:** heading plus an editorial intro paragraph for the drop; filters for category, size (split by tops, bottoms, denim, footwear), color family and price; sort by newest, popular, price. Cards show collection name, product name, colorway name, color count, price ("From"), size run, and status badges (App Exclusive, Sold out, Coming Soon). Featured-collection tiles sit in the grid.
- **Product page:** breadcrumb; numbered image carousel ("1 / 11"); title with colorway in it; price with a sale state and savings badge; pre-order note with a ship date; colorway selector, where **each colorway is its own product URL**; size buttons with a "Size not in stock?" back-in-stock link; size chart in a modal with a cm/in toggle and garment measurements per size; model height and size worn; Add to Cart; free-shipping threshold; buy-now-pay-later lines (Shop Pay, Klarna, Afterpay); description with "Read more"; accordions for product details (composition, weight, style code), FAQs (fit advice, washing) and shipping & returns; "You may also like" in tabs; reviews with an AI summary; recently viewed.
- **Footer:** client services (live chat, support hub, track order, returns), company, social, region selector, app download, legal (including accessibility statement).

## What DIGS takes, and how big

| Represent mechanic | DIGS v1 | Why sized this way |
|---|---|---|
| Mega-menus, sub-brands, collabs, outfits, café | **No.** One full-screen block menu: Shop, Manifesto, Your Digs, Instagram | 4 products; empty mega-menus look dead |
| New / Bestsellers / Restocked tabs | **No.** "Capsule 01" is the only drop | Nothing to sort yet |
| Editorial intro on the listing | **Yes.** A one-paragraph drop note in the founder's voice above the grid | Story-driven brand; costs nothing |
| Filters and sort | **Minimal.** A segmented control: All · Tops · Bottoms. No sort | 3 tops, 1 bottom |
| Status badges | **Yes:** Coming soon, Pre-order, Low stock, Sold out, New | Pre-order is a stated BOAST value (less waste) |
| Colorway name in the title, color count on cards | **Yes** | Thermal has 2 colorways; others 1, with more planned |
| Colorway = its own URL | **Variant**, not a separate product: one product per style with Color and Size options; the URL updates with `?color=` | Keeps 4 products as 4 products; the Shopify data model in `06-products.md` |
| Size chart modal with cm/in | **Yes**, built from the graded specs in the tech packs | Real numbers exist for every size |
| Model height and size worn | **No.** Garment measurements and fit notes instead | The model is generated; stating his height would be invented |
| Back-in-stock link on sold-out sizes | **Yes: "Hold my size"** | Drop model |
| Pre-order note with ship date | **Yes** (date set by the founder per drop) | Matches the production model (MOQ runs) |
| Free-shipping threshold, BNPL lines | **UI slots only**, hidden until the founder sets terms | No numbers yet |
| Accordions: details, FAQ, shipping & returns | **Yes:** Details · Fit & size · Care · Shipping & returns | |
| "You may also like" | **Yes:** the other three products | The whole capsule fits in one row |
| Reviews, AI review summary | **Not in v1.** Reserve the slot | No reviews before launch |
| Recently viewed | **No** | 4 products |
| Loyalty programme | **No.** "Stay dope" list sign-up instead | |
| Region and currency | **No.** USD only | US launch |
| Wishlist | **No** | 4 products |
| Search | **No** | 4 products |
| Account | **Link only**, to Shopify's hosted customer accounts | Shopify handles it |
| Cart drawer with popular items in the empty state | **Yes**: empty state shows the capsule | |
| Footer service links | **Yes:** Shipping, Returns, Size guide, FAQ, Contact; legal including an accessibility statement | |

## The photography feel to borrow

Tonal, quiet backgrounds; the product carries the color; on-body and still-life mixed; tight crops; a consistent model across a drop. Details: `07-photography.md`.
