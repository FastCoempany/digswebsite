# Round 1 test shots (Oct 16 2026)

First four product shots of E (the cast), to check the pipeline before the rest of the shoot.

| Final (`out/`) | Product | What post did |
|---|---|---|
| `P-TLS-01-sand-blue.jpg` | Thermal Long Sleeve, Sand Blue, front | Color pulled to `#5B6FA7`; cropped 4:5 |
| `P-TLS-02-sand-blue.jpg` | Thermal Long Sleeve, Sand Blue, back | Color pulled to `#5B6FA7`; digs embroidery composited at center back yoke (2.5 in wide, Bellwether Blue); cropped 4:5 |
| `P-PBD-01-mustard.jpg` | Pincord Button-Down, Mustard, front | Color pulled to `#E2AF3F`; 11 buttons recolored tone-to-tone; L4 placket tag composited (1 x 3 in, dyed to match, logo 1 3/16 x 3/4 in, reading up); cropped 4:5 |
| `P-DSP-01-salmon.jpg` | Drawstring Pant, Salmon, front | Cropped 4:5 (color within range) |

`raw/` holds the generator's frames (Figma `generate_image`, `gpt-image-2.5-sunburst`, 960×1280). `recipes/` holds the post steps. Rerun with:

```
python3 tools/photo_post.py reference/photo-tests/round-1/recipes/*.json
```

These are previews for review, not approved site photography. Once the founder signs off, finals move to `assets/photography/` with a row in `MANIFEST.csv`.
