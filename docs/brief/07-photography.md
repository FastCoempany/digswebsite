# 07 · Photography

**Goal:** real-looking photography of one model wearing the four DIGS products, built from the exact tech-pack specs, in several angles and simple, striking scenes. No illustration, no cartoon, no lorem ipsum, no paper-craft. Represent is the muse for feel; BOAST is the muse for the brand's own frames.

## Hard rules

1. **No real people's likeness.** The model is an original, generated person who doesn't resemble any real individual. The reference photo the founder shared (a two-pocket corduroy shirt on a model, from the dopeisgood release) is another brand's product photo. Use it for **garment reference only**, never for the face or body, and never upload it to a generator. The only way that model could appear is his signed release, through the brand that shot him or his agency, covering AI-generated images.
2. **No third-party product photos, no BOAST placeholder photos** (BOAST marks its imagery as placeholder, not for commercial use), and no photos of the off-spec thermal proto.
3. **No generated lettering.** Image models garble type. Generate garments with the logo areas blank, then **composite the real digs artwork** (wordmark SVG with embroidery or woven texture) in post. The same applies to posters in scenes: composite real BOAST-system posters made from the SVGs.
4. **Spec beats aesthetics.** An image that looks great but shows the wrong collar, a missing pocket or extra buttons gets regenerated. Use the checklists below.
5. **Before taking orders**, compare every product image with the production sample and replace or retouch anything that differs. Customers get what the photo shows.

## Casting brief (original model)

- Man, late 20s to mid 30s, lean-athletic build with the proportions of a size M sample. Natural, unstyled grooming. A calm, magnetic, grounded presence: confident, not aloof. BOAST tiers: ambitious, bold, magnetic; grounded, humble, inclusive.
- **Casting round 1 (Oct 16 2026):** five original options in the same setup (Off White thermal, black trousers, ice seamless, soft overhead light) so only the person changes. A, B and C vary skin tone, hair texture and build. D and E are the type of the founder's reference photo (curly copper hair, freckles, lean, editorial attitude) with different faces, generated from text only. Files: `reference/casting/casting-{a..e}.webp`; Figma file "DIGS · Photography", left to right A–E. **The founder picked E.**
- **Model bible (E)**, reused word for word in every prompt: *a slim, tall man about 29 years old with fair skin and light freckles across his nose, cheeks, neck and the backs of his hands; loose copper-red curly hair that falls to about his ears, full on top; faint copper stubble; hazel eyes; straight light-brown brows; a calm, unsmiling, self-possessed expression.* Front product shots crop just below his mouth and back shots show his hair from behind, so the face lines only matter for editorials and the Edit-image frames.
- Optional later (decision O9): a second, female model to reflect "primarily men, inclusive of women".

## Looks

| Look | Pieces | Use |
|---|---|---|
| L1 | Thermal Long Sleeve (Sand Blue) + Drawstring Pant (Salmon) | Home hero, manifesto |
| L2 | Pincord Button-Down (Mustard), open over Thermal (Off White), + Drawstring Pant | Editorial, poster wall. Layering shows the founder's "hybrid" feel |
| L3 | Needlecord Shirt (Light Grey), buttoned, + Drawstring Pant | Blue frame, editorial |
| Off-capsule | Plain dark trousers or denim, white sneakers, no visible logos | Shirts' and thermal's own PDP sets, so every page doesn't lean on the salmon pant |

## Scenes (simple, striking)

| Code | Scene | Notes |
|---|---|---|
| S1 | **Cobalt seamless**: Digs Blue `#0042E5` paper backdrop, hard-edged studio light | The brand color in frame; hero and posters |
| S2 | **Ice cyc**: `#F0F5FF` infinity cove, soft overhead key | All PDP on-body sets: clean, Represent-like |
| S3 | **City overcast**: concrete, glass curtain wall, crossings; no readable signs, no brands, no identifiable landmarks | Blue frame, editorial; Chicago-feel without naming it |
| S4 | **Elevated platform**: steel and concrete train platform, late-afternoon flat light | Editorial |
| S5 | **Poster wall**: a blank wheat-paste hoarding; DIGS posters composited in post | Poster wall section |
| S6 | **Atelier**: the garment on a cream canvas dress form, plain warm-white wall, one-sided window light, tech-pack flats pinned up (composited) | "Built like this", manifesto page. The honest register |
| S7 | **Macro table**: fabric under raking sunlight on a white desk | Detail macros |

Light and grade: natural or soft studio, slightly flat and cool, near-monochrome environments. **The garment is the only color in the frame, except Digs Blue when it's the backdrop or frame.** Crops are tight and often off-centre; the model looks away or down as often as at camera.

## Shot list

Codes: `P-{product}-{nn}` product sets (`TLS` thermal, `PBD` pincord, `NCS` needlecord, `DSP` pant), `E-{nn}` editorial, `H-{nn}` hero.

