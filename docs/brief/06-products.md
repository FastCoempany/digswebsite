# 06 · Products

Source of truth: the four tech packs in `reference/tech-packs/` (originals: `dopeisgood` repo, release `techpacks`, plus the thermal pack in `vendors/upwork/steph-thiel--apparel-design-and-development/files/`). Site-ready content is in `content/products/<handle>.json`; graded specs are extracted to `content/products/specs/<handle>.json` by `tools/extract_specs.py`. **Never invent a spec.** If something isn't in the pack, it isn't on the site.

## The capsule

| Handle | Name | Style | Pack | Colorway(s) | Key build facts |
|---|---|---|---|---|---|
| `thermal-long-sleeve` | Thermal Long Sleeve | AC-LST-001 | 6-15-25 (Steph Thiel) | Off White `#F4EEE8`, Sand Blue `#5B6FA7` | 100% cotton micro-waffle thermal, 215 gsm; 2×2 rib neck and cuffs; back yoke seam; digs embroidery at CB yoke, Bellwether Blue; relaxed, slight drop shoulder; ASUTE garment wash |
| `pincord-button-down` | Pincord Button-Down | AC-LSS-001 (pincord) | Rev 1, 10/15/26 | Mustard `#E2AF3F` (later: Tobacco, Olive, Washed Black, Ecru) | 100% cotton pincord; button-down collar; two mirrored chest pockets with buttoned bands; diagonal-cut barrel cuffs; box pleat + locker loop; shirttail hem; CB yoke embroidery + placket tag |
| `needlecord-shirt` | Needlecord Shirt | AC-LSS-001 (needlecord) | Rev 1, 10/15/26 | Light Grey `#D0CCCC` | Stretch 21-wale needlecord 99/1; point collar; one chest pocket; square barrel cuffs; front yoke seam; plain back; one-piece sleeve; placket tag only, no back embroidery |
| `drawstring-pant` | Drawstring Pant | AC-PNT-001 | Rev 0, 10/15/26 | Salmon `#CAA28C` (later: Olive, Navy) | 98/2 lyocell stretch twill, peached; flat front + elastic back; cotton drawstring through two antique-silver eyelets; faux fly; slant pockets; pointed back patch pockets; permanent 1½" turn-up cuff; woven patches on right back pocket + left cuff |

Sizes S–XL for all four (sample M). Measurements are inches, after garment wash. The pant's M fits a 32–34" waist.

Season on the site: **Capsule 01** (the packs say FW25 and FW27 TBC). Status on the site: **coming soon** until the founder sets pre-order dates and prices.

## Shopify data model (mock now, real later)

One Shopify **product per style**, with options **Color** and **Size**: 4 products and 20 variants in total (thermal 2×4 = 8; each other style 1×4 = 4).

| Shopify field | Value |
|---|---|
| `handle` | as in the table above |
| `title` | name (no colorway) |
| `productType` | Tops / Bottoms |
| `vendor` | digs |
| `tags` | `capsule-01`, `tops` or `bottoms`, status tag (`coming-soon`, `pre-order`) |
| `options` | Color, Size |
| `variant.sku` | `{style}-{COLOR}-{SIZE}`, e.g. `AC-LST-001-OFFWHITE-M`. The shirt SKUs wait for new style numbers (decision O2). |
| `variant.price` | null until O1 is decided |
| `variant.availableForSale` | false in this phase |
| metafield `digs.style_string` | `AC-LST-001 \| LONG SLEEVE TEE \| S–XL` |
| metafield `digs.fit` | fit note |
| metafield `digs.fabric` | list |
| metafield `digs.finish` | text |
| metafield `digs.details` | list |
| metafield `digs.care` | list (label copy) |
| metafield `digs.content` | fiber content line |
| metafield `digs.origin` | "Designed in USA. Imported." until O3 is decided |
| metafield `digs.built_like_this` | JSON: hotspots `{code, label, spec, where, view}` |
| metafield `digs.size_chart` | JSON reference to the spec rows shown to customers |
| metafield `digs.preorder_ship_date` | date, set per drop |
| metaobject `colorway` | name, swatch hex (screen reference), standard note, later colorways |

The mock data adapter (`app/lib/mock/`) must return objects in the **same shape as Storefront API responses** (`product { handle title options variants(first:) { nodes { id sku selectedOptions price { amount currencyCode } availableForSale image } } metafields(identifiers: [...]) }`). Swapping mock for the live Storefront API later then becomes a one-file change.

## Customer-facing size charts

| Product | Show (POM code → label) |
|---|---|
| Thermal | B Chest width (pit to pit) · A Body length (front, shoulder to hem) · D Shoulder · P Sleeve (shoulder to cuff) |
| Pincord | B Chest width · A Body length (back) · D Shoulder · P Sleeve (shoulder to cuff edge) |
| Needlecord | B Chest width · A2 Body length (back) · D Shoulder · P Sleeve (shoulder to cuff edge) |
| Pant | A Waist relaxed · A2 Waist stretched · B Hip · C Front rise · H Inseam · G Leg opening (all laid flat where marked) |

Half measurements (marked "1/2" in the pack) are shown as laid-flat widths and labelled that way; don't double them. Provide cm (×2.54, rounded to 0.5 cm) and inches (fractions as in the pack).

## Copy rules that come from the packs

- Pant fabric: say **"lyocell"**. Don't use TENCEL™ until digs holds a Lenzing licence (pack open item 3).
- Country of origin: "Designed in USA. Imported." The labels read "Made in China", but every pack says to confirm the factory's country.
- Care lines are the L2 label copy verbatim (in each product JSON).
- The thermal's change log records the first physical proto as off-spec (out of tolerance, missing topstitching). **Photos of that sample are not the product** and are not used.
