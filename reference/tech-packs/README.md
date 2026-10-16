# Tech packs

Source of truth for every product fact on the site. Originals: `FastCoempany/dopeisgood`, release `techpacks` (pincord, needlecord and pant packs), and the thermal pack at `vendors/upwork/steph-thiel--apparel-design-and-development/files/` in the same repo. The two shirt packs are renamed here so they can be told apart (both carry style code AC-LSS-001).

| File | sha256 |
|---|---|
| `AC-LSS-001_Tech.Pack_Needlecord_REV1_10-15-26.pdf` | `dec7e0a6831d90bf…` |
| `AC-LSS-001_Tech.Pack_Pincord_REV1_10-15-26.pdf` | `02c1ddbc30d1cd52…` |
| `AC-LST-001_Tech.Pack_6-15-25.pdf` | `a6e57d02c3e10b5e…` |
| `AC-PNT-001_Tech.Pack_REV0_10-15-26_1.pdf` | `3122e6891beda4bd…` |

`renders/` holds key pages (exterior views, colorways, artwork) as WebP for quick viewing.
If a pack is revised, replace the PDF, run `python3 tools/extract_specs.py`, and update `content/products/<handle>.json`.