| Code | Shot | Ratio | Scene |
|---|---|---|---|
| P-xx-01 | Front on-body, mid-thigh up (pant: full length) | 4:5 | S2 |
| P-xx-02 | Back on-body: L3 embroidery or back pocket patch visible | 4:5 | S2 |
| P-xx-03 | Three-quarter side, walking | 4:5 | S2 |
| P-xx-04 | Macro: fabric (waffle knit / pincord / needlecord / peached twill) | 4:5 | S7 |
| P-xx-05 | Macro: logo detail (embroidery / placket tag / cuff patch) | 4:5 | S7 |
| P-xx-06 | Garment alone: flat lay or on the dress form | 4:5 | S6 or top-down on paper |
| P-xx-07 | Editorial in a look | 4:5 | S1, S3 or S4 |
| H-01 | Hero: L1, full body, cut-out-able against S1, room for the wordmark | 9:16 + 16:9 | S1 |
| E-01 | L2 on the cobalt seamless, seated on an apple box | 4:5 | S1 |
| E-02 | L3 portrait for the blue frame | 4:5 | S3 |
| E-03..E-06 | Poster-wall, platform, atelier and street frames across L1–L3 | 4:5 / 3:4 | S3–S6 |

The thermal needs P-TLS-01 to 06 in **both** colorways (Off White and Sand Blue). That's about 36 product frames + 1 hero (2 crops) + 6 editorials ≈ **45 finals**; budget about 3 generations per final, spread across days to stay inside the free daily allowance.

Output: sRGB JPEG. The generator returns 960×1280 for portrait frames whatever size is requested (tested: a 1536×2048 request came back 960×1280), so 4:5 finals are 960×1200 after the crop. That covers the site at phone size and in grid cards; for a larger hero, Figma's "Boost image resolution" costs 5–10 credits an image, so use it on the hero only. Naming: `P-TLS-01-sand-blue.jpg`, `E-02.jpg`. Files go in `assets/photography/`, with a row per file in `assets/photography/MANIFEST.csv` (code, product, colorway, look, scene, prompt id, checked by, date).

## Accuracy checklists (from the tech packs)

**Thermal Long Sleeve (AC-LST-001)**: crewneck with a 1" 2×2 rib neckband; 2" rib cuffs; micro-waffle texture visible up close, smooth reverse; horizontal back yoke seam; digs embroidery **centered on the back yoke just below the neckband**, about 2.5" wide, **Bellwether Blue (deep navy), not Digs Blue**; relaxed body, slight drop shoulder, straight hem, no side slits; no front graphic, no pocket; Off White reads warm off-white, Sand Blue reads dusty mid-blue.

**Pincord Button-Down (AC-LSS-001 pincord)**: mustard pincord (fine wales); **button-down collar** with buttons at the points; box placket with 6 tone-to-tone buttons; **two mirrored chest pockets** with rounded corners and a buttoned band; barrel cuffs with **diagonal-cut corners**; tower sleeve placket; back: two-ply yoke, **box pleat at CB** and a locker loop; embroidery on the back yoke; vertical woven tag at the foot of the buttonhole placket, reading upward; shirttail hem, back longer than front.

**Needlecord Shirt (AC-LSS-001 needlecord)**: light grey 21-wale needlecord; **point collar, no collar buttons**; **one chest pocket on the wearer's left**, square corners; front yoke seam; **square** single-button barrel cuffs; plain back yoke, **no pleat, no loop, no back embroidery**; **one-piece sleeve** with no seam down the back of the arm; off-white corozo buttons; vertical woven tag at the foot of the placket; shirttail hem.

**Drawstring Pant (AC-PNT-001)**: salmon peached twill; flat front, **gathered elastic back**; cream cotton drawstring through **two antique-silver eyelets** at center front; **faux fly** (J-stitch, no zip pull); slant front pockets; **pointed back patch pockets**; woven patch on the **wearer's right back pocket**; woven patch on the **wearer's left cuff**, outside, near the outseam; **permanent 1½" turn-up cuff**; slim tapered leg, mid rise; **no belt loops**.

Common generation errors to reject: extra or missing buttons, pockets on the wrong side, belt loops appearing, invented logos or text, wrong collar type, plain cuffs where cut corners are specced, smooth fabric where waffle or wale is specced, mustard drifting to orange, salmon drifting to pink, embroidery drifting to bright blue, malformed hands.

## Pipeline (free routes only, no purchases)

