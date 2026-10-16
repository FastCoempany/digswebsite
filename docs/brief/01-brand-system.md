# 01 · Brand system

Sources: BOAST style guide (`Digs_styleguide_boast.pdf`, Sep 2024, 38 pp), BOAST brand strategy (`DIGs-brand-strategy.pdf`, 53 pp), the founder's own strategy answers (`Brand strategy WIP - Antaeus Coe.pdf`), the BOAST working files (logo kit, patterns, Sept 2024 design file, social templates). All live in the `dopeisgood` repo releases (`BRANDING.FILES.zip`). Rendered key pages are in `reference/boast/`.

> The photography inside the BOAST files is stock placeholder. BOAST's own note says it must not be used externally or commercially. None of it goes on the site.

## 1. What DIGS is

- **Name:** digs, always lowercase in the wordmark. It stands for **D**ope **I**s **G**ood; "dope is good" is the ethos line.
- **Positioning (BOAST):** a cult fashion brand that leads the market in high-quality streetwear for refined lifestyles.
- **Mission (BOAST):** become a cult streetwear brand that redefines cultural perceptions and inspires a new generation of dreamers and achievers. Redefine what it means to be "dope".
- **Archetype:** the Outlaw: disruptive and rebellious, balanced with effortless sophistication.
- **Personality.** Tier one: ambitious, bold, magnetic. Tier two: grounded, humble, inclusive. More inspiring than self-righteous; more warm and welcoming than cheeky or weird; more millennial than Gen Z; proud of success, never hiding it.
- **Audience:** primarily men, inclusive of women, 25 to 49. Professionals, creatives, entrepreneurs. US cities, **Chicago first**.
- **Founder's voice** (from his own strategy answers, and the part that makes DIGS more than template streetwear): *rough refinement*, *quiet effectiveness* ("impact felt rather than seen"), *tonal depth and texture*, *bold simplicity*, *elegance in utility*, garments with a hybrid feel.
- **Manifestos (BOAST):** 1 Unapologetically Dope · 2 Celebrate the Journey · 3 Innovate and Inspire · 4 Quality Above All.
- **Values:** excellence, authenticity (including pre-orders and long-lasting pieces to cut waste), ambition, innovation (on-demand production), empowerment.

## 2. Identity

| Asset | File(s) | Rule |
|---|---|---|
| Wordmark | `brand/logos/wordmark/digs-wordmark-{black,blue,white}.svg` | Lowercase geometric sans, circular bowls, tight tracking. The i-dot sits high, so a tight setting reads `d!gs`. "White" files are ice `#F0F5FF`, not pure white. |
| Primary lockup: wordmark + "Actually Dope" scrawl | `brand/logos/lockup/lockup-{inline,stacked}-*.svg` | BOAST: use the lockup wherever possible, ahead of the wordmark alone. The scrawl crosses the wordmark at about −8° to −10°; the two interfere on purpose. |
| Brandmark ("DD") | `brand/logos/brandmark/digs-brandmark-*.svg` | Marker monogram. Favicon, stickers, small spaces, packaging. |
| Solo D variants | `brand/logos/solo-d/*.png` | Raster only. Social avatars; not for the site UI. |

Lockup color pairs (file name says wordmark color, then scrawl color):

| Background | Lockup |
|---|---|
| Ice or white | `*-black-wordmark-blue-scrawl` |
| Digs Blue | `inline-white-wordmark-black-scrawl` or `stacked-black-wordmark-white-scrawl` |
| Black | `*-white-wordmark-blue-scrawl` or `stacked-blue-wordmark-white-scrawl` |

Clear space: wordmark uses the width of its own `s`; brandmark uses the center void of the DD; in use, keep half the brandmark's height around the mark. Never stretch, rotate (except the scrawl's built-in angle), recolor outside the palette, or set on imagery where it can't be read. BOAST: **do place the wordmark at the bottom of the page, edge to edge, for graphic impact.**

## 3. Color

BOAST's palette is three values: **Black `#000000`, Digs Blue `#0042E5`, Ice `#F0F5FF`.** "The palette pairs a light blue background with a strong black and blue… Color is largely celebrated through photography and type." A store needs more than three values, so the palette is extended in four layers. Every derived color is hue-locked to Digs Blue in OKLCH, so the system still reads as one blue family. This answers the founder's "tonal depth… subtle gradations of a single color".

