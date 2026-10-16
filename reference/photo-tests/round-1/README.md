# Round 1 photography (Oct 16 2026)

Fifteen finals of E (the cast): the product front and back for every product and colorway, the home hero in two crops, and three editorials. Round 1a (the first four test shots) checked the pipeline; round 1b is the rest of what the UI needs first.

| Final (`out/`) | What it shows | What post did |
|---|---|---|
| `P-TLS-01-sand-blue.jpg` | Thermal Long Sleeve, Sand Blue, front | Color pulled to `#5B6FA7`; cropped 4:5 |
| `P-TLS-02-sand-blue.jpg` | Thermal Long Sleeve, Sand Blue, back | Color pulled to `#5B6FA7`; digs embroidery at center back yoke (2.5 in wide, Bellwether Blue); cropped 4:5 |
| `P-TLS-01-off-white.jpg` | Thermal Long Sleeve, Off White, front | Color within range; cropped 4:5 |
| `P-TLS-02-off-white.jpg` | Thermal Long Sleeve, Off White, back | Embroidery at center back yoke, just below the neckband; cropped 4:5 |
| `P-PBD-01-mustard.jpg` | Pincord Button-Down, Mustard, front | Color pulled to `#E2AF3F`; 11 buttons recolored tone-to-tone; L4 placket tag (1 x 3 in, dyed to match, logo 1 3/16 x 3/4 in, reading up); cropped 4:5 |
| `P-PBD-02-mustard.jpg` | Pincord Button-Down, Mustard, back | Color pulled to `#E2AF3F`; 5 cuff and sleeve-placket buttons recolored tone-to-tone; L3 embroidery on the outer back yoke, top edge 1 1/2 in below the neck seam; cropped 4:5 |
| `P-NCS-01-light-grey.jpg` | Needlecord Shirt, Light Grey, front | Color pulled to `#D0CCCC`; L3 placket tag, bottom edge 1 in above the hem; cropped 4:5 |
| `P-NCS-02-light-grey.jpg` | Needlecord Shirt, Light Grey, back | Color pulled to `#D0CCCC` (no back logo, per the pack); cropped 4:5 |
| `P-DSP-01-salmon.jpg` | Drawstring Pant, Salmon, front | Color pulled to `#CAA28C`; L3 patch on the wearer's left cuff, 1/2 in in front of the outseam, wrapped around the cuff; cropped 4:5 |
| `P-DSP-02-salmon.jpg` | Drawstring Pant, Salmon, back | Color pulled to `#CAA28C`; L3 patch on the wearer's right back pocket, 3/4 in below the pocket top; cropped 4:5 |
| `H-01-9x16.jpg` | Hero, L1 on the cobalt seamless, 720×1280 | Thermal and pant pulled to their swatches, backdrop pulled to Digs Blue `#0042E5`; back-yoke embroidery and back-pocket patch; one stray mark on the pocket cloned out; cropped 9:16 |
| `H-01-16x9.jpg` | Hero, wide, 1536×864 | Same as the 9:16, from its own frame; the left side is clear for the wordmark |
| `E-01.jpg` | L2 seated on an apple box, cobalt seamless | Pincord pulled to `#E2AF3F`, backdrop to Digs Blue; 5 buttons recolored tone-to-tone; cropped 4:5 |
| `E-02.jpg` | L3, city overcast | Exposure lifted (the light grey read mid grey); pant pulled to `#CAA28C`; the two collar-point buttons the generator added are cloned out (the pack specs a point collar); cropped 4:5 |
| `E-03.jpg` | L1 on an elevated platform | Thermal and pant moved part of the way to their swatches (daylight keeps the scene's light); back-yoke embroidery and back-pocket patch; cropped 4:5 |

Retakes in round 1b: E-03 was regenerated because the first frame had a recognizable skyline landmark; the needlecord front was regenerated because the first frame's pocket had clipped corners (the pack says square). The first frames are not kept.

Not composited, on purpose: the pant's cuff patch on back views (it sits in front of the outseam, out of sight from behind), and the needlecord placket tag in E-02 (the placket foot is edge-on there).

`raw/` holds the generator's frames (Figma `generate_image`, `gpt-image-2.5-sunburst`, 960×1280 portrait, 1536×864 wide). `recipes/` holds the post steps, with every placement and color in the open. Rerun with:

```
python3 tools/photo_post.py reference/photo-tests/round-1/recipes/*.json
```

These are previews for review, not approved site photography. Once the founder signs off, finals move to `assets/photography/` with a row in `MANIFEST.csv`.