1. **Generator: Figma `generate_image`, model `gpt-image-2.5-sunburst`** (Figma's ChatGPT Images model), on the Starter plan's included AI credits. 2 credits per image (Figma's rates as of Oct 15 2026; the Nano Banana models cost 6–16). At the monthly or daily cap, generation stops; nothing is charged. Never turn on pay-as-you-go or buy top-ups. Output has no visible watermark.
2. **Holding one face without a reference-image tool.** The generator is text-only, so a new prompt makes a new face. The fix is in the framing:
   - **Product sets** (P-xx-01 to 03): cropped chin-down, a standard e-commerce crop; hair, skin and build come from the model bible.
   - **Editorials:** the model looks away or down, turns his back, or sits in profile shadow, which is BOAST's own art direction.
   - **Hero and 2–3 face-forward frames:** made with Figma's "Edit image" on the chosen casting photo (same 2 credits), so it is the cast face. That runs in the Figma app, from prompts in the prompt pack.
3. **Casting:** done (round 1 above). Founder picks → model bible.
4. **Optional, face-matched references: the Gemini app, free (Nano Banana 2).** It takes reference photos and holds a face across images. Free-tier images carry a visible Gemini watermark, so they're for review and references only, never site images.
5. **Check** each image against its checklist; regenerate failures.
6. **Post** with `tools/photo_post.py` and a JSON recipe per image (`reference/photo-tests/round-1/recipes/` has 15): pull the garment to its cloth swatch (studio frames all the way; daylight editorials part of the way, so the scene's light holds), pull the cobalt seamless to Digs Blue, recolor parts the generator got wrong (tone-to-tone buttons), clone out details that break spec (a collar button on a point collar), composite the real digs artwork (back-yoke embroidery, woven placket tag, woven patch, wrapped around a cuff where it sits near a seam) at the tech-pack placement, crop to ratio. A polygon region keeps a color pull off skin next to the salmon pant.
7. **Export** to `assets/photography/`, log in `MANIFEST.csv`; later upload to Shopify Files.
8. **Free stock** (Unsplash, Pexels) only for empty environment plates if a scene needs one. No people, no brands; record the URL and license in `assets/photography/CREDITS.md`.
9. **Disclosure:** until real photos of production samples replace them, the site carries a line under the gallery: "Images are previews made from the tech pack."

## Round 1 (Oct 16 2026)

**15 finals** of E in `reference/photo-tests/round-1/out/` (raw frames, recipes and a table of what post did per file in the same folder):
- **1a, the pipeline test:** Thermal Sand Blue front and back, Pincord front, Drawstring Pant front.
- **1b, the rest of what the UI needs first:** Thermal Off White front and back, Pincord back, Needlecord front and back, Drawstring Pant back, H-01 (9:16 and 16:9), E-01, E-02, E-03.

Every product and colorway now has P-xx-01 and P-xx-02.

What the generator got wrong, and the fix:
- Garment colors drift: Sand Blue greyer, Mustard darker, Light Grey a full step darker (it reads mid grey), Salmon pinker (hue about 35° against the swatch's 56°) → pulled to the swatch in post. Studio frames land within ΔE 1.2 of swatch-minus-shading; the platform editorial moves part of the way so it still looks like daylight. The 1a pant front was re-posted to match the corrected back.
- The cobalt seamless comes out duller than Digs Blue (ΔE about 25) → pulled to `#0042E5`, so the hero sits flush on a Digs Blue page.
- Pincord buttons come out off-white or brown → recolored tone-to-tone.
- Needlecord gets a button-down collar or clipped pocket corners → the front was regenerated with the pocket spelled out; in E-02 the two collar buttons are cloned out.
- A recognizable skyline landmark showed up behind the platform frame → regenerated with "no skyline, no recognizable buildings". Keep that line in every outdoor prompt.
- The generator draws jeans-style back pockets with double topstitching on the pant. The pack's pointed patch pocket with 1/16" + 1/4" topstitch is close enough for previews.
- Still open from 1a: pincord cuffs show square corners, not the ¾" diagonal cut (show it in the P-PBD-05 cuff detail); pincord and needlecord plackets read wider than 1¼" (fix on the production photos).

Not shown yet: the pant's cuff patch from behind (it sits in front of the outseam, so back views can't show it) and the needlecord placket tag in E-02 (the placket foot is edge-on). The hero is 1536 px wide; for a sharp 2x desktop hero, run Figma's "Boost image resolution" on H-01 only (5–10 credits).

## Credit budget

500 credits a month, 150 a day, 2 credits per image: **250 images a month, 75 a day.**

| Round | What | Finals | Generations (~3 per final) | Credits |
|---|---|---|---|---|
| 0 | Casting A–E (done Oct 16) | — | 5 | 10 |
| 1a | Round 1 test: P-TLS-01/02 Sand Blue, P-PBD-01, P-DSP-01 (done Oct 16) | 4 | 4 | 8 |
| 1b | H-01 (2 frames); P-xx-01 and P-xx-02 for the remaining product/colorways; E-01, E-02, E-03 (done Oct 16) | 11 | 13 (11 + 2 retakes) | 26 |
| 2 | Everything else on the shot list: side views, macros, flats, remaining editorials | ~31 | ~93 | ~186 |
| | **Total** | **~46** | **~115** | **~230** |

Used so far: **22 images, 44 credits** (at 2 credits each). Round 1b came in well under its estimate because most frames passed on the first try and post fixed color, buttons and logos without regenerating.

The 2-credit figure assumes `gpt-image-2.5-sunburst` is the model Figma bills as ChatGPT Images; it's the only OpenAI model the Figma connector offers. **Check:** the AI balance should show 44 credits used after round 1. If it shows more, redo this table before round 2.

That leaves about 270 credits in the month after round 2 for retakes, Edit image runs and the hero boost. Each round fits inside one day's cap. If Figma changes its rates, recheck this table before a round starts; check the balance in a file's main menu under **AI balance**.

Not used: Figma Weave (separate account, small free allowance, per-run approvals) and any paid model.