| Layer | Tokens | Job | Rule |
|---|---|---|---|
| **Core** | `ink`, `digs-blue`, `ice` (+ `paper` #FFFFFF) | Identity | Never altered. Ice is the page ground; paper is for raised surfaces (drawers, product image wells). |
| **Tonal blue** | `blue-50…950` (Digs Blue = 600; blue-50 is exactly ice) | Hover/pressed states, tints, focus, brand graphics | The only accent family. |
| **Ink neutrals** | `ink-50…950`, cool, blue-tinted | Borders, secondary text, disabled, sunken surfaces | Never a pure grey. |
| **Signal** | `sale`, `success`, `low-stock` (+ tints) | State only: sale price, error, in stock, low stock | Small, functional, never decorative, never on a logo. |
| **Cloth** | one token per colorway, from the tech packs | Swatches and product contexts only | Hex values are screen references; the approved physical swatch (D65) is the standard. |

Components use **semantic roles** (`--color-surface-page`, `--color-text-primary`, `--color-action-primary`…), never raw hex. Source: `design/tokens/tokens.color.json`; generated CSS in `design/tokens/build/`. The palette sheet is `design/tokens/palette.png`.

**Hard contrast rules** (full table: `design/tokens/contrast-report.md`; every pair the UI renders passes WCAG 2.2 AA):

- **Never black text on Digs Blue, never Digs Blue text on black.** 2.91:1 fails even large text. On blue, text is ice or white (6.6–7.2:1). On black, blue is graphic only (scrawl, frames, patterns, the DD).
- Primary buttons: Digs Blue fill, ice text. Secondary: black fill, ice text. Links: Digs Blue, underlined.
- Form-control borders use `ink-500` (≥3:1 against ice and white).
- Light colorway swatches (off-white, light grey, mustard, salmon) disappear on ice. **Every swatch gets an `ink-300` keyline.** The selected state is a 2px ink ring with a 2px gap.
- Focus: 2px Digs Blue ring with 2px offset; on blue or black surfaces, an ice ring.

## 4. Type

| Role | Face | Setting |
|---|---|---|
| Display and headlines | **Alexandria Regular** | Tight leading 0.92–0.98, slight negative tracking. Caps headlines can fill the frame edge to edge, breaking words to fill the measure. |
| Body | **Alexandria Regular** | 16px min, 1.5 leading. |
| UI labels, buttons, prices ≤14px | Alexandria Medium | Strategist extension: Regular is too thin at small sizes on screen. Same family, so it stays inside the BOAST rule of no other typeface. |
| Script payoff words | **The Old Falcons** | One or two words per line, inside an otherwise-sans sentence ("Wear your *story*", "Dope is *good*"). Rendered as SVG with `tools/script_svg.py`; the font file is never served. |

BOAST rules: no other typeface for any communication; left, right or centre aligned, **never full-justified**. Alexandria ships self-hosted from `brand/fonts/alexandria/` (variable, OFL). The type scale is in `design/tokens/tokens.base.json`.

## 5. Motifs: the DIGS equivalents of PJ's attitude

1. **Scrawl over type.** Blue or black marker handwriting laid across clean sans type: the lockup, "fashion" written over a headline, a word struck through and rewritten. This is DIGS's texture layer and replaces PJ's halftone.
2. **The `d!gs` dot.** The high round i-dot used as punctuation, a bullet, a loading dot, a cursor.
3. **DD stickers.** The brandmark slapped at an angle on product tiles and section edges.
4. **Wordmark wallpaper.** Four BOAST patterns in `brand/patterns/` (stacked ice-on-blue; "Actually Dope" scrawl blue-on-black; two digs wallpapers blue-on-black). Rebuild them in CSS or SVG at build time; the WebP files are references.
5. **Blue frame.** BOAST billboard: a photograph inside a solid Digs Blue border, headline top-left in Alexandria, wordmark bottom-left, stacked footer right (`@dopeisgood / dopeisgood.com / Designed in USA`).
6. **Poster grid.** Wheat-pasted posters, one idea and one color each.
7. **Tech-pack grammar.** The tech packs' own visual language: black flats, hairline rules, pipe-separated style strings (`AC-LST-001 | LONG SLEEVE TEE | S-XL`), red leader lines to caps callouts, coded trim tokens (L1, L3, L4). On the site this becomes the **"Built like this"** section and product hotspots. It is DIGS's proof of *Quality Above All*, and nobody else in streetwear uses it as a design language.
8. **Edge-to-edge wordmark at the foot of every page** (BOAST's own "do").

## 6. Imagery tone

From BOAST's art direction and the founder's notes: city light, slightly flat and cool, near-monochrome frames where **Digs Blue is the only saturated thing in the shot**; tight, off-centre crops; the model often looking away or down; concrete, glass, corrugated shutters, crossings. Interleave clean product-on-object frames and macro texture (waffle knit, wale, woven tag, stitching). Product color comes through in the clothes themselves. Full brief: `07-photography.md`.
